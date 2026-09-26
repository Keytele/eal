# 12 — Backend Integrations

## Integration boundaries

Treat all external systems as replaceable adapters.

## 1. Vehicle catalog/PIM

Responsibilities:

- models.
- model years.
- trims.
- options.
- compatibility rules.
- specifications.

API needs:

- list models by market.
- get model catalog.
- get trim/options.
- get config rule set.

## 2. Pricing

Responsibilities:

- base price.
- option/accessory pricing.
- taxes/fees where supported.
- incentives.
- valid-from/valid-until.

Requirements:

- price quote ID.
- timestamp.
- market/currency.
- audit metadata.

## 3. Inventory/DMS

Responsibilities:

- VIN-level availability.
- retailer assignment.
- status.
- arrival date.
- exact configuration.
- actual price.

Integration patterns:

- webhook + scheduled reconciliation preferred.
- polling fallback.

## 4. CRM/leads

Possible providers:

- Salesforce.
- HubSpot.
- retailer-specific CRM.

Lead types:

- test drive.
- contact.
- finance.
- trade-in.
- register interest.

Each lead should carry:

- consent metadata.
- locale.
- market.
- source page/campaign.
- model/trim/build.
- retailer.

## 5. Retailer system

Responsibilities:

- retailer data.
- sales/service capabilities.
- hours.
- test-drive slots.
- geographic coverage.

## 6. Appointment booking

Provide idempotent booking endpoints:

```text
GET  /availability?retailer=&model=&date=
POST /appointments
PATCH /appointments/:id
DELETE /appointments/:id
```

If retailer systems cannot support live slots, collect requested preferences and clearly label as request pending confirmation.

## 7. Finance

Responsibilities:

- representative payment estimates.
- rates/terms.
- application handoff.

Do not ingest sensitive credit data unless the platform is explicitly designed and compliant for it. Prefer secure handoff to finance provider.

## 8. Payments

Use provider-hosted secure payment collection where possible.

Requirements:

- tokenized payment method.
- idempotency keys.
- webhook verification.
- reconciliation job.
- refund handling.

## 9. Geocoding/maps

- address lookup.
- retailer distance.
- directions link.

Do not expose unrestricted server geocoding keys.

## 10. Email/SMS notifications

Transactional messages:

- test-drive request/confirmation.
- reservation confirmation.
- payment receipt.
- appointment updates.
- saved build share optional.

Messages must be localized.

## 11. Consent/CMP

Store consent state with:

- consent category.
- version.
- timestamp.
- locale.
- market.
- source.

## API error contract

Use a stable public error shape:

```ts
interface ApiError {
  code: string;
  messageKey: string;
  fieldErrors?: Record<string, string>;
  correlationId: string;
  retryable: boolean;
}
```

Never return raw provider error messages to users.

## Webhooks

Verify signatures and process asynchronously where possible.

Important webhooks:

- payment success/failure/refund.
- reservation update.
- inventory update.
- appointment confirmation.

Webhook processing must be idempotent.
