// scripts/lib/prettier-format.ts
// ────────────────────────────────────────────────────────────────────────
// Best-effort `prettier --write` on a single file, mirroring the call in
// scripts/refresh/videos/emit.ts.
//
// Refresh pipelines splice hand-formatted TS literals into data files. Those
// insertions are not prettier-clean (indent / quote / wrap conventions
// differ), so without this step the resulting PR fails `npm run check:prettier`
// (`prettier --check .`) — which is what got hand-fixed on #60 / #61.
//
// Any pipeline that writes a data file must call this before committing.

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * Run `prettier --write <filePath>`. Never throws: a formatting failure must
 * not abort an otherwise-successful emit. On failure the file is still valid
 * TS — the worst case is the existing pre-commit prettier gate flags it,
 * exactly as before this helper existed. Returns true on success.
 */
export function formatWithPrettier(filePath: string): boolean {
  const r = spawnSync('npx', ['prettier', '--write', filePath], {
    encoding: 'utf8',
    cwd: ROOT,
  });
  if (r.status !== 0) {
    process.stderr.write(
      `  ⚠ prettier --write ${filePath} exited ${r.status}: ${(r.stderr || '').slice(0, 200)}\n`
    );
    return false;
  }
  return true;
}
