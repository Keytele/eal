import { describe, expect, it } from 'vitest';

import { filterModels, parseVehicleFilters } from './vehicle-filters';
import { MODEL_PLACEHOLDERS } from '@eal/vehicle-data';

describe('vehicle filter URL state', () => {
  it('normalizes body filters and limits compare selections to known models', () => {
    const state = parseVehicleFilters({
      body: 'suv',
      compare: 'c2,s6,unknown,x4,r9',
    });

    expect(state).toEqual({
      body: 'suv',
      compare: ['c2', 's6', 'x4'],
    });
    expect(filterModels(MODEL_PLACEHOLDERS, state).every((model) => model.category === 'suv')).toBe(
      true,
    );
  });

  it('falls back to the complete range for invalid or repeated URL values', () => {
    const state = parseVehicleFilters({
      body: 'unsupported',
      compare: ['c2', 'c2', ''],
    });

    expect(state).toEqual({ body: 'all', compare: ['c2'] });
    expect(filterModels(MODEL_PLACEHOLDERS, state)).toHaveLength(MODEL_PLACEHOLDERS.length);
  });
});
