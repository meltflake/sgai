// scripts/evals/translation/check.ts
// ────────────────────────────────────────────────────────────────────────
// Translation regression eval. Runs scripts/lib/translate.ts (zh→en, zh→ja)
// against a golden corpus and asserts threshold properties:
//
//   1. Glossary fidelity   — proper-noun terms (people, institutions,
//                            programmes) must translate per glossary.json
//   2. Length ratio        — translated text length / source length within
//                            [minLengthRatio, maxLengthRatio]
//   3. Language purity     — en output: no CJK runs
//                            ja output: must contain hiragana/katakana
//   4. Token preservation  — golden's preserveTokens (numbers, dates,
//                            acronyms) must appear verbatim in output
//   5. Required terms      — golden's expectedTermsEn / expectedTermsJa
//                            must appear (≥80% hit rate)
//
// Why threshold not exact-match: translate.ts hits Claude haiku, output is
// non-deterministic. We assert quality bands instead of byte-equality.
//
// Cost: each golden source × each direction = one Claude haiku call. With
// caching enabled (cacheDir), repeat runs over the same goldens are free.
// Plan: 10 zh→en + 10 zh→ja goldens → first run is ~20 calls (~$0.01),
// subsequent runs are 0 unless --force.
//
// Usage:
//   npx tsx scripts/evals/translation/check.ts                         # all
//   npx tsx scripts/evals/translation/check.ts --direction=zh-en       # one direction
//   npx tsx scripts/evals/translation/check.ts --case=policy-mddi-1b   # one case (both dirs)
//   npx tsx scripts/evals/translation/check.ts --force                 # bypass cache
//   npx tsx scripts/evals/translation/check.ts --dry-run               # parse golden, no LLM
//
// Exit codes:
//   0 — pass (or skipped, see below)
//   1 — at least one assertion failed
//   2 — invocation / golden file error

import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

import { translateOne, type TranslateDirection } from '../../lib/translate.ts';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const GOLDEN_DIR = resolve(import.meta.dirname, 'golden');
const REPORT_DIR = resolve(import.meta.dirname, 'reports');
const CACHE_DIR = resolve(import.meta.dirname, 'cache');
const GLOSSARY_PATH = resolve(import.meta.dirname, 'glossary.json');

interface GoldenCase {
  id: string;
  description?: string;
  source: string;
  expectedTermsEn?: string[];
  expectedTermsJa?: string[];
  minLengthRatio: number;
  maxLengthRatio: number;
  preserveTokens?: string[];
}

interface GlossaryTerm {
  en?: string[];
  ja?: string[];
}

interface Glossary {
  [section: string]: { [zhTerm: string]: GlossaryTerm } | string;
}

interface Assertion {
  name: string;
  passed: boolean;
  detail?: string;
}

interface CaseResult {
  id: string;
  direction: TranslateDirection;
  passed: boolean;
  assertions: Assertion[];
  output?: string;
  error?: string;
}

interface CliOptions {
  caseId?: string;
  direction?: TranslateDirection;
  force: boolean;
  dryRun: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = { force: false, dryRun: false };
  for (const a of argv) {
    if (a === '--force') opts.force = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a.startsWith('--case=')) opts.caseId = a.slice('--case='.length);
    else if (a.startsWith('--direction=')) {
      const v = a.slice('--direction='.length).replace('-', '→') as TranslateDirection;
      if (v !== 'zh→en' && v !== 'zh→ja') {
        process.stderr.write(`Unsupported direction: ${v}. Use zh-en or zh-ja.\n`);
        process.exit(2);
      }
      opts.direction = v;
    } else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:translation [--direction=zh-en|zh-ja] [--case=<id>] [--force] [--dry-run]\n',
      );
      process.exit(0);
    }
  }
  return opts;
}

function loadGoldens(direction: TranslateDirection): GoldenCase[] {
  const subdir = direction === 'zh→en' ? 'zh-en' : 'zh-ja';
  const dir = join(GOLDEN_DIR, subdir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      try {
        return JSON.parse(readFileSync(join(dir, f), 'utf8')) as GoldenCase;
      } catch (err) {
        throw new Error(`Malformed golden ${subdir}/${f}: ${(err as Error).message}`);
      }
    });
}

function loadGlossary(): Glossary | null {
  if (!existsSync(GLOSSARY_PATH)) return null;
  try {
    return JSON.parse(readFileSync(GLOSSARY_PATH, 'utf8')) as Glossary;
  } catch {
    return null;
  }
}

