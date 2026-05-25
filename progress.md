# Progress: Singapore AI Moat Article Update

Date: 2026-05-25

## Log

- Started article replacement task.
- Ran planning session catchup; previous context was unrelated language switcher/i18n work.
- Recorded current task plan before inspecting files.
- Inspected the latest draft, current zh/en/ja article files, i18n locale definitions, blog content schema, and current uncommitted diff.
- Added Korean blog-post support in the content schema, post language detection, `Post` type, and next/previous post filter.
- Replaced the Chinese article with the revised full draft, starting from the public abstract and omitting the course/author submission header.
- Replaced the English and Japanese article files with full translations of the revised draft.
- Added a new Korean article file for the same slug.
- Updated changelog, site version, and manual updates feed for the longform rewrite.
- Checked the public article files for NUS/course submission metadata and checked the English article for CJK residue; no matches.
- Ran targeted Prettier formatting for touched files.
- Ran `npm run check`: passed, including Astro, ESLint, Prettier, graph, i18n completeness, source-i18n, and 114 library tests.
- First `npm run build` failed because Hangul-only blog tags slugified to empty strings and the tag route tried to emit a route with no `tag` param.
- Added guards so empty tag/category slugs render as plain labels and tag index pages skip empty slugs.
- Re-ran targeted Prettier and `npm run check`: passed again after the empty-slug guard.
- Re-ran `npm run build`: passed, built 5229 pages and indexed 5230 pages; existing YouTube thumbnail revalidation warnings used stale cache and did not fail the build.
- Ran `npm run check:dist`: passed EN/ZH/ZH-TW/JA/KO i18n residue checks, schema checks, and localized-rendering checks. Existing JA/KO English-sentence warnings remain informational backlog.
- Verified generated article routes exist for zh, en, ja, and ko.
