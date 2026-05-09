// scripts/i18n/backfill-ja.ts
// ────────────────────────────────────────────────────────────────────────
// Phase 2 backfill: walk a sgai data .ts file, find every zh field that's
// missing a `${field}Ja` sibling, translate the zh value via Claude haiku
// (zh→ja), and splice the new `${field}Ja: '…'` line into the source —
// preserving comments and formatting.
//
// Why source-level codemod:
//   We can't go through TS AST (ts-morph etc.) without losing comments
//   and Prettier wrapping. The data files are very large and follow a
//   strict one-field-per-line convention, so a regex-based source patch
//   is robust enough and stays consistent with the rest of the codebase
//   (see i18n-pair.ts, voices/prospect-stubs.mjs).
//
// USAGE
//   npx tsx scripts/i18n/backfill-ja.ts --file=src/data/policies.ts
//   npx tsx scripts/i18n/backfill-ja.ts --file=src/data/policies.ts --dry-run
//   npx tsx scripts/i18n/backfill-ja.ts --file=src/data/policies.ts --limit=10
//   npx tsx scripts/i18n/backfill-ja.ts --all   # all 13 data files
//
// Caveats:
//   - Inserts the new line immediately after the zh field's VALUE (which
//     may span multiple lines for Prettier-wrapped strings).
//   - Skips fields whose zh value is empty or already has *Ja set.
//   - Skips records annotated with `// i18n-allow-unpaired` on the line
//     above (same convention as i18n-pair.ts).
//   - Re-runs are safe (idempotent): the second pass finds nothing.
//   - sha256 cache means re-runs after editing zh values translate only
//     the diff.

import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as ts from 'typescript';

import { findUnpairedFields, type UnpairedField } from '../lib/i18n-pair.ts';
import { translateBatch } from '../lib/translate.ts';

/** Run the TypeScript parser over `content` and return any syntax-level
 *  diagnostics with line numbers. Used as a post-write sanity check —
 *  if the regex-based insertion produced an unparseable file, abort the
 *  write and keep the original. Cheap (~tens of ms per file) and catches
 *  exactly the kind of bug that previously surfaced 5 minutes later in
 *  astro check, far from the root cause. */
export function tsParseDiagnostics(filePath: string, content: string): string[] {
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, /* setParentNodes */ false);
  // ts.SourceFile carries `parseDiagnostics` as a non-public field that
  // ts.createSourceFile populates synchronously. The TS lib types don't
  // expose it, so cast to access. parseDiagnostics surfaces ONLY the
  // grammar-level errors (unterminated strings, mismatched braces,
  // unexpected tokens) — which is exactly what we want here. Type errors
  // require a full Program and would be massively too expensive.
  const diags = (sf as unknown as { parseDiagnostics?: ts.DiagnosticWithLocation[] }).parseDiagnostics;
  if (!diags || diags.length === 0) return [];
  return diags.map((d) => {
    const pos = d.start !== undefined ? sf.getLineAndCharacterOfPosition(d.start) : { line: 0, character: 0 };
    const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    return `L${pos.line + 1}:${pos.character + 1}: ${msg}`;
  });
}

// All field names that have a `*En` sibling somewhere in src/data/*.ts.
// Discovered via:
//   grep -hE "^\s+[a-zA-Z]+En:" src/data/*.ts | grep -oE "[a-zA-Z]+En:" \
//     | sed 's/En:$//' | sort -u
// Array-valued fields (keyPoints, bullets, paragraphs, ...) are listed
// here too — i18n-pair only flags single-line string mismatches, so the
// arrays simply don't trigger. They need a separate codemod pass.
const TARGET_FIELDS = [
  'acquirer',
  'aiRelevance',
  'amount',
  'analysis',
  'authority',
  'badge',
  'benchmark',
  'body',
  'bottleneckSolved',
  'bullets',
  'caption',
  'category',
  'companyProfile',
  'content',
  'context',
  'current',
  'currentBalance',
  'description',
  'digest',
  'dimension',
  'event',
  'evidence',
  'excerpt',
  'features',
  'focus',
  'focusAreas',
  'fullName',
  'governance',
  'governmentPosition',
  'governmentStance',
  'heading',
  'headline',
  'headquarters',
  'highlight',
  'highlights',
  'insight',
  'investment',
  'issue',
  'item',
  'judgment',
  'keyDebates',
  'keyInitiatives',
  'keyPoints',
  'label',
  'license',
  'methodologyNote',
  'ministry',
  'name',
  'notablePosition',
  'notableQuote',
  'note',
  'oneLiner',
  'oppositionPosition',
  'oppositionStance',
  'org',
  'organization',
  'overview',
  'owner',
  'paragraphs',
  'parentOrg',
  'period',
  'philosophy',
  'points',
  'policySignal',
  'rank',
  'reason',
  'region',
  'role',
  'scale',
  'sector',
  'shortcoming',
  'sideA',
  'sideB',
  'signal',
  'singaporeRelevance',
  'singaporeTakeaway',
  'source',
  'sourceLabel',
  'sourceNote',
  'sources',
  'speakerTitle',
  'stats',
  'status',
  'strategy',
  'strength',
  'strengths',
  'subtitle',
  'summary',
  'tagline',
  'tags',
  'takeaway',
  'target',
  'text',
  'theme',
  'title',
  'tldr',
  'topic',
  'transcript',
  'type',
  'value',
  'weaknesses',
  'whatItIs',
  'whatStateDoes',
  'whyItMatters',
];

