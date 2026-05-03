// scripts/lib/translate.ts
// ────────────────────────────────────────────────────────────────────────
// Shared translation primitive for sgai data pipelines.
//
// Translates an array of paragraphs/strings between zh ↔ en using OpenAI,
// with batching, concurrency, retries, and on-disk caching by content hash.
//
// Designed to be called from any refresh pipeline. Extracted and
// generalised from scripts/hansard/translate-debate-transcripts.ts.
//
// USAGE (programmatic):
//
//   import { translateBatch, TranslateOptions } from './lib/translate';
//
//   const zh = await translateBatch(['Paragraph one.', 'Paragraph two.'], {
//     direction: 'en→zh',
//     model: 'gpt-4.1-mini',
//     concurrency: 3,
//     cacheDir: 'scripts/policies/data/translations',
//   });
//
// USAGE (cli, future):
//
//   npx tsx scripts/lib/translate.ts \
//     --input <json-file-of-strings> \
//     --output <out-file> \
//     --direction en→zh \
//     [--model gpt-4.1-mini] [--concurrency 3] [--batch-chars 18000]
//
// CACHE:
//   Each translation is cached by sha256(direction + sourceText) so repeated
//   runs skip work. Cache lives at <cacheDir>/<sha256>.json. To invalidate,
//   delete the file or pass `force: true`.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export type TranslateDirection = 'en→zh' | 'zh→en';

export interface TranslateOptions {
  direction: TranslateDirection;
  model?: string;
  concurrency?: number;
  batchChars?: number;
  cacheDir?: string;
  force?: boolean;
  /** Override the system prompt for domain-specific translations (e.g. policy bills, hansard transcripts). */
  systemPrompt?: string;
  /** Optional per-call abort hook. */
  signal?: AbortSignal;
}

interface CachedTranslation {
  direction: TranslateDirection;
  source: string;
  target: string;
  model: string;
  translatedAt: string;
}

const DEFAULT_MODEL = process.env.OPENAI_TRANSLATION_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const DEFAULT_BATCH_CHARS = Number(process.env.SGAI_TRANSLATION_BATCH_CHARS || 18000);
const DEFAULT_CONCURRENCY = Number(process.env.SGAI_TRANSLATION_CONCURRENCY || 3);

const SYSTEM_PROMPTS: Record<TranslateDirection, string> = {
  'en→zh':
    'You are a professional translator for a Chinese policy-analysis website. Translate Singapore policy / Hansard / news content from English into clear, faithful Simplified Chinese. Preserve names, institutions, numbers, dates, policy terms, bill names, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI). Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array.',
  'zh→en':
    'You are a professional translator for an English-language policy-analysis website. Translate Singapore policy / news content from Simplified Chinese into clear, faithful English. Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms. Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array.',
};

function hashOf(direction: TranslateDirection, source: string): string {
  return createHash('sha256').update(`${direction}::${source}`).digest('hex');
}

function readCache(cacheDir: string, hash: string): CachedTranslation | null {
  const path = join(cacheDir, `${hash}.json`);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as CachedTranslation;
  } catch {
    return null;
  }
}

function writeCache(cacheDir: string, hash: string, payload: CachedTranslation): void {
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(join(cacheDir, `${hash}.json`), `${JSON.stringify(payload, null, 2)}\n`);
}

function chunkParagraphs(paragraphs: string[], maxChars: number): string[][] {
  const chunks: string[][] = [];
  let current: string[] = [];
  let currentLength = 0;

  for (const paragraph of paragraphs) {
    const length = paragraph.length;
    if (current.length > 0 && currentLength + length > maxChars) {
      chunks.push(current);
      current = [];
      currentLength = 0;
    }
    current.push(paragraph);
    currentLength += length;
  }

  if (current.length > 0) chunks.push(current);
  return chunks;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms);
  });
}

async function callOpenAI(
  paragraphs: string[],
  options: { model: string; systemPrompt: string; signal?: AbortSignal }
): Promise<string[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY env var is required.');

  const payload = {
    model: options.model,
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: JSON.stringify({ paragraphs }) },
    ],
  };

  let lastError = '';

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: options.signal,
    });

    if (response.ok) {
      const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('OpenAI translation response was empty.');
      const parsed = JSON.parse(content) as { paragraphs?: unknown };
      if (!Array.isArray(parsed.paragraphs) || !parsed.paragraphs.every((item) => typeof item === 'string')) {
        throw new Error('Translation response paragraphs malformed.');
      }
      const translated = parsed.paragraphs as string[];
      if (translated.length !== paragraphs.length) {
        throw new Error(`Translation count mismatch: expected ${paragraphs.length}, got ${translated.length}.`);
      }
      return translated;
    }

    const text = await response.text();
    lastError = `OpenAI translation failed: ${response.status} ${text}`;
    if (response.status === 429 || response.status >= 500) {
      await sleep(attempt * attempt * 1500);
      continue;
    }
    throw new Error(lastError);
  }

  throw new Error(lastError || 'OpenAI translation failed without response.');
}

