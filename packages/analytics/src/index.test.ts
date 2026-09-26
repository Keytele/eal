import { describe, expect, it } from 'vitest';

import { createConsentAwareAnalytics, type AnalyticsEvent, type AnalyticsTransport } from './index';

const context = {
  locale: 'en' as const,
  market: 'au' as const,
  pageType: 'vehicle',
  modelId: 's6',
};

function event(): AnalyticsEvent<'vehicle_360_started'> {
  return {
    name: 'vehicle_360_started',
    occurredAt: '2026-09-26T00:00:00.000Z',
    context,
    properties: { modelId: 's6' },
  };
}

describe('createConsentAwareAnalytics', () => {
  it('does not send an event before analytics consent is granted', async () => {
    let calls = 0;
    const transport: AnalyticsTransport = {
      track: async () => {
        calls += 1;
      },
    };
    const analytics = createConsentAwareAnalytics(
      { get: async () => ({ categories: { analytics: false } }) as never },
      transport,
    );

    await expect(analytics.track(event())).resolves.toEqual({
      delivered: false,
      reason: 'analytics-consent-not-granted',
    });
    expect(calls).toBe(0);
  });

  it('rejects a runtime payload with a sensitive property name', async () => {
    const analytics = createConsentAwareAnalytics(
      { get: async () => ({ categories: { analytics: true } }) as never },
      { track: async () => undefined },
    );
    const unsafe = {
      ...event(),
      properties: { email: 'not-permitted@example.test' },
    } as unknown as AnalyticsEvent;

    await expect(analytics.track(unsafe)).resolves.toEqual({
      delivered: false,
      reason: 'unsafe-payload',
    });
  });

  it('delivers a typed operational event only after analytics consent is granted', async () => {
    const delivered: AnalyticsEvent[] = [];
    const analytics = createConsentAwareAnalytics(
      { get: async () => ({ categories: { analytics: true } }) as never },
      {
        track: async (event) => {
          delivered.push(event);
        },
      },
    );
    const inventorySearch: AnalyticsEvent<'inventory_search'> = {
      name: 'inventory_search',
      occurredAt: '2026-09-26T00:00:00.000Z',
      context,
      properties: { hasLocalityFilter: false, hasRetailerFilter: true },
    };

    await expect(analytics.track(inventorySearch)).resolves.toEqual({ delivered: true });
    expect(delivered).toEqual([inventorySearch]);
  });
});
