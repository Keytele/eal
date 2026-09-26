# Provider outage runbook

Owner: Platform integrations on-call. Review: quarterly and after every incident.

## Detect

- Check health, provider latency/failure alerts, inventory freshness lag, booking error rate, payment reconciliation, and web-vitals dashboards.
- Use the correlation ID from the structured log to trace one request without opening raw customer payloads.

## Contain

1. Identify the affected provider/resource: CMS, catalog, price, finance, inventory, retailer, booking, payment, or notification.
2. Disable only the owning feature flag. Keep browsing and non-dependent routes available.
3. Confirm the fallback is `unavailable`, `stale-blocked`, or a safe static experience. Never enable a stale commercial response.
4. If a write provider is affected, pause retries until idempotency/reconciliation is confirmed.

## Communicate and recover

- Add the incident ID, start time, market, locale, provider, flag change, and owner to the release record.
- Revalidate a fresh response in staging, then run the affected smoke and adapter contract tests.
- Restore the flag gradually, monitor for one full freshness window, and record the rollback decision.
