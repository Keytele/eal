# 18 — Animation and Motion System

## Purpose

Define the production motion language for the EAL website.

The site should feel **cinematic, premium, responsive and visually ambitious**. Motion may be flashy, but it must never feel like a gaming UI, a generic startup landing page, or a collection of unrelated effects. Visual drama should come from **precise choreography, lighting, depth, vehicle movement and controlled reveal timing**.

The core motion idea is:

> **Quiet at rest. Dramatic in transition. Mechanical in response. Cinematic in presentation.**

Use the supplied homepage, model, shopping and technology mockups as the visual foundation. Motion should amplify those compositions rather than redesign them.

---

## 1. Motion principles

### 1.1 Premium, not playful

Prefer:

- Smooth acceleration/deceleration.
- Controlled staggered reveals.
- Slow camera-like movement.
- Subtle parallax.
- Light sweeps and reflections.
- Mechanical panel movement.
- Precise line drawing.
- Vehicle crossfades and shared-element transitions.
- Scroll-linked technical diagrams.

Avoid:

- Bouncy springs on primary UI.
- Rubber-band scaling.
- Excessive card wobble.
- Confetti.
- Constant pulsing.
- Random particle effects.
- Rapid flashing.
- Large text spinning or flipping.
- Animations that interfere with buying/configuration tasks.

### 1.2 Motion hierarchy

Every animation belongs to one of four levels:

1. **Cinematic** — hero scenes, full-page transitions, high-impact vehicle moments.
2. **Structural** — section reveals, sticky nav changes, panels entering/leaving.
3. **Interactive** — hover, press, trim changes, swatches, configurator responses.
4. **Ambient** — subtle background light, reflections, video, depth movement.

Do not run multiple Level 1 cinematic effects at the same time.

### 1.3 Motion should explain state

Motion must reinforce:

- What changed.
- Where content came from.
- What is selected.
- Which page/step is active.
- How vehicle configuration changed.
- Which technology feature is being demonstrated.

If motion does not improve hierarchy, state comprehension or brand impression, remove it.

---

## 2. Motion tokens

Use shared tokens. Do not hard-code arbitrary durations and easings throughout components.

### CSS variables

```css
:root {
  --motion-instant: 90ms;
  --motion-fast: 140ms;
  --motion-ui: 220ms;
  --motion-panel: 360ms;
  --motion-section: 520ms;
  --motion-hero: 900ms;
  --motion-cinematic: 1400ms;

  --ease-standard: cubic-bezier(.2, .7, .2, 1);
  --ease-enter: cubic-bezier(.16, 1, .3, 1);
  --ease-exit: cubic-bezier(.7, 0, .84, 0);
  --ease-emphasized: cubic-bezier(.22, 1, .36, 1);
  --ease-linear: linear;
}
```

### TypeScript tokens

```ts
export const motion = {
  duration: {
    instant: 0.09,
    fast: 0.14,
    ui: 0.22,
    panel: 0.36,
    section: 0.52,
    hero: 0.9,
    cinematic: 1.4,
  },
  ease: {
    standard: [0.2, 0.7, 0.2, 1],
    enter: [0.16, 1, 0.3, 1],
    exit: [0.7, 0, 0.84, 0],
    emphasized: [0.22, 1, 0.36, 1],
  },
} as const;
```

### Distance tokens

- Micro movement: `2–4 px`.
- UI entrance: `8–16 px`.
- Section reveal: `20–40 px`.
- Cinematic panel movement: `40–80 px`.
- Parallax range: normally `8–48 px`, depending on viewport.

Never use excessive 200+ px reveal travel for ordinary content.

---

## 3. Recommended motion stack

### Primary

Use:

- Native CSS transitions/animations for simple states.
- `motion` / Motion for React for component animation and shared layout transitions.
- View Transitions API for route/shared-element transitions where supported.
- Intersection Observer for lightweight reveal triggers.

### Optional advanced layer

Use GSAP/ScrollTrigger only for specific high-value sequences that are difficult to express cleanly with the primary stack, such as:

- Battery cutaway timelines.
- Scroll-scrubbed drivetrain diagrams.
- Multi-stage technical storytelling.

Do not use multiple animation engines for the same component.

### 3D/WebGL

Use Three.js / React Three Fiber only when the experience materially benefits from true 3D, for example:

- Vehicle configurator orbit view.
- Exploded battery/powertrain view.
- Aero airflow visualization.

Do not use WebGL merely to animate text, buttons or normal sections.

---

## 4. Global page motion

## 4.1 Initial page load

Sequence on major landing/model pages:

