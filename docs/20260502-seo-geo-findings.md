# SGAI SEO / GEO Findings

## 2026-05-02

- Existing stack is Astro static output with `trailingSlash: 'always'`, good for crawlable generated HTML.
- Existing i18n model is zh at root and English under `/en/`; translated pages must keep data parity and localized metadata/schema.
- Existing dynamic routes already include debates, people, and policies detail pages. Missing likely detail routes include videos, levers, legal-ai, benchmarking countries, and possibly voices-specific routing.
- GEO reference emphasizes original data, citable fact blocks, visible timestamps, schema, `llms.txt`, and crawler-friendly full HTML.
- Technical SEO reference emphasizes canonical URLs, hreflang, localized schema/meta, sitemap quality, internal links, and explicit LLM crawler access.
- `RelatedRail` currently links policy/debate/lever relations back to list pages instead of item detail pages, which weakens internal link depth.
- Chinese `/people/[id]/` links related debates and policies to list pages; English version already links item detail pages.
- `/voices/` renders people as cards without links to person detail pages. Existing detail route is `/people/[id]/`, not `/voices/[id]/`.
- `/benchmarking/`, `/videos/`, `/levers/`, and `/legal-ai/` render rich list/accordion/card content but do not yet expose each record as its own route.
- `public/robots.txt` exists but only has a generic allow-all rule; no explicit LLM crawler allow list or sitemap pointer.
- `CommonMeta.astro` only emits `zh-CN` and `x-default` alternates; EN pages do not emit a proper `en` hreflang sibling.
- `yt-dlp` is installed at `/opt/homebrew/bin/yt-dlp`, so a reusable transcript fetch pipeline is possible without adding a Node dependency.
- Slug uniqueness check found no duplicates for generated lever/project slugs when using English names (`118` lever/project pages).
- Benchmarking has 10 summary regions but only 9 full `RegionDetail` records; Singapore currently needs a generated summary page until a full detail record is added.
- A first transcript test successfully fetched English captions for `v053`, `v054`, and `v001`.
