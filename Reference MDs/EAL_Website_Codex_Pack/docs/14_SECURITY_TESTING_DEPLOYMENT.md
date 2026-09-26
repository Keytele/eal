# 14 — Security, Testing and Deployment

## Security baseline

- HTTPS only.
- HSTS.
- secure cookies.
- SameSite policy appropriate to integrations.
- CSP with nonces/hashes.
- X-Content-Type-Options.
- Referrer policy.
- permissions policy.
- dependency scanning.
- secret scanning.

## Input validation

All external input is untrusted:

- form data.
- URL params.
- CMS responses.
- provider APIs.
- webhooks.

Validate server-side using shared schemas.

## Authentication/authorization

- Least privilege.
- Separate customer and admin roles.
- Require re-authentication for high-risk account changes where appropriate.
- Protect internal preview/admin endpoints.

## Rate limiting

Protect:

- login.
- test-drive submissions.
- retailer contact.
- finance/trade-in leads.
- reservation creation.
- search abuse.

## CSRF

Protect state-changing cookie-authenticated requests using framework-safe patterns/tokens.

## PII

- Encrypt in transit.
- Encrypt sensitive data at rest.
- Collect only necessary data.
- Define retention periods.
- Provide deletion/export workflow where required.

## Payments

- Use hosted/tokenized provider fields.
- Do not log card data.
- Verify webhook signatures.
- Reconcile payment status server-side.

## Testing pyramid

### Unit

Test:

- pricing calculations.
- configuration compatibility.
- finance formatting.
- locale formatting.
- state reducers/domain services.

### Component

Test:

- selectors.
- modals/drawers.
- form validation.
- build summary.
- responsive navigation.

### End-to-end

Use Playwright or equivalent.

Required scenarios:

1. Home → S6 → configure.
2. Select trim/color/wheels → price updates.
3. Save/share build.
4. Match inventory.
5. Book test drive.
6. Retailer search.
7. Reserve with mocked payment provider.
8. Payment failure/retry.
9. English → Chinese route-preserving switch.
10. Keyboard-only configurator.

### Accessibility

- axe automation on templates.
- manual keyboard audit.
- screen-reader smoke test on critical flows.

### Visual regression

Use screenshot regression for:

- homepage.
- model overview.
- shop page.
- configurator.
- technology page.
- mobile states.
- Chinese layout.

## CI pipeline

On pull request:

1. lint.
2. typecheck.
3. unit tests.
4. component tests.
5. build.
6. accessibility smoke.
7. selected E2E.
8. visual diff.

On main/release:

- full E2E.
- security scan.
- migration check.
- deployment to staging.
- smoke tests.
- production promotion.

## Environments

- local.
- preview per PR.
- development/shared integration.
- staging.
- production.

Keep provider credentials isolated per environment.

## Feature flags

Use for:

- finance provider rollout.
- reservation capability.
- new configurator.
- market launches.
- new model launches.

## Database migrations

- Forward-only where practical.
- reviewed migrations.
- staging validation.
- safe rollback strategy.

## Observability

Track:

- request latency.
- external provider latency/error rate.
- reservation failures.
- payment webhook failures.
- inventory sync lag.
- booking submission failure rate.
- Core Web Vitals.

## Incident readiness

Define runbooks for:

- pricing provider outage.
- inventory outage.
- payment outage.
- retailer API outage.
- CMS outage.
- bad content publish.

Graceful degradation examples:

- Model pages remain available when inventory is offline.
- Shopping page shows `Price currently unavailable` instead of stale data.
- Booking can fall back to contact request if live slots fail.
