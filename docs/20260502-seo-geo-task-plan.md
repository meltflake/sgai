# SGAI SEO / GEO Programmatic Pages Plan

## Goal

Make sgai.md more crawlable, indexable, and LLM-citable by turning list/card data into stable detail pages, adding related links, localized metadata, structured data, and reusable generation checks.

## Phases

| Phase                         | Status   | Notes                                                                                                                          |
| ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1. Baseline discovery         | complete | Inspected existing routes, data models, i18n helpers, metadata components, SEO/GEO references, and video tooling.              |
| 2. Detail page architecture   | complete | Added entity-page slug helpers and transcript data pipeline.                                                                   |
| 3. Implement first full batch | complete | Added detail pages for voices, videos, benchmarking, levers/projects, and legal-ai cards; internal links now point to details. |
| 4. LLM/SEO crawl surface      | complete | Added robots LLM crawler allow rules plus `/llms.txt` and `/llms-full.txt`.                                                    |
| 5. Changelog and verification | complete | Updated changelog/version and passed formatting, checks, build, and EN i18n residue scan.                                      |

## Decisions

| Decision                                                                                        | Reason                                                                                                         |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Keep Chinese default at `/` and English under `/en/`.                                           | Existing Astro i18n architecture and SEO continuity.                                                           |
| Prefer generated static pages over client-only content.                                         | GEO and SEO references require full HTML for Googlebot/GPTBot.                                                 |
| Add detail pages from existing data first.                                                      | Fastest path to indexable URLs without inventing unsupported content.                                          |
| Keep `/people/[id]/` for compatibility but create `/voices/[id]/` as the SEO-facing person URL. | User framed the voices section as the canonical topical surface; old people URLs may still have inbound links. |
| Add transcript fetching as a reusable script instead of hand-editing video pages.               | YouTube transcript availability is uneven; future refreshes need a repeatable pipeline.                        |

## Errors Encountered

| Error                                                                                                         | Attempt                                                                        | Resolution                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `tsx -e` could not import `~/utils/permalinks` because it depends on Astro virtual module `astrowind:config`. | Tried using `cleanSlug` from a standalone tsx command.                         | Used `limax` directly in the standalone check and created `src/utils/entity-pages.ts` without Astro virtual-module dependencies. |
| `scripts/videos/fetch-transcripts.ts` template string parsed `${video.id}` inside generated code.             | First `npm run fetch:video-transcripts -- --limit=3` failed at transform time. | Rewrote generator to compute JSON separately and keep only intended interpolation in the output template.                        |
