import type { Locale, Market, MarketLocaleContext } from './context';
import type { ServiceResult } from './result';
import type {
  AccountDashboard,
  AccountProfile,
  AccountSession,
  Appointment,
  AppointmentSlot,
  AuditEvent,
  Build,
  ConsentRecord,
  EntityId,
  FinanceEstimate,
  HostedPaymentCheckout,
  InventoryVehicle,
  Lead,
  LeadSubmission,
  LocalizedText,
  MediaAsset,
  NotificationDelivery,
  NotificationRequest,
  PaymentWebhookEvent,
  PriceQuote,
  PrivacyRequest,
  Reservation,
  ReservationStartRequest,
  Retailer,
  SourceAttribution,
  VehicleConfiguration,
  VehicleModel,
  VehicleOption,
  VehicleTrim,
} from './types';
import type { Retryability } from './result';

export type PublicationStatus =
  | 'draft'
  | 'translation'
  | 'editorial-review'
  | 'legal-review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'retired';

export interface LocalizedPublicationState {
  readonly locale: Locale;
  readonly status: PublicationStatus;
  readonly approvedAt?: string;
}

export interface SeoMetadata {
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly canonicalPath: string;
  readonly hreflang: readonly {
    readonly locale: Locale;
    readonly market: Market;
    readonly path: string;
  }[];
}

export interface ContentBase {
  readonly id: EntityId;
  readonly context: MarketLocaleContext;
  readonly status: LocalizedPublicationState;
  readonly seo: SeoMetadata;
  readonly source: SourceAttribution;
}

export interface CampaignHero extends ContentBase {
  readonly kind: 'campaign-hero';
  readonly eyebrow?: LocalizedText;
  readonly heading: LocalizedText;
  readonly body?: LocalizedText;
  readonly media: MediaAsset;
}

export interface ContentSection {
  readonly id: EntityId;
  readonly kind: 'rich-text' | 'media' | 'feature-list' | 'cta' | 'quote' | 'specification';
  readonly heading?: LocalizedText;
  readonly body?: LocalizedText;
  readonly media?: MediaAsset;
}

export interface Page extends ContentBase {
  readonly kind: 'page';
  readonly path: string;
  readonly sections: readonly ContentSection[];
}

export interface Article extends ContentBase {
  readonly kind: 'technology-article' | 'news-article';
  readonly slug: string;
  readonly title: LocalizedText;
  readonly excerpt?: LocalizedText;
  readonly sections: readonly ContentSection[];
}

export interface RelatedContentLink {
  readonly id: EntityId;
  readonly kind: 'vehicle' | 'technology' | 'news' | 'support';
  readonly title: LocalizedText;
  readonly path: string;
}

/** News adds the editorial fields that are required for an indexable article. */
export interface NewsArticle extends Article {
  readonly kind: 'news-article';
  readonly author: LocalizedText;
  readonly publishedAt: string;
  readonly media: readonly MediaAsset[];
  readonly relatedContent: readonly RelatedContentLink[];
}

export type LegalDocumentType =
  | 'privacy'
  | 'cookies'
  | 'terms'
  | 'finance'
  | 'reservation'
  | 'vehicle-data'
  | 'driver-assistance'
  | 'other';

export interface LegalApproval {
  readonly status: 'pending' | 'approved' | 'expired';
  readonly owner: string;
  readonly approvedAt?: string;
  readonly reviewBy?: string;
}

export interface LegalDocument extends ContentBase {
  readonly kind: 'legal-document';
  readonly documentType: LegalDocumentType;
  readonly version: string;
  readonly effectiveAt: string;
  readonly legalApproval?: LegalApproval;
  readonly sections: readonly ContentSection[];
}

export interface CmsPreviewContext {
  readonly enabled: boolean;
  readonly token?: string;
  readonly requestedAt: string;
}

