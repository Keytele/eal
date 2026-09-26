import 'server-only';

import {
  createFixedWindowRateLimit,
  hasValidCsrfToken,
  isAllowedMutationOrigin,
} from '@eal/domain';

export type MutationSecurityFailure = 'origin' | 'csrf' | 'content-type' | 'rate-limited';

export interface MutationSecurityResult {
  readonly ok: boolean;
  readonly failure?: MutationSecurityFailure;
  readonly retryAfterSeconds?: number;
}

const mutationRateLimit = createFixedWindowRateLimit(30, 60_000);

export function validateMutationRequest(
  request: Request,
  expectedOrigin: string,
  rateLimitKey: string,
): MutationSecurityResult {
  const origin = request.headers.get('origin') ?? undefined;
  if (!isAllowedMutationOrigin(origin, expectedOrigin)) {
    return { ok: false, failure: 'origin' };
  }

  const cookieToken = readCookie(request.headers.get('cookie'), 'eal-csrf');
  const headerToken = request.headers.get('x-csrf-token') ?? undefined;
  if (!hasValidCsrfToken(cookieToken, headerToken)) {
    return { ok: false, failure: 'csrf' };
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return { ok: false, failure: 'content-type' };
  }

  const decision = mutationRateLimit.check(rateLimitKey);
  return decision.allowed
    ? { ok: true }
    : {
        ok: false,
        failure: 'rate-limited',
        retryAfterSeconds: Math.ceil((decision.resetAt - Date.now()) / 1000),
      };
}

function readCookie(cookieHeader: string | null, name: string): string | undefined {
  if (cookieHeader === null) {
    return undefined;
  }
  const pair = cookieHeader
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(name + '='));
  return pair === undefined ? undefined : decodeURIComponent(pair.slice(name.length + 1));
}
