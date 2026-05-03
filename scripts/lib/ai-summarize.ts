// scripts/lib/ai-summarize.ts
// ────────────────────────────────────────────────────────────────────────
// AI summarisation primitive for sgai refresh pipelines.
//
// Takes a `GovPage`-like input (title + content text + sourceUrl) and
// returns a structured bilingual summary suitable for inserting into
// .ts data files. Calls the local `claude` CLI (no API key needed).
//
// Enforces:
//   - sourceUrl is mandatory (anti-hallucination guard)
//   - confidence is mandatory and self-reported by the model
//   - both zh + en summaries always present
//   - classification picks from a caller-supplied closed-set taxonomy
//
// Cache: keyed by sha256(sourceUrl + contentText.slice(0, 5000)) so
// re-running the pipeline on the same content is free.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { callLlmJson } from './llm.ts';

export interface SummaryInput {
  sourceUrl: string;
  title: string;
  contentText: string;
}

export interface SummarizeOptions {
  /** Closed-set classification labels. Model must pick one. */
  categories: string[];
  cacheDir?: string;
  force?: boolean;
  model?: string;
  /** Domain context to inject into the system prompt (e.g. "Singapore AI policies"). */
  domainContext?: string;
}

export interface BilingualSummary {
  sourceUrl: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  /** ISO date if extractable from input, otherwise null. */
  publishedDate: string | null;
  confidence: 'high' | 'medium' | 'low';
  /** Set true when confidence is low; pipelines should not render these on listing pages. */
  _pendingReview?: boolean;
  reasonForLowConfidence?: string;
  model: string;
  generatedAt: string;
}

const DEFAULT_MODEL = process.env.SGAI_SUMMARIZE_MODEL || 'haiku';

function hashOf(input: SummaryInput): string {
  return createHash('sha256').update(`${input.sourceUrl}::${input.contentText.slice(0, 5000)}`).digest('hex');
}

function readCache(cacheDir: string, hash: string): BilingualSummary | null {
  const path = join(cacheDir, `${hash}.json`);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as BilingualSummary;
  } catch {
    return null;
  }
}