export interface CmsRepository {
  getPage(
    context: MarketLocaleContext,
    path: string,
    preview?: CmsPreviewContext,
  ): Promise<ServiceResult<Page>>;
  getCampaignHero(
    context: MarketLocaleContext,
    id: EntityId,
    preview?: CmsPreviewContext,
  ): Promise<ServiceResult<CampaignHero>>;
  getTechnologyArticle(
    context: MarketLocaleContext,
    slug: string,
    preview?: CmsPreviewContext,
  ): Promise<ServiceResult<Article>>;
  getNewsArticle(
    context: MarketLocaleContext,
    slug: string,
    preview?: CmsPreviewContext,
  ): Promise<ServiceResult<NewsArticle>>;
  getLegalDocument(
    context: MarketLocaleContext,
    documentType: LegalDocument['documentType'],
  ): Promise<ServiceResult<LegalDocument>>;
}

export interface CatalogQuery extends MarketLocaleContext {
  readonly modelYear?: number;
}

export interface VehicleCatalogRepository {
  getModels(query: CatalogQuery): Promise<ServiceResult<readonly VehicleModel[]>>;
  getModel(query: CatalogQuery, modelSlug: string): Promise<ServiceResult<VehicleModel>>;
  getTrims(query: CatalogQuery, modelId: EntityId): Promise<ServiceResult<readonly VehicleTrim[]>>;
  getOptions(
    query: CatalogQuery,
    modelId: EntityId,
    trimId?: EntityId,
  ): Promise<ServiceResult<readonly VehicleOption[]>>;
  getConfigurationRules(
    query: CatalogQuery,
    modelId: EntityId,
  ): Promise<ServiceResult<readonly import('./types').ConfigurationRule[]>>;
}

export interface RequestContext {
  readonly context: MarketLocaleContext;
  readonly correlationId: string;
  readonly idempotencyKey?: string;
  readonly audit: (event: AuditEvent) => Promise<void> | void;
}

export interface PricingService {
  quote(context: RequestContext, build: Build): Promise<ServiceResult<PriceQuote>>;
}

export interface InventoryService {
  findMatches(
    context: RequestContext,
    configuration: VehicleConfiguration,
  ): Promise<ServiceResult<readonly InventoryVehicle[]>>;
  search(
    context: RequestContext,
    query: InventorySearchQuery,
  ): Promise<ServiceResult<InventorySearchResult>>;
  getById(context: RequestContext, inventoryId: string): Promise<ServiceResult<InventoryVehicle>>;
}

export interface InventorySearchQuery {
  readonly market: Market;
  readonly modelId?: EntityId;
  readonly trimId?: EntityId;
  readonly retailerId?: EntityId;
  readonly status?: readonly InventoryVehicle['status'][];
  readonly configuration?: VehicleConfiguration;
  readonly locality?: string;
  readonly maximumDistanceKm?: number;
  readonly sort?: 'relevance' | 'price-ascending' | 'price-descending' | 'distance' | 'arrival';
}

export interface InventorySearchResult {
  readonly items: readonly InventoryVehicle[];
  readonly source: 'operational';
  readonly refreshedAt: string;
  readonly freshUntil: string;
}

export interface RetailerService {
  search(
    context: RequestContext,
    query: { readonly market: Market; readonly locality?: string },
  ): Promise<ServiceResult<readonly Retailer[]>>;
  getById(context: RequestContext, retailerId: EntityId): Promise<ServiceResult<Retailer>>;
}

export interface FinanceService {
  estimate(context: RequestContext, quoteId: EntityId): Promise<ServiceResult<FinanceEstimate>>;
}

export interface AppointmentService {
  getAvailability(
    context: RequestContext,
    input: {
      readonly retailerId: EntityId;
      readonly modelId?: EntityId;
      readonly from: string;
      readonly to: string;
    },
  ): Promise<ServiceResult<readonly AppointmentSlot[]>>;
  request(
    context: RequestContext & { readonly idempotencyKey: string },
    input: AppointmentRequest,
  ): Promise<ServiceResult<Appointment>>;
}

export interface AppointmentRequest {
  readonly retailerId: EntityId;
  readonly slotId?: EntityId;
  readonly startsAt?: string;
  readonly contact: LeadSubmission['contact'];
  readonly consent: Pick<ConsentRecord, 'categories' | 'version'>;
  readonly modelId?: EntityId;
  readonly buildId?: EntityId;
  readonly inventoryId?: EntityId;
}

