// scripts/i18n/backfill-ko-arrays.ts
// ────────────────────────────────────────────────────────────────────────
// Companion to backfill-ko.ts: handles ARRAY-valued fields (keyPoints,
// bullets, highlights, strengths, weaknesses, etc.) that the string-only
// backfill skips.
//
// The string backfill relies on findUnpairedFields which only flags
// single-line string mismatches. Array fields span multiple lines and
// need different detection + insertion logic.
//
// USAGE
//   npx tsx scripts/i18n/backfill-ko-arrays.ts --all
//   npx tsx scripts/i18n/backfill-ko-arrays.ts --file=src/data/debates.ts
//   npx tsx scripts/i18n/backfill-ko-arrays.ts --all --dry-run
//   npx tsx scripts/i18n/backfill-ko-arrays.ts --all --limit=10
//
// Also adds *Ja arrays when missing (same gap — arrays were skipped for
// both locales).

import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { translateBatch } from '../lib/translate.ts';
import { tsParseDiagnostics } from './backfill-ko.ts';

const ARRAY_FIELDS = [
  'bullets',
  'focusAreas',
  'highlights',
  'keyDebates',
  'keyInitiatives',
  'keyPoints',
  'paragraphs',
  'sources',
  'strengths',
  'tldr',
  'weaknesses',
];

const ALL_DATA_FILES = [
  'src/data/benchmarking.ts',
  'src/data/debate-transcripts.ts',
  'src/data/debates.ts',
  'src/data/ecosystem.ts',
  'src/data/levers.ts',
  'src/data/tracker.ts',
  'src/data/people.ts',
  'src/data/speech-transcripts.ts',
  'src/data/video-transcripts.ts',
  'src/data/videos.ts',
  'src/data/talent.ts',
  'src/data/policies.ts',
  'src/data/startups.ts',
  'src/data/legal-ai.ts',
  'src/data/timeline.ts',
];

const ZH_TO_KO_SYSTEM_PROMPT = [
  'You are a professional translator for the Korean version of a Singapore AI policy-analysis website (sgai).',
  'Translate the input from Simplified Chinese into clear, faithful Korean using the polite-but-professional 합쇼체 register.',
  'Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original Latin form.',
  'Render the country name as 싱가포르.',
  'Use established Korean AI-policy terminology where it exists; otherwise transliterate (한글) or keep the original term.',
  '',
  'GLOSSARY — when the input contains the source term on the left, the translation MUST use the Korean term on the right verbatim:',
  '  新加坡 → 싱가포르',
  '  AI 抓手 → AI 레버',
  '  抓手 → 레버',
  '  国会辩论 → 국회 토론',
  '  国会 → 국회',
  '  对标 → 벤치마크',
  '  仪表盘 → 대시보드',
  '  创业生态 → 스타트업 생태계',
  '  人才培养 → 인재 양성',
  '',
  'Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}.',
  'The output array must have exactly the same number of items as the input array.',
  '',
  'QUOTATION MARK RULES:',
  '1. If the SOURCE text contains quotation marks (ASCII " or Chinese " "), CONVERT them to Korean 「 」.',
  '2. If the SOURCE text has NO quotation marks, the OUTPUT must also have NO quotation marks.',
  '3. The translated paragraph must NEVER contain ASCII straight quotes (") — they would break JSON parsing. Use 「 」 or curly quotes.',
  '',
  'When the input contains a {placeholder} like {count}, leave it VERBATIM.',
].join('\n');

const ZH_TO_JA_SYSTEM_PROMPT = [
  'You are a professional translator for the Japanese version of a Singapore AI policy-analysis website (sgai).',
  'Translate the input from Simplified Chinese into clear, faithful Japanese using the です・ます register.',
  'Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original Latin form.',
  'Render the country name as シンガポール.',
  '',
  'GLOSSARY:',
  '  新加坡 → シンガポール',
  '  AI 抓手 → AI レバー',
  '  抓手 → レバー',
  '  国会辩论 → 議会討論',
  '  国会 → 議会',
  '  对标 → ベンチマーク',
  '  仪表盘 → ダッシュボード',
  '',
  'Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}.',
  'The output array must have exactly the same number of items as the input array.',
  '',
  'QUOTATION MARK RULES:',
  '1. If the SOURCE text contains quotation marks, CONVERT them to 「 」.',
  '2. If the SOURCE text has NO quotation marks, the OUTPUT must also have NO quotation marks.',
  '3. Never output ASCII straight quotes (").',
  '',
  'When the input contains a {placeholder} like {count}, leave it VERBATIM.',
].join('\n');

