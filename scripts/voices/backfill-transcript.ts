// scripts/voices/backfill-transcript.ts
// ────────────────────────────────────────────────────────────────────────
// One-shot runner to backfill src/data/speech-transcripts.ts for a speech
// that already has a row in src/data/voices.ts mddiSpeeches[] but whose
// transcript was never archived (e.g. transcript-coverage eval failure).
//
// Reads scripts/voices/data/speeches/<speechId>.json (the fetched payload
// produced by either 02_fetch_speeches.py or
// scripts/refresh/voices/fetch.ts), translates the English paragraphs into
// zh, asks claude haiku for a bilingual tldr, then splices a single new
// entry into src/data/speech-transcripts.ts via emit(transcriptsOnly: true).
//
// Why this exists instead of `scripts/refresh/voices/run.ts`:
//   - run.ts scan() skips URLs already in mddiSpeeches[], so it'll never
//     pick up a speech that's missing only the transcript.
//   - run.ts emit() also appends to voices.ts, which would duplicate the
//     existing row.
//   - 03_generate_ts.py full-rebuilds speech-transcripts.ts and drops any
//     entries whose source JSON isn't on disk (see transcript-coverage
//     report fix instructions).
//
// Usage:
//   npx tsx scripts/voices/backfill-transcript.ts <speechId> [--force]
//
// --force re-translates even when a cached translation JSON exists.

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { combineForEmit, emit } from '../refresh/voices/emit.ts';
import type { FetchedSpeech } from '../refresh/voices/fetch.ts';
import { translateSpeeches } from '../refresh/voices/translate.ts';

const SPEECHES_DIR = resolve('scripts/voices/data/speeches');

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const force = argv.includes('--force');
  const speechId = argv.find((a) => !a.startsWith('--'));
  if (!speechId) {
    process.stderr.write(
      'Usage: npx tsx scripts/voices/backfill-transcript.ts <speechId> [--force]\n'
    );
    process.exit(2);
  }

  const path = `${SPEECHES_DIR}/${speechId}.json`;
  if (!existsSync(path)) {
    process.stderr.write(
      `[backfill] no speech JSON at ${path}. Run 02_fetch_speeches.py first.\n`
    );
    process.exit(2);
  }
  const raw = JSON.parse(readFileSync(path, 'utf8')) as Partial<FetchedSpeech>;
  if (
    !raw.speechId ||
    !raw.sourceUrl ||
    !Array.isArray(raw.paragraphs) ||
    raw.paragraphs.length === 0
  ) {
    process.stderr.write(
      `[backfill] invalid speech JSON: speechId/sourceUrl/paragraphs missing or empty.\n`
    );
    process.exit(2);
  }
  const fetched: FetchedSpeech = {
    speechId: raw.speechId,
    sourceUrl: raw.sourceUrl,
    fetchedAt: raw.fetchedAt || new Date().toISOString().slice(0, 10),
    title: raw.title || '',
    publishedDate: raw.publishedDate ?? null,
    paragraphs: raw.paragraphs,
  };

  process.stdout.write(
    `[backfill] ${fetched.speechId}: translating ${fetched.paragraphs.length} paragraphs…\n`
  );
  const { translated, failures } = await translateSpeeches([fetched], { force });
  for (const f of failures) {
    process.stderr.write(`  ! translate ${f.speechId}: ${f.error}\n`);
  }
  if (failures.length > 0 || translated.length !== 1) {
    process.exit(1);
  }
  const t = translated[0];
  process.stdout.write(
    `  translated zh=${t.paragraphs.length}, tldr zh=${t.tldr.length} en=${t.tldrEn.length}\n`
  );

  // transcripts-only mode skips title/event validation and appendToVoices,
  // so the title/event/speaker enrichment fields below are unused. Pass
  // empty strings to make that explicit.
  const emittable = combineForEmit(fetched, t, {
    titleZh: '',
    titleEn: '',
    titleJa: '',
    eventEn: '',
    eventZh: '',
    eventJa: '',
    speaker: '',
    speakerTitleZh: '',
    speakerTitleEn: '',
    speakerTitleJa: '',
  });

  process.stdout.write('[backfill] emitting transcript entry…\n');
  const result = emit([emittable], { transcriptsOnly: true });
  for (const s of result.skipped) {
    process.stdout.write(`  skipped ${s.speechId}: ${s.reason}\n`);
  }
  process.stdout.write(
    `[backfill] done. recordsAdded=${result.recordsAdded}\n`
  );
  if (result.recordsAdded === 0) process.exit(1);
}

await main();
