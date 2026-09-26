# EAL Production Website Implementation Blueprint

## Purpose

This document translates the supplied EAL specification pack and visual reference screens into an implementation-ready production blueprint. It governs a full automotive brand and dealership experience, not a visual-only marketing site.

This repository currently contains planning inputs and brand/reference assets only. Implementation work must preserve that boundary until a web application repository is deliberately scaffolded.

## Source of truth

Resolve conflicts in this order:

1. Live, validated operational data for price, inventory, retailer availability, finance, bookings, and reservations.
2. Approved, versioned CMS content and legal copy.
3. Structured product/PIM data for models, trims, options, specifications, and compatibility.
4. The Markdown specifications in \`Reference MDs/EAL_Website_Codex_Pack\`.
5. The animation specification in [Reference MDs/18_ANIMATION_MOTION_SYSTEM.md](Reference%20MDs/18_ANIMATION_MOTION_SYSTEM.md), for motion behavior only.
6. The reference images in \`Reference MDs/EAL_Website_Codex_Pack/references\`.
7. Safe production defaults.

Visible copy, prices, finance offers, technical values, and availability shown in reference images are design placeholders only. They must never be copied into production.

## Reference analysis

### Canonical design references

Use the higher-quality image set in \`Reference MDs/EAL_Website_Codex_Pack/references\` as the canonical visual source. \`Reference Photos\` contains duplicate visual concepts and can be retained as an alternate inspection set.

| Reference | Implementation role |
| --- | --- |
| \`Homepage.png\` | Dark-first home hero, transparent header, value rail, six-model lineup, compact footer |
| \`Models page.png\` | R9 grand-tourer editorial model detail, dramatic media hierarchy, bilingual treatment |
| \`Example Car Model.png\` | S6-like model overview, metrics, sticky section navigation, editorial split sections |
| \`Car Shop1–5.png\` | C2/S4/S6/X4/X6 shopping layouts, build selectors, pricing panels, persistent summaries |
| \`Tech1.png\` | Technology landing, feature rail, pillars, lower exploration cards |
| \`Tech2–5.png\` | 800V, battery/charging, intelligent-driving, and software/connectivity detail-page patterns |

The image set establishes composition, atmosphere, hierarchy, spacing, controls, and responsive intent. It does not establish content accuracy or legal approval.

### Logo

Use [Logo.png](Logo/Logo.png) as the EAL navigation and footer wordmark. It is a wide, light monochrome mark intended for dark surfaces.

- Preserve intrinsic proportions; never crop, stretch, recolor, outline, emboss, glow, or recreate it as text.
- Reserve clear space of at least one visible logo-stroke height on every side.
- Use a dark alternate asset only if an approved asset is supplied later; do not derive one by editing this PNG.
- Include the logo in the application asset pipeline with descriptive alt text when it links home, and decorative treatment only when the adjacent link has an accessible name.

## Product scope

### Markets and languages

Launch architecture supports multiple markets from day one, with Australia and China treated as independently configured launch markets. Initial UI locales are:

- English: \`en\`
- Simplified Chinese: \`zh-Hans\`

Use locale and market independently. The preferred public route format is:

\`\`\`text
/{locale}/{market}/...
\`\`\`

Examples:

\`\`\`text
/en/au/vehicles/s6
/zh-Hans/cn/vehicles/s6
\`\`\`

Changing locale preserves the equivalent route, model context, and safe build context. Changing market requires fresh market-aware catalog, pricing, finance, inventory, retailer, legal, and cache context.

### Vehicle range

Support these model codes without localizing the codes:

| Model | Product character | Primary page emphasis |
| --- | --- | --- |
| C2 | Compact premium urban crossover | Value, usable space, charging, core trim differentiation |
| S4 | Premium electric fastback | Aerodynamics, performance, long-distance comfort |
| S6 | Executive flagship sedan | Rear cabin, refinement, quietness, advanced chassis systems |
| X4 | Compact premium family SUV | Cargo, flexible seating, family technology |
| X6 | Large three-row flagship SUV | Seating, cargo, towing, long-distance family comfort |
| R9 | Halo electric grand tourer | Proportion, active aero, performance, GT comfort |

Every model must have market-specific lifecycle state: \`announced\`, \`coming-soon\`, \`orderable\`, \`inventory-only\`, or \`discontinued\`. CTAs derive from lifecycle rather than being hard-coded.

### Required public experience

Implement all route families from the reference pack:

- Brand: homepage, vehicles, compare, design, sustainability, about, news, search.
- Vehicle: overview, exterior, interior, technology, trims, specifications, gallery for every model.
- Commerce: shop, configurator, saved/shared builds, inventory, reservation, finance, payment estimator, finance handoff, trade-in.
- Retail: retailers, retailer detail, test-drive booking, contact.
- Technology: landing, 800V, battery/charging, intelligent driving, software/connectivity, energy ecosystem, safety.
- Ownership and support: ownership hub, charging, warranty, service, roadside assistance, manuals, support.
- Optional account: dashboard, builds, favorites, appointments, orders, profile.
- Legal and utility: privacy, cookies, terms, accessibility, finance/vehicle/driver-assistance legal pages, sitemap, 404, 500, maintenance.

## Experience and design system

### Visual direction

The site is dark-first, cinematic, precise, and editorial. It should feel like a premium automotive brand experience rather than a rounded SaaS dashboard or generic e-commerce store.

- Graphite/navy surfaces, white/light content, warm amber atmosphere, and blue only for functional ADAS visualization.
- Full-bleed dusk/night vehicle photography with restrained copy overlays.
- Vehicle media dominates the layout; cards are flat or lightly translucent with fine separators.
- Latin display text can use uppercase and generous tracking. Chinese uses normal casing, minimal tracking, wider containers, and slightly more line-height.
- Use thin consistent line icons, low radii, light primary buttons with dark text, and outlined secondary buttons.
- Keep motion controlled: 180–260 ms for ordinary interactions, 400–700 ms for editorial reveals, no unnecessary spring animation, and respect reduced motion.

### Token baseline

Use semantic design tokens rather than arbitrary per-component values. Initial color intent:

\`\`\`css
--eal-bg-950: #06101a;
--eal-bg-900: #0a1520;
--eal-bg-850: #0e1b27;
--eal-surface-800: #13222e;
--eal-surface-750: #182833;
--eal-line: rgba(255, 255, 255, 0.16);
--eal-line-strong: rgba(255, 255, 255, 0.32);
--eal-text: #f5f7f8;
--eal-text-muted: rgba(245, 247, 248, 0.68);
--eal-text-subtle: rgba(245, 247, 248, 0.48);
--eal-inverse: #08111a;
--eal-accent-warm: #d8a466;
\`\`\`

The final implementation must verify contrast rather than assume mockup colors are accessible.

### Layout and responsive rules

- Use a 12-column desktop grid, 1600 px maximum content width, and full-bleed media where appropriate.
- Use 56–72 px large-desktop gutters, 32–48 px laptop gutters, 20–24 px tablet gutters, and 16–20 px mobile gutters.
- Preserve editorial whitespace. Do not compress a dense desktop configuration interface into a stack of generic cards.
- On mobile, make specs scrollable or tile-based, use a horizontal model-section navigation, and replace persistent desktop sidebars with a sticky bottom summary and sheet.
- Support 320 px through large desktop, 200% zoom/reflow, reduced motion, and touch/keyboard interaction.

### Reusable system inventory

Build composable, data-driven systems for:

- Global header/footer, mobile navigation, search, locale/market switcher, consent, and legal disclosure drawer.
- Vehicle hero/media, metric rail, sticky model navigation, vehicle card/lineup rail, specification table, gallery, and 360-viewer fallback.
- Commerce selectors for trim, exterior, interior, wheels, seating, packages, and accessories.
- Build summary, price display, finance estimate, inventory match, retailer map/list, booking, reservation, and account saves.
- Editorial split, feature rail, technology card strip, forms, drawers/dialogs, alerts, status messages, loading/empty/error states.

All reusable UI strings use translation keys or CMS content. Components receive structured data; model-specific claims and options do not live in components.

### Motion implementation boundary

[MOTION_IMPLEMENTATION.md](MOTION_IMPLEMENTATION.md) is the implementation contract for all movement. It fixes the exact duration/easing/distance token set, engine selection, reusable primitives, route-transition fallbacks, motion budgets, and ownership gates.

- Prefer CSS for simple state changes, Motion for React for component/shared-layout transitions, and native View Transitions only as a progressive enhancement with an opacity fallback.
- Use one animation engine per element. GSAP is isolated to approved high-value technical timelines; Three.js/React Three Fiber is isolated behind a default-off feature flag and an equivalent static experience.
- Reduced motion, mobile simplification, no-JavaScript resilience, keyboard/focus behavior, English/Chinese layout parity, and page performance are implementation requirements, not post-launch refinements.
- The asset catalog must include a poster and accessible static equivalent before 3D/WebGL can be enabled; see [assets/3d/README.md](assets/3d/README.md).

## Architecture and data boundaries

### Reference stack

The implementation uses Next.js App Router, React, TypeScript strict mode, a token-backed styling system, accessible primitive components, the typed localization package, runtime schemas such as Zod, and structured form handling. The Phase 01–50 foundation and safe route/contract slice are scaffolded under apps/web and packages; later phases extend those boundaries rather than replacing them.

Use server-rendered content by default. Introduce client components only for interaction islands such as menus, selector controls, maps, galleries, 360 media, and forms.

Recommended shape:

\`\`\`text
apps/web/
packages/ui/
packages/design-tokens/
packages/i18n/
packages/domain/
packages/vehicle-data/
packages/analytics/
packages/testing/
\`\`\`

The scaffold is now active implementation. Keep provider adapters, production secrets, approved content, and user-supplied media behind their documented boundaries until they are explicitly supplied and reviewed.

### Data ownership

Keep three distinct data domains:

1. CMS: editorial pages, campaign heroes, technology/news content, localized media metadata, approved legal documents.
2. Product/PIM: model years, trims, compatibility, structured specifications, colors, interiors, wheels, packages, accessories, lifecycle.
3. Operational services: price quotes, inventory, retailer availability, finance estimates, appointments, leads, reservations, payments, notifications, consent.

Do not use a CMS as the source of real-time price, inventory, booking, or reservation truth.

### Provider-neutral interfaces

Domain logic depends on provider-neutral contracts:

\`\`\`ts
interface CmsRepository {}
interface VehicleCatalogRepository {}
interface PricingService {}
interface InventoryService {}
interface RetailerService {}
interface FinanceService {}
interface AppointmentService {}
interface LeadService {}
interface ReservationService {}
interface PaymentService {}
\`\`\`

Adapters validate external responses at the boundary and map provider failures to a stable public error contract:

\`\`\`ts
interface ApiError {
  code: string;
  messageKey: string;
  fieldErrors?: Record<string, string>;
  correlationId: string;
  retryable: boolean;
}
\`\`\`

### Commerce correctness

A build includes market, locale, model year, trim, drivetrain/battery when applicable, exterior, interior, wheels, seating, packages, accessories, and a pricing snapshot. Its shareable state must be recoverable from URL parameters or a persisted build ID.

- Compatibility rules belong in a validated rules engine, never JSX.
- A pricing quote includes currency, market, taxes/fees treatment, valid period, source, options, incentives, total, and disclosure keys.
- Finance estimates display assumptions, source, and legal disclosure; they never imply finance approval.
- Inventory matching labels exact, near, and similar matches; it never silently substitutes a different vehicle.
- Reservation and payment use server-side final validation, idempotency keys, inventory holds where possible, webhook verification, reconciliation, and audit events.
- Test-drive and lead flows preserve model/build/inventory/retailer context and separate optional marketing consent from required transactional consent.

## Accessibility, discoverability, and quality

### Accessibility

Target WCAG 2.2 AA. Completion requires keyboard operation, visible focus, logical focus order, no traps, semantic HTML, accessible dialogs, text equivalents, appropriate live-region feedback, labeled swatches, contrast verification, zoom/reflow testing, reduced-motion support, and translated accessible names/errors.

Motion must not move focus, postpone an available action, conceal state, or be required to understand a selection or technical explanation. Reduced-motion mode disables parallax, auto-rotation, scroll-scrubbing, cinematic camera movement, autoplay video, and animated technical diagrams while preserving the same content and controls.

### SEO and performance

- Server-render indexable public content with localized metadata, canonical URLs, \`hreflang\`, XML sitemaps by locale/market, and structured data only when current data supports it.
- Use Organization, WebSite, BreadcrumbList, Vehicle, Product/Offer, LocalBusiness, Article, and FAQPage schemas only in valid contexts.
- Target LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 at p75.
- Optimize the LCP hero, lazy-load below-fold media/360 assets, minimize client JavaScript, and consent-gate nonessential scripts.
- Do not delay LCP for JavaScript choreography. Animate compositor-friendly transform and opacity, pause ambient work offscreen or when hidden, and route-load advanced animation dependencies only where used. Profile 4x CPU slowdown, mid-range Android, Safari/iOS, and integrated GPUs.

### Analytics and privacy

Define typed, consent-aware first-party analytics for discovery, configuration, inventory, finance, bookings, reservation, retailer, locale, and market actions. Do not send PII, payment data, or sensitive form values.

Motion itself is not an analytics stream: decorative hovers and reveals emit nothing. With consent, record only intent-bearing interaction events such as 360-viewer start, technology-demo open, video start, diagram expansion, and configurator-variant change through the typed analytics contract.

Persist consent category, version, timestamp, locale, market, and source. Meet each launch market's privacy, retention, deletion/export, and consent requirements before release.

### Security and operations

Require HTTPS/HSTS, secure cookies, CSP, security headers, server-side input validation, rate limiting, CSRF protection, least privilege, secret/dependency scanning, webhook signature verification, encrypted sensitive data, observability, provider-outage runbooks, safe migrations, feature flags, and rollback validation.

## Implementation continuity

Maintain CONTINUITY.md throughout coding and delegated implementation. It records the live execution state rather than planned work:

- Update it before parallel work begins and whenever ownership, file boundaries, dependencies, or shared contracts change.
- Add a short checkpoint after material validation, a pause, a completed workstream, or an implementation-session handoff.
- Record completed task IDs, exact files changed, validation evidence, open risks, and one safe restart instruction.
- Keep newest entries at the top of the running log. Never store credentials, PII, payment data, or unapproved product/legal claims.

Tasks remain planned and tracked in tasks.md; CONTINUITY.md is the recovery record that makes an interrupted implementation resumable.

## Delivery gates

No page or feature is complete until it is:

- Responsive and locale/market aware.
- Accessible by keyboard and assistive technology.
- Built from structured content/data, with loading, empty, unavailable, and error states.
- Covered by relevant unit, component, E2E, accessibility, and visual tests.
- Instrumented with consent-aware analytics where relevant.
- SEO-complete where indexable.
- Connected to a production data source or safely feature-flagged.
- Reviewed for legal/disclaimer obligations.
- Where motion is present, compliant with [MOTION_IMPLEMENTATION.md](MOTION_IMPLEMENTATION.md): tokenized, reduced-motion safe, locale-tested, non-blocking, and performance verified.

See [tasks.md](tasks.md) for the ordered implementation program, [MOTION_IMPLEMENTATION.md](MOTION_IMPLEMENTATION.md) for motion implementation rules, and [SUBAGENTS.md](SUBAGENTS.md) for delegated-work rules.
