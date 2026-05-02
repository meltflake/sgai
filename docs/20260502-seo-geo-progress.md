# SGAI SEO / GEO Progress

## 2026-05-02

- Read project instructions, SEO/GEO reference documents, package scripts, Astro config, layout metadata entrypoint, and file tree.
- Confirmed only untracked pre-existing file is `AGENTS.md`; avoid touching it.
- Created working plan files for this SEO implementation pass.
- Read existing detail pages for debates, people, policies, and their English mirrors.
- Read list pages and data models for benchmarking, videos, levers, legal-ai, and voices.
- Confirmed `yt-dlp` is available for transcript fetching.
- Added `src/utils/entity-pages.ts` for stable slugs and flattened detail-page data.
- Added `/voices/[id]`, `/videos/[id]`, `/benchmarking/[region]`, `/levers/[id]`, and `/legal-ai/[id]` plus English mirrors.
- Updated RelatedRail and major list/detail links to point to item pages instead of list pages.
- Added `scripts/videos/fetch-transcripts.ts`, `npm run fetch:video-transcripts`, and transcript data plumbing.
- Added explicit LLM crawler rules in `public/robots.txt` and generated `/llms.txt` + `/llms-full.txt`.
- Ran `npm run fetch:video-transcripts`; fetched 51 transcripts out of 54 videos, with unavailable transcripts recorded by omission in `src/data/video-transcripts.ts`.
- Ran `npm run fix:prettier`, `npm run check`, `npm run build`, and `npm run check:i18n`; all passed. Latest build generated 1697 pages and Pagefind indexed 1725 pages; EN i18n scan covered 864 pages with 0 residue findings.
- Added `docs/20260502-programmatic-seo-geo.md` to document reusable programmatic SEO/GEO page rules, i18n parity requirements, transcript refresh workflow, and acceptance checks.
