# 01 — Visual Design System

## Purpose

Translate the supplied EAL mockups into a consistent production design language. The website should feel like a premium automotive editorial experience rather than a generic ecommerce storefront.

## Reference character

The reference set consistently uses:

- Cinematic dusk/night vehicle photography.
- Modern concrete-and-glass architecture.
- Mountain, lake and city backdrops.
- Cool graphite/navy surfaces with warm amber highlights from architecture and sunset.
- Large vehicle imagery occupying 45–65% of hero width.
- Wide, low interfaces designed for landscape desktop while remaining responsive.
- Thin separators, compact metadata, restrained icons and sparse copy.
- Strong hierarchy between hero message, vehicle imagery, action controls and specification rails.

## Color tokens

Use semantic CSS variables. Suggested starting values are intentionally approximate; calibrate against final brand assets.

```css
:root {
  --eal-bg-950: #06101a;
  --eal-bg-900: #0a1520;
  --eal-bg-850: #0e1b27;
  --eal-surface-800: #13222e;
  --eal-surface-750: #182833;
  --eal-line: rgba(255,255,255,.16);
  --eal-line-strong: rgba(255,255,255,.32);
  --eal-text: #f5f7f8;
  --eal-text-muted: rgba(245,247,248,.68);
  --eal-text-subtle: rgba(245,247,248,.48);
  --eal-inverse: #08111a;
  --eal-accent-warm: #d8a466;
  --eal-positive: #73c69b;
  --eal-warning: #e7b45c;
  --eal-danger: #d96f68;
}
```

Rules:

- Use white/light text on dark surfaces by default.
- Primary CTAs should invert to a light surface with dark text.
- Warm amber is atmospheric, not a primary UI color.
- Do not introduce bright blue as a general brand accent. Blue may appear in driver-assistance visualizations only.
- Status colors must meet accessible contrast requirements.

## Typography

### Latin

Visual references suggest a geometric or neo-grotesk sans with thin-to-regular hero weights.

Suggested stack:

```css
font-family: Inter, "Helvetica Neue", Arial, sans-serif;
```

For production, use licensed brand typography if available. Do not make the implementation dependent on an inaccessible proprietary font.

### Simplified Chinese

Suggested fallback stack:

```css
font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
```

### Type scale

| Token | Desktop | Mobile | Use |
| --- | ---: | ---: | --- |
| Display XL | 64–80 px | 42–52 px | Home/model hero |
| Display L | 48–64 px | 36–44 px | Technology/page hero |
| H1 | 42–52 px | 32–40 px | Page heading |
| H2 | 30–40 px | 26–32 px | Editorial sections |
| H3 | 22–28 px | 20–24 px | Cards/modules |
| Body L | 18–20 px | 17–18 px | Intro text |
| Body | 15–17 px | 15–16 px | Standard copy |
| Caption | 12–14 px | 12–13 px | Specs/meta |
| Eyebrow | 11–13 px | 11–12 px | Uppercase labels |

### Tracking

- Latin display headings: `0.10em–0.18em` when uppercase.
- Latin eyebrows: `0.24em–0.35em`.
- Chinese: use minimal added tracking, generally `0–0.05em`.
- Never force Chinese into the exact same line breaks as English.

## Layout system

### Grid

- Desktop max content width: 1600 px.
- Standard page gutter: 56–72 px large desktop, 32–48 px laptop, 20–24 px tablet, 16–20 px mobile.
- Use a 12-column grid for editorial layouts.
- Hero sections can break the content max-width for full-bleed media.

### Vertical rhythm

Suggested spacing scale:

`4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128`

Large editorial sections should use 80–128 px vertical separation on desktop.

### Section patterns

1. Full-bleed hero.
2. Horizontal spec/feature rail.
3. Split text/media editorial section.
4. Feature pillar rail.
5. 3–5 column card strip.
6. Full-width gallery/media block.
7. Commerce/configuration panel.

## Header

Reference behavior:

- EAL logo left.
- Primary navigation centered/center-left.
- Search, locale/market and CTA at right.
- Transparent over hero at top.
- Transitions to opaque dark background when page scrolls.
- Height: 72–88 px desktop; 60–68 px mobile.

### Desktop nav

Primary items:

- Vehicles
- Technology
- Design
- Sustainability
- Our Story

Commerce CTA varies by context:

- `Book a Test Drive`
- `Configure [Model]`
- `Reserve [Model]`

### Mobile nav

Use a full-screen drawer with clear grouping and model shortcuts. Keep locale/market selector visible.

## Hero composition

### Brand/home/model hero

- Height: 70–90vh desktop, minimum 680 px where appropriate.
- Vehicle sits right or center-right.
- Headline sits left, occasionally right on R9-like layouts.
- Copy width: 420–560 px.
- Primary/secondary actions directly below intro.
- Specs can anchor to the bottom as a horizontal rail.

### Image treatment

- Preserve realistic wheel geometry and vehicle proportions.
- Use a subtle dark readability overlay under text, not across the full image unless required.
- Avoid heavy blur.
- Avoid generic stock images.
- Keep imagery model-specific and trim/color-correct when used in configurator contexts.

## Panels and cards

The visual references use flat editorial blocks more than raised cards.

- Background: `--eal-bg-900` or transparent over media.
- Border: 1 px `--eal-line`.
- Radius: 0–8 px; avoid overly rounded consumer-app cards.
- Shadows: minimal.
- Hover: brighten border/background and move media subtly, not dramatic scaling.

## Buttons

### Primary

- Light/white background.
- Dark text.
- 44–52 px minimum height.
- 16–24 px horizontal padding.
- Minimal radius: 2–6 px.

### Secondary

- Transparent dark surface.
- 1 px light border.
- Light text.

### Tertiary

- Text + arrow.
- Underline/indicator on hover.

All button variants require hover, focus-visible, active, disabled and loading states.

## Iconography

- Thin-line icons.
- 1.5–2 px stroke.
- Consistent optical size.
- Prefer custom EAL icon set or one consistent library, not mixed styles.
- Typical icons: battery, charging, drivetrain, range, speed, seating, cargo, climate, ADAS, connectivity, warranty, retailer, location.

## Motion

Motion should feel mechanical and controlled.

- Standard transition: 180–260 ms.
- Large reveal: 400–700 ms.
- Easing: cubic-bezier with smooth deceleration.
- Do not use bouncing/springy effects for premium core UI.
- Respect `prefers-reduced-motion`.
- Vehicle 360/hero video must have pause controls when motion is non-essential.

## Responsive behavior

### Tablet

- Hero becomes 55/45 or stacked.
- Spec rail may become horizontally scrollable.
- Trim/options cards reduce to 2 columns.

### Mobile

- Vehicle image first or immediately after page title depending on page purpose.
- Hero text no more than ~4 short lines where possible.
- Specs become 2-column tiles or horizontal carousel.
- Configurator becomes a stepper with sticky bottom summary.
- Desktop floating sidebar becomes bottom sheet or dedicated summary step.
- Preserve premium whitespace; do not compress everything into dense cards.

## Dark-mode stance

The public EAL site is intentionally dark-first. A separate light theme is not required unless business requirements change. Accessibility must be met within the dark theme.
