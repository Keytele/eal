import { describe, expect, it } from 'vitest';

import { expandSearchTerms, searchSiteIndex, tokenizeSearchTerm } from './search';

describe('site search', () => {
  it('expands English synonyms without exposing operational inventory records', () => {
    const results = searchSiteIndex({ locale: 'en', market: 'au' }, 'dealer');
    expect(results.some((result) => result.kind === 'retailer')).toBe(true);
    expect(results.some((result) => result.id.includes('inventory'))).toBe(false);
  });

  it('tokenizes CJK text and matches localized technology aliases', () => {
    expect(tokenizeSearchTerm('智能驾驶', 'zh-Hans')).toContain('智');
    expect(expandSearchTerms('充电', 'zh-Hans')).toContain('charging');
    expect(searchSiteIndex({ locale: 'zh-Hans', market: 'cn' }, '充电')).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'technology-800v' })]),
    );
  });

  it('returns an empty result for blank or unknown terms', () => {
    expect(searchSiteIndex({ locale: 'en', market: 'au' }, '   ')).toEqual([]);
    expect(searchSiteIndex({ locale: 'en', market: 'au' }, 'not-a-site-term')).toEqual([]);
  });
});
