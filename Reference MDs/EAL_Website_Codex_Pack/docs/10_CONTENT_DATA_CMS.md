# 10 — Content, Data and CMS Model

## Data ownership principle

Separate three classes of data:

1. Editorial content — CMS.
2. Product/specification configuration — structured vehicle/PIM data.
3. Operational commerce data — APIs/database/services.

Do not use one CMS collection as the source for everything.

## Editorial CMS entities

### `Page`

- slug.
- locale.
- market scope.
- title.
- SEO.
- modular sections.
- publication status.

### `CampaignHero`

- market.
- locale.
- model.
- headline.
- description.
- media.
- CTAs.
- start/end dates.

### `TechnologyArticle`

- slug.
- category.
- localized title/body.
- media.
- related models.
- claims/footnotes.

### `NewsArticle`

- title.
- excerpt.
- publish date.
- author/source.
- media.
- body.

### `LegalDocument`

- type.
- locale.
- market.
- version.
- effective date.
- body.

## Product/PIM entities

### `VehicleModel`

```ts
interface VehicleModel {
  id: string;
  code: string;
  modelYear: string;
  bodyType: string;
  lifecycle: string;
  trims: VehicleTrim[];
  specifications: SpecificationSet[];
  colors: VehicleColor[];
  interiors: InteriorOption[];
  wheels: WheelOption[];
  packages: VehiclePackage[];
  accessories: Accessory[];
}
```

### `VehicleTrim`

- id.
- model.
- name.
- drivetrain.
- battery.
- range.
- power.
- standard equipment.
- allowed option IDs.
- market availability.

### `VehicleColor`

- id.
- localized name.
- swatch value.
- media render key.
- price.
- trim compatibility.

### `Specification`

Suggested fields:

- key.
- category.
- raw numeric value.
- unit.
- formatted override optional.
- qualifier.
- market.
- trim.
- effective date.
- source.

Store raw values where possible so units can be converted without parsing prose.

## Operational entities

### `InventoryVehicle`

- inventory ID/VIN.
- retailer ID.
- exact configuration.
- status.
- price.
- odometer if used/ demo.
- arrival date.
- images.

### `Retailer`

- ID.
- name.
- address/location.
- contact.
- opening hours.
- services.
- market.
- lead endpoint mapping.

### `Build`

- configuration.
- owner/anonymous session.
- created/updated.
- price snapshot.

### `Lead`

Types:

- test drive.
- retailer contact.
- finance.
- trade-in.
- register interest.

### `Reservation`

- build/inventory reference.
- customer.
- retailer.
- payment state.
- status.
- audit events.

## Media metadata

Every media asset should include:

- alt text per locale.
- focal point.
- aspect ratio.
- model/trim/color tags.
- usage rights.
- expiry if licensed.
- mobile crop.

## Content modularity

Recommended page modules:

- Hero.
- metric rail.
- editorial split.
- media gallery.
- feature rail.
- vehicle rail.
- CTA panel.
- specification summary.
- technology card strip.
- FAQ.

Avoid unconstrained freeform page builders that allow every page to become visually inconsistent.

## Preview workflow

CMS preview must support:

- locale.
- market.
- draft state.
- scheduled campaign.
- model lifecycle.

## Content cache strategy

- Editorial pages can use ISR/tag-based revalidation.
- Operational price and inventory should use short TTL or live fetch based on business SLA.
- Reservation and booking mutations are never cached.
