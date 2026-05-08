// scripts/i18n/refactor-isEn.ts
// ────────────────────────────────────────────────────────────────────────
// Convert components that use the binary `isEn = lang !== 'zh'` dispatch
// into three-way `isJa / isEn / isZh` dispatch. This unblocks JA pages
// that currently inherit the EN copy because `isEn` returned true for ja.
//
// Targets two patterns:
//
//   PATTERN A — multi-line object ternary at statement scope:
//     const NAME = isEn
//       ? {
//           key: 'en value',
//           ...
//         }
//       : {
//           key: '中文',
//           ...
//         };
//
//   PATTERN B — single-line key-scoped inline ternary inside any object/JSX:
//     key: isEn ? 'en' : '中文',
//     ...JSX:  {isEn ? 'en' : '中文'}
//
// Translation:
//   For each zh value found, calls translateBatch (zh→ja) — cached.
//   For PATTERN A, prepends an `isJa ? { ...JA dict... } :` branch.
//   For PATTERN B, replaces with `isJa ? 'ja' : isEn ? 'en' : '中文'`.
//
// Also rewrites:
//   const isEn = lang !== 'zh';  →  const isJa = lang === 'ja';
//                                   const isEn = lang === 'en';
//
// USAGE:
//   npx tsx scripts/i18n/refactor-isEn.ts --file=src/components/data/PolicyCard.astro
//   npx tsx scripts/i18n/refactor-isEn.ts --all
//   npx tsx scripts/i18n/refactor-isEn.ts --file=... --dry-run

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { translateBatch } from '../lib/translate.ts';

const ALL_FILES = [
  'src/components/debates/DebatesIndex.astro',
  'src/components/data/PolicyProfile.astro',
  'src/components/benchmarking/CaseProfile.astro',
  'src/components/benchmarking/RegionProfile.astro',
  'src/components/benchmarking/DrilldownProfile.astro',
  'src/components/data/RelatedRail.astro',
  'src/components/data/OpenSourceProjectDetail.astro',
  'src/components/data/CommunityOpenSourceProjectDetail.astro',
  'src/utils/entity-pages.ts',
];

const ZH_TO_JA_SYSTEM_PROMPT = [
  'You are translating UI label strings from a Singapore AI policy website (sgai) from Simplified Chinese to Japanese.',
  'Translate concisely using the polite-but-professional です・ます register where applicable, but for short labels (button text, table headers, badges) prefer noun phrases.',
  'Preserve all proper nouns (IMDA, MAS, NRF, AISG, MDDI, SEA-LION, AI Verify, sgai), numbers, dates, and ASCII acronyms verbatim.',
  '',
  'GLOSSARY — apply these mappings verbatim wherever the source contains the left side:',
  '  新加坡 → シンガポール',
  '  AI 抓手 → AI レバー',
  '  抓手 → レバー',
  '  国会辩论 → 議会討論',
  '  国会 → 議会',
  '  国会议员 / 议员 → 議員',
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
  '  来源 → 出典',
  '  关联 / 相关 → 関連',
  '  辩论 → 討論',
  '  辩论记录 → 討論記録',
  '  数据更新 → データ更新',
  '  详情 → 詳細',
  '  详情页 → 詳細ページ',
  '  政策信号 → 政策シグナル',
  '  政府立场 → 政府の立場',
  '  质询立场 → 質問の立場',
  '  反对立场 → 野党の立場',
  '  关键引文 / 引文 → 注目発言',
  '  要点 → 要点',
  '  概览 → 概要',
  '  类型 → タイプ',
  '  议题 → トピック',
  '  议员 → 議員',
  '  年份 → 年',
  '  争议度 → 争点度',
  '  返回 → 戻る',
  '',
  'Output only valid JSON: {"paragraphs":["..."]}. Output array length must equal input length, in same order.',
  '',
  'QUOTE RULES — strict:',
  '1. NEVER emit ASCII straight quotes (") inside the translated text — they break JSON. Use Japanese 「 」 (or 『 』 for nested), or no quotes if the source has none.',
  '2. ASCII apostrophes (\') in source: convert to nothing or to a Japanese-natural form. Do not retain them.',
  '3. Curly braces {placeholder} like {count}, {handle}, {from}, {to}: leave VERBATIM, do not translate the placeholder name.',
].join('\n');