function escapeSingleQuoted(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function extractArrayItems(lines: string[], startLine: number): { items: string[]; endLine: number } {
  const items: string[] = [];
  let i = startLine;
  const firstLine = lines[i].trim();

  if (!firstLine.includes('[')) return { items: [], endLine: startLine };

  const inlineMatch = firstLine.match(/\[([^\]]*)\]/);
  if (inlineMatch) {
    const inner = inlineMatch[1];
    for (const m of inner.matchAll(/'([^']*)'/g)) {
      items.push(m[1]);
    }
    return { items, endLine: i };
  }

  i += 1;
  let multiLineBuffer = '';
  let inMultiLine = false;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === '],' || line === ']') {
      return { items, endLine: i };
    }

    if (inMultiLine) {
      if (line.endsWith('`,') || line.endsWith('`')) {
        const closing = line.replace(/`[,]?$/, '');
        multiLineBuffer += '\n' + closing;
        items.push(multiLineBuffer);
        multiLineBuffer = '';
        inMultiLine = false;
      } else {
        multiLineBuffer += '\n' + line;
      }
      i += 1;
      continue;
    }

    const singleQuote = line.match(/^'(.*)',?$/);
    if (singleQuote) {
      items.push(singleQuote[1]);
      i += 1;
      continue;
    }

    const singleBacktick = line.match(/^`(.*)`[,]?$/);
    if (singleBacktick) {
      items.push(singleBacktick[1]);
      i += 1;
      continue;
    }

    if (line.startsWith('`')) {
      multiLineBuffer = line.slice(1);
      inMultiLine = true;
      i += 1;
      continue;
    }

    i += 1;
  }
  return { items, endLine: i };
}

function findLineOfField(lines: string[], fieldName: string, recordStart: number, recordEnd: number): number {
  for (let i = recordStart; i < recordEnd; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith(`${fieldName}:`)) return i;
  }
  return -1;
}

function findRecordBoundaries(lines: string[]): { start: number; end: number }[] {
  const records: { start: number; end: number }[] = [];

  let dataStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*export\s+(const|let)\s+\w+.*=\s*[\[{]/.test(lines[i])) {
      if (dataStart < 0) {
        dataStart = i;
      }
    }
  }

  let recordStart = -1;
  let depth = 0;

  const startScan = dataStart >= 0 ? dataStart : 0;
  for (let i = startScan; i < lines.length; i++) {
    const trimmed = lines[i].trimEnd();

    if (depth === 0 && /^\s{1,6}\{/.test(lines[i]) && !trimmed.includes('}')) {
      recordStart = i;
      depth = 1;
      continue;
    }

    // Handle Record<string, T> keyed entries like: 'key-name': { or key: {
    if (depth === 0 && /^\s{1,6}(?:'[^']+'|\w+)\s*:\s*\{/.test(lines[i]) && !trimmed.endsWith('},')) {
      recordStart = i;
      depth = 1;
      continue;
    }

    if (depth > 0) {
      for (const ch of lines[i]) {
        if (ch === '{') depth += 1;
        if (ch === '}') depth -= 1;
      }
      if (depth <= 0) {
        if (recordStart >= 0) {
          records.push({ start: recordStart, end: i });
        }
        recordStart = -1;
        depth = 0;
      }
    }
  }
  return records;
}

interface InsertionTask {
  field: string;
  locale: 'ko' | 'ja';
  zhItems: string[];
  insertAfterLine: number;
  indent: string;
}

