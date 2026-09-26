import type { MarketLocaleContext } from './context';
import type { AppointmentRequest, RequestContext } from './contracts';
import { failure, success, type ServiceResult } from './result';
import type {
  AccountHighRiskAction,
  AccountSession,
  ConsentRecord,
  InventoryVehicle,
  LeadSubmission,
  MarketingNotificationRequest,
  NotificationRequest,
  PaymentWebhookEvent,
  Reservation,
  ReservationStartRequest,
  TradeInPreliminaryOutcome,
} from './types';
import {
  invalid,
  isFiniteNumber,
  isNonEmptyString,
  isPlainRecord,
  isSafeIdentifier,
  validateCorrelationId,
  validateIdempotencyKey,
  valid,
  type ValidationResult,
} from './validation';

export interface IdempotentRequestContext extends RequestContext {
  readonly idempotencyKey: string;
}

export type MutationOperation =
  | 'appointment'
  | 'lead'
  | 'reservation'
  | 'payment-checkout'
  | 'payment-reconciliation'
  | 'consent'
  | 'account-profile'
  | 'privacy-request';

export function validateIdempotentRequestContext(
  value: RequestContext,
): ValidationResult<IdempotentRequestContext> {
  const correlation = validateCorrelationId(value.correlationId);
  if (!correlation.valid) {
    return correlation;
  }

  const idempotency = validateIdempotencyKey(value.idempotencyKey);
  if (!idempotency.valid) {
    return idempotency;
  }

  return valid({ ...value, correlationId: correlation.value, idempotencyKey: idempotency.value });
}

/** Enables deterministic idempotency/replay tests without a database or provider. */
export interface DeterministicIdempotencyRegistry {
  claim(
    operation: MutationOperation,
    context: IdempotentRequestContext,
  ): ServiceResult<{ readonly duplicate: boolean }>;
  claimWebhook(provider: string, eventId: string): ServiceResult<{ readonly duplicate: boolean }>;
}

export function createDeterministicIdempotencyRegistry(): DeterministicIdempotencyRegistry {
  const mutationKeys = new Set<string>();
  const webhookKeys = new Set<string>();

  return {
    claim(operation, context) {
      const key = `${operation}:${context.idempotencyKey}`;
      const duplicate = mutationKeys.has(key);
      mutationKeys.add(key);
      return success({ duplicate }, context.correlationId);
    },
    claimWebhook(provider, eventId) {
      if (!isSafeIdentifier(provider) || !isSafeIdentifier(eventId)) {
        return failure({
          code: 'VALIDATION_FAILED',
          messageKey: 'validation.paymentWebhook',
          retryability: 'never',
        });
      }

      const key = `${provider}:${eventId}`;
      const duplicate = webhookKeys.has(key);
      webhookKeys.add(key);
      return success({ duplicate });
    },
  };
}

export function validateAppointmentRequest(value: unknown): ValidationResult<AppointmentRequest> {
  if (
    !isPlainRecord(value) ||
    !isSafeIdentifier(value.retailerId) ||
    !isPlainRecord(value.contact)
  ) {
    return invalid('appointment', 'validation.appointment');
  }

  const slotId = isSafeIdentifier(value.slotId) ? value.slotId : undefined;
  const startsAt = isNonEmptyString(value.startsAt) ? value.startsAt : undefined;
  const hasSlot = slotId !== undefined;
  const hasTime = startsAt !== undefined;
  if (hasSlot === hasTime) {
    return invalid('appointment.slot', 'validation.appointmentSlot');
  }

  const contact = validateLeadContact(value.contact);
  if (!contact.valid) {
    return contact;
  }

  const consent = validateConsentSnapshot(value.consent);
  if (!consent.valid) {
    return consent;
  }

  if (
    (value.modelId !== undefined && !isSafeIdentifier(value.modelId)) ||
    (value.buildId !== undefined && !isSafeIdentifier(value.buildId)) ||
    (value.inventoryId !== undefined && !isSafeIdentifier(value.inventoryId))
  ) {
    return invalid('appointment.context', 'validation.appointment');
  }

  return valid({
    retailerId: value.retailerId,
    ...(hasSlot ? { slotId } : { startsAt }),
    contact: contact.value,
    consent: consent.value,
    ...(value.modelId === undefined ? {} : { modelId: value.modelId }),
    ...(value.buildId === undefined ? {} : { buildId: value.buildId }),
    ...(value.inventoryId === undefined ? {} : { inventoryId: value.inventoryId }),
  });
}

