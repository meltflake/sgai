// scripts/refresh/voices/parallel-warm.ts
// ────────────────────────────────────────────────────────────────────────
// Parallel cache warmer for backfill. Fetch + translate (writes the sha256
// translation cache) for ONE group of speeches, WITHOUT emit. Run several
// of these concurrently (one per slug group) to warm the cache ~Nx faster;
// then a single SERIAL emit pass (run.ts --ids) is all cache-hits and quick.
//
// Why split warm (parallel) from emit (serial): translate writes per-speech
// cache files (safe to run concurrently across distinct slugs), but emit
// appends to the shared voices.ts / speech-transcripts.ts (NOT concurrency
// safe). So we parallelize the expensive part and serialize only the write.
//
// Usage: npx tsx scripts/refresh/voices/parallel-warm.ts <group-file>
//   where <group-file> is a newline-separated list of speech slugs.

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

import { fetchSpeeches } from './fetch.ts';
import { translateSpeeches } from './translate.ts';

const file = process.argv[2];
if (!file) {
  process.stderr.write('usage: parallel-warm.ts <group-file>\n');
  process.exit(2);
}
const tag = basename(file);
const slugs = readFileSync(file, 'utf8')
  .trim()
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);

let done = 0;
let failed = 0;
for (const slug of slugs) {
  try {
    const fr = await fetchSpeeches([
      { speechId: slug, sourceUrl: `https://www.mddi.gov.sg/newsroom/${slug}/` },
    ]);
    if (!fr.successes.length) {
      failed += 1;
      process.stdout.write(`[${tag}] fetch-fail ${slug}\n`);
      continue;
    }
    await translateSpeeches(fr.successes); // writes zh/ja/ko + tldr cache
    done += 1;
    process.stdout.write(`[${tag}] warmed ${done}/${slugs.length}\n`);
  } catch (e) {
    failed += 1;
    process.stdout.write(`[${tag}] warn ${slug}: ${e instanceof Error ? e.message : String(e)}\n`);
  }
}
process.stdout.write(`[${tag}] DONE warmed=${done} failed=${failed} of ${slugs.length}\n`);
