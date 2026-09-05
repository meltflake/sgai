// scripts/lib/translate.ts
// ────────────────────────────────────────────────────────────────────────
// Shared translation primitive for sgai data pipelines.
//
// Translates an array of paragraphs/strings between zh ↔ en via the local
// `claude` CLI (Claude Code), with batching, concurrency, retries, and
// on-disk caching by content hash.
//
// Designed to be called from any refresh pipeline. Originally extracted
// from scripts/hansard/translate-debate-transcripts.ts, then refactored
// from OpenAI HTTP API to Claude CLI so pipelines run with Luca's
// existing Claude Code login (no API key needed).
//
// USAGE (programmatic):
//
//   import { translateBatch, TranslateOptions } from './lib/translate';
//
//   const zh = await translateBatch(['Paragraph one.', 'Paragraph two.'], {
//     direction: 'en→zh',
//     concurrency: 3,
//     cacheDir: 'scripts/policies/data/translations',
//   });
//
// CACHE:
//   Each translation is cached by sha256(direction + sourceText) so repeated
//   runs skip work. Cache lives at <cacheDir>/<sha256>.json. To invalidate,
//   delete the file or pass `force: true`.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { callLlmJson } from './llm.ts';

export type TranslateDirection =
  | 'en→zh'
  | 'zh→en'
  | 'zh→ja'
  | 'ja→zh'
  | 'en→ja'
  | 'ja→en'
  | 'zh→ko'
  | 'ko→zh'
  | 'en→ko'
  | 'ko→en'
  | 'ja→ko'
  | 'ko→ja';

export interface TranslateOptions {
  direction: TranslateDirection;
  model?: string;
  concurrency?: number;
  batchChars?: number;
  /** Hard upper bound on items per batch. Even when batchChars allows
   *  more, the batch is closed after this many paragraphs. Prevents the
   *  pathological "200 short strings in one batch" case where claude
   *  haiku reliably times out generating the JSON array output. */
  batchItems?: number;
  cacheDir?: string;
  force?: boolean;
  /** Override the system prompt for domain-specific translations (e.g. policy bills, hansard transcripts). */
  systemPrompt?: string;
  /** Optional per-call abort hook. */
  signal?: AbortSignal;
  /** Sibling-field suffix to write target translations to in
   *  translateRecords. Defaults to derived from `direction`'s target lang
   *  (en→'En', ja→'Ja'). zh shouldn't be a target. */
  targetSuffix?: string;
}

interface CachedTranslation {
  direction: TranslateDirection;
  source: string;
  target: string;
  model: string;
  translatedAt: string;
}

const DEFAULT_MODEL = process.env.SGAI_TRANSLATION_MODEL || 'haiku';
const DEFAULT_BATCH_CHARS = Number(process.env.SGAI_TRANSLATION_BATCH_CHARS || 18000);
const DEFAULT_BATCH_ITEMS = Number(process.env.SGAI_TRANSLATION_BATCH_ITEMS || 30);
const DEFAULT_CONCURRENCY = Number(process.env.SGAI_TRANSLATION_CONCURRENCY || 2);

