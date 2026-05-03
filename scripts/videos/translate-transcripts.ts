import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { videos } from '../../src/data/videos';
import { callLlm, ensureClaudeAvailable } from '../lib/llm.ts';
import { translateBatch } from '../lib/translate.ts';

interface TranscriptRecord {
  videoId: string;
  youtubeId: string;
  language: string;
  fetchedAt: string;
  source: 'youtube-subtitles' | 'unavailable';
  paragraphs: string[];
  error?: string;
}

interface TranscriptTranslation {
  videoId: string;
  targetLanguage: 'zh';
  sourceLanguage: string;
  translatedAt: string;
  source: 'claude' | 'openai' | 'manual' | 'source';
  model?: string;
  paragraphs: string[];
}

const RAW_DIR = resolve('scripts/videos/data/transcripts');
const TRANSLATION_DIR = resolve('scripts/videos/data/translations');
const TRANSLATE_CACHE_DIR = resolve('scripts/videos/data/translate-cache');
const TARGET_LANGUAGE = 'zh' as const;
const DEFAULT_MODEL = process.env.SGAI_CLAUDE_MODEL || process.env.OPENAI_TRANSLATION_MODEL || 'haiku';

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
const idsArg = process.argv.find((arg) => arg.startsWith('--ids='));
const requestedIds = idsArg ? new Set(idsArg.split('=')[1].split(',').map((id) => id.trim())) : undefined;