export function validateLeadSubmission(value: unknown): ValidationResult<LeadSubmission> {
  if (!isPlainRecord(value) || !isPlainRecord(value.context) || !isNonEmptyString(value.source)) {
    return invalid('lead', 'validation.lead');
  }

  const contact = validateLeadContact(value.contact);
  const consent = validateConsentSnapshot(value.consent);
  const context = validateMarketLocaleContext(value.context);
  const kinds = [
    'test-drive',
    'retailer-contact',
    'finance',
    'trade-in',
    'register-interest',
  ] as const;
  if (
    !contact.valid ||
    !consent.valid ||
    !context.valid ||
    !kinds.includes(value.kind as (typeof kinds)[number])
  ) {
    return invalid('lead', 'validation.lead');
  }

  const contextualIds = ['modelId', 'buildId', 'inventoryId', 'retailerId'] as const;
  if (contextualIds.some((key) => value[key] !== undefined && !isSafeIdentifier(value[key]))) {
    return invalid('lead.context', 'validation.lead');
  }

  const tradeInVehicle =
    value.tradeInVehicle === undefined ? undefined : validateTradeInVehicle(value.tradeInVehicle);
  if (value.kind === 'trade-in' && (tradeInVehicle === undefined || !tradeInVehicle.valid)) {
    return invalid('lead.tradeInVehicle', 'validation.tradeInVehicle');
  }

  return valid({
    kind: value.kind as LeadSubmission['kind'],
    contact: contact.value,
    context: context.value,
    source: value.source,
    consent: consent.value,
    ...(value.modelId === undefined ? {} : { modelId: value.modelId as string }),
    ...(value.buildId === undefined ? {} : { buildId: value.buildId as string }),
    ...(value.inventoryId === undefined ? {} : { inventoryId: value.inventoryId as string }),
    ...(value.retailerId === undefined ? {} : { retailerId: value.retailerId as string }),
    ...(tradeInVehicle === undefined || !tradeInVehicle.valid
      ? {}
      : { tradeInVehicle: tradeInVehicle.value }),
  });
}

export function validateReservationStartRequest(
  value: unknown,
): ValidationResult<ReservationStartRequest> {
  if (
    !isPlainRecord(value) ||
    !isSafeIdentifier(value.quoteId) ||
    !isNonEmptyString(value.quoteValidUntil)
  ) {
    return invalid('reservation', 'validation.reservation');
  }

  const context = validateMarketLocaleContext(value.context);
  const buildId = isSafeIdentifier(value.buildId) ? value.buildId : undefined;
  const inventoryId = isSafeIdentifier(value.inventoryId) ? value.inventoryId : undefined;
  const hasBuild = buildId !== undefined;
  const hasInventory = inventoryId !== undefined;
  if (!context.valid || hasBuild === hasInventory) {
    return invalid('reservation.context', 'validation.reservation');
  }

  return valid({
    context: context.value,
    quoteId: value.quoteId,
    quoteValidUntil: value.quoteValidUntil,
    ...(hasBuild ? { buildId } : { inventoryId }),
  });
}

/** Default contract outcome until an approved valuation provider is connected. */
export function createUnavailableTradeInOutcome(): TradeInPreliminaryOutcome {
  return { status: 'unavailable', disclosureKey: 'trade-in.noConfirmedValuation' };
}

export function getInventoryReservationEligibility(
  inventory: InventoryVehicle,
  now: string,
): { readonly eligible: boolean; readonly reasonKey?: string } {
  if (inventory.status === 'sold') {
    return { eligible: false, reasonKey: 'inventory.sold' };
  }
  if (inventory.status !== 'available') {
    return { eligible: false, reasonKey: 'inventory.unavailable' };
  }
  const freshUntil = Date.parse(inventory.freshUntil);
  const currentTime = Date.parse(now);
  if (!Number.isFinite(freshUntil) || !Number.isFinite(currentTime) || freshUntil <= currentTime) {
    return { eligible: false, reasonKey: 'inventory.stale' };
  }
  return { eligible: true };
}

export function canSendTransactionalNotification(request: NotificationRequest): boolean {
  return request.consent.categories.necessary === true;
}

export function canSendMarketingNotification(request: MarketingNotificationRequest): boolean {
  return request.consent.categories.marketing === true;
}

/** High-risk account requests require a recent, explicit reauthentication. */
export function requiresRecentReauthentication(action: AccountHighRiskAction): boolean {
  return (
    action === 'contact-details-change' ||
    action === 'privacy-export' ||
    action === 'account-deletion'
  );
}

export function hasRecentReauthentication(
  session: AccountSession,
  now: string,
  maximumAgeMs = 15 * 60 * 1000,
): boolean {
  if (session.reauthenticatedAt === undefined) {
    return false;
  }
  const reauthenticatedAt = Date.parse(session.reauthenticatedAt);
  const currentTime = Date.parse(now);
  return (
    Number.isFinite(reauthenticatedAt) &&
    Number.isFinite(currentTime) &&
    currentTime >= reauthenticatedAt &&
    currentTime - reauthenticatedAt <= maximumAgeMs
  );
}

