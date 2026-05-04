# Findings

## 2026-05-04

- Starting point: task is to improve `/opensource/` so cards become clickable entries to concrete company/project landing pages.
- Existing unrelated working tree item: `scripts/refresh/videos/data/` is untracked and will not be changed.
- `src/data/opensource.ts` currently stores project cards with `name / description / stars / language / url`; no stable local `id` or long-form fields.
- `src/pages/opensource/index.astro` and `src/pages/en/opensource/index.astro` render project cards as inert cards with nested external GitHub links.
- Existing entity pages such as `src/pages/ecosystem/[id].astro` use `GetStaticPaths`, local data-driven records, quick facts, prose sections, sources, and bottom navigation.
- GBrain search for this open-source/project cluster returned no internal notes.
- Official source checks used for fresh facts: AI Verify GitHub/Foundation, AISG SEA-LION GitHub/Hugging Face, SEA-Guard Hugging Face, TagUI/PeekingDuck/SGNLP/Synergos GitHub, and AISG Speech Lab.
- The open-source data model now needs to serve both list cards and project landing pages, so each record needs stable `id`, localized details, metrics, milestones, and resources.