async function backfillFile(
  filePath: string,
  opts: { dryRun: boolean; limit?: number; force?: boolean }
): Promise<{ file: string; found: number; translated: number; inserted: number }> {
  const abs = resolve(filePath);
  process.stderr.write(`\n[backfill-ko-arrays] ${filePath}\n`);

  const content = readFileSync(abs, 'utf-8');
  const lines = content.split('\n');
  const records = findRecordBoundaries(lines);

  const tasks: InsertionTask[] = [];

  for (const rec of records) {
    for (const field of ARRAY_FIELDS) {
      const zhLine = findLineOfField(lines, field, rec.start, rec.end);
      if (zhLine < 0) continue;

      const zh = extractArrayItems(lines, zhLine);
      if (zh.items.length === 0) continue;
      const hasCjk = zh.items.some((item) => /[一-鿿]/.test(item));
      if (!hasCjk) continue;

      const enLine = findLineOfField(lines, `${field}En`, rec.start, rec.end);
      if (enLine < 0) continue;
      const enArr = extractArrayItems(lines, enLine);

      const jaLine = findLineOfField(lines, `${field}Ja`, rec.start, rec.end);
      const koLine = findLineOfField(lines, `${field}Ko`, rec.start, rec.end);

      const indent = lines[zhLine].match(/^(\s*)/)?.[1] ?? '    ';

      if (jaLine < 0) {
        const insertAfter = enArr.endLine;
        tasks.push({ field, locale: 'ja', zhItems: zh.items, insertAfterLine: insertAfter, indent });
      }

      if (koLine < 0) {
        if (jaLine >= 0) {
          const jaArr = extractArrayItems(lines, jaLine);
          tasks.push({ field, locale: 'ko', zhItems: zh.items, insertAfterLine: jaArr.endLine, indent });
        } else {
          tasks.push({ field, locale: 'ko', zhItems: zh.items, insertAfterLine: enArr.endLine, indent });
        }
      }
    }
  }

  const koTasks = tasks.filter((t) => t.locale === 'ko');
  const jaTasks = tasks.filter((t) => t.locale === 'ja');
  const totalFound = koTasks.length + jaTasks.length;
  process.stderr.write(`  found ${koTasks.length} Ko + ${jaTasks.length} Ja array gaps\n`);

  if (totalFound === 0) {
    return { file: filePath, found: 0, translated: 0, inserted: 0 };
  }

  const limitedKo = opts.limit !== undefined ? koTasks.slice(0, opts.limit) : koTasks;
  const limitedJa = opts.limit !== undefined ? jaTasks.slice(0, opts.limit) : jaTasks;
  if (limitedKo.length < koTasks.length || limitedJa.length < jaTasks.length) {
    process.stderr.write(`  --limit=${opts.limit}: processing first ${limitedKo.length} Ko + ${limitedJa.length} Ja only\n`);
  }

  const allKoItems = limitedKo.flatMap((t) => t.zhItems);
  const allJaItems = limitedJa.flatMap((t) => t.zhItems);

  process.stderr.write(`  translating ${allKoItems.length} Ko items + ${allJaItems.length} Ja items...\n`);

  const [koTranslated, jaTranslated] = await Promise.all([
    allKoItems.length > 0
      ? translateBatch(allKoItems, {
          direction: 'zh→ko',
          cacheDir: resolve('scripts/i18n/data/ko-cache'),
          systemPrompt: ZH_TO_KO_SYSTEM_PROMPT,
          concurrency: Number(process.env.SGAI_TRANSLATION_CONCURRENCY || 2),
          force: opts.force,
        })
      : [],
    allJaItems.length > 0
      ? translateBatch(allJaItems, {
          direction: 'zh→ja',
          cacheDir: resolve('scripts/i18n/data/ja-cache'),
          systemPrompt: ZH_TO_JA_SYSTEM_PROMPT,
          concurrency: Number(process.env.SGAI_TRANSLATION_CONCURRENCY || 2),
          force: opts.force,
        })
      : [],
  ]);

  if (opts.dryRun) {
    process.stderr.write(`  --dry-run: skipping write. Sample translations:\n`);
    for (let k = 0; k < Math.min(3, allKoItems.length); k++) {
      process.stderr.write(`    zh: ${allKoItems[k].slice(0, 60)}\n`);
      process.stderr.write(`    ko: ${koTranslated[k]?.slice(0, 60)}\n\n`);
    }
    return { file: filePath, found: totalFound, translated: koTranslated.length + jaTranslated.length, inserted: 0 };
  }

  type Insertion = { afterLine: number; newLines: string[] };
  const insertions: Insertion[] = [];

  let koIdx = 0;
  for (const task of limitedKo) {
    const translated = koTranslated.slice(koIdx, koIdx + task.zhItems.length);
    koIdx += task.zhItems.length;
    const newLines = formatArrayField(`${task.field}Ko`, translated, task.indent);
    insertions.push({ afterLine: task.insertAfterLine, newLines });
  }

  let jaIdx = 0;
  for (const task of limitedJa) {
    const translated = jaTranslated.slice(jaIdx, jaIdx + task.zhItems.length);
    jaIdx += task.zhItems.length;
    const newLines = formatArrayField(`${task.field}Ja`, translated, task.indent);
    insertions.push({ afterLine: task.insertAfterLine, newLines });
  }

  insertions.sort((a, b) => b.afterLine - a.afterLine);

  const result = [...lines];
  for (const ins of insertions) {
    result.splice(ins.afterLine + 1, 0, ...ins.newLines);
  }

  const proposed = result.join('\n');

  const diags = tsParseDiagnostics(filePath, proposed);
  if (diags.length > 0) {
    process.stderr.write(`  ABORT: proposed edit has syntax errors:\n`);
    for (const d of diags.slice(0, 5)) process.stderr.write(`    ${d}\n`);
    process.stderr.write(`  (original file preserved)\n`);
    return { file: filePath, found: totalFound, translated: koTranslated.length + jaTranslated.length, inserted: 0 };
  }

  writeFileSync(abs, proposed);
  const totalInserted = insertions.length;
  process.stderr.write(`  wrote ${totalInserted} new array field(s)\n`);

  return { file: filePath, found: totalFound, translated: koTranslated.length + jaTranslated.length, inserted: totalInserted };
}

