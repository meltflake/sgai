# Progress: i18n Regression Guard

Date: 2026-05-24

## Log

- Started investigation of latest commit `2f2f916`.
- Read planning-with-files workflow and initialized task tracking files.
- Inspected `docs/i18n.md`, `package.json`, `scripts/i18n-check.mjs`, `scripts/lib/i18n-pair.ts`, and the speech detail route.
- Confirmed the reported speech page is English in Japanese because the route deliberately renders `paragraphsEn` for every non-zh locale.
- Updated speech rendering so ja/ko pages no longer use English transcript paragraphs as localized body when translations are missing.
- Reworked policy, ecosystem, lever, and timeline surfaces away from binary zh/en rendering branches where localized data already exists.
- Added `scripts/evals/localized-rendering/check.ts` to verify built ja/ko pages render existing localized fields and block English speech transcript leakage.
- Added `check:i18n:all`, `check:localized-rendering`, and upgraded `check:dist`; wired `check:dist` into GitHub Actions after build.
- Updated `docs/i18n.md`, `CHANGELOG.md`, and `src/version.ts`.
- Ran `npm run check`: passed, including Astro, ESLint, Prettier, graph, transcript, i18n completeness, and 102 library tests.
- Ran `npm run build`: passed; generated 5220 static pages and indexed 5221 pages.
- Ran `npm run check:dist`: passed for EN, ZH-TW, JA, KO, schema, and localized-rendering gates. Existing JA/KO English-sentence warnings remain informational backlog, not new hard failures.
- Probed the reported JA speech page in `dist/`: Japanese pending copy is present; the old English transcript samples are absent.
- Started follow-up hard-veto work: user wants missing translations to block commit and push, not merely appear as warnings.
- Confirmed current generic `i18n-pair --locales=en,ja,ko src/data/*.ts` passes, so the missing guard is schema coverage, not the basic sibling detector.
- Changed `i18n-pair` completeness semantics: required fields must exist; optional configured fields may be absent, but once present they require all configured locale siblings.
- Expanded `scripts/i18n-config.ts` to enforce En/Ja/Ko siblings for policies, ecosystem, levers, and voices user-visible fields.
- Filled the existing strict-schema gaps in policies, ecosystem, levers, and voices. Language-neutral names, acronyms, amounts, and labels now have explicit sibling fields instead of implicit fallback.
- Added `scripts/git-hooks/pre-commit` and `scripts/git-hooks/pre-push`, installed them via `git config core.hooksPath scripts/git-hooks`, and verified both hooks pass.
- Updated `check:i18n-completeness` to scan `src/data/*.ts`; it is in `npm run check`.
- Added a unit test for optional configured fields being gated once present.
- Ran `npm run check`: passed, including `check:i18n-completeness` and 103 library tests.
- Ran `npm run build`: passed; generated 5220 static pages and indexed 5221 pages.
- Ran `npm run check:dist`: passed. JA/KO English-sentence warnings remain informational backlog; localized-rendering hard gate passed.
- Tightened `i18n-pair` alignment to support `string[]` values and expanded the generic display-field list used across `src/data/*.ts`.
- Backfilled array sibling gaps for benchmarking bullets, fieldnotes tags/points, talent highlights/bullets, timeline tags, opensource AI Verify features, and debate MP focus areas.
- Reworked talent, benchmarking, fieldnotes, timeline, and opensource array rendering to use locale-aware data instead of zh/en branching where the localized arrays now exist.
- Ran `npm run check:i18n-completeness`: passed after array-field enforcement.
- Ran `npm run test:lib`: passed 105 tests.
- Ran direct `scripts/git-hooks/pre-commit` and `scripts/git-hooks/pre-push`: both passed the i18n completeness gate.
- Ran `npm run check`: passed after the hard-veto and array-field changes.
- Ran `npm run build`: passed; generated 5220 pages and indexed 5221 pages.
- First `npm run check:dist` caught simplified Chinese residue on `/zh-tw/opensource/` after adding new copy; fixed by routing those constants through OpenCC.
- Re-ran `npm run build` and `npm run check:dist`: both passed. JA/KO English-sentence warnings remain informational backlog, but foreign-script residue, schema, and localized-rendering gates are clean.
- Follow-up from user clarification: removed hard-coded locale lists from the i18n gates. `check:i18n-completeness` now uses `--locales=all`, derived from `src/i18n/index.ts`; `check:i18n:all` now scans every locale from `LOCALES`, including zh.
- Added shared locale discovery in `scripts/lib/i18n-locales.mjs`: zh is the source locale, zh-tw is a derived OpenCC locale, and every other current/future locale is treated as an authored sibling locale that must be complete.
- Tightened optional-field completeness: if any locale side of an optional configured field exists, the source field and every authored locale sibling are required.
- Ran `node scripts/i18n-check.mjs --all`; initial zh scan caught two legitimate Japanese quoted terms, then passed after adding explicit allow-list entries.
- Ran `npm run check`: passed, including the new `--locales=all` completeness gate and 110 library tests.
- Ran `npm run build`: passed; generated 5220 pages and indexed 5221 pages.
- Ran `npm run check:dist`: passed across EN, ZH, ZH-TW, JA, KO, schema, and localized-rendering.
- Ran direct `pre-commit` and `pre-push` hooks plus `git diff --check`: all passed; `core.hooksPath` is `scripts/git-hooks`.
- Follow-up from user clarification: English output has a stricter purity rule because Luca often drafts in Chinese first. Added `*En` purity checking to `i18n-pair`; authored English fields now fail on Chinese, Japanese, or Korean script.
- Expanded EN dist check from CJK-only to Chinese/Japanese/Korean scripts and added Korean language-toggle allow-listing.
- Fixed one authored `tldrEn` field that retained the Chinese team name phrase; transcript/source fields remain treated as verbatim source material.
- Ran `npm run eval:source-i18n`; it caught a newly introduced `lang === 'en'` ternary in the speech page. Replaced it with an explicit `Record<Lang, ...>` lookup.
- Added `eval:source-i18n` into `npm run check`, so local check now also blocks newly introduced binary zh/en template branches.
- Ran `npm run check`: passed, including `eval:source-i18n` and 114 library tests.
- Ran `npm run build`: passed; generated 5220 pages and indexed 5221 pages.
- Ran `npm run check:dist`: passed across EN, ZH, ZH-TW, JA, KO, schema, and localized-rendering. JA/KO English-sentence warnings remain an existing backlog, not a new-field completeness failure.
- Re-ran direct `pre-commit`, `pre-push`, and `git diff --check`: all passed.
