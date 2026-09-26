# Image requirements for Phases 50–60

This is the authoritative image handoff for the Phase 50–60 implementation. It describes what the product may need; it does not authorize generated, stock, or placeholder production imagery. Until a row is supplied and approved, the route must use the existing neutral `MediaFrame`/text fallback.

## Content and commerce image slots

| Phase | Route/feature | Required slot | Delivery | Status and gate |
| --- | --- | --- | --- | --- |
| 50 | News index | No image required for the empty/pending index | — | The template is usable without CMS content |
| 50 | Published news article | `news-[slug]-hero` | 16:9 desktop, 4:5 mobile, social crop | Required before article publication; author, caption, alt, rights, locale/market, date |
| 50 | Published news article | `news-[slug]-inline-[n]` | 3:2 or source-safe crop | Optional; each meaningful image needs caption/alt and rights |
| 50 | Search no-result state | `search-empty-state` | 1:1 or transparent SVG/PNG | Optional and decorative; text recovery is required |
| 51 | Legal/privacy/cookie pages | None | Text-first | No legal term or disclaimer may be baked into an image |
| 52 | Security/privacy support | `legal-privacy-support` | 3:2 or 4:5 | Optional decorative art only; no security claim in pixels |
| 53 | Planned maintenance/outage | `maintenance-hero` | 16:9 desktop, 4:5 mobile | Required only if a visual maintenance experience is approved; outage state must work without it |
| 54 | Social/structured metadata | `social-sharing-mark` | Platform-specific safe crop | Required only when an OG image is enabled; use a supplied brand asset, never a recreated logo |
| 56 | Save/share build confirmation | `commerce-save-build` | 3:2 | Optional nonessential explainer; no price, availability, or approval outcome |
| 56 | Finance education | `commerce-finance-education` | 3:2 | Optional; educational only, with contextual legal disclosure |
| 56 | Trade-in education | `commerce-trade-in-education` | 3:2 | Optional; must not imply a valuation |
| 56 | Reservation/booking confirmation | `commerce-reservation-confirmation`, `commerce-booking-confirmation` | 3:2 | Optional nonessential confirmation visuals; no guaranteed outcome or delivery date |
| 57 | Visual regression | Route screenshot baselines under `tests/visual/snapshots/` | Test-runner PNGs | Technical QA artifacts, not content assets; generated from approved staging only |
| 59 | Staging acceptance | Current-page LCP asset for every approved route | Responsive desktop/mobile derivatives | Required for an approved launch route; only the current LCP may be preloaded |
| 60 | Production/social launch | Brand mark and approved route imagery | Supplied derivatives only | Rights/expiry/market/locale evidence attached to release record |

## Existing model and technology slots reused by Phases 56–60

Configurator and model flows must draw from the exact model manifests in `assets/vehicles/{c2,s4,s6,x4,x6,r9}/README.md`. Technology routes must draw from the topic manifests in `assets/technology/{800v,battery-charging,intelligent-driving,software-connectivity,energy-ecosystem,safety}/README.md`. A trim/color/wheel/seating image is not interchangeable with another configuration.

## Metadata required before display

Every supplied image needs a stable asset ID, source filename and derivative filename, kind, localized alt/caption, focal point, desktop/mobile ratio, exact model/year/trim/color/wheel/interior context where relevant, market/locale scope, owner/license/expiry, accessibility treatment, publication status, and a rights-cleared review record. Meaningful images also need a text alternative. Posters and static equivalents are required for video, 360, and 3D experiences.

## No image required

Security headers, rate limits, CSRF, PII controls, cache keys, outage logic, SEO metadata, JSON-LD, CI checks, observability, release approvals, and post-launch review cadence are functional controls and do not require visual assets. Their absence must not block the text-based experience.