function writeCache(cacheDir: string, hash: string, summary: BilingualSummary): void {
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(join(cacheDir, `${hash}.json`), `${JSON.stringify(summary, null, 2)}\n`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface ModelOutput {
  title?: string;
  titleZh?: string;
  description?: string;
  descriptionEn?: string;
  category?: string;
  publishedDate?: string | null;
  confidence?: 'high' | 'medium' | 'low';
  reasonForLowConfidence?: string;
}

function buildSystemPrompt(categories: string[], domainContext: string): string {
  return [
    `You are a research analyst for ${domainContext}. Your job is to read an English-language source page and produce a structured bilingual summary suitable for direct insertion into a TypeScript data file used on a public website.`,
    '',
    'Hard requirements:',
    '1. Output strict JSON. No prose, no markdown.',
    '2. Always return both Simplified Chinese (zh) and English (en) fields.',
    '3. Faithful summarisation only. Do NOT invent facts, dates, organisations, or programmes not present in the source.',
    '4. If the source content is too thin / unrelated / corrupted to summarise responsibly, return confidence: "low" and explain in reasonForLowConfidence.',
    '5. category must be exactly one of: ' + categories.map((c) => `"${c}"`).join(', '),
    '6. publishedDate must be ISO YYYY-MM-DD if found in source, else null. Never guess.',
    '7. confidence:',
    '   - "high": source is on-topic, structured, with clear date/title/body.',
    '   - "medium": on-topic but partial info or ambiguous classification.',
    '   - "low": off-topic, paywalled, error page, or insufficient content. Caller will mark _pendingReview and not render.',
    '',
    'Output schema:',
    '{',
    '  "title": string,           // Original title cleaned up, in English.',
    '  "titleZh": string,         // Translated title in Simplified Chinese.',
    '  "description": string,     // 2-4 sentence summary in Simplified Chinese.',
    '  "descriptionEn": string,   // 2-4 sentence summary in English.',
    '  "category": string,        // Must match one of the allowed categories exactly.',
    '  "publishedDate": string|null,',
    '  "confidence": "high"|"medium"|"low",',
    '  "reasonForLowConfidence": string  // Required only when confidence is "low".',
    '}',
  ].join('\n');
}

async function callClaudeSummarize(
  input: SummaryInput,
  options: { model: string; systemPrompt: string }
): Promise<Required<Omit<ModelOutput, 'reasonForLowConfidence'>> & { reasonForLowConfidence?: string }> {
  // Wrap input in an explicit instruction so the model executes the
  // summarisation task instead of returning a generic "I'm ready" reply.
  const inputJson = JSON.stringify(
    {
      sourceUrl: input.sourceUrl,
      title: input.title,
      contentText: input.contentText.slice(0, 12000),
    },
    null,
    2
  );
  const userPayload =
    `Summarise the following page using the JSON schema in your system prompt. ` +
    `Output ONLY raw JSON (no markdown, no commentary). The page:\n\n${inputJson}`;

  let lastError = '';
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const out = await callLlmJson<ModelOutput>(userPayload, {
        systemPrompt: options.systemPrompt,
        model: options.model,
      });
      const required: Array<keyof ModelOutput> = [
        'title', 'titleZh', 'description', 'descriptionEn', 'category', 'confidence',
      ];
      for (const k of required) {
        if (typeof out[k] !== 'string' || (out[k] as string).length === 0) {
          throw new Error(`Summary response missing required field "${k}"`);
        }
      }
      return {
        title: out.title!,
        titleZh: out.titleZh!,
        description: out.description!,
        descriptionEn: out.descriptionEn!,
        category: out.category!,
        publishedDate: typeof out.publishedDate === 'string' ? out.publishedDate : null,
        confidence: out.confidence!,
        reasonForLowConfidence: out.reasonForLowConfidence,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      const transient = /timeout|spawn|aborted|exited|ECONNRESET/i.test(lastError);
      if (!transient || attempt === 4) throw new Error(lastError);
      await sleep(attempt * attempt * 1500);
    }
  }
  throw new Error(lastError || 'Claude summarize failed.');
}

/**
 * Summarise a single page. Anti-hallucination guard: rejects empty
 * sourceUrl. Pipelines should always pass a real URL.
 */
export async function summarizePage(input: SummaryInput, options: SummarizeOptions): Promise<BilingualSummary> {
  if (!input.sourceUrl || !/^https?:\/\//.test(input.sourceUrl)) {
    throw new Error('summarizePage: sourceUrl must be an absolute http(s) URL.');
  }
  if (!options.categories || options.categories.length === 0) {
    throw new Error('summarizePage: categories list is required.');
  }

  const model = options.model || DEFAULT_MODEL;
  const cacheDir = options.cacheDir;
  const hash = hashOf(input);

  if (cacheDir && !options.force) {
    const cached = readCache(cacheDir, hash);
    if (cached) return cached;
  }

  const domainContext = options.domainContext || 'a Chinese-language Singapore AI observatory website (sgai.md)';
  const systemPrompt = buildSystemPrompt(options.categories, domainContext);
  const raw = await callClaudeSummarize(input, { model, systemPrompt });

  // Validate model output against schema.
  if (!options.categories.includes(raw.category)) {
    raw.category = options.categories[0];
    raw.confidence = 'low';
    raw.reasonForLowConfidence = `Model returned unknown category; defaulted to "${raw.category}".`;
  }
  if (!['high', 'medium', 'low'].includes(raw.confidence)) {
    raw.confidence = 'low';
    raw.reasonForLowConfidence = `Model returned invalid confidence "${raw.confidence}".`;
  }

  const summary: BilingualSummary = {
    sourceUrl: input.sourceUrl,
    title: raw.titleZh,
    titleEn: raw.title,
    description: raw.description,
    descriptionEn: raw.descriptionEn,
    category: raw.category,
    publishedDate: raw.publishedDate,
    confidence: raw.confidence,
    model,
    generatedAt: new Date().toISOString(),
  };
  if (raw.confidence === 'low') {
    summary._pendingReview = true;
    summary.reasonForLowConfidence = raw.reasonForLowConfidence || 'Model self-reported low confidence.';
  }

  if (cacheDir) writeCache(cacheDir, hash, summary);
  return summary;
}
