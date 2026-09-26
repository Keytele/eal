# EAL Production Website Task Program

## How to use this tracker

This is the execution plan for the EAL website. It intentionally contains 60 ordered phases so work can be delegated and validated in small, restartable pieces.

- Check a task only after its acceptance condition is met.
- Every task has an owner role, dependency tag, and evidence requirement.
- Read the named source documents in Reference MDs/EAL_Website_Codex_Pack before implementation. When motion is in scope, also read [18_ANIMATION_MOTION_SYSTEM.md](Reference%20MDs/18_ANIMATION_MOTION_SYSTEM.md) and [MOTION_IMPLEMENTATION.md](MOTION_IMPLEMENTATION.md).
- Update CONTINUITY.md before parallel work begins, after meaningful validation, and before any pause or handoff.
- Do not invent prices, inventory, finance terms, legal copy, specifications, or production imagery.

## Phase 01–22 implementation checkpoint

The Phase 01–22 code, contracts, controls, safe fallback states, and validation paths are implemented and evidenced in CONTINUITY.md. Tasks that require an approved live provider, legal/commercial content, or rights-cleared media retain their explicit pending/unavailable behavior until those inputs are supplied; they must not be completed by fabricating data or assets.

Validated evidence: pnpm check, optimized Next build, and local browser checks for market selection, locale preservation, supplied-logo loading, menu/dialog Escape behavior, mobile navigation, and the configurator stepper.

## Phase 01 — Workspace and source baseline

Owner: Foundation. Dependencies: none. References: README, AGENTS, 11, 15, 17.

- [ ] T01.0 Inventory the supplied specifications, logo, canonical reference images, and approved future asset locations. Accept: source inventory is documented with no duplicate asset source treated as authoritative.
- [ ] T01.1 Record the documentation-only starting state and safe restart point in CONTINUITY.md. Accept: a new contributor can identify what exists and what must not yet be changed.
- [ ] T01.2 Define the future application root and package boundaries without creating code prematurely. Accept: the structure aligns with IMPLEMENTATION.md and has one named owner.

## Phase 02 — Delivery governance

Owner: Foundation. Dependencies: T01.0. References: AGENTS, 14, 15, 17.

- [ ] T02.0 Adopt task-ID, review, and evidence conventions across the repository. Accept: all active work can be traced to a task ID.
- [ ] T02.1 Configure the continuity handoff process for sequential and parallel implementation. Accept: every workstream has an owner, file boundary, and restart instruction.
- [ ] T02.2 Define the definition of ready for feature work. Accept: dependencies, acceptance criteria, translation, data, legal, and test needs are explicit before coding starts.

## Phase 03 — Application workspace

Owner: Foundation. Dependencies: T01.2, T02.2. References: 11, 14, 15.

- [ ] T03.0 Create the approved monorepo/application scaffold in a dedicated implementation turn. Accept: web, shared UI, domain, i18n, vehicle-data, analytics, and testing boundaries exist.
- [ ] T03.1 Enable strict TypeScript and prohibit implicit any at application/package boundaries. Accept: typecheck passes with strict mode enabled.
- [ ] T03.2 Establish path aliases and dependency direction rules. Accept: UI cannot directly depend on provider adapters or secrets.

## Phase 04 — Engineering quality baseline

Owner: Foundation. Dependencies: T03.0. References: AGENTS, 11, 14.

- [ ] T04.0 Configure linting, formatting, typechecking, unit tests, component tests, and end-to-end test entrypoints. Accept: each command runs locally and in CI.
- [ ] T04.1 Add a no-secrets and dependency-vulnerability scan to the pipeline. Accept: failing conditions block a pull request.
- [ ] T04.2 Add a change-review checklist for public strings, accessibility, analytics, and legal/data sourcing. Accept: the checklist is referenced by contribution guidance.

## Phase 05 — Environments and configuration

Owner: Foundation. Dependencies: T03.0, T04.0. References: 11, 12, 14.

- [ ] T05.0 Define local, preview, integration, staging, and production environment contracts. Accept: each required variable is named, scoped, and documented without values.
- [ ] T05.1 Implement typed server-only configuration validation. Accept: invalid/missing required configuration fails safely before serving commerce mutations.
- [ ] T05.2 Define feature-flag ownership for market, model, finance, reservation, and provider launches. Accept: every flag has a default, expiry/review owner, and safe fallback.

## Phase 06 — Design tokens

Owner: Design system. Dependencies: T03.0. References: 01, 02, 03, 16, 18, MOTION_IMPLEMENTATION.

- [ ] T06.0 Create semantic color, line, surface, text, status, spacing, radius, and elevation tokens. Accept: no initial component needs raw EAL color values.
- [ ] T06.1 Add responsive typography and layout tokens for Latin and Chinese text. Accept: display/body/caption rules match the approved visual direction without forcing identical line breaks.
- [ ] T06.2 Define controlled motion tokens and reduced-motion overrides. Accept: every shared animated primitive can disable nonessential motion.
- [ ] T06.3 Publish the exact CSS and TypeScript duration, easing, and distance tokens from MOTION_IMPLEMENTATION.md. Accept: token tests reject drift from the documented values and no primitive introduces an arbitrary timing curve.
- [ ] T06.4 Build MotionProvider and the reduced-motion/static-fallback contract. Accept: user preference disables parallax, auto-rotation, scroll-scrubbing, autoplay video, and animated technical diagrams without hiding content or controls.
- [ ] T06.5 Define CSS, Motion for React, View Transitions, GSAP, and WebGL engine boundaries. Accept: each primitive has one engine, View Transitions have opacity fallback, and advanced engines are route-loaded/default-off.

