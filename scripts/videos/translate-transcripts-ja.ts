// scripts/videos/translate-transcripts-ja.ts
// ────────────────────────────────────────────────────────────────────────
// Translates each video transcript's `paragraphs` (zh) into `paragraphsJa`
// and writes the result back to src/data/video-transcripts.ts inplace.
//
// Source-of-truth: the existing zh paragraphs already in
// src/data/video-transcripts.ts (these were translated from EN captions
// by translate-transcripts.ts). We translate zh → ja via lib/translate.ts
// (claude haiku, sha256-cached).
//
// Why a standalone script: the fetch-transcripts.ts emit pipeline reads
// from a gitignored raw cache (scripts/videos/data/transcripts/) which
// new worktrees don't have. This script operates directly on the
// committed src/ data file so it works anywhere.
//
// USAGE:
//   npx tsx scripts/videos/translate-transcripts-ja.ts            # all videos
//   npx tsx scripts/videos/translate-transcripts-ja.ts --ids=v059 # one
//   npx tsx scripts/videos/translate-transcripts-ja.ts --limit=5  # cap
//   npx tsx scripts/videos/translate-transcripts-ja.ts --force    # ignore cache

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { videoTranscripts } from '../../src/data/video-transcripts.ts';
import { translateBatch } from '../lib/translate.ts';
import { ensureClaudeAvailable } from '../lib/llm.ts';
import { upsertRecordField } from '../lib/ts-record-fields.ts';

const OUT_FILE = resolve('src/data/video-transcripts.ts');
const CACHE_DIR = resolve('scripts/videos/data/translate-cache-ja');

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
const idsArg = process.argv.find((a) => a.startsWith('--ids='));
const requestedIds = idsArg ? new Set(idsArg.split('=')[1].split(',').map((id) => id.trim())) : undefined;

interface DigestJa {
  keyPoints: string[];
  narrative: string[];
}

interface UpdateResult {
  videoId: string;
  paragraphsJa: string[];
  digestJa?: DigestJa;
  translatedAt: string;
}

async function translateOne(
  videoId: string,
  paragraphs: string[],
  digest: { keyPoints: string[]; narrative: string[] } | undefined
): Promise<UpdateResult> {
  const paragraphsJa = await translateBatch(paragraphs, {
    direction: 'zh→ja',
    cacheDir: CACHE_DIR,
    force,
  });
  let digestJa: DigestJa | undefined;
  if (digest) {
    const [keyPoints, narrative] = await Promise.all([
      translateBatch(digest.keyPoints, { direction: 'zh→ja', cacheDir: CACHE_DIR, force }),
      translateBatch(digest.narrative, { direction: 'zh→ja', cacheDir: CACHE_DIR, force }),
    ]);
    if (keyPoints.length === digest.keyPoints.length && narrative.length === digest.narrative.length) {
      digestJa = { keyPoints, narrative };
    }
  }
  return {
    videoId,
    paragraphsJa,
    digestJa,
    translatedAt: new Date().toISOString().slice(0, 10),
  };
}

// Upsert `paragraphsJa: [...]` in the literal record for `videoId`.
// Anchored just after `paragraphsEn` when present, otherwise just after
// `paragraphs`. Idempotent: replaces an existing `paragraphsJa`.
function injectParagraphsJa(source: string, videoId: string, paragraphsJa: string[]): string {
  const formatted = formatParagraphsJa(paragraphsJa, '    ');
  return upsertRecordField(source, videoId, 'paragraphsJa', formatted, ['paragraphsEn', 'paragraphs']);
}

function formatParagraphsJa(paragraphs: string[], indent: string): string {
  const inner = paragraphs.map((p) => `${indent}  ${JSON.stringify(p)},`).join('\n');
  return `${indent}paragraphsJa: [\n${inner}\n${indent}],`;
}

function formatDigestJa(digest: DigestJa, indent: string): string {
  const kp = digest.keyPoints.map((p) => `${indent}    ${JSON.stringify(p)},`).join('\n');
  const nv = digest.narrative.map((p) => `${indent}    ${JSON.stringify(p)},`).join('\n');
  return `${indent}digestJa: {\n${indent}  keyPoints: [\n${kp}\n${indent}  ],\n${indent}  narrative: [\n${nv}\n${indent}  ],\n${indent}},`;
}

function injectDigestJa(source: string, videoId: string, digestJa: DigestJa): string {
  // Anchor: after digestEn when present, else after digest, else after
  // paragraphsJa.
  const formatted = formatDigestJa(digestJa, '    ');
  return upsertRecordField(source, videoId, 'digestJa', formatted, ['digestEn', 'digest', 'paragraphsJa']);
}

function ensureInterfaceHasParagraphsJa(source: string): string {
  if (source.includes('paragraphsJa?: string[]')) return source;
  return source.replace(
    /(paragraphsEn\?: string\[\];)/,
    `$1\n  /** Japanese readable transcript. Translated from \`paragraphs\` (zh) by\n   *  scripts/videos/translate-transcripts-ja.ts. */\n  paragraphsJa?: string[];`
  );
}

