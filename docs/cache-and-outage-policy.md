# Cache and provider-outage policy

`packages/domain/src/cache-policy.ts` is the shared policy table. Cache keys always include locale, market, and any model-year, provider-version, query, or freshness dimension that affects the response.

| Resource | Cache behavior | Failure behavior |
| --- | --- | --- |
| Editorial and catalog | Public, short-lived, revalidated | Retryable content state is visible; no draft is substituted |
| Price and finance | Private, no stale serving | Hide the quote and show the approved disclosure/retry state |
| Inventory | Private, 30-second freshness window | Block stale matches and ask the user to refresh |
| Retailer discovery | Public, locality/market scoped | Show unavailable state; do not infer opening hours |
| Booking and mutations | No store | Keep the user’s input, require safe retry, and preserve idempotency |

Commercial data is never silently replaced by a stale cache entry. The UI may keep a non-commercial shell and a retry/contact path, but it must not show a price, payment, availability, slot, or reservation outcome when its authoritative provider is unavailable.