## Phase 07 — Brand asset system

Owner: Design system. Dependencies: T06.0. References: 02, 13, 16.

- [ ] T07.0 Register Logo/Logo.png as the approved EAL logo asset with intrinsic dimensions and usage metadata. Accept: no replacement text/SVG logo is introduced.
- [ ] T07.1 Create logo placement rules for dark header, footer, and responsive navigation. Accept: clear space, alt behavior, and light-surface fallback policy are documented/tested.
- [ ] T07.2 Define media-frame, overlay, crop, and attribution patterns. Accept: all future supplied media can carry alt text, focal point, rights, locale, and market metadata.

## Phase 08 — Locale and market routing

Owner: Localization. Dependencies: T03.0, T05.0. References: 04, 09, 13.

- [ ] T08.0 Implement the canonical locale/market route resolver for en and zh-Hans. Accept: URLs resolve without conflating language with market.
- [ ] T08.1 Implement locale switching that preserves equivalent route/model/build context where safe. Accept: unavailable translation produces a visible controlled fallback.
- [ ] T08.2 Implement market switching with market-aware cache and context invalidation. Accept: stale price, retailer, inventory, and legal data cannot survive a market change.

## Phase 09 — Translation foundations

Owner: Localization. Dependencies: T08.0. References: 02, 03, 09.

- [ ] T09.0 Define typed UI translation-key conventions and locale catalogs. Accept: reusable UI contains no hard-coded public-facing English strings.
- [ ] T09.1 Add localized formatting utilities for dates, currencies, units, ranges, and numbers. Accept: values use Intl behavior rather than manual string concatenation.
- [ ] T09.2 Define locale-aware typography and content fallback tests. Accept: Chinese headings, form errors, navigation, and legal placeholders render without overflow or literal English fallback.

## Phase 10 — Localization content workflow

Owner: Localization. Dependencies: T09.0. References: 09, 10, 13.

- [ ] T10.0 Define CMS localization statuses from draft through translation, review, legal review, approval, and publish. Accept: a locale cannot be accidentally published before the required state.
- [ ] T10.1 Define localized metadata and hreflang inputs per route. Accept: SEO data is represented per locale and market.
- [ ] T10.2 Define CJK-aware search index requirements, aliases, and feature/model synonyms. Accept: the search adapter contract supports both language families.

## Phase 11 — Domain data contracts

Owner: Catalog/domain. Dependencies: T03.1, T05.1. References: 06, 07, 10, 12.

- [ ] T11.0 Define runtime-validated contracts for localized strings, money, media, market availability, and lifecycle. Accept: invalid external values cannot enter UI/domain code unchecked.
- [ ] T11.1 Define VehicleModel, VehicleTrim, specification, option, and configuration contracts. Accept: raw numeric data, units, qualifiers, effective dates, and sources are retained.
- [ ] T11.2 Define build, quote, inventory, retailer, lead, appointment, reservation, and consent contracts. Accept: every operational entity has a stable identifier and audit-relevant context.

## Phase 12 — CMS boundary

Owner: Editorial platform. Dependencies: T11.0. References: 10, 11, 12.

- [ ] T12.0 Create the CMS repository interface and validated response mapper. Accept: page code cannot depend on a CMS vendor SDK directly.
- [ ] T12.1 Model Page, CampaignHero, TechnologyArticle, NewsArticle, LegalDocument, and modular sections. Accept: all localized/media/market/approval fields are represented.
- [ ] T12.2 Define preview, scheduling, draft, and cache invalidation contracts. Accept: a preview cannot contaminate production responses or market contexts.

## Phase 13 — Vehicle catalog and PIM boundary

Owner: Catalog/domain. Dependencies: T11.1. References: 06, 07, 10, 12.

- [ ] T13.0 Create VehicleCatalogRepository methods for models, trims, options, specifications, and configuration rules by market/model year. Accept: all reads are typed and runtime-validated.
- [ ] T13.1 Model lifecycle-driven CTA selection and unavailable-market behavior. Accept: announced, orderable, inventory-only, and discontinued states render correct next actions.
- [ ] T13.2 Create non-production catalog fixtures containing only clearly labeled placeholders. Accept: fixtures cannot be deployed as live price, availability, or approved technical claims.

## Phase 14 — Asset handoff and media catalog

Owner: Editorial platform. Dependencies: T07.2, T12.1. References: 01, 05, 06, 08, 10, 16, 18, MOTION_IMPLEMENTATION.

- [ ] T14.0 Populate the named asset folders only with user-supplied, rights-cleared media. Accept: every asset is registered against its manifest slot.
- [ ] T14.1 Add media metadata validation for alt text, focal point, aspect ratio, mobile crop, model/trim/color tags, locale, and usage rights. Accept: incomplete meaningful media cannot publish.
- [ ] T14.2 Configure responsive image delivery and LCP-preload policy. Accept: only the current page LCP asset is eligible for preload.
- [ ] T14.3 Register video, 360, and 3D manifest requirements, including posters and static/text alternatives. Accept: no advanced media can publish without the [assets/3d/README.md](assets/3d/README.md) metadata and fallback gate.

## Phase 15 — Operational adapter boundary

Owner: Integrations. Dependencies: T11.2, T05.1. References: 07, 11, 12, 14.

- [ ] T15.0 Define provider-neutral interfaces for pricing, inventory, retailers, finance, appointments, leads, reservations, payments, search, maps, notifications, and consent. Accept: feature code imports interfaces, not provider clients.
- [ ] T15.1 Implement typed adapter error mapping to the shared public error contract. Accept: raw provider messages never reach a user.
- [ ] T15.2 Create deterministic test doubles for every adapter. Accept: commerce and error flows can be tested without vendor access.

