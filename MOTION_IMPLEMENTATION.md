# EAL Motion Implementation Contract

## Purpose and authority

This document turns [18_ANIMATION_MOTION_SYSTEM.md](Reference%20MDs/18_ANIMATION_MOTION_SYSTEM.md) into implementation rules. It applies to every web implementation task. In a conflict, live accessibility, performance, operational-data, and legal requirements override motion; this contract then governs the remaining motion behavior.

The EAL motion character is **quiet at rest, dramatic in transition, mechanical in response, and cinematic in presentation**. Motion must explain hierarchy or state. Remove it if it does neither. Do not use bouncy springs for primary UI, confetti, perpetual CTA shimmer, random particles, rapid flashing, large text flips, or a gaming-style HUD.

## Shared tokens and limits

Publish the following single source of truth in CSS and TypeScript. Components consume semantic aliases of these values and must not introduce arbitrary durations or easing curves.

| Token | CSS value | TypeScript seconds |
| --- | --- | --- |
| instant | 90ms | 0.09 |
| fast | 140ms | 0.14 |
| ui | 220ms | 0.22 |
| panel | 360ms | 0.36 |
| section | 520ms | 0.52 |
| hero | 900ms | 0.9 |
| cinematic | 1400ms | 1.4 |

| Easing | Value |
| --- | --- |
| standard | cubic-bezier(.2, .7, .2, 1) |
| enter | cubic-bezier(.16, 1, .3, 1) |
| exit | cubic-bezier(.7, 0, .84, 0) |
| emphasized | cubic-bezier(.22, 1, .36, 1) |
| linear | linear |

- Micro movement: 2-4 px; UI entrances: 8-16 px; section reveals: 20-40 px; cinematic panels: 40-80 px.
- Ordinary content must never travel 200 px or more.
- Parallax is 24-48 px desktop, 12-24 px tablet, and disabled or at most 8 px on mobile.
- Do not run more than one cinematic (Level 1) effect at once. Page budgets are: homepage one hero sequence plus one ambient effect and 2-4 reveals; model page one hero, sticky nav, gallery/360, and 2-3 editorial effects; commerce only state transitions; technology one hero and at most two high-value technical sequences; checkout/booking structural transitions only.

## Engine, component, and route policy

Use the least complex engine that can deliver the behavior:

1. CSS transitions/animations for control states, hover, press, basic header changes, and simple media loading.
2. Motion for React for component lifecycle, shared layouts, section reveal primitives, and layout animation.
3. Native View Transitions as a progressive enhancement for route and shared-vehicle transitions. Where unsupported, fall back to a 180-260 ms opacity transition; navigation semantics and focus behavior must be identical.
4. Intersection Observer for one-time below-fold reveal triggers at roughly 15-25% viewport entry.
5. GSAP/ScrollTrigger only for isolated, approved technical timelines that cannot be expressed with the above stack. An element may have one animation engine only.
6. Three.js/React Three Fiber only for approved 3D vehicle orbit, battery/powertrain cutaway, or aero visualizations. It is never a replacement for ordinary UI animation.

The design-system owner provides these primitives before route teams compose them: MotionProvider, PageTransition, SharedVehicleTransition, Reveal, RevealGroup, HeroReveal, ScrollProgress, ParallaxLayer, StickyHeaderMotion, MetricCountUp, AnimatedUnderline, MediaCrossfade, VehicleVariantTransition, LightSweep, LineDraw, HotspotPulse, ConfigChangeHighlight, StepTransition, SuccessCheck, and ReducedMotionFallback.

MotionProvider must honor the user preference, for example Motion reducedMotion=user. Shared vehicle media may use view-transition-name: vehicle-hero only when source and destination have the same approved media identity; names must be unique per simultaneous transition.

## Required behaviors by experience

### Global and editorial

- Landing/model initial sequence: header enters over 250-350 ms; hero resolves from opacity 0 and scale 1.02-1.04 over 800-1100 ms; then eyebrow, heading by line, copy, CTA, and metric rail. Heading-line stagger is 60-90 ms, supporting content 80-120 ms, and the whole hero completes within 1.8 s without blocking controls.
- Header changes from transparent to rgba(6,16,26,.88) on scroll, with an optional performance-approved 16 px backdrop blur, 6-10 px height compression, and a fading border in 220-300 ms. It must not repeatedly slide with scroll direction.
- Standard editorial Reveal is opacity plus 24 px vertical translation, section duration, enter easing, and runs once. Stagger only meaningful compact groups; never stagger paragraphs line-by-line.
- Cards may scale media to 1.02-1.035, lift no more than 3 px, brighten a border, and translate an arrow 4 px. Mobile has no hover dependency.

### Vehicles and commerce

