import 'server-only';

import { getServerEnvironment } from './env';

type DeploymentEnvironment = 'local' | 'preview' | 'integration' | 'staging' | 'production';

export type FeatureFlagKey =
  'marketAu' | 'marketCn' | 'finance' | 'reservation' | 'providerIntegrations';

export interface FeatureFlagDefinition {
  key: FeatureFlagKey;
  description: string;
  defaultValue: boolean;
  owner: string;
  reviewBy: string;
  fallback: string;
}

export const featureFlagDefinitions: readonly FeatureFlagDefinition[] = [
  {
    key: 'marketAu',
    description: 'Enables Australia as an externally selectable market.',
    defaultValue: false,
    owner: 'Market launch owner',
    reviewBy: '2026-12-31',
    fallback: 'Hide the market from selection and retain the neutral entry state.',
  },
  {
    key: 'marketCn',
    description: 'Enables China as an externally selectable market.',
    defaultValue: false,
    owner: 'Market launch owner',
    reviewBy: '2026-12-31',
    fallback: 'Hide the market from selection and retain the neutral entry state.',
  },
  {
    key: 'finance',
    description: 'Enables finance experience entry points and provider calls.',
    defaultValue: false,
    owner: 'Commerce owner',
    reviewBy: '2026-12-31',
    fallback: 'Hide finance actions and retain non-commercial content.',
  },
  {
    key: 'reservation',
    description: 'Enables reservation initiation and associated provider calls.',
    defaultValue: false,
    owner: 'Commerce owner',
    reviewBy: '2026-12-31',
    fallback: 'Offer an approved non-transactional contact path when available.',
  },
  {
    key: 'providerIntegrations',
    description: 'Permits configured operational provider adapters to be selected.',
    defaultValue: false,
    owner: 'Platform integrations owner',
    reviewBy: '2026-12-31',
    fallback: 'Use no provider adapter and return the shared unavailable state.',
  },
] as const;

export type FeatureFlags = Readonly<Record<FeatureFlagKey, boolean>>;

const nonProductionEnvironments: readonly DeploymentEnvironment[] = [
  'local',
  'preview',
  'integration',
  'staging',
];

export function getFeatureFlags(): FeatureFlags {
  const environment = getServerEnvironment();

  return {
    marketAu: environment.EAL_FEATURE_MARKET_AU,
    marketCn: environment.EAL_FEATURE_MARKET_CN,
    finance: environment.EAL_FEATURE_FINANCE,
    reservation: environment.EAL_FEATURE_RESERVATION,
    providerIntegrations: environment.EAL_FEATURE_PROVIDER_INTEGRATIONS,
  };
}

export function canUseNonProductionFeatures(environment: DeploymentEnvironment): boolean {
  return nonProductionEnvironments.includes(environment);
}
