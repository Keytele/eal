/**
 * Values that identify an EAL delivery context. A market is deliberately not a
 * locale: commerce, legal, inventory and content must all remain market aware.
 */
export const SUPPORTED_LOCALES = ['en', 'zh-Hans'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
/** Compatibility name for route/configuration code. Prefer Locale in new code. */
export type LocaleCode = Locale;

export const SUPPORTED_MARKETS = ['au', 'cn'] as const;

export type Market = (typeof SUPPORTED_MARKETS)[number];
/** Compatibility name for route/configuration code. Prefer Market in new code. */
export type MarketCode = Market;

export interface MarketLocaleContext {
  readonly locale: Locale;
  readonly market: Market;
}

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function isMarket(value: string): value is Market {
  return (SUPPORTED_MARKETS as readonly string[]).includes(value);
}

export function isMarketLocaleContext(value: unknown): value is MarketLocaleContext {
  if (!isPlainRecord(value)) {
    return false;
  }

  return (
    typeof value.locale === 'string' &&
    typeof value.market === 'string' &&
    isLocale(value.locale) &&
    isMarket(value.market)
  );
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
