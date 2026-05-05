// scripts/i18n-migrate-consumers.mjs
// Safe-pass: only do zh-prefix → bare renames + summaryShortEn → summaryEn.
// File-specific cases (where `.title` or `.summary` previously aliased to
// English content) are hand-edited because the right replacement depends on
// whether the consumer wants the EN value (→ `.titleEn`) or fallback logic.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const EDITS = [
  { pattern: /\.zhTitle\b/g, replacement: '.title' },
  { pattern: /\.zhSummary\b/g, replacement: '.summary' },
  { pattern: /\.zhName\b/g, replacement: '.name' },
  { pattern: /\.zhEvent\b/g, replacement: '.event' },
  { pattern: /\.summaryShortEn\b/g, replacement: '.summaryEn' },
  { pattern: /'zhTitle'/g, replacement: "'title'" },
  { pattern: /'zhName'/g, replacement: "'name'" },
  { pattern: /'zhSummary'/g, replacement: "'summary'" },
  { pattern: /'zhEvent'/g, replacement: "'event'" },
  { pattern: /'summaryShortEn'/g, replacement: "'summaryEn'" },
];

const consumers = [
  'src/pages/debates/[id].astro',
  'src/pages/levers/[id].astro',
  'src/pages/ecosystem/[id].astro',
  'src/pages/llms-full.txt.ts',
  'src/pages/voices/index.astro',
  'src/pages/en/debates/[id].astro',
  'src/pages/en/voices/index.astro',
  'src/pages/voices/[id].astro',
  'src/pages/speeches/[id].astro',
  'src/pages/en/levers/[id].astro',
  'src/pages/en/voices/[id].astro',
  'src/components/home/HomePage.astro',
  'src/components/longform/AuthorBio.astro',
  'src/components/data/RelatedRail.astro',
  'src/components/debates/DebatesIndex.astro',
  'src/components/data/PolicyProfile.astro',
  'src/utils/people.ts',
];

for (const file of consumers) {
  const abs = resolve(process.cwd(), file);
  let src;
  try {
    src = readFileSync(abs, 'utf8');
  } catch {
    console.log(`[skip] ${file}`);
    continue;
  }
  let out = src;
  for (const e of EDITS) out = out.replace(e.pattern, e.replacement);
  if (out === src) {
    console.log(`[unchanged] ${file}`);
    continue;
  }
  writeFileSync(abs, out);
  console.log(`[edit] ${file}`);
}

console.log('Done.');
