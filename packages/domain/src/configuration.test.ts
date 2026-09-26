import { describe, expect, it } from 'vitest';

import {
  evaluateConfiguration,
  evaluateOptions,
  getLifecycleCta,
  validateConfigurationUrlState,
} from './configuration';

describe('configuration evaluation', () => {
  it('reports a data-defined incompatibility without mutating the build', () => {
    const result = evaluateConfiguration(
      {
        modelId: 's6',
        modelYear: 2026,
        trimId: 's6-standard',
        optionIds: ['sport-package'],
      },
      [
        {
          id: 'rule-sport',
          modelId: 's6',
          market: 'au',
          whenSelected: ['sport-package'],
          excludes: ['s6-standard'],
          requires: [],
          messageKey: 'configuration.incompatible',
          source: {
            sourceId: 'test',
            sourceType: 'manual',
            retrievedAt: '2026-09-26T00:00:00.000Z',
          },
        },
      ],
    );

    expect(result).toEqual({
      valid: false,
      violations: [{ ruleId: 'rule-sport', messageKey: 'configuration.incompatible' }],
    });
  });

  it.each([
    ['announced', 'register-interest'],
    ['coming-soon', 'register-interest'],
    ['orderable', 'build'],
    ['inventory-only', 'view-inventory'],
    ['discontinued', 'explore-archive'],
  ] as const)('uses the safe %s lifecycle CTA', (lifecycle, cta) => {
    expect(getLifecycleCta(lifecycle)).toBe(cta);
  });

  it('evaluates supply, dependency, default, price-delta and market rules deterministically', () => {
    const source = {
      sourceId: 'test',
      sourceType: 'manual' as const,
      retrievedAt: '2026-09-26T00:00:00.000Z',
    };
    const options = ['wheel-20', 'winter-wheel', 'upgrade-pack'].map((id) => ({
      id,
      modelId: 's6',
      trimIds: ['s6-standard'],
      category: 'wheel' as const,
      name: { defaultLocale: 'en' as const, values: { en: id } },
      source,
    }));
    const results = evaluateOptions(
      {
        market: 'au',
        configuration: {
          modelId: 's6',
          modelYear: 2026,
          trimId: 's6-standard',
          optionIds: ['sport-package'],
        },
        supplyByOptionId: { 'winter-wheel': 'unavailable' },
      },
      options,
      [
        {
          id: 'needs-upgrade-package',
          modelId: 's6',
          market: 'au',
          kind: 'dependency',
          appliesTo: ['wheel-20'],
          whenSelected: [],
          excludes: [],
          requires: ['upgrade-pack'],
          messageKey: 'configuration.requiresUpgrade',
          source,
        },
        {
          id: 'winter-supply',
          modelId: 's6',
          market: 'au',
          kind: 'supply',
          appliesTo: ['winter-wheel'],
          whenSelected: [],
          excludes: [],
          requires: [],
          messageKey: 'configuration.unavailable',
          source,
        },
        {
          id: 'upgrade-default',
          modelId: 's6',
          market: 'au',
          kind: 'default',
          appliesTo: ['upgrade-pack'],
          defaultOptionId: 'upgrade-pack',
          whenSelected: [],
          excludes: [],
          requires: [],
          messageKey: 'configuration.default',
          priceDelta: { amountMinor: 0, currency: 'AUD' },
          source,
        },
        {
          id: 'cn-only-rule',
          modelId: 's6',
          market: 'cn',
          kind: 'conflict',
          appliesTo: ['upgrade-pack'],
          whenSelected: [],
          excludes: ['upgrade-pack'],
          requires: [],
          messageKey: 'configuration.cnOnly',
          source,
        },
      ],
    );

    expect(results).toEqual([
      expect.objectContaining({
        optionId: 'wheel-20',
        enabled: false,
        explanationKey: 'configuration.requiresUpgrade',
      }),
      expect.objectContaining({
        optionId: 'winter-wheel',
        enabled: false,
        explanationKey: 'configuration.unavailable',
      }),
      expect.objectContaining({
        optionId: 'upgrade-pack',
        enabled: true,
        isDefault: true,
        priceDeltas: [{ amountMinor: 0, currency: 'AUD' }],
      }),
    ]);
  });

  it.each([
    { modelId: 's6', modelYear: 2026, trimId: 'standard', optionIds: [] },
    { modelId: 's6', modelYear: 2026, trimId: 'standard', optionIds: ['wheel-19'] },
  ])('accepts valid URL configuration %o', (input) => {
    expect(validateConfigurationUrlState(input)).toMatchObject({ valid: true });
  });

  it.each([
    { modelId: 's6', modelYear: 2026, trimId: 'standard', optionIds: ['wheel-19', 'wheel-19'] },
    { modelId: 's6', modelYear: 2026, trimId: 'standard', optionIds: ['standard'] },
    { modelId: '../s6', modelYear: 2026, trimId: 'standard', optionIds: [] },
  ])('rejects malformed or duplicate URL configuration %o', (input) => {
    expect(validateConfigurationUrlState(input)).toMatchObject({ valid: false });
  });
});
