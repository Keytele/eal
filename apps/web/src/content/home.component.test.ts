import { describe, expect, it } from 'vitest';

import { selectHomepageHero } from './home';

describe('selectHomepageHero', () => {
  it('uses the pending state until an approved market-local campaign is supplied', () => {
    expect(selectHomepageHero([], { locale: 'zh-Hans', market: 'cn' })).toEqual({
      kind: 'pending',
    });
  });
});
