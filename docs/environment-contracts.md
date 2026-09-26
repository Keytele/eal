# Environment contracts

The configuration module accepts only the variables in `.env.example`. Do not commit values, credentials, customer data, production copy, or provider-specific public identifiers.

| Variable group | Scope | Local/preview/integration/staging | Production requirement |
| --- | --- | --- | --- |
| `EAL_DEPLOYMENT_ENV`, `EAL_APP_ORIGIN`, `EAL_LOG_LEVEL` | Server | Deployment identity and diagnostics | `EAL_APP_ORIGIN` is required |
| `EAL_CMS_ENDPOINT`, `EAL_CMS_TOKEN` | Server | Optional until a CMS adapter is selected | Required only by a connected CMS adapter |
| `EAL_COMMERCE_MUTATIONS_ENABLED`, `EAL_COMMERCE_PROVIDER_*` | Server | Disabled by default | Endpoint and token are required whenever mutations are enabled |
| `EAL_FEATURE_*` | Server | Opt-in by environment | Must be reviewed by the feature owner before release |

Feature flags are defined in `apps/web/src/server/config/feature-flags.ts`. The definitions record the default, owner, review date, and safe fallback. A flag never substitutes for data validation or legal approval.
