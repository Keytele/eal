# 11 — Recommended Tech Stack and Architecture

## Reference stack

### Frontend

- Next.js App Router.
- React.
- TypeScript strict mode.
- Tailwind CSS backed by CSS custom-property design tokens, or CSS Modules if the team prefers stricter encapsulation.
- Radix-style accessible primitives for dialogs, popovers and menus.
- `next-intl` or equivalent for localization.
- Zod or equivalent for runtime schemas.
- React Hook Form or equivalent for complex forms.

Avoid a large general-purpose component framework whose default visual language fights the EAL design.

## Backend/application layer

Use Next.js server functions/API routes for simple orchestration, but isolate domain services under a dedicated application layer.

Recommended services:

- PostgreSQL.
- Prisma or Drizzle ORM.
- Redis for short-lived locks/session/cache where required.
- Object storage/CDN for user-generated or operational media where CMS CDN is not used.

## CMS

Recommended categories:

- Headless CMS with localized structured content and preview.

Possible implementations:

- Sanity.
- Contentful.
- Payload CMS.

The codebase must wrap CMS access behind a repository interface.

## Search

Options:

- Algolia for managed multilingual search.
- Elasticsearch/OpenSearch for larger enterprise deployments.
- Meilisearch for self-hosted simpler deployment.

Use separate inventory search index if operational inventory volume/freshness differs from editorial search.

## Payments

Use a PCI-compliant payment provider through hosted elements or checkout APIs. Stripe is a suitable reference adapter but should not leak into domain code.

## Authentication

Support optional customer accounts.

Reference options:

- Auth.js.
- enterprise identity provider.
- passwordless email/SMS.

Account should support:

- saved builds.
- favorites.
- appointments.
- reservations/orders.

## Maps

Use provider abstraction:

- Mapbox.
- Google Maps.

The retailer list must remain usable if map scripts fail.

## Analytics/observability

- GA4 or enterprise analytics platform.
- first-party event schema.
- consent-aware loading.
- Sentry for error reporting.
- OpenTelemetry for tracing.
- structured server logs.

## Deployment

Two supported patterns:

### Managed Next.js

- Vercel or equivalent.
- managed Postgres.
- managed Redis.
- CMS CDN.

### Enterprise cloud

- Containerized Node/Next app.
- AWS ECS/EKS or equivalent.
- RDS Postgres.
- ElastiCache Redis.
- CloudFront/CDN.
- WAF.

## Recommended monorepo layout

```text
/
  apps/
    web/
    admin/              # optional internal tooling
  packages/
    ui/
    design-tokens/
    i18n/
    domain/
    vehicle-data/
    analytics/
    testing/
  docs/
  public/
```

## Web app structure

```text
apps/web/src/
  app/
    [locale]/
      [market]/
        vehicles/
        technology/
        shop/
        configure/
        inventory/
        retailers/
        account/
  components/
    global/
    vehicle/
    commerce/
    editorial/
    forms/
  features/
    configurator/
    inventory/
    booking/
    reservation/
    finance/
  server/
    services/
    repositories/
    adapters/
    auth/
  lib/
  styles/
```

## Service interfaces

Domain code should depend on interfaces such as:

```ts
interface PricingService {}
interface InventoryService {}
interface RetailerService {}
interface FinanceService {}
interface ReservationService {}
interface LeadService {}
interface CmsRepository {}
interface VehicleCatalogRepository {}
```

Implement provider adapters separately.

## Caching

- Editorial: cache aggressively with tag invalidation.
- Catalog/specs: cache by market/model year.
- Price: short-lived, market-aware.
- Inventory: short-lived or real-time depending provider.
- Retailer hours: moderate TTL.
- Checkout/reservation: no response cache.

## Image strategy

- Use responsive formats through framework image optimization or image CDN.
- Generate AVIF/WebP where useful.
- Preserve high-quality hero imagery.
- Preload only the LCP image.
- Lazy-load below-fold gallery media.

## Client-state rule

Use client state only for interaction. The canonical state for important commerce configuration must be recoverable from:

- URL parameters/build ID.
- server session.
- persisted build object.

Do not make the configurator depend solely on ephemeral in-memory state.
