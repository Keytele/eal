import { describe, expect, it } from 'vitest';

import { ealMotion } from './index';

describe('motion tokens', () => {
  it('preserves the documented duration and easing contract', () => {
    expect(ealMotion.duration).toEqual({
      instant: 0.09,
      fast: 0.14,
      ui: 0.22,
      panel: 0.36,
      section: 0.52,
      hero: 0.9,
      cinematic: 1.4,
    });
    expect(ealMotion.ease.enter).toEqual([0.16, 1, 0.3, 1]);
    expect(ealMotion.ease.standard).toEqual([0.2, 0.7, 0.2, 1]);
  });
});