export interface LeadService {
  submit(
    context: RequestContext & { readonly idempotencyKey: string },
    input: LeadSubmission,
  ): Promise<ServiceResult<Lead>>;
}

export interface ReservationService {
  start(
    context: RequestContext & { readonly idempotencyKey: string },
    input: ReservationStartRequest,
  ): Promise<ServiceResult<Reservation>>;
  getById(context: RequestContext, reservationId: EntityId): Promise<ServiceResult<Reservation>>;
  cancel(
    context: RequestContext & { readonly idempotencyKey: string },
    reservationId: EntityId,
  ): Promise<ServiceResult<Reservation>>;
}

/** Payment details are handled by a PCI provider; no card data enters this contract. */
export interface PaymentService {
  createHostedCheckout(
    context: RequestContext & { readonly idempotencyKey: string },
    reservationId: EntityId,
  ): Promise<ServiceResult<HostedPaymentCheckout>>;
  verifyWebhook(
    context: RequestContext,
    /** Payload bytes are verified at the server boundary and are never logged. */
    input: { readonly signature: string; readonly payload: Uint8Array },
  ): Promise<ServiceResult<PaymentWebhookEvent>>;
  reconcileWebhook(
    context: RequestContext & { readonly idempotencyKey: string },
    event: PaymentWebhookEvent,
  ): Promise<ServiceResult<Reservation>>;
}

export interface SearchResult {
  readonly id: EntityId;
  readonly kind: 'vehicle' | 'technology' | 'news' | 'support' | 'retailer';
  readonly title: LocalizedText;
  readonly path: string;
}

export interface SearchService {
  search(
    context: RequestContext,
    query: {
      readonly term: string;
      readonly locale: Locale;
      readonly aliases: readonly string[];
    },
  ): Promise<ServiceResult<readonly SearchResult[]>>;
}

export interface MapService {
  getDirectionsUrl(
    context: RequestContext,
    retailer: Retailer,
  ): Promise<ServiceResult<{ readonly url: string }>>;
}

export interface NotificationService {
  sendTransactional(
    context: RequestContext,
    input: NotificationRequest,
  ): Promise<ServiceResult<NotificationDelivery>>;
}

export interface ConsentService {
  get(context: MarketLocaleContext): Promise<ServiceResult<ConsentRecord>>;
  save(
    context: RequestContext & { readonly idempotencyKey: string },
    consent: ConsentRecord,
  ): Promise<ServiceResult<ConsentRecord>>;
}

/** Accounts enhance saved data but must never gate browsing, booking, or lead capture. */
export interface AccountService {
  getSession(context: MarketLocaleContext): Promise<ServiceResult<AccountSession | undefined>>;
  getDashboard(
    context: RequestContext,
    accountId: EntityId,
  ): Promise<ServiceResult<AccountDashboard>>;
  getProfile(context: RequestContext, accountId: EntityId): Promise<ServiceResult<AccountProfile>>;
  updateProfile(
    context: RequestContext & { readonly idempotencyKey: string },
    input: AccountProfile,
  ): Promise<ServiceResult<AccountProfile>>;
  requestPrivacyAction(
    context: RequestContext & { readonly idempotencyKey: string },
    input: {
      readonly accountId: EntityId;
      readonly kind: PrivacyRequest['kind'];
      readonly reauthenticatedAt: string;
    },
  ): Promise<ServiceResult<PrivacyRequest>>;
}

export interface OperationalServices {
  readonly pricing: PricingService;
  readonly inventory: InventoryService;
  readonly retailers: RetailerService;
  readonly finance: FinanceService;
  readonly appointments: AppointmentService;
  readonly leads: LeadService;
  readonly reservations: ReservationService;
  readonly payments: PaymentService;
  readonly search: SearchService;
  readonly maps: MapService;
  readonly notifications: NotificationService;
  readonly consent: ConsentService;
  readonly accounts: AccountService;
}

export interface AdapterRequestMetadata {
  readonly correlationId: string;
  readonly retryability: Retryability;
  readonly idempotencyKey?: string;
}
