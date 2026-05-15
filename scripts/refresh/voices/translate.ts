// scripts/refresh/voices/translate.ts
// ────────────────────────────────────────────────────────────────────────
// For each fetched MDDI speech: translate paragraphs to zh and produce a
// 4-7 bullet bilingual tldr (zh + en).
//
// Boundary with hand-curated translations:
//   - If scripts/voices/data/translations/<id>.json already exists (humans
//     wrote it, or Task A's NANA work), we preserve it. New fields we
//     produce here are merged in WITHOUT overwriting existing keys.
//   - When `force: true` is passed, we re-run translation but still
//     preserve human-authored markers (translationSource === 'manual').
//
// Output schema (scripts/voices/data/translations/<id>.json):
//   {
//     "speechId": "...",
//     "paragraphs": ["...zh..."],
//     "tldr": ["...zh bullet 1...", "..."],
//     "tldrEn": ["...en bullet 1...", "..."],
//     "translatedAt": "YYYY-MM-DD",
//     "translationSource": "claude" | "manual",
//     "translationModel": "haiku"
//   }

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { callLlmJson } from '../../lib/llm.ts';
import { translateBatch } from '../../lib/translate.ts';
import type { FetchedSpeech } from './fetch.ts';

export interface TranslatedSpeech {
  speechId: string;
  paragraphs: string[];
  paragraphsEn: string[];
  tldr: string[];
  tldrEn: string[];
  translatedAt: string;
  translationSource: 'claude' | 'manual';
  translationModel?: string;
}

export interface TranslateResult {
  translated: TranslatedSpeech[];
  failures: Array<{ speechId: string; error: string }>;
}

/** Hand-curated translations live here (Task A's NANA work, manual
 *  backfills). The TS pipeline's emit reads this dir as ground truth. */
export const TRANSLATIONS_DIR_LEGACY = resolve('scripts/voices/data/translations');
/** Auto-pipeline writes here. emit.ts reads both dirs (legacy first wins
 *  per spec: "preserve hand-curated existing ones, including A's NANA work"). */
export const TRANSLATIONS_DIR_NEW = resolve('scripts/refresh/voices/data/translations');

const ZH_PARAGRAPH_CACHE = resolve('scripts/i18n/data/zh-cache');

interface TldrModelOutput {
  tldr?: unknown;
  tldrEn?: unknown;
  reasonForLowConfidence?: string;
}

function buildTldrSystemPrompt(): string {
  return [
    'You are a research analyst for sgai.md, a Singapore AI policy observatory.',
    'You read a full speech transcript (English) and produce a structured TL;DR.',
    '',
    'Hard requirements:',
    '1. Output strict JSON. No prose, no markdown.',
    '2. Return EXACTLY this schema: { "tldr": string[], "tldrEn": string[] }.',
    '3. Both arrays must have the same length, between 4 and 7 items.',
    '4. tldrEn[i] and tldr[i] cover the SAME bullet point (en + zh of the same idea).',
    '5. Each bullet is one full sentence summarising a substantive policy / program / number.',
    '6. Faithful only. Do not invent figures, dates, names not in the source.',
    '7. Bullet style: declarative, no first-person, no exhortation, no marketing fluff.',
    '8. CRITICAL: inside the translated zh bullet TEXT, use FULL-WIDTH Chinese quotes (“ ” or 「 」) — NEVER ASCII straight quotes ("); inside the en bullet TEXT, use curly quotes (“ ”) — NEVER ASCII straight quotes ("). ASCII straight quotes inside the string would break JSON parsing. The only allowed straight quotes are the JSON syntax quotes that delimit each string.',
  ].join('\n');
}

async function summarizeTldr(
  fetched: FetchedSpeech,
  model: string
): Promise<{ tldr: string[]; tldrEn: string[] }> {
  // Cap input length to keep claude haiku happy on long speeches.
  const body = fetched.paragraphs.slice(0, 60).join('\n\n');
  const userPrompt =
    `Speech metadata: ${JSON.stringify({
      sourceUrl: fetched.sourceUrl,
      title: fetched.title,
      publishedDate: fetched.publishedDate,
    })}\n\n` +
    'Speech full text follows. Produce the bilingual TL;DR per the system prompt schema.\n\n' +
    body.slice(0, 16000);

  const out = await callLlmJson<TldrModelOutput>(userPrompt, {
    systemPrompt: buildTldrSystemPrompt(),
    model,
  });
  if (!Array.isArray(out.tldr) || !out.tldr.every((x) => typeof x === 'string')) {
    throw new Error(`tldr field malformed: ${JSON.stringify(out).slice(0, 200)}`);
  }
  if (!Array.isArray(out.tldrEn) || !out.tldrEn.every((x) => typeof x === 'string')) {
    throw new Error(`tldrEn field malformed: ${JSON.stringify(out).slice(0, 200)}`);
  }
  if (out.tldr.length !== out.tldrEn.length) {
    throw new Error(
      `tldr length mismatch: zh=${out.tldr.length} en=${out.tldrEn.length}`
    );
  }
  return { tldr: out.tldr as string[], tldrEn: out.tldrEn as string[] };
}

