// scripts/check-post-i18n.mjs
// ────────────────────────────────────────────────────────────────────────
// Five-language hard gate for longform blog posts. Every zh source post at
// src/data/post/<slug>.md must have en / ja / ko / zh-tw sibling files at
// src/data/post/<lang>/<slug>.md.
//
// Longform posts are the one content type where zh-tw IS a stored file (not
// OpenCC-derived at render time) — src/utils/blog.ts loads posts by physical
// file via glob, so a missing src/data/post/zh-tw/<slug>.md means no
// /zh-tw/<slug>/ route at all. Hence zh-tw is in the required set here.
//
// zh-tw files are deterministic OpenCC conversions (scripts/hansard/
// derive-zh-tw-posts.ts), ja/ko are real translations
// (scripts/refresh/post-translations/translate-post.ts).

import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const POST_ROOT = resolve('src/data/post');
const REQUIRED_LANGS = ['en', 'ja', 'ko', 'zh-tw'];

function slugsIn(dir) {
  try {
    return new Set(readdirSync(dir).filter((f) => f.endsWith('.md')));
  } catch {
    return new Set();
  }
}

const zhSlugs = slugsIn(POST_ROOT);
const byLang = Object.fromEntries(REQUIRED_LANGS.map((l) => [l, slugsIn(resolve(POST_ROOT, l))]));

const errors = [];
for (const slug of [...zhSlugs].sort()) {
  for (const lang of REQUIRED_LANGS) {
    if (!byLang[lang].has(slug)) errors.push(`${slug}: missing ${lang} translation (src/data/post/${lang}/${slug})`);
  }
}

if (errors.length > 0) {
  console.error(`[check-post-i18n] ${errors.length} issue(s):`);
  for (const e of errors) console.error(`- ${e}`);
  console.error(
    '\nfix: ja/ko → `npx tsx scripts/refresh/post-translations/translate-post.ts --src=src/data/post/<slug>.md --target=<ja|ko>`; ' +
      'zh-tw → `npx tsx scripts/hansard/derive-zh-tw-posts.ts <slug>`',
  );
  process.exit(1);
}

console.log(`[check-post-i18n] OK — ${zhSlugs.size} posts have en/ja/ko/zh-tw parity.`);
