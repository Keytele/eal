import type { MarketLocaleContext } from '@eal/domain';

import { siteOrigin } from '../content/seo';

export function StructuredData({
  context,
  segments,
}: {
  readonly context: MarketLocaleContext;
  readonly segments: readonly string[];
}) {
  const relativePath =
    '/' +
    context.locale +
    '/' +
    context.market +
    (segments.length > 0 ? '/' + segments.join('/') : '');
  const pageUrl = siteOrigin() + relativePath;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'EAL',
        url: siteOrigin(),
      },
      {
        '@type': 'WebSite',
        name: 'EAL',
        url: siteOrigin(),
        inLanguage: context.locale,
        potentialAction: {
          '@type': 'SearchAction',
          target:
            siteOrigin() +
            '/' +
            context.locale +
            '/' +
            context.market +
            '/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        url: pageUrl,
        isPartOf: { '@id': siteOrigin() },
        inLanguage: context.locale,
      },
    ],
  };

  return (
    <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} type="application/ld+json" />
  );
}
