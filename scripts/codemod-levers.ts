// Phase 1.9 codemod: inject `id` (kebab from name) into every LeverItem
// in src/data/levers.ts.
//
// We intentionally do NOT inject empty cross-ref arrays at item level
// because the file already has 1064 lines; adding 4 fields × ~40 items
// bloats the diff for limited Phase 1 value. Hand-fill at use site as
// cross-references are discovered. The interface allows undefined.
//
// Idempotent: skips when id already present.
//
// Usage: npx tsx scripts/codemod-levers.ts

import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'src/data/levers.ts';
let src = readFileSync(SRC, 'utf-8');

if (src.includes('\n            id:') || src.includes('\n          id:')) {
  console.log('codemod-levers: file already has id at item indent — exiting.');
  process.exit(0);
}

function toKebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s一-鿿-]/g, '') // keep CJK
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// LeverItem records sit at 12-space indent (inside groups[].items).
// Match opening `          { \n            name: '...'`.
const ITEM_RE = /(\n {10}\{\n {12}name:\s*['"`]([^'"`]+)['"`],)/g;

const seenIds = new Set<string>();
let count = 0;

src = src.replace(ITEM_RE, (_full, prefix, nameValue) => {
  let id = toKebab(nameValue);
  let suffix = 2;
  while (seenIds.has(id)) {
    id = `${toKebab(nameValue)}-${suffix++}`;
  }
  seenIds.add(id);
  count++;
  // Inject id before name.
  const idx = prefix.indexOf('name:');
  return `${prefix.slice(0, idx)}id: '${id}',\n            ${prefix.slice(idx)}`;
});

writeFileSync(SRC, src);
console.log(`codemod-levers: injected id into ${count} LeverItem records.`);
