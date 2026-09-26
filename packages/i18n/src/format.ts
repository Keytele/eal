import type { Locale, Money } from '@eal/domain';

export interface NumberFormatOptions {
  readonly maximumFractionDigits?: number;
  readonly minimumFractionDigits?: number;
  readonly useGrouping?: boolean;
}

export type UnitKind =
  'kilometer' | 'meter' | 'kilowatt' | 'kilowatt-hour' | 'kilometer-per-hour' | 'liter';

export interface LocaleTypographyProfile {
  readonly locale: Locale;
  readonly direction: 'ltr';
  readonly writingSystem: 'latin' | 'han';
  readonly fontClass: 'latin' | 'cjk';
}

export function toIntlLocale(locale: Locale): string {
  return locale;
}

export function formatNumber(
  value: number,
  locale: Locale,
  options: NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(toIntlLocale(locale), options).format(value);
}

export function formatMoney(value: Money, locale: Locale): string {
  const fractionDigits =
    new Intl.NumberFormat(toIntlLocale(locale), {
      style: 'currency',
      currency: value.currency,
    }).resolvedOptions().maximumFractionDigits ?? 2;
  const amount = value.amountMinor / 10 ** fractionDigits;
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: 'currency',
    currency: value.currency,
  }).format(amount);
}

export function formatDate(
  value: Date | string | number,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat(toIntlLocale(locale), options).format(new Date(value));
}

export function formatUnit(
  value: number,
  unit: UnitKind,
  locale: Locale,
  options: NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    ...options,
    style: 'unit',
    unit,
  }).format(value);
}

export function formatRange(
  minimum: number,
  maximum: number,
  locale: Locale,
  options: NumberFormatOptions = {},
): string {
  const formatter = new Intl.NumberFormat(toIntlLocale(locale), options);
  return `${formatter.format(minimum)}–${formatter.format(maximum)}`;
}

export function getLocaleTypographyProfile(locale: Locale): LocaleTypographyProfile {
  return locale === 'zh-Hans'
    ? { locale, direction: 'ltr', writingSystem: 'han', fontClass: 'cjk' }
    : { locale, direction: 'ltr', writingSystem: 'latin', fontClass: 'latin' };
}