1. Header fades in over `250–350 ms`.
2. Hero vehicle/image resolves from `opacity: 0` and `scale: 1.02–1.04` to `1` over `800–1100 ms`.
3. Eyebrow enters.
4. Hero heading enters by line.
5. Supporting copy fades in.
6. CTA group enters.
7. Metric rail appears last.

Recommended stagger:

- Heading lines: `60–90 ms`.
- Supporting content: `80–120 ms`.
- Total hero reveal budget: under `1.8 s`.

Do not block interaction until the sequence completes.

## 4.2 Route transitions

For transitions between related pages, use shared vehicle imagery where possible.

Examples:

- `/vehicles/s6` → `/configure/s6`
- `/vehicles/x4` → `/shop/x4`
- `/technology` → `/technology/800v`

Desired effect:

- Existing hero media subtly enlarges or moves to the destination position.
- Background crossfades dark-to-dark.
- Destination UI fades in after the shared element stabilizes.

Reference CSS:

```css
.vehicle-shared-media {
  view-transition-name: vehicle-hero;
}

::view-transition-old(vehicle-hero),
::view-transition-new(vehicle-hero) {
  animation-duration: 520ms;
  animation-timing-function: var(--ease-emphasized);
}
```

Fallback: `180–260 ms` opacity transition.

## 4.3 Header behavior

At top:

- Transparent header.
- White logo/navigation.

On scroll:

- Background becomes `rgba(6,16,26,.88)`.
- Optional `backdrop-filter: blur(16px)` only when performance is acceptable.
- Header height may compress by `6–10 px`.
- Border line fades in.

Duration: `220–300 ms`.

Do not slide the header dramatically on every scroll direction change.

---

## 5. Homepage animations

The homepage should contain the highest concentration of brand motion.

## 5.1 Hero vehicle cinematic entrance

Recommended sequence:

- Background starts at `scale(1.025)` and slowly resolves to `1`.
- Car moves `20–32 px` horizontally into position while fading from `0` to `1`.
- A restrained highlight sweep travels across bodywork after the car settles.
- Headlamp/DRL may illuminate once during the sequence.

Lighting sweep duration: `900–1400 ms`.

Lighting sweep rules:

- One pass only on initial reveal.
- Very low opacity.
- Do not loop.

## 5.2 Hero text reveal

Use line-based rather than character-by-character animation.

English:

- Clip reveal upward by line.
- Slight tracking settle is acceptable.

Simplified Chinese:

- Fade/clip by line or phrase.
- Do not animate each Han character independently for normal page loads.
- Do not expand tracking dramatically.

## 5.3 Specification rail

On first viewport entry:

- Icons fade/translate in.
- Numeric values count to their final value once.
- Unit labels remain static.

Example:

`0 → 720 km`

Count duration: `600–900 ms`.

Never animate price counters this way in commerce contexts; price changes should be immediate and unambiguous.

## 5.4 Vehicle lineup rail

Desktop hover:

- Media zoom: `1 → 1.025` over `360 ms`.
- Car translates upward by `3–5 px`.
- Border/selection line brightens.
- Arrow moves right by `4 px`.
- Model subtitle fades from muted to full opacity.

Selected/active vehicle:

- Optional thin light line travels along bottom edge once.

Mobile:

- No hover dependency.
- Use snap scrolling and active-card emphasis.

---

## 6. Vehicle model page animations

Applies to C2, S4, S6, X4, X6 and R9.

## 6.1 Hero transformation

As the user scrolls from the hero into content:

- Hero media may scale from `1` to `1.04` very slowly.
- Text opacity reduces slightly.
- Sticky model navigation fades/slides into its fixed state.

Avoid fast parallax that causes the car to appear detached from the scene.

## 6.2 Sticky section navigation

When becoming sticky:

- `translateY(8px) → 0`.
- Fade from `0 → 1`.
- Active underline expands from left to right.

On section change:

- Underline glides between tabs in `220–320 ms`.
- Do not reanimate the entire nav.

## 6.3 Exterior gallery

Image change:

- Crossfade `300–450 ms`.
- Optional `scale 1.01 → 1`.
- Thumbnail selection border animates in `140–220 ms`.

Drag gallery:

- Use inertial movement with restrained momentum.
- No elastic overscroll beyond a few pixels.

## 6.4 360-degree vehicle viewer

Interaction:

- Pointer drag maps directly to vehicle rotation.
- On release, momentum should be extremely light or disabled.
- Auto-rotation may run once after idle for discoverability, then stop on user interaction.

Optional first-use cue:

- `Drag to rotate` icon/label pulses once, then disappears.

Never force continuous auto-rotation.