- Model hero parallax is subtle. Sticky model navigation enters from 8 px, with an active underline that glides in 220-320 ms. Galleries crossfade in 300-450 ms. 360 viewers map drag directly to rotation, auto-rotate at most once after idle, and stop permanently on interaction.
- Configurator changes explain the affected state. Trim/color/wheel/interior media transitions preserve camera angle and use a 280-420 ms crossfade or approved 3D material interpolation. Preload adjacent common variants only after idle; never flash an empty canvas.
- Prices and other operational values update immediately. A price may receive a 150-220 ms emphasis after the value is readable; it must never roll, count, or use a slot-machine effect. Step panels move at most 24 px. Save/share and completion messages use a short 220-320 ms check-line draw plus persistent readable text.

### Technology and media

- Technical animation is explanatory, directional, and backed by approved structured data. 800V flow progresses charger -> inlet -> battery -> inverter -> motors; a charging curve draws axes, curve, marker, then value; battery sequences require a final-state exploded fallback; ADAS highlights sensor/lane state without implying unsupported autonomy; cabin interactions use shared layout transitions rather than simultaneous element animation.
- Hero/background video is muted, playsinline, poster-backed, 8-20 seconds where looped, and paused when offscreen or the document is hidden. It must not autoplay when reduced motion or Save-Data is active.
- Every 3D viewer uses staged loading: static poster, disabled/loading controls, low-detail geometry, then high-quality textures. All 3D and technical features are feature-flagged and retain an equivalent static visual plus text explanation.

## Accessibility, localization, analytics, and performance gates

### Reduced motion and resilience

Ship a global prefers-reduced-motion safety baseline and explicit component alternatives. Reduced motion disables parallax, auto-rotation, scroll-scrubbing, cinematic camera movement, autoplay video, and animated technical diagrams; it may retain short opacity changes where useful. It never removes content, controls, selection state, or an outcome message.

Motion must not move focus, delay interaction, create layout shift, hide keyboard focus, or make a page unusable when JavaScript or the selected animation engine fails. Pause ambient/video/observer-driven work outside the viewport and when the tab is hidden.

### English and Simplified Chinese

English headings may reveal by line with mild tracking interpolation. Simplified Chinese must reveal by line, block, or phrase, never individual Han characters by default, and tracking remains almost static. Each locale owns its line count, clipping mask, and timing; no pixel-identical English mask is reused for Chinese.

### Analytics

Decorative animation, hover, and ordinary scroll reveals produce no event. With consent, record only intent-bearing interactions: viewer_360_started, technology_demo_opened, video_started, interactive_diagram_expanded, and configurator_variant_changed. Events use the established typed analytics contract, never include PII or sensitive form state, and attach only permitted market/locale/model/context dimensions.

### Performance and verification

- Animate transform and opacity; avoid width, height, top, left, and large-area filters when a compositor-friendly alternative exists.
- Apply will-change only while an animation needs it. Lazy-load GSAP, R3F/Three, and other noncritical engines at the route level; none may delay LCP or ship globally for one route.
- Target smooth interactive animation at approximately 60 fps on 4x CPU slowdown, a mid-range Android profile, Safari/iOS, and an integrated laptop GPU. Test both locales, mobile simplification, View Transition fallback, reduced motion, no-JS/degraded animation, and absence of layout shift.

## Ownership and merge gates

| Area | Accountable owner | Required review |
| --- | --- | --- |
| Tokens, provider, generic primitives, global fallback | Design system | Accessibility and performance |
| Home/model choreography, shared vehicle routes | Brand/discovery and vehicle experience | Design system and quality |
| Selector, price, summary, step, booking, and checkout feedback | Commerce or retail/booking | Accessibility and commerce correctness |
| Technical sequences and 3D capability shells | Editorial/technology | Catalog/content approval, accessibility, performance |
| Event schema and consent dispatch | Analytics | Privacy/analytics |
| Motion tests, visual checks, device profiling | Quality | Owning implementation role |

An implementation may not introduce a new engine, WebGL asset, analytics event, or cinematic sequence without the named owner and gate. See [SUBAGENTS.md](SUBAGENTS.md) for delegated-work boundaries and [assets/3d/README.md](assets/3d/README.md) for source-media acceptance.

## Merge checklist

- [ ] Uses approved shared tokens and one engine per element.
- [ ] Explains state or hierarchy without blocking interaction.
- [ ] Retains semantic, keyboard, focus, and static/no-JS behavior.
- [ ] Has a tested reduced-motion and mobile alternative.
- [ ] Creates no material layout shift and meets the device performance gate.
- [ ] Has verified English and Simplified Chinese layouts.
- [ ] Uses approved media/data and does not animate a price or unapproved technical claim deceptively.
- [ ] Emits only approved, consent-aware intent analytics.
