# 15 — Implementation Plan

## Phase 0 — Foundations

Deliverables:

- repository/monorepo.
- lint/type/test setup.
- design tokens.
- i18n routing.
- global header/footer.
- CMS integration shell.
- vehicle catalog interfaces.
- CI/CD preview environments.

Exit criteria:

- English and Chinese skeleton routes render.
- no hard-coded locale strings in core components.
- automated checks pass.

## Phase 1 — Brand and model discovery

Build:

- homepage.
- vehicles index.
- vehicle card/lineup rail.
- model overview template.
- S6 and R9 first reference implementations.
- search shell.

Exit criteria:

- responsive desktop/tablet/mobile.
- WCAG baseline.
- SEO metadata.
- CMS authoring workflow.

## Phase 2 — Technology content

Build:

- technology landing.
- 800V page.
- battery/charging.
- intelligent driving.
- software/connectivity.
- technology card system.

Exit criteria:

- all technology pages bilingual.
- claim footnotes and availability rules implemented.

## Phase 3 — Shopping pages

Build model shopping pages for:

- C2.
- S4.
- S6.
- X4.
- X6.
- R9.

Integrate:

- pricing.
- trims.
- colors.
- wheels.
- finance estimate adapter.

Exit criteria:

- no mock prices in production mode.
- market-aware pricing and legal disclosure.

## Phase 4 — Full configurator

Build:

- stepper.
- rules engine.
- 360/media synchronization.
- build summary.
- save/share.
- account integration optional.

Exit criteria:

- deterministic configuration state.
- URL/build-ID recoverability.
- compatibility rules covered by tests.

## Phase 5 — Retailer, inventory and test drive

Build:

- inventory search/detail.
- retailer locator/detail.
- test-drive booking.
- CRM integration.

Exit criteria:

- live operational data.
- fallback behavior documented/tested.

## Phase 6 — Reservation and finance

Build:

- reservation checkout.
- payment integration.
- finance estimator/application handoff.
- trade-in lead flow.
- confirmation communications.

Exit criteria:

- idempotent reservation.
- payment webhook reconciliation.
- legal review complete.

## Phase 7 — Ownership/account

Build:

- account dashboard.
- saved builds.
- appointments.
- reservations/orders.
- ownership/support hub.

## Phase 8 — Hardening

- performance budget.
- accessibility audit.
- penetration/security testing.
- full visual regression.
- load testing critical APIs.
- disaster/rollback validation.
- analytics QA.
- SEO crawl QA.

## Definition of Done

A page/feature is done only when:

- responsive.
- bilingual.
- keyboard accessible.
- has loading/empty/error states.
- analytics events implemented.
- SEO metadata applied where indexable.
- tested.
- production data source connected or feature flagged.
- legal/disclaimer requirements met.
- no unresolved console errors.
- no hard-coded production prices or availability.
