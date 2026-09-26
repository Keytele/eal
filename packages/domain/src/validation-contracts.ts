import { isLocale, isMarket } from './context';
import type { LocalizedText, MarketAvailability, MediaAsset, Money, VehicleModel } from './types';
import type { LegalDocument, NewsArticle } from './contracts';
import {
  invalid,
  isFiniteNumber,
  isNonEmptyString,
  isPlainRecord,
  valid,
  type ValidationResult,
} from './validation';

/** Runtime boundary checks for the minimum objects exposed to application code. */
export function validateLocalizedText(value: unknown): ValidationResult<LocalizedText> {
  if (
    !isPlainRecord(value) ||
    !isPlainRecord(value.values) ||
    typeof value.defaultLocale !== 'string' ||
    !isLocale(value.defaultLocale)
  ) {
    return invalid('localizedText', 'validation.localizedText');
  }

  for (const [locale, translation] of Object.entries(value.values)) {
    if (!isLocale(locale) || !isNonEmptyString(translation)) {
      return invalid(`localizedText.values.${locale}`, 'validation.localizedText');
    }
  }

  if (!isNonEmptyString(value.values[value.defaultLocale])) {
    return invalid(`localizedText.values.${value.defaultLocale}`, 'validation.requiredTranslation');
  }

  return valid({
    defaultLocale: value.defaultLocale,
    values: value.values as LocalizedText['values'],
  });
}

export function validateMoney(value: unknown): ValidationResult<Money> {
  if (
    !isPlainRecord(value) ||
    !isFiniteNumber(value.amountMinor) ||
    !Number.isInteger(value.amountMinor) ||
    !isNonEmptyString(value.currency)
  ) {
    return invalid('money', 'validation.money');
  }

  return valid({ amountMinor: value.amountMinor, currency: value.currency });
}

export function validateMarketAvailability(value: unknown): ValidationResult<MarketAvailability> {
  if (
    !isPlainRecord(value) ||
    typeof value.market !== 'string' ||
    !isMarket(value.market) ||
    !isPlainRecord(value.source)
  ) {
    return invalid('marketAvailability', 'validation.marketAvailability');
  }

  const lifecycles = ['announced', 'coming-soon', 'orderable', 'inventory-only', 'discontinued'];
  if (typeof value.lifecycle !== 'string' || !lifecycles.includes(value.lifecycle)) {
    return invalid('marketAvailability.lifecycle', 'validation.lifecycle');
  }

  if (
    !isNonEmptyString(value.source.sourceId) ||
    !isNonEmptyString(value.source.sourceType) ||
    !isNonEmptyString(value.source.retrievedAt)
  ) {
    return invalid('marketAvailability.source', 'validation.source');
  }

  return valid(value as unknown as MarketAvailability);
}

export function validateMediaAsset(value: unknown): ValidationResult<MediaAsset> {
  if (
    !isPlainRecord(value) ||
    !isNonEmptyString(value.id) ||
    !Array.isArray(value.tags) ||
    !isPlainRecord(value.rights)
  ) {
    return invalid('media', 'validation.media');
  }

  const alt = validateLocalizedText(value.alt);
  if (!alt.valid) {
    return invalid('media.alt', 'validation.mediaAlt', alt.issues);
  }

  const validStatuses = ['pending', 'approved', 'retired'];
  const validKinds = ['image', 'video', 'document', 'model-3d'];
  if (
    typeof value.status !== 'string' ||
    !validStatuses.includes(value.status) ||
    typeof value.kind !== 'string' ||
    !validKinds.includes(value.kind) ||
    typeof value.rights.status !== 'string'
  ) {
    return invalid('media', 'validation.media');
  }

  return valid(value as unknown as MediaAsset);
}

export function validateVehicleModel(value: unknown): ValidationResult<VehicleModel> {
  if (
    !isPlainRecord(value) ||
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.slug) ||
    !isFiniteNumber(value.modelYear)
  ) {
    return invalid('vehicleModel', 'validation.vehicleModel');
  }

  const name = validateLocalizedText(value.name);
  if (!name.valid) {
    return invalid('vehicleModel.name', 'validation.vehicleModel', name.issues);
  }

  if (
    !Array.isArray(value.availability) ||
    !Array.isArray(value.specificationIds) ||
    !isPlainRecord(value.source)
  ) {
    return invalid('vehicleModel', 'validation.vehicleModel');
  }

  for (const availability of value.availability) {
    const result = validateMarketAvailability(availability);
    if (!result.valid) {
      return invalid('vehicleModel.availability', 'validation.vehicleModel', result.issues);
    }
  }

  return valid(value as unknown as VehicleModel);
}

export function validateNewsArticle(value: unknown): ValidationResult<NewsArticle> {
  if (
    !isPlainRecord(value) ||
    value.kind !== 'news-article' ||
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.slug) ||
    !isNonEmptyString(value.publishedAt) ||
    !Array.isArray(value.media) ||
    !Array.isArray(value.relatedContent) ||
    !Array.isArray(value.sections)
  ) {
    return invalid('newsArticle', 'validation.newsArticle');
  }

  const title = validateLocalizedText(value.title);
  const author = validateLocalizedText(value.author);
  if (!title.valid || !author.valid) {
    return invalid('newsArticle.title', 'validation.newsArticle');
  }
  for (const media of value.media) {
    const result = validateMediaAsset(media);
    if (!result.valid) {
      return invalid('newsArticle.media', 'validation.newsArticle', result.issues);
    }
  }
  return valid(value as unknown as NewsArticle);
}

export function validateLegalDocument(value: unknown): ValidationResult<LegalDocument> {
  const legalTypes = [
    'privacy',
    'cookies',
    'terms',
    'finance',
    'reservation',
    'vehicle-data',
    'driver-assistance',
    'other',
  ];
  if (
    !isPlainRecord(value) ||
    value.kind !== 'legal-document' ||
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.version) ||
    !isNonEmptyString(value.effectiveAt) ||
    typeof value.documentType !== 'string' ||
    !legalTypes.includes(value.documentType) ||
    !Array.isArray(value.sections)
  ) {
    return invalid('legalDocument', 'validation.legalDocument');
  }
  if (value.legalApproval !== undefined) {
    if (
      !isPlainRecord(value.legalApproval) ||
      !isNonEmptyString(value.legalApproval.owner) ||
      !['pending', 'approved', 'expired'].includes(String(value.legalApproval.status))
    ) {
      return invalid('legalDocument.legalApproval', 'validation.legalApproval');
    }
  }
  return valid(value as unknown as LegalDocument);
}
