export interface RateLimitDecision {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly resetAt: number;
}

export interface RateLimitGuard {
  check(key: string, now?: number): RateLimitDecision;
  clear(): void;
}

/** Small deterministic fixed-window limiter for adapter/API boundaries and tests. */
export function createFixedWindowRateLimit(limit: number, windowMs: number): RateLimitGuard {
  if (!Number.isInteger(limit) || limit < 1 || !Number.isInteger(windowMs) || windowMs < 1) {
    throw new Error('Rate-limit limit and window must be positive integers.');
  }

  const buckets = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key, now = Date.now()) {
      const current = buckets.get(key);
      const bucket =
        current === undefined || current.resetAt <= now
          ? { count: 0, resetAt: now + windowMs }
          : current;
      bucket.count += 1;
      buckets.set(key, bucket);
      return {
        allowed: bucket.count <= limit,
        remaining: Math.max(0, limit - bucket.count),
        resetAt: bucket.resetAt,
      };
    },
    clear() {
      buckets.clear();
    },
  };
}

/** Constant-time comparison for CSRF/signature tokens of equal or unequal length. */
export function constantTimeEqual(left: string, right: string): boolean {
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

export function hasValidCsrfToken(
  cookieToken: string | undefined,
  headerToken: string | undefined,
) {
  return cookieToken !== undefined && headerToken !== undefined
    ? constantTimeEqual(cookieToken, headerToken)
    : false;
}

export function isAllowedMutationOrigin(
  origin: string | undefined,
  expectedOrigin: string,
): boolean {
  if (origin === undefined) {
    return false;
  }
  try {
    return new URL(origin).origin === new URL(expectedOrigin).origin;
  } catch {
    return false;
  }
}

const SENSITIVE_KEY =
  /(authorization|cookie|email|phone|telephone|name|address|token|secret|password|payment|card|cvv|vin)/i;

export function redactSensitiveRecord(
  value: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      SENSITIVE_KEY.test(key) ? '[REDACTED]' : entry,
    ]),
  );
}
