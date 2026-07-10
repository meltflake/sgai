// scripts/hansard/translate-speech-transcripts.ts
// ────────────────────────────────────────────────────────────────────────
// Backfills paragraphsJa/paragraphsKo (and tldrJa/tldrKo) for MDDI speech
// transcripts that predate ja/ko in the voices refresh pipeline.
//
// Per-record translate + immediate write: if the process dies, already-
// written records survive; sha256 cache survives restarts.
//
// Injection uses JSON.stringify (double-quoted) strings and lets Prettier
// normalise quotes/indent afterwards — this sidesteps both the backtick
// `${` interpolation hazard and the `$1` backreference hazard (all
// .replace() replacements are arrow functions, never `$1` strings).
//
// USAGE:
//   SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/hansard/translate-speech-transcripts.ts
//   SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/hansard/translate-speech-transcripts.ts --ids=<id>
//   SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/hansard/translate-speech-transcripts.ts --limit=5

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { speechTranscripts } from '../../src/data/speech-transcripts.ts';
import { translateBatch } from '../lib/translate.ts';
import { ensureClaudeAvailable } from '../lib/llm.ts';

const OUT_FILE = resolve('src/data/speech-transcripts.ts');
const JA_CACHE = resolve('scripts/i18n/data/ja-cache');
const KO_CACHE = resolve('scripts/i18n/data/ko-cache');
mkdirSync(JA_CACHE, { recursive: true });
mkdirSync(KO_CACHE, { recursive: true });

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
const idsArg = process.argv.find((a) => a.startsWith('--ids='));
const requestedIds = idsArg ? new Set(idsArg.split('=')[1].split(',').map((id) => id.trim())) : undefined;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatArray(field: string, items: string[]): string {
  const inner = items.map((p) => `      ${JSON.stringify(p)},`).join('\n');
  return `    ${field}: [\n${inner}\n    ],`;
}

/** Locate the brace-balanced body of one record, string-aware. */
function recordBounds(source: string, speechId: string): { open: number; close: number } {
  const headerRe = new RegExp(`(\\n\\s{2}'${escapeRegex(speechId)}':\\s*\\{)`);
  const m = headerRe.exec(source);
  if (!m) throw new Error(`Could not locate record header for ${speechId}`);
  const open = m.index + m[0].length - 1;
  let depth = 1;
  let cursor = open + 1;
  let inStr: string | null = null;
  while (cursor < source.length && depth > 0) {
    const ch = source[cursor];
    const prev = source[cursor - 1];
    if (inStr) {
      if (ch === inStr && prev !== '\\') inStr = null;
    } else if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
    else if (ch === '{') depth += 1;
    else if (ch === '}') depth -= 1;
    cursor += 1;
  }
  return { open, close: cursor - 1 };
}

/** Insert `block` immediately after the anchor field's array in a record body. */
function insertAfterField(body: string, anchorFields: string[], block: string): string {
  for (const field of anchorFields) {
    const re = new RegExp(`(\\n\\s+${field}:\\s*\\[[\\s\\S]*?\\n\\s+\\],)`);
    if (re.test(body)) return body.replace(re, (m) => `${m}\n${block}`);
  }
  return body; // anchor absent (e.g. no tldr) — skip silently
}

async function main() {
  ensureClaudeAvailable();

  const ids = Object.keys(speechTranscripts);
  const selected = ids
    .filter((id) => !requestedIds || requestedIds.has(id))
    .filter((id) => {
      if (force) return true;
      const r = speechTranscripts[id] as { paragraphsJa?: string[]; paragraphsKo?: string[] };
      return !r.paragraphsJa?.length || !r.paragraphsKo?.length;
    })
    .slice(0, limit ?? undefined);

  process.stdout.write(`Backfilling ja/ko for ${selected.length}/${ids.length} speech transcripts ...\n`);

  let source = readFileSync(OUT_FILE, 'utf8');
  let done = 0;
  let skipped = 0;

  for (const id of selected) {
    const record = speechTranscripts[id];
    if (!record.paragraphs?.length) {
      process.stdout.write(`  - ${id}: no zh paragraphs, skip\n`);
      skipped += 1;
      continue;
    }
    process.stdout.write(`  → ${id}: zh→ja/ko (${record.paragraphs.length} paras) ...\n`);
    try {
      const [ja, ko] = await Promise.all([
        translateBatch(record.paragraphs, { direction: 'zh→ja', cacheDir: JA_CACHE, force }),
        translateBatch(record.paragraphs, { direction: 'zh→ko', cacheDir: KO_CACHE, force }),
      ]);
      if (ja.length !== record.paragraphs.length || ko.length !== record.paragraphs.length) {
        process.stdout.write(`    ✗ ${id}: paragraph count mismatch (ja ${ja.length}, ko ${ko.length}), skip\n`);
        skipped += 1;
        continue;
      }

      const tldr = record.tldr ?? [];
      let tldrJa: string[] = [];
      let tldrKo: string[] = [];
      if (tldr.length) {
        [tldrJa, tldrKo] = await Promise.all([
          translateBatch(tldr, { direction: 'zh→ja', cacheDir: JA_CACHE, force }),
          translateBatch(tldr, { direction: 'zh→ko', cacheDir: KO_CACHE, force }),
        ]);
        if (tldrJa.length !== tldr.length) tldrJa = [];
        if (tldrKo.length !== tldr.length) tldrKo = [];
      }

      const { open, close } = recordBounds(source, id);
      let body = source.slice(open, close + 1);
      // Remove any partial existing ja/ko so re-runs stay idempotent.
      body = body.replace(/\n\s+paragraphsJa:\s*\[[\s\S]*?\n\s+\],/, '');
      body = body.replace(/\n\s+paragraphsKo:\s*\[[\s\S]*?\n\s+\],/, '');
      body = body.replace(/\n\s+tldrJa:\s*\[[\s\S]*?\n\s+\],/, '');
      body = body.replace(/\n\s+tldrKo:\s*\[[\s\S]*?\n\s+\],/, '');

      // Order matters: insert Ko first, then Ja before it, so Ja ends up above Ko.
      body = insertAfterField(body, ['paragraphsEn'], formatArray('paragraphsKo', ko));
      body = insertAfterField(body, ['paragraphsEn'], formatArray('paragraphsJa', ja));
      if (tldrKo.length) body = insertAfterField(body, ['tldrEn', 'tldr'], formatArray('tldrKo', tldrKo));
      if (tldrJa.length) body = insertAfterField(body, ['tldrEn', 'tldr'], formatArray('tldrJa', tldrJa));

      source = source.slice(0, open) + body + source.slice(close + 1);
      writeFileSync(OUT_FILE, source);
      done += 1;
      process.stdout.write(`    ✓ ${id}: ja ${ja.length} / ko ${ko.length}${tldr.length ? ` + tldr` : ''}\n`);
    } catch (err) {
      process.stdout.write(`    ✗ ${id}: ${(err as Error).message}\n`);
      skipped += 1;
    }
  }

  process.stdout.write(`\nDone. backfilled=${done}, skipped=${skipped}, total=${selected.length}\n`);
}

await main();
