import {
  isLocale,
  isMarket,
  SUPPORTED_LOCALES,
  type Locale,
  type Market,
  type MarketLocaleContext,
} from '@eal/domain';

export interface MarketRoute extends MarketLocaleContext {
  readonly segments: readonly string[];
  readonly search: string;
  readonly hash: string;
}

export type RouteFallback = 'none' | 'translation-unavailable';

export interface RouteSwitchResult {
  readonly href: string;
  readonly context: MarketLocaleContext;
  readonly fallback: RouteFallback;
}

export const MARKET_CACHE_SCOPES = [
  'catalog',
  'pricing',
  'inventory',
  'retailer',
  'finance',
  'legal',
  'content',
] as const;

export type MarketCacheScope = (typeof MARKET_CACHE_SCOPES)[number];

export interface MarketSwitchResult extends RouteSwitchResult {
  readonly invalidate: readonly MarketCacheScope[];
}

export function parseMarketRoute(input: string): MarketRoute | undefined {
  const parsed = parseRelativeUrl(input);
  if (parsed === undefined) {
    return undefined;
  }

  const segments = parsed.pathname.split('/').filter(Boolean);
  const [locale, market, ...remaining] = segments;
  if (
    locale === undefined ||
    market === undefined ||
    !isLocale(locale) ||
    !isMarket(market) ||
    !remaining.every(isSafeSegment)
  ) {
    return undefined;
  }

  return {
    locale,
    market,
    segments: remaining,
    search: parsed.search,
    hash: parsed.hash,
  };
}

export function createMarketHref(route: MarketRoute): string {
  const routePath = [route.locale, route.market, ...route.segments]
    .map(encodeURIComponent)
    .join('/');
  return `/${routePath}${normaliseSearch(route.search)}${normaliseHash(route.hash)}`;
}

/**
 * Keeps path, model and build parameters only when the equivalent target route
 * is approved for the requested locale. The fallback is always that market's
 * localized home page, never a stale source-locale route.
 */
export function switchLocale(
  current: MarketRoute,
  locale: Locale,
  isEquivalentRouteAvailable: (input: {
    readonly locale: Locale;
    readonly market: Market;
    readonly segments: readonly string[];
  }) => boolean,
): RouteSwitchResult {
  const context: MarketLocaleContext = { locale, market: current.market };
  if (isEquivalentRouteAvailable({ ...context, segments: current.segments })) {
    return {
      href: createMarketHref({ ...current, ...context }),
      context,
      fallback: 'none',
    };
  }

  return {
    href: `/${locale}/${current.market}`,
    context,
    fallback: 'translation-unavailable',
  };
}

/** A market change forces all market-aware domains to be fetched afresh. */
export function switchMarket(current: MarketRoute, market: Market): MarketSwitchResult {
  const context: MarketLocaleContext = { locale: current.locale, market };
  return {
    href: createMarketHref({ ...current, ...context }),
    context,
    fallback: 'none',
    invalidate: MARKET_CACHE_SCOPES,
  };
}

export function createMarketCacheKey(
  scope: MarketCacheScope,
  context: MarketLocaleContext,
  suffix = '',
): string {
  const cleanSuffix = suffix.length > 0 ? `:${suffix}` : '';
  return `${scope}:${context.market}:${context.locale}${cleanSuffix}`;
}

export function localeRouteParams(route: MarketRoute): {
  readonly locale: Locale;
  readonly market: Market;
} {
  return { locale: route.locale, market: route.market };
}

export function supportedLocales(): readonly Locale[] {
  return SUPPORTED_LOCALES;
}

function parseRelativeUrl(input: string): URL | undefined {
  try {
    const parsed = new URL(input, 'https://eal.invalid');
    return parsed.origin === 'https://eal.invalid' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function isSafeSegment(value: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(value);
}

function normaliseSearch(value: string): string {
  return value.length === 0 ? '' : value.startsWith('?') ? value : `?${value}`;
}

function normaliseHash(value: string): string {
  return value.length === 0 ? '' : value.startsWith('#') ? value : `#${value}`;
}