export function isValidReservationTransition(
  from: Reservation['status'],
  to: Reservation['status'],
): boolean {
  const permitted: Readonly<Record<Reservation['status'], readonly Reservation['status'][]>> = {
    draft: ['payment-pending', 'cancelled', 'expired', 'failed'],
    'payment-pending': ['reserved', 'failed', 'expired', 'cancelled'],
    reserved: ['refunded', 'cancelled'],
    failed: ['payment-pending', 'cancelled'],
    expired: [],
    cancelled: [],
    refunded: [],
    unavailable: [],
  };
  return permitted[from].includes(to);
}

export function validatePaymentWebhookEvent(value: unknown): ValidationResult<PaymentWebhookEvent> {
  if (!isPlainRecord(value)) {
    return invalid('webhook', 'validation.paymentWebhook');
  }

  const eventTypes = ['payment-authorized', 'payment-failed', 'payment-refunded'] as const;
  if (
    !isSafeIdentifier(value.providerEventId) ||
    !isSafeIdentifier(value.provider) ||
    !isNonEmptyString(value.receivedAt) ||
    !isSafeIdentifier(value.reservationId) ||
    !isNonEmptyString(value.paymentReference) ||
    !eventTypes.includes(value.eventType as (typeof eventTypes)[number])
  ) {
    return invalid('webhook', 'validation.paymentWebhook');
  }

  return valid({
    providerEventId: value.providerEventId,
    provider: value.provider,
    receivedAt: value.receivedAt,
    reservationId: value.reservationId,
    eventType: value.eventType as PaymentWebhookEvent['eventType'],
    paymentReference: value.paymentReference,
  });
}

function validateLeadContact(value: unknown): ValidationResult<LeadSubmission['contact']> {
  if (
    !isPlainRecord(value) ||
    !isNonEmptyString(value.firstName) ||
    !isNonEmptyString(value.lastName)
  ) {
    return invalid('contact', 'validation.contact');
  }
  if (!isNonEmptyString(value.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
    return invalid('contact.email', 'validation.email');
  }
  if (value.telephone !== undefined && !isNonEmptyString(value.telephone)) {
    return invalid('contact.telephone', 'validation.telephone');
  }
  return valid({
    firstName: value.firstName,
    lastName: value.lastName,
    email: value.email,
    ...(value.telephone === undefined ? {} : { telephone: value.telephone }),
  });
}

function validateTradeInVehicle(
  value: unknown,
): ValidationResult<NonNullable<LeadSubmission['tradeInVehicle']>> {
  if (
    !isPlainRecord(value) ||
    !isNonEmptyString(value.make) ||
    !isNonEmptyString(value.model) ||
    !isFiniteNumber(value.modelYear) ||
    !Number.isInteger(value.modelYear)
  ) {
    return invalid('tradeInVehicle', 'validation.tradeInVehicle');
  }
  if (value.registration !== undefined && !isNonEmptyString(value.registration)) {
    return invalid('tradeInVehicle.registration', 'validation.tradeInVehicle');
  }
  return valid({
    make: value.make,
    model: value.model,
    modelYear: value.modelYear,
    ...(value.registration === undefined ? {} : { registration: value.registration }),
  });
}

function validateConsentSnapshot(
  value: unknown,
): ValidationResult<Pick<ConsentRecord, 'categories' | 'version'>> {
  if (
    !isPlainRecord(value) ||
    !isPlainRecord(value.categories) ||
    !isNonEmptyString(value.version)
  ) {
    return invalid('consent', 'validation.consent');
  }
  const categories = value.categories;
  if (
    typeof categories.necessary !== 'boolean' ||
    typeof categories.preferences !== 'boolean' ||
    typeof categories.analytics !== 'boolean' ||
    typeof categories.marketing !== 'boolean'
  ) {
    return invalid('consent.categories', 'validation.consent');
  }
  return valid({
    categories: {
      necessary: categories.necessary,
      preferences: categories.preferences,
      analytics: categories.analytics,
      marketing: categories.marketing,
    },
    version: value.version,
  });
}

function validateMarketLocaleContext(value: unknown): ValidationResult<MarketLocaleContext> {
  if (
    !isPlainRecord(value) ||
    (value.locale !== 'en' && value.locale !== 'zh-Hans') ||
    (value.market !== 'au' && value.market !== 'cn')
  ) {
    return invalid('context', 'validation.context');
  }
  return valid({ locale: value.locale, market: value.market });
}