// CRITICAL JSON safety rule: when the translated text contains a quote
// character, the model must use FULL-WIDTH Chinese quotes ("…") in zh
// output, curly typographic quotes (“…”) in en output, and Japanese
// 「…」 (or fullwidth 『…』) in ja output — NEVER ASCII straight quotes
// ("). Straight quotes inside a JSON string field break the parser
// unless escaped, and models routinely forget to escape them.
// Full-width / curly / Japanese quotes are visually appropriate to
// readers but JSON-safe.
const SYSTEM_PROMPTS: Record<TranslateDirection, string> = {
  'en→zh':
    'You are a professional translator for a Chinese policy-analysis website. Translate Singapore policy / Hansard / news content from English into clear, faithful Simplified Chinese. Preserve names, institutions, numbers, dates, policy terms, bill names, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI). Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use FULL-WIDTH Chinese quotation marks (“ and ” or 「 and 」) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'zh→en':
    'You are a professional translator for an English-language policy-analysis website. Translate Singapore policy / news content from Simplified Chinese into clear, faithful English. Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms. Render Singapore-dollar amounts with the S$ prefix (e.g. S$1 billion, S$8,500), never as a suffix (1 billion S$) or spelled out as Singapore dollars. Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use curly typographic quotes (“ and ”) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'zh→ja':
    'You are a professional translator for a Japanese policy-analysis website. Translate Singapore AI policy / Hansard / news content from Simplified Chinese into clear, faithful Japanese using the です・ます polite-but-professional register. Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original form. Use established Japanese AI-policy terminology where it exists; otherwise transliterate to katakana. SCRIPT PURITY (CRITICAL): output pure Japanese — every Han character MUST be a valid Japanese shinjitai kanji. NEVER emit Simplified-Chinese-only characters (e.g. 战经现观产东严门龙实发选进话说远转); write their Japanese forms (戦経現観産東厳門龍実発選進話説遠転). Transliterate Chinese proper nouns — Singapore person names, place names, programme names, phonetic renderings such as 亚历山大 / 皇后镇 / 乐龄邻里 — into katakana or a romanized Latin name; do NOT keep them as Chinese characters. Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use Japanese quotation marks 「 」 (or 『 』 for nested) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'ja→zh':
    'You are a professional translator for a Chinese policy-analysis website. Translate Singapore-related Japanese content into clear, faithful Simplified Chinese. Preserve all proper nouns, numbers, dates, and acronyms in their original form. Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use FULL-WIDTH Chinese quotation marks (“ and ” or 「 and 」) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'en→ja':
    'You are a professional translator for a Japanese policy-analysis website. Translate Singapore AI policy / Hansard / news content from English into clear, faithful Japanese using the です・ます polite-but-professional register. Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original Latin form. Use established Japanese AI-policy terminology where it exists; otherwise transliterate to katakana. SCRIPT PURITY (CRITICAL): output pure Japanese — every Han character MUST be a valid Japanese shinjitai kanji. NEVER emit Simplified-Chinese-only characters (e.g. 战经现观产东严门龙实发选进话说远转); write their Japanese forms (戦経現観産東厳門龍実発選進話説遠転). Transliterate Chinese proper nouns — Singapore person names, place names, programme names, phonetic renderings such as 亚历山大 / 皇后镇 / 乐龄邻里 — into katakana or a romanized Latin name; do NOT keep them as Chinese characters. Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use Japanese quotation marks 「 」 (or 『 』 for nested) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'ja→en':
    'You are a professional translator for an English-language policy-analysis website. Translate Singapore-related Japanese content into clear, faithful English. Preserve all proper nouns, numbers, dates, and acronyms in their original form. Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use curly typographic quotes (“ and ”) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  // Korean directions. The KO prompts ask for the 합쇼체 (formal polite)
  // register used in Korean policy writing — equivalent in tone to
  // ja's です・ます. Proper nouns and acronyms stay in Latin where the
  // source uses Latin; for CJK proper nouns the model is told to add a
  // hangul transcription on first mention (싱가포르 etc.) but keep
  // institutional acronyms like IMDA / MDDI verbatim.
  'zh→ko':
    'You are a professional translator for a Korean policy-analysis website. Translate Singapore AI policy / Hansard / news content from Simplified Chinese into clear, faithful Korean using the 합쇼체 polite-but-professional register. Preserve all proper nouns, numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original Latin form. NEVER write Han characters (hanja) in the output: a Chinese character on a Korean page is flagged as foreign-script residue by the i18n gate. Write prefixes like 비미국 in pure hangul, never 비(非). NEVER write Han characters (hanja) in the output: a Chinese character on a Korean page is flagged as foreign-script residue by the i18n gate. Write prefixes like 비미국 in pure hangul, never 비(非). NEVER write Han characters (hanja) in the output: a Chinese character on a Korean page is flagged as foreign-script residue by the i18n gate. Write prefixes like 비미국 in pure hangul, never 비(非). Render the country name as 싱가포르. Use established Korean AI-policy terminology where it exists; otherwise transliterate to Hangul. SCRIPT PURITY (CRITICAL): output pure Korean — Hangul, Latin letters, numbers, and standard punctuation only. NEVER emit any Han/Chinese character (한자). Render Singapore-dollar amounts with the unit 싱가포르 달러 (never 신원, which reads as the Korean word for identity). Transliterate every Chinese proper noun — person names, place names, programme names such as 王瑞杰 / 皇后镇 / 人民币 — into Hangul or a romanized Latin name; translate Chinese idioms/quotes such as 逆水行舟 / 子曰 into their Korean meaning. Do NOT leave any Chinese character in the output. Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use Korean quotation marks 「 」 (or 『 』 for nested) or curly typographic quotes (“ and ”) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'ko→zh':
    'You are a professional translator for a Chinese policy-analysis website. Translate Singapore-related Korean content into clear, faithful Simplified Chinese. Preserve all proper nouns, numbers, dates, and acronyms in their original form. Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use FULL-WIDTH Chinese quotation marks (“ and ” or 「 and 」) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'en→ko':
    'You are a professional translator for a Korean policy-analysis website. Translate Singapore AI policy / Hansard / news content from English into clear, faithful Korean using the 합쇼체 polite-but-professional register. Preserve all proper nouns, numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original Latin form. Render the country name as 싱가포르. Use established Korean AI-policy terminology where it exists; otherwise transliterate to Hangul. SCRIPT PURITY (CRITICAL): output pure Korean — Hangul, Latin letters, numbers, and standard punctuation only. NEVER emit any Han/Chinese character (한자). Render Singapore-dollar amounts with the unit 싱가포르 달러 (never 신원, which reads as the Korean word for identity). Transliterate every Chinese proper noun — person names, place names, programme names such as 王瑞杰 / 皇后镇 / 人民币 — into Hangul or a romanized Latin name; translate Chinese idioms/quotes such as 逆水行舟 / 子曰 into their Korean meaning. Do NOT leave any Chinese character in the output. NEVER write Han characters (hanja) in the output: a Chinese character on a Korean page is flagged as foreign-script residue by the i18n gate. Write prefixes like 비미국 in pure hangul, never 비(非). Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use Korean quotation marks 「 」 (or 『 』 for nested) or curly typographic quotes (“ and ”) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'ko→en':
    'You are a professional translator for an English-language policy-analysis website. Translate Singapore-related Korean content into clear, faithful English. Preserve all proper nouns, numbers, dates, and acronyms in their original form. Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use curly typographic quotes (“ and ”) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'ja→ko':
    'You are a professional translator for a Korean policy-analysis website. Translate Singapore-related Japanese content into clear, faithful Korean using the 합쇼체 polite-but-professional register. Preserve all proper nouns, numbers, dates, and acronyms in their original form. Render the country name as 싱가포르. NEVER write Han characters (hanja) in the output: a Chinese character on a Korean page is flagged as foreign-script residue by the i18n gate. Write prefixes like 비미국 in pure hangul, never 비(非). Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use Korean quotation marks 「 」 (or 『 』 for nested) or curly typographic quotes (“ and ”) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  'ko→ja':
    'You are a professional translator for a Japanese policy-analysis website. Translate Singapore-related Korean content into clear, faithful Japanese using the です・ます polite-but-professional register. Preserve all proper nouns, numbers, dates, and acronyms in their original form. Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array. CRITICAL: inside the translated paragraph TEXT, use Japanese quotation marks 「 」 (or 『 』 for nested) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
};

