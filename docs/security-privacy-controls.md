# Security and privacy controls

Phases 52 and 58 use the following implementation boundaries:

- `apps/web/next.config.ts` applies CSP, HSTS, frame, content-type, referrer, permissions, and cross-origin policies to every route.
- `apps/web/src/server/security/mutation.ts` is the shared server mutation gate. A write route must check same-origin, double-submit CSRF, JSON content type, and rate limit before parsing a mutation body.
- `packages/domain/src/security.ts` contains the provider-neutral constant-time token comparison, fixed-window limiter, origin check, and log-redaction helpers.
- `apps/web/src/app/api/web-vitals/route.ts` accepts only the allow-listed locale/market/page/metric schema, rate limits the endpoint, and logs no identifiers or raw headers.
- `packages/analytics` rejects sensitive property names and requires analytics consent before transport.

PII is not stored in the local demo. Production adapters must document market-specific retention, deletion/export, access logging, and key rotation before the `providerIntegrations` flag can be enabled. Payment card data remains outside this application and must stay within the hosted-payment provider boundary.

## Mutation checklist

1. Resolve the expected origin from the server environment; never accept a client-supplied origin.
2. Require `eal-csrf` and `x-csrf-token` to match.
3. Validate the request body with a domain validator after the security gate.
4. Attach a correlation and idempotency key before calling an adapter.
5. Redact sensitive fields before structured logging.
6. Return the shared public error contract; never return provider messages.
