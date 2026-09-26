import { describe, expect, it } from 'vitest';

import { getServerEnvironment } from './env';

describe('getServerEnvironment', () => {
  it('defaults optional launch capabilities to a safe disabled state', () => {
    const environment = getServerEnvironment({});

    expect(environment.EAL_DEPLOYMENT_ENV).toBe('local');
    expect(environment.EAL_COMMERCE_MUTATIONS_ENABLED).toBe(false);
    expect(environment.EAL_FEATURE_RESERVATION).toBe(false);
  });

  it('rejects production commerce mutations without server-only provider credentials', () => {
    expect(() =>
      getServerEnvironment({
        EAL_DEPLOYMENT_ENV: 'production',
        EAL_APP_ORIGIN: 'https://www.example.test',
        EAL_COMMERCE_MUTATIONS_ENABLED: 'true',
      }),
    ).toThrow('Invalid server environment');
  });
});