## Phase 16 — Server mutation safety

Owner: Integrations. Dependencies: T15.0, T11.2. References: 07, 12, 14.

- [ ] T16.0 Define a shared validation pipeline for URL input, form input, CMS/provider responses, and webhook payloads. Accept: mutations reject malformed input server-side.
- [ ] T16.1 Add correlation IDs, retryability classification, and audit-event hooks to operational requests. Accept: failures can be traced without leaking sensitive data.
- [ ] T16.2 Define idempotency-key requirements for appointment, lead, reservation, and payment mutations. Accept: repeat submissions do not create duplicate customer actions.

## Phase 17 — Global header and navigation

Owner: Design system. Dependencies: T06.0, T06.3, T06.4, T08.0, T09.0. References: 01, 03, 04, 05, 16, 18, MOTION_IMPLEMENTATION.

- [ ] T17.0 Build the transparent-to-solid SiteHeader with logo, primary navigation, utility actions, and contextual commerce CTA. Accept: state transitions preserve contrast and keyboard access.
- [ ] T17.1 Build the Vehicles mega menu with data-driven model thumbnails and taxonomy. Accept: it works with pointer, keyboard, touch, and screen reader navigation.
- [ ] T17.2 Build the Technology mega menu and mobile full-screen drawer. Accept: locale/market controls remain available and Escape/focus handling is correct.
- [ ] T17.3 Implement the transparent-to-solid header transition using shared tokens: optional performance-approved blur, 6–10 px compression, and border fade in a 220–300 ms range. Accept: contrast, focus, logo treatment, and navigation semantics remain stable through scroll and reduced-motion states.
- [ ] T17.4 Add non-blocking navigation/route-transition fallbacks. Accept: supported related vehicle routes may use a shared-vehicle View Transition; unsupported, reduced-motion, and no-JS cases retain the same immediate navigation and opacity/static behavior.

## Phase 18 — Footer, consent, and global feedback

Owner: Design system. Dependencies: T17.0, T15.0. References: 03, 04, 13, 14.

- [ ] T18.0 Build the SiteFooter with grouped support, retailer, legal, social, locale, and market links. Accept: all routes/locales are keyboard-accessible and translatable.
- [ ] T18.1 Build consent-aware banner/preferences UI behind a ConsentService interface. Accept: nonessential analytics/marketing scripts do not load before consent.
- [ ] T18.2 Build reusable toast, alert, dialog, drawer, skeleton, retry, and empty-state primitives. Accept: announcements, focus behavior, and non-color status communication pass accessibility checks.

## Phase 19 — Accessible forms and controls

Owner: Design system. Dependencies: T06.2, T09.0. References: 03, 07, 09, 13.

- [ ] T19.0 Build FormField with label, hint, required state, autocomplete, error, and success contracts. Accept: errors are programmatically associated and announced.
- [ ] T19.1 Build accessible selection primitives for tabs, cards, segmented controls, swatches, radio groups, and steppers. Accept: selection is never communicated by color alone.
- [ ] T19.2 Add form focus-management and server-field-error behavior. Accept: submit failures route users to a concise summary and invalid field without a keyboard trap.
- [ ] T19.3 Add tokenized control, validation, progress, and success motion. Accept: buttons press only within 90–120 ms, errors move at most 6 px without shaking fields, and decorative motion never moves focus or obscures a submitted outcome.

## Phase 20 — Analytics foundation

Owner: Analytics. Dependencies: T18.1, T11.2. References: 13, 14.

- [ ] T20.0 Define typed first-party event names, properties, consent categories, and forbidden data fields. Accept: event compilation rejects unknown or sensitive properties.
- [ ] T20.1 Implement consent-aware event dispatch and reliable page/context dimensions. Accept: locale, market, model, campaign, and page type are present only where permitted.
- [ ] T20.2 Add analytics test assertions for critical interactions. Accept: events are validated without sending real user data in tests.
- [ ] T20.3 Add consent-aware motion-intent event definitions for 360 start, technology-demo open, video start, diagram expansion, and configurator-variant change. Accept: decorative hovers/reveals emit nothing and event schemas reject PII or sensitive form data.

## Phase 21 — Homepage hero

Owner: Brand/discovery. Dependencies: T06.3, T06.4, T12.1, T13.0, T14.2, T17.0. References: 01, 02, 05, 16, 18, MOTION_IMPLEMENTATION.

- [ ] T21.0 Build a campaign-driven homepage hero with focal-point media, localized promise, accessible actions, and restrained readability overlay. Accept: it renders without approved-copy assumptions.
- [ ] T21.1 Implement model/market-specific hero campaign selection and scheduled fallback. Accept: unavailable campaign media/copy degrades to a safe published hero.
- [ ] T21.2 Add hero LCP, reduced-motion, image-alt, and responsive-crop tests. Accept: one correct LCP asset is preloaded and motion is controllable.
- [ ] T21.3 Compose the homepage hero reveal with shared primitives: header, media, eyebrow, line-based heading, copy, CTA, then metric rail. Accept: hero media resolves within 800–1100 ms, content stagger is tokenized, total reveal is under 1.8 s, and actions remain available throughout.
- [ ] T21.4 Add the one-pass, low-opacity vehicle light sweep and optional single headlamp reveal only when approved hero media supports it. Accept: the effect never loops, respects reduced motion/Save-Data, and cannot delay LCP or obscure localized copy.
- [ ] T21.5 Implement metric-rail entrance and one-time count-up only for approved structured non-price values. Accept: units stay static, values finish in 600–900 ms, price is never counted, and the static/reduced-motion result is equally readable.

