/** A stable, translatable error returned at public and adapter boundaries. */
export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_FAILED'
  | 'NOT_FOUND'
  | 'UNAVAILABLE'
  | 'CONFLICT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'TIMEOUT'
  | 'UPSTREAM_FAILURE'
  | 'IDEMPOTENCY_CONFLICT'
  | 'UNSUPPORTED';

export type Retryability = 'never' | 'safe' | 'after-delay';

export interface ApiError {
  readonly code: ApiErrorCode;
  /** Translation key, never a raw provider message. */
  readonly messageKey: string;
  readonly fieldErrors?: Readonly<Record<string, string>>;
  readonly correlationId?: string;
  readonly retryability: Retryability;
}

export type ServiceResult<T> =
  | { readonly ok: true; readonly data: T; readonly correlationId?: string }
  | { readonly ok: false; readonly error: ApiError };

export interface AdapterFailure {
  readonly kind:
    | 'invalid-request'
    | 'not-found'
    | 'conflict'
    | 'unauthorized'
    | 'forbidden'
    | 'rate-limited'
    | 'timeout'
    | 'unavailable'
    | 'unsupported'
    | 'unknown';
  readonly correlationId?: string;
  readonly retryAfterSeconds?: number;
}

export function success<T>(data: T, correlationId?: string): ServiceResult<T> {
  return correlationId === undefined ? { ok: true, data } : { ok: true, data, correlationId };
}

export function failure<T = never>(error: ApiError): ServiceResult<T> {
  return { ok: false, error };
}

export function unavailable<T = never>(
  messageKey = 'error.serviceUnavailable',
  correlationId?: string,
): ServiceResult<T> {
  return failure({
    code: 'UNAVAILABLE',
    messageKey,
    correlationId,
    retryability: 'after-delay',
  });
}

/**
 * Maps a provider-neutral failure category to the public contract. The raw
 * provider payload is intentionally not accepted here so it cannot leak.
 */
export function mapAdapterFailure<T = never>(input: AdapterFailure): ServiceResult<T> {
  const mapped = mapFailureKind(input.kind);
  return failure({
    ...mapped,
    correlationId: input.correlationId,
  });
}

function mapFailureKind(kind: AdapterFailure['kind']): Omit<ApiError, 'correlationId'> {
  switch (kind) {
    case 'invalid-request':
      return {
        code: 'VALIDATION_FAILED',
        messageKey: 'error.validation',
        retryability: 'never',
      };
    case 'not-found':
      return {
        code: 'NOT_FOUND',
        messageKey: 'error.notFound',
        retryability: 'never',
      };
    case 'conflict':
      return {
        code: 'CONFLICT',
        messageKey: 'error.conflict',
        retryability: 'never',
      };
    case 'unauthorized':
      return {
        code: 'UNAUTHORIZED',
        messageKey: 'error.unauthorized',
        retryability: 'never',
      };
    case 'forbidden':
      return {
        code: 'FORBIDDEN',
        messageKey: 'error.forbidden',
        retryability: 'never',
      };
    case 'rate-limited':
      return {
        code: 'RATE_LIMITED',
        messageKey: 'error.rateLimited',
        retryability: 'after-delay',
      };
    case 'timeout':
      return {
        code: 'TIMEOUT',
        messageKey: 'error.timeout',
        retryability: 'safe',
      };
    case 'unavailable':
      return {
        code: 'UNAVAILABLE',
        messageKey: 'error.serviceUnavailable',
        retryability: 'after-delay',
      };
    case 'unsupported':
      return {
        code: 'UNSUPPORTED',
        messageKey: 'error.unavailable',
        retryability: 'never',
      };
    case 'unknown':
      return {
        code: 'UPSTREAM_FAILURE',
        messageKey: 'error.general',
        retryability: 'after-delay',
      };
  }
}
