import type { CampaignHero, MarketLocaleContext } from '@eal/domain';

export type HomepageHeroSelection =
  { readonly kind: 'approved'; readonly campaign: CampaignHero } | { readonly kind: 'pending' };

/**
 * Selects only an approved, in-window, rights-cleared campaign for the exact
 * locale/market context. An empty or invalid candidate list intentionally
 * produces the explicit placeholder experience instead of invented copy.
 */
export function selectHomepageHero(
  candidates: readonly CampaignHero[],
  context: MarketLocaleContext,
  now = new Date(),
): HomepageHeroSelection {
  const timestamp = now.getTime();
  const campaign = candidates.find((candidate) => {
    if (
      candidate.context.locale !== context.locale ||
      candidate.context.market !== context.market ||
      candidate.status.locale !== context.locale ||
      !['published', 'scheduled'].includes(candidate.status.status) ||
      candidate.media.status !== 'approved' ||
      candidate.media.rights.status !== 'cleared'
    ) {
      return false;
    }

    const effectiveFrom = candidate.source.effectiveFrom;
    const effectiveTo = candidate.source.effectiveTo;
    if (candidate.status.status === 'scheduled' && effectiveFrom === undefined) {
      return false;
    }
    if (effectiveFrom !== undefined && new Date(effectiveFrom).getTime() > timestamp) {
      return false;
    }
    return effectiveTo === undefined || new Date(effectiveTo).getTime() >= timestamp;
  });

  return campaign === undefined ? { kind: 'pending' } : { kind: 'approved', campaign };
}
