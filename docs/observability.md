# Observability and CI/CD evidence

The application emits structured JSON log entries through `apps/web/src/server/observability/logger.ts`. Sensitive keys are redacted before serialization. `request-context.ts` accepts a safe correlation ID or creates one, and preserves an upstream trace parent without logging request bodies.

`/api/health` is a no-store liveness endpoint and returns the correlation ID in a response header. It does not claim that unconfigured providers are healthy. `/api/web-vitals` is a consent-gated, allow-listed RUM endpoint for LCP, INP, and CLS.

Launch dashboards should alert on:

- provider error rate or latency by resource, market, and locale;
- inventory freshness beyond its contract window;
- reservation/payment reconciliation failures or duplicate-event conflicts;
- booking availability failure rate;
- LCP, INP, and CLS budget regressions;
- security scan, dependency, or secrets-scan failures.

The quality workflow runs lint, formatting, strict typechecks, unit/component tests, secrets/dependency-direction checks, performance-budget validation, dependency audit, build, a11y smoke, and E2E smoke. The manual release workflow repeats the checks under the selected staging/production environment approval.
