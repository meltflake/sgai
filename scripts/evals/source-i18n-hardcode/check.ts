// scripts/evals/source-i18n-hardcode/check.ts
// ────────────────────────────────────────────────────────────────────────
// Layer E — Source-level i18n hardcode scan.
//
// What this is for:
//   sgai is a five-locale site (zh / en / ja / zh-tw / ko). Layers A–D verify
//   that DATA files are paired (A) and that BUILT pages are clean (B/C/D).
//   They do NOT see the source-template-level reason a non-en page silently
//   renders English content: code like `lang === 'zh' ? '中文' : 'English'`,
//   `isZh ? '...' : '...'`, `isEn = lang !== 'zh'`, or a `COPY` map missing a
//   `ja` entry.
//
//   The 2026-05-10 audit found 25 .astro files with 376 such hardcodes.
//   On a non-en page they all silently fall into the EN branch — Layer D's
//   CJK-residue scan can't see EN-on-<lang> leakage, so it under-reports by
//   construction. Layer E closes that loop at the SOURCE level.
//
// What it flags:
//   1. `lang === 'zh' ?` and `lang === 'en' ?` ternary expressions
//      (the ja/zh-tw/ko branches are silently missing).
//   2. `isZh ? ... : ...` / `isEn ? ... : ...` / `isJa ? ... : ...` ternaries
//      — a binary-locale mindset where the other three locales are implicit
//      and wrong. isJa is flagged too: `isJa ? ja : en` throws zh-tw/ko into
//      the EN branch (the 2026-07 fallback-leak bug class).
//   3. `isEn = lang !== '<x>'` / `isZh = lang !== '<x>'` alias definitions —
//      the root of the binary anti-pattern: any non-<x> locale (including
//      zh-tw/ko) is collapsed into a single "the other one" branch.
//   4. `lang !== 'zh' ?` ternaries — same collapse, inline.
//   5. `COPY[lang] ?? COPY.en` / `COPY[lang] ?? COPY.zh` patterns where
//      the same file's COPY map literal does NOT declare a `ja:` key.
//      ja silently falls back to en/zh.
//
// What it does NOT flag:
//   - `lang === 'ja' ?` ternaries (these are usually CORRECT, e.g.
//     ja-specific date formats that genuinely need a ja branch). Note this
//     differs from `isJa ?`, which is a binary alias and IS flagged.
//   - `lang === 'zh'` boolean expressions used in non-ternary control flow
//     (e.g. `if (lang === 'zh') return ...`) — these are usually intentional
//     locale-specific routing rather than chrome-text leakage.
//   - Lines (or the line above them) that contain the ignore marker
//     `// i18n-allow-hardcode` — used for legitimate cases where the cost
//     of going through t() exceeds the benefit (rare, e.g. dev-only
//     diagnostic strings).
//   - Files inside `src/i18n/` itself (the dictionary IS the i18n layer)
//     and `__tests__/` directories.
//
// Why source scan rather than runtime/dist:
//   - Catches problems at PR time, before build, with zero infra cost.
//   - Output points at the EXACT file:line, which makes fix obvious.
//   - Works for files that compile but render locale-incomplete pages —
//     the kind of regression that slips through type-check.
//
// CLI:
//   npx tsx scripts/evals/source-i18n-hardcode/check.ts
//   npx tsx scripts/evals/source-i18n-hardcode/check.ts --baseline
//     # Snapshot the current set of findings as the allowed baseline.
//     # Future runs only fail when NEW findings appear beyond the baseline.
//   npx tsx scripts/evals/source-i18n-hardcode/check.ts --report-only
//     # Print findings but exit 0 even on failure. For local exploration.
//
// Exit codes:
//   0 — no new findings beyond baseline (or no findings at all)
//   1 — at least one new finding above baseline
//   2 — invocation error
//
// Baseline file: scripts/evals/source-i18n-hardcode/baseline.json
//   Stores known-tolerated findings as `{file, line, rule}` triples. The
//   intent is: snapshot today's 376 grandfathered hits, then any NEW
//   isZh/lang===zh introduced by future PRs is a hard-fail. The baseline
//   should monotonically shrink as the backlog gets fixed; PRs should
//   never grow it.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  realpathSync,
} from 'node:fs';
import { join, resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const SRC_ROOTS = ['src/components', 'src/pages', 'src/layouts'].map((p) => join(REPO_ROOT, p));
const REPORT_DIR = join(import.meta.dirname, 'reports');
const BASELINE_PATH = join(import.meta.dirname, 'baseline.json');

const SKIP_DIR_NAMES = new Set(['__tests__', 'node_modules', '.astro', 'dist']);
const SKIP_FILE_PATTERNS: RegExp[] = [/\.test\.tsx?$/, /\.spec\.tsx?$/];

const IGNORE_MARKER = 'i18n-allow-hardcode';

type Rule =
  | 'lang-eq-zh-ternary'
  | 'lang-eq-en-ternary'
  | 'isZh-ternary'
  | 'isEn-ternary'
  | 'isJa-ternary'
  | 'binary-lang-alias'
  | 'lang-neq-zh-ternary'
  | 'copy-no-ja';

interface Finding {
  file: string;
  line: number;
  rule: Rule;
  excerpt: string;
}

interface BaselineEntry {
  file: string;
  line: number;
  rule: Rule;
}

interface CliOptions {
  writeBaseline: boolean;
  reportOnly: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = { writeBaseline: false, reportOnly: false };
  for (const a of argv) {
    if (a === '--baseline' || a === '--write-baseline') opts.writeBaseline = true;
    else if (a === '--report-only') opts.reportOnly = true;
    else if (a === '--help' || a === '-h') {
      process.stdout.write('Usage: eval source-i18n-hardcode [--baseline] [--report-only]\n');
      process.exit(0);
    }
  }
  return opts;
}

function* walkSource(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (SKIP_DIR_NAMES.has(name)) continue;
      yield* walkSource(full);
    } else if (st.isFile()) {
      if (SKIP_FILE_PATTERNS.some((re) => re.test(name))) continue;
      if (name.endsWith('.astro') || name.endsWith('.ts') || name.endsWith('.tsx')) yield full;
    }
  }
}