interface Args {
  files: string[];
  dryRun: boolean;
  force: boolean;
}

function parseArgs(argv: string[]): Args {
  const out: Args = { files: [], dryRun: false, force: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--all') out.files = [...ALL_FILES];
    else if (a.startsWith('--file=')) out.files.push(a.slice(7));
    else if (a === '--file') {
      i += 1;
      out.files.push(argv[i]);
    } else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--force') out.force = true;
    else {
      process.stderr.write(`unknown arg: ${a}\n`);
      process.exit(2);
    }
  }
  if (out.files.length === 0) {
    process.stderr.write('no files. use --file=<path> or --all\n');
    process.exit(2);
  }
  return out;
}

function hasCJK(s: string): boolean {
  return /[一-鿿]/.test(s);
}

// Rewrite `const isEn = lang !== 'zh';` → add `const isJa = lang === 'ja';`
// declaration alongside it. We KEEP `isEn` as `lang !== 'zh'` so that any
// un-converted `isEn ? <en> : <zh>` ternaries (e.g. backtick templates with
// ${} interpolation that the codemod skips) still fall through to the en
// branch on JA pages — i.e. preserve the legacy en-as-fallback behaviour.
// Three-way `isJa ? <ja> : isEn ? <en> : <zh>` ternaries work correctly
// under either definition because `isJa` short-circuits first.
function rewriteIsEnDecl(src: string): string {
  // Idempotence: if `const isJa = lang === 'ja';` is already present, skip.
  if (/\bconst\s+isJa\s*=\s*lang\s*===\s*'ja'\s*;/.test(src)) return src;
  return src.replace(
    /^(\s*)const isEn\s*=\s*lang\s*!==\s*'zh'\s*;\s*$/m,
    `$1const isJa = lang === 'ja';\n$1const isEn = lang !== 'zh';`
  );
}

// ── Pattern A: multi-line statement-scope `const X[: T] = isEn ? { ... } : { ... };`
//
// Captured via line-based parser to avoid AST overhead.
//
// We scan for lines exactly matching `^(\s*)const (\w+)([^=]*=)\s*isEn$`,
// then expect:
//   nextLine: `<indent>  ? {`
//   ...en object body...
//   `<indent>  }`
//   `<indent>  : {`
//   ...zh object body...
//   `<indent>  };`  (or `<indent>  }`)

interface ObjectTernary {
  // The 0-based line indices in the file:
  declLine: number; // the `const X = isEn` line
  endLine: number; // the `};` line (inclusive)
  indent: string; // leading whitespace of `const`
  declPrefix: string; // `const NAME[: TYPE] = `
  enBody: string[]; // lines between `? {` and matching `}` (object body)
  zhBody: string[]; // lines between `: {` and matching `}` (object body)
}

function findObjectTernaries(lines: string[]): ObjectTernary[] {
  const out: ObjectTernary[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    const m = lines[i].match(/^(\s*)(const\s+\w+(?:\s*:\s*[^=]+)?\s*=\s*)isEn\s*$/);
    if (!m) continue;
    const indent = m[1];
    const declPrefix = m[2];

    // line i+1: trimmed `? {`
    if (lines[i + 1] === undefined || lines[i + 1].trim() !== '? {') continue;

    // walk until line trim === '}' (en body closing brace)
    let j = i + 2;
    while (j < lines.length && lines[j].trim() !== '}') j += 1;
    if (j >= lines.length) continue;
    const enEnd = j;

    // next: trimmed `: {`
    if (lines[j + 1] === undefined || lines[j + 1].trim() !== ': {') continue;
    let k = j + 2;
    while (k < lines.length) {
      const t = lines[k].trim();
      if (t === '}' || t === '};') break;
      k += 1;
    }
    if (k >= lines.length) continue;
    const zhEnd = k;

    out.push({
      declLine: i,
      endLine: zhEnd,
      indent,
      declPrefix,
      enBody: lines.slice(i + 2, enEnd),
      zhBody: lines.slice(j + 2, zhEnd),
    });
  }
  return out;
}

