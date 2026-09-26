import type { Article, LocalizedText, MarketLocaleContext, MediaAsset } from '@eal/domain';

export const technologyTopicSlugs = [
  '800v-architecture',
  'battery-charging',
  'intelligent-driving',
  'software-connectivity',
  'energy-ecosystem',
  'safety',
] as const;

export type TechnologyTopicSlug = (typeof technologyTopicSlugs)[number];

export interface TechnologyTopicDefinition {
  readonly slug: TechnologyTopicSlug;
  readonly visualMode: 'energy-flow' | 'diagram' | 'interface' | 'editorial';
  readonly requiresApprovedStructuredData: boolean;
}

export const technologyTopics: readonly TechnologyTopicDefinition[] = [
  {
    slug: '800v-architecture',
    visualMode: 'energy-flow',
    requiresApprovedStructuredData: true,
  },
  {
    slug: 'battery-charging',
    visualMode: 'diagram',
    requiresApprovedStructuredData: true,
  },
  {
    slug: 'intelligent-driving',
    visualMode: 'diagram',
    requiresApprovedStructuredData: true,
  },
  {
    slug: 'software-connectivity',
    visualMode: 'interface',
    requiresApprovedStructuredData: true,
  },
  {
    slug: 'energy-ecosystem',
    visualMode: 'editorial',
    requiresApprovedStructuredData: true,
  },
  {
    slug: 'safety',
    visualMode: 'editorial',
    requiresApprovedStructuredData: true,
  },
] as const;

export type TechnologyArticleSelection =
  | {
      readonly state: 'ready';
      readonly article: Article;
      readonly title: string;
    }
  | {
      readonly state: 'pending';
      readonly reason:
        | 'missing'
        | 'wrong-topic'
        | 'wrong-context'
        | 'unpublished'
        | 'outside-effective-window'
        | 'missing-localization';
    };

export type ApprovedMediaSelection =
  | {
      readonly state: 'ready';
      readonly asset: MediaAsset;
      readonly alt: string;
      readonly sourceUrl: string;
    }
  | {
      readonly state: 'fallback';
      readonly reason:
        | 'missing'
        | 'not-approved'
        | 'rights-not-cleared'
        | 'missing-source'
        | 'wrong-market'
        | 'wrong-locale'
        | 'unsupported-kind'
        | 'missing-alt';
    };

export interface Media360Frame {
  readonly id: string;
  readonly angleDegrees: number;
  readonly media: MediaAsset;
}

export interface Media360FrameSet {
  readonly id: string;
  readonly poster: MediaAsset;
  readonly frames: readonly Media360Frame[];
}

export type Media360FrameSetSelection =
  | {
      readonly state: 'ready';
      readonly id: string;
      readonly poster: ApprovedMediaSelection & { readonly state: 'ready' };
      readonly frames: readonly (Media360Frame & {
        readonly resolved: ApprovedMediaSelection & { readonly state: 'ready' };
      })[];
    }
  | {
      readonly state: 'fallback';
      readonly reason: 'missing-poster' | 'not-enough-frames' | 'invalid-frame';
    };

export function isTechnologyTopicSlug(value: string): value is TechnologyTopicSlug {
  return technologyTopicSlugs.includes(value as TechnologyTopicSlug);
}

export function getTechnologyTopic(slug: string): TechnologyTopicDefinition | undefined {
  return technologyTopics.find((topic) => topic.slug === slug);
}

/**
 * Rejects an article before it reaches a page when locale, market, status, or
 * approved effective window is unsafe. This remains provider-neutral: CMS
 * adapters supply an Article; route code consumes this selection.
 */
export function selectTechnologyArticle(
  article: Article | undefined,
  context: MarketLocaleContext,
  slug: TechnologyTopicSlug,
  now = new Date(),
): TechnologyArticleSelection {
  if (article === undefined) {
    return { state: 'pending', reason: 'missing' };
  }
  if (article.kind !== 'technology-article' || article.slug !== slug) {
    return { state: 'pending', reason: 'wrong-topic' };
  }
  if (article.context.locale !== context.locale || article.context.market !== context.market) {
    return { state: 'pending', reason: 'wrong-context' };
  }
  if (article.status.locale !== context.locale || article.status.status !== 'published') {
    return { state: 'pending', reason: 'unpublished' };
  }
  if (!isWithinEffectiveWindow(article.source, now)) {
    return { state: 'pending', reason: 'outside-effective-window' };
  }

  const title = localizedValueFor(article.title, context.locale);
  return title === undefined
    ? { state: 'pending', reason: 'missing-localization' }
    : { state: 'ready', article, title };
}