const PATTERNS: { rule: Rule; re: RegExp }[] = [
  // Binary-locale alias definition: `const isEn = lang !== 'zh'` (or isZh).
  // This is the ROOT of the whole anti-pattern — it collapses four non-<x>
  // locales (en OR ja OR zh-tw OR ko) into one boolean, so every later
  // `isEn ? ... : ...` throws zh-tw/ko into whichever branch. Placed first so
  // the definition line is tagged as the alias rather than a ternary.
  { rule: 'binary-lang-alias', re: /\b(isEn|isZh)\s*=\s*lang\s*!==\s*['"]/ },
  // `lang === 'zh' ?` — common shape: `lang === 'zh' ? '中文' : 'English'`.
  // The ja/zh-tw/ko branches are silently absent. `lang === 'ja' ?` is
  // intentionally NOT here — explicit ja handling is usually correct.
  { rule: 'lang-eq-zh-ternary', re: /\blang\s*===\s*['"]zh['"]\s*\?/ },
  { rule: 'lang-eq-en-ternary', re: /\blang\s*===\s*['"]en['"]\s*\?/ },
  // `lang !== 'zh' ? ... : ...` — the inline form of the binary collapse:
  // any non-zh locale (ja/en/zh-tw/ko) gets the same branch.
  { rule: 'lang-neq-zh-ternary', re: /\blang\s*!==\s*['"]zh['"]\s*\?/ },
  // `isZh ? '中' : 'EN'` / `isEn ? ... : ...` / `isJa ? ja : en` — binary-locale
  // mindset. isJa is flagged too: `isJa ? ja : en` sends zh-tw/ko to EN.
  { rule: 'isZh-ternary', re: /\bisZh\s*\?/ },
  { rule: 'isEn-ternary', re: /\bisEn\s*\?/ },
  { rule: 'isJa-ternary', re: /\bisJa\s*\?/ },
];

/** Scan a file for i18n hardcode anti-patterns. Returns findings tagged with
 *  rule and 1-indexed line number. Each rule is at most one finding per line.
 *
 *  COPY-no-ja is whole-file: if the file contains `COPY[lang] ?? COPY.en`
 *  (or COPY.zh) but the same file's COPY object literal lacks a `ja:` key,
 *  emit one finding pointing at the `??` line. */
function scanFile(filePath: string): Finding[] {
  const src = readFileSync(filePath, 'utf8');
  const lines = src.split('\n');
  const out: Finding[] = [];
  const rel = relative(REPO_ROOT, filePath);

  // Pre-compute "is this line ignored" — true if the line itself or the
  // immediately preceding line contains the marker.
  const ignored = new Set<number>();
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(IGNORE_MARKER)) {
      ignored.add(i + 1);
      ignored.add(i + 2);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    if (ignored.has(lineNumber)) continue;
    // NOTE: the old "skip lines with an explicit ja branch" heuristic was
    // removed for the 5-locale site. A line like `isJa ? ja : isEn ? en : zh`
    // still throws zh-tw/ko into the en/zh branches, so covering ja does NOT
    // make the line locale-complete. isJa-ternary is now flagged in its own
    // right; do not re-add a ja-branch bypass.
    for (const { rule, re } of PATTERNS) {
      if (re.test(line)) {
        out.push({
          file: rel,
          line: lineNumber,
          rule,
          excerpt: line.trim().slice(0, 120),
        });
        break; // one rule per line max — avoid double-counting
      }
    }
  }

  // COPY-no-ja whole-file check.
  // Look for the canonical "ja-missing fallback" shape:
  //   const c = COPY[lang] ?? COPY.en ?? COPY.zh!;
  // and assert COPY object literal declares a `ja:` key. If not, flag the
  // first `COPY[lang]` line.
  const copyFallbackRe = /COPY\s*\[\s*lang\s*\]\s*\?\?\s*COPY\.(en|zh)/;
  const copyDeclaresJa = /\bja\s*:\s*\{/m;
  let copyFallbackLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (copyFallbackRe.test(lines[i])) {
      copyFallbackLine = i + 1;
      break;
    }
  }
  if (copyFallbackLine !== -1 && !copyDeclaresJa.test(src) && !ignored.has(copyFallbackLine)) {
    out.push({
      file: rel,
      line: copyFallbackLine,
      rule: 'copy-no-ja',
      excerpt: lines[copyFallbackLine - 1].trim().slice(0, 120),
    });
  }

  return out;
}

function loadBaseline(): BaselineEntry[] {
  if (!existsSync(BASELINE_PATH)) return [];
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as BaselineEntry[];
  } catch (err) {
    process.stderr.write(`Failed to parse baseline at ${BASELINE_PATH}: ${(err as Error).message}\n`);
    return [];
  }
}

function findingKey(f: { file: string; rule: Rule }): string {
  // We deliberately omit `line` from the key. Line numbers shift when
  // unrelated edits add/remove lines above; using (file, rule) plus
  // count-based diffing keeps the baseline stable across cosmetic edits.
  return `${f.file}::${f.rule}`;
}

function diffAgainstBaseline(
  findings: Finding[],
  baseline: BaselineEntry[]
): { newOnes: Finding[]; resolvedKeys: string[] } {
  const baselineCounts = new Map<string, number>();
  for (const b of baseline) {
    const k = findingKey(b);
    baselineCounts.set(k, (baselineCounts.get(k) ?? 0) + 1);
  }
  const currentByKey = new Map<string, Finding[]>();
  for (const f of findings) {
    const k = findingKey(f);
    const arr = currentByKey.get(k) ?? [];
    arr.push(f);
    currentByKey.set(k, arr);
  }
  const newOnes: Finding[] = [];
  for (const [k, arr] of currentByKey) {
    const allowed = baselineCounts.get(k) ?? 0;
    if (arr.length > allowed) {
      // emit the EXCESS findings as new
      newOnes.push(...arr.slice(allowed));
    }
  }
  const resolvedKeys: string[] = [];
  for (const [k, count] of baselineCounts) {
    const cur = currentByKey.get(k)?.length ?? 0;
    if (cur < count) resolvedKeys.push(`${k} (was ${count}, now ${cur})`);
  }
  return { newOnes, resolvedKeys };
}

function writeBaseline(findings: Finding[]): void {
  const entries: BaselineEntry[] = findings.map((f) => ({ file: f.file, line: f.line, rule: f.rule }));
  // Sort for stable diffs.
  entries.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule));
  writeFileSync(BASELINE_PATH, JSON.stringify(entries, null, 2) + '\n');
}

function todayStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function writeReport(payload: object): { jsonPath: string; mdPath: string } {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = todayStamp();
  const jsonPath = join(REPORT_DIR, `report-${stamp}.json`);
  const mdPath = join(REPORT_DIR, `report-${stamp}.md`);
  writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
  return { jsonPath, mdPath };
}

interface Summary {
  totalFiles: number;
  filesWithFindings: number;
  totalFindings: number;
  byRule: Record<Rule, number>;
}

function summarize(findings: Finding[], totalFiles: number): Summary {
  const byRule: Record<Rule, number> = {
    'lang-eq-zh-ternary': 0,
    'lang-eq-en-ternary': 0,
    'isZh-ternary': 0,
    'isEn-ternary': 0,
    'isJa-ternary': 0,
    'binary-lang-alias': 0,
    'lang-neq-zh-ternary': 0,
    'copy-no-ja': 0,
  };
  const dirty = new Set<string>();
  for (const f of findings) {
    byRule[f.rule]++;
    dirty.add(f.file);
  }
  return { totalFiles, filesWithFindings: dirty.size, totalFindings: findings.length, byRule };
}

async function main(): Promise<void> {
  const opts = parseCli(process.argv.slice(2));

  const allFindings: Finding[] = [];
  let totalFiles = 0;
  for (const root of SRC_ROOTS) {
    for (const file of walkSource(root)) {
      // Skip the i18n module itself — it's the canonical place for
      // language-specific dispatch.
      const rel = relative(REPO_ROOT, file);
      if (rel.startsWith('src/i18n/')) continue;
      totalFiles++;
      allFindings.push(...scanFile(file));
    }
  }
  // Sort findings deterministically for the report.
  allFindings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule));

  if (opts.writeBaseline) {
    writeBaseline(allFindings);
    process.stdout.write(`Wrote baseline: ${relative(REPO_ROOT, BASELINE_PATH)} — ${allFindings.length} entries\n`);
    process.exit(0);
  }

  const baseline = loadBaseline();
  const { newOnes, resolvedKeys } = diffAgainstBaseline(allFindings, baseline);
  const summary = summarize(allFindings, totalFiles);

  const { jsonPath, mdPath } = writeReport({
    generatedAt: new Date().toISOString(),
    summary,
    baselineSize: baseline.length,
    newFindings: newOnes,
    resolvedKeys,
  });

  // Keep the markdown report concise.
  const md: string[] = [`# Layer E — Source i18n Hardcode Scan — ${todayStamp()}`, ''];
  md.push(`- Files scanned: ${summary.totalFiles}`);
  md.push(`- Files with findings: ${summary.filesWithFindings}`);
  md.push(`- Total findings: ${summary.totalFindings}`);
  md.push(`- Baseline size: ${baseline.length}`);
  md.push(`- New findings (above baseline): ${newOnes.length}`);
  md.push(`- Resolved baseline keys: ${resolvedKeys.length}`);
  md.push('', '## Findings by rule', '');
  for (const [rule, count] of Object.entries(summary.byRule)) md.push(`- \`${rule}\`: ${count}`);
  if (newOnes.length > 0) {
    md.push('', '## New findings (must fix or use `// i18n-allow-hardcode`)', '');
    for (const f of newOnes.slice(0, 50)) {
      md.push(`- \`${f.file}:${f.line}\` [${f.rule}] — \`${f.excerpt}\``);
    }
  }
  writeFileSync(mdPath, md.join('\n') + '\n');

  process.stdout.write('--- Layer E Source i18n Hardcode ---\n');
  process.stdout.write(`Files scanned: ${summary.totalFiles}\n`);
  process.stdout.write(`Files with findings: ${summary.filesWithFindings}\n`);
  process.stdout.write(`Total findings: ${summary.totalFindings}\n`);
  for (const [rule, count] of Object.entries(summary.byRule)) {
    process.stdout.write(`  ${rule}: ${count}\n`);
  }
  process.stdout.write(`Baseline: ${baseline.length} entries\n`);
  process.stdout.write(`New findings (above baseline): ${newOnes.length}\n`);
  process.stdout.write(`Report: ${relative(REPO_ROOT, mdPath)}\n`);
  process.stdout.write(`        ${relative(REPO_ROOT, jsonPath)}\n`);

  if (newOnes.length > 0) {
    process.stdout.write('\nNew hardcoded i18n found beyond baseline:\n');
    for (const f of newOnes.slice(0, 20)) {
      process.stdout.write(`  ${f.file}:${f.line} [${f.rule}] ${f.excerpt}\n`);
    }
    if (newOnes.length > 20) process.stdout.write(`  … and ${newOnes.length - 20} more\n`);
    process.stdout.write('\nFix options:\n');
    process.stdout.write('  - Replace inline ternary with t(lang, "key") + add ja dict entry in src/i18n/index.ts\n');
    process.stdout.write('  - Replace record-field ternary with pickLocalized(record, "field", lang)\n');
    process.stdout.write('  - For COPY map, add a `ja:` entry alongside `zh:` and `en:`\n');
    process.stdout.write('  - Last resort: add `// i18n-allow-hardcode` on the line above (NEEDS rationale comment)\n');
    if (!opts.reportOnly) process.exit(1);
  } else {
    process.stdout.write('\nOK — no new hardcodes beyond baseline.\n');
  }
  if (resolvedKeys.length > 0) {
    process.stdout.write('\nProgress: baseline-tracked keys with reduced/zero count:\n');
    for (const k of resolvedKeys.slice(0, 10)) process.stdout.write(`  ${k}\n`);
    if (resolvedKeys.length > 10) process.stdout.write(`  … and ${resolvedKeys.length - 10} more\n`);
    process.stdout.write('\nRun `--baseline` to re-snapshot once these resolutions are merged.\n');
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
    process.stderr.write(`Layer E error: ${err instanceof Error ? err.stack : String(err)}\n`);
    process.exit(2);
  });
}

// Re-exports for unit tests.
export { scanFile, diffAgainstBaseline, summarize, type Finding, type BaselineEntry };

void dirname; // keep import of dirname available for future use
