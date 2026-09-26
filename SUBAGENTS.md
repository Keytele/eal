# EAL Subagent Delivery Guide

## Purpose

Use this guide only when implementation work is explicitly delegated. It prevents overlapping edits, unsupported assumptions, and unverified production claims while allowing bounded workstreams to proceed in parallel.

This guide does not authorize agents to publish content, activate payments, contact providers, change production systems, or invent business/legal data.

## Common rules

Before assigning parallel work, the primary owner adds the workstream owner, task IDs, file boundary, dependencies, and safe restart instruction to CONTINUITY.md. On completion or pause, the primary owner records the delegated handoff and validation evidence there.

Every subagent must:

When motion is in scope, read [MOTION_IMPLEMENTATION.md](MOTION_IMPLEMENTATION.md) and [Reference MDs/18_ANIMATION_MOTION_SYSTEM.md](Reference%20MDs/18_ANIMATION_MOTION_SYSTEM.md) before selecting an engine or editing.

1. Read [IMPLEMENTATION.md](IMPLEMENTATION.md), the relevant source specifications under \`Reference MDs/EAL_Website_Codex_Pack\`, and the assigned task IDs in [tasks.md](tasks.md).
2. State its exact files, task IDs, inputs, outputs, dependencies, and validation commands before editing.
3. Work only within its assigned file boundary; report conflicts instead of editing another owner's area.
4. Use approved design tokens, translation keys, typed data contracts, and semantic HTML.
5. Treat all reference-image content as visual inspiration only.
6. Avoid hard-coded approved claims, price, availability, finance, legal text, provider credentials, or inaccessible interactions.
7. Report changed files, tests run, known limitations, and handoff requirements on completion.
8. Supply a concise continuity handoff containing task IDs, changed files, validation, decisions, blockers, and a safe restart instruction.
9. For motion work, name the token(s), engine, reduced-motion/static fallback, locale checks, performance evidence, and analytics-event decision before editing.

## Recommended roles

| Role | Owns | Must not own |
| --- | --- | --- |
| Foundation | Tooling, tokens, app shell, shared conventions | Commerce rules or operational adapters |
| Design system | Reusable primitives, accessibility states, visual tokens | Route-specific business content |
| Motion/interaction | Motion composition, route/shared-element choreography, engine coordination | Token changes, commerce state semantics, or unapproved technical claims |
| Localization | Routing, translations, formatter utilities, locale QA | Translated legal approval |
| Catalog/model | Vehicle schemas, model templates, specs, media mapping | Live price/inventory claims |
| Editorial/technology | Content modules and technology layouts | Unsupported technical claims |
| Commerce | Configurator, compatibility, price/finance interfaces, build state | Provider secrets or live payment activation |
| Retail/booking | Retailer, inventory, booking, lead interfaces | Map/payment vendor selection |
| Security/operations | Security controls, observability, CI/CD, runbooks | Product UI copy |
| Quality | Tests, a11y, visual regression, performance validation | Feature behavior changes without owner approval |

## Motion ownership boundaries

- Design system owns exact motion tokens, the motion provider, reduced-motion policy, generic motion primitives, and the global header transition. It exposes stable APIs before route teams use them.
- Motion/interaction owns cross-route choreography and may compose those primitives, but cannot add a competing engine or alter shared tokens without the design-system owner.
- Brand/discovery and vehicle experience own page-level home/model choreography; commerce and retail/booking own state-feedback motion, with values and submission outcomes immediately readable; editorial/technology owns approved technical sequences and 3D capability shells.
- Analytics owns event schema/consent dispatch. Quality owns the motion test matrix and performance evidence. Technology/3D work additionally requires the approved asset/fallback gate in [assets/3d/README.md](assets/3d/README.md).
- One element uses one animation engine. A cross-boundary motion change is blocked until the primary owner records an explicit file boundary and owner decision in CONTINUITY.md.

## Handoff format

Start each assignment with:

\`\`\`text
Task IDs:
File boundary:
Inputs/source documents:
Dependencies:
Output:
Validation:
Escalation trigger:
\`\`\`

Finish each assignment with:

\`\`\`text
Completed task IDs:
Changed files:
Validation evidence:
Deferred work:
Risks or assumptions:
Required follow-up owner:
\`\`\`

## Sequencing rules

- Foundation, tokens, localization conventions, schemas, and accessibility primitives land before route work.
- Shared interface changes require a written contract review before dependent agents begin.
- Route work may proceed in parallel only after its shared dependencies are stable.
- Commerce UI can use typed mock adapters in non-production environments; production integration work waits for approved provider contracts.
- Quality agents validate a stable branch/worktree and report defects to the owning role rather than making broad unrelated edits.
- Parallel work cannot begin until its starting state is documented in CONTINUITY.md.
- Parallel work cannot be merged or marked complete until its outcome and validation evidence are recorded in CONTINUITY.md.
- A motion handoff cannot be marked complete without the selected engine, token use, reduced-motion behavior, static/no-JS fallback, English/Chinese validation, and device-performance evidence.

## Mandatory review gates

| Gate | Required evidence |
| --- | --- |
| UI completion | Responsive states, keyboard behavior, focus behavior, loading/error/empty variants |
| Localization completion | English and Simplified Chinese rendering, preserved context on locale switching |
| Commerce completion | Schema validation, market-aware data, idempotency/error-state tests, no stale fallback claims |
| SEO completion | Metadata, canonical/hreflang, valid structured data only where applicable |
| Media completion | Correct placeholder/asset mapping, alt text, focal point, responsive crop and rights metadata |
| Motion completion | Token/engine review, reduced-motion and no-JS fallback, keyboard/focus preservation, English/Chinese layout check, mobile/device performance evidence |
| 3D completion | Approved package metadata, poster/text fallback, default-off feature flag, loading/pause behavior, and GPU/device budget evidence |
| Security completion | Input validation, authorization/rate-limit/CSRF review as relevant, no secrets exposed |
| Release completion | Automated checks, staging smoke test, observability and rollback requirements satisfied |

## Escalate immediately

Stop and ask the primary owner when:

- A requirement needs an approved price, claim, finance term, legal clause, or inventory fact.
- A provider decision or credential is needed.
- A task crosses another role's file boundary.
- Reference imagery conflicts with accessibility, actual product data, legal guidance, or responsive constraints.
- A data model would make market/locale behavior unsafe.
- A test reveals a payment, reservation, PII, consent, or security risk.
- A proposed motion uses a new engine, lacks a reduced-motion/static fallback, moves focus, delays commerce clarity, drops frames on target devices, or requires an unapproved 3D/technical asset.

## Definition of a valid delegated result

A delegated result is complete only when the assigned task IDs are checked off with evidence, dependencies are satisfied, no unapproved production facts have been added, and the owner can integrate it without making unstated design or architecture decisions.