## Phase 22 — Homepage discovery rails

Owner: Brand/discovery. Dependencies: T06.3, T06.4, T20.3, T21.0, T13.0. References: 03, 05, 16, 18, MOTION_IMPLEMENTATION.

- [ ] T22.0 Build the value/technology metric rail from structured content. Accept: decorative icons do not replace textual information.
- [ ] T22.1 Build the six-model VehicleLineupRail with scroll snap and keyboard navigation. Accept: cards expose correct model/lifecycle CTA state.
- [ ] T22.2 Add compact contextual footer integration and homepage analytics. Accept: discovery events are consent-aware and the home page has no horizontal overflow.
- [ ] T22.3 Add tokenized VehicleLineupRail feedback: desktop media zoom to no more than 1.025, 3–5 px vehicle lift, border/arrow/subtitle state, and one active-line pass. Accept: mobile uses snap scrolling plus active-card emphasis without hover dependency.
- [ ] T22.4 Add one-time section reveals for compact discovery groups only. Accept: Reveal uses the shared 24 px/section preset, activates around 15–25% viewport entry, pauses or avoids offscreen work, and does not stagger paragraphs.
- [ ] T22.5 Validate home discovery motion in English and Simplified Chinese. Accept: Chinese uses line/block/phrase reveal with near-static tracking, English-only masks are not reused, and no rail creates layout shift or blocked keyboard access.

## Phase 23 — Vehicle range and filters

Owner: Brand/discovery. Dependencies: T13.0, T17.0, T20.0. References: 04, 05, 06.

- [ ] T23.0 Build the vehicles index with market-aware model collection and body-type taxonomy. Accept: lifecycle-unavailable models have controlled presentation.
- [ ] T23.1 Implement URL-addressable body type, seats, range, price-band, and drivetrain filters. Accept: links restore the exact filter state.
- [ ] T23.2 Implement accessible results count, clearing, empty state, and compare entrypoint. Accept: filter changes are announced and do not trap focus.

## Phase 24 — Vehicle comparison

Owner: Brand/discovery. Dependencies: T11.1, T23.0. References: 03, 04, 05, 06, 13.

- [ ] T24.0 Define comparison selection rules for up to three market-available vehicles/trims. Accept: invalid combinations produce an explicit recovery path.
- [ ] T24.1 Build a structured specification comparison table with sticky headers/first column on wide layouts. Accept: it remains accessible and usable on mobile.
- [ ] T24.2 Add difference highlighting, shareable URL state, and comparison analytics. Accept: only structured source data is compared.

## Phase 25 — Shared model overview template

Owner: Vehicle experience. Dependencies: T13.0, T14.2, T17.0. References: 03, 05, 06, 16.

- [ ] T25.0 Build VehicleHero, MetricRail, and sticky model-section navigation from shared contracts. Accept: sections work with keyboard and mobile horizontal tabs.
- [ ] T25.1 Build shared editorial split, technology preview, trim preview, specification highlight, gallery, and CTA sections. Accept: every section supports loading/unavailable content safely.
- [ ] T25.2 Add structured model metadata and breadcrumb rules. Accept: visible hierarchy and schema do not conflict.

## Phase 26 — C2 and S4 model experiences

Owner: Vehicle experience. Dependencies: T25.0, T13.2. References: 05, 06, 16.

- [ ] T26.0 Configure C2 editorial slots around compact dimensions, interior efficiency, range, and approved trim data. Accept: no fixture claim appears in production mode.
- [ ] T26.1 Configure S4 editorial slots around fastback form, aerodynamics, charging, and long-distance comfort. Accept: market-specific data drives all technical values.
- [ ] T26.2 Test lifecycle CTAs, localized routes, media tags, and responsive layouts for C2/S4. Accept: both render correctly in en and zh-Hans.

## Phase 27 — S6 and R9 model experiences

Owner: Vehicle experience. Dependencies: T25.0, T13.2. References: 05, 06, 16.

- [ ] T27.0 Configure S6 sections for executive-cabin and refinement themes using approved CMS/PIM fields. Accept: claims are source-linked and market-aware.
- [ ] T27.1 Implement the R9 editorial variant with optional desktop story rail and performance-oriented hierarchy. Accept: it shares core accessible components rather than a separate design system.
- [ ] T27.2 Test S6/R9 media consistency, CTA lifecycle behavior, and Chinese layout. Accept: content and vehicle identity do not drift across page sections.

## Phase 28 — X4 and X6 model experiences

Owner: Vehicle experience. Dependencies: T25.0, T13.2. References: 05, 06, 16.

- [ ] T28.0 Configure X4 sections for family space, cargo, seating flexibility, and approved family technology. Accept: structured fields determine all specification display.
- [ ] T28.1 Configure X6 sections for seating layout, cargo, towing, and long-distance comfort. Accept: market/trim variation is represented without hard-coded text.
- [ ] T28.2 Test X4/X6 responsive model content, accessibility, and lifecycle CTA behavior. Accept: deep-linked sections and localized metadata work.

## Phase 29 — Model detail routes

Owner: Vehicle experience. Dependencies: T25.1, T26.0, T27.0, T28.0. References: 04, 06, 13.