// ── Glossary injection (issue #85) ──────────────────────────────────────────
// The term-fidelity source of truth is scripts/evals/translation/glossary.json
// (also consumed by the translation eval). Injecting it into the system prompt
// makes every pipeline's ja/ko/en output respect the same proper-noun and
// acronym mappings the eval asserts — instead of trusting the model's memory,
// which drifts across model upgrades (IMDA/MDDI dropped, 深度伪造 not rendered
// as ディープフェイク, 黄循财 not as ローレンス・ウォン). A missing/malformed
// glossary degrades gracefully to the prior prompt-only behaviour.
//
// The per-paragraph cache key is (direction + source) only — NOT the prompt —
// so adding this hint deliberately does NOT invalidate existing cached
// translations (already committed transcripts stay put); only fresh/forced
// translations pick up the glossary. Run the eval with --force to re-verify.

type GlossaryLang = 'en' | 'ja' | 'ko';

interface GlossaryEntry {
  zh: string;
  en?: string[];
  ja?: string[];
  ko?: string[];
}

const GLOSSARY_PATH = join(import.meta.dirname, '..', 'evals', 'translation', 'glossary.json');
let glossaryCache: GlossaryEntry[] | null | undefined;

function loadGlossaryTerms(): GlossaryEntry[] | null {
  if (glossaryCache !== undefined) return glossaryCache;
  try {
    const raw = JSON.parse(readFileSync(GLOSSARY_PATH, 'utf8')) as Record<string, unknown>;
    const terms: GlossaryEntry[] = [];
    for (const section of Object.values(raw)) {
      if (!section || typeof section !== 'object') continue; // skip the _comment string
      for (const [zh, exp] of Object.entries(section as Record<string, { en?: string[]; ja?: string[]; ko?: string[] }>)) {
        if (!exp || typeof exp !== 'object') continue;
        terms.push({ zh, en: exp.en, ja: exp.ja, ko: exp.ko });
      }
    }
    glossaryCache = terms.length > 0 ? terms : null;
  } catch {
    glossaryCache = null;
  }
  return glossaryCache;
}