// Parse simple object body lines into key+value+meta (suffix like trailing comma).
// Handles `key: 'value',` and `key: "value",` and limited multi-line expressions skipped.
interface ObjEntry {
  lineRel: number; // line index relative to body start
  raw: string;
  key: string;
  value: string;
  trailing: string; // content after closing quote (',' or '')
  quote: '"' | "'" | '`';
  needsTranslate: boolean;
}

function parseObjBody(body: string[]): ObjEntry[] {
  const out: ObjEntry[] = [];
  for (let li = 0; li < body.length; li += 1) {
    const line = body[li];
    // Skip blank, comments, and lines that aren't simple key: 'value'.
    const m = line.match(/^(\s*)([A-Za-z_$][\w$]*)\s*:\s*(['"`])([\s\S]*?)\3(\s*,?\s*)$/);
    if (!m) continue;
    const value = m[4];
    out.push({
      lineRel: li,
      raw: line,
      key: m[2],
      value,
      trailing: m[5].replace(/\s+/g, ''),
      quote: m[3] as '"' | "'" | '`',
      needsTranslate: hasCJK(value),
    });
  }
  return out;
}

function escapeForQuote(s: string, quote: '"' | "'" | '`'): string {
  if (quote === "'") return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  if (quote === '"') return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
}

// ── Pattern B: inline isEn ternary on a single line.
//   `<prefix>isEn ? '<en>' : '<zh>'<suffix>`
// or `<prefix>isEn ? "<en>" : "<zh>"<suffix>`
// or `<prefix>isEn ? \`<en>\` : \`<zh>\`<suffix>` (backticks, no ${} for now)

interface InlineMatch {
  lineIdx: number;
  fullMatch: string;
  startCol: number;
  enValue: string;
  zhValue: string;
  enQuote: '"' | "'" | '`';
  zhQuote: '"' | "'" | '`';
}

function findInlineMatches(lines: string[]): InlineMatch[] {
  const out: InlineMatch[] = [];
  // Match: isEn ? 'A' : 'B'    where A and B are quoted (no nested same quote).
  // Skip backticks containing ${} — too risky to translate.
  const re = /\bisEn\s*\?\s*(['"`])((?:\\.|(?!\1)[^])*)\1\s*:\s*(['"`])((?:\\.|(?!\3)[^])*)\3/g;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      const enQuote = m[1] as '"' | "'" | '`';
      const enValue = m[2];
      const zhQuote = m[3] as '"' | "'" | '`';
      const zhValue = m[4];
      // Skip if zhValue has no CJK — it's already a Latin string (probably untranslatable).
      if (!hasCJK(zhValue)) continue;
      // Skip backticks with ${} interpolation — unsafe to mutate.
      if ((enQuote === '`' && enValue.includes('${')) || (zhQuote === '`' && zhValue.includes('${'))) continue;
      // Idempotence guard: if `isJa ?` already appears earlier on the line,
      // this `isEn ? A : B` is already inside an `isJa ? JA : isEn ? A : B`
      // wrapper from a prior run. Skip to avoid double-wrapping.
      const before = line.slice(0, m.index);
      if (/\bisJa\s*\?/.test(before)) continue;
      out.push({
        lineIdx: i,
        fullMatch: m[0],
        startCol: m.index,
        enValue,
        zhValue,
        enQuote,
        zhQuote,
      });
    }
  }
  return out;
}

async function refactorFile(filePath: string, opts: { dryRun: boolean; force: boolean }): Promise<{
  file: string;
  objectTernaries: number;
  inlineMatches: number;
  zhStrings: number;
  modified: boolean;
}> {
  const abs = resolve(filePath);
  const original = readFileSync(abs, 'utf8');
  const lines = original.split('\n');

  process.stderr.write(`\n[refactor-isEn] ${filePath}\n`);

  // 1) Find object-ternary blocks.
  const objs = findObjectTernaries(lines);
  process.stderr.write(`  object ternaries: ${objs.length}\n`);

  // 2) Find inline ternary string matches.
  const inlines = findInlineMatches(lines);
  process.stderr.write(`  inline ternaries: ${inlines.length}\n`);

  // 3) Collect all zh strings to translate.
  const zhValues: string[] = [];
  const zhEntryRefs: { kind: 'obj'; objIdx: number; entryIdx: number; valueIndex: number }[] = [];
  const inlineRefs: { kind: 'inline'; matchIdx: number; valueIndex: number }[] = [];

  const objEntries = objs.map((o) => parseObjBody(o.zhBody));
  // Object entries:
  for (let oi = 0; oi < objs.length; oi += 1) {
    const entries = objEntries[oi];
    for (let ei = 0; ei < entries.length; ei += 1) {
      if (entries[ei].needsTranslate) {
        zhEntryRefs.push({ kind: 'obj', objIdx: oi, entryIdx: ei, valueIndex: zhValues.length });
        zhValues.push(entries[ei].value);
      }
    }
  }
  // Inline matches:
  for (let mi = 0; mi < inlines.length; mi += 1) {
    inlineRefs.push({ kind: 'inline', matchIdx: mi, valueIndex: zhValues.length });
    zhValues.push(inlines[mi].zhValue);
  }

  process.stderr.write(`  zh strings to translate: ${zhValues.length}\n`);

  if (zhValues.length === 0 && objs.length === 0 && inlines.length === 0) {
    return { file: filePath, objectTernaries: 0, inlineMatches: 0, zhStrings: 0, modified: false };
  }

  // 4) Translate.
  const translated = await translateBatch(zhValues, {
    direction: 'zh→ja',
    cacheDir: resolve('scripts/i18n/data/ja-cache'),
    systemPrompt: ZH_TO_JA_SYSTEM_PROMPT,
    concurrency: 2,
    force: opts.force,
  });

  if (opts.dryRun) {
    process.stderr.write(`  --dry-run: skipping write. Sample translations:\n`);
    for (let k = 0; k < Math.min(3, zhValues.length); k += 1) {
      process.stderr.write(`    '${zhValues[k].slice(0, 30)}…' → '${translated[k].slice(0, 30)}…'\n`);
    }
    return { file: filePath, objectTernaries: objs.length, inlineMatches: inlines.length, zhStrings: zhValues.length, modified: false };
  }

  // 5) Build the new file. Rebuild object ternaries top-down using the
  //    decl/end line indices. Reverse order so earlier indices stay stable.
  const sortedObjs = objs
    .map((o, oi) => ({ o, oi }))
    .sort((a, b) => b.o.declLine - a.o.declLine);

  for (const { o, oi } of sortedObjs) {
    const entries = objEntries[oi];

    // Rebuild ja zh body lines.
    const innerIndent = o.indent + '  ';
    const bodyIndent = innerIndent + '  ';

    // Build ja body: same lines as zh body, but values replaced.
    const jaLines: string[] = [];
    for (let li = 0; li < o.zhBody.length; li += 1) {
      const e = entries.find((x) => x.lineRel === li && x.needsTranslate);
      if (!e) {
        // Pass-through for non-translatable lines (comments / Latin values / multi-line).
        jaLines.push(o.zhBody[li]);
        continue;
      }
      const ref = zhEntryRefs.find((r) => r.objIdx === oi && r.entryIdx === entries.indexOf(e));
      if (!ref) {
        jaLines.push(o.zhBody[li]);
        continue;
      }
      const ja = translated[ref.valueIndex];
      const escaped = escapeForQuote(ja, e.quote);
      const trailing = e.trailing.includes(',') ? ',' : '';
      jaLines.push(`${bodyIndent}${e.key}: ${e.quote}${escaped}${e.quote}${trailing}`);
    }

    // Build the replacement block:
    //   const NAME[: T] = isJa
    //     ? {
    //         <ja body>
    //       }
    //     : isEn
    //       ? {
    //           <en body>
    //         }
    //       : {
    //           <zh body>
    //         };

    const new_: string[] = [];
    new_.push(`${o.indent}${o.declPrefix}isJa`);
    new_.push(`${innerIndent}? {`);
    new_.push(...jaLines);
    new_.push(`${innerIndent}  }`);
    new_.push(`${innerIndent}: isEn`);
    new_.push(`${innerIndent}  ? {`);
    // En body: indent each line by 4 extra (deeper nesting). To keep diff
    // minimal we just re-emit the lines verbatim with same body indent. The
    // human-curated indentation may shift; prettier will re-flow on commit.
    for (const ln of o.enBody) new_.push(ln.replace(/^/, '    '));
    new_.push(`${innerIndent}    }`);
    new_.push(`${innerIndent}  : {`);
    for (const ln of o.zhBody) new_.push(ln.replace(/^/, '    '));
    new_.push(`${innerIndent}    };`);

    lines.splice(o.declLine, o.endLine - o.declLine + 1, ...new_);
  }

  // 6) Apply inline ternary replacements. Iterate in reverse per line so
  //    earlier matches don't shift later positions.
  // We need to recompute lines because object splices changed numbering.
  // Simpler: rebuild from scratch with current `lines` and re-find inlines.
  const inlines2 = findInlineMatches(lines);
  // Re-translate (cache hit) for inlines2 — just to map zhValue → ja from the cache.
  // We can use the existing translation table: build a map zhValue → ja.
  const zhToJa = new Map<string, string>();
  for (let k = 0; k < zhValues.length; k += 1) {
    zhToJa.set(zhValues[k], translated[k]);
  }

  // Group by line, descending by startCol.
  const byLine = new Map<number, InlineMatch[]>();
  for (const m of inlines2) {
    if (!byLine.has(m.lineIdx)) byLine.set(m.lineIdx, []);
    byLine.get(m.lineIdx)!.push(m);
  }
  for (const [lineIdx, matches] of byLine.entries()) {
    matches.sort((a, b) => b.startCol - a.startCol);
    let line = lines[lineIdx];
    for (const m of matches) {
      const ja = zhToJa.get(m.zhValue);
      if (!ja) continue;
      const enLit = `${m.enQuote}${m.enValue}${m.enQuote}`;
      const zhLit = `${m.zhQuote}${m.zhValue}${m.zhQuote}`;
      const jaQuote = m.zhQuote === '`' ? '`' : "'";
      const jaLit = `${jaQuote}${escapeForQuote(ja, jaQuote)}${jaQuote}`;
      const replacement = `isJa ? ${jaLit} : isEn ? ${enLit} : ${zhLit}`;
      line = line.slice(0, m.startCol) + replacement + line.slice(m.startCol + m.fullMatch.length);
    }
    lines[lineIdx] = line;
  }

  // 7) Rewrite the const isEn declaration.
  const text2 = rewriteIsEnDecl(lines.join('\n'));

  // 8) Write back.
  writeFileSync(abs, text2);
  process.stderr.write(`  wrote ${objs.length} object ternaries + ${inlines.length} inline ternaries\n`);

  return {
    file: filePath,
    objectTernaries: objs.length,
    inlineMatches: inlines.length,
    zhStrings: zhValues.length,
    modified: true,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const totals = { objs: 0, inlines: 0, zh: 0, modified: 0 };
  for (const f of args.files) {
    const r = await refactorFile(f, { dryRun: args.dryRun, force: args.force });
    totals.objs += r.objectTernaries;
    totals.inlines += r.inlineMatches;
    totals.zh += r.zhStrings;
    if (r.modified) totals.modified += 1;
  }
  process.stderr.write(
    `\n[refactor-isEn] DONE — files=${args.files.length} modified=${totals.modified} objs=${totals.objs} inlines=${totals.inlines} zh=${totals.zh}\n`
  );
  if (!args.dryRun && totals.modified > 0) {
    process.stderr.write(`Run \`npm run fix:prettier\` then \`npm run check\` to verify.\n`);
  }
}

main().catch((err) => {
  process.stderr.write(`[refactor-isEn] ERROR: ${err instanceof Error ? err.stack || err.message : String(err)}\n`);
  process.exit(1);
});
