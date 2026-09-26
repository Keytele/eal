# EAL Production Website Specification Pack

This pack is the implementation reference for a production-ready, bilingual EAL automotive website and dealership commerce experience.

The specification is derived from the supplied EAL visual references in `references/` and turns those concepts into a consistent product, design, engineering, content, and delivery system suitable for implementation by Codex or another coding agent.

## Primary goals

- Preserve the visual language shown in the reference images: dark architectural layouts, dusk imagery, restrained typography, large vehicle photography, thin line icons, white primary actions, and premium editorial spacing.
- Support the complete EAL range: C2, S4, S6, X4, X6, and R9.
- Support English and Simplified Chinese with locale-aware typography, line-breaking, metadata, URLs, pricing, units, and legal content.
- Support model discovery, vehicle comparison, configuration, inventory matching, retailer/dealer discovery, test-drive booking, finance estimates, reservation/checkout, saved builds, and ownership/support content.
- Separate editorial CMS content from operational commerce data such as inventory, pricing, finance, retailer availability, and customer actions.
- Meet production expectations for accessibility, SEO, analytics, security, performance, observability, testing, and deployment.

## Reference images

The visual source of truth is in `references/`:

| File | Primary design role |
| --- | --- |
| `Homepage.png` | Home page, hero composition, vehicle lineup rail, footer treatment |
| `Models page.png` | R9 model-detail composition and bilingual presentation |
| `Example Car Model.png` | S6 model overview/detail structure |
| `Car Shop1.png` | C2 shopping/configuration page |
| `Car Shop2.png` | S4 shopping/configuration page |
| `Car Shop3.png` | S6 shopping/configuration page |
| `Car Shop4.png` | X4 shopping/configuration page |
| `Car Shop5.png` | X6 shopping/configuration page |
| `Tech1.png` | Technology landing page |
| `Tech2.png` | 800V architecture detail page |
| `Tech3.png` | Battery and charging page |
| `Tech4.png` | Intelligent driving page |
| `Tech5.png` | Cabin software and connectivity page |

## Documents

1. `AGENTS.md` — implementation rules for Codex/coding agents.
2. `docs/01_VISUAL_DESIGN_SYSTEM.md` — visual tokens, layout, motion, image treatment.
3. `docs/02_BRANDING.md` — EAL brand usage, voice, naming, typography behavior.
4. `docs/03_UI_COMPONENTS.md` — reusable UI component contracts and states.
5. `docs/04_INFORMATION_ARCHITECTURE.md` — route map and complete page inventory.
6. `docs/05_PAGE_TEMPLATES.md` — page-by-page layout specifications.
7. `docs/06_VEHICLE_MODEL_PAGES.md` — model detail and range behavior.
8. `docs/07_COMMERCE_CONFIGURATOR.md` — shopping, configuration, reservation, finance, inventory.
9. `docs/08_TECHNOLOGY_PAGES.md` — technology landing and subpage patterns.
10. `docs/09_BILINGUAL_LOCALIZATION.md` — English/Chinese architecture and content rules.
11. `docs/10_CONTENT_DATA_CMS.md` — content models and data ownership.
12. `docs/11_TECH_STACK_ARCHITECTURE.md` — recommended production stack and repo structure.
13. `docs/12_BACKEND_INTEGRATIONS.md` — APIs, CRM, DMS, finance, payments, retailer systems.
14. `docs/13_ACCESSIBILITY_SEO_ANALYTICS.md` — WCAG, search, metadata, schema, analytics events.
15. `docs/14_SECURITY_TESTING_DEPLOYMENT.md` — security, testing, CI/CD, release and operations.
16. `docs/15_IMPLEMENTATION_PLAN.md` — phased build plan and Definition of Done.
17. `docs/16_REFERENCE_MAP.md` — exact mapping from the supplied images to implementation patterns.

## Implementation stance

The default reference implementation uses a React/Next.js architecture, but the design and domain model are framework-independent. Avoid coupling business rules to UI components. Build all pricing, inventory, finance, retailer, and reservation functionality behind typed service interfaces so providers can be replaced without redesigning the frontend.

## Non-negotiable production requirements

- TypeScript strict mode.
- Server-side validation for all writes.
- English and Simplified Chinese parity for every public route.
- WCAG 2.2 AA target.
- Responsive behavior from 320 px to large desktop.
- Core Web Vitals monitored in production.
- All commerce actions auditable and idempotent.
- Pricing and finance estimates must expose source, timestamp, market, tax treatment, and legal disclaimer metadata.
- Inventory availability must never be inferred from stale CMS content.
- Vehicle specifications must come from structured vehicle data, not hard-coded page copy.
- All reference-image text is design inspiration only; final production claims and prices must come from approved data/content sources.
