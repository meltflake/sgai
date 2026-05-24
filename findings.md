# Findings: i18n Regression Guard

Date: 2026-05-24

## Initial Context

- Latest commit: `2f2f916 Update Singapore AI policy data`.
- User-reported example: `/ja/speeches/mddi-s-response-to-pq-on-review-of-personal-data-protection-act-2012-to-address-use-of-inferred-or-derived-data-generated-by-ai/` renders English in the Japanese version.
- The commit touched data-heavy files: `ecosystem.ts`, `levers.ts`, `policies.ts`, `timeline.ts`, `tracker.ts`, plus multilingual copies of one article.

## Working Hypothesis

- Existing i18n checks likely focus on Chinese residue in English pages, not language purity or fallback misuse across all non-default locales.

## Root-Cause Signals

- `src/pages/[lang]/speeches/[id].astro` computes `tldr = isCjk ? tldrZh : tldrEn`; `isCjk` is only `zh | zh-tw`, so `ja` and `ko` always use `tldrEn`.
- The same speech page renders `paragraphsEn` for every non-zh locale. That makes `/ja/speeches/...` structurally an English transcript page.
- The English transcript block is marked with `data-i18n-allow-en="speech-verbatim-source"`, so the dist-level scanner removes it before checking visible text.
- `SpeechTranscript` currently only has `paragraphs` and `paragraphsEn`; it has no `paragraphsJa`, `paragraphsKo`, `tldrJa`, or `tldrKo` contract.
- `npm run check:i18n-completeness` only checks `src/data/ecosystem.ts`; it does not gate `voices.ts`, `speech-transcripts.ts`, `policies.ts`, `levers.ts`, or `tracker.ts`.
- `scripts/i18n-check.mjs` records EN-on-JA/KO sentence warnings as non-fatal, and `npm run check:dist` only runs `check:i18n` without explicitly scanning all locales.

## Root Cause

This was not a single missing translation. It was a contract mismatch:

- Data had grown from zh/en/ja into five locales, but several page templates still used two-locale rendering assumptions.
- Fallback was treated as display logic instead of an explicit "translation missing" state.
- Dist checks looked for foreign-script residue, but did not verify that existing localized fields were actually rendered on the corresponding locale route.

## Guardrail Direction

- Page rendering must use `pickLocalized(record, field, lang)` or `Record<Lang, string>` dictionaries.
- Long-form body content cannot fall back to English on ja/ko pages; missing translations must render a localized pending state.
- CI should check built pages, not only source field pairs, because the regression happened in templates after the data layer was already correct.

## Follow-up Hard Veto

- User requirement: missing translations must be a hard veto, blocking commit and push.
- Existing `findIncompleteRecords` only enforced fields with `required: true`; optional visible fields were ignored even when present.
- `check:i18n-completeness` only scanned `src/data/ecosystem.ts`; it did not cover policies, levers, voices, or other data files.
- Git hooks were not configured, so local commit/push did not automatically run the i18n completeness gate.
- `findUnpairedFields` treated arrays as non-string values, so `highlights`, `bullets`, `tags`, and `points` could miss Ja/Ko siblings without failing.
- Several array renderers still used `isZh ? zh : en`, especially talent and benchmarking pages, so adding Ja/Ko arrays would not help unless templates also switched to locale-aware lookup.
- A second guardrail gap was the hard-coded locale list: `check:i18n-completeness` used `en,ja,ko`, and `check:i18n:all` manually listed locales. That would miss future languages and did not make the zh / zh-tw contract explicit.
- The corrected contract is now: zh is the source side and must be complete as bare fields; zh-tw is a required OpenCC-derived locale and is checked at the dist layer; every other locale in `LOCALES` is an authored sibling locale and is required by source-level gates.
- English needed its own purity rule, not merely "not missing". Because Luca often drafts in Chinese first and then asks for English, `*En` fields can be present but still contaminated by source-language fragments. The gate now rejects Chinese, Japanese, and Korean script in authored English fields, while keeping verbatim transcript/source fields as explicit exceptions.
- Source templates need the same local hard veto as data files. Layer E already detects newly introduced `isZh ? ... : ...` / `lang === 'zh' ? ... : ...` branches against a shrinking baseline, but it was only wired in CI. It now runs as part of local `npm run check`, which caught and prevented a new speech-page `lang === 'en'` ternary during this work.
