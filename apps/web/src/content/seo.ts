import type { Locale, Market, MarketLocaleContext } from '@eal/domain';

import { text } from './copy';

export interface RouteSeo {
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
  readonly languages: Readonly<Record<string, string>>;
  readonly indexable: boolean;
}

export function getRouteSeo(context: MarketLocaleContext, segments: readonly string[]): RouteSeo {
  const path =
    '/' +
    context.locale +
    '/' +
    context.market +
    (segments.length > 0 ? '/' + segments.join('/') : '');
  const pageLabel = routeLabel(context.locale, segments);
  const description =
    segments[0] === 'search'
      ? text(context.locale, 'searchRecovery')
      : segments[0] === 'news'
        ? text(context.locale, 'editorialReadiness')
        : text(context.locale, 'homeReadiness');
  const alternatePath = (locale: Locale, market: Market) =>
    '/' + locale + '/' + market + (segments.length > 0 ? '/' + segments.join('/') : '');
  return {
    title: pageLabel,
    description,
    canonical: path,
    languages: {
      en: alternatePath('en', context.market),
      'zh-Hans': alternatePath('zh-Hans', context.market),
    },
    indexable: segments[0] !== 'search' && segments[0] !== 'inventory',
  };
}

function routeLabel(locale: Locale, segments: readonly string[]): string {
  if (segments.length === 0) {
    return 'EAL';
  }
  const first = segments[0];
  const labels: Readonly<Record<string, string>> = {
    vehicles: text(locale, 'vehicles'),
    technology: text(locale, 'technology'),
    news: text(locale, 'news'),
    search: text(locale, 'searchResults'),
    privacy: text(locale, 'privacy'),
    legal: text(locale, 'legal'),
    support: text(locale, 'support'),
    retailers: text(locale, 'retailers'),
  };
  return labels[first] ?? first.replaceAll('-', ' ');
}

export function siteOrigin(): string {
  const configured = process.env.EAL_APP_ORIGIN;
  return configured === undefined || configured.length === 0 ? 'http://localhost:3000' : configured;
}
