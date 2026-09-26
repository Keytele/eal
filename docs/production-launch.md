# Production launch and stewardship

Phases 60.0–60.2 are a controlled-release process, not a content shortcut. The release owner attaches evidence for every market and locale before enabling a public flag.

## Launch record

- Release ID and artifact checksum:
- Markets/locales:
- Models and lifecycle records:
- CMS/PIM/pricing/inventory/retailer/booking/payment providers:
- Legal document versions and effective dates:
- Security, accessibility, SEO, performance, and disaster-recovery evidence:
- Feature flags and rollback owner:
- On-call coverage and alert destinations:

## Rollout

1. Promote the staging-tested artifact with environment approvals.
2. Keep market, commerce, reservation, finance, and advanced-media flags at safe defaults until each evidence row is approved.
3. Start with one market/locale slice, watch provider failures, freshness lag, conversion/error events, and Core Web Vitals, then expand.
4. Record the rollback decision path in `CONTINUITY.md` and use [runbooks/rollback.md](runbooks/rollback.md) if any launch gate regresses.

## Post-launch cadence

| Review | Owner | Cadence |
| --- | --- | --- |
| Price, inventory, retailer freshness | Commerce/integrations | Daily while live; weekly summary |
| Claims, legal versions, media rights/expiry | Content/legal | Weekly and before expiry |
| Security headers, dependency and privacy controls | Security/platform | Monthly and after incidents |
| Accessibility and reduced motion | Design system/quality | Per release and quarterly |
| Performance, RUM, analytics quality | Performance/analytics | Daily dashboard; monthly review |
