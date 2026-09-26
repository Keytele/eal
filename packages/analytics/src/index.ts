import type { LocaleCode, MarketCode } from '@eal/domain';

/** Consent-aware event contracts are introduced in Phase 20. */
export interface AnalyticsContextBoundary {
  locale: LocaleCode;
  market: MarketCode;
}
import type { ConsentRecord, Locale, Market, MarketLocaleContext } from '@eal/domain';

export type AnalyticsEventName =
  | 'vehicle_card_viewed'
  | 'vehicle_selected'
  | 'compare_started'
  | 'compare_vehicle_added'
  | 'technology_article_viewed'
  | 'configurator_started'
  | 'trim_selected'
  | 'exterior_selected'
  | 'wheel_selected'
  | 'package_selected'
  | 'build_saved'
  | 'build_shared'
  | 'inventory_match_viewed'
  | 'finance_estimate_updated'
  | 'test_drive_started'
  | 'test_drive_submitted'
  | 'reservation_started'
  | 'reservation_payment_submitted'
  | 'reservation_completed'
  | 'retailer_search'
  | 'retailer_selected'
  | 'retailer_contact_started'
  | 'locale_changed'
  | 'market_changed'
  | 'vehicle_360_started'
  | 'technology_demo_opened'
  | 'vehicle_video_started'
  | 'technology_diagram_expanded'
  | 'configurator_variant_changed'
  | 'inventory_search'
  | 'appointment_availability_viewed'
  | 'appointment_slot_selected'
  | 'lead_submitted'
  | 'trade_in_started'
  | 'reservation_recovery_viewed'
  | 'payment_checkout_started'
  | 'account_dashboard_viewed'
  | 'privacy_request_started'
  | 'web_vital_measured';

export interface AnalyticsContext extends MarketLocaleContext {
  readonly pageType: string;
  readonly modelId?: string;
  readonly trimId?: string;
  /** Anonymous build identifier only; it must never be a customer/account ID. */
  readonly anonymousBuildId?: string;
  readonly campaignId?: string;
  readonly retailerId?: string;
}

interface EmptyProperties {
  readonly [key: string]: never;
}

export interface AnalyticsPropertiesByEvent {
  readonly vehicle_card_viewed: { readonly modelId: string };
  readonly vehicle_selected: { readonly modelId: string };
  readonly compare_started: EmptyProperties;
  readonly compare_vehicle_added: { readonly modelId: string };
  readonly technology_article_viewed: { readonly articleId: string };
  readonly configurator_started: { readonly modelId: string };
  readonly trim_selected: { readonly trimId: string };
  readonly exterior_selected: { readonly optionId: string };
  readonly wheel_selected: { readonly optionId: string };
  readonly package_selected: { readonly optionId: string };
  readonly build_saved: { readonly anonymousBuildId: string };
  readonly build_shared: { readonly anonymousBuildId: string };
  readonly inventory_match_viewed: {
    readonly matchKind: 'exact' | 'near' | 'similar';
  };
  readonly finance_estimate_updated: { readonly quoteId: string };
  readonly test_drive_started: EmptyProperties;
  readonly test_drive_submitted: { readonly retailerId?: string };
  readonly reservation_started: {
    readonly inventoryId?: string;
    readonly anonymousBuildId?: string;
  };
  readonly reservation_payment_submitted: EmptyProperties;
  readonly reservation_completed: EmptyProperties;
  readonly retailer_search: { readonly hasLocalityFilter: boolean };
  readonly retailer_selected: { readonly retailerId: string };
  readonly retailer_contact_started: { readonly retailerId: string };
  readonly locale_changed: { readonly from: Locale; readonly to: Locale };
  readonly market_changed: { readonly from: Market; readonly to: Market };
  readonly vehicle_360_started: { readonly modelId: string };
  readonly technology_demo_opened: { readonly articleId: string };
  readonly vehicle_video_started: { readonly mediaId: string };
  readonly technology_diagram_expanded: { readonly diagramId: string };
  readonly configurator_variant_changed: {
    readonly modelId: string;
    readonly variant: 'trim' | 'exterior' | 'wheel' | 'package';
  };
  readonly inventory_search: {
    readonly hasLocalityFilter: boolean;
    readonly hasRetailerFilter: boolean;
  };
  readonly appointment_availability_viewed: {
    readonly retailerId: string;
    readonly modelId?: string;
  };
  readonly appointment_slot_selected: { readonly retailerId: string };
  readonly lead_submitted: {
    readonly kind: 'test-drive' | 'retailer-contact' | 'finance' | 'trade-in' | 'register-interest';
  };
  readonly trade_in_started: EmptyProperties;
  readonly reservation_recovery_viewed: { readonly status: 'failed' | 'expired' | 'cancelled' };
  readonly payment_checkout_started: EmptyProperties;
  readonly account_dashboard_viewed: EmptyProperties;
  readonly privacy_request_started: { readonly kind: 'export' | 'deletion' };
  readonly web_vital_measured: {
    readonly metric: 'LCP' | 'INP' | 'CLS';
    readonly value: number;
    readonly rating: 'good' | 'needs-improvement' | 'poor';
  };
}

