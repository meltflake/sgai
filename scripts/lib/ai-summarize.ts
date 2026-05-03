// scripts/lib/ai-summarize.ts
// ────────────────────────────────────────────────────────────────────────
// AI summarisation primitive for sgai refresh pipelines.
//
// Takes a `GovPage`-like input (title + content text + sourceUrl) and
// returns a structured bilingual summary suitable for inserting into
// .ts data files. Enforces:
//
//   - sourceUrl is mandatory (anti-hallucination guard)
//   - confidence is mandatory and self-reported by the model
//   - both zh + en summaries always present
//   - classification picks from a caller-supplied closed-set taxonomy
//
// Cache: keyed by sha256(sourceUrl + contentText.slice(0, 5000)) so
// re-running the pipeline on the same content is free.
//
// USAGE:
//   import { summarizePage } from './lib/ai-summarize';
//   const out = await summarizePage(
//     { sourceUrl, title, contentText },
//     {
//       categories: ['治理框架', '行业指引', '战略文件', '法规', '标准'],
//       cacheDir: 'scripts/refresh/policies/data/summaries',
//     }
//   );
//   if (out.confidence === 'low') out._pendingReview = true;

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

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

const DEFAULT_MODEL = process.env.OPENAI_SUMMARIZE_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini';

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

async function callOpenAI(
  input: SummaryInput,
  options: { model: string; systemPrompt: string }
): Promise<{
  title: string;
  titleZh: string;
  description: string;
  descriptionEn: string;
  category: string;
  publishedDate: string | null;
  confidence: 'high' | 'medium' | 'low';
  reasonForLowConfidence?: string;
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY env var is required.');

  const userPayload = {
    sourceUrl: input.sourceUrl,
    title: input.title,
    contentText: input.contentText.slice(0, 12000),
  };

  const payload = {
    model: options.model,
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: JSON.stringify(userPayload) },
    ],
  };

  let lastError = '';
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('OpenAI summary response was empty.');
      return JSON.parse(content);
    }

    const text = await response.text();
    lastError = `OpenAI summarize failed: ${response.status} ${text.slice(0, 200)}`;
    if (response.status === 429 || response.status >= 500) {
      await sleep(attempt * attempt * 1500);
      continue;
    }
    throw new Error(lastError);
  }
  throw new Error(lastError || 'OpenAI summarize failed.');
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
  const raw = await callOpenAI(input, { model, systemPrompt });

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