type GlossaryTarget = GlossaryLang | 'zh';

function glossaryTargetOf(direction: TranslateDirection): GlossaryTarget | null {
  const target = direction.split('→')[1];
  return target === 'en' || target === 'ja' || target === 'ko' || target === 'zh' ? target : null;
}

const ACRONYM_RE = /^[A-Z0-9.\s-]{2,}$/;

/** Build a terminology block for the glossary terms that actually appear in
 *  this batch's source text. Renders `zhTerm → canonical(ACRONYM)` so both the
 *  localized form and its acronym land in the output, satisfying the eval's
 *  glossary + preserveTokens assertions and keeping institution names
 *  consistent across the site's ja/ko pages. Returns '' when nothing matches.
 *
 *  For zh-target directions (en→zh etc.) the matching is reversed: the entry's
 *  en/ja/ko aliases are searched in the source and rendered `alias → zhTerm`.
 *  Acronym-only aliases (AI, MAS, LLM …) are skipped as match keys — zh copy
 *  legitimately keeps them verbatim, and they would over-trigger. This is the
 *  guard against phonetic name hallucination (Gan Kim Yong rendered 甘金勇 /
 *  甘照胜 instead of the official 颜金勇, caught 2026-08-11 in PR #184).
 *
 *  Exported for unit tests. */
export function buildGlossaryHint(sources: string[], target: GlossaryTarget): string {
  const terms = loadGlossaryTerms();
  if (!terms) return '';
  const haystack = sources.join('\n');
  const lines: string[] = [];
  if (target === 'zh') {
    for (const t of terms) {
      const aliases = [...(t.en ?? []), ...(t.ja ?? []), ...(t.ko ?? [])];
      for (const alias of aliases) {
        if (alias === t.zh || ACRONYM_RE.test(alias)) continue;
        if (!haystack.includes(alias)) continue;
        lines.push(`- ${alias} → ${t.zh}`);
      }
    }
  } else {
    const [open, close] = target === 'en' ? ['(', ')'] : ['（', '）'];
    for (const t of terms) {
      if (!haystack.includes(t.zh)) continue;
      const allowed = t[target];
      if (!allowed || allowed.length === 0) continue;
      // First entry = canonical localized form; a trailing all-caps Latin entry
      // (IMDA, MDDI, AIAP …) is the acronym to keep verbatim. Render both.
      const canonical = allowed[0];
      const acronym = allowed.slice(1).find((a) => ACRONYM_RE.test(a));
      const rendered = acronym && !canonical.includes(acronym) ? `${canonical}${open}${acronym}${close}` : canonical;
      lines.push(`- ${t.zh} → ${rendered}`);
    }
  }
  // Several aliases of one entry can match the same batch (Sylvia Lim / Ms Lim / …),
  // each pushing an identical line. Dedupe so the prompt stays tight.
  const unique = [...new Set(lines)];
  if (unique.length === 0) return '';
  return (
    `TERMINOLOGY — the source contains these fixed terms. Render each EXACTLY as ` +
    `specified below and keep any parenthesized acronym verbatim (never translate, ` +
    `transliterate, or omit the acronym):\n${unique.join('\n')}`
  );
}

