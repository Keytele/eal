import type { Locale, Market, MarketLocaleContext } from './context';

export type EntityId = string;
export type IsoDateTime = string;
export type IsoDate = string;
export type CurrencyCode = string;

export interface SourceAttribution {
  readonly sourceId: string;
  readonly sourceType: 'cms' | 'pim' | 'pricing' | 'inventory' | 'retailer' | 'legal' | 'manual';
  readonly retrievedAt: IsoDateTime;
  readonly effectiveFrom?: IsoDateTime;
  readonly effectiveTo?: IsoDateTime;
}

export interface LocalizedText {
  readonly defaultLocale: Locale;
  readonly values: Readonly<Partial<Record<Locale, string>>>;
}

/** Monetary amounts are always minor units; presentation is delegated to i18n. */
export interface Money {
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
}

export interface MediaFocalPoint {
  readonly x: number;
  readonly y: number;
}

export interface MediaAsset {
  readonly id: EntityId;
  readonly status: 'pending' | 'approved' | 'retired';
  readonly kind: 'image' | 'video' | 'document' | 'model-3d';
  readonly sourceUrl?: string;
  readonly alt: LocalizedText;
  readonly focalPoint?: MediaFocalPoint;
  readonly aspectRatio?: number;
  readonly mobileCropId?: EntityId;
  readonly locale?: Locale;
  readonly markets?: readonly Market[];
  readonly tags: readonly string[];
  readonly rights: {
    readonly status: 'unknown' | 'cleared' | 'expired';
    readonly expiresAt?: IsoDate;
    readonly attribution?: string;
  };
}

export type VehicleLifecycle =
  'announced' | 'coming-soon' | 'orderable' | 'inventory-only' | 'discontinued';

export interface MarketAvailability {
  readonly market: Market;
  readonly lifecycle: VehicleLifecycle;
  readonly availableFrom?: IsoDate;
  readonly unavailableReasonKey?: string;
  readonly source: SourceAttribution;
}

export interface SpecificationValue {
  readonly id: string;
  readonly label: LocalizedText;
  readonly value: string | number | boolean;
  readonly unit?: string;
  readonly qualifier?: LocalizedText;
  readonly source: SourceAttribution;
}

export type VehicleBodyType = 'hatch' | 'sedan' | 'suv' | 'coupe' | 'wagon' | 'other';

export interface VehicleModel {
  readonly id: EntityId;
  readonly slug: string;
  readonly modelYear: number;
  readonly name: LocalizedText;
  readonly bodyType: VehicleBodyType;
  readonly availability: readonly MarketAvailability[];
  readonly heroMediaId?: EntityId;
  readonly specificationIds: readonly string[];
  readonly source: SourceAttribution;
}

export interface VehicleTrim {
  readonly id: EntityId;
  readonly modelId: EntityId;
  readonly market: Market;
  readonly modelYear: number;
  readonly name: LocalizedText;
  readonly specifications: readonly SpecificationValue[];
  readonly source: SourceAttribution;
}

export type VehicleOptionCategory =
  | 'drivetrain'
  | 'battery'
  | 'exterior'
  | 'interior'
  | 'wheel'
  | 'seating'
  | 'package'
  | 'accessory';

export interface VehicleOption {
  readonly id: EntityId;
  readonly modelId: EntityId;
  readonly trimIds: readonly EntityId[];
  readonly category: VehicleOptionCategory;
  readonly name: LocalizedText;
  readonly swatchMediaId?: EntityId;
  /** Operational supply is never inferred from catalog compatibility alone. */
  readonly supplyStatus?: OptionSupplyStatus;
  readonly source: SourceAttribution;
}

export type OptionSupplyStatus = 'available' | 'limited' | 'unavailable';

export type ConfigurationRuleKind =
  | 'compatibility'
  | 'dependency'
  | 'conflict'
  | 'market'
  | 'trim'
  | 'supply'
  | 'default'
  | 'price-delta';

export interface ConfigurationRule {
  readonly id: EntityId;
  readonly modelId: EntityId;
  readonly market: Market;
  /** Defaults to compatibility for legacy PIM rule records. */
  readonly kind?: ConfigurationRuleKind;
  /** Options affected by this rule; an empty list means the selected set. */
  readonly appliesTo?: readonly EntityId[];
  readonly whenSelected: readonly EntityId[];
  readonly excludes: readonly EntityId[];
  readonly requires: readonly EntityId[];
  /** Limits applicability to trims without placing logic in a component. */
  readonly trimIds?: readonly EntityId[];
  readonly supplyStatus?: OptionSupplyStatus;
  readonly defaultOptionId?: EntityId;
  /** Informational delta only; a quote service remains the price authority. */
  readonly priceDelta?: Money;
  readonly messageKey: string;
  readonly source: SourceAttribution;
}

export interface VehicleConfiguration {
  readonly modelId: EntityId;
  readonly modelYear: number;
  readonly trimId: EntityId;
  readonly optionIds: readonly EntityId[];
}

