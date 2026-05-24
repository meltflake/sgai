# Task Plan: i18n Regression Guard

Date: 2026-05-24

## Goal

Find the root cause of non-English localized pages rendering English content, then add development and programmatic safeguards so this class of regression is caught before deployment.

## Phases

- [complete] Inspect latest commit and i18n architecture.
- [complete] Identify affected content/data paths and current checks that missed them.
- [complete] Implement code or CI-level guardrails with project documentation.
- [complete] Run verification and record results.
- [complete] Upgrade i18n completeness to a hard commit/push veto for configured user-visible fields.
- [complete] Remove hard-coded locale lists so zh, zh-tw, and future languages are covered automatically.
- [complete] Add English purity gate for Chinese/Japanese/Korean residue in authored `*En` fields.
- [complete] Add source-template hardcode scan to local `npm run check`.

## Errors Encountered

| Error                                                                                             | Attempt                                                    | Resolution                                                                                   |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `tsx -e` import of `i18n-pair.ts` failed because the module has top-level await in its CLI guard. | Tried to simulate a stricter schema inline before editing. | Use the CLI and patch the module directly; avoid relying on `tsx -e` imports for this probe. |
| Astro parsed `pickLocalized<string[]>` inside JSX as a tag.                                       | Added typed array lookup directly in templates.            | Move typed lookups to frontmatter helpers or cast results before JSX rendering.              |
