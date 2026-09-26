# 07 — Commerce, Shopping and Configurator

## Scope

The commerce layer supports discovery through reservation while keeping business systems replaceable.

Primary flows:

1. Model shopping page.
2. Build/configure.
3. Save/share build.
4. Match build to inventory.
5. Estimate finance/payment.
6. Book test drive.
7. Choose retailer.
8. Reserve vehicle or inventory unit.
9. Receive confirmation.

## Configuration model

```ts
interface VehicleBuild {
  id?: string;
  market: string;
  locale: string;
  model: string;
  modelYear: string;
  trim: string;
  drivetrain?: string;
  battery?: string;
  exteriorColor: string;
  interior: string;
  wheels: string;
  seating?: string;
  packages: string[];
  accessories: string[];
  createdAt?: string;
  pricingSnapshotId?: string;
}
```

## Configuration rules engine

Must support:

- required dependencies.
- incompatibilities.
- market restrictions.
- trim restrictions.
- supply restrictions.
- default options.
- price deltas.

Examples:

- A wheel may require GT trim.
- A two-tone roof may require Luxe/Signature trim.
- A six-seat X6 layout may disable a seven-seat option package.

Do not encode these rules directly in React components.

## Pricing service

Return a server-validated price breakdown:

```ts
interface PriceQuote {
  id: string;
  currency: string;
  market: string;
  vehicleBase: Money;
  options: PriceLine[];
  accessories: PriceLine[];
  destination?: Money;
  taxes?: Money;
  incentives?: PriceLine[];
  total: Money;
  validUntil: string;
  source: string;
  disclaimerKeys: string[];
}
```

### Price UX rules

- Clearly distinguish `starting from` vs exact configured price.
- Label estimated taxes/fees.
- Display price validity/assumptions in disclosure.
- Recalculate server-side before reservation.

## Finance estimates

The payment display in the reference mockups is a design pattern, not a hard-coded promise.

Inputs:

- vehicle price.
- deposit/down payment.
- term.
- APR/rate.
- residual/balloon where applicable.
- fees.
- incentives.
- tax handling.

Outputs:

- representative monthly estimate.
- assumptions.
- legal disclosure.
- source provider.

Do not claim finance approval from an estimate.

## Inventory matching

### Match priority

1. Exact model/trim.
2. Exterior/interior.
3. wheels/options.
4. location/delivery radius.
5. availability timing.

Show match confidence transparently:

- Exact match.
- Near match.
- Similar inventory.

## Reservation

### Reservation states

```ts
type ReservationStatus =
  | 'draft'
  | 'payment-pending'
  | 'reserved'
  | 'failed'
  | 'expired'
  | 'cancelled'
  | 'refunded';
```

### Required guarantees

- Idempotency key for payment/reservation submit.
- Server-side final price validation.
- Inventory lock/hold where provider supports it.
- Atomic handling of payment + reservation outcome.
- Webhook reconciliation.
- Audit trail.

## Checkout fields

Minimum:

- first/last name.
- email.
- phone.
- address where legally required.
- retailer/delivery preference.
- terms acceptance.
- marketing consent separately optional.

Never pre-check marketing consent.

## Saved builds

Support:

- anonymous local build.
- authenticated cloud save.
- shareable read-only build URL.
- duplicate/edit build.
- expiry/version compatibility handling.

## Test drive

Booking flow should allow entry from:

- model page.
- shopping page.
- inventory detail.
- retailer detail.

Persist model/trim/inventory context through the booking flow.

## Trade-in

Trade-in can begin as a lead flow if no valuation provider is integrated.

Fields:

- registration/VIN where allowed.
- make/model/year.
- mileage.
- condition.
- contact info.

Clearly label preliminary estimate vs confirmed valuation.

## Error handling

Commerce actions need explicit states:

- quote unavailable.
- finance provider unavailable.
- inventory just sold.
- selected option became unavailable.
- retailer time slot no longer available.
- payment failed.
- reservation conflict.

Never silently substitute a different vehicle or price.