const ALL_DATA_FILES = [
  'src/data/benchmarking.ts',
  'src/data/debates.ts',
  'src/data/ecosystem.ts',
  'src/data/levers.ts',
  'src/data/tracker.ts',
  'src/data/people.ts',
  'src/data/videos.ts',
  'src/data/talent.ts',
  'src/data/policies.ts',
  'src/data/startups.ts',
  'src/data/legal-ai.ts',
  'src/data/timeline.ts',
  'src/data/voices.ts',
  'src/data/references.ts',
  'src/data/fieldnotes.ts',
  'src/data/community-opensource.ts',
  'src/data/opensource.ts',
  'src/data/updates.ts',
];

const ZH_TO_JA_SYSTEM_PROMPT = [
  'You are a professional translator for the Japanese version of a Singapore AI policy-analysis website (sgai).',
  'Translate the input from Simplified Chinese into clear, faithful Japanese using the polite-but-professional です・ます register.',
  'Preserve all proper nouns (people, institutions, programmes), numbers, dates, and acronyms (e.g. IMDA, MAS, NRF, AISG, MDDI) in their original Latin form.',
  'Use established Japanese AI-policy terminology where it exists; otherwise transliterate (katakana) or keep the original term.',
  '',
  'GLOSSARY — when the input contains the source term on the left, the translation MUST use the Japanese term on the right verbatim:',
  '  新加坡 AI 观察 → シンガポール AI 観測',
  '  新加坡 → シンガポール',
  '  AI 抓手 → AI レバー',
  '  抓手 → レバー',
  '  国会辩论 → 議会討論',
  '  国会 → 議会',
  '  政策文件 → 政策文書',
  '  生态地图 → エコシステムマップ',
  '  时间线 → タイムライン',
  '  国际对标 → 国際ベンチマーク',
  '  对标 → ベンチマーク',
  '  影响力图谱 → インフルエンスマップ',
  '  仪表盘 → ダッシュボード',
  '  创业生态 → スタートアップエコシステム',
  '  人才培养 → 人材育成',
  '  法律框架 → 法的枠組み',
  '  实战经验 → フィールドノート',
  '',
  'Do not summarize. Do not omit content. Do not add commentary. Return only JSON: {"paragraphs":["..."]}. The output array must have exactly the same number of items as the input array.',
  '',
  'QUOTATION MARK RULES — read carefully:',
  '1. If the SOURCE text contains quotation marks (ASCII " or Chinese “ ”), CONVERT them in the output to Japanese 「 」 (or 『 』 for nested quotes inside other quotes).',
  '2. If the SOURCE text has NO quotation marks, the OUTPUT must also have NO quotation marks. Do NOT wrap the translation in 「 」 just because it looks like a heading or term.',
  '3. The translated paragraph must NEVER contain ASCII straight quotes (") — they would break JSON parsing. Use 「 」 or no quotes at all.',
  '',
  'When the input contains a {placeholder} like {count} or {handle}, leave the curly-braced token VERBATIM in the output — do not translate or modify the placeholder.',
].join('\n');

