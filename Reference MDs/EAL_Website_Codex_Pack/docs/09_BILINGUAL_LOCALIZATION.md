# 09 — Bilingual and Localization Architecture

## Supported languages

Initial requirement:

- English.
- Simplified Chinese.

Recommended locale identifiers:

- `en`
- `zh-Hans`

Market should be separate from language.

Example:

- English in Australia: `locale=en`, `market=AU`.
- Chinese in Australia: `locale=zh-Hans`, `market=AU`.
- Simplified Chinese in mainland China: `locale=zh-Hans`, `market=CN`.

This prevents translation choice from incorrectly changing price, range standard or retailer availability.

## Routing

Recommended:

```text
/{locale}/{market}/...
```

Alternative acceptable pattern:

```text
/{market}/{locale}/...
```

Choose once and keep canonical/hreflang consistent.

## Translation architecture

Use key-based translations for UI and CMS localization for editorial content.

### UI keys

Examples:

```json
{
  "nav.vehicles": "Vehicles",
  "vehicle.configure": "Configure {model}",
  "commerce.startingFrom": "Starting from",
  "booking.testDrive": "Book a Test Drive"
}
```

Chinese values live in a separate locale resource.

### CMS localized fields

Use localized objects for:

- headline.
- deck/summary.
- body content.
- alt text.
- captions.
- SEO title/description.
- legal footnotes.

## Translation rules

- Model codes remain unchanged.
- Technical feature names can have approved Chinese equivalents but should keep trademarked English where required.
- Legal and finance content must be professionally translated and approved.
- Do not auto-translate pricing disclaimers at runtime.
- Do not use English letter-spacing rules on Chinese.

## Typography behavior

### English

- Large uppercase display text allowed.
- Wide tracking allowed.

### Chinese

- Avoid artificial all-caps analogues.
- Reduce tracking.
- Increase line-height slightly for dense copy.
- Give hero headings wider containers because phrase lengths differ.

## Date/number/currency

Use `Intl` APIs.

Examples:

- Currency format based on market.
- Thousand separators based on locale.
- Distance units based on market policy.
- Date format localized.

Never concatenate numeric strings manually.

## Range standards

Display the relevant homologation standard:

- WLTP.
- CLTC.
- EPA or others if introduced.

The standard is a data attribute, not a translation.

## SEO localization

Each translated page requires:

- localized `<title>`.
- localized meta description.
- canonical URL.
- hreflang links.
- localized Open Graph metadata.
- localized structured data strings where appropriate.

## Locale switcher UX

Reference header uses `EN | 中文`.

Behavior:

- Preserve current route and model context.
- Preserve build state when safe.
- Preserve market unless user explicitly changes it.
- If a translation is unavailable, explain fallback.

## Search

Search index must support both languages.

Chinese search requirements:

- CJK-aware tokenization.
- synonyms for model/feature names.
- common English feature aliases.

## Forms

- Field labels translated.
- Error messages translated.
- Consent text translated and versioned.
- Address format varies by market.
- Name field structure must not assume Western ordering in all markets.

## Content workflow

Recommended status per locale:

- Draft.
- Translation requested.
- In translation.
- Review.
- Legal review where needed.
- Approved.
- Published.

Do not publish an English update that creates materially inconsistent purchase terms in Chinese.
