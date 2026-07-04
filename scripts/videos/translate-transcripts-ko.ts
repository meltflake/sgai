// scripts/videos/translate-transcripts-ko.ts
// ────────────────────────────────────────────────────────────────────────
// Translates each video transcript's `paragraphs` (zh) into `paragraphsKo`
// and writes the result back to src/data/video-transcripts.ts inplace.
//
// Source-of-truth: the existing zh paragraphs already in
// src/data/video-transcripts.ts (these were translated from EN captions
// by translate-transcripts.ts). We translate zh → ko via lib/translate.ts
// (claude haiku, sha256-cached).
//
// Why a standalone script: the fetch-transcripts.ts emit pipeline reads
// from a gitignored raw cache (scripts/videos/data/transcripts/) which
// new worktrees don't have. This script operates directly on the
// committed src/ data file so it works anywhere.
//
// USAGE:
//   npx tsx scripts/videos/translate-transcripts-ko.ts            # all videos
//   npx tsx scripts/videos/translate-transcripts-ko.ts --ids=v059 # one
//   npx tsx scripts/videos/translate-transcripts-ko.ts --limit=5  # cap
//   npx tsx scripts/videos/translate-transcripts-ko.ts --force    # ignore cache

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { videoTranscripts } from '../../src/data/video-transcripts.ts';
import { translateBatch } from '../lib/translate.ts';
import { ensureClaudeAvailable } from '../lib/llm.ts';

const OUT_FILE = resolve('src/data/video-transcripts.ts');
const CACHE_DIR = resolve('scripts/videos/data/translate-cache-ko');

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
const idsArg = process.argv.find((a) => a.startsWith('--ids='));
const requestedIds = idsArg ? new Set(idsArg.split('=')[1].split(',').map((id) => id.trim())) : undefined;

interface DigestKo {
  keyPoints: string[];
  narrative: string[];
}

interface UpdateResult {
  videoId: string;
  paragraphsKo: string[];
  digestKo?: DigestKo;
  translatedAt: string;
}

async function translateOne(
  videoId: string,
  paragraphs: string[],
  digest: { keyPoints: string[]; narrative: string[] } | undefined
): Promise<UpdateResult> {
  const paragraphsKo = await translateBatch(paragraphs, {
    direction: 'zh→ko',
    cacheDir: CACHE_DIR,
    force,
  });
  let digestKo: DigestKo | undefined;
  if (digest) {
    const [keyPoints, narrative] = await Promise.all([
      translateBatch(digest.keyPoints, { direction: 'zh→ko', cacheDir: CACHE_DIR, force }),
      translateBatch(digest.narrative, { direction: 'zh→ko', cacheDir: CACHE_DIR, force }),
    ]);
    if (keyPoints.length === digest.keyPoints.length && narrative.length === digest.narrative.length) {
      digestKo = { keyPoints, narrative };
    }
  }
  return {
    videoId,
    paragraphsKo,
    digestKo,
    translatedAt: new Date().toISOString().slice(0, 10),
  };
}

// Inject `paragraphsKo: [...]` into the literal record for `videoId` in
// the current OUT_FILE source. Anchored just after the `paragraphsEn`
// block when present, otherwise just after `paragraphs: [...]`. Idempotent:
// if a `paragraphsKo` already exists for this id, replaces it.
function injectParagraphsJa(source: string, videoId: string, paragraphsKo: string[]): string {
  const recordHeaderRe = new RegExp(`(\\n\\s{2}${escapeRegex(videoId)}:\\s*\\{)`);
  const headerMatch = recordHeaderRe.exec(source);
  if (!headerMatch) {
    throw new Error(`Could not locate record header for ${videoId} in ${OUT_FILE}`);
  }
  const openIdx = headerMatch.index + headerMatch[0].length - 1;
  let depth = 1;
  let cursor = openIdx + 1;
  let inStr: string | null = null;
  while (cursor < source.length && depth > 0) {
    const ch = source[cursor];
    const prev = source[cursor - 1];
    if (inStr) {
      if (ch === inStr && prev !== '\\') inStr = null;
    } else {
      if (ch === '"' || ch === "'") inStr = ch;
      else if (ch === '{') depth += 1;
      else if (ch === '}') depth -= 1;
    }
    cursor += 1;
  }
  const closeIdx = cursor - 1;
  const recordBody = source.slice(openIdx, closeIdx + 1);

  const indent = '    ';
  const formatted = formatParagraphsJa(paragraphsKo, indent);

  const existingJaRe = /(\n\s{4}paragraphsKo:\s*\[[\s\S]*?\n\s{4}\],)/;
  if (existingJaRe.test(recordBody)) {
    const replacedBody = recordBody.replace(existingJaRe, () => `\n${formatted}`);
    return source.slice(0, openIdx) + replacedBody + source.slice(closeIdx + 1);
  }

  const enRe = /(\n\s{4}paragraphsEn:\s*\[[\s\S]*?\n\s{4}\],)/;
  const zhRe = /(\n\s{4}paragraphs:\s*\[[\s\S]*?\n\s{4}\],)/;
  let injected: string;
  if (enRe.test(recordBody)) {
    injected = recordBody.replace(enRe, (m) => `${m}\n${formatted}`);
  } else if (zhRe.test(recordBody)) {
    injected = recordBody.replace(zhRe, (m) => `${m}\n${formatted}`);
  } else {
    throw new Error(`No paragraphs block found in record ${videoId}`);
  }
  return source.slice(0, openIdx) + injected + source.slice(closeIdx + 1);
}

function formatParagraphsJa(paragraphs: string[], indent: string): string {
  const inner = paragraphs.map((p) => `${indent}  ${JSON.stringify(p)},`).join('\n');
  return `${indent}paragraphsKo: [\n${inner}\n${indent}],`;
}

