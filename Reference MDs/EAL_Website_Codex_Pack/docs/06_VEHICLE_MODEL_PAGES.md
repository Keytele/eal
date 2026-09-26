# 06 — Vehicle Model Pages

## Shared model template

Every model page should be generated from structured vehicle data plus CMS editorial content.

Required sections:

1. Hero.
2. Key metrics.
3. Overview/design story.
4. Exterior.
5. Interior.
6. Technology.
7. Trims.
8. Specifications.
9. Gallery.
10. Commerce CTA.

## Shared hero fields

```ts
interface VehicleHeroContent {
  modelCode: 'C2' | 'S4' | 'S6' | 'X4' | 'X6' | 'R9';
  eyebrow?: string;
  headline: LocalizedString;
  description: LocalizedString;
  primaryCta: Cta;
  secondaryCta?: Cta;
  media: MediaAsset;
  annotations?: LocalizedString[];
}
```

## Model character

### C2

Purpose:

- Smallest, accessible premium EAL.
- Urban/family practicality.

Page emphasis:

- Compact dimensions.
- Interior space efficiency.
- Rear-seat room.
- charging/range.
- Core/Luxe/GT trim differences.

### S4

Purpose:

- Central expression of EAL brand.
- Premium fastback/liftback sedan.

Page emphasis:

- Fastback proportion.
- aerodynamics.
- 800V charging.
- long-distance cabin comfort.
- Luxe/GT differentiation.

### S6

Purpose:

- Executive flagship sedan.

Page emphasis:

- rear executive cabin.
- quietness.
- air suspension.
- rear-wheel steering.
- active noise cancellation.
- high-end materials.

### X4

Purpose:

- Compact premium family SUV.

Page emphasis:

- higher seating position without rugged styling.
- cargo flexibility.
- 40/20/40 rear seat.
- pet mode/cabin camera.
- family technology.

### X6

Purpose:

- Large three-row flagship SUV.

Page emphasis:

- 6/7 seat configurations.
- third-row practicality.
- cargo/towing.
- long-distance comfort.
- large-SUV charging/range.

### R9

Purpose:

- Halo high-performance electric grand tourer.

Page emphasis:

- low, wide proportions.
- active aerodynamics.
- performance.
- exposed carbon/advanced materials.
- GT comfort rather than track-only framing.

## Sticky model navigation

Suggested items:

- Overview
- Exterior
- Interior
- Technology
- Trims
- Specifications

Rules:

- Sticky below global header.
- Active section indication.
- Keyboard accessible.
- Mobile uses horizontally scrollable tabs.

## Model availability

Each model must have market-specific lifecycle status:

```ts
type VehicleLifecycle =
  | 'announced'
  | 'coming-soon'
  | 'orderable'
  | 'inventory-only'
  | 'discontinued';
```

CTA behavior must derive from lifecycle:

- `announced`: Register interest.
- `coming-soon`: Join updates / book preview if available.
- `orderable`: Configure / test drive.
- `inventory-only`: Shop inventory.
- `discontinued`: Used/legacy/support route.

## Specifications

Do not place specs inside CMS rich text. Use structured data.

Minimum categories:

- Dimensions.
- Weight.
- Battery.
- charging.
- power/torque.
- drivetrain.
- acceleration.
- range/efficiency.
- wheels/tires.
- suspension.
- steering.
- seating.
- cargo.
- towing.
- driver assistance.
- infotainment/connectivity.
- warranty.

## Market variants

Specifications can differ by market. Every spec record should include:

- market.
- trim.
- effective date/model year.
- homologation standard.
- unit source.
- optional footnote.

## Media consistency

When a page claims a specific trim/color/wheel combination, media should visually match where possible. Generic lifestyle images can be marked as illustrative.