/** Derive the sibling-field suffix to use when writing translation output
 *  to a record. e.g. 'zh→en' → 'En', 'zh→ja' → 'Ja'. zh is the bare-key
 *  default and shouldn't be a target (returns '' so caller can detect). */
function defaultTargetSuffix(direction: TranslateDirection): string {
  const target = direction.split('→')[1];
  if (target === 'zh') return '';
  return target.charAt(0).toUpperCase() + target.slice(1);
}

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

function chunkParagraphs(paragraphs: string[], maxChars: number, maxItems: number): string[][] {
  const chunks: string[][] = [];
  let current: string[] = [];
  let currentLength = 0;
  const itemCap = Math.max(1, maxItems);

  for (const paragraph of paragraphs) {
    const length = paragraph.length;
    const wouldExceedChars = currentLength + length > maxChars;
    const wouldExceedItems = current.length >= itemCap;
    if (current.length > 0 && (wouldExceedChars || wouldExceedItems)) {
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

async function callClaudeTranslate(
  paragraphs: string[],
  options: { model: string; systemPrompt: string; signal?: AbortSignal; glossaryTarget?: GlossaryTarget | null }
): Promise<string[]> {
  let lastError = '';

  // Prepend a terminology block for the glossary terms present in THESE
  // paragraphs (see buildGlossaryHint). Computed per actual LLM call so each
  // batch only carries the terms it needs.
  const hint = options.glossaryTarget ? buildGlossaryHint(paragraphs, options.glossaryTarget) : '';
  const systemPrompt = hint ? `${options.systemPrompt}\n\n${hint}` : options.systemPrompt;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      // Wrap the JSON in an explicit instruction so the model executes the
      // translation task instead of returning a generic "I'm ready" reply.
      const userPrompt =
        `Translate the paragraphs below using the system prompt's rules. ` +
        `Output ONLY raw JSON {"paragraphs":["..."]} with the same array length. ` +
        `Input:\n${JSON.stringify({ paragraphs })}`;
      const parsed = await callLlmJson<{ paragraphs?: unknown }>(userPrompt, {
        systemPrompt,
        model: options.model,
        signal: options.signal,
      });
      if (!Array.isArray(parsed.paragraphs) || !parsed.paragraphs.every((item) => typeof item === 'string')) {
        throw new Error('Translation response paragraphs malformed.');
      }
      const translated = parsed.paragraphs as string[];
      if (translated.length !== paragraphs.length) {
        throw new Error(`Translation count mismatch: expected ${paragraphs.length}, got ${translated.length}.`);
      }
      return translated;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      // Retry on transient errors only (timeout / spawn). Hard parse errors fall through.
      const transient = /timeout|spawn|aborted|exited|ECONNRESET/i.test(lastError);
      if (!transient || attempt === 4) throw new Error(lastError);
      await sleep(attempt * attempt * 1500);
    }
  }
  throw new Error(lastError || 'Claude translation failed without response.');
}

async function callBatchWithFallback(
  paragraphs: string[],
  options: { model: string; systemPrompt: string; signal?: AbortSignal; glossaryTarget?: GlossaryTarget | null }
): Promise<string[]> {
  try {
    return await callClaudeTranslate(paragraphs, options);
  } catch (error) {
    if (paragraphs.length === 1) throw error;
    // Halve the batch and recurse on each half in parallel. Halving (not
    // 1-by-1) means a flaky 200-item batch first becomes 2×100, then
    // 4×50, etc. — recovering quickly when only a small subset is the
    // troublemaker. Going straight to 1-by-1 wastes time re-translating
    // strings that would have succeeded in larger groups, and serially
    // hits the model timeout for every retry.
    const half = Math.ceil(paragraphs.length / 2);
    process.stderr.write(
      `  batch fallback (${paragraphs.length} → 2×~${half}): ${(error as Error).message}\n`
    );
    const left = paragraphs.slice(0, half);
    const right = paragraphs.slice(half);
    const [l, r] = await Promise.all([
      callBatchWithFallback(left, options),
      callBatchWithFallback(right, options),
    ]);
    return [...l, ...r];
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
  const batchItems = options.batchItems || DEFAULT_BATCH_ITEMS;
  const concurrency = Math.max(1, options.concurrency || DEFAULT_CONCURRENCY);
  const systemPrompt = options.systemPrompt || SYSTEM_PROMPTS[options.direction];
  const glossaryTarget = glossaryTargetOf(options.direction);
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

  // 2) Chunk pending into batches by char + item budget.
  const pendingTexts = pendingIndices.map((i) => paragraphs[i]);
  const chunks = chunkParagraphs(pendingTexts, batchChars, batchItems);

  // 3) Concurrent worker pool.
  let nextChunk = 0;
  const flatResults: string[] = new Array(pendingTexts.length);
  let writeOffset = 0;
  const chunkOffsets: number[] = [];
  for (const chunk of chunks) {
    chunkOffsets.push(writeOffset);
    writeOffset += chunk.length;
  }

  const today = new Date().toISOString().slice(0, 10);

  async function worker(): Promise<void> {
    while (nextChunk < chunks.length) {
      const idx = nextChunk;
      nextChunk += 1;
      const chunk = chunks[idx];
      const translated = await callBatchWithFallback(chunk, { model, systemPrompt, signal: options.signal, glossaryTarget });
      const offset = chunkOffsets[idx];
      for (let i = 0; i < translated.length; i += 1) {
        flatResults[offset + i] = translated[i];
      }
      // Persist this chunk's translations to cache immediately so a
      // killed/crashed run preserves partial progress. Without this, all
      // completed chunks are lost if any later chunk throws.
      if (cacheDir) {
        for (let i = 0; i < translated.length; i += 1) {
          const hash = hashOf(options.direction, chunk[i]);
          writeCache(cacheDir, hash, {
            direction: options.direction,
            source: chunk[i],
            target: translated[i],
            model,
            translatedAt: today,
          });
        }
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  // 4) Map back to original positions. Cache writes already happened
  //    chunk-by-chunk inside the worker.
  for (let k = 0; k < pendingIndices.length; k += 1) {
    const origIndex = pendingIndices[k];
    result[origIndex] = flatResults[k];
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
 * filling in their target-locale siblings. The sibling key is
 * `${field}${targetSuffix}` (e.g. `titleEn`, `titleJa`); `targetSuffix`
 * defaults to the capitalized target lang from `direction`. Skips
 * records that already have a non-empty sibling. Returns mutated copies
 * (originals untouched).
 *
 * Example:
 *   await translateRecords(policies, ['title', 'description'], { direction: 'zh→en', cacheDir: ... });
 *   await translateRecords(policies, ['title', 'description'], { direction: 'zh→ja', cacheDir: ... });
 */
export async function translateRecords<T extends Record<string, unknown>>(
  records: T[],
  fields: string[],
  options: TranslateOptions
): Promise<T[]> {
  const targetSuffix = options.targetSuffix ?? defaultTargetSuffix(options.direction);
  if (!targetSuffix) {
    throw new Error(
      `translateRecords: refusing to write to bare-key default locale ` +
        `(direction=${options.direction}). Pass an explicit targetSuffix or ` +
        `use a non-zh target.`
    );
  }
  const updates: { recordIndex: number; field: string; source: string }[] = [];

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    for (const field of fields) {
      const targetField = `${field}${targetSuffix}`;
      const sourceVal = record[field];
      const targetVal = record[targetField];
      if (typeof sourceVal !== 'string' || !sourceVal) continue;
      if (typeof targetVal === 'string' && targetVal) continue;
      updates.push({ recordIndex: i, field, source: sourceVal });
    }
  }

  if (updates.length === 0) return records.map((r) => ({ ...r }));

  const sources = updates.map((u) => u.source);
  const translated = await translateBatch(sources, options);

  const out = records.map((r) => ({ ...r }));
  for (let k = 0; k < updates.length; k += 1) {
    const { recordIndex, field } = updates[k];
    (out[recordIndex] as Record<string, unknown>)[`${field}${targetSuffix}`] = translated[k];
  }
  return out;
}