- [ ] T29.0 Implement exterior, interior, technology, trims, specifications, and gallery deep routes or canonical anchors. Accept: route strategy has canonical metadata and equivalent navigation.
- [ ] T29.1 Build the full SpecificationTable from structured data with market, trim, model-year, source, and footnote support. Accept: no specifications appear as raster-image text.
- [ ] T29.2 Build MediaGallery and static 360 fallback behavior. Accept: meaningful media has alt/caption support and keyboard controls.
- [ ] T29.3 Add gallery crossfade, restrained drag, first-use 360 cue, and static/reduced-motion behavior using shared primitives. Accept: image changes take 300–450 ms, auto-rotation stops on first interaction, and the viewer is fully usable without motion.

## Phase 30 — Technology landing

Owner: Editorial/technology. Dependencies: T12.1, T14.2, T17.0. References: 05, 08, 16.

- [ ] T30.0 Build technology hero and feature rail with approved content and model availability links. Accept: hero slogan is paired with a descriptive page H1.
- [ ] T30.1 Build technology pillars and lower exploration cards from modular CMS content. Accept: all links resolve to localized market-aware routes.
- [ ] T30.2 Add technology discovery analytics and media performance tests. Accept: deferred cards/media do not hurt initial LCP.
- [ ] T30.3 Add technology-card and hero motion within the technology page budget. Accept: only approved compact card groups stagger and no decorative animation emits analytics.

## Phase 31 — 800V architecture

Owner: Editorial/technology. Dependencies: T30.0, T13.0. References: 08, 16.

- [ ] T31.0 Build the 800V topic hero and market/model-specific proof rail. Accept: unavailable values are withheld rather than guessed.
- [ ] T31.1 Build explanatory modules for power electronics, thermal management, battery interface, cabling, and inverter content. Accept: all claims have approval/source fields.
- [ ] T31.2 Define accessible charging-curve, energy-flow, and platform visualization alternatives. Accept: each visual has textual equivalent data/explanation.
- [ ] T31.3 Implement the approved 800V energy-flow/charging-curve sequence behind structured data and a static final-state equivalent. Accept: direction is charger to inlet to battery to inverter to motors, unavailable values are not animated, and reduced motion disables the sequence.

## Phase 32 — Battery and charging

Owner: Editorial/technology. Dependencies: T30.0, T13.0. References: 08, 16.

- [ ] T32.0 Build battery-system hero and structured capacity/range/thermal-control rail. Accept: chemistry and warranty are model-year/market constrained.
- [ ] T32.1 Build pack, cells, structure, conditioning, and charging-intelligence modules. Accept: technical imagery slots map to the asset manifests.
- [ ] T32.2 Build home/DC charging and charging-planner entry sections. Accept: unsupported market capabilities show controlled unavailable states.
- [ ] T32.3 Add optional battery-exploded/cooling sequence only behind approved 3D/media feature flags. Accept: a poster, labelled static diagram, text explanation, staged loading, and reduced-motion fallback exist before activation.

## Phase 33 — Intelligent driving

Owner: Editorial/technology. Dependencies: T30.0, T13.0. References: 08, 13, 16.

- [ ] T33.0 Build the intelligent-driving hero with market-approved descriptive H1 and capability terms. Accept: no language implies unsupported unsupervised autonomy.
- [ ] T33.1 Build sensor, lane, parking, monitoring, and awareness modules from availability data. Accept: each feature states model/trim/market qualification when needed.
- [ ] T33.2 Implement blue ADAS visualization with accessible text equivalents. Accept: essential information is not color- or animation-dependent.
- [ ] T33.3 Add calm sensor/lane/vehicle state transitions with no unsupported-autonomy implication. Accept: static equivalents convey the same state, no hotspot blinks perpetually, and analytics record only explicit demo expansion.

## Phase 34 — Software and connectivity

Owner: Editorial/technology. Dependencies: T30.0, T13.0. References: 08, 16.

- [ ] T34.0 Build cabin-software hero and connected-cabin feature rail. Accept: digital display media uses user-supplied slots and metadata.
- [ ] T34.1 Model feature availability by model, trim, market, software version, and subscription state. Accept: unavailable functions are not advertised as present.
- [ ] T34.2 Build OTA, navigation, digital key, app, profile, audio, and voice modules. Accept: customer-facing functionality has approved localized descriptions.
- [ ] T34.3 Add shared-layout cabin UI demonstrations with a static end-state fallback. Accept: related panels transition from their source tile, locale-specific copy does not clip, and no more than one panel hierarchy changes at once.

## Phase 35 — Energy ecosystem and safety

Owner: Editorial/technology. Dependencies: T30.0, T13.0. References: 04, 08, 13.

- [ ] T35.0 Build energy ecosystem modules for V2L, V2H, home charging, smart schedules, and energy monitoring. Accept: V2H availability is market-gated.
- [ ] T35.1 Build safety engineering route/modules using structured, approved content. Accept: claims can be reviewed independently of visual layout.
- [ ] T35.2 Add related technology/model navigation and localized SEO data. Accept: every technology route has valid title, description, canonical, hreflang, and breadcrumb behavior.

## Phase 36 — Model shopping pages

Owner: Commerce. Dependencies: T13.0, T17.0, T19.1, T15.2. References: 05, 07, 16.

- [ ] T36.0 Build shared model-shopping layout with hero, selection band, metric rail, editorial cards, and persistent summary shell. Accept: it is distinct from the full configurator.
- [ ] T36.1 Add model-specific shopping layouts for C2, S4, S6, X4, X6, and R9 using configuration data. Accept: seating/aero/performance differences are data-driven.
- [ ] T36.2 Implement loading, unavailable, and option-out-of-stock states. Accept: no selector silently picks a substitute option.
- [ ] T36.3 Add restrained shopping selection feedback. Accept: trim/media, swatch, wheel, and interior transitions preserve state and camera angle while price/availability remain immediately readable.

