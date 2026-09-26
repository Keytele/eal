import type { Market } from './context';

export type FeatureFlagKey =
  | 'market-au'
  | 'market-cn'
  | 'model-launch'
  | 'finance-estimates'
  | 'reservations'
  | 'payments'
  | 'advanced-configurator'
  | 'webgl-experiences';

export interface FeatureFlag {
  readonly key: FeatureFlagKey;
  readonly enabled: boolean;
  readonly owner: string;
  readonly reviewBy: string;
  readonly fallback: 'hide' | 'unavailable' | 'static-experience';
  readonly markets?: readonly Market[];
}

export type FeatureFlags = Readonly<Record<FeatureFlagKey, FeatureFlag>>;

const DEFAULT_OWNER = 'platform';
const DEFAULT_REVIEW = '2027-01-01';

/** Safe defaults: a capability is unavailable until its owner enables it. */
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  'market-au': {
    key: 'market-au',
    enabled: false,
    owner: DEFAULT_OWNER,
    reviewBy: DEFAULT_REVIEW,
    fallback: 'hide',
  },
  'market-cn': {
    key: 'market-cn',
    enabled: false,
    owner: DEFAULT_OWNER,
    reviewBy: DEFAULT_REVIEW,
    fallback: 'hide',
  },
  'model-launch': {
    key: 'model-launch',
    enabled: false,
    owner: DEFAULT_OWNER,
    reviewBy: DEFAULT_REVIEW,
    fallback: 'unavailable',
  },
  'finance-estimates': {
    key: 'finance-estimates',
    enabled: false,
    owner: DEFAULT_OWNER,
    reviewBy: DEFAULT_REVIEW,
    fallback: 'unavailable',
  },
  reservations: {
    key: 'reservations',
    enabled: false,
    owner: DEFAULT_OWNER,
    reviewBy: DEFAULT_REVIEW,
    fallback: 'unavailable',
  },
  payments: {
    key: 'payments',
    enabled: false,
    owner: DEFAULT_OWNER,
    reviewBy: DEFAULT_REVIEW,
    fallback: 'unavailable',
  },
  'advanced-configurator': {
    key: 'advanced-configurator',
    enabled: false,
    owner: DEFAULT_OWNER,
    reviewBy: DEFAULT_REVIEW,
    fallback: 'static-experience',
  },
  'webgl-experiences': {
    key: 'webgl-experiences',
    enabled: false,
    owner: DEFAULT_OWNER,
    reviewBy: DEFAULT_REVIEW,
    fallback: 'static-experience',
  },
};

export function createFeatureFlags(overrides: Partial<FeatureFlags> = {}): FeatureFlags {
  return { ...DEFAULT_FEATURE_FLAGS, ...overrides };
}

export function isFeatureEnabled(
  flags: FeatureFlags,
  key: FeatureFlagKey,
  market?: Market,
): boolean {
  const flag = flags[key];
  return (
    flag.enabled &&
    (market === undefined || flag.markets === undefined || flag.markets.includes(market))
  );
}
