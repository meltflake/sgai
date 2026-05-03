// scripts/refresh/videos/splice-transcripts.ts
// ────────────────────────────────────────────────────────────────────────
// SAFE alternative to `fetch-transcripts.ts --emit-only`.
//
// Why: emit-only does a full rewrite of src/data/video-transcripts.ts. That
// rewrite (a) flips entry keys from `v053:` (TS) to `"v053":` (JSON-stringified),
// (b) drops the VideoDigest interface, the digest/digestEn fields, and the
// getVideoDigest helper, and (c) clobbers every hand-curated zh translation in
// the file. Running it once flattens hours of curation work.
//
// This script does the minimal operation instead: read the per-video raw +
// translation cache files, build a properly-formatted TS literal for each new
// entry, and splice them in at the top of the `videoTranscripts` object —
// leaving the interface, helpers, and existing entries untouched.
//
// USAGE:
//   npx tsx scripts/refresh/videos/splice-transcripts.ts --ids=v055,v056,v057,v058
//   npx tsx scripts/refresh/videos/splice-transcripts.ts --ids=... --dry-run

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(process.cwd());
const VIDEO_TRANSCRIPTS_TS = resolve(ROOT, 'src/data/video-transcripts.ts');
const RAW_DIR = resolve(ROOT, 'scripts/videos/data/transcripts');
const TRANSLATION_DIR = resolve(ROOT, 'scripts/videos/data/translations');

interface RawTranscript {
  videoId: string;
  youtubeId: string;
  language: string;
  fetchedAt: string;
  source: 'youtube-subtitles' | 'unavailable';
  paragraphs: string[];
}

interface ZhTranslation {
  videoId: string;
  targetLanguage: 'zh';
  sourceLanguage: string;
  translatedAt: string;
  source: 'claude' | 'openai' | 'manual' | 'source';
  model?: string;
  paragraphs: string[];
}

const argv = process.argv.slice(2);
function arg(name: string): string | null {
  const prefix = `${name}=`;
  const found = argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}
const dryRun = argv.includes('--dry-run');
const idsArg = arg('--ids');
if (!idsArg) {
  console.error('Usage: --ids=<videoId>[,videoId...]');
  process.exit(1);
}
const ids = idsArg.split(',').map((s) => s.trim()).filter(Boolean);

function readJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

// Format a TS string literal — single-quoted, with newlines collapsed and
// embedded ' escaped. Keep zh full-width punctuation untouched.
function tsString(s: string): string {
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ').trim()}'`;
}

function buildEntryLiteral(id: string, raw: RawTranscript, zh: ZhTranslation): string {
  const lines: string[] = [];
  lines.push(`  ${id}: {`);
  lines.push(`    videoId: '${id}',`);
  lines.push(`    youtubeId: '${raw.youtubeId}',`);
  lines.push(`    captionLanguage: '${raw.language}',`);
  lines.push(`    fetchedAt: '${raw.fetchedAt}',`);
  lines.push(`    source: 'youtube-subtitles',`);
  lines.push(`    paragraphs: [`);
  for (const p of zh.paragraphs) lines.push(`      ${tsString(p)},`);
  lines.push(`    ],`);
  if (raw.language.toLowerCase().startsWith('en')) {
    lines.push(`    paragraphsEn: [`);
    for (const p of raw.paragraphs) lines.push(`      ${tsString(p)},`);
    lines.push(`    ],`);
  }
  lines.push(`    translatedAt: '${zh.translatedAt}',`);
  lines.push(`    translationSource: '${zh.source}',`);
  if (zh.model) lines.push(`    translationModel: '${zh.model}',`);
  lines.push(`    translationLanguage: '${zh.sourceLanguage}',`);
  lines.push(`  },`);
  return lines.join('\n');
}

function main(): void {
  if (!existsSync(VIDEO_TRANSCRIPTS_TS)) {
    throw new Error(`video-transcripts.ts not found at ${VIDEO_TRANSCRIPTS_TS}`);
  }
  const original = readFileSync(VIDEO_TRANSCRIPTS_TS, 'utf8');

  // Skip ids already present (don't double-insert on re-run).
  const present = new Set(
    Array.from(original.matchAll(/^ {2}(v\d+):\s*{/gm)).map((m) => m[1])
  );

  const newEntries: string[] = [];
  for (const id of ids) {
    if (present.has(id)) {
      console.log(`  ⏭  ${id}: already in video-transcripts.ts`);
      continue;
    }
    const raw = readJson<RawTranscript>(`${RAW_DIR}/${id}.json`);
    const zh = readJson<ZhTranslation>(`${TRANSLATION_DIR}/${id}.zh.json`);
    if (!raw) {
      console.warn(`  ⚠ ${id}: raw transcript cache missing — skipping`);
      continue;
    }
    if (!zh) {
      console.warn(`  ⚠ ${id}: zh translation cache missing — skipping`);
      continue;
    }
    const literal = buildEntryLiteral(id, raw, zh);
    console.log(`  ✓ ${id}: built ${zh.paragraphs.length} zh + ${raw.paragraphs.length} en paragraphs`);
    newEntries.push(literal);
  }

  if (!newEntries.length) {
    console.log('Nothing new to splice.');
    return;
  }

  // Splice immediately after `export const videoTranscripts: Record<string, VideoTranscript> = {`.
  const marker = /(export const videoTranscripts:\s*Record<string,\s*VideoTranscript>\s*=\s*\{\s*\n)/;
  if (!marker.test(original)) {
    throw new Error('Could not find videoTranscripts marker.');
  }
  const updated = original.replace(marker, (_, prefix) => `${prefix}${newEntries.join('\n')}\n`);

  if (dryRun) {
    console.log(`\n--dry-run: would write ${newEntries.length} new entries (${newEntries.reduce((s, e) => s + e.length, 0)} chars).`);
    return;
  }
  writeFileSync(VIDEO_TRANSCRIPTS_TS, updated);
  console.log(`\n✏️  Spliced ${newEntries.length} entries into ${VIDEO_TRANSCRIPTS_TS}`);

  const prettier = spawnSync('npx', ['prettier', '--write', VIDEO_TRANSCRIPTS_TS], {
    encoding: 'utf8',
    cwd: ROOT,
  });
  if (prettier.status !== 0) {
    console.warn(`  ⚠ prettier exited ${prettier.status}: ${(prettier.stderr || '').slice(0, 200)}`);
  } else {
    console.log('  ✓ prettier formatted');
  }
}

main();