function ensureGetterHandlesJa(source: string): string {
  const newGetter =
    `export function getVideoTranscriptParagraphs(videoId: string, lang: string): string[] {\n` +
    `  const transcript = getVideoTranscript(videoId);\n` +
    `  if (!transcript) return [];\n` +
    `  if (lang === 'zh') return transcript.paragraphs;\n` +
    `  if (lang === 'zh-tw') return transcript.paragraphs.map((p) => toTraditional(p));\n` +
    `  if (lang === 'ja') return transcript.paragraphsJa || transcript.paragraphsEn || transcript.paragraphs;\n` +
    `  if (lang === 'ko') return transcript.paragraphsKo || transcript.paragraphsEn || transcript.paragraphs;\n` +
    `  return transcript.paragraphsEn || transcript.paragraphs;\n` +
    `}`;
  return source.replace(/export function getVideoTranscriptParagraphs[\s\S]*?^}/m, newGetter);
}

function ensureLanguageGetterHandlesJa(source: string): string {
  const newGetter =
    `export function getVideoTranscriptLanguage(videoId: string, lang: string): string | undefined {\n` +
    `  const transcript = getVideoTranscript(videoId);\n` +
    `  if (!transcript) return undefined;\n` +
    `  if (lang === 'zh') return transcript.paragraphs.length ? 'zh-CN' : undefined;\n` +
    `  if (lang === 'zh-tw') return transcript.paragraphs.length ? 'zh-Hant' : undefined;\n` +
    `  if (lang === 'ja' && transcript.paragraphsJa?.length) return 'ja';\n` +
    `  if (lang === 'ko' && transcript.paragraphsKo?.length) return 'ko';\n` +
    `  if (transcript.paragraphsEn?.length) return transcript.captionLanguage || (lang === 'en' ? 'en' : lang);\n` +
    `  return transcript.paragraphs.length ? 'zh-CN' : undefined;\n` +
    `}`;
  return source.replace(/export function getVideoTranscriptLanguage[\s\S]*?^}/m, newGetter);
}

async function main() {
  ensureClaudeAvailable();

  const ids = Object.keys(videoTranscripts);
  const filtered = ids.filter((id) => !requestedIds || requestedIds.has(id));
  const selected = limit ? filtered.slice(0, limit) : filtered;

  process.stdout.write(`Translating ${selected.length}/${ids.length} transcripts to ja ...\n`);

  let source = readFileSync(OUT_FILE, 'utf8');
  source = ensureInterfaceHasParagraphsJa(source);
  source = ensureGetterHandlesJa(source);
  source = ensureLanguageGetterHandlesJa(source);

  let translatedCount = 0;
  let skippedCount = 0;

  for (const id of selected) {
    const record = videoTranscripts[id];
    if (!record.paragraphs || record.paragraphs.length === 0) {
      process.stdout.write(`  - ${id}: no zh paragraphs, skip\n`);
      skippedCount += 1;
      continue;
    }
    const haveParas =
      !force && record.paragraphsJa && record.paragraphsJa.length === record.paragraphs.length;
    const needDigestJa = record.digest && !record.digestJa;
    if (haveParas && !needDigestJa) {
      process.stdout.write(`  ✓ ${id}: paragraphsJa + digestJa already present\n`);
      skippedCount += 1;
      continue;
    }

    const paraDesc = haveParas ? 'cached' : `${record.paragraphs.length} paras`;
    const digDesc = record.digest ? (record.digestJa ? 'digest cached' : 'digest pending') : 'no digest';
    process.stdout.write(`  → ${id}: zh→ja (${paraDesc}, ${digDesc}) ...\n`);
    try {
      const result = await translateOne(
        id,
        haveParas ? [] : record.paragraphs,
        needDigestJa ? record.digest : undefined
      );
      if (!haveParas) {
        if (result.paragraphsJa.length !== record.paragraphs.length) {
          process.stdout.write(
            `    ✗ ${id}: paragraph count mismatch (got ${result.paragraphsJa.length}, expected ${record.paragraphs.length}), skip\n`
          );
          skippedCount += 1;
          continue;
        }
        // Truncation guard: ja paragraph length should be roughly comparable
        // to zh source length. If any ja para is < 25% of its zh source,
        // the model likely truncated mid-output. Skip the whole record so
        // we don't inject corrupted content.
        const truncated = result.paragraphsJa.findIndex(
          (ja, i) => ja.length < record.paragraphs[i].length * 0.25
        );
        if (truncated !== -1) {
          process.stdout.write(
            `    ✗ ${id}: para[${truncated}] suspiciously short (ja ${result.paragraphsJa[truncated].length} vs zh ${record.paragraphs[truncated].length}), skip\n`
          );
          skippedCount += 1;
          continue;
        }
        source = injectParagraphsJa(source, id, result.paragraphsJa);
      }
      if (result.digestJa) {
        source = injectDigestJa(source, id, result.digestJa);
      }
      writeFileSync(OUT_FILE, source);
      translatedCount += 1;
      const partsLanded = [
        haveParas ? null : `${result.paragraphsJa.length} paras`,
        result.digestJa ? `digest (${result.digestJa.keyPoints.length}kp/${result.digestJa.narrative.length}nv)` : null,
      ]
        .filter(Boolean)
        .join(' + ');
      process.stdout.write(`    ✓ ${id}: injected ${partsLanded}\n`);
    } catch (err) {
      process.stdout.write(`    ✗ ${id}: ${(err as Error).message}\n`);
      skippedCount += 1;
    }
  }

  process.stdout.write(
    `\nDone. translated=${translatedCount}, skipped=${skippedCount}, total=${selected.length}\n`
  );
}

await main();