async function callBatchWithFallback(
  paragraphs: string[],
  options: { model: string; systemPrompt: string; signal?: AbortSignal }
): Promise<string[]> {
  try {
    return await callOpenAI(paragraphs, options);
  } catch (error) {
    if (paragraphs.length === 1) throw error;
    process.stderr.write(`  batch fallback (${paragraphs.length} → 1×${paragraphs.length}): ${(error as Error).message}\n`);
    const out: string[] = [];
    for (const p of paragraphs) {
      out.push(...(await callOpenAI([p], options)));
    }
    return out;
  }
}

/**
 * Translate an array of paragraphs/strings. Order-preserving: output[i]
 * corresponds to input[i]. Caches per-paragraph by content hash; cache
 * hits skip the network call entirely.
 */
export async function translateBatch(paragraphs: string[], options: TranslateOptions): Promise<string[]> {
  if (paragraphs.length === 0) return [];

  const model = options.model || DEFAULT_MODEL;
  const batchChars = options.batchChars || DEFAULT_BATCH_CHARS;
  const concurrency = Math.max(1, options.concurrency || DEFAULT_CONCURRENCY);
  const systemPrompt = options.systemPrompt || SYSTEM_PROMPTS[options.direction];
  const cacheDir = options.cacheDir;

  // 1) Resolve cache hits.
  const result: (string | null)[] = paragraphs.map(() => null);
  const pendingIndices: number[] = [];

  if (cacheDir && !options.force) {
    for (let i = 0; i < paragraphs.length; i += 1) {
      const hash = hashOf(options.direction, paragraphs[i]);
      const cached = readCache(cacheDir, hash);
      if (cached) {
        result[i] = cached.target;
      } else {
        pendingIndices.push(i);
      }
    }
  } else {
    for (let i = 0; i < paragraphs.length; i += 1) pendingIndices.push(i);
  }

  if (pendingIndices.length === 0) return result as string[];

  // 2) Chunk pending into batches by char budget.
  const pendingTexts = pendingIndices.map((i) => paragraphs[i]);
  const chunks = chunkParagraphs(pendingTexts, batchChars);

  // 3) Concurrent worker pool.
  let nextChunk = 0;
  const flatResults: string[] = new Array(pendingTexts.length);
  let writeOffset = 0;
  const chunkOffsets: number[] = [];
  for (const chunk of chunks) {
    chunkOffsets.push(writeOffset);
    writeOffset += chunk.length;
  }

  async function worker(): Promise<void> {
    while (nextChunk < chunks.length) {
      const idx = nextChunk;
      nextChunk += 1;
      const chunk = chunks[idx];
      const translated = await callBatchWithFallback(chunk, { model, systemPrompt, signal: options.signal });
      const offset = chunkOffsets[idx];
      for (let i = 0; i < translated.length; i += 1) {
        flatResults[offset + i] = translated[i];
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  // 4) Map back to original positions, write cache.
  for (let k = 0; k < pendingIndices.length; k += 1) {
    const origIndex = pendingIndices[k];
    result[origIndex] = flatResults[k];
    if (cacheDir) {
      const hash = hashOf(options.direction, paragraphs[origIndex]);
      writeCache(cacheDir, hash, {
        direction: options.direction,
        source: paragraphs[origIndex],
        target: flatResults[k],
        model,
        translatedAt: new Date().toISOString().slice(0, 10),
      });
    }
  }

  return result as string[];
}

/**
 * Convenience wrapper: translate a single string (delegates to translateBatch).
 */
export async function translateOne(text: string, options: TranslateOptions): Promise<string> {
  const [out] = await translateBatch([text], options);
  return out;
}

/**
 * Translate a list of records by extracting given zh-only fields and
 * filling in their `*En` siblings. Skips records that already have
 * non-empty *En. Returns mutated copies (originals untouched).
 *
 * Example:
 *   await translateRecords(policies, ['title', 'description'], { direction: 'zh→en', cacheDir: ... });
 */
export async function translateRecords<T extends Record<string, unknown>>(
  records: T[],
  fields: string[],
  options: TranslateOptions
): Promise<T[]> {
  const updates: { recordIndex: number; field: string; source: string }[] = [];

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    for (const field of fields) {
      const enField = `${field}En`;
      const sourceVal = record[field];
      const enVal = record[enField];
      if (typeof sourceVal !== 'string' || !sourceVal) continue;
      if (typeof enVal === 'string' && enVal) continue;
      updates.push({ recordIndex: i, field, source: sourceVal });
    }
  }

  if (updates.length === 0) return records.map((r) => ({ ...r }));

  const sources = updates.map((u) => u.source);
  const translated = await translateBatch(sources, options);

  const out = records.map((r) => ({ ...r }));
  for (let k = 0; k < updates.length; k += 1) {
    const { recordIndex, field } = updates[k];
    (out[recordIndex] as Record<string, unknown>)[`${field}En`] = translated[k];
  }
  return out;
}
