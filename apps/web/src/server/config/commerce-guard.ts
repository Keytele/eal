import 'server-only';

import { getFeatureFlags } from './feature-flags';
import { getServerEnvironment } from './env';

export class CommerceMutationUnavailableError extends Error {
  public constructor() {
    super('Commerce mutations are not configured for this environment.');
    this.name = 'CommerceMutationUnavailableError';
  }
}

/**
 * Call this before every future commerce mutation. It deliberately refuses to
 * permit transactions until a provider adapter and its server-only contract
 * have been configured.
 */
export function assertCommerceMutationConfiguration(): void {
  const environment = getServerEnvironment();
  const flags = getFeatureFlags();

  if (
    !environment.EAL_COMMERCE_MUTATIONS_ENABLED ||
    !flags.providerIntegrations ||
    !environment.EAL_COMMERCE_PROVIDER_ENDPOINT ||
    !environment.EAL_COMMERCE_PROVIDER_TOKEN
  ) {
    throw new CommerceMutationUnavailableError();
  }
}
