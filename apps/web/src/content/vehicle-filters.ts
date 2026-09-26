import type { EalModelCode, ModelPlaceholder } from '@eal/vehicle-data';

export const BODY_FILTERS = ['all', 'suv', 'sedan', 'grand-tourer'] as const;
export type BodyFilter = (typeof BODY_FILTERS)[number];

export interface VehicleFilterState {
  readonly body: BodyFilter;
  readonly compare: readonly EalModelCode[];
}

export function parseVehicleFilters(
  query: Readonly<Record<string, string | string[] | undefined>>,
): VehicleFilterState {
  const bodyValue = first(query.body);
  const body = BODY_FILTERS.includes(bodyValue as BodyFilter) ? (bodyValue as BodyFilter) : 'all';
  const compare = (first(query.compare) ?? '')
    .split(',')
    .filter((value): value is EalModelCode => isModelCode(value))
    .slice(0, 3);
  return { body, compare };
}

export function filterModels(
  models: readonly ModelPlaceholder[],
  state: VehicleFilterState,
): readonly ModelPlaceholder[] {
  return state.body === 'all' ? models : models.filter((model) => model.category === state.body);
}

function isModelCode(value: string): value is EalModelCode {
  return ['c2', 's4', 's6', 'x4', 'x6', 'r9'].includes(value);
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
