# Findings

## 2026-05-04

- Benchmarking improvement: existing `/benchmarking/[region]/` already generates country/region profiles from `regionPages`; `/benchmarking/` still uses a comparison table, inert insight cards, and expandable `<details>` region blocks.
- The best fit for Luca's request is to preserve region profiles while adding concrete benchmark cases: specific companies, funds, institutions, models, and public projects drawn from the existing region data.
- `src/data/benchmarking.ts` has bilingual fields throughout, so new case fields must include `*En` siblings for all user-visible Chinese text.
- `llms.txt` and `llms-full.txt` currently count only region benchmark pages; benchmark case pages should be added so crawler entry points point to the new concrete landing pages.
- Follow-up request: region pages such as `/benchmarking/hong-kong/` still have inert cards/rows. The reusable fix is to generate drilldown pages from `RegionSummary` and `RegionDetail`, then link top summary cards, strategy cards, investment items, initiatives, and key bodies.

- Starting point: task is to improve `/opensource/` so cards become clickable entries to concrete company/project landing pages.
- Existing unrelated working tree item: `scripts/refresh/videos/data/` is untracked and will not be changed.
- `src/data/opensource.ts` currently stores project cards with `name / description / stars / language / url`; no stable local `id` or long-form fields.
- `src/pages/opensource/index.astro` and `src/pages/en/opensource/index.astro` render project cards as inert cards with nested external GitHub links.
- Existing entity pages such as `src/pages/ecosystem/[id].astro` use `GetStaticPaths`, local data-driven records, quick facts, prose sections, sources, and bottom navigation.
- GBrain search for this open-source/project cluster returned no internal notes.
- Official source checks used for fresh facts: AI Verify GitHub/Foundation, AISG SEA-LION GitHub/Hugging Face, SEA-Guard Hugging Face, TagUI/PeekingDuck/SGNLP/Synergos GitHub, and AISG Speech Lab.
- The open-source data model now needs to serve both list cards and project landing pages, so each record needs stable `id`, localized details, metrics, milestones, and resources.