export type AnalyticsEvent<N extends AnalyticsEventName = AnalyticsEventName> =
  N extends AnalyticsEventName
    ? {
        readonly name: N;
        readonly occurredAt: string;
        readonly context: AnalyticsContext;
        readonly properties: AnalyticsPropertiesByEvent[N];
      }
    : never;

export interface AnalyticsTransport {
  track(event: AnalyticsEvent): Promise<void>;
}

export interface AnalyticsConsentSource {
  get(context: MarketLocaleContext): Promise<ConsentRecord | undefined>;
}

export type TrackOutcome =
  | { readonly delivered: true }
  | {
      readonly delivered: false;
      readonly reason: 'analytics-consent-not-granted' | 'unsafe-payload';
    };

export interface ConsentAwareAnalytics {
  track(event: AnalyticsEvent): Promise<TrackOutcome>;
}

/**
 * Gates every nonessential analytics event before it reaches a transport.
 * The type model and runtime check intentionally exclude PII and payment data.
 */
export function createConsentAwareAnalytics(
  consentSource: AnalyticsConsentSource,
  transport: AnalyticsTransport,
): ConsentAwareAnalytics {
  return {
    async track(event) {
      if (!hasSafeProperties(event.properties)) {
        return { delivered: false, reason: 'unsafe-payload' };
      }

      const consent = await consentSource.get(event.context);
      if (consent?.categories.analytics !== true) {
        return { delivered: false, reason: 'analytics-consent-not-granted' };
      }

      await transport.track(event);
      return { delivered: true };
    },
  };
}

export function createNoopAnalyticsTransport(): AnalyticsTransport {
  return { track: async () => undefined };
}

export interface WebVitalSample {
  readonly metric: 'LCP' | 'INP' | 'CLS';
  readonly value: number;
  readonly rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Keeps RUM payloads small and non-identifying. The caller still supplies the
 * normal consent-aware analytics boundary before this reporter is used.
 */
export function createWebVitalsReporter(
  analytics: ConsentAwareAnalytics,
  context: AnalyticsContext,
): (sample: WebVitalSample) => Promise<TrackOutcome> {
  return (sample) =>
    analytics.track({
      name: 'web_vital_measured',
      occurredAt: new Date().toISOString(),
      context,
      properties: sample,
    });
}

const SENSITIVE_PROPERTY_PATTERN =
  /(email|e-mail|telephone|phone|first.?name|last.?name|address|payment|card|cvv|token|password)/i;

function hasSafeProperties(properties: object): boolean {
  return Object.entries(properties).every(([key, value]) => {
    if (SENSITIVE_PROPERTY_PATTERN.test(key)) {
      return false;
    }

    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === undefined
    );
  });
}