/**
 * Accepts rendered media only when it is explicitly approved, rights-cleared,
 * localized, market-safe, and source-backed. The result intentionally carries
 * a fallback reason instead of substituting unrelated media.
 */
export function selectApprovedMedia(
  asset: MediaAsset | undefined,
  context: MarketLocaleContext,
  supportedKinds: readonly MediaAsset['kind'][] = ['image'],
): ApprovedMediaSelection {
  if (asset === undefined) {
    return { state: 'fallback', reason: 'missing' };
  }
  if (asset.status !== 'approved') {
    return { state: 'fallback', reason: 'not-approved' };
  }
  if (asset.rights.status !== 'cleared') {
    return { state: 'fallback', reason: 'rights-not-cleared' };
  }
  if (asset.sourceUrl === undefined || asset.sourceUrl.length === 0) {
    return { state: 'fallback', reason: 'missing-source' };
  }
  if (asset.markets !== undefined && !asset.markets.includes(context.market)) {
    return { state: 'fallback', reason: 'wrong-market' };
  }
  if (asset.locale !== undefined && asset.locale !== context.locale) {
    return { state: 'fallback', reason: 'wrong-locale' };
  }
  if (!supportedKinds.includes(asset.kind)) {
    return { state: 'fallback', reason: 'unsupported-kind' };
  }

  const alt = localizedValueFor(asset.alt, context.locale);
  return alt === undefined
    ? { state: 'fallback', reason: 'missing-alt' }
    : { state: 'ready', asset, alt, sourceUrl: asset.sourceUrl };
}

/**
 * A 360 experience is optional. It never becomes active without a distinct
 * approved poster and at least two approved, correctly scoped image frames.
 */
export function selectMedia360FrameSet(
  frameSet: Media360FrameSet | undefined,
  context: MarketLocaleContext,
): Media360FrameSetSelection {
  if (frameSet === undefined) {
    return { state: 'fallback', reason: 'missing-poster' };
  }

  const poster = selectApprovedMedia(frameSet.poster, context, ['image']);
  if (poster.state !== 'ready') {
    return { state: 'fallback', reason: 'missing-poster' };
  }
  if (frameSet.frames.length < 2) {
    return { state: 'fallback', reason: 'not-enough-frames' };
  }
  if (frameSet.frames.some((frame) => frame.media.id === poster.asset.id)) {
    return { state: 'fallback', reason: 'invalid-frame' };
  }

  const frames = frameSet.frames.map((frame) => ({
    ...frame,
    resolved: selectApprovedMedia(frame.media, context, ['image']),
  }));
  const frameIds = new Set(frames.map((frame) => frame.id));
  const angles = new Set(frames.map((frame) => frame.angleDegrees));

  if (
    frames.some(
      (frame) => !Number.isFinite(frame.angleDegrees) || frame.resolved.state !== 'ready',
    ) ||
    frameIds.size !== frames.length ||
    angles.size !== frames.length
  ) {
    return { state: 'fallback', reason: 'invalid-frame' };
  }

  return {
    state: 'ready',
    id: frameSet.id,
    poster,
    frames: frames as readonly (Media360Frame & {
      readonly resolved: ApprovedMediaSelection & { readonly state: 'ready' };
    })[],
  };
}

export function localizedValueFor(value: LocalizedText, locale: MarketLocaleContext['locale']) {
  const candidate = value.values[locale];
  return candidate === undefined || candidate.trim().length === 0 ? undefined : candidate;
}

function isWithinEffectiveWindow(
  source: { readonly effectiveFrom?: string; readonly effectiveTo?: string },
  now: Date,
): boolean {
  const timestamp = now.getTime();
  const effectiveFrom =
    source.effectiveFrom === undefined ? undefined : new Date(source.effectiveFrom);
  const effectiveTo = source.effectiveTo === undefined ? undefined : new Date(source.effectiveTo);

  if (
    (effectiveFrom !== undefined && Number.isNaN(effectiveFrom.getTime())) ||
    (effectiveTo !== undefined && Number.isNaN(effectiveTo.getTime()))
  ) {
    return false;
  }

  return (
    (effectiveFrom === undefined || effectiveFrom.getTime() <= timestamp) &&
    (effectiveTo === undefined || effectiveTo.getTime() >= timestamp)
  );
}