export interface Build {
  readonly id: EntityId;
  readonly context: MarketLocaleContext;
  readonly configuration: VehicleConfiguration;
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
  readonly quoteId?: EntityId;
  readonly source: 'url' | 'saved' | 'session' | 'demo';
}

export interface QuoteLineItem {
  readonly id: EntityId;
  readonly label: LocalizedText;
  readonly amount: Money;
  readonly kind: 'vehicle' | 'option' | 'fee' | 'tax' | 'incentive';
  readonly disclosureKeys: readonly string[];
}

export interface PriceQuote {
  readonly id: EntityId;
  readonly context: MarketLocaleContext;
  readonly buildId: EntityId;
  readonly currency: CurrencyCode;
  readonly lineItems: readonly QuoteLineItem[];
  readonly total: Money;
  readonly taxTreatment: 'included' | 'excluded' | 'estimated' | 'unavailable';
  readonly validUntil: IsoDateTime;
  readonly disclosureKeys: readonly string[];
  readonly source: SourceAttribution;
}

export interface FinanceEstimate {
  readonly id: EntityId;
  readonly context: MarketLocaleContext;
  readonly quoteId: EntityId;
  readonly periodicPayment: Money;
  readonly frequency: 'weekly' | 'fortnightly' | 'monthly';
  readonly assumptions: readonly string[];
  readonly disclosureKeys: readonly string[];
  readonly validUntil: IsoDateTime;
  readonly source: SourceAttribution;
}

export interface InventoryVehicle {
  readonly id: EntityId;
  readonly inventoryId: string;
  readonly vin?: string;
  readonly context: MarketLocaleContext;
  readonly modelId: EntityId;
  readonly trimId?: EntityId;
  readonly optionIds: readonly EntityId[];
  readonly retailerId: EntityId;
  readonly matchKind: 'exact' | 'near' | 'similar';
  readonly status: InventoryStatus;
  readonly price?: InventoryPrice;
  readonly arrivalAt?: IsoDateTime;
  readonly actualMedia: readonly MediaAsset[];
  readonly updatedAt: IsoDateTime;
  /** The operational record must be refreshed before this moment. */
  readonly freshUntil: IsoDateTime;
  readonly source: SourceAttribution;
}

export type InventoryStatus = 'available' | 'in-transit' | 'held' | 'sold' | 'unavailable';

export interface InventoryPrice {
  readonly amount: Money;
  readonly taxTreatment: 'included' | 'excluded' | 'estimated' | 'unavailable';
  readonly validUntil: IsoDateTime;
  readonly disclosureKeys: readonly string[];
  readonly source: SourceAttribution;
}

export interface Address {
  readonly countryCode: string;
  readonly region?: string;
  readonly locality: string;
  readonly postalCode?: string;
  readonly lines: readonly string[];
}

export interface Retailer {
  readonly id: EntityId;
  readonly market: Market;
  readonly name: LocalizedText;
  readonly address: Address;
  readonly telephone?: string;
  readonly location?: { readonly latitude: number; readonly longitude: number };
  readonly services: readonly string[];
  readonly source: SourceAttribution;
}

export interface LeadContact {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly telephone?: string;
}

export interface Lead {
  readonly id: EntityId;
  readonly kind: LeadKind;
  readonly context: MarketLocaleContext;
  readonly modelId?: EntityId;
  readonly buildId?: EntityId;
  readonly inventoryId?: EntityId;
  readonly retailerId?: EntityId;
  readonly createdAt: IsoDateTime;
}

export type LeadKind =
  'test-drive' | 'retailer-contact' | 'finance' | 'trade-in' | 'register-interest';

export interface TradeInVehicleDetails {
  readonly make: string;
  readonly model: string;
  readonly modelYear: number;
  readonly registration?: string;
  readonly odometer?: { readonly value: number; readonly unit: 'kilometer' | 'mile' };
}

export interface TradeInPreliminaryOutcome {
  readonly status: 'lead-captured' | 'unavailable';
  /** This disclosure makes clear that no valuation has been promised. */
  readonly disclosureKey: 'trade-in.noConfirmedValuation';
}

export interface LeadSubmission {
  readonly kind: LeadKind;
  readonly contact: LeadContact;
  readonly context: MarketLocaleContext;
  readonly source: string;
  readonly consent: Pick<ConsentRecord, 'categories' | 'version'>;
  readonly modelId?: EntityId;
  readonly buildId?: EntityId;
  readonly inventoryId?: EntityId;
  readonly retailerId?: EntityId;
  readonly tradeInVehicle?: TradeInVehicleDetails;
}

export interface Appointment {
  readonly id: EntityId;
  readonly context: MarketLocaleContext;
  readonly retailerId: EntityId;
  readonly modelId?: EntityId;
  readonly buildId?: EntityId;
  readonly startsAt: IsoDateTime;
  readonly status: 'requested' | 'confirmed' | 'cancelled' | 'unavailable';
  readonly createdAt: IsoDateTime;
}

