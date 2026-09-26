import { describe, expect, it } from 'vitest';

import type { LegalDocument, NewsArticle } from './contracts';
import {
  evaluateLegalPublication,
  evaluateLocalizedPublication,
  isPublishedNewsArticle,
} from './content-governance';

const source = {
  sourceId: 'cms-1',
  sourceType: 'cms' as const,
  retrievedAt: '2026-01-01T00:00:00.000Z',
  effectiveFrom: '2026-01-01T00:00:00.000Z',
};
const localized = (value: string) => ({ defaultLocale: 'en' as const, values: { en: value } });

function newsArticle(): NewsArticle {
  return {
    id: 'news-1',
    kind: 'news-article',
    slug: 'approved-story',
    context: { locale: 'en', market: 'au' },
    status: { locale: 'en', status: 'published' },
    seo: {
      title: localized('Story'),
      description: localized('Story'),
      canonicalPath: '/en/au/news/approved-story',
      hreflang: [],
    },
    source,
    title: localized('Story'),
    author: localized('Author'),
    publishedAt: '2026-01-02T00:00:00.000Z',
    media: [],
    relatedContent: [],
    sections: [],
  };
}

function legalDocument(): LegalDocument {
  return {
    id: 'privacy-1',
    kind: 'legal-document',
    documentType: 'privacy',
    version: '2026.1',
    effectiveAt: '2026-01-01T00:00:00.000Z',
    legalApproval: { status: 'approved', owner: 'legal', approvedAt: '2026-01-01T00:00:00.000Z' },
    context: { locale: 'en', market: 'au' },
    status: { locale: 'en', status: 'published' },
    seo: {
      title: localized('Privacy'),
      description: localized('Privacy'),
      canonicalPath: '/en/au/privacy',
      hreflang: [],
    },
    source,
    sections: [],
  };
}

describe('content governance', () => {
  it('keeps scheduled or wrong-locale content out of public output', () => {
    expect(
      evaluateLocalizedPublication({ ...newsArticle(), status: { locale: 'en', status: 'draft' } }),
    ).toEqual({
      visible: false,
      reason: 'not-public',
    });
    expect(
      evaluateLocalizedPublication({
        ...newsArticle(),
        status: { locale: 'zh-Hans', status: 'published' },
      }),
    ).toEqual({
      visible: false,
      reason: 'wrong-locale',
    });
  });

  it('requires news fields and legal approval before publication', () => {
    expect(isPublishedNewsArticle(newsArticle())).toBe(true);
    expect(evaluateLegalPublication(legalDocument())).toEqual({
      publishable: true,
      reason: 'approved',
    });
    expect(
      evaluateLegalPublication({
        ...legalDocument(),
        legalApproval: { status: 'pending', owner: 'legal' },
      }),
    ).toEqual({
      publishable: false,
      reason: 'not-approved',
    });
  });
});