## 6.5 Feature callouts

For close-up vehicle details:

- Callout line draws outward from anchor point.
- Label fades after line completes.
- Hotspot uses one subtle ring pulse on entry.

Avoid perpetual blinking hotspots.

---

## 7. Shopping and configurator animations

Commerce motion must feel polished while preserving clarity and speed.

## 7.1 Trim selection

When switching trims:

- Selected card border animates.
- Vehicle image crossfades/morphs to new trim.
- Changed specification values fade/slide by `4–8 px`.
- Price updates immediately, then receives a subtle `150–220 ms` emphasis.

Do not use rolling slot-machine numbers for prices.

## 7.2 Exterior color change

Preferred effect:

- Crossfade between pre-rendered vehicle assets, or shader/material interpolation in 3D.
- Duration `280–420 ms`.
- Preserve camera angle exactly.

If pre-rendered images are used:

- Preload adjacent/common color variants after initial page idle.
- Never flash a blank background between colors.

Swatch response:

- Selected ring expands by `1–2 px`.
- Check mark fades in.
- Color name crossfades.

## 7.3 Wheel selection

On wheel change:

- Crossfade wheel asset or re-render.
- Optional `6–12°` wheel rotation over `300–400 ms` to make the change feel mechanical.
- Do not spin continuously.

## 7.4 Interior material selection

Use:

- Crossfade interior image.
- Gentle camera push `1.015 → 1`.
- Material thumbnail receives a moving light highlight on selection.

## 7.5 Configuration summary

When configuration changes:

- Summary row affected by the change receives a subtle background fade.
- Total price updates immediately.
- Save/share status appears with a short success motion.

Suggested status animation:

- Check icon line-draw in `220–320 ms`.
- Message fades in and remains readable.

## 7.6 Step progression

For stepped configurators:

- Progress line fills smoothly.
- Current step label increases emphasis.
- Previous step remains visible but subdued.
- Panel transition uses horizontal/opacity movement no greater than `24 px`.

Never hide critical context with full-screen transition effects between every step.

---

## 8. Technology page animations

Technology pages can be the most expressive after the homepage because motion can explain engineering concepts.

## 8.1 800V architecture

Use scroll-linked visual storytelling:

- Energy line illuminates from charger → battery → inverter → motors.
- Each stage activates as its text section enters.
- Power flow should use linear, directional light movement.

Animation concept:

```text
Grid/charger
   ↓
800V charge inlet
   ↓
Battery pack
   ↓
Inverter
   ↓
Motors
```

Use glow sparingly. Keep the technical object itself readable.

## 8.2 Charging curve

On chart entry:

- Axis fades in first.
- Curve draws from left to right.
- `10–80%` marker appears after curve reaches that point.
- Supporting number fades in last.

Do not animate fake performance data. All values must come from approved structured specs.

## 8.3 Battery system

Possible sequence:

1. Battery enclosure appears.
2. Upper cover shifts/fades away.
3. Cell modules illuminate sequentially.
4. Cooling channels highlight.
5. Thermal path animates.

For reduced-motion mode, show a static exploded diagram.

## 8.4 Intelligent driving

Visual effects:

- Sensor field arcs fade into view.
- Detected vehicles receive a calm outline.
- Lane model draws forward from the car.
- Blind-spot region illuminates only when demonstrated.

Avoid sci-fi overload. The visual language should look like a premium engineering visualization, not a video game HUD.

## 8.5 Cabin software and connectivity

Use real interface-like motion:

- App cards open with shared-layout transitions.
- Navigation panel expands from its source tile.
- Climate drawer rises from lower screen area.
- Phone/digital key connection has a short radial confirmation.
- OTA update timeline progresses smoothly.

Do not animate every UI element simultaneously.

---

## 9. Editorial section reveals

Standard below-fold reveal preset:

```ts
const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
```

Trigger once when approximately `15–25%` of the component enters the viewport.

Use stagger only for meaningful groups:

- Feature icons.
- Trim cards.
- Technology pillars.
- Specification groups.

Avoid staggering long paragraphs line-by-line.

---

## 10. Parallax and depth

Use parallax only on large visual storytelling regions.

Recommended depth layers:

- Background architecture/mountains: slowest.
- Vehicle: near-static or very subtle movement.
- Foreground reflections/graphics: slightly faster.
- UI content: normal scroll speed.

Maximum typical parallax difference over a section:

- Desktop: `24–48 px`.
- Tablet: `12–24 px`.
- Mobile: disabled or `≤ 8 px`.

Never attach critical text to parallax movement.

---

## 11. Ambient effects

Permitted ambient effects:

