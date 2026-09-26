# EAL Asset Handoff

This directory is the future-image handoff structure for the EAL website. It contains Markdown manifests only; no generated vehicle, people, landscape, UI, or logo imagery belongs here.

## Rules

- Place rights-cleared, user-approved assets in the folder and slot named by the relevant manifest.
- Preserve the source image at high quality. Supply a mobile crop only when the desktop crop cannot safely serve mobile.
- Register every supplied asset with localized alt text, focal point, aspect ratio, market, locale, model/trim/color applicability, usage rights, approval status, and expiry date if licensed.
- Do not use text baked into an image for any required interface, price, technical specification, or legal claim.
- Never replace the approved EAL mark with a recreated logo. The future application must use Logo/Logo.png as specified in IMPLEMENTATION.md.
- Do not enable video, 360, or WebGL media until it has an approved poster, an accessible static/text alternative, and a documented reduced-motion and Save-Data behavior. See [3d/README.md](3d/README.md).

## Folder map

| Folder | Purpose |
| --- | --- |
| brand | Brand/logo usage notes |
| global | Shared backgrounds, navigation, generic editorial media |
| vehicles | Model-specific media for C2, S4, S6, X4, X6, and R9 |
| technology | Technology landing and topic-specific visual media |
| editorial | Design, sustainability, story, news, and ownership imagery |
| retailers | Retailer/location imagery where approved |
| commerce | Neutral commerce UI/supporting imagery only |
| 3d | Approved 3D vehicle/technical packages and their capability-gated manifest requirements |
| legal | Optional legal-document/media assets; normally text-only |

## Required metadata for every asset

| Field | Requirement |
| --- | --- |
| Asset ID | Stable unique identifier |
| Filename | Original source filename and delivered derivative name |
| Type | Image, video, 360 frame set, illustration, icon, GLB/GLTF, texture, HDR environment, or poster |
| Locale | Localized alt text/caption availability |
| Market | Markets in which use is approved |
| Model context | Model, model year, trim, color, wheel, and interior where relevant |
| Aspect/crop | Desktop/mobile aspect ratio and focal point |
| Rights | Owner, license, approved uses, expiry/review date |
| Accessibility | Alt text or decorative rationale; caption/transcript for meaningful video |
| Publication | Draft, review, approved, expired, or archived |

## Motion-media acceptance

- Video must be muted, playsinline, poster-backed, and pausable when offscreen/document-hidden; it must not autoplay when reduced motion or Save-Data is active.
- 360 sets must identify frame count/order, exact vehicle configuration, drag alternative, and a static fallback. They must not depend on continuous auto-rotation.
- Approved 3D packages must supply the additional geometry, material, device-budget, interaction, accessibility, and approval metadata in [3d/README.md](3d/README.md). They are feature-flagged and default off until the implementation gate passes.
- Motion never makes an unapproved vehicle capability, performance value, or technical behavior appear factual. Refer to [../MOTION_IMPLEMENTATION.md](../MOTION_IMPLEMENTATION.md) for motion behavior and verification gates.

See the individual manifests for exact visual slots.

For the Phase 50–60 editorial, legal, resilience, commerce-QA, staging, and launch image handoff, use [phase-50-60-image-manifest.md](phase-50-60-image-manifest.md). It is a requirements document only; no image is approved by the presence of a slot.
