# Staging readiness gate

Staging is the first environment allowed to use approved CMS/PIM/provider content. It must remain isolated from production credentials and must never publish placeholder fixtures as live data.

| Gate | Evidence required | Current state |
| --- | --- | --- |
| Content | Approved locale/market publication records and rights-cleared media | Blocked until supplied |
| Legal | Version, effective date, legal approval, and disclosure links | Contract/UI ready; content blocked |
| Commerce | Quote, finance, inventory, retailer, booking, reservation, payment, notification adapters | Provider selection required |
| Security/privacy | Header scan, mutation checks, redaction, retention/deletion evidence | Baseline implemented; external scan required |
| SEO/performance | Crawl, canonical/hreflang, schema validation, RUM and synthetic budget report | Local checks ready; staging measurements required |
| Accessibility | Axe, keyboard, screen-reader, zoom/reflow, reduced-motion evidence | Automated shell check ready; manual evidence required |
| Resilience | Outage and rollback rehearsal with owner and timestamps | Runbooks ready; rehearsal required |

The staging gate fails closed if any placeholder fixture, expired media, unapproved legal document, invalid commercial claim, stale inventory record, or missing market/locale context is visible on an acceptance route.
