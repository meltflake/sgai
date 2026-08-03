// scripts/refresh/voices/seed-date-floor.ts
// ────────────────────────────────────────────────────────────────────────
// One-time backlog drain for new voices sources whose sitemap carries no
// usable publication-date signal (PMO: ~575 speech pages back to 2012,
// every <lastmod> bulk-touched 2026-07-30).
//
// Without this, each weekly run would spend its --limit slots fetching
// arbitrary historical pages just to reject them at the date floor —
// months of stalled intake. This script walks ALL pending candidates of
// the selected source, fetches each page for its date ONLY (no LLM, no
// translation), and writes pre-floor rejects into rejected-ids.json.
// Post-floor pages are left untouched for the normal weekly runs.
//
// Usage:
//   npx tsx scripts/refresh/voices/seed-date-floor.ts --source=pmo [--limit=N] [--dry-run]
//
// Commit the updated rejected-ids.json afterwards so cron inherits it.

import { loadState } from '../../lib/state.ts';
import { scan, readExistingSpeechUrls, readExistingSpeechIds } from './scan.ts';
import { fetchSpeeches } from './fetch.ts';
import { loadRejectedIds, saveRejectedIds } from './rejected-cache.ts';

const DATE_FLOOR = '2026-01-01';

function parseFlags(): { source: string; limit: number; dryRun: boolean } {
  const argv = process.argv.slice(2);
  const sourceArg = argv.find((a) => a.startsWith('--source='));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  return {
    source: sourceArg ? sourceArg.split('=')[1].toLowerCase() : 'pmo',
    limit: limitArg ? Number(limitArg.split('=')[1]) : Infinity,
    dryRun: argv.includes('--dry-run'),
  };
}

async function main(): Promise<void> {
  const flags = parseFlags();
  process.stdout.write(`\n[voices-seed] date-floor seed for source=${flags.source}\n`);

  const scanResult = await scan({
    state: loadState(),
    existingUrls: readExistingSpeechUrls(),
    existingSpeechIds: readExistingSpeechIds(),
  });
  const pending = scanResult.candidates.filter((c) =>
    c.domain.toLowerCase().startsWith(flags.source)
  );
  process.stdout.write(`  pending candidates for ${flags.source}: ${pending.length}\n`);

  const batch = pending.slice(0, flags.limit === Infinity ? pending.length : flags.limit);
  if (flags.dryRun) {
    for (const c of batch.slice(0, 20)) process.stdout.write(`    ${c.sourceUrl}\n`);
    process.stdout.write(`[voices-seed] dry-run: would fetch ${batch.length} pages.\n`);
    return;
  }

  const rejected = loadRejectedIds();
  const today = new Date().toISOString().slice(0, 10);
  let preFloor = 0;
  let kept = 0;
  let noDate = 0;
  let failures = 0;

  // Fetch in small chunks so a crash loses at most one chunk of work —
  // the cache is flushed to disk after every chunk.
  const CHUNK = 20;
  for (let i = 0; i < batch.length; i += CHUNK) {
    const chunk = batch.slice(i, i + CHUNK);
    const result = await fetchSpeeches(
      chunk.map((c) => ({ speechId: c.speechId, sourceUrl: c.sourceUrl })),
      { sleepBetweenMs: 1200, saveSpeechJson: false }
    );
    failures += result.failures.length;
    for (const f of result.successes) {
      if (f.publishedDate && f.publishedDate < DATE_FLOOR) {
        rejected[f.speechId] = { reason: 'pre-floor', date: f.publishedDate, decidedAt: today };
        preFloor += 1;
      } else if (!f.publishedDate) {
        // Fail-open: no cache entry — the weekly run re-examines it.
        noDate += 1;
      } else {
        kept += 1;
      }
    }
    saveRejectedIds(rejected);
    process.stdout.write(
      `  ${Math.min(i + CHUNK, batch.length)}/${batch.length} — pre-floor ${preFloor}, in-window ${kept}, no-date ${noDate}, failures ${failures}\n`
    );
  }

  process.stdout.write(
    `\n[voices-seed] DONE — cached ${preFloor} pre-floor rejects (${Object.keys(rejected).length} total in cache).\n` +
      `  In-window (>=${DATE_FLOOR}) pages left for weekly runs: ${kept}; no-date (fail-open): ${noDate}.\n`
  );
}

await main();
