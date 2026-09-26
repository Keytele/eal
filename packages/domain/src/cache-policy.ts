import type { Locale, Market, MarketLocaleContext } from './context';

export type CacheResource =
  'editorial' | 'catalog' | 'price' | 'inventory' | 'retailer' | 'booking' | 'mutation';

export interface CachePolicy {
  readonly resource: CacheResource;
  readonly mode: 'public' | 'private' | 'no-store';
  readonly maxAgeSeconds: number;
  readonly staleWhileRevalidateSeconds: number;
  readonly reason: string;
}

export interface CacheKeyDimensions extends MarketLocaleContext {
  readonly modelYear?: number;
  readonly version?: string;
  readonly freshness?: string;
  readonly query?: string;
}

export const CACHE_POLICIES: Readonly<Record<CacheResource, CachePolicy>> = {
  editorial: {
    resource: 'editorial',
    mode: 'public',
    maxAgeSeconds: 300,
    staleWhileRevalidateSeconds: 900,
    reason: 'Published editorial content may be revalidated briefly.',
  },
  catalog: {
    resource: 'catalog',
    mode: 'public',
    maxAgeSeconds: 300,
    staleWhileRevalidateSeconds: 900,
    reason: 'Catalog data is market and model-year scoped.',
  },
  price: {
    resource: 'price',
    mode: 'private',
    maxAgeSeconds: 0,
    staleWhileRevalidateSeconds: 0,
    reason: 'Price quotes are short-lived and never served stale.',
  },
  inventory: {
    resource: 'inventory',
    mode: 'private',
    maxAgeSeconds: 30,
    staleWhileRevalidateSeconds: 0,
    reason: 'Operational inventory must remain fresh and is never silently stale.',
  },
  retailer: {
    resource: 'retailer',
    mode: 'public',
    maxAgeSeconds: 300,
    staleWhileRevalidateSeconds: 600,
    reason: 'Retailer discovery is market and locality scoped.',
  },
  booking: {
    resource: 'booking',
    mode: 'private',
    maxAgeSeconds: 0,
    staleWhileRevalidateSeconds: 0,
    reason: 'Availability and booking mutations are provider authoritative.',
  },
  mutation: {
    resource: 'mutation',
    mode: 'no-store',
    maxAgeSeconds: 0,
    staleWhileRevalidateSeconds: 0,
    reason: 'Writes and payment state must not be cached.',
  },
};

export function createCacheKey(resource: CacheResource, dimensions: CacheKeyDimensions): string {
  const fields: readonly [string, string | number | undefined][] = [
    ['locale', dimensions.locale],
    ['market', dimensions.market],
    ['modelYear', dimensions.modelYear],
    ['version', dimensions.version],
    ['freshness', dimensions.freshness],
    ['query', dimensions.query],
  ];
  const suffix = fields
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');
  return `eal:${resource}:${suffix}`;
}

export interface ProviderFailureState {
  readonly state: 'unavailable' | 'stale-blocked' | 'retryable';
  readonly showCommercialData: false;
  readonly retryAfterSeconds?: number;
}

export function providerFailureState(
  resource: CacheResource,
  options: { readonly retryable: boolean; readonly staleDataAvailable: boolean },
): ProviderFailureState {
  const policy = CACHE_POLICIES[resource];
  if (options.staleDataAvailable && policy.resource === 'editorial') {
    return { state: 'retryable', showCommercialData: false, retryAfterSeconds: 30 };
  }
  if (options.staleDataAvailable) {
    return { state: 'stale-blocked', showCommercialData: false };
  }
  return options.retryable
    ? { state: 'retryable', showCommercialData: false, retryAfterSeconds: 30 }
    : { state: 'unavailable', showCommercialData: false };
}

export function normalizeCacheContext(locale: Locale, market: Market): MarketLocaleContext {
  return { locale, market };
}
