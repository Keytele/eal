# 04 — Information Architecture and Route Map

## URL strategy

Recommended public route shape:

```text
/{locale}/{market}/...
```

Examples:

```text
/en/au/vehicles/s6
/zh-Hans/au/vehicles/s6
/en/au/technology/800v-architecture
```

If the business wants language-only URLs, keep market in a cookie/session but do not mix market-specific pricing in shared cached HTML without correct cache keys.

## Main navigation

- Vehicles
- Technology
- Design
- Sustainability
- Our Story

Utility navigation:

- Search
- Locale/market
- Account
- Book a Test Drive
- Configure/Shop contextual CTA

## Complete public page inventory

### Brand and discovery

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/vehicles` | Vehicle range/index |
| `/compare` | Vehicle comparison |
| `/design` | Design philosophy |
| `/sustainability` | Sustainability |
| `/about` | Brand story/about |
| `/news` | News/editorial index |
| `/news/[slug]` | Editorial article |
| `/search` | Site search |

### Vehicle model pages

For each `c2`, `s4`, `s6`, `x4`, `x6`, `r9`:

| Route | Purpose |
| --- | --- |
| `/vehicles/[model]` | Model overview |
| `/vehicles/[model]/exterior` | Exterior design |
| `/vehicles/[model]/interior` | Interior design |
| `/vehicles/[model]/technology` | Model-specific technology |
| `/vehicles/[model]/trims` | Trim overview |
| `/vehicles/[model]/specifications` | Full specifications |
| `/vehicles/[model]/gallery` | Media gallery |

Optional if content volume is low: implement these as anchor sections on one model page while keeping canonical deep-link anchors.

### Shopping and configuration

| Route | Purpose |
| --- | --- |
| `/shop` | Shopping hub |
| `/shop/[model]` | Model shopping landing page |
| `/configure/[model]` | Configurator |
| `/configure/[model]/[buildId]` | Saved/shared build |
| `/inventory` | Available inventory |
| `/inventory/[inventoryId]` | Vehicle detail |
| `/reserve/[buildOrInventoryId]` | Reservation checkout |
| `/order/confirmation/[id]` | Reservation/order confirmation |
| `/finance` | Finance overview |
| `/finance/payment-estimator` | Payment estimator |
| `/finance/apply` | Finance lead/application handoff |
| `/trade-in` | Trade-in estimator/lead |

### Retail and booking

| Route | Purpose |
| --- | --- |
| `/retailers` | Retailer locator |
| `/retailers/[slug]` | Retailer detail |
| `/test-drive` | General test-drive booking |
| `/test-drive/[model]` | Model-specific booking |
| `/contact` | Contact |

### Technology

| Route | Purpose |
| --- | --- |
| `/technology` | Technology landing |
| `/technology/800v-architecture` | 800V platform |
| `/technology/battery-charging` | Battery and charging |
| `/technology/intelligent-driving` | ADAS/intelligent driving |
| `/technology/software-connectivity` | Cabin software/connectivity |
| `/technology/energy-ecosystem` | V2L/V2H/energy |
| `/technology/safety` | Safety engineering |

### Ownership

| Route | Purpose |
| --- | --- |
| `/ownership` | Ownership hub |
| `/ownership/charging` | Charging support |
| `/ownership/warranty` | Warranty |
| `/ownership/service` | Service/maintenance |
| `/ownership/roadside-assistance` | Roadside assistance |
| `/ownership/manuals` | Manuals/guides |
| `/support` | Support hub |
| `/support/[article]` | Support article |

### Account

| Route | Purpose |
| --- | --- |
| `/account` | Account dashboard |
| `/account/builds` | Saved builds |
| `/account/favorites` | Favorite vehicles/inventory |
| `/account/appointments` | Test drives/service appointments |
| `/account/orders` | Reservations/orders |
| `/account/profile` | Profile/preferences |

Account must not be required for browsing or test-drive lead capture unless business policy says otherwise.

### Legal and utility

- `/privacy`
- `/cookies`
- `/terms`
- `/accessibility`
- `/legal/finance`
- `/legal/vehicle-data`
- `/legal/driver-assistance`
- `/sitemap`
- `/404`
- `/500`
- maintenance/unavailable page

## Navigation behavior

### Vehicles mega menu

Group by body type and show small vehicle thumbnails:

- C2
- S4
- S6
- X4
- X6
- R9

Actions:

- View all vehicles.
- Compare.
- Shop inventory.

### Technology mega menu

- Technology overview.
- 800V Architecture.
- Battery & Charging.
- Intelligent Driving.
- Software & Connectivity.
- Energy Ecosystem.

## Breadcrumbs

Required for:

- Technology subpages.
- News/editorial.
- Support.
- Retailer detail.
- Inventory detail.

Model and shopping pages can omit visible breadcrumbs if hierarchy is obvious, but should still include breadcrumb structured data where useful.

## Locale behavior

Locale switching must preserve equivalent route when possible:

```text
/en/au/vehicles/s6 -> /zh-Hans/au/vehicles/s6
```

If translated content is unavailable, show a controlled fallback banner rather than silently changing market or losing context.
