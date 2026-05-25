# Findings: Singapore AI Moat Article Update

Date: 2026-05-25

## Notes

- Previous planning files were for the 2026-05-24 i18n regression task.
- Current working tree already has uncommitted changes touching this article, `CHANGELOG.md`, and `src/version.ts`; inspect before editing so those changes are preserved or intentionally replaced as part of this request.
- The existing article slug is shared by three markdown files: zh source, `en/`, and `ja/`.
- Blog content schema and `src/utils/blog.ts` recognized post languages as `zh | en | ja`; `zh-tw` is generated from zh elsewhere. To publish a real Korean article, the post content layer needs `ko` added explicitly.
- Luca's revised draft begins with NUS/course/author/date metadata before the public article body. The public replacement should start from the abstract/frontmatter, not that assignment header.