function claudeAvailable(): boolean {
  if (process.env.SGAI_EVAL_FORCE_CLAUDE === '1') return true;
  const bin = process.env.SGAI_CLAUDE_BIN || 'claude';
  const r = spawnSync(bin, ['--version'], { stdio: 'ignore' });
  return r.status === 0;
}

const CJK_RE = /[㐀-䶿一-鿿]/;
const HIRAGANA_KATAKANA_RE = /[぀-ゟ゠-ヿ]/;

function termsHitAssert(name: string, haystack: string, terms: string[]): Assertion {
  if (terms.length === 0) return { name, passed: true, detail: 'no terms required' };
  const missing = terms.filter((t) => !haystack.toLowerCase().includes(t.toLowerCase()));
  const hits = terms.length - missing.length;
  const rate = hits / terms.length;
  return rate >= 0.8
    ? { name, passed: true, detail: `${hits}/${terms.length} hit` }
    : { name, passed: false, detail: `missing: ${missing.join(', ')}` };
}

/** For a zh source containing a glossary key, the translated output must
 *  include at least one of the allowed translations for the target lang. */
function glossaryAssertions(
  source: string,
  output: string,
  direction: TranslateDirection,
  glossary: Glossary | null,
): Assertion[] {
  if (!glossary) return [];
  const targetLang: 'en' | 'ja' = direction === 'zh→en' ? 'en' : 'ja';
  const out: Assertion[] = [];
  for (const [section, terms] of Object.entries(glossary)) {
    if (typeof terms !== 'object') continue;
    for (const [zhTerm, expectations] of Object.entries(terms)) {
      if (!source.includes(zhTerm)) continue;
      const allowed = expectations[targetLang] ?? [];
      if (allowed.length === 0) continue;
      const matched = allowed.find((t) => output.includes(t));
      out.push({
        name: `glossary.${section}.${zhTerm}`,
        passed: !!matched,
        detail: matched ? `→ ${matched}` : `expected one of [${allowed.join(', ')}]`,
      });
    }
  }
  return out;
}

function evaluate(
  c: GoldenCase,
  direction: TranslateDirection,
  output: string,
  glossary: Glossary | null,
): Assertion[] {
  const a: Assertion[] = [];

  // Length ratio.
  const ratio = output.length / Math.max(1, c.source.length);
  a.push({
    name: 'length.ratio',
    passed: ratio >= c.minLengthRatio && ratio <= c.maxLengthRatio,
    detail: `ratio ${ratio.toFixed(2)} (allowed [${c.minLengthRatio}, ${c.maxLengthRatio}])`,
  });

  // Purity.
  if (direction === 'zh→en') {
    const cjk = output.match(CJK_RE);
    a.push({
      name: 'purity.no-cjk',
      passed: !cjk,
      detail: cjk ? `found CJK char "${cjk[0]}"` : 'no CJK',
    });
  }
  if (direction === 'zh→ja') {
    a.push({
      name: 'purity.has-kana',
      passed: HIRAGANA_KATAKANA_RE.test(output),
      detail: HIRAGANA_KATAKANA_RE.test(output) ? 'kana present' : 'NO hiragana/katakana — likely under-translated',
    });
  }

  // Token preservation.
  if (c.preserveTokens) {
    for (const tok of c.preserveTokens) {
      a.push({
        name: `preserve.${tok}`,
        passed: output.includes(tok),
        detail: output.includes(tok) ? '' : `missing token "${tok}"`,
      });
    }
  }

  // Required terms.
  if (direction === 'zh→en' && c.expectedTermsEn) {
    a.push(termsHitAssert('terms.en', output, c.expectedTermsEn));
  }
  if (direction === 'zh→ja' && c.expectedTermsJa) {
    a.push(termsHitAssert('terms.ja', output, c.expectedTermsJa));
  }

  // Glossary fidelity.
  a.push(...glossaryAssertions(c.source, output, direction, glossary));

  return a;
}

function todayStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function writeReport(results: CaseResult[]): { jsonPath: string; mdPath: string } {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = todayStamp();
  const jsonPath = join(REPORT_DIR, `report-${stamp}.json`);
  const mdPath = join(REPORT_DIR, `report-${stamp}.md`);

  const payload = {
    generatedAt: new Date().toISOString(),
    totals: {
      cases: results.length,
      passed: results.filter((r) => r.passed).length,
      failed: results.filter((r) => !r.passed).length,
    },
    results,
  };
  writeFileSync(jsonPath, JSON.stringify(payload, null, 2));

  const lines: string[] = [`# Translation Eval Report — ${stamp}`, ''];
  lines.push(`- Cases: ${payload.totals.cases}`);
  lines.push(`- Passed: ${payload.totals.passed}`);
  lines.push(`- Failed: ${payload.totals.failed}`);
  lines.push('');
  for (const r of results) {
    const tag = r.passed ? 'PASS' : 'FAIL';
    lines.push(`## [${tag}] ${r.id} (${r.direction})`);
    if (r.error) {
      lines.push('');
      lines.push(`Error: \`${r.error}\``);
      lines.push('');
      continue;
    }
    if (r.output) {
      lines.push('');
      lines.push(`> ${r.output.replace(/\n/g, ' ')}`);
      lines.push('');
    }
    for (const a of r.assertions) {
      const at = a.passed ? '✓' : '✗';
      lines.push(`- ${at} ${a.name}${a.detail ? ` — ${a.detail}` : ''}`);
    }
    lines.push('');
  }
  writeFileSync(mdPath, lines.join('\n'));
  return { jsonPath, mdPath };
}

async function runOne(
  c: GoldenCase,
  direction: TranslateDirection,
  glossary: Glossary | null,
  force: boolean,
): Promise<CaseResult> {
  try {
    const output = await translateOne(c.source, {
      direction,
      cacheDir: CACHE_DIR,
      force,
    });
    const assertions = evaluate(c, direction, output, glossary);
    return {
      id: c.id,
      direction,
      passed: assertions.every((a) => a.passed),
      assertions,
      output,
    };
  } catch (err) {
    return {
      id: c.id,
      direction,
      passed: false,
      assertions: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main() {
  const opts = parseCli(process.argv.slice(2));
  const directions: TranslateDirection[] = opts.direction ? [opts.direction] : ['zh→en', 'zh→ja'];
  const glossary = loadGlossary();

  const work: { case: GoldenCase; direction: TranslateDirection }[] = [];
  for (const d of directions) {
    for (const g of loadGoldens(d)) {
      if (opts.caseId && g.id !== opts.caseId) continue;
      work.push({ case: g, direction: d });
    }
  }

  if (work.length === 0) {
    process.stdout.write('No matching golden cases.\n');
    process.exit(0);
  }

  if (opts.dryRun) {
    process.stdout.write(`Would run ${work.length} translation case(s):\n`);
    for (const w of work) process.stdout.write(`  - ${w.case.id} (${w.direction})\n`);
    process.exit(0);
  }

  if (!claudeAvailable()) {
    process.stdout.write(
      'claude CLI not on PATH — skipping Translation eval (set SGAI_EVAL_FORCE_CLAUDE=1 to force).\n',
    );
    process.exit(0);
  }

  process.stdout.write(`Running ${work.length} translation case(s)…\n`);
  const results: CaseResult[] = [];
  for (const w of work) {
    process.stdout.write(`  [${w.case.id}/${w.direction}] `);
    const r = await runOne(w.case, w.direction, glossary, opts.force);
    results.push(r);
    if (r.error) process.stdout.write(`ERROR — ${r.error}\n`);
    else process.stdout.write(r.passed ? 'PASS\n' : `FAIL (${r.assertions.filter((a) => !a.passed).length})\n`);
  }

  const { mdPath } = writeReport(results);
  process.stdout.write(`\nReport: ${relative(REPO_ROOT, mdPath)}\n`);

  const failed = results.filter((r) => !r.passed);
  if (failed.length === 0) {
    process.stdout.write(`All ${results.length} case(s) passed.\n`);
    process.exit(0);
  }
  process.stdout.write(`\n${failed.length} case(s) failed:\n`);
  for (const r of failed) {
    if (r.error) {
      process.stdout.write(`  ${r.id}/${r.direction} — ${r.error}\n`);
      continue;
    }
    for (const a of r.assertions.filter((x) => !x.passed)) {
      process.stdout.write(`  ${r.id}/${r.direction} :: ${a.name} — ${a.detail ?? ''}\n`);
    }
  }
  process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`Eval error: ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(2);
});