function formatDigestKo(digest: DigestKo, indent: string): string {
  const kp = digest.keyPoints.map((p) => `${indent}    ${JSON.stringify(p)},`).join('\n');
  const nv = digest.narrative.map((p) => `${indent}    ${JSON.stringify(p)},`).join('\n');
  return `${indent}digestKo: {\n${indent}  keyPoints: [\n${kp}\n${indent}  ],\n${indent}  narrative: [\n${nv}\n${indent}  ],\n${indent}},`;
}

function injectDigestKo(source: string, videoId: string, digestKo: DigestKo): string {
  const recordHeaderRe = new RegExp(`(\\n\\s{2}${escapeRegex(videoId)}:\\s*\\{)`);
  const headerMatch = recordHeaderRe.exec(source);
  if (!headerMatch) {
    throw new Error(`Could not locate record header for ${videoId} in ${OUT_FILE}`);
  }
  const openIdx = headerMatch.index + headerMatch[0].length - 1;
  let depth = 1;
  let cursor = openIdx + 1;
  let inStr: string | null = null;
  while (cursor < source.length && depth > 0) {
    const ch = source[cursor];
    const prev = source[cursor - 1];
    if (inStr) {
      if (ch === inStr && prev !== '\\') inStr = null;
    } else {
      if (ch === '"' || ch === "'") inStr = ch;
      else if (ch === '{') depth += 1;
      else if (ch === '}') depth -= 1;
    }
    cursor += 1;
  }
  const closeIdx = cursor - 1;
  const recordBody = source.slice(openIdx, closeIdx + 1);

  const indent = '    ';
  const formatted = formatDigestKo(digestKo, indent);

  const existingJaRe = /(\n\s{4}digestKo:\s*\{[\s\S]*?\n\s{4}\},)/;
  if (existingJaRe.test(recordBody)) {
    const replacedBody = recordBody.replace(existingJaRe, () => `\n${formatted}`);
    return source.slice(0, openIdx) + replacedBody + source.slice(closeIdx + 1);
  }

  // Anchor: after digestEn block when present, else after digest, else
  // after paragraphsKo.
  const enRe = /(\n\s{4}digestEn:\s*\{[\s\S]*?\n\s{4}\},)/;
  const zhRe = /(\n\s{4}digest:\s*\{[\s\S]*?\n\s{4}\},)/;
  const paraJaRe = /(\n\s{4}paragraphsKo:\s*\[[\s\S]*?\n\s{4}\],)/;
  let injected: string;
  if (enRe.test(recordBody)) {
    injected = recordBody.replace(enRe, (m) => `${m}\n${formatted}`);
  } else if (zhRe.test(recordBody)) {
    injected = recordBody.replace(zhRe, (m) => `${m}\n${formatted}`);
  } else if (paraJaRe.test(recordBody)) {
    injected = recordBody.replace(paraJaRe, (m) => `${m}\n${formatted}`);
  } else {
    throw new Error(`No anchor block found in record ${videoId} for digestKo`);
  }
  return source.slice(0, openIdx) + injected + source.slice(closeIdx + 1);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ensureInterfaceHasParagraphsJa(source: string): string {
  if (source.includes('paragraphsKo?: string[]')) return source;
  return source.replace(
    /(paragraphsEn\?: string\[\];)/,
    `$1\n  /** Korean readable transcript. Translated from \`paragraphs\` (zh) by\n   *  scripts/videos/translate-transcripts-ko.ts. */\n  paragraphsKo?: string[];`
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
      !force && record.paragraphsKo && record.paragraphsKo.length === record.paragraphs.length;
    const needDigestKo = record.digest && !record.digestKo;
    if (haveParas && !needDigestKo) {
      process.stdout.write(`  ✓ ${id}: paragraphsKo + digestKo already present\n`);
      skippedCount += 1;
      continue;
    }

    const paraDesc = haveParas ? 'cached' : `${record.paragraphs.length} paras`;
    const digDesc = record.digest ? (record.digestKo ? 'digest cached' : 'digest pending') : 'no digest';
    process.stdout.write(`  → ${id}: zh→ko (${paraDesc}, ${digDesc}) ...\n`);
    try {
      const result = await translateOne(
        id,
        haveParas ? [] : record.paragraphs,
        needDigestKo ? record.digest : undefined
      );
      if (!haveParas) {
        if (result.paragraphsKo.length !== record.paragraphs.length) {
          process.stdout.write(
            `    ✗ ${id}: paragraph count mismatch (got ${result.paragraphsKo.length}, expected ${record.paragraphs.length}), skip\n`
          );
          skippedCount += 1;
          continue;
        }
        // Truncation guard: ja paragraph length should be roughly comparable
        // to zh source length. If any ja para is < 25% of its zh source,
        // the model likely truncated mid-output. Skip the whole record so
        // we don't inject corrupted content.
        const truncated = result.paragraphsKo.findIndex(
          (ja, i) => ja.length < record.paragraphs[i].length * 0.25
        );
        if (truncated !== -1) {
          process.stdout.write(
            `    ✗ ${id}: para[${truncated}] suspiciously short (ja ${result.paragraphsKo[truncated].length} vs zh ${record.paragraphs[truncated].length}), skip\n`
          );
          skippedCount += 1;
          continue;
        }
        source = injectParagraphsJa(source, id, result.paragraphsKo);
      }
      if (result.digestKo) {
        source = injectDigestKo(source, id, result.digestKo);
      }
      writeFileSync(OUT_FILE, source);
      translatedCount += 1;
      const partsLanded = [
        haveParas ? null : `${result.paragraphsKo.length} paras`,
        result.digestKo ? `digest (${result.digestKo.keyPoints.length}kp/${result.digestKo.narrative.length}nv)` : null,
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