function readTranscript(videoId: string): TranscriptRecord | null {
  const path = join(RAW_DIR, `${videoId}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as TranscriptRecord;
}

function translationPath(videoId: string): string {
  return join(TRANSLATION_DIR, `${videoId}.${TARGET_LANGUAGE}.json`);
}

function readTranslation(videoId: string): TranscriptTranslation | null {
  const path = translationPath(videoId);
  if (!existsSync(path) || force) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as TranscriptTranslation;
}

function isChineseLanguage(language: string): boolean {
  return language.toLowerCase().startsWith('zh');
}

// JSON-free fallback. The model returns one paragraph per line, separated
// by a unique delimiter. Robust against ASCII quote contamination that
// breaks JSON parsing on transcripts containing a lot of inline quotations
// (PM speeches, interviews, etc.).
const PARA_DELIMITER = '\n<<<¶>>>\n';
const FALLBACK_SYSTEM_PROMPT = [
  'You are a professional translator for a Chinese policy-analysis website. Translate Singapore policy / news content from English into clear, faithful Simplified Chinese.',
  'Preserve names, institutions, numbers, dates, policy terms, bill names, and acronyms (IMDA, MAS, NRF, AISG, MDDI).',
  'Do not summarize. Do not omit content. Do not add commentary. Do not number the paragraphs.',
  '',
  'OUTPUT FORMAT (CRITICAL):',
  '  - Plain text, NO JSON, NO markdown, NO code fences.',
  '  - Output the translated paragraphs separated by EXACTLY this delimiter line:',
  '      <<<¶>>>',
  '  - The number of output paragraphs MUST equal the number of input paragraphs.',
  '  - First and last lines must be the translated text, never the delimiter.',
].join('\n');

async function translateBatchPlainFallback(paragraphs: string[], model: string): Promise<string[]> {
  // Build user prompt with the same delimiter so the model has a clear template.
  const inputBlock = paragraphs.map((p, i) => `[${i + 1}] ${p}`).join(PARA_DELIMITER);
  const userPrompt = [
    `Translate the ${paragraphs.length} numbered English paragraphs below into Simplified Chinese.`,
    `Output ONLY the translated paragraphs separated by the delimiter line "<<<¶>>>" (no numbering, no extra text).`,
    'Output paragraph count must equal input paragraph count.',
    '',
    'INPUT:',
    inputBlock,
  ].join('\n');
  const raw = await callLlm(userPrompt, {
    systemPrompt: FALLBACK_SYSTEM_PROMPT,
    model,
    timeoutMs: Number(process.env.SGAI_LLM_TIMEOUT_MS || 240000),
  });
  // Strip leading numbered prefixes ("[1] ", "1. ") if the model added them anyway.
  const parts = raw
    .split(/\n?<{3}¶>{3}\n?/)
    .map((s) => s.replace(/^\s*(\[\d+\]|\d+[.)]\s*)\s*/, '').trim())
    .filter((s) => s.length > 0);
  if (parts.length !== paragraphs.length) {
    throw new Error(
      `plain-text fallback paragraph count mismatch: expected ${paragraphs.length}, got ${parts.length}`
    );
  }
  return parts;
}

async function translateRecord(record: TranscriptRecord, model: string): Promise<TranscriptTranslation> {
  if (isChineseLanguage(record.language)) {
    return {
      videoId: record.videoId,
      targetLanguage: TARGET_LANGUAGE,
      sourceLanguage: record.language,
      translatedAt: record.fetchedAt,
      source: 'source',
      paragraphs: record.paragraphs,
    };
  }

  // Primary: lib/translate.ts (JSON, sha256-cached, retry-with-backoff).
  // Fallback: per-paragraph plain-text delimited prompt — survives ASCII
  // quote contamination that breaks JSON parsing.
  let translated: string[];
  try {
    translated = await translateBatch(record.paragraphs, {
      direction: 'en→zh',
      model,
      cacheDir: TRANSLATE_CACHE_DIR,
      force,
    });
  } catch (error) {
    process.stdout.write(
      `\n  primary JSON path failed (${(error as Error).message.slice(0, 120)})\n  → falling back to delimited plain-text mode\n`
    );
    translated = await translateBatchPlainFallback(record.paragraphs, model);
  }

  return {
    videoId: record.videoId,
    targetLanguage: TARGET_LANGUAGE,
    sourceLanguage: record.language,
    translatedAt: new Date().toISOString().slice(0, 10),
    source: 'claude',
    model,
    paragraphs: translated,
  };
}

function regenerateTranscriptData(): void {
  const result = spawnSync('npx', ['tsx', 'scripts/videos/fetch-transcripts.ts', '--emit-only'], {
    stdio: 'inherit',
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error('Failed to regenerate src/data/video-transcripts.ts.');
}

async function main(): Promise<void> {
  ensureClaudeAvailable();
  mkdirSync(TRANSLATION_DIR, { recursive: true });

  const selected = videos.filter((video) => !requestedIds || requestedIds.has(video.id)).slice(0, limit);
  const rawFiles = new Set(readdirSync(RAW_DIR).filter((file) => file.endsWith('.json')));
  let translatedCount = 0;
  let skippedCount = 0;
  let missingCount = 0;

  for (const video of selected) {
    if (!rawFiles.has(`${video.id}.json`)) {
      process.stdout.write(`Skipping ${video.id}: no fetched transcript cache\n`);
      missingCount += 1;
      continue;
    }

    const record = readTranscript(video.id);
    if (!record || record.paragraphs.length === 0) {
      process.stdout.write(`Skipping ${video.id}: transcript unavailable\n`);
      missingCount += 1;
      continue;
    }

    const cached = readTranslation(video.id);
    if (cached) {
      process.stdout.write(`Skipping ${video.id}: cached zh translation\n`);
      skippedCount += 1;
      continue;
    }

    process.stdout.write(`Translating ${video.id} (${record.language}, ${record.paragraphs.length} paragraphs) ...\n`);
    const translation = await translateRecord(record, DEFAULT_MODEL);
    writeFileSync(translationPath(video.id), `${JSON.stringify(translation, null, 2)}\n`);
    translatedCount += 1;
  }

  regenerateTranscriptData();
  process.stdout.write(
    `Done. translated=${translatedCount}, cached=${skippedCount}, missing=${missingCount}, model=${DEFAULT_MODEL}\n`
  );
}

await main();