export interface AppointmentSlot {
  readonly id: EntityId;
  readonly retailerId: EntityId;
  readonly modelId?: EntityId;
  readonly startsAt: IsoDateTime;
  readonly endsAt: IsoDateTime;
  readonly availability: 'available' | 'request-pending' | 'unavailable';
  readonly freshUntil: IsoDateTime;
  readonly source: SourceAttribution;
}

export interface Reservation {
  readonly id: EntityId;
  readonly context: MarketLocaleContext;
  readonly inventoryId?: EntityId;
  readonly buildId?: EntityId;
  readonly quoteId?: EntityId;
  readonly status: ReservationStatus;
  readonly expiresAt?: IsoDateTime;
  readonly createdAt: IsoDateTime;
}

export type ReservationStatus =
  | 'draft'
  | 'payment-pending'
  | 'reserved'
  | 'failed'
  | 'expired'
  | 'cancelled'
  | 'refunded'
  | 'unavailable';

export interface ReservationStartRequest {
  readonly context: MarketLocaleContext;
  readonly buildId?: EntityId;
  readonly inventoryId?: EntityId;
  readonly quoteId: EntityId;
  readonly quoteValidUntil: IsoDateTime;
}

export interface HostedPaymentCheckout {
  readonly providerSessionId: string;
  readonly checkoutUrl: string;
  readonly expiresAt: IsoDateTime;
}

export interface PaymentWebhookEvent {
  readonly providerEventId: string;
  readonly provider: string;
  readonly receivedAt: IsoDateTime;
  readonly reservationId: EntityId;
  readonly eventType: 'payment-authorized' | 'payment-failed' | 'payment-refunded';
  /** A verified provider token/reference only; never a card or raw payment payload. */
  readonly paymentReference: string;
}

export type NotificationKind =
  | 'appointment-requested'
  | 'appointment-updated'
  | 'reservation-updated'
  | 'payment-receipt'
  | 'shared-build';

export interface NotificationRequest {
  readonly kind: NotificationKind;
  readonly context: MarketLocaleContext;
  readonly recipientId: EntityId;
  readonly relatedEntityId: EntityId;
  readonly templateKey: string;
  readonly consent: Pick<ConsentRecord, 'categories' | 'version'>;
}

/** Marketing notifications are intentionally a separate opt-in-only contract. */
export interface MarketingNotificationRequest {
  readonly context: MarketLocaleContext;
  readonly recipientId: EntityId;
  readonly templateKey: string;
  readonly consent: Pick<ConsentRecord, 'categories' | 'version'>;
}

export interface NotificationDelivery {
  readonly id: EntityId;
  readonly kind: NotificationKind;
  readonly relatedEntityId: EntityId;
  readonly providerMessageId?: string;
  readonly status: 'queued' | 'sent' | 'failed' | 'unavailable';
  readonly retryability: 'never' | 'safe' | 'after-delay';
  readonly createdAt: IsoDateTime;
}

export interface AccountSession {
  readonly accountId: EntityId;
  readonly context: MarketLocaleContext;
  readonly authenticatedAt: IsoDateTime;
  readonly reauthenticatedAt?: IsoDateTime;
}

export type AccountHighRiskAction =
  'contact-details-change' | 'privacy-export' | 'account-deletion';

export interface AccountProfile {
  readonly accountId: EntityId;
  readonly context: MarketLocaleContext;
  readonly preferences: Readonly<Record<'email' | 'sms', boolean>>;
  readonly updatedAt: IsoDateTime;
}

export interface AccountDashboard {
  readonly accountId: EntityId;
  readonly buildIds: readonly EntityId[];
  readonly favoriteModelIds: readonly EntityId[];
  readonly appointmentIds: readonly EntityId[];
  readonly reservationIds: readonly EntityId[];
}

export interface PrivacyRequest {
  readonly id: EntityId;
  readonly accountId: EntityId;
  readonly kind: 'export' | 'deletion';
  readonly market: Market;
  readonly status: 'requested' | 'in-progress' | 'completed' | 'unavailable';
  readonly createdAt: IsoDateTime;
}

export type ConsentCategory = 'necessary' | 'preferences' | 'analytics' | 'marketing';

export interface ConsentRecord {
  readonly id: EntityId;
  readonly context: MarketLocaleContext;
  readonly categories: Readonly<Record<ConsentCategory, boolean>>;
  readonly version: string;
  readonly source: 'banner' | 'preferences' | 'imported';
  readonly updatedAt: IsoDateTime;
}

export interface AuditEvent {
  readonly id: EntityId;
  readonly type: string;
  readonly correlationId: string;
  readonly context: MarketLocaleContext;
  readonly occurredAt: IsoDateTime;
  readonly entityId?: EntityId;
  /** Safe, non-sensitive metadata only. */
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
}
