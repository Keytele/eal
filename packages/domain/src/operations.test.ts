import { describe, expect, it } from 'vitest';

import { createUnavailableOperationalServices } from './demo';
import {
  canSendMarketingNotification,
  canSendTransactionalNotification,
  createUnavailableTradeInOutcome,
  createDeterministicIdempotencyRegistry,
  getInventoryReservationEligibility,
  isValidReservationTransition,
  hasRecentReauthentication,
  requiresRecentReauthentication,
  validateAppointmentRequest,
  validateLeadSubmission,
  validateReservationStartRequest,
} from './operations';
import type { IdempotentRequestContext } from './operations';
import type { InventoryVehicle, NotificationRequest } from './types';

const source = {
  sourceId: 'test',
  sourceType: 'inventory' as const,
  retrievedAt: '2026-09-26T00:00:00.000Z',
};

const requestContext: IdempotentRequestContext = {
  context: { locale: 'en', market: 'au' },
  correlationId: 'test-correlation',
  idempotencyKey: 'test-idempotency-key-0001',
  audit: () => undefined,
};

function inventory(status: InventoryVehicle['status'], freshUntil: string): InventoryVehicle {
  return {
    id: 'record-1',
    inventoryId: 'inventory-1',
    context: { locale: 'en', market: 'au' },
    modelId: 's6',
    trimId: 'standard',
    optionIds: [],
    retailerId: 'retailer-1',
    matchKind: 'exact',
    status,
    actualMedia: [],
    updatedAt: '2026-09-26T00:00:00.000Z',
    freshUntil,
    source,
  };
}

describe('operational contracts', () => {
  it('keeps every provider-dependent operation unavailable by default', async () => {
    const services = createUnavailableOperationalServices();
    await expect(
      services.inventory.search(requestContext, { market: 'au' }),
    ).resolves.toMatchObject({ ok: false, error: { code: 'UNAVAILABLE' } });
    await expect(
      services.accounts.getSession({ locale: 'en', market: 'au' }),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: 'UNAVAILABLE' },
    });
  });

  it('requires exactly one live slot or requested time for a booking', () => {
    const base = {
      retailerId: 'retailer-1',
      contact: { firstName: 'Test', lastName: 'Customer', email: 'test@example.test' },
      consent: {
        categories: { necessary: true, preferences: false, analytics: false, marketing: false },
        version: 'v1',
      },
    };
    expect(validateAppointmentRequest({ ...base, slotId: 'slot-1' })).toMatchObject({
      valid: true,
    });
    expect(
      validateAppointmentRequest({
        ...base,
        slotId: 'slot-1',
        startsAt: '2026-10-01T09:00:00.000Z',
      }),
    ).toMatchObject({ valid: false });
  });

  it('requires a valid build or inventory context before reservation can start', () => {
    const base = {
      context: { locale: 'en', market: 'au' },
      quoteId: 'quote-1',
      quoteValidUntil: '2026-10-01T09:00:00.000Z',
    };
    expect(validateReservationStartRequest({ ...base, buildId: 'build-1' })).toMatchObject({
      valid: true,
    });
    expect(validateReservationStartRequest(base)).toMatchObject({ valid: false });
    expect(
      validateReservationStartRequest({ ...base, buildId: 'build-1', inventoryId: 'inventory-1' }),
    ).toMatchObject({ valid: false });
  });

  it('treats trade-in as a preliminary lead, never as a confirmed valuation', () => {
    const base = {
      kind: 'trade-in',
      contact: { firstName: 'Test', lastName: 'Customer', email: 'test@example.test' },
      context: { locale: 'en', market: 'au' },
      source: 'test',
      consent: {
        categories: { necessary: true, preferences: false, analytics: false, marketing: false },
        version: 'v1',
      },
    };
    expect(validateLeadSubmission(base)).toMatchObject({ valid: false });
    expect(
      validateLeadSubmission({
        ...base,
        tradeInVehicle: { make: 'Test', model: 'Vehicle', modelYear: 2020 },
      }),
    ).toMatchObject({ valid: true });
    expect(createUnavailableTradeInOutcome()).toEqual({
      status: 'unavailable',
      disclosureKey: 'trade-in.noConfirmedValuation',
    });
  });

  it('blocks sold and stale inventory from reservation', () => {
    expect(
      getInventoryReservationEligibility(
        inventory('sold', '2026-10-01T00:00:00.000Z'),
        '2026-09-26T00:00:00.000Z',
      ),
    ).toEqual({
      eligible: false,
      reasonKey: 'inventory.sold',
    });
    expect(
      getInventoryReservationEligibility(
        inventory('available', '2026-09-25T00:00:00.000Z'),
        '2026-09-26T00:00:00.000Z',
      ),
    ).toEqual({
      eligible: false,
      reasonKey: 'inventory.stale',
    });
  });

  it('only permits explicit reservation recovery transitions', () => {
    expect(isValidReservationTransition('draft', 'payment-pending')).toBe(true);
    expect(isValidReservationTransition('reserved', 'payment-pending')).toBe(false);
    expect(isValidReservationTransition('refunded', 'reserved')).toBe(false);
  });

  it('records duplicate idempotency and payment webhook submissions deterministically', () => {
    const registry = createDeterministicIdempotencyRegistry();
    expect(registry.claim('appointment', requestContext)).toMatchObject({
      ok: true,
      data: { duplicate: false },
    });
    expect(registry.claim('appointment', requestContext)).toMatchObject({
      ok: true,
      data: { duplicate: true },
    });
    expect(registry.claimWebhook('provider-1', 'event-1')).toMatchObject({
      ok: true,
      data: { duplicate: false },
    });
    expect(registry.claimWebhook('provider-1', 'event-1')).toMatchObject({
      ok: true,
      data: { duplicate: true },
    });
  });

  it('does not permit transactional notifications without necessary consent', () => {
    const request: NotificationRequest = {
      kind: 'appointment-requested',
      context: { locale: 'en', market: 'au' },
      recipientId: 'recipient-1',
      relatedEntityId: 'appointment-1',
      templateKey: 'notification.appointmentRequested',
      consent: {
        categories: { necessary: false, preferences: false, analytics: false, marketing: false },
        version: 'v1',
      },
    };
    expect(canSendTransactionalNotification(request)).toBe(false);
    expect(
      canSendMarketingNotification({
        ...request,
        consent: {
          ...request.consent,
          categories: { ...request.consent.categories, marketing: false },
        },
      }),
    ).toBe(false);
    expect(
      canSendMarketingNotification({
        ...request,
        consent: {
          ...request.consent,
          categories: { ...request.consent.categories, marketing: true },
        },
      }),
    ).toBe(true);
  });

  it('requires recent reauthentication before a high-risk account action', () => {
    expect(requiresRecentReauthentication('account-deletion')).toBe(true);
    expect(
      hasRecentReauthentication(
        {
          accountId: 'account-1',
          context: { locale: 'en', market: 'au' },
          authenticatedAt: '2026-09-26T00:00:00.000Z',
          reauthenticatedAt: '2026-09-26T00:10:00.000Z',
        },
        '2026-09-26T00:20:00.000Z',
      ),
    ).toBe(true);
  });
});
