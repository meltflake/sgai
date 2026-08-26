// scripts/lib/why-it-matters-batch.ts
// ────────────────────────────────────────────────────────────────────────
// Draft + translate the four `whyItMatters` siblings for a batch of records
// on ingest. Wraps scripts/lib/why-it-matters.ts (zh draft, one record at a
// time, sha256-cached) and scripts/lib/translate.ts (en / ja / ko, batched,
// sha256-cached) behind one call the refresh emits can make.
//
// Failure policy (CLAUDE.md rule #5): whyItMatters is optional per record,
// but once the zh value is present all four locales are required by
// `check:i18n-completeness`. So this helper is all-or-nothing per record —
// a failed draft or a missing translation drops that record from the result
// map and logs one WARN line. It never throws: a missing judgment must not
// abort an otherwise-good data-refresh PR.
//
// Cache dirs default to the ones scripts/backfill-why-it-matters.ts uses, so
// a record drafted by the backfill and one drafted on ingest share hits.

import { draftWhyItMatters, type WhyInput } from './why-it-matters.ts';
import { translateBatch } from './translate.ts';

/** Same dirs as scripts/backfill-why-it-matters.ts — shared cache. */
export const WHY_DRAFT_CACHE_DIR = 'scripts/data/cache/why-it-matters';
export const WHY_TRANSLATE_CACHE_DIR = 'scripts/data/cache/why-it-matters-translate';

/** The four siblings a record carries, or none at all. */
export interface WhyFields {
  whyItMatters: string;
  whyItMattersEn: string;
  whyItMattersJa: string;
  whyItMattersKo: string;
}

export interface WhyBatchOptions {
  /** Injectable for tests — defaults to the real LLM drafter. */
  draft?: typeof draftWhyItMatters;
  /** Injectable for tests — defaults to the real Claude-CLI translator. */
  translate?: typeof translateBatch;
  draftCacheDir?: string;
  translateCacheDir?: string;
  model?: string;
  timeoutMs?: number;
  /** One line per dropped record. Defaults to stderr. */
  warn?: (message: string) => void;
}

function message(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/**
 * Draft `whyItMatters` (zh) for every input, then translate to en / ja / ko.
 * Returns a map keyed by `input.id` holding ONLY the records that came back
 * complete in all four locales. Never throws.
 */
export async function draftWhyItMattersBatch(
  inputs: WhyInput[],
  options: WhyBatchOptions = {}
): Promise<Map<string, WhyFields>> {
  const out = new Map<string, WhyFields>();
  if (inputs.length === 0) return out;

  const draft = options.draft ?? draftWhyItMatters;
  const translate = options.translate ?? translateBatch;
  const warn = options.warn ?? ((m: string) => process.stderr.write(`${m}\n`));
  const draftCacheDir = options.draftCacheDir ?? WHY_DRAFT_CACHE_DIR;
  const translateCacheDir = options.translateCacheDir ?? WHY_TRANSLATE_CACHE_DIR;
  const timeoutMs = options.timeoutMs ?? Number(process.env.SGAI_LLM_TIMEOUT_MS || 300000);

  // 1) zh drafts — serial, so one bad record cannot poison the rest.
  const drafted: Array<{ id: string; zh: string }> = [];
  for (const input of inputs) {
    try {
      const d = await draft(input, { cacheDir: draftCacheDir, model: options.model, timeoutMs });
      const zh = (d.whyItMatters || '').trim();
      if (!zh) {
        warn(`  ⚠ whyItMatters: empty draft for ${input.kind}/${input.id} — omitting all four fields`);
        continue;
      }
      drafted.push({ id: input.id, zh });
    } catch (e) {
      warn(`  ⚠ whyItMatters: draft failed for ${input.kind}/${input.id}: ${message(e)} — omitting all four fields`);
    }
  }
  if (drafted.length === 0) return out;

  // 2) en / ja / ko in one batch call each (cached by sha256(direction+text)).
  const zhValues = drafted.map((d) => d.zh);
  let enValues: string[];
  let jaValues: string[];
  let koValues: string[];
  try {
    [enValues, jaValues, koValues] = await Promise.all([
      translate(zhValues, { direction: 'zh→en', cacheDir: translateCacheDir }),
      translate(zhValues, { direction: 'zh→ja', cacheDir: translateCacheDir }),
      translate(zhValues, { direction: 'zh→ko', cacheDir: translateCacheDir }),
    ]);
  } catch (e) {
    warn(
      `  ⚠ whyItMatters: translation failed (${message(e)}) — omitting all four fields for ${drafted.length} record(s)`
    );
    return out;
  }

  for (let i = 0; i < drafted.length; i += 1) {
    const fields: WhyFields = {
      whyItMatters: drafted[i].zh,
      whyItMattersEn: (enValues[i] || '').trim(),
      whyItMattersJa: (jaValues[i] || '').trim(),
      whyItMattersKo: (koValues[i] || '').trim(),
    };
    if (!fields.whyItMattersEn || !fields.whyItMattersJa || !fields.whyItMattersKo) {
      warn(`  ⚠ whyItMatters: incomplete translation for ${drafted[i].id} — omitting all four fields`);
      continue;
    }
    out.set(drafted[i].id, fields);
  }
  return out;
}
