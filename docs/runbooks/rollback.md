# Release rollback runbook

Owner: Release team. A production rollback requires the release owner and market owner to agree on the scope.

1. Freeze promotion and record the deployment ID, commit, market, locale, and observed symptom.
2. Prefer a feature-flag rollback when the fault is isolated to a capability or provider.
3. Otherwise promote the last smoke-tested artifact; do not rebuild from a moving dependency lock.
4. Verify `/api/health`, core localized routes, consent behavior, security headers, and provider-safe fallbacks.
5. Confirm cache invalidation for the affected market/locale and make sure no stale price/inventory response remains.
6. Keep the incident flag active until monitoring is stable for the agreed observation window.
7. Attach logs, screenshots, accessibility/performance checks, and the decision owner to the incident record.