## Phase 37 — Pricing and finance display

Owner: Commerce. Dependencies: T15.0, T16.0, T36.0. References: 03, 07, 12, 13.

- [ ] T37.0 Implement server-validated PriceQuote retrieval and PriceDisplay formatting. Accept: amount, currency, tax treatment, timestamp, source, validity, and disclosure are present.
- [ ] T37.1 Build FinanceEstimate display with deposit, term, rate, residual/balloon, fees, assumptions, provider source, and legal disclosure. Accept: it never claims approval.
- [ ] T37.2 Add quote/finance unavailable and stale-data states. Accept: a failure is explicit and cannot leave an older amount presented as current.

## Phase 38 — Configurator state and stepper

Owner: Commerce. Dependencies: T11.2, T19.1, T36.0. References: 03, 05, 07, 11.

- [ ] T38.0 Build the deep-linkable ConfiguratorStepper for trim, exterior, interior, wheels, packages/accessories, and summary. Accept: step completion and invalid states are exposed accessibly.
- [ ] T38.1 Serialize safe configuration state into URL parameters and/or persisted build IDs. Accept: refresh/share restores an equivalent build or gives a clear version-expiry recovery path.
- [ ] T38.2 Build desktop sticky build summary and mobile sticky summary sheet. Accept: price/action state remains keyboard and screen-reader usable.
- [ ] T38.3 Add configuration progress and panel transitions using shared StepTransition/ConfigChangeHighlight behavior. Accept: panels move no more than 24 px, affected summary rows highlight briefly, and pricing never waits for animation.

## Phase 39 — Configuration rules engine

Owner: Commerce/domain. Dependencies: T11.1, T38.0. References: 07, 10, 14.

- [ ] T39.0 Define compatibility, dependency, conflict, market, trim, supply, default, and price-delta rule representations. Accept: React components do not encode option logic.
- [ ] T39.1 Implement deterministic option evaluation and clear incompatibility explanations. Accept: every disabled option identifies the relevant cause in accessible text.
- [ ] T39.2 Add unit and property tests for representative rule combinations. Accept: conflicts, required dependencies, and invalid URL configurations are covered.

## Phase 40 — Configurator media and saved builds

Owner: Commerce. Dependencies: T14.1, T38.1, T39.0. References: 03, 07, 11.

- [ ] T40.0 Map selected trim/color/wheel configuration to matching media keys and static fallback. Accept: illustrative media is clearly distinguishable from exact render media where needed.
- [ ] T40.1 Add optional 360 viewer with lazy loading, pause/loading states, pointer/keyboard controls, and static fallback. Accept: it does not block configuration use or initial render.
- [ ] T40.2 Implement anonymous save, authenticated cloud save, duplicate/edit, and read-only share behavior. Accept: saved-build visibility and expiry/version handling are explicit.
- [ ] T40.3 Implement the optional 3D configurator capability shell behind a default-off feature flag. Accept: approved 3D metadata, poster, staged loading, keyboard controls, device-budget evidence, and exact static fallback are required before it can be enabled.

## Phase 41 — Inventory

Owner: Retail/inventory. Dependencies: T15.0, T16.0, T37.0. References: 04, 05, 07, 12.

- [ ] T41.0 Implement inventory search contract with VIN/inventory ID, exact configuration, retailer, status, price, arrival, and actual-image fields. Accept: operational data is distinct from catalog data.
- [ ] T41.1 Build inventory results with filters, sort, retailer/distance context, status, saved search, and empty state. Accept: availability freshness/source is visible.
- [ ] T41.2 Build inventory detail with exact vehicle, dealer, pickup/delivery, and commerce actions. Accept: stale/sold inventory never presents as reservable.

## Phase 42 — Retailer discovery

Owner: Retail/inventory. Dependencies: T15.0, T19.0, T41.0. References: 03, 04, 05, 12, 13.

- [ ] T42.0 Build RetailerService and market-aware retailer search by location/service/capability. Accept: map use is optional, with full list fallback.
- [ ] T42.1 Build synchronized retailer map/list and accessible retailer cards. Accept: essential information/actions do not require a map script.
- [ ] T42.2 Build retailer detail with hours, services, inventory, booking availability, directions, contacts, and legal disclosures. Accept: open/closed information has source/refresh behavior.

## Phase 43 — Test-drive booking

Owner: Retail/booking. Dependencies: T16.2, T19.2, T42.0. References: 05, 07, 12, 14.

- [ ] T43.0 Build model/trim/inventory/retailer context preservation into general and model-specific booking routes. Accept: entry-point context survives the booking flow.
- [ ] T43.1 Build retailer/model/date-time availability selection through AppointmentService. Accept: live slots and request-pending fallback are visibly distinct.
- [ ] T43.2 Implement contact, consent, confirmation, failure, and retry steps. Accept: booking submit is idempotent and all errors are localized/announced.
- [ ] T43.3 Add structural booking-step, validation, and success feedback. Accept: the step change preserves intended scroll position, errors move at most 6 px without shaking, and confirmation remains readable after a short success animation.

## Phase 44 — CRM leads and trade-in

Owner: Integrations. Dependencies: T16.2, T19.2, T43.2. References: 07, 12, 14.

- [ ] T44.0 Define lead payloads for test drive, retailer contact, finance, trade-in, and register-interest flows. Accept: locale, market, source, consent, model/build, and retailer context are included.
- [ ] T44.1 Implement CRM adapter submission with server validation, idempotency, and correlation IDs. Accept: user-facing errors never expose CRM internals.
- [ ] T44.2 Build preliminary trade-in lead flow and disclosure behavior. Accept: it does not promise a confirmed valuation without an approved valuation provider.