function readExistingTranslation(speechId: string): TranslatedSpeech | null {
  for (const dir of [TRANSLATIONS_DIR_LEGACY, TRANSLATIONS_DIR_NEW]) {
    const path = `${dir}/${speechId}.json`;
    if (!existsSync(path)) continue;
    try {
      const raw = JSON.parse(readFileSync(path, 'utf8')) as Partial<TranslatedSpeech>;
      if (!raw || typeof raw !== 'object') continue;
      const paragraphs = Array.isArray(raw.paragraphs) ? (raw.paragraphs as string[]) : [];
      const paragraphsEn = Array.isArray(raw.paragraphsEn)
        ? (raw.paragraphsEn as string[])
        : [];
      const tldr = Array.isArray(raw.tldr) ? (raw.tldr as string[]) : [];
      const tldrEn = Array.isArray(raw.tldrEn) ? (raw.tldrEn as string[]) : [];
      return {
        speechId,
        paragraphs,
        paragraphsEn,
        tldr,
        tldrEn,
        translatedAt: raw.translatedAt || new Date().toISOString().slice(0, 10),
        translationSource:
          raw.translationSource === 'manual' ? 'manual' : (raw.translationSource ?? 'claude'),
        translationModel: raw.translationModel,
      };
    } catch {
      /* skip malformed */
    }
  }
  return null;
}

function writeTranslation(speechId: string, payload: TranslatedSpeech): void {
  mkdirSync(TRANSLATIONS_DIR_NEW, { recursive: true });
  writeFileSync(
    `${TRANSLATIONS_DIR_NEW}/${speechId}.json`,
    `${JSON.stringify(payload, null, 2)}\n`
  );
}

export interface TranslateOptions {
  /** Override claude model alias. Defaults to env / haiku. */
  model?: string;
  /** Skip the tldr LLM call (useful for dry-run smoke tests). */
  skipTldr?: boolean;
  /** Re-translate paragraphs even if a cache entry exists. */
  force?: boolean;
}

export async function translateSpeeches(
  fetched: FetchedSpeech[],
  options: TranslateOptions = {}
): Promise<TranslateResult> {
  const model = options.model || process.env.SGAI_TRANSLATION_MODEL || 'haiku';
  const translated: TranslatedSpeech[] = [];
  const failures: TranslateResult['failures'] = [];

  for (const f of fetched) {
    try {
      const existing = readExistingTranslation(f.speechId);
      // Hand-curated translation (manual or claude) with both paragraphs +
      // tldr present → use as-is (refresh-pipeline must not overwrite).
      if (
        existing &&
        existing.translationSource === 'manual' &&
        existing.paragraphs.length > 0
      ) {
        translated.push({
          ...existing,
          paragraphsEn: f.paragraphs,
        });
        continue;
      }
      // If we have full coverage from a prior auto-run, skip — unless forced.
      if (
        !options.force &&
        existing &&
        existing.paragraphs.length === f.paragraphs.length &&
        existing.tldr.length > 0
      ) {
        translated.push({
          ...existing,
          paragraphsEn: f.paragraphs,
        });
        continue;
      }

      const zhParagraphs = await translateBatch(f.paragraphs, {
        direction: 'en→zh',
        model,
        cacheDir: ZH_PARAGRAPH_CACHE,
        force: options.force,
      });

      let tldr: string[] = existing?.tldr ?? [];
      let tldrEn: string[] = existing?.tldrEn ?? [];
      if (!options.skipTldr && (tldr.length === 0 || tldrEn.length === 0 || options.force)) {
        const out = await summarizeTldr(f, model);
        tldr = out.tldr;
        tldrEn = out.tldrEn;
      }

      const payload: TranslatedSpeech = {
        speechId: f.speechId,
        paragraphs: zhParagraphs,
        paragraphsEn: f.paragraphs,
        tldr,
        tldrEn,
        translatedAt: new Date().toISOString().slice(0, 10),
        translationSource: 'claude',
        translationModel: model,
      };
      writeTranslation(f.speechId, payload);
      translated.push(payload);
    } catch (error) {
      failures.push({
        speechId: f.speechId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { translated, failures };
}
