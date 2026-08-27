// scripts/evals/addedAt-coverage/__tests__/data-files-sync.test.ts
// ────────────────────────────────────────────────────────────────────────
// The addedAt-coverage eval's DATA_FILES list and the harvesters in
// src/utils/derived-updates.ts are two hand-maintained descriptions of the
// same fact: "these data files carry addedAt and feed the updates feed".
// They drifted once (ai-capital.ts had addedAt from 2026-08-14 but no
// harvester, so its records never reached the homepage). This test pins
// them together: every `~/data/<file>` the harvester module imports must be
// in DATA_FILES, and vice versa.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { DATA_FILES } from '../check.ts';

const REPO_ROOT = resolve(import.meta.dirname, '../../../..');

// Data modules derived-updates.ts imports for reasons other than
// harvesting addedAt records (helpers / types only).
const NON_HARVEST_IMPORTS = new Set(['src/data/speech-transcripts.ts', 'src/data/updates.ts']);

function harvesterDataImports(): string[] {
  const src = readFileSync(resolve(REPO_ROOT, 'src/utils/derived-updates.ts'), 'utf8');
  const out = new Set<string>();
  for (const m of src.matchAll(/from '~\/data\/([a-z0-9-]+)'/g)) {
    const file = `src/data/${m[1]}.ts`;
    if (!NON_HARVEST_IMPORTS.has(file)) out.add(file);
  }
  return [...out].sort();
}

test('addedAt-coverage DATA_FILES mirrors the data files derived-updates.ts harvests', () => {
  const fromEval = [...DATA_FILES].sort();
  const fromHarvester = harvesterDataImports();
  assert.deepEqual(
    fromEval,
    fromHarvester,
    'DATA_FILES (scripts/evals/addedAt-coverage/check.ts) and the ~/data imports of src/utils/derived-updates.ts must list the same files'
  );
});