- Very slow light gradient drift.
- Subtle reflection movement over glossy vehicle surfaces.
- Slow background video loops.
- Minimal floating dust/rain only when genuinely part of the campaign art direction.
- Soft headlamp/taillamp glow.

Rules:

- Ambient effects must not compete with content.
- No constant bright shimmer on CTAs.
- No frequent flashes.
- Pause offscreen animations.
- Pause when tab is hidden.

---

## 12. Button and control motion

## Primary button

Hover:

- Background shifts slightly warmer/brighter.
- Arrow translates `3–4 px`.
- Optional thin inner highlight appears.

Press:

- `scale(.985)` for `90–120 ms`.

Focus:

- No motion required; strong visible focus ring is more important.

## Secondary button

Hover:

- Border opacity increases.
- Background receives `rgba(255,255,255,.04–.08)`.
- Arrow/play icon shifts subtly.

## Icon buttons

- Icon movement `2–3 px` maximum.
- Rotation allowed only when functionally meaningful, e.g. expand/collapse or refresh.

---

## 13. Cards and tiles

Hover behavior:

- Media scale max `1.02–1.035`.
- Surface lift max `translateY(-3px)`.
- Border brightens.
- Arrow translates right.

Do not use large shadows; use contrast and border treatment.

For technology cards:

- Optional animated line/icon detail can activate once on hover.

For shopping cards:

- Keep movement restrained to avoid reducing perceived transaction stability.

---

## 14. Forms, booking and checkout

Motion should reduce perceived complexity.

### Field focus

- Border/focus indicator transitions in `120–180 ms`.
- Labels may shift only if using a tested floating-label pattern.

### Validation

- Error message fades/slides in `4–6 px`.
- Do not shake input fields.

### Multi-step booking

- Progress indicator animates to next state.
- New step crossfades with max `16 px` movement.
- Preserve scroll position intentionally.

### Success

Use a short line-draw/check animation plus confirmation text.

No confetti.

---

## 15. Dealer locator and inventory

### Map markers

- Selected marker enlarges `1 → 1.12`.
- One short ring pulse when newly selected.
- Corresponding list item highlights simultaneously.

### Inventory results

- Filter updates crossfade/reflow smoothly.
- Use layout animation for card movement when sort/filter changes.
- Avoid long exit animations; data responsiveness matters more.

### Availability updates

When availability changes:

- Status badge crossfades.
- Do not animate stock counts dramatically.

---

## 16. Loading states

Prefer content skeletons and media placeholders over spinners.

### Hero image loading

- Use dominant-color/dark placeholder.
- Fade optimized image in over `250–450 ms`.
- Do not blur heavily behind thin typography.

### Configurator media

- Preserve exact aspect ratio.
- If variant image takes longer than `250 ms`, show a low-key progress state without collapsing the viewport.

### 3D viewer

Use staged loading:

1. Static poster image.
2. Viewer controls disabled/loading.
3. Low-detail geometry ready.
4. High-quality textures resolve progressively.

---

## 17. Video motion

Hero/background video rules:

- Muted.
- `playsinline`.
- No audio autoplay.
- Poster image always provided.
- Pause when offscreen.
- Pause when document is hidden.
- Respect `prefers-reduced-motion` and `Save-Data`.

Recommended loop duration: `8–20 s`.

Avoid loops with obvious start/end jumps.

---

## 18. Reduced motion behavior

WCAG 2.2 AA remains mandatory.

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

The blanket rule above is acceptable as a safety baseline, but production components should preferably provide explicit reduced-motion states.

Reduced-motion mode should:

- Disable parallax.
- Disable auto-rotation.
- Disable scroll-scrubbed camera movement.
- Replace animated technical diagrams with static final-state diagrams.
- Use simple opacity transitions only where useful.
- Keep all content and controls fully available.

### Motion configuration

```tsx
<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```

---

## 19. Performance budget

Animation must not compromise Core Web Vitals.

### Rules

- Prefer `transform` and `opacity`.
- Avoid animating `width`, `height`, `top`, `left` when transform can achieve the same effect.
- Avoid large-area filter animation.
- Use `will-change` only while needed.
- Do not permanently promote dozens of layers.
- Pause animations outside viewport.
- Lazy-load noncritical motion systems.
- Do not delay LCP for JavaScript-driven animation.

### Target

Interactive animation should sustain approximately `60 fps` on modern mid-range devices.

Test at:

- 4× CPU slowdown.
- Mid-range Android device profile.
- Safari/iOS.
- Integrated laptop GPU.

### JavaScript budget

Do not ship GSAP, Three.js or another large motion dependency globally if only one or two routes use it.

