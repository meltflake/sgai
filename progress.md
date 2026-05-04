# Progress

## 2026-05-04

- Renamed the Chinese blog column label from `观点` to `观察` across `/blog/`, zh navigation/home labels, article return button, and existing zh post category/tag frontmatter.

- Started improving `/benchmarking/` into a card-first benchmark case index.
- Confirmed the repo already has country/region detail routes; current work will add concrete company/project/institution case routes without removing region pages.
- Added `benchmarkCases` data records and `benchmarkCasePages` / `benchmarkPages` route helpers.
- Rebuilt zh/en benchmarking index pages and shared dynamic benchmark route to handle both region profiles and concrete case profiles.
- Updated `llms.txt`, `llms-full.txt`, and `CHANGELOG.md` for the new benchmark case pages.
- Ran `npm run check` successfully.
- Ran `npm run build && npm run check:i18n` successfully; EN pages scanned with 0 Chinese residue findings.
- Local smoke checks on existing dev server `http://127.0.0.1:4322/` returned 200 for `/benchmarking/`, `/benchmarking/falcon-llm/`, `/en/benchmarking/mgx-ai-fund/`, and `/benchmarking/singapore/`.
- Started follow-up to make region pages such as `/benchmarking/hong-kong/` drill down from every card/row.
- Added generated benchmark region drilldown pages for overview cards, strategy records, investment items, key initiatives, and key bodies.
- Updated zh/en benchmark region pages so cards, investment resource rows, initiatives, and key bodies link to generated drilldown pages.
- Added benchmark region drilldown pages to `llms.txt` / `llms-full.txt` and updated `CHANGELOG.md`.
- Ran `npm run check` successfully for the region drilldown update.
- Ran `npm run build && npm run check:i18n` successfully; EN pages scanned with 0 Chinese residue findings.
- Local smoke checks on existing dev server `http://127.0.0.1:4322/` returned 200 for `/benchmarking/hong-kong/`, two Chinese Hong Kong drilldown pages, and one English Hong Kong drilldown page; Hong Kong page exposes 23 same-region drilldown links.

- Started inspecting the sgai open source page improvement.
- Created planning files and inspected existing open-source data/list pages plus ecosystem detail-page patterns.
- Expanded `src/data/opensource.ts` from simple cards into data-rich project records for AI Verify, SEA-LION, SEA-Guard, TagUI, PeekingDuck, SGNLP, Speech Lab, and Synergos.
- Updated zh/en `/opensource/` project grids so each project card links to a local profile page.
- Added shared `OpenSourceProjectDetail` component and zh/en dynamic routes for project pages.
- Ran `npm run check` successfully.
- Ran `npm run build && npm run check:i18n` successfully.
- Started dev server at `http://127.0.0.1:4322/` and verified `/opensource/`, `/opensource/ai-verify/`, and `/en/opensource/sea-lion/` return HTTP 200.
