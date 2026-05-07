// scripts/hansard/translate-debate-transcripts.ts
// ────────────────────────────────────────────────────────────────────────
// Translate Hansard transcripts (English → Simplified Chinese) using the
// shared `lib/translate.ts` primitive (claude CLI under the hood).
//
// Why this exists:
//   - SPRS Hansard publishes English transcripts only.
//   - debate-transcripts.ts stores both `paragraphsEn` (raw) and
//     `paragraphs` (zh translation) so detail pages render bilingually.
//
// Migration note (2026-05):
//   This script previously called the OpenAI Chat Completions API directly
//   and required OPENAI_API_KEY. It now delegates to `lib/translate.ts`,
//   which uses the local `claude` CLI — same model used by every other
//   sgai pipeline (policies / videos / voices), no API key required, with
//   shared sha256 paragraph caching across all pipelines.
//
// CLI:
//   npm run translate:debate-transcripts                       # all debates lacking zh
//   npm run translate:debate-transcripts -- --ids=oral-answer-4017,budget-2902
//   npm run translate:debate-transcripts -- --limit=5
//   npm run translate:debate-transcripts -- --force            # bypass cache
//
// Output: scripts/hansard/data/translations/<id>.zh.json (per-debate package)
// + final regeneration of src/data/debate-transcripts.ts via fetch script.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { debates } from '../../src/data/debates';
import { translateBatch } from '../lib/translate.ts';

interface TranscriptRecord {
  debateId: string;
  sourceLanguage: 'en';
  fetchedAt: string;
  source: 'sprs-hansard' | 'unavailable';
  paragraphs: string[];
}

interface TranscriptTranslation {
  debateId: string;
  targetLanguage: 'zh';
  sourceLanguage: string;
  translatedAt: string;
  /**
   * Where the zh paragraphs came from:
   *   - 'claude'  → translated via lib/translate.ts (current default)
   *   - 'openai'  → legacy translations (older entries before 2026-05 migration)
   *   - 'manual'  → hand-curated by reviewer
   *   - 'source'  → source language was already zh, no translation needed
   */
  source: 'claude' | 'openai' | 'manual' | 'source';
  model?: string;
  paragraphs: string[];
}

const RAW_DIR = resolve('scripts/hansard/data/transcripts');
const TRANSLATION_DIR = resolve('scripts/hansard/data/translations');
// Cache shared with the rest of sgai pipelines so identical paragraphs
// translated by other flows are free here too.
const TRANSLATION_CACHE_DIR = resolve('scripts/hansard/data/translation-cache');
const TARGET_LANGUAGE = 'zh' as const;

// Defaults overridable via env. Model is documented in lib/translate.ts;
// 'haiku' is the cheap default. Hansard transcripts are formal but not
// terribly nuanced, so haiku quality is fine.
const DEFAULT_MODEL = process.env.HANSARD_TRANSLATION_MODEL || process.env.SGAI_TRANSLATION_MODEL || 'haiku';
const MAX_BATCH_CHARS = Number(process.env.HANSARD_TRANSLATION_BATCH_CHARS || 18000);
const CONCURRENCY = Number(process.env.HANSARD_TRANSLATION_CONCURRENCY || 3);

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
const idsArg = process.argv.find((arg) => arg.startsWith('--ids='));
const requestedIds = idsArg ? new Set(idsArg.split('=')[1].split(',').map((id) => id.trim())) : undefined;

function readTranscript(debateId: string): TranscriptRecord | null {
  const path = join(RAW_DIR, `${debateId}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as TranscriptRecord;
}

function translationPath(debateId: string): string {
  return join(TRANSLATION_DIR, `${debateId}.${TARGET_LANGUAGE}.json`);
}

function readTranslation(debateId: string): TranscriptTranslation | null {
  const path = translationPath(debateId);
  if (!existsSync(path) || force) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as TranscriptTranslation;
}

function isChineseLanguage(language: string): boolean {
  return language.toLowerCase().startsWith('zh');
}

async function translateRecord(record: TranscriptRecord): Promise<TranscriptTranslation> {
  // Already in zh — just copy paragraphs over.
  if (isChineseLanguage(record.sourceLanguage)) {
    return {
      debateId: record.debateId,
      targetLanguage: TARGET_LANGUAGE,
      sourceLanguage: record.sourceLanguage,
      translatedAt: record.fetchedAt,
      source: 'source',
      paragraphs: record.paragraphs,
    };
  }

  // Delegate paragraph-level translation to the shared primitive. It
  // handles batching by char budget, concurrency, sha256 caching, and
  // claude CLI retries.
  const paragraphs = await translateBatch(record.paragraphs, {
    direction: 'en→zh',
    model: DEFAULT_MODEL,
    concurrency: CONCURRENCY,
    batchChars: MAX_BATCH_CHARS,
    cacheDir: TRANSLATION_CACHE_DIR,
    force,
  });

  return {
    debateId: record.debateId,
    targetLanguage: TARGET_LANGUAGE,
    sourceLanguage: record.sourceLanguage,
    translatedAt: new Date().toISOString().slice(0, 10),
    source: 'claude',
    model: DEFAULT_MODEL,
    paragraphs,
  };
}

function regenerateTranscriptData(): void {
  const result = spawnSync('npx', ['tsx', 'scripts/hansard/fetch-debate-transcripts.ts', '--emit-only'], {
    stdio: 'inherit',
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error('Failed to regenerate src/data/debate-transcripts.ts.');
}

async function main(): Promise<void> {
  mkdirSync(TRANSLATION_DIR, { recursive: true });
  mkdirSync(TRANSLATION_CACHE_DIR, { recursive: true });

  const selected = debates.filter((debate) => !requestedIds || requestedIds.has(debate.id)).slice(0, limit);
  const rawFiles = new Set(existsSync(RAW_DIR) ? readdirSync(RAW_DIR).filter((file) => file.endsWith('.json')) : []);
  let translatedCount = 0;
  let skippedCount = 0;
  let missingCount = 0;

  async function processDebate(debate: (typeof debates)[number]): Promise<void> {
    if (!rawFiles.has(`${debate.id}.json`)) {
      process.stdout.write(`Skipping ${debate.id}: no fetched Hansard cache\n`);
      missingCount += 1;
      return;
    }

    const record = readTranscript(debate.id);
    if (!record || record.paragraphs.length === 0) {
      process.stdout.write(`Skipping ${debate.id}: transcript unavailable\n`);
      missingCount += 1;
      return;
    }

    const cached = readTranslation(debate.id);
    if (cached) {
      process.stdout.write(`Skipping ${debate.id}: cached zh translation\n`);
      skippedCount += 1;
      return;
    }

    process.stdout.write(`Translating ${debate.id} (${record.paragraphs.length} paragraphs) ...\n`);
    const translation = await translateRecord(record);
    writeFileSync(translationPath(debate.id), `${JSON.stringify(translation, null, 2)}\n`);
    translatedCount += 1;
    process.stdout.write(`Translated ${debate.id}\n`);
  }

  // Sequential processing — translateBatch already parallelises chunks
  // internally via CONCURRENCY, so doing per-debate concurrency here
  // would stack workers and hammer the claude CLI.
  for (const debate of selected) {
    await processDebate(debate);
  }

  regenerateTranscriptData();
  process.stdout.write(
    `Done. translated=${translatedCount}, cached=${skippedCount}, missing=${missingCount}, model=${DEFAULT_MODEL}, concurrency=${CONCURRENCY}\n`
  );
}

await main();
