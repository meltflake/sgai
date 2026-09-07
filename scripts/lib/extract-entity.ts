// scripts/lib/extract-entity.ts
// ────────────────────────────────────────────────────────────────────────
// Entity-name extraction for discovery pipelines whose data model is
// "one record per organisation / programme / product".
//
// Why: summarizePage returns a cleaned-up HEADLINE as `title`, and the
// ecosystem emit used it verbatim as the entity `name`. That is how a
// Business Times op-ed became an entity called "The AI Push Is Becoming an
// Energy Race: Sembcorp" (#294) instead of "Sembcorp Industries". This
// judge reads the body and answers: which single entity is this page
// primarily about, what is its proper name, and is there one at all?
//
// Failure policy mirrors judge-ai-relevance: on an LLM/parse error we keep
// the item (isEntity=true, low confidence, headline as name) so a real
// entity is never silently lost — a human fixes the name in PR review.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { callLlmJson } from './llm.ts';

export interface ExtractEntityInput {
  /** Page / article headline. */
  title: string;
  contentText: string;
  sourceUrl?: string;
}

export interface ExtractEntityOptions {
  /** Closed set of entity types the pipeline's schema accepts. */
  entityTypes: readonly string[];
  /** One-line meaning per type, e.g. { partner: 'a company or industry player' }.
   *  Bare type names leave the model guessing (it returned null for a
   *  company because "partner" did not obviously mean company). */
  entityTypeGloss?: Readonly<Record<string, string>>;
  cacheDir?: string;
  force?: boolean;
  model?: string;
}

export interface ExtractedEntity {
  /** True when the page is primarily about ONE identifiable entity. */
  isEntity: boolean;
  /** Proper name in English as the source uses it, e.g. "Sembcorp Industries". */
  nameEn: string;
  /** Simplified Chinese name when one is well established; otherwise nameEn. */
  nameZh: string;
  /** One of options.entityTypes, or null when the model could not decide. */
  entityType: string | null;
  /** Four-digit founding year, only when the source states it. */
  foundedYear: string | null;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  /** Filled by the pipeline's translation step, not by the model. */
  nameJa?: string;
  nameKo?: string;
}

interface ModelOutput {
  isEntity?: boolean;
  nameEn?: string;
  nameZh?: string;
  entityType?: string | null;
  foundedYear?: string | number | null;
  confidence?: 'high' | 'medium' | 'low';
  reason?: string;
}

/** Exported for prompt-assembly unit tests (no LLM call needed). */
export function buildSystemPrompt(
  entityTypes: readonly string[],
  gloss: Readonly<Record<string, string>> = {}
): string {
  const typeList = entityTypes.map((t) => (gloss[t] ? `"${t}" (${gloss[t]})` : `"${t}"`)).join(', ');
  return [
    'You are a research analyst for sgai.md, a Singapore AI ecosystem observatory whose map has ONE record per organisation, research lab, institute, programme, product, or platform.',
    'You read a page and identify the single entity it is PRIMARILY about, so the record can be named after the entity rather than after the headline.',
    '',
    'Rules:',
    '- nameEn is the proper name of the entity as the source itself uses it (e.g. "Sembcorp Industries", "AI Singapore", "GovTech"). It is NEVER the headline, a slogan, a sentence, or a description.',
    '- nameZh is the Simplified Chinese name ONLY if one is well established for this entity (e.g. 胜科工业, 新加坡科技研究局). If you are not certain, return nameEn unchanged. Never invent a translation.',
    '- isEntity=false when the page is about a trend, a market forecast, a budget or spending announcement, an event, an opinion, a how-to, or several entities with no clear primary subject.',
    '- If the primary subject is an initiative or product launched by an organisation, name the initiative/product and set entityType accordingly.',
    '- foundedYear: four-digit year ONLY when the source explicitly states when the entity was founded / launched. Publication dates are NOT founding dates. Otherwise null.',
    `- entityType must be exactly one of: ${typeList} — or null if none fits.`,
    '- confidence: "high" when the primary entity is unmistakable; "medium" when plausible; "low" when you are guessing.',
    '',
    'Return STRICT JSON, no prose, no markdown:',
    '{ "isEntity": boolean, "nameEn": string, "nameZh": string, "entityType": string|null, "foundedYear": string|null, "confidence": "high"|"medium"|"low", "reason": string }',
    'reason: one English sentence saying what the page is about and why that is (or is not) a single entity.',
  ].join('\n');
}

function hashOf(input: ExtractEntityInput): string {
  return createHash('sha256')
    .update(`${input.sourceUrl || ''}::${input.title}::${input.contentText.slice(0, 5000)}`)
    .digest('hex');
}

function readCache(cacheDir: string, hash: string): ExtractedEntity | null {
  const path = join(cacheDir, `${hash}.json`);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as ExtractedEntity;
  } catch {
    return null;
  }
}

function writeCache(cacheDir: string, hash: string, entity: ExtractedEntity): void {
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(join(cacheDir, `${hash}.json`), `${JSON.stringify(entity, null, 2)}\n`);
}

/** Validate / normalise raw model output into an ExtractedEntity. Exported for tests. */
export function normalizeModelOutput(
  out: ModelOutput,
  fallbackName: string,
  entityTypes: readonly string[]
): ExtractedEntity {
  const nameEn = typeof out.nameEn === 'string' && out.nameEn.trim() ? out.nameEn.trim() : fallbackName;
  const nameZh = typeof out.nameZh === 'string' && out.nameZh.trim() ? out.nameZh.trim() : nameEn;
  const entityType =
    typeof out.entityType === 'string' && entityTypes.includes(out.entityType) ? out.entityType : null;
  const yearStr = out.foundedYear === null || out.foundedYear === undefined ? '' : String(out.foundedYear).trim();
  const foundedYear = /^(19|20)\d{2}$/.test(yearStr) ? yearStr : null;
  const confidence =
    out.confidence === 'high' || out.confidence === 'medium' || out.confidence === 'low' ? out.confidence : 'low';
  return {
    isEntity: out.isEntity === true,
    nameEn,
    nameZh,
    entityType,
    foundedYear,
    confidence,
    reason: typeof out.reason === 'string' ? out.reason : '',
  };
}

/**
 * Identify the single entity a page is about. Conservative on failure
 * (keeps the item, low confidence, headline as name).
 */
export async function extractEntity(
  input: ExtractEntityInput,
  options: ExtractEntityOptions
): Promise<ExtractedEntity> {
  if (!options.entityTypes || options.entityTypes.length === 0) {
    throw new Error('extractEntity: entityTypes list is required.');
  }
  const model = options.model || process.env.SGAI_SUMMARIZE_MODEL || 'haiku';
  const hash = hashOf(input);
  if (options.cacheDir && !options.force) {
    const cached = readCache(options.cacheDir, hash);
    if (cached) return cached;
  }

  const body = (input.contentText || '').slice(0, 12000);
  const userPrompt = `Headline: ${input.title}\n${
    input.sourceUrl ? `Source: ${input.sourceUrl}\n` : ''
  }\nBody:\n\n${body}`;
  try {
    const out = await callLlmJson<ModelOutput>(userPrompt, {
      systemPrompt: buildSystemPrompt(options.entityTypes, options.entityTypeGloss),
      model,
    });
    const entity = normalizeModelOutput(out, input.title, options.entityTypes);
    if (options.cacheDir) writeCache(options.cacheDir, hash, entity);
    return entity;
  } catch (error) {
    return {
      isEntity: true,
      nameEn: input.title,
      nameZh: input.title,
      entityType: null,
      foundedYear: null,
      confidence: 'low',
      reason: `extract error, kept for review: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
