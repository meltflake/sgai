# Task Plan: Singapore AI Moat Article Update

Date: 2026-05-25

## Goal

Replace the existing `singapore-ai-strategy-the-real-moat` article with Luca's latest revised Chinese draft, remove author/NUS EMBA front matter from the article body, and provide localized versions for every authored locale supported by the site.

## Phases

- [complete] Inspect current article files, locale structure, and latest draft.
- [complete] Convert the revised Chinese draft into site-ready markdown.
- [complete] Translate and update authored locale copies.
- [complete] Update changelog/version metadata as required by the project.
- [complete] Run formatting, i18n, and build checks.

## Decisions

- Preserve the existing URL slug unless repository routing shows otherwise.
- Use existing project locale directories as the source of truth for "multi-language".
- Do not publish NUS EMBA / assignment / author metadata inside the public article body.

## Errors Encountered

| Error                                                                    | Attempt                                                                    | Resolution                                                                                            |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| zsh treated Astro route filenames with square brackets as glob patterns. | Read `[lang]` and `[...blog]` files without quoting.                       | Re-ran the reads with quoted paths.                                                                   |
| `npm run build` failed with `Missing parameter: tag`.                    | Added Korean blog tags; Hangul-only tag titles slugified to empty strings. | Filter empty tag slugs in localized tag routes and render empty-slug tags/categories as plain labels. |
