import { describe, expect, it } from 'vitest';

import { text } from './copy';

describe('public copy', () => {
  it('has a non-empty localized value for primary actions', () => {
    for (const locale of ['en', 'zh-Hans'] as const) {
      expect(text(locale, 'viewVehicles')).not.toHaveLength(0);
      expect(text(locale, 'configure')).not.toHaveLength(0);
      expect(text(locale, 'bookDrive')).not.toHaveLength(0);
    }
  });
});
