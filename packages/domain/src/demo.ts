import type { CmsRepository, OperationalServices, VehicleCatalogRepository } from './contracts';
import { unavailable, type ServiceResult } from './result';
import type { Build, EntityId, VehicleModel, VehicleOption, VehicleTrim } from './types';

/**
 * Deliberately contains no vehicle, pricing, inventory, or editorial claims.
 * It is safe for tests and local development, and must not be registered as a
 * production provider.
 */
export interface NonProductionCatalogFixture {
  readonly kind: 'non-production-placeholder';
  readonly deployable: false;
  readonly models: readonly VehicleModel[];
  readonly noteKey: 'catalog.placeholder';
}

export const NON_PRODUCTION_CATALOG_FIXTURE: NonProductionCatalogFixture = {
  kind: 'non-production-placeholder',
  deployable: false,
  models: [],
  noteKey: 'catalog.placeholder',
};

export function createUnavailableCatalogRepository(): VehicleCatalogRepository {
  return {
    getModels: async () => unavailable<readonly VehicleModel[]>('catalog.unavailable'),
    getModel: async () => unavailable<VehicleModel>('catalog.unavailable'),
    getTrims: async () => unavailable<readonly VehicleTrim[]>('catalog.unavailable'),
    getOptions: async () => unavailable<readonly VehicleOption[]>('catalog.unavailable'),
    getConfigurationRules: async () => unavailable('catalog.unavailable'),
  };
}

export function createUnavailableCmsRepository(): CmsRepository {
  return {
    getPage: async () => unavailable('content.unavailable'),
    getCampaignHero: async () => unavailable('content.unavailable'),
    getTechnologyArticle: async () => unavailable('content.unavailable'),
    getNewsArticle: async () => unavailable('content.unavailable'),
    getLegalDocument: async () => unavailable('content.unavailable'),
  };
}

/** Every operational call fails safely and deterministically until a real adapter is configured. */
export function createUnavailableOperationalServices(): OperationalServices {
  return {
    pricing: { quote: async () => unavailable('pricing.unavailable') },
    inventory: {
      findMatches: async () => unavailable('inventory.unavailable'),
      search: async () => unavailable('inventory.unavailable'),
      getById: async () => unavailable('inventory.unavailable'),
    },
    retailers: {
      search: async () => unavailable('retailer.unavailable'),
      getById: async () => unavailable('retailer.unavailable'),
    },
    finance: { estimate: async () => unavailable('finance.unavailable') },
    appointments: {
      getAvailability: async () => unavailable('appointment.unavailable'),
      request: async () => unavailable('appointment.unavailable'),
    },
    leads: { submit: async () => unavailable('lead.unavailable') },
    reservations: {
      start: async () => unavailable('reservation.unavailable'),
      getById: async () => unavailable('reservation.unavailable'),
      cancel: async () => unavailable('reservation.unavailable'),
    },
    payments: {
      createHostedCheckout: async () => unavailable('payment.unavailable'),
      verifyWebhook: async () => unavailable('payment.unavailable'),
      reconcileWebhook: async () => unavailable('payment.unavailable'),
    },
    search: { search: async () => unavailable('search.unavailable') },
    maps: { getDirectionsUrl: async () => unavailable('map.unavailable') },
    notifications: {
      sendTransactional: async () => unavailable('notification.unavailable'),
    },
    consent: {
      get: async () => unavailable('consent.unavailable'),
      save: async () => unavailable('consent.unavailable'),
    },
    accounts: {
      getSession: async () => unavailable('account.unavailable'),
      getDashboard: async () => unavailable('account.unavailable'),
      getProfile: async () => unavailable('account.unavailable'),
      updateProfile: async () => unavailable('account.unavailable'),
      requestPrivacyAction: async () => unavailable('account.unavailable'),
    },
  };
}

/** A local-only, PII-free build store for interaction and adapter tests. */
export interface LocalDemoBuildStore {
  readonly mode: 'local-demo';
  save(build: Build): Promise<ServiceResult<Build>>;
  get(buildId: EntityId): Promise<ServiceResult<Build>>;
  remove(buildId: EntityId): Promise<ServiceResult<{ readonly removed: boolean }>>;
  clearForMarket(market: Build['context']['market']): Promise<number>;
}

export function createLocalDemoBuildStore(): LocalDemoBuildStore {
  const builds = new Map<EntityId, Build>();

  return {
    mode: 'local-demo',
    async save(build) {
      const snapshot = cloneBuild(build);
      builds.set(snapshot.id, snapshot);
      return { ok: true, data: cloneBuild(snapshot) };
    },
    async get(buildId) {
      const build = builds.get(buildId);
      return build === undefined
        ? unavailable<Build>('build.unavailable')
        : { ok: true, data: cloneBuild(build) };
    },
    async remove(buildId) {
      return { ok: true, data: { removed: builds.delete(buildId) } };
    },
    async clearForMarket(market) {
      let removed = 0;
      for (const [buildId, build] of builds) {
        if (build.context.market === market) {
          builds.delete(buildId);
          removed += 1;
        }
      }
      return removed;
    },
  };
}

function cloneBuild(build: Build): Build {
  return {
    ...build,
    context: { ...build.context },
    configuration: {
      ...build.configuration,
      optionIds: [...build.configuration.optionIds],
    },
  };
}
