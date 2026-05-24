// scripts/hansard/translate-debate-transcripts-ko.ts
// ────────────────────────────────────────────────────────────────────────
// Translates each debate transcript's `paragraphs` (zh) into `paragraphsKo`
// and writes the result back to src/data/debate-transcripts.ts inplace.
//
// Per-record translate + immediate write: if the process dies, already-
// written records are preserved. sha256 cache also survives restarts.
//
// USAGE:
//   SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/hansard/translate-debate-transcripts-ko.ts
//   SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/hansard/translate-debate-transcripts-ko.ts --ids=oral-answer-4117
//   SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/hansard/translate-debate-transcripts-ko.ts --limit=10

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { debateTranscripts } from '../../src/data/debate-transcripts.ts';
import { translateBatch } from '../lib/translate.ts';
import { ensureClaudeAvailable } from '../lib/llm.ts';

const OUT_FILE = resolve('src/data/debate-transcripts.ts');
const CACHE_DIR = resolve('scripts/hansard/data/translate-cache-ko');
mkdirSync(CACHE_DIR, { recursive: true });

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
const idsArg = process.argv.find((a) => a.startsWith('--ids='));
const requestedIds = idsArg ? new Set(idsArg.split('=')[1].split(',').map((id) => id.trim())) : undefined;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatParagraphsKo(paragraphs: string[], indent: string): string {
  const inner = paragraphs.map((p) => `${indent}  ${JSON.stringify(p)},`).join('\n');
  return `${indent}paragraphsKo: [\n${inner}\n${indent}],`;
}

function injectParagraphsKo(source: string, debateId: string, paragraphsKo: string[]): string {
  const recordHeaderRe = new RegExp(`(\\n\\s{2}'${escapeRegex(debateId)}':\\s*\\{)`);
  const headerMatch = recordHeaderRe.exec(source);
  if (!headerMatch) {
    throw new Error(`Could not locate record header for ${debateId} in ${OUT_FILE}`);
  }
  const openIdx = headerMatch.index + headerMatch[0].length - 1;
  let depth = 1;
  let cursor = openIdx + 1;
  let inStr: string | null = null;
  while (cursor < source.length && depth > 0) {
    const ch = source[cursor];
    const prev = source[cursor - 1];
    if (inStr) {
      if (ch === inStr && prev !== '\\') inStr = null;
    } else {
      if (ch === '"' || ch === "'") inStr = ch;
      else if (ch === '`') inStr = '`';
      else if (ch === '{') depth += 1;
      else if (ch === '}') depth -= 1;
    }
    cursor += 1;
  }
  const closeIdx = cursor - 1;
  const recordBody = source.slice(openIdx, closeIdx + 1);

  const indent = '    ';
  const formatted = formatParagraphsKo(paragraphsKo, indent);

  const existingKoRe = /(\n\s{4}paragraphsKo:\s*\[[\s\S]*?\n\s{4}\],)/;
  if (existingKoRe.test(recordBody)) {
    const replacedBody = recordBody.replace(existingKoRe, () => `\n${formatted}`);
    return source.slice(0, openIdx) + replacedBody + source.slice(closeIdx + 1);
  }

  const enRe = /(\n\s{4}paragraphsEn:\s*\[[\s\S]*?\n\s{4}\],)/;
  const zhRe = /(\n\s{4}paragraphs:\s*\[[\s\S]*?\n\s{4}\],)/;
  let injected: string;
  if (enRe.test(recordBody)) {
    injected = recordBody.replace(enRe, (m) => `${m}\n${formatted}`);
  } else if (zhRe.test(recordBody)) {
    injected = recordBody.replace(zhRe, (m) => `${m}\n${formatted}`);
  } else {
    throw new Error(`No paragraphs block found in record ${debateId}`);
  }
  return source.slice(0, openIdx) + injected + source.slice(closeIdx + 1);
}

async function main() {
  ensureClaudeAvailable();

  const ids = Object.keys(debateTranscripts);
  const filtered = ids.filter((id) => !requestedIds || requestedIds.has(id));
  const selected = limit ? filtered.slice(0, limit) : filtered;

  process.stdout.write(`Translating ${selected.length}/${ids.length} debate transcripts to ko ...\n`);

  let source = readFileSync(OUT_FILE, 'utf8');
  let translatedCount = 0;
  let skippedCount = 0;

  for (const id of selected) {
    const record = debateTranscripts[id];
    if (!record.paragraphs || record.paragraphs.length === 0) {
      process.stdout.write(`  - ${id}: no zh paragraphs, skip\n`);
      skippedCount += 1;
      continue;
    }

    const recordRe = new RegExp(`'${escapeRegex(id)}':\\s*\\{[^]*?\\n  \\}`);
    const recordMatch = recordRe.exec(source);
    const alreadyDone =
      !force && recordMatch != null && /paragraphsKo:\s*\[/.test(recordMatch[0]);
    if (alreadyDone) {
      process.stdout.write(`  ✓ ${id}: paragraphsKo already present\n`);
      skippedCount += 1;
      continue;
    }

    process.stdout.write(`  → ${id}: zh→ko (${record.paragraphs.length} paras) ...\n`);
    try {
      const paragraphsKo = await translateBatch(record.paragraphs, {
        direction: 'zh→ko',
        cacheDir: CACHE_DIR,
        force,
      });

      if (paragraphsKo.length !== record.paragraphs.length) {
        process.stdout.write(
          `    ✗ ${id}: count mismatch (got ${paragraphsKo.length}, expected ${record.paragraphs.length}), skip\n`
        );
        skippedCount += 1;
        continue;
      }

      const truncated = paragraphsKo.findIndex(
        (ko, i) => ko.length < record.paragraphs[i].length * 0.25
      );
      if (truncated !== -1) {
        process.stdout.write(
          `    ✗ ${id}: para[${truncated}] suspiciously short (ko ${paragraphsKo[truncated].length} vs zh ${record.paragraphs[truncated].length}), skip\n`
        );
        skippedCount += 1;
        continue;
      }

      source = injectParagraphsKo(source, id, paragraphsKo);
      writeFileSync(OUT_FILE, source);
      translatedCount += 1;
      process.stdout.write(`    ✓ ${id}: injected ${paragraphsKo.length} paras\n`);
    } catch (err) {
      process.stdout.write(`    ✗ ${id}: ${(err as Error).message}\n`);
      skippedCount += 1;
    }
  }

  process.stdout.write(
    `\nDone. translated=${translatedCount}, skipped=${skippedCount}, total=${selected.length}\n`
  );
}

await main();
