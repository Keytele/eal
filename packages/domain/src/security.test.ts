import { describe, expect, it } from 'vitest';

import {
  constantTimeEqual,
  createFixedWindowRateLimit,
  hasValidCsrfToken,
  isAllowedMutationOrigin,
  redactSensitiveRecord,
} from './security';

describe('mutation security helpers', () => {
  it('compares CSRF tokens and rejects missing values', () => {
    expect(hasValidCsrfToken('same', 'same')).toBe(true);
    expect(hasValidCsrfToken('same', 'different')).toBe(false);
    expect(hasValidCsrfToken(undefined, 'same')).toBe(false);
    expect(constantTimeEqual('a', 'aa')).toBe(false);
  });

  it('limits a fixed window and resets after the window', () => {
    const limiter = createFixedWindowRateLimit(2, 1000);
    expect(limiter.check('client', 100).allowed).toBe(true);
    expect(limiter.check('client', 200).allowed).toBe(true);
    expect(limiter.check('client', 300).allowed).toBe(false);
    expect(limiter.check('client', 1100).allowed).toBe(true);
  });

  it('requires the same origin and redacts sensitive log fields', () => {
    expect(isAllowedMutationOrigin('https://eal.example', 'https://eal.example/path')).toBe(true);
    expect(isAllowedMutationOrigin('https://attacker.example', 'https://eal.example')).toBe(false);
    expect(redactSensitiveRecord({ email: 'person@example.test', market: 'au' })).toEqual({
      email: '[REDACTED]',
      market: 'au',
    });
  });
});
