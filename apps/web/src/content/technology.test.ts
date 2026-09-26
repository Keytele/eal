import { describe, expect, it } from 'vitest';

import type {
  Article,
  LocalizedText,
  MarketLocaleContext,
  MediaAsset,
  SourceAttribution,
} from '@eal/domain';

import {
  getTechnologyTopic,
  selectApprovedMedia,
  selectMedia360FrameSet,
  selectTechnologyArticle,
} from './technology';

const context: MarketLocaleContext = { locale: 'en', market: 'au' };
const source: SourceAttribution = {
  sourceId: 'approved-content',
  sourceType: 'cms',
  retrievedAt: '2026-01-01T00:00:00.000Z',
  effectiveFrom: '2026-01-01T00:00:00.000Z',
  effectiveTo: '2026-12-31T23:59:59.000Z',
};

function localized(value: string): LocalizedText {
  return { defaultLocale: 'en', values: { en: value, 'zh-Hans': value } };
}

function approvedImage(id: string): MediaAsset {
  return {
    id,
    status: 'approved',
    kind: 'image',
    sourceUrl: 'https://assets.invalid/' + id + '.jpg',
    alt: localized('Approved media'),
    tags: [],
    markets: ['au'],
    rights: { status: 'cleared' },
  };
}

function approvedArticle(): Article {
  return {
    id: 'technology-article',
    kind: 'technology-article',
    slug: '800v-architecture',
    context,
    status: { locale: 'en', status: 'published' },
    seo: {
      title: localized('Approved title'),
      description: localized('Approved description'),
      canonicalPath: '/en/au/technology/800v-architecture',
      hreflang: [],
    },
    source,
    title: localized('Approved title'),
    sections: [],
  };
}

describe('technology content boundaries', () => {
  it('uses only an approved, localized, market-safe technology article', () => {
    expect(
      selectTechnologyArticle(
        approvedArticle(),
        context,
        '800v-architecture',
        new Date('2026-06-01T00:00:00.000Z'),
      ),
    ).toMatchObject({ state: 'ready', title: 'Approved title' });

    expect(
      selectTechnologyArticle(
        { ...approvedArticle(), status: { locale: 'en', status: 'draft' } },
        context,
        '800v-architecture',
        new Date('2026-06-01T00:00:00.000Z'),
      ),
    ).toEqual({ state: 'pending', reason: 'unpublished' });
  });

  it('does not substitute media outside its approved market', () => {
    expect(selectApprovedMedia(approvedImage('approved'), context)).toMatchObject({
      state: 'ready',
      sourceUrl: 'https://assets.invalid/approved.jpg',
    });

    expect(selectApprovedMedia({ ...approvedImage('cn-only'), markets: ['cn'] }, context)).toEqual({
      state: 'fallback',
      reason: 'wrong-market',
    });
  });

  it('requires an approved poster and at least two approved frames before enabling 360', () => {
    const poster = approvedImage('poster');
    const frameOne = approvedImage('frame-one');
    const frameTwo = approvedImage('frame-two');

    expect(
      selectMedia360FrameSet(
        {
          id: 'vehicle-360',
          poster,
          frames: [
            { id: 'one', angleDegrees: 0, media: frameOne },
            { id: 'two', angleDegrees: 180, media: frameTwo },
          ],
        },
        context,
      ),
    ).toMatchObject({ state: 'ready', id: 'vehicle-360' });

    expect(
      selectMedia360FrameSet(
        {
          id: 'incomplete-360',
          poster,
          frames: [{ id: 'one', angleDegrees: 0, media: frameOne }],
        },
        context,
      ),
    ).toEqual({ state: 'fallback', reason: 'not-enough-frames' });
  });

  it('keeps the known technology taxonomy content-neutral', () => {
    expect(getTechnologyTopic('800v-architecture')).toMatchObject({
      visualMode: 'energy-flow',
      requiresApprovedStructuredData: true,
    });
    expect(getTechnologyTopic('unapproved-topic')).toBeUndefined();
  });
});
