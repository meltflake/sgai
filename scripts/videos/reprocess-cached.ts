// scripts/videos/reprocess-cached.ts
// ────────────────────────────────────────────────────────────────────────
// Re-run the VTT → paragraphs parser on already-fetched .vtt files in
// scripts/videos/data/transcripts/, overwriting the corresponding .json.
// Use this after a parser change (e.g., a new ASR-cleanup pass) when you
// don't want to hit yt-dlp again for long livestream recordings.
//
// USAGE:
//   npx tsx scripts/videos/reprocess-cached.ts --ids=v061
//   npx tsx scripts/videos/reprocess-cached.ts --ids=v061,v062 --dry-run
//   npx tsx scripts/videos/reprocess-cached.ts --all   # all cached .vtt files

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { vttToParagraphsWithReport } from './vtt-parse.ts';

const RAW_DIR = resolve('scripts/videos/data/transcripts');

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const all = argv.includes('--all');
const idsArg = argv.find((a) => a.startsWith('--ids='));
const requestedIds = idsArg
  ? new Set(
      idsArg
        .slice('--ids='.length)
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    )
  : null;

if (!all && !requestedIds) {
  console.error('Usage: --ids=v061[,v062] | --all  [--dry-run]');
  process.exit(1);
}

interface CachedRecord {
  videoId: string;
  youtubeId: string;
  language: string;
  fetchedAt: string;
  source: 'youtube-subtitles' | 'unavailable';
  paragraphs: string[];
  error?: string;
}

function vttFilenameFor(videoId: string): string | null {
  const candidates = readdirSync(RAW_DIR).filter(
    (f) => f.startsWith(`${videoId}.`) && f.endsWith('.vtt')
  );
  return candidates[0] ? join(RAW_DIR, candidates[0]) : null;
}

function processOne(videoId: string): void {
  const jsonPath = join(RAW_DIR, `${videoId}.json`);
  if (!existsSync(jsonPath)) {
    console.log(`  ⚠ ${videoId}: no cached .json — skip`);
    return;
  }
  const vttPath = vttFilenameFor(videoId);
  if (!vttPath) {
    console.log(`  ⚠ ${videoId}: no cached .vtt — skip (only ${jsonPath} exists; raw vtt is required for reprocess)`);
    return;
  }
  const record = JSON.parse(readFileSync(jsonPath, 'utf8')) as CachedRecord;
  const vtt = readFileSync(vttPath, 'utf8');
  const { paragraphs, cleanup } = vttToParagraphsWithReport(vtt);
  const oldCount = record.paragraphs.length;
  const newCount = paragraphs.length;
  const changed = oldCount !== newCount || record.paragraphs.some((p, i) => p !== paragraphs[i]);
  if (!changed) {
    console.log(`  ✓ ${videoId}: no change (${newCount} paragraphs)`);
    return;
  }
  const cleanupNote = cleanup.stripped
    ? `cleanup dropped start=${cleanup.removedFromStart}, mid=${cleanup.removedFromMiddle}, end=${cleanup.removedFromEnd} (${cleanup.totalSentencesIn}→${cleanup.totalSentencesOut})`
    : 'no cleanup';
  console.log(`  ↻ ${videoId}: ${oldCount} → ${newCount} paragraphs (${cleanupNote})`);
  if (dryRun) return;
  const updated: CachedRecord = { ...record, paragraphs };
  writeFileSync(jsonPath, `${JSON.stringify(updated, null, 2)}\n`);
}

const ids = all
  ? readdirSync(RAW_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''))
  : Array.from(requestedIds || []);

console.log(`Reprocessing ${ids.length} cached transcripts${dryRun ? ' (dry-run)' : ''} ...`);
for (const id of ids) processOne(id);
console.log('Done.');
