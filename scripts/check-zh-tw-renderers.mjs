#!/usr/bin/env node
// scripts/check-zh-tw-renderers.mjs
// ────────────────────────────────────────────────────────────────────────
// Static check: any file in src/data/ or src/utils/ that has an
// `if (lang === 'zh-tw')` branch MUST import `toTraditional` (from
// src/i18n/opencc) or use `pickLocalized` (which calls it internally).
//
// MOTIVATION
//   2026-05-26 incident: src/data/video-transcripts.ts had
//     `if (lang === 'zh-tw') return transcript.paragraphs;`
//   The comment above the function literally said "zh-tw runs zh
//   paragraphs through OpenCC s2twp at SSG build time" — but the
//   implementation forgot to call toTraditional(). Result: 5766
//   simplified-char residue hits across 59 /zh-tw/videos/ pages.
//
//   The dist-level i18n-check catches this, but only after a 5-min
//   build. This static check gives instant feedback during `npm run
//   check`, before the dev pushes.
//
// SCOPE
//   - src/data/   — all data getters returning zh content for zh-tw
//                   must convert (we checked: 0 false positives today)
//   - src/utils/  — same reasoning
//
//   NOT scanned: src/components/, src/pages/ — these have many
//   legitimate uses of `lang === 'zh-tw'` for routing logic or
//   data-i18n-allow-en attributes that aren't content returns.
//   pickLocalized/toTraditional discipline at the data layer is the
//   right level to enforce.
//
// EXIT CODES
//   0 — every src/data/ + src/utils/ file with a zh-tw branch also
//       imports toTraditional or uses pickLocalized
//   1 — at least one file violates the rule

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const REPO_ROOT = process.cwd();
const SCOPES = ['src/data', 'src/utils'];

function* walkTs(root) {
  if (!statSync(root, { throwIfNoEntry: false })) return;
  for (const entry of readdirSync(root)) {
    const full = join(root, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      yield* walkTs(full);
    } else if (/\.(ts|mts|mjs)$/.test(entry)) {
      yield full;
    }
  }
}

const ZH_TW_BRANCH = /lang\s*===\s*['"]zh-tw['"]/;
const HAS_CONVERSION = /toTraditional|pickLocalized/;

const violations = [];
let scanned = 0;

for (const scope of SCOPES) {
  for (const file of walkTs(join(REPO_ROOT, scope))) {
    scanned++;
    const content = readFileSync(file, 'utf-8');
    if (!ZH_TW_BRANCH.test(content)) continue;
    if (HAS_CONVERSION.test(content)) continue;
    violations.push(relative(REPO_ROOT, file));
  }
}

console.log(`[zh-tw-renderers] scanned ${scanned} files in ${SCOPES.join(', ')}`);

if (violations.length === 0) {
  console.log('[zh-tw-renderers] ✔ all zh-tw branches use toTraditional or pickLocalized');
  process.exit(0);
}

console.error(`[zh-tw-renderers] ✘ ${violations.length} file(s) have a 'lang === "zh-tw"' branch but neither import toTraditional nor use pickLocalized:`);
for (const v of violations) {
  console.error(`    ${v}`);
}
console.error('');
console.error('[zh-tw-renderers] Fix: zh-tw rendering must convert via toTraditional() (src/i18n/opencc) or pickLocalized() (src/i18n/index). Returning raw zh content from a zh-tw branch silently ships Simplified Chinese on /zh-tw/ pages.');
process.exit(1);
