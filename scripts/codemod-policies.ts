// Phase 1.8 codemod: inject `id` (kebab from titleEn) + empty cross-ref
// arrays into every Policy record in src/data/policies.ts.
//
// Idempotent: skips if file already contains "id:".
//
// Usage: npx tsx scripts/codemod-policies.ts

import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'src/data/policies.ts';
let src = readFileSync(SRC, 'utf-8');

if (src.includes('\n        id:') || src.includes('\n      id:')) {
  console.log('codemod-policies: file already has id field — exiting (idempotent).');
  process.exit(0);
}

function toKebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Match each record: opening "      {" plus a "title:" line followed by
// "titleEn:". We need the titleEn value to derive the id.
//
// The Policy records are nested 6 spaces deep (inside categories.policies array).
const RECORD_RE = /(\n {6}\{\n {8}title:[^\n]*\n {8}titleEn:\s*['"`]([^'"`]+)['"`],)/g;

const seenIds = new Set<string>();
let count = 0;

src = src.replace(RECORD_RE, (_full, prefix, titleEn) => {
  let id = toKebab(titleEn);
  let suffix = 2;
  while (seenIds.has(id)) {
    id = `${toKebab(titleEn)}-${suffix++}`;
  }
  seenIds.add(id);
  count++;

  // Inject `id: '...'` immediately after "{" (before the title line).
  // We rebuild the prefix: find the position of "title:" within prefix and insert id before it.
  const idx = prefix.indexOf('title:');
  const before = prefix.slice(0, idx);
  const after = prefix.slice(idx);
  return `${before}id: '${id}',\n        ${after}`;
});

// Append empty cross-ref arrays at the end of every record. Match the
// closing "      }," at the right indent. We insert the new fields just
// before that brace.
//
// To keep idempotent + not collide with existing closing braces of
// non-Policy objects, we constrain to records that contain "content: `"
// (every Policy has it).
const POLICY_END_RE = /(content:\s*`(?:[^`\\]|\\.)*`,)\n( {6}\}(?:,|\n))/g;

src = src.replace(POLICY_END_RE, (_full, contentLine, closing) => {
  return `${contentLine}\n        ministry: undefined,\n        authorPersonIds: [],\n        relatedDebateIds: [],\n        relatedLeverNumbers: [],\n        relatedTimelineYears: [],\n        relatedPostSlugs: [],\n${closing}`;
});

writeFileSync(SRC, src);
console.log(`codemod-policies: injected id + cross-ref fields into ${count} records.`);
