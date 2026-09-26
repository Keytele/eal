import { describe, expect, it } from 'vitest';

import { CACHE_POLICIES, createCacheKey, providerFailureState } from './cache-policy';

describe('cache and outage policy', () => {
  it('scopes keys by locale, market and freshness', () => {
    expect(
      createCacheKey('inventory', {
        locale: 'en',
        market: 'au',
        freshness: '2026-09-26T00:00:00Z',
      }),
    ).toContain('market=au');
    expect(
      createCacheKey('inventory', {
        locale: 'en',
        market: 'cn',
        freshness: '2026-09-26T00:00:00Z',
      }),
    ).not.toBe(
      createCacheKey('inventory', {
        locale: 'en',
        market: 'au',
        freshness: '2026-09-26T00:00:00Z',
      }),
    );
  });

  it('never permits stale commercial data during a provider failure', () => {
    expect(CACHE_POLICIES.price.maxAgeSeconds).toBe(0);
    expect(
      providerFailureState('price', { retryable: true, staleDataAvailable: true }),
    ).toMatchObject({
      state: 'stale-blocked',
      showCommercialData: false,
    });
  });
});
