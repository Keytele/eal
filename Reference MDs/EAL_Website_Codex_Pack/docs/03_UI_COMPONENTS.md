# 03 — UI Components

## Component strategy

Build a composable component library using accessible primitives. Components must be content-agnostic where possible and accept structured data rather than embedding model-specific copy.

## Global components

### `SiteHeader`

Props/state:

- active route.
- locale.
- market.
- model context.
- CTA context.
- transparent/solid mode.

Behavior:

- Transparent over hero.
- Solid after scroll threshold.
- Supports search.
- Supports locale/market switcher.
- Mobile drawer.

### `SiteFooter`

Sections:

- Contact.
- Support.
- Retailers.
- Investors/company links if required.
- Careers.
- Legal.
- Social channels.
- Locale/market.

## Hero components

### `VehicleHero`

Required slots:

- eyebrow/model.
- headline.
- description.
- primary action.
- secondary action.
- price/finance optional.
- background/vehicle media.
- side annotation optional.
- metrics rail optional.

Variants:

- brand/home.
- model detail.
- shopping.
- technology.
- R9 editorial.

### `HeroMedia`

Supports:

- responsive image.
- video.
- 360 viewer poster.
- accessible pause control for autoplay video.
- focal-point metadata from CMS.

## Specification components

### `MetricRail`

Typical metrics:

- range.
- battery.
- 0–100 km/h.
- charging voltage.
- charging time.
- drivetrain.
- seats.
- cargo.
- towing.

Requirements:

- structured value + unit.
- optional qualifier/source.
- market-aware units.
- horizontal scroll on small screens.

### `SpecificationTable`

- Category sections.
- Compare trims.
- Sticky first column on wide comparison mode.
- Expand/collapse on mobile.
- Never encode values as raster images.

## Vehicle discovery

### `VehicleCard`

Fields:

- model code.
- body type.
- hero image.
- starting price.
- range.
- seats.
- short tagline.
- actions.

Variants:

- lineup rail.
- grid card.
- comparison card.
- inventory card.

### `VehicleLineupRail`

Matches the bottom row shown on the homepage reference.

- 6-up desktop where space allows.
- Scroll-snap on smaller screens.
- Keyboard-accessible.
- Current model can be visually highlighted.

## Commerce/configuration

### `ConfiguratorStepper`

Steps:

1. Trim.
2. Exterior.
3. Interior.
4. Wheels.
5. Packages/accessories.
6. Summary.

Requirements:

- URL-state serialization.
- completed/invalid indicators.
- unsaved-change handling.
- deep-linkable step.

### `TrimSelector`

Shows:

- trim name.
- drivetrain.
- range.
- price delta/total.
- key differences.

States:

- selected.
- available.
- unavailable in market.
- temporarily unavailable.

### `ColorSwatchSelector`

- swatch color.
- display name.
- price impact.
- availability.
- selected state with non-color indicator.

Do not use color alone to communicate selection.

### `WheelSelector`

- wheel thumbnail.
- size.
- name.
- aerodynamic/performance descriptor.
- price impact.

### `InteriorSelector`

- material/color.
- seating layout where applicable.
- package dependencies.

### `PackageCard`

- name.
- price.
- grouped features.
- dependency/conflict metadata.
- image.

### `BuildSummary`

Desktop:

- right-side sticky panel or lower summary rail depending on page.

Mobile:

- sticky bottom bar opening a sheet.

Shows:

- model/trim.
- configuration.
- price.
- finance estimate.
- delivery/inventory status.
- primary CTA.

### `PriceDisplay`

Must accept:

- amount.
- currency.
- tax inclusion state.
- market.
- timestamp.
- disclaimer.
- source.

### `FinanceEstimate`

Display:

- estimated payment.
- term.
- deposit/down payment.
- APR/rate if applicable.
- balloon/residual if applicable.
- taxes/fees treatment.
- legal disclosure link.

Never display a finance estimate without its assumptions.

### `InventoryMatchCard`

- VIN or inventory ID.
- model/trim.
- exterior/interior.
- key options.
- retailer.
- distance.
- availability status.
- price.
- estimated delivery/pickup.

## Forms

### `FormField`

Supports:

- label.
- hint.
- required indicator.
- validation message.
- success message.
- autocomplete attributes.

### Required forms

- Test-drive booking.
- Retailer contact.
- Reservation checkout.
- Finance lead.
- Trade-in lead.
- Newsletter/updates.
- Support request.
- Account sign-in/profile.

## Retailer components

### `RetailerMap`

- Map/list synchronized.
- Keyboard-accessible list is primary fallback.
- Avoid requiring map interaction for essential tasks.

### `RetailerCard`

- name.
- address.
- distance.
- opening hours.
- services.
- inventory count.
- test-drive availability.
- directions/contact actions.

## Technology/editorial components

### `FeatureRail`

A 4–6 item horizontal feature strip like the technology references.

### `EditorialSplit`

- Copy left/media right or reversed.
- Full-width media variant.
- Optional CTA.

### `TechnologyCardStrip`

For bottom-page exploration modules.

Examples:

- 800V charging.
- battery systems.
- intelligent driving.
- cabin software.
- energy ecosystem.

## Media components

### `MediaGallery`

- images/video.
- thumbnails.
- fullscreen.
- captions.
- keyboard controls.
- lazy loading.

### `Vehicle360Viewer`

Requirements:

- frame/image set or 3D renderer.
- drag and keyboard controls.
- fallback static image.
- loading state.
- color/wheel synchronization with build.

## Feedback components

- Toast.
- Inline alert.
- Status banner.
- Dialog.
- Drawer/sheet.
- Skeleton loader.
- Retry state.
- Empty state.

All feedback must be screen-reader compatible and not depend only on color.