## Phase 45 — Reservation checkout

Owner: Commerce. Dependencies: T37.0, T41.2, T16.2, T19.2. References: 04, 05, 07, 12, 14.

- [ ] T45.0 Build reservation start from valid build or inventory contexts with server-side final quote validation. Accept: invalid/expired pricing requires review before proceeding.
- [ ] T45.1 Build retailer/delivery, customer detail, terms, consent, and review steps. Accept: marketing consent is optional and never preselected.
- [ ] T45.2 Implement reservation state machine and recovery UI for draft, payment-pending, reserved, failed, expired, cancelled, and refunded states. Accept: users receive an accurate non-silent outcome.

## Phase 46 — Payments and reconciliation

Owner: Integrations. Dependencies: T45.0, T16.2. References: 07, 12, 14.

- [ ] T46.0 Integrate only hosted/tokenized payment collection behind PaymentService. Accept: card data never transits or appears in application logs.
- [ ] T46.1 Verify payment webhook signatures and implement idempotent asynchronous reconciliation. Accept: replayed webhook events do not duplicate reservation changes.
- [ ] T46.2 Implement payment failure, retry, refund, and inventory-hold reconciliation paths. Accept: each path creates an auditable final state.

## Phase 47 — Notifications

Owner: Integrations. Dependencies: T43.2, T45.2, T46.1. References: 09, 12, 14.

- [ ] T47.0 Define localized notification templates for booking, reservation, payment receipt, appointment updates, and shared builds. Accept: templates contain no unapproved legal/finance text.
- [ ] T47.1 Implement notification adapter interface and delivery audit events. Accept: provider failures are observable and retryable where appropriate.
- [ ] T47.2 Test locale, market, consent, and transactional/marketing separation. Accept: no marketing message is sent without documented consent.

## Phase 48 — Optional customer accounts

Owner: Account. Dependencies: T11.2, T16.0, T40.2. References: 04, 11, 14.

- [ ] T48.0 Define optional authentication/account boundary that does not block browsing or lead capture by default. Accept: anonymous and authenticated build behavior is clear.
- [ ] T48.1 Build account dashboard routes for builds, favorites, appointments, orders, and profile. Accept: authorization is enforced server-side.
- [ ] T48.2 Implement profile/preferences, export/deletion handoff, and high-risk account-change reauthentication policy. Accept: privacy requirements are documented per market.

## Phase 49 — Ownership and support

Owner: Editorial/support. Dependencies: T12.1, T13.0, T17.0. References: 04, 05, 10, 13.

- [ ] T49.0 Build ownership hub with charging, warranty, service, roadside, manuals, and software-update content routes. Accept: model/market applicability is explicit.
- [ ] T49.1 Build support hub/article template with accessible search, breadcrumb, and feedback patterns. Accept: support content is localized and indexable where intended.
- [ ] T49.2 Add escalation/contact path for unavailable support answers. Accept: users are not left at a dead-end error state.

## Phase 50 — News, editorial, and site search

Owner: Editorial/search. Dependencies: T10.2, T12.1, T15.0. References: 04, 10, 13.

- [x] T50.0 Build news index/article templates with author, publish date, media, related content, and localized SEO. Accept: publication states and canonical URLs are respected.
- [x] T50.1 Implement cross-domain site search across editorial, vehicle, technology, support, and retailers. Accept: inventory remains a distinct operational search source.
- [x] T50.2 Add CJK tokenization/synonyms and no-result recovery paths. Accept: search safely handles localized model/feature aliases.

### Phase 22–50 implementation checkpoint

The Phase 22–50 route and contract slice is implemented with production-safe fallbacks. Discovery, compare, model anchors/specification status, technology topic navigation, configuration deep links, service/lead forms, editorial/search recovery, optional 360/technical visualization primitives, provider-neutral operational validation, idempotency, inventory freshness, reservation transitions, notification consent separation, account reauthentication, and expanded analytics event contracts are available in the workspace. The task checkboxes below remain intentionally open where their acceptance criteria require approved CMS/PIM content, rights-cleared media, operational providers, legal approval, or live infrastructure; those gates must be completed before a task is marked done.

## Phase 51 – Legal content and disclosures

Owner: Legal/content platform. Dependencies: T12.1, T37.0, T45.1. References: 02, 04, 07, 09, 10, 13.

- [x] T51.0 Model versioned, market/locale-specific privacy, cookies, terms, finance, vehicle-data, and driver-assistance legal documents. Accept: effective dates and versions are visible.
- [x] T51.1 Implement reusable legal/disclaimer drawer and contextual disclosure linkage. Accept: finance/price/specification claims can link to required terms without hiding key information.
- [x] T51.2 Add legal approval/publish gate to CMS workflow. Accept: unapproved legal content cannot appear in a public market.

## Phase 52 — Security and privacy controls

Owner: Security. Dependencies: T05.1, T16.0, T48.0. References: 14, 17.

- [x] T52.0 Apply HTTPS/HSTS, secure cookie, CSP, content-type, referrer, and permissions policy baselines. Accept: automated security-header checks pass.
- [x] T52.1 Add authorization, CSRF, rate-limit, secret, dependency, and input-validation checks around every write path. Accept: critical mutation routes have explicit protections/tests.
- [x] T52.2 Define PII minimization, retention, deletion/export, and logging-redaction controls per market. Accept: sensitive data does not enter analytics or ordinary logs.

## Phase 53 — Resilience and caching