interface Args {
  files: string[];
  limit?: number;
  dryRun: boolean;
  force: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { files: [], limit: undefined, dryRun: false, force: false };
  let i = 0;
  while (i < argv.length) {
    const a = argv[i];
    if (a === '--all') {
      args.files = [...ALL_DATA_FILES];
    } else if (a.startsWith('--file=')) {
      args.files.push(a.slice('--file='.length));
    } else if (a === '--file') {
      args.files.push(argv[i + 1]);
      i += 1;
    } else if (a.startsWith('--limit=')) {
      args.limit = Number(a.slice('--limit='.length));
    } else if (a === '--dry-run') {
      args.dryRun = true;
    } else if (a === '--force') {
      args.force = true;
    } else if (a === '-h' || a === '--help') {
      process.stdout.write(
        'Usage: backfill-ja.ts --file=<path> [--file=<path>...] [--limit=N] [--dry-run] [--force]\n' +
          '       backfill-ja.ts --all [--limit=N] [--dry-run] [--force]\n' +
          '\n' +
          '--force  bypass translation cache (re-translate even if cache exists).\n'
      );
      process.exit(0);
    } else {
      process.stderr.write(`Unknown arg: ${a}\n`);
      process.exit(2);
    }
    i += 1;
  }
  if (args.files.length === 0) {
    process.stderr.write('No files specified. Use --file=<path> or --all.\n');
    process.exit(2);
  }
  return args;
}

/** Find the line index (0-indexed) AFTER the field's value (single-line
 *  or multi-line literal). Used to anchor the insert position.
 *
 *  Uses the chinese source value's own newline count to compute the
 *  closing line — robust to backtick template literals (which the old
 *  regex-based scan missed) and to multi-line strings whose interior
 *  contains stray quote characters.
 *
 *  Also handles the Prettier-wrap case where a long value declaration
 *  spans two source lines:
 *    summary:
 *      'Long value goes on its own line',
 *  Here the declaration line ends with `:` and the actual value starts
 *  on the next line. */
