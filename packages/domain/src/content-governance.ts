import type {
  Article,
  ContentBase,
  LegalDocument,
  NewsArticle,
  PublicationStatus,
} from './contracts';

export interface PublicationEvaluation {
  readonly visible: boolean;
  readonly reason: 'published' | 'scheduled' | 'not-public' | 'wrong-locale' | 'expired' | 'future';
}

export interface LegalPublicationEvaluation {
  readonly publishable: boolean;
  readonly reason:
    | 'approved'
    | 'missing-approval'
    | 'not-approved'
    | 'expired-approval'
    | 'not-effective'
    | 'expired-publication';
}

const PUBLICATION_STATUSES: readonly PublicationStatus[] = ['published', 'scheduled'];

/**
 * Applies the same publication gate to news, technology and page content.
 * Draft, translation and review states never become public by accident.
 */
export function evaluatePublication(content: ContentBase, now = new Date()): PublicationEvaluation {
  if (!PUBLICATION_STATUSES.includes(content.status.status)) {
    return { visible: false, reason: 'not-public' };
  }

  const nowMs = now.getTime();
  const effectiveFrom = content.source.effectiveFrom;
  const effectiveTo = content.source.effectiveTo;

  if (content.status.status === 'scheduled' && effectiveFrom === undefined) {
    return { visible: false, reason: 'future' };
  }
  if (effectiveFrom !== undefined && Date.parse(effectiveFrom) > nowMs) {
    return { visible: false, reason: 'future' };
  }
  if (effectiveTo !== undefined && Date.parse(effectiveTo) < nowMs) {
    return { visible: false, reason: 'expired' };
  }

  return {
    visible: true,
    reason: content.status.status === 'scheduled' ? 'scheduled' : 'published',
  };
}

export function evaluateLocalizedPublication(
  content: ContentBase,
  now = new Date(),
): PublicationEvaluation {
  if (content.status.locale !== content.context.locale) {
    return { visible: false, reason: 'wrong-locale' };
  }
  return evaluatePublication(content, now);
}

/** Legal content has an additional approval gate beyond normal publication. */
export function evaluateLegalPublication(
  document: LegalDocument,
  now = new Date(),
): LegalPublicationEvaluation {
  const approval = document.legalApproval;
  if (approval === undefined) {
    return { publishable: false, reason: 'missing-approval' };
  }
  if (approval.status === 'expired') {
    return { publishable: false, reason: 'expired-approval' };
  }
  if (approval.status !== 'approved') {
    return { publishable: false, reason: 'not-approved' };
  }

  const nowMs = now.getTime();
  if (Date.parse(document.effectiveAt) > nowMs) {
    return { publishable: false, reason: 'not-effective' };
  }

  const publication = evaluateLocalizedPublication(document, now);
  if (!publication.visible) {
    return { publishable: false, reason: 'expired-publication' };
  }

  return { publishable: true, reason: 'approved' };
}

export function isPublishedNewsArticle(
  article: NewsArticle | Article,
  now = new Date(),
): article is NewsArticle {
  return (
    article.kind === 'news-article' &&
    'author' in article &&
    'publishedAt' in article &&
    'media' in article &&
    'relatedContent' in article &&
    evaluateLocalizedPublication(article, now).visible
  );
}
