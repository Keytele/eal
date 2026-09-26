# EAL 3D Asset Handoff

This folder is reserved for user-supplied, rights-cleared 3D assets used only by approved capability-gated experiences. It intentionally contains no vehicle geometry, texture, HDRI, animation, or generated substitute.

## Activation rule

No route may enable a WebGL/3D feature until the exact approved asset set has all of the following:

- A matching static poster in its model or technology manifest.
- A textual/static fallback that communicates the same essential information.
- Approved model, model-year, trim, configuration, market, and locale applicability.
- Rights, performance profile, and visual/technical-content approval.
- A feature flag with an owner, default-off state, expiry/review date, and a safe static fallback.

Use staged loading: poster first, disabled/loading controls, low-detail geometry, then high-quality textures. The viewer must work without auto-rotation, must pause when offscreen/hidden, and must respect reduced motion and Save-Data.

## Planned folders and slots

Create a subfolder only when an approved source asset is delivered. Names below are manifest identifiers, not requests to fabricate content.

| Asset ID pattern | Intended use | Required fallback |
| --- | --- | --- |
| `vehicle-{model}-{year}-{trim}-orbit` | Configurator/360 orbit model | Exact static configuration image or neutral media-pending frame |
| `vehicle-r9-{year}-aero` | R9 active-aero explanation | Annotated static approved diagram |
| `tech-800v-{market}-{version}` | 800V/powertrain explainer | Static energy-flow diagram with text equivalent |
| `tech-battery-{market}-{version}` | Battery exploded/cooling explainer | Static final-state exploded diagram with textual sequence |
| `tech-drivetrain-{market}-{version}` | Drivetrain cutaway | Static labelled diagram with text equivalent |

## Required 3D metadata

Record the fields in [../README.md](../README.md), plus:

| Field | Requirement |
| --- | --- |
| Asset package | Source filename, delivered format (`.glb`/`.gltf`), checksum, and version |
| Applicability | Exact model/year/trim/configuration/market; never use an approximate render as exact configuration media |
| Geometry | Units, coordinate system, scale, triangle count by LOD, animation clips, and authoring source |
| Materials | Texture list, dimensions, encoding/compression, HDR/lighting assumptions, and license |
| Runtime budget | Download size, decoded GPU memory, expected first-interaction budget, target devices, and fallback threshold |
| Interaction | Orbit/zoom bounds, keyboard alternatives, labels, and auto-rotation policy |
| Accessibility | Poster alt text, static text equivalent, reduced-motion behavior, and control labels |
| Approval | Product/technical/content approval, rights status, reviewer, and expiry/review date |

Do not bake a legal claim, price, specification, or required control into a 3D texture. Do not use an unapproved 3D asset to imply a feature, battery layout, aero behavior, or model configuration.