function lineAfterFieldValue(lines: string[], fieldLineIndex: number, chineseValue: string): number {
  const newlines = (chineseValue.match(/\n/g) || []).length;
  const declLine = lines[fieldLineIndex];
  const valueStartsOnNextLine = /:\s*$/.test(declLine);
  const valueStartLine = valueStartsOnNextLine ? fieldLineIndex + 1 : fieldLineIndex;
  const closingLine = valueStartLine + newlines;

  // Sanity: the computed closing line should actually end with a closing
  // quote (single, double, or backtick) optionally followed by a comma
  // and/or a closing brace/bracket. If not, the source field uses a
  // formatting we don't recognize — skip rather than risk mis-anchored
  // inserts. (Any skipped translation is still in the cache, so a
  // future run with smarter logic picks it up.)
  if (closingLine >= lines.length) return -1;
  const closingText = lines[closingLine];
  if (!/[`'"][\s,}\]]*$/.test(closingText)) {
    process.stderr.write(
      `  WARN: line ${fieldLineIndex + 1} multi-line value does not close as expected ` +
        `(expected close on line ${closingLine + 1}: ${JSON.stringify(closingText.slice(0, 60))}). ` +
        `Skipping multi-line insert.\n`
    );
    return -1;
  }
  return closingLine + 1;
}

/** Escape a string for embedding inside a single-quoted TS string literal. */
function escapeSingleQuoted(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Escape a string for embedding inside a backtick-quoted TS template
 *  literal. Backticks themselves are escaped, and `${` interpolation is
 *  defanged by escaping the leading `$`. (Translated UI strings should
 *  never contain `${...}` in practice — the system prompt explicitly
 *  preserves placeholders verbatim — but we defang anyway as belt and
 *  braces.) */
function escapeBacktickQuoted(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

async function backfillFile(filePath: string, opts: { dryRun: boolean; limit?: number; force?: boolean }): Promise<{
  file: string;
  found: number;
  translated: number;
  inserted: number;
  skipped: number;
}> {
  const abs = resolve(filePath);
  process.stderr.write(`\n[backfill-ja] ${filePath}\n`);

  // Only check 'ja' here — Phase 0/1 already enforced 'en' coverage.
  const allIssues = findUnpairedFields(abs, { fields: TARGET_FIELDS, locales: ['ja'] });
  // Only handle 'missing-sibling'. 'empty-sibling' (where *Ja: '' is
  // explicitly empty) is treated as an intentional placeholder and left
  // alone for the human to fill.
  const issues = allIssues.filter((x) => x.reason === 'missing-sibling');
  process.stderr.write(`  found ${issues.length} unpaired field(s) needing *Ja\n`);
  if (issues.length === 0) {
    return { file: filePath, found: 0, translated: 0, inserted: 0, skipped: 0 };
  }

  const limited = opts.limit !== undefined ? issues.slice(0, opts.limit) : issues;
  if (limited.length < issues.length) {
    process.stderr.write(`  --limit=${opts.limit}: processing first ${limited.length} only\n`);
  }

  // 1) Translate all zh values in batch. translateBatch handles caching.
  const sources = limited.map((x) => x.chineseValue);
  process.stderr.write(`  translating ${sources.length} value(s)...\n`);
  const translated = await translateBatch(sources, {
    direction: 'zh→ja',
    cacheDir: resolve('scripts/i18n/data/ja-cache'),
    systemPrompt: ZH_TO_JA_SYSTEM_PROMPT,
    concurrency: Number(process.env.SGAI_TRANSLATION_CONCURRENCY || 2),
    force: opts.force,
  });
  if (translated.length !== sources.length) {
    throw new Error(
      `[${filePath}] Translation count mismatch: expected ${sources.length}, got ${translated.length}`
    );
  }

  if (opts.dryRun) {
    process.stderr.write(`  --dry-run: skipping write. Sample translations:\n`);
    for (let k = 0; k < Math.min(3, limited.length); k += 1) {
      process.stderr.write(`    ${limited[k].field}: '${limited[k].chineseValue.slice(0, 30)}…' → '${translated[k].slice(0, 30)}…'\n`);
    }
    return { file: filePath, found: issues.length, translated: translated.length, inserted: 0, skipped: 0 };
  }

  // 2) Build insertion plan. Two flavours:
  //
  //    NEW-LINE — the standard case: `field: 'value',` is on its own line
  //      inside a multi-line object. Insert the new `fieldJa: '<ja>',`
  //      sibling on the next line at the same indent.
  //
  //    INLINE — single-line object case: `{ field: 'value', ... },`. The
  //      field's value is followed by other fields and the closing `}`
  //      ON THE SAME LINE. Inserting on the next line places the new
  //      sibling outside the object (or even inside the wrong object).
  //      Detect via "line has `}` after field's value" and instead splice
  //      the sibling directly into the same line, right after the
  //      original field/value pair.
  const source = readFileSync(abs, 'utf8');
  const lines = source.split('\n');

  interface NewLineInsertion {
    kind: 'newLine';
    afterLineIndex: number; // 0-indexed
    indent: string;
    field: string;
    ja: string;
    /** Quote character to use when emitting the new line. Mirrors the
     *  source field's quote style so multi-line backtick template
     *  literals get backtick siblings (single-quoted strings can't
     *  contain real newlines without explicit `\n`). */
    quote: "'" | '`';
  }
  interface InlineInsertion {
    kind: 'inline';
    lineIndex: number;
    insertCol: number;
    field: string;
    ja: string;
  }
  type Insertion = NewLineInsertion | InlineInsertion;
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const insertions: Insertion[] = [];
  let skipped = 0;
  for (let k = 0; k < limited.length; k += 1) {
    const issue = limited[k];
    const fieldLineIndex = issue.line - 1; // 1-indexed → 0-indexed
    const origLine = lines[fieldLineIndex];
    if (!origLine) {
      process.stderr.write(`  WARN: line ${issue.line} out of range, skipping\n`);
      skipped += 1;
      continue;
    }
    const indentMatch = origLine.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : '  ';

    // Detect single-line-object case. Match the field & value precisely
    // (using the captured chineseValue) and check for `}` after.
    const escapedVal = escapeRegex(issue.chineseValue);
    let inlineCol = -1;
    for (const q of ["'", '"', '`']) {
      const re = new RegExp(`\\b${escapeRegex(issue.field)}\\s*:\\s*${q}${escapedVal}${q}\\s*,?`);
      const m = re.exec(origLine);
      if (!m) continue;
      const before = origLine.slice(0, m.index);
      const after = origLine.slice(m.index + m[0].length);
      // Single-line object: the field sits inside a `{ ... }` that opens
      // and closes on the same line. Detect via "the line has `{` before
      // the field and `}` after the field's value." This is intentionally
      // structural, not regex-balanced: a single-line object's outer
      // braces are always present on the line, and any nested `${}`
      // template interpolation in sibling fields contributes its own
      // `}` after our field — both legitimately confirm "this line
      // closes an object." The risk of confusing a nested inline {} for
      // the outer is low because data files use one record-per-line for
      // truly nested objects (resources/milestones/etc).
      if (before.includes('{') && after.includes('}')) {
        inlineCol = m.index + m[0].length;
      }
      break;
    }

    if (inlineCol >= 0) {
      insertions.push({ kind: 'inline', lineIndex: fieldLineIndex, insertCol: inlineCol, field: issue.field, ja: translated[k] });
    } else {
      const afterLineIndex = lineAfterFieldValue(lines, fieldLineIndex, issue.chineseValue);
      if (afterLineIndex < 0) {
        // lineAfterFieldValue couldn't reliably find the closing line —
        // skip this issue rather than risk inserting into the wrong
        // object. The cache still has the translation, so a future run
        // with smarter logic can pick it up.
        skipped += 1;
        continue;
      }
      // Detect source quote style on the field-declaration line so we
      // mirror it. Backtick literals are required when the value spans
      // multiple lines.
      const quoteMatch = origLine.match(/:\s*([`'])/);
      const sourceQuote = quoteMatch ? quoteMatch[1] : "'";
      const valueHasNewline = translated[k].includes('\n');
      const quote: "'" | '`' = sourceQuote === '`' || valueHasNewline ? '`' : "'";
      insertions.push({
        kind: 'newLine',
        afterLineIndex,
        indent,
        field: issue.field,
        ja: translated[k],
        quote,
      });
    }
  }

  // Apply inline insertions first, grouped by line and sorted by col desc.
  const byLine = new Map<number, InlineInsertion[]>();
  for (const ins of insertions) {
    if (ins.kind !== 'inline') continue;
    if (!byLine.has(ins.lineIndex)) byLine.set(ins.lineIndex, []);
    byLine.get(ins.lineIndex)!.push(ins);
  }
  for (const [lineIdx, arr] of byLine.entries()) {
    arr.sort((a, b) => b.insertCol - a.insertCol);
    let line = lines[lineIdx];
    for (const ins of arr) {
      const escaped = escapeSingleQuoted(ins.ja);
      const inject = ` ${ins.field}Ja: '${escaped}',`;
      line = line.slice(0, ins.insertCol) + inject + line.slice(ins.insertCol);
    }
    lines[lineIdx] = line;
  }

  // Apply new-line insertions bottom-up.
  const newLineIns = insertions.filter((x): x is NewLineInsertion => x.kind === 'newLine');
  newLineIns.sort((a, b) => b.afterLineIndex - a.afterLineIndex);
  for (const ins of newLineIns) {
    const escaped =
      ins.quote === '`' ? escapeBacktickQuoted(ins.ja) : escapeSingleQuoted(ins.ja);
    const newLine = `${ins.indent}${ins.field}Ja: ${ins.quote}${escaped}${ins.quote},`;
    lines.splice(ins.afterLineIndex, 0, newLine);
  }

  // 3) Sanity-check the proposed file before writing. Catches regex
  //    miscalculations (multi-line backticks misplaced into the wrong
  //    object, single-line objects with stale `}` after the inserted
  //    sibling, etc.) right here, with the offending line, instead of
  //    surfacing 5 minutes later as cryptic ts(2304)/ts(1005) cascades
  //    in `astro check`.
  const proposed = lines.join('\n');
  const syntaxErrors = tsParseDiagnostics(abs, proposed);
  if (syntaxErrors.length > 0) {
    process.stderr.write(
      `  ❌ ABORT — post-edit TS parse failed (${syntaxErrors.length} error(s)). Original file preserved.\n`
    );
    for (const e of syntaxErrors.slice(0, 5)) process.stderr.write(`     ${e}\n`);
    if (syntaxErrors.length > 5) {
      process.stderr.write(`     … and ${syntaxErrors.length - 5} more\n`);
    }
    return {
      file: filePath,
      found: issues.length,
      translated: translated.length,
      inserted: 0,
      skipped: limited.length,
    };
  }

  // 4) Write back.
  writeFileSync(abs, proposed);
  process.stderr.write(`  wrote ${insertions.length} new *Ja line(s)\n`);

  return { file: filePath, found: issues.length, translated: translated.length, inserted: insertions.length, skipped };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const totals = { found: 0, translated: 0, inserted: 0, skipped: 0 };
  for (const file of args.files) {
    const r = await backfillFile(file, { dryRun: args.dryRun, limit: args.limit, force: args.force });
    totals.found += r.found;
    totals.translated += r.translated;
    totals.inserted += r.inserted;
    totals.skipped += r.skipped;
  }
  process.stderr.write(
    `\n[backfill-ja] DONE — files=${args.files.length} found=${totals.found} translated=${totals.translated} inserted=${totals.inserted} skipped=${totals.skipped}\n`
  );
  if (args.dryRun) {
    process.stderr.write(`[backfill-ja] (--dry-run: no files modified)\n`);
  } else if (totals.inserted > 0) {
    process.stderr.write(`[backfill-ja] Run \`npm run fix:prettier\` to normalize formatting.\n`);
  }
}

// Suppress lint warning: type imported for documentation but used only
// in JSDoc-equivalent annotations.
void (undefined as unknown as UnpairedField);

/** Only auto-run main() when invoked as the process entry point —
 *  importing this module from a test must NOT kick off the CLI. */
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
    process.stderr.write(`[backfill-ja] ERROR: ${err instanceof Error ? err.stack || err.message : String(err)}\n`);
    process.exit(1);
  });
}
