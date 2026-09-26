# 13 — Accessibility, SEO and Analytics

## Accessibility target

WCAG 2.2 AA.

## Accessibility requirements

### Keyboard

- Full navigation without mouse.
- Visible focus.
- No keyboard traps.
- Logical focus order.
- Escape closes dialogs/drawers where expected.

### Contrast

- Text and controls meet AA contrast.
- Thin muted labels must be verified; reference visuals are not automatically compliant.

### Reflow

- Works at 200% zoom.
- No essential horizontal page scroll at standard narrow viewport widths.
- Horizontal component scrollers must be intentional and accessible.

### Motion

- Respect reduced motion.
- Pause autoplay media.
- Avoid parallax that causes vestibular issues.

### Forms

- Labels programmatically associated.
- Errors announced.
- Instructions before submission.
- Required state communicated beyond color.

### Media

- Alt text.
- Captions/transcripts for meaningful video.
- Decorative imagery hidden from assistive technology.

### Configurator

- Swatches have text labels.
- wheel images have names.
- selected state announced.
- price changes announced through polite live region, not excessive updates.

## SEO

### Technical

- SSR/streamed HTML for indexable pages.
- Canonical tags.
- hreflang.
- XML sitemap per locale/market.
- robots management.
- descriptive URLs.
- server-rendered critical content.

### Metadata

Every page needs:

- title.
- description.
- canonical.
- Open Graph.
- Twitter/social equivalents where used.
- locale.
- image.

### Structured data

Use as appropriate:

- `Organization`.
- `WebSite`.
- `BreadcrumbList`.
- `Vehicle`.
- `Product`/`Offer` when exact price/availability is valid.
- `LocalBusiness`/automotive business for retailers.
- `Article`.
- `FAQPage` only when actual FAQs are visible.

Do not publish stale Offer availability.

## Performance

Targets:

- LCP ≤ 2.5 s at p75 where realistic.
- INP ≤ 200 ms at p75.
- CLS ≤ 0.1.

Primary tactics:

- optimize LCP hero image.
- defer noncritical scripts.
- lazy-load gallery/360 assets.
- minimize client JavaScript.
- preload brand fonts only when licensed/necessary.
- use server rendering for editorial content.

## Analytics event schema

Use typed first-party events.

### Discovery

- `vehicle_card_viewed`
- `vehicle_selected`
- `compare_started`
- `compare_vehicle_added`
- `technology_article_viewed`

### Commerce

- `configurator_started`
- `trim_selected`
- `exterior_selected`
- `wheel_selected`
- `package_selected`
- `build_saved`
- `build_shared`
- `inventory_match_viewed`
- `finance_estimate_updated`
- `test_drive_started`
- `test_drive_submitted`
- `reservation_started`
- `reservation_payment_submitted`
- `reservation_completed`

### Retail

- `retailer_search`
- `retailer_selected`
- `retailer_contact_started`

### Locale

- `locale_changed`
- `market_changed`

## Analytics properties

Where privacy rules allow:

- locale.
- market.
- model.
- trim.
- anonymous build ID.
- campaign.
- page type.
- retailer ID.

Never send sensitive form fields or payment data to analytics.

## Consent

Analytics and marketing tags must respect consent state and market law. Essential operational telemetry can be separated from optional marketing analytics.
