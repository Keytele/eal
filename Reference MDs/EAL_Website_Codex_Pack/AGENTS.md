# AGENTS.md — EAL Website Implementation Rules

Use this file as the top-level operating instruction for coding agents working on the EAL website.

## 1. Objective

Build a production-ready bilingual automotive brand and dealership website matching the supplied EAL references while using maintainable, accessible, strongly typed, testable components.

## 2. Source of truth priority

Use the following priority when requirements conflict:

1. Structured operational data from backend systems for price, inventory, retailer availability, finance and reservations.
2. Approved CMS content for editorial copy, imagery and legal text.
3. These Markdown specifications.
4. Visual reference images for composition, visual hierarchy and mood.
5. Sensible production defaults.

Never treat generated text visible inside a reference mockup as legally approved production copy.

## 3. Coding rules

- Use TypeScript with `strict: true`.
- Avoid `any`; if unavoidable, isolate it at third-party boundaries.
- Validate all external data with a runtime schema library.
- Prefer server components for content-heavy pages and client components only for interactive islands.
- All client-side state affecting shareable configuration must serialize to the URL or a persisted build ID.
- Keep commerce mutations server-side.
- Never expose private API keys to the browser.
- Use semantic HTML before ARIA.
- Every interactive control must be keyboard accessible.
- All images require useful alt text or explicit decorative treatment.
- Use design tokens; do not scatter raw colors, spacing or typography values throughout components.
- No inline hard-coded English strings in reusable UI components.
- All public-facing strings must be translation keys or CMS content.

## 4. UI fidelity rules

Match the visual references through systemized rules rather than one-off pixel imitation:

- Dark navy/graphite backgrounds.
- Full-bleed cinematic vehicle imagery with dusk or night architectural scenes.
- Large editorial uppercase headings with generous tracking in Latin text.
- Reduced tracking for Chinese.
- Thin white line icons.
- Primary buttons: light surface with dark text.
- Secondary buttons: transparent with light border.
- Fine 1 px separators with low-opacity white.
- Panels are mostly flat or lightly translucent; avoid generic SaaS card styling.
- Vehicle media should dominate the composition.
- Avoid excessive gradients, shadows, pills, neon effects or glassmorphism.

## 5. Required routes

Implement all routes listed in `docs/04_INFORMATION_ARCHITECTURE.md`, including error states and legal pages.

## 6. Required reusable systems

Build reusable systems for:

- Global header and locale/market switcher.
- Vehicle hero.
- Metric/specification rail.
- Sticky model section navigation.
- Vehicle card/grid.
- Trim selector.
- Exterior/interior color selector.
- Wheel selector.
- Package/accessory selector.
- Finance estimate summary.
- Inventory match list.
- Retailer locator.
- Test-drive booking.
- Reservation checkout.
- Comparison table.
- Media gallery.
- Technology feature rail.
- Editorial split section.
- Legal/disclaimer drawer.
- Toasts, dialogs, drawers and status messages.
- Account saved builds/favorites.

## 7. Accessibility gate

A page is not complete if it fails keyboard navigation, focus visibility, semantics, contrast, zoom/reflow, reduced motion, or form error handling. Automated checks are necessary but not sufficient.

## 8. Localization gate

A feature is not complete until it works in both English and Simplified Chinese, including:

- Navigation.
- Forms and validation.
- Vehicle content.
- Commerce steps.
- SEO metadata.
- Emails/notifications if applicable.
- Date, number, currency and unit formatting.
- Legal/disclaimer content.

## 9. Commerce correctness gate

Before displaying price, finance, inventory, reservation or delivery claims, resolve the user's active market and fetch operational data. Show a clear fallback if a provider is unavailable. Never fabricate availability.

## 10. Testing expectation

Every feature requires:

- Unit tests for domain logic.
- Component tests for major state variants.
- End-to-end tests for critical flows.
- Accessibility coverage.
- Contract tests for external adapters where feasible.

Critical flows:

1. Browse model → configure → save build.
2. Configure → inventory match.
3. Configure → test-drive booking.
4. Configure → reservation/deposit.
5. Retailer search → retailer detail → lead/booking.
6. Locale switch preserving context.
7. Finance estimate update when configuration changes.