function escapeBacktick(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function formatArrayField(fieldName: string, items: string[], indent: string): string[] {
  if (items.length === 0) return [];
  const lines: string[] = [];
  lines.push(`${indent}${fieldName}: [`);
  for (const item of items) {
    if (item.includes("'") || item.includes('\n') || item.length > 120) {
      lines.push(`${indent}  \`${escapeBacktick(item)}\`,`);
    } else {
      lines.push(`${indent}  '${escapeSingleQuoted(item)}',`);
    }
  }
  lines.push(`${indent}],`);
  return lines;
}

interface Args {
  files: string[];
  limit?: number;
  dryRun: boolean;
  force: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { files: [], limit: undefined, dryRun: false, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') {
      args.files = [...ALL_DATA_FILES];
    } else if (a.startsWith('--file=')) {
      args.files.push(a.slice('--file='.length));
    } else if (a === '--file') {
      args.files.push(argv[++i]);
    } else if (a.startsWith('--limit=')) {
      args.limit = Number(a.slice('--limit='.length));
    } else if (a === '--dry-run') {
      args.dryRun = true;
    } else if (a === '--force') {
      args.force = true;
    } else if (a === '-h' || a === '--help') {
      process.stdout.write(
        'Usage: backfill-ko-arrays.ts --file=<path> [--limit=N] [--dry-run] [--force]\n' +
          '       backfill-ko-arrays.ts --all [--limit=N] [--dry-run] [--force]\n'
      );
      process.exit(0);
    } else {
      process.stderr.write(`Unknown arg: ${a}\n`);
      process.exit(2);
    }
  }
  if (args.files.length === 0) {
    process.stderr.write('No files specified. Use --file=<path> or --all.\n');
    process.exit(2);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const totals = { found: 0, translated: 0, inserted: 0 };
  for (const file of args.files) {
    const r = await backfillFile(file, { dryRun: args.dryRun, limit: args.limit, force: args.force });
    totals.found += r.found;
    totals.translated += r.translated;
    totals.inserted += r.inserted;
  }
  process.stderr.write(
    `\n[backfill-ko-arrays] DONE — files=${args.files.length} found=${totals.found} translated=${totals.translated} inserted=${totals.inserted}\n`
  );
  if (args.dryRun) {
    process.stderr.write(`[backfill-ko-arrays] (--dry-run: no files modified)\n`);
  } else if (totals.inserted > 0) {
    process.stderr.write(`[backfill-ko-arrays] Run \`npm run fix:prettier\` to normalize formatting.\n`);
  }
}

function isEntryPoint(): boolean {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isEntryPoint()) {
  main().catch((err) => {
    process.stderr.write(
      `[backfill-ko-arrays] ERROR: ${err instanceof Error ? err.stack || err.message : String(err)}\n`
    );
    process.exit(1);
  });
}