Use route-level dynamic imports.

---

## 20. Animation budget by page type

To prevent visual overload:

### Homepage

- 1 major hero sequence.
- 1 ambient background effect.
- 2–4 below-fold section reveals.
- Interactive lineup card effects.

### Model page

- 1 hero sequence.
- 1 sticky-nav transition.
- Gallery/360 interaction.
- 2–3 editorial scroll effects.

### Shopping/configurator

- Minimal hero reveal.
- State transitions for configuration.
- No persistent ambient effects around forms/price summary.

### Technology page

- 1 hero reveal.
- Up to 2 high-value technical animation sequences.
- Standard section reveals elsewhere.

### Checkout/booking

- Structural transitions only.
- No cinematic animation.

---

## 21. Bilingual motion rules

English and Simplified Chinese must feel equally intentional.

### English

- Uppercase line reveals are allowed.
- Mild tracking interpolation may be used.

### Simplified Chinese

- Animate by line, block or phrase.
- Do not animate character-by-character by default.
- Keep tracking nearly static.
- Allow different line counts and animation timing if translation length changes.

Never assume the Chinese version can reuse English text masks pixel-for-pixel.

---

## 22. Suggested reusable motion components

Implement reusable primitives rather than page-specific animation code.

```text
MotionProvider
PageTransition
SharedVehicleTransition
Reveal
RevealGroup
HeroReveal
ScrollProgress
ParallaxLayer
StickyHeaderMotion
MetricCountUp
AnimatedUnderline
MediaCrossfade
VehicleVariantTransition
LightSweep
LineDraw
HotspotPulse
ConfigChangeHighlight
StepTransition
SuccessCheck
ReducedMotionFallback
```

Suggested API:

```tsx
<Reveal
  preset="section"
  once
  delay={0.08}
>
  <SectionContent />
</Reveal>
```

```tsx
<MediaCrossfade
  src={activeVehicleImage}
  alt={vehicleAlt}
  duration="panel"
/>
```

---

## 23. Analytics guidance

Do not emit analytics for ordinary decorative animation.

Track only interactions that indicate intent, for example:

- 360 viewer started.
- Technology demo opened.
- Video played.
- Interactive diagram expanded.
- Configurator variant changed.

Do not track every hover or scroll reveal.

---

## 24. QA checklist

Before merging an animated feature, verify:

- [ ] Animation has a clear purpose.
- [ ] It matches the EAL premium visual language.
- [ ] It does not block interaction.
- [ ] Keyboard operation remains unaffected.
- [ ] Focus is never moved for decorative reasons.
- [ ] Reduced-motion mode works.
- [ ] Mobile behavior is simplified where appropriate.
- [ ] Animation does not create layout shift.
- [ ] The page remains usable if animation JS fails.
- [ ] Offscreen animation pauses.
- [ ] Route transitions preserve navigation semantics.
- [ ] Performance is acceptable on mid-range devices.
- [ ] English and Chinese layouts are both tested.
- [ ] Commerce prices and operational values remain instantly readable.
- [ ] No autoplay audio is introduced.
- [ ] Technical animations do not imply unapproved capabilities or inaccurate data.

---

## 25. Priority implementation list

### Phase 1 — core polish

1. Header state transition.
2. Hero reveal system.
3. Standard section reveal.
4. Button/icon interactions.
5. Vehicle card hover.
6. Configurator media crossfade.
7. Trim/color/wheel selection motion.
8. Sticky model nav animation.
9. Reduced-motion support.

### Phase 2 — premium brand motion

1. Shared vehicle route transitions.
2. Homepage vehicle light sweep.
3. 360 viewer discovery motion.
4. Cinematic vehicle gallery transitions.
5. Animated metric rails.
6. Editorial parallax layers.

### Phase 3 — technology storytelling

1. 800V energy-flow sequence.
2. Charging-curve animation.
3. Battery exploded view.
4. Intelligent-driving sensor visualization.
5. Cabin software shared-layout interactions.

### Phase 4 — advanced optional experiences

1. Full 3D configurator.
2. Active-aero visualization for R9.
3. Interactive drivetrain cutaway.
4. Campaign-specific cinematic transitions.

---

## Final motion direction

The target experience should feel as if the EAL website itself has been engineered with the same discipline as the vehicles:

- **Fast when the user acts.**
- **Calm when the user reads.**
- **Dramatic when the brand speaks.**
- **Precise when the vehicle changes.**
- **Invisible when motion would get in the way.**

Flashiness should come from **high-quality vehicle media, controlled light, depth, shared transitions and engineering visualizations**, not from excessive movement.
