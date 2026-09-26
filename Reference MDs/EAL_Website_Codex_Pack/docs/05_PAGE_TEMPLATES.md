# 05 — Page Templates

## 1. Homepage

Reference: `references/Homepage.png`.

### Structure

1. Transparent global header.
2. Cinematic brand hero.
3. Brand promise and short intro.
4. Two CTAs: vehicle discovery + brand/story.
5. Value/technology icon rail.
6. Featured model annotation on hero.
7. Vehicle lineup rail for C2, S4, S6, X4, X6, R9.
8. Footer.

### Hero requirements

- Feature one priority model from CMS.
- Background and vehicle should support market-specific campaign changes.
- Add dark readability gradient under copy only.
- Optional section pager if campaign supports multiple hero slides; do not auto-rotate without user control.

## 2. Vehicle range page

### Structure

- Hero/introduction.
- Filters: body type, seats, range, price band, drivetrain.
- Vehicle cards.
- Compare mode.
- Shopping CTA.
- Technology/sustainability cross-links.

### Filters

All filters must be URL-addressable so the state is shareable.

## 3. Vehicle model overview

References: `references/Example Car Model.png`, `references/Models page.png`.

### Structure

1. Model hero.
2. Core metrics.
3. Sticky section nav.
4. Design editorial section.
5. Exterior section.
6. Interior section.
7. Technology section.
8. Trim overview.
9. Specification highlights.
10. Gallery.
11. Configure/test-drive CTAs.

### R9 special variant

The R9 can use a more editorial GT layout with:

- Model selector/vertical rail on desktop.
- Headline on right.
- Thumbnail story rail.
- Performance metrics at bottom.

## 4. Shopping page

References: `Car Shop1–5.png`.

Shopping page is not the full step-by-step configurator; it is a model-specific commerce overview with immediate trim/color/wheel exploration.

### Structure

- Hero with starting price and payment estimate.
- Configure/test drive actions.
- Primary specification rail.
- Trim selector.
- Exterior color swatches.
- Wheel selector.
- Optional seating layout selector for X6.
- Sticky build summary.
- Editorial cards for interior/packages/family/ownership.
- Inventory/reservation CTA.

### Model-specific differences

#### C2

- Compact pricing emphasis.
- Core/Luxe/GT or approved production trim names.
- Strong value/payment summary.

#### S4

- Performance and long-range trim comparison.
- Package tiles.

#### S6

- Executive/Signature options.
- Rear-cabin experience cross-link.

#### X4

- Family/cargo/accessory content.

#### X6

- Seating configuration.
- Cargo/towing.
- Family package/accessory tiles.

#### R9

- Performance-oriented build path.
- Aero/wheel/carbon options.
- Reservation eligibility may differ.

## 5. Configurator

### Desktop

- Large synchronized vehicle render left/center.
- Step controls on side or lower band.
- Sticky price summary.
- 360 interaction when supported.

### Mobile

- Vehicle media top.
- Horizontal stepper.
- Full-width options.
- Sticky bottom price/action bar.

## 6. Technology landing

Reference: `Tech1.png`.

### Structure

- Hero with priority technology message.
- Technology feature rail.
- “Designed around intelligence” editorial split.
- Technology pillars.
- Bottom exploration cards linking to subpages.

## 7. Technology detail

References: `Tech2–5.png`.

### Structure

1. Topic hero.
2. Top metric/benefit rail.
3. Editorial explainer section with technical media.
4. Key technologies/module rail.
5. Explore-in-depth cards.
6. Model availability link.
7. Related technology links.

## 8. Comparison page

### Layout

- Select up to 3 vehicles/trims.
- Sticky model headers.
- Difference highlight toggle.
- Categories: price, performance, range, charging, dimensions, interior, cargo, technology, warranty.
- Mobile: select 2 at a time or use horizontally scrollable comparison.

## 9. Inventory page

### Features

- Filters.
- Sort.
- Retailer/distance.
- Available now/in transit.
- Price.
- Exact trim/color/options.
- Saved search.

Inventory cards must source data from operational inventory systems.

## 10. Inventory detail

- Exact VIN/inventory ID.
- Actual vehicle images where available.
- Dealer/retailer.
- Price.
- Specification/options.
- Delivery/pickup status.
- Reserve/contact/test drive actions.

## 11. Retailer locator

- Search field.
- Map + list.
- Filters for sales/service/charging/test-drive capability.
- Current open/closed status.
- Distance.
- Retailer detail link.

## 12. Retailer detail

- Address/contact/hours.
- Services.
- Inventory.
- Test-drive availability.
- Directions.
- Team/contact optional.
- Legal dealer disclosures.

## 13. Test-drive booking

Steps:

1. Model/trim preference.
2. Location/retailer.
3. Date/time.
4. Contact details.
5. Consent.
6. Confirmation.

## 14. Finance page

- Finance education.
- Payment estimator.
- Representative examples.
- Link/handoff to finance application.
- Mandatory legal disclosures.

## 15. Reservation checkout

Steps:

1. Build/inventory review.
2. Retailer/delivery selection.
3. Customer details.
4. Reservation terms.
5. Payment/deposit.
6. Confirmation.

Must support idempotent payment confirmation.

## 16. Ownership hub

- Charging.
- Warranty.
- Service.
- Roadside assistance.
- Manuals.
- Software updates.

## 17. Search

Search across:

- Vehicles.
- Technology.
- Support.
- Retailers.
- News/editorial.

Inventory search should remain a distinct operational search domain but can be surfaced in results.