Owner: Platform/integrations. Dependencies: T12.2, T15.1, T41.0, T46.1. References: 10, 11, 12, 14.

- [x] T53.0 Define cache policy for editorial, catalog, price, inventory, retailer, booking, and mutation responses. Accept: cache keys include all market/locale/data freshness dimensions.
- [x] T53.1 Implement provider-outage presentation for CMS, pricing, inventory, finance, retailer, booking, and payment issues. Accept: failures never silently become stale commercial claims.
- [x] T53.2 Write outage and rollback runbooks with feature-flag/fallback decisions. Accept: an on-call owner can execute a documented safe response.

## Phase 54 — SEO and web performance

Owner: SEO/performance. Dependencies: T08.0, T10.1, T14.2, T20.0. References: 13, 14, 17.

- [x] T54.0 Implement metadata, canonical, hreflang, robots, sitemap, and appropriate structured-data generation. Accept: invalid/stale Offer and FAQ schema is excluded.
- [x] T54.1 Establish performance budgets for LCP, INP, CLS, JS, image weight, and third-party scripts. Accept: CI reports budget regressions.
- [x] T54.2 Add real-user monitoring for Core Web Vitals and synthetic route checks. Accept: dashboards segment locale, market, and page type without PII.
- [x] T54.3 Add a motion performance budget and route-level dependency audit. Accept: advanced engines are dynamically loaded, animation does not delay LCP, offscreen work pauses, and target-device profiling is captured.

## Phase 55 — Unit and component tests

Owner: Quality. Dependencies: T04.0 through T54.0. References: AGENTS, 14, 15.

- [x] T55.0 Add unit coverage for price/finance formatting, configuration rules, lifecycle CTA, locale formatting, and domain error mapping. Accept: critical domain branches are deterministic and covered.
- [ ] T55.1 Add component coverage for navigation, selectors, dialogs, drawers, forms, build summary, and error states. Accept: primary state variants render and respond accessibly.
- [ ] T55.2 Add contract tests for every external adapter/test double. Accept: a provider shape change fails before it reaches user flows.

## Phase 56 — End-to-end commerce tests

Owner: Quality. Dependencies: T43.2, T46.2, T48.1. References: AGENTS, 07, 14.

- [ ] T56.0 Test home to model to configuration, trim/color/wheel selection, quote update, and build save/share. Accept: canonical state survives reload and link sharing.
- [ ] T56.1 Test inventory matching, retailer selection, and test-drive booking including unavailable states. Accept: operational failures present clear recovery UI.
- [ ] T56.2 Test reservation with mocked hosted payment, failure/retry, webhook reconciliation, and confirmation. Accept: duplicate submissions/events do not duplicate a reservation.

## Phase 57 — Accessibility and visual regression

Owner: Quality/design system. Dependencies: T55.1, T56.0. References: 01, 03, 13, 14, 16.

- [x] T57.0 Run automated axe checks across page templates and critical state variants. Accept: violations are fixed or explicitly waived with owner/rationale.
- [ ] T57.1 Perform manual keyboard, screen-reader smoke, focus, contrast, zoom/reflow, and reduced-motion audits. Accept: all critical flows meet the documented gate.
- [ ] T57.2 Establish visual regression baselines for home, model, shopping, configurator, technology, mobile, and Chinese layouts. Accept: intentional differences are reviewed against canonical references.
- [ ] T57.3 Run the motion merge checklist across routes and engines. Accept: reduced motion, View Transition/no-JS fallback, keyboard/focus preservation, no layout shift, English/Chinese layouts, Save-Data video behavior, and 4x CPU/mobile/Safari/integrated-GPU evidence pass.

## Phase 58 — Observability and CI/CD

Owner: Platform/quality. Dependencies: T04.0, T20.1, T52.0, T54.2. References: 11, 14, 17.

- [x] T58.0 Implement structured logs, tracing, error reporting, and alert thresholds for provider latency/failure, reservation/payment, booking, inventory lag, and web vitals. Accept: correlation IDs join user-safe diagnostics.
- [x] T58.1 Configure pull-request checks for lint, typecheck, tests, build, a11y smoke, selected E2E, visual diff, and security scans. Accept: required checks block merge.
- [x] T58.2 Configure staging and production release pipelines with environment isolation, smoke tests, and promotion controls. Accept: deployment does not require production credentials in source control.

## Phase 59 — Staging readiness

Owner: Release team. Dependencies: T51.2, T52.2, T53.2, T58.2. References: 13, 14, 17.

- [ ] T59.0 Load approved staging content, legal versions, market configurations, and rights-cleared imagery. Accept: no placeholder fixture is visible in staging acceptance routes.
- [ ] T59.1 Validate real integration behavior, consent, pricing/freshness, inventory lag, booking, payment handoff, notifications, and outage fallbacks. Accept: evidence is attached to each launch gate.
- [ ] T59.2 Run SEO crawl, accessibility, performance, security, and disaster/rollback rehearsals. Accept: failures have an owner and remediation/retest record.

## Phase 60 — Production launch and stewardship

Owner: Release team. Dependencies: T59.0, T59.1, T59.2. References: 14, 15, 17.

- [ ] T60.0 Complete production launch checklist for every market, locale, model, integration, legal document, and alert. Accept: all required checklist evidence is approved.
- [ ] T60.1 Execute controlled rollout with feature flags, monitoring, and ownership coverage. Accept: launch status and rollback decision path are documented in CONTINUITY.md.
- [ ] T60.2 Establish post-launch review cadence for data freshness, claims, security, accessibility, performance, analytics, and content expiry. Accept: named owners and recurring review dates exist.
