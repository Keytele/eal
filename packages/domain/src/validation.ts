import type { ApiError, ServiceResult } from './result';
import { failure, success } from './result';

export interface ValidationIssue {
  readonly path: string;
  readonly messageKey: string;
}

export type ValidationResult<T> =
  | { readonly valid: true; readonly value: T }
  | { readonly valid: false; readonly issues: readonly ValidationIssue[] };

export interface Validator<T> {
  readonly parse: (value: unknown) => ValidationResult<T>;
}

export type BoundaryInputKind = 'url' | 'form' | 'cms-response' | 'provider-response' | 'webhook';

export interface ValidatedBoundaryInput<T> {
  readonly kind: BoundaryInputKind;
  readonly value: T;
}

export function valid<T>(value: T): ValidationResult<T> {
  return { valid: true, value };
}

export function invalid<T = never>(
  path: string,
  messageKey: string,
  additionalIssues: readonly ValidationIssue[] = [],
): ValidationResult<T> {
  return { valid: false, issues: [{ path, messageKey }, ...additionalIssues] };
}

export function validationResultToServiceResult<T>(
  result: ValidationResult<T>,
  correlationId?: string,
): ServiceResult<T> {
  if (result.valid) {
    return success(result.value, correlationId);
  }

  return failure({
    code: 'VALIDATION_FAILED',
    messageKey: 'error.validation',
    fieldErrors: Object.fromEntries(result.issues.map((issue) => [issue.path, issue.messageKey])),
    correlationId,
    retryability: 'never',
  });
}

export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Route and URL tokens must never be interpreted as a path, query, or HTML. */
export function isSafeIdentifier(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(value);
}

export function isSafeIdempotencyKey(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{15,255}$/.test(value);
}

export function validateIdempotencyKey(value: unknown): ValidationResult<string> {
  return isSafeIdempotencyKey(value)
    ? valid(value)
    : invalid('idempotencyKey', 'validation.idempotencyKey');
}

export function validateCorrelationId(value: unknown): ValidationResult<string> {
  return isSafeIdentifier(value)
    ? valid(value)
    : invalid('correlationId', 'validation.correlationId');
}

/**
 * A single entry point for untrusted URL, form, CMS, provider and webhook
 * data. Adapters must call this before exposing data to domain or UI code.
 */
export function validateBoundaryInput<T>(
  kind: BoundaryInputKind,
  input: unknown,
  validator: Validator<T>,
): ValidationResult<ValidatedBoundaryInput<T>> {
  const parsed = validator.parse(input);
  return parsed.valid ? valid({ kind, value: parsed.value }) : parsed;
}

export function mapValidatedExternalResponse<T>(
  input: unknown,
  validator: Validator<T>,
  correlationId?: string,
): ServiceResult<T> {
  return validationResultToServiceResult(validator.parse(input), correlationId);
}

export function toValidationApiError(result: ValidationResult<unknown>): ApiError | undefined {
  if (result.valid) {
    return undefined;
  }

  return {
    code: 'VALIDATION_FAILED',
    messageKey: 'error.validation',
    fieldErrors: Object.fromEntries(result.issues.map((issue) => [issue.path, issue.messageKey])),
    retryability: 'never',
  };
}
