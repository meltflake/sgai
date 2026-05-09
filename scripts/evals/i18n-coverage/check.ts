// scripts/evals/i18n-coverage/check.ts
// ────────────────────────────────────────────────────────────────────────
// i18n Coverage eval — four-layer check that every page + record is
// truly trilingual (zh / en / ja) end-to-end.
//
// Layer A — DATA (this file's primary scope, --layer=a):
//   For every src/data/*.ts, walk the AST and assert every record's
//   user-visible CJK string field has both `*En` and `*Ja` siblings.
//   Wraps lib/i18n-pair.ts:findUnpairedFields with locales=['en','ja']
//   over the full data dir, and produces a coverage % per file.
//
// Layer B — SITEMAP parity (--layer=b):
//   After build, parse dist/sitemap-*.xml and assert every URL has
//   a zh / en / ja sibling. Allow-list single-locale blog posts.
//
// Layer C — HREFLANG parity (--layer=c):
//   Walk dist/**/*.html, assert <link rel=alternate hreflang=...> covers
//   zh-CN / en / ja / x-default.
//
// Layer D — PURITY (--layer=d):
//   en pages: no CJK.
//   ja pages: must contain hiragana/katakana (catches "shipped en text
//   under /ja/ slug" mistakes).
//
// Default (no --layer flag) runs Layer A only — the only zero-cost,
// no-build-required gate. Layers B/C/D require `npm run build` first.
//
// Usage:
//   npx tsx scripts/evals/i18n-coverage/check.ts                  # Layer A
//   npx tsx scripts/evals/i18n-coverage/check.ts --layer=a
//   npx tsx scripts/evals/i18n-coverage/check.ts --layer=a,d
//   npx tsx scripts/evals/i18n-coverage/check.ts --layer=all      # all four
//
// Exit codes:
//   0 — every selected layer passes
//   1 — at least one layer flagged failures
//   2 — invocation error

import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync, statSync, realpathSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import * as ts from 'typescript';

import { findUnpairedFields, type UnpairedField } from '../../lib/i18n-pair.ts';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const DATA_DIR = join(REPO_ROOT, 'src', 'data');
const DIST_DIR = join(REPO_ROOT, 'dist');
const REPORT_DIR = join(import.meta.dirname, 'reports');

const LOCALES = ['en', 'ja'] as const;

type Layer = 'a' | 'b' | 'c' | 'd';

interface CliOptions {
  layers: Set<Layer>;
}

function parseCli(argv: string[]): CliOptions {
  let layersStr = 'a';
  for (const a of argv) {
    if (a.startsWith('--layer=')) layersStr = a.slice('--layer='.length);
    else if (a === '--help' || a === '-h') {
      process.stdout.write('Usage: eval:i18n [--layer=a|b|c|d|a,d|all]\n');
      process.exit(0);
    }
  }
  if (layersStr === 'all') return { layers: new Set(['a', 'b', 'c', 'd']) };
  const set = new Set<Layer>();
  for (const tok of layersStr.split(',').map((s) => s.trim())) {
    if (tok === 'a' || tok === 'b' || tok === 'c' || tok === 'd') set.add(tok);
    else {
      process.stderr.write(`Unknown layer: ${tok}\n`);
      process.exit(2);
    }
  }
  return { layers: set };
}

// ── Layer A: data-level completeness ────────────────────────────────────

interface ImpureField {
  file: string;
  line: number;
  field: string;
  locale: 'en' | 'ja';
  reason: string;
  /** First 60 chars of the offending value for the report. */
  preview: string;
}

interface FileResult {
  file: string;
  unpaired: UnpairedField[];
  impure: ImpureField[];
  cjkFieldsScanned: number;
}

function listDataFiles(): string[] {
  return readdirSync(DATA_DIR)
    .filter((n) => n.endsWith('.ts'))
    .map((n) => join(DATA_DIR, n));
}

function countCjkFields(filePath: string): number {
  const src = readFileSync(filePath, 'utf8');
  const lines = src.split('\n');
  let n = 0;
  const fieldRe = /^\s*([a-zA-Z_$][\w$]*)\s*:\s*['"`]([^'"`\n]*)['"`]/;
  for (const line of lines) {
    const m = fieldRe.exec(line);
    if (!m) continue;
    const name = m[1];
    const value = m[2];
    if (/(En|Ja|Zh)$/.test(name)) continue;
    if (/[一-鿿]/.test(value)) n++;
  }
  return n;
}

/** Verify a string value's actual language matches its declared locale.
 *
 *  EN fields must contain no CJK whatsoever — names that need transliteration
 *  should already have been romanised. The previous backfill regression where
 *  En siblings ended up holding raw zh values would have been flagged here.
 *
 *  JA fields are checked against a curated set of simplified-Chinese-exclusive
 *  characters whose JIS Japanese kanji equivalent uses a different codepoint
 *  (战 zh / 戦 ja, 经 zh / 経 ja, 转 zh / 転 ja, 这 zh / no-ja-kanji,
 *  问 zh / 問 ja, etc.). Hitting any of these in a *Ja field means the
 *  AI translator slipped or someone copy-pasted zh content into the slot.
 *  Curated set must stay in sync with scripts/i18n-check.mjs's tier-1 set.
 *
 *  We deliberately don't gate on "must contain hiragana/katakana" — many
 *  legitimate JA labels are kanji-only (出典, 投入強度, 第二期, 議会討論). */
const SIMPLIFIED_ONLY_RE =
  /[们这个让给还经历战业长进应时现过对边远难听说话网决织续选责险验总较单风转务习头质闻关开师龙标异该后处见级观产场际线门约电汉东种钟严员问纸读买卖钱实询试讲请运银项报]/;
const ANY_CJK_RE = /[一-鿿぀-ゟ゠-ヿ]/;

export function checkLocaleValuePurity(
  value: string,
  locale: 'en' | 'ja'
): { ok: true } | { ok: false; reason: string } {
  if (locale === 'en') {
    const m = value.match(ANY_CJK_RE);
    if (m) return { ok: false, reason: `EN value contains CJK char "${m[0]}"` };
    return { ok: true };
  }
  // locale === 'ja'
  const m = value.match(SIMPLIFIED_ONLY_RE);
  if (m) return { ok: false, reason: `JA value contains simplified-Chinese-only char "${m[0]}"` };
  return { ok: true };
}

/** Walk a TypeScript data file, find every `*En` / `*Ja` PropertyAssignment
 *  whose initializer is a string literal or no-substitution template, run
 *  the value through `checkLocaleValuePurity`, and return all violations.
 *
 *  Only string-literal initializers are checked. Computed values, arrays,
 *  and identifier references are skipped — checking those would require
 *  evaluating expressions and isn't worth the false-positive risk. */
export function findImpureLocaleFields(filePath: string): ImpureField[] {
  const src = readFileSync(filePath, 'utf8');
  const sf = ts.createSourceFile(filePath, src, ts.ScriptTarget.Latest, /* setParentNodes */ false);
  const out: ImpureField[] = [];

  function visit(node: ts.Node): void {
    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name)) {
      const name = node.name.text;
      const m = name.match(/^(.+?)(En|Ja)$/);
      if (m) {
        const suffix = m[2];
        const locale: 'en' | 'ja' = suffix === 'En' ? 'en' : 'ja';
        const init = node.initializer;
        let text: string | null = null;
        if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) {
          text = init.text;
        }
        if (text !== null && text.length > 0) {
          const r = checkLocaleValuePurity(text, locale);
          if (!r.ok) {
            const lineCol = sf.getLineAndCharacterOfPosition(node.getStart(sf));
            out.push({
              file: relative(REPO_ROOT, filePath),
              line: lineCol.line + 1,
              field: name,
              locale,
              reason: r.reason,
              preview: text.slice(0, 60),
            });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);
  return out;
}

function runLayerA(): {
  results: FileResult[];
  totalUnpaired: number;
  totalImpure: number;
  passed: boolean;
} {
  const files = listDataFiles();
  const results: FileResult[] = [];
  let totalUnpaired = 0;
  let totalImpure = 0;
  for (const f of files) {
    const unpaired = findUnpairedFields(f, { locales: [...LOCALES] });
    const impure = findImpureLocaleFields(f);
    const cjk = countCjkFields(f);
    results.push({ file: relative(REPO_ROOT, f), unpaired, impure, cjkFieldsScanned: cjk });
    totalUnpaired += unpaired.length;
    totalImpure += impure.length;
  }
  return {
    results,
    totalUnpaired,
    totalImpure,
    passed: totalUnpaired === 0 && totalImpure === 0,
  };
}

// ── Layer B: sitemap parity ─────────────────────────────────────────────

function findSitemapFiles(): string[] {
  if (!existsSync(DIST_DIR)) return [];
  const out: string[] = [];
  for (const name of readdirSync(DIST_DIR)) {
    if (/^sitemap.*\.xml$/.test(name)) out.push(join(DIST_DIR, name));
  }
  return out;
}

function extractSitemapUrls(xmlPath: string): string[] {
  const xml = readFileSync(xmlPath, 'utf8');
  const out: string[] = [];
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) out.push(m[1]);
  return out;
}

interface SitemapIssue {
  url: string;
  missing: string[];
}

function classifyUrl(u: string, origin: string): { lang: 'en' | 'zh' | 'ja'; path: string } | null {
  if (!u.startsWith(origin)) return null;
  const tail = u.slice(origin.length);
  if (tail.startsWith('/zh/') || tail === '/zh') return { lang: 'zh', path: tail.replace(/^\/zh/, '') || '/' };
  if (tail.startsWith('/ja/') || tail === '/ja') return { lang: 'ja', path: tail.replace(/^\/ja/, '') || '/' };
  return { lang: 'en', path: tail || '/' };
}

function runLayerB(): { issues: SitemapIssue[]; totalUrls: number; passed: boolean; skipped: boolean } {
  const sitemaps = findSitemapFiles();
  if (sitemaps.length === 0) return { issues: [], totalUrls: 0, passed: false, skipped: true };

  const urls = sitemaps.flatMap(extractSitemapUrls);
  if (urls.length === 0) return { issues: [], totalUrls: 0, passed: false, skipped: true };

  const first = urls[0];
  const m = first.match(/^(https?:\/\/[^/]+)/);
  const origin = m ? m[1] : '';

  const byPath = new Map<string, Set<'en' | 'zh' | 'ja'>>();
  for (const u of urls) {
    const c = classifyUrl(u, origin);
    if (!c) continue;
    const set = byPath.get(c.path) ?? new Set();
    set.add(c.lang);
    byPath.set(c.path, set);
  }

  // Single-locale-allowed paths: blog/fieldnotes/updates can be partially translated.
  // Everywhere else, three-language parity is required.
  const SINGLE_OK = /^\/(blog|fieldnotes|updates)\//;

  const issues: SitemapIssue[] = [];
  for (const [path, langs] of byPath) {
    const missing: string[] = [];
    if (!langs.has('en')) missing.push('en');
    if (!langs.has('zh')) missing.push('zh');
    if (!langs.has('ja')) missing.push('ja');
    if (missing.length === 0) continue;
    if (SINGLE_OK.test(path)) continue;
    issues.push({ url: `${origin}${path}`, missing });
  }

  return { issues, totalUrls: byPath.size, passed: issues.length === 0, skipped: false };
}

// ── Layer C: hreflang parity ────────────────────────────────────────────

interface HreflangIssue {
  file: string;
  missing: string[];
}

function* walkHtml(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) yield* walkHtml(full);
    else if (name.endsWith('.html')) yield full;
  }
}

function extractHreflangs(html: string): Set<string> {
  const out = new Set<string>();
  for (const m of html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["']/g)) out.add(m[1]);
  for (const m of html.matchAll(/<link[^>]+hreflang=["']([^"']+)["'][^>]+rel=["']alternate["']/g)) out.add(m[1]);
  return out;
}

function runLayerC(): { issues: HreflangIssue[]; totalPages: number; passed: boolean; skipped: boolean } {
  if (!existsSync(DIST_DIR)) return { issues: [], totalPages: 0, passed: false, skipped: true };
  const required = ['zh-CN', 'en', 'ja', 'x-default'];
  const issues: HreflangIssue[] = [];
  let total = 0;
  for (const file of walkHtml(DIST_DIR)) {
    total++;
    const html = readFileSync(file, 'utf8');
    const tags = extractHreflangs(html);
    const missing = required.filter((r) => !tags.has(r));
    if (missing.length > 0) {
      issues.push({ file: relative(REPO_ROOT, file), missing });
    }
  }
  return { issues, totalPages: total, passed: issues.length === 0, skipped: false };
}

// ── Layer D: language purity ────────────────────────────────────────────
//
// Delegates to scripts/i18n-check.mjs for the heavy lifting — that script
// already encodes the canonical allow-list for legitimate cross-locale
// strings (lang switcher labels, banner copy) and the kana-context
// heuristic for ja pages. Reinventing that here was producing thousands
// of false positives on the language toggle widget.
//
// Layer D runs i18n-check.mjs once per non-default locale (en, ja) and
// rolls up exit codes + line counts.

interface PurityRunResult {
  locale: string;
  exitCode: number;
  output: string;
}

function runLayerD(): {
  results: PurityRunResult[];
  passed: boolean;
  skipped: boolean;
} {
  if (!existsSync(DIST_DIR)) return { results: [], passed: false, skipped: true };
  const results: PurityRunResult[] = [];
  for (const lang of ['en', 'ja']) {
    const r = spawnSync('node', ['scripts/i18n-check.mjs', '--lang', lang], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    results.push({
      locale: lang,
      exitCode: r.status ?? 1,
      output: (r.stdout || '') + (r.stderr || ''),
    });
  }
  const passed = results.every((r) => r.exitCode === 0);
  return { results, passed, skipped: false };
}

// ── Reporting ───────────────────────────────────────────────────────────

function todayStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function writeReport(payload: object, layers: Set<Layer>): { mdPath: string; jsonPath: string } {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = todayStamp();
  const layersTag = [...layers].sort().join('');
  const jsonPath = join(REPORT_DIR, `report-${stamp}-layer${layersTag}.json`);
  const mdPath = join(REPORT_DIR, `report-${stamp}-layer${layersTag}.md`);
  writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
  return { mdPath, jsonPath };
}

interface Summary {
  layer: string;
  passed: boolean;
  details: string;
}

async function main() {
  const opts = parseCli(process.argv.slice(2));
  const summaries: Summary[] = [];
  const fullPayload: Record<string, unknown> = { generatedAt: new Date().toISOString() };
  let allPassed = true;

  if (opts.layers.has('a')) {
    process.stdout.write('Layer A — data record completeness + locale purity…\n');
    const r = runLayerA();
    fullPayload.layerA = r;
    const totalCjk = r.results.reduce((acc, x) => acc + x.cjkFieldsScanned, 0);
    const cov = totalCjk === 0 ? 100 : Math.round(((totalCjk - r.totalUnpaired) / totalCjk) * 100);
    summaries.push({
      layer: 'A',
      passed: r.passed,
      details:
        `${r.totalUnpaired} unpaired + ${r.totalImpure} impure across ${r.results.length} files ` +
        `(pairing coverage ~${cov}% of ${totalCjk} CJK fields)`,
    });
    if (!r.passed) {
      allPassed = false;
      // Surface unpaired (sibling missing) findings first.
      const topUnpaired = r.results.filter((x) => x.unpaired.length > 0).slice(0, 5);
      for (const t of topUnpaired) {
        process.stdout.write(`  ${t.file}: ${t.unpaired.length} unpaired\n`);
        for (const u of t.unpaired.slice(0, 3)) {
          process.stdout.write(`    L${u.line} ${u.field}[${u.locale}] (${u.reason})\n`);
        }
      }
      // Then surface impure (wrong-language) findings — these are often
      // the higher-value catch because they mean a backfill or AI
      // translation slipped raw zh into a *Ja slot.
      const topImpure = r.results.filter((x) => x.impure.length > 0).slice(0, 5);
      for (const t of topImpure) {
        process.stdout.write(`  ${t.file}: ${t.impure.length} impure\n`);
        for (const i of t.impure.slice(0, 3)) {
          process.stdout.write(`    L${i.line} ${i.field}: ${i.reason} — "${i.preview}…"\n`);
        }
      }
    }
  }

  if (opts.layers.has('b')) {
    process.stdout.write('Layer B — sitemap parity…\n');
    const r = runLayerB();
    fullPayload.layerB = r;
    if (r.skipped) {
      summaries.push({ layer: 'B', passed: false, details: 'SKIPPED: dist/sitemap-*.xml not found. Run `npm run build` first.' });
      allPassed = false;
    } else {
      summaries.push({
        layer: 'B',
        passed: r.passed,
        details: `${r.issues.length}/${r.totalUrls} paths missing locale siblings`,
      });
      if (!r.passed) allPassed = false;
      for (const i of r.issues.slice(0, 5)) process.stdout.write(`  ${i.url} missing: ${i.missing.join(', ')}\n`);
    }
  }

  if (opts.layers.has('c')) {
    process.stdout.write('Layer C — hreflang parity…\n');
    const r = runLayerC();
    fullPayload.layerC = r;
    if (r.skipped) {
      summaries.push({ layer: 'C', passed: false, details: 'SKIPPED: dist/ not found. Run `npm run build` first.' });
      allPassed = false;
    } else {
      summaries.push({
        layer: 'C',
        passed: r.passed,
        details: `${r.issues.length}/${r.totalPages} pages missing required hreflang tags`,
      });
      if (!r.passed) allPassed = false;
      for (const i of r.issues.slice(0, 5)) process.stdout.write(`  ${i.file} missing: ${i.missing.join(', ')}\n`);
    }
  }

  if (opts.layers.has('d')) {
    process.stdout.write('Layer D — language purity (delegated to scripts/i18n-check.mjs)…\n');
    const r = runLayerD();
    fullPayload.layerD = r;
    if (r.skipped) {
      summaries.push({ layer: 'D', passed: false, details: 'SKIPPED: dist/ not found. Run `npm run build` first.' });
      allPassed = false;
    } else {
      const failed = r.results.filter((x) => x.exitCode !== 0).map((x) => x.locale);
      summaries.push({
        layer: 'D',
        passed: r.passed,
        details: r.passed ? 'all locales clean' : `failures in: ${failed.join(', ')}`,
      });
      if (!r.passed) {
        allPassed = false;
        for (const x of r.results) {
          if (x.exitCode === 0) continue;
          process.stdout.write(`  --- ${x.locale} ---\n`);
          // Only first 8 lines per locale; full output already in JSON report.
          for (const line of x.output.split('\n').slice(0, 8)) process.stdout.write(`  ${line}\n`);
        }
      }
    }
  }

  const { mdPath, jsonPath } = writeReport(fullPayload, opts.layers);
  const md: string[] = [`# i18n Coverage Report — ${todayStamp()}`, ''];
  for (const s of summaries) {
    const tag = s.passed ? 'PASS' : 'FAIL';
    md.push(`- **${tag}** — Layer ${s.layer}: ${s.details}`);
  }
  writeFileSync(mdPath, md.join('\n') + '\n');

  process.stdout.write('\n--- Summary ---\n');
  for (const s of summaries) process.stdout.write(`  [${s.passed ? 'PASS' : 'FAIL'}] Layer ${s.layer}: ${s.details}\n`);
  process.stdout.write(`Report: ${relative(REPO_ROOT, mdPath)}\n`);
  process.stdout.write(`        ${relative(REPO_ROOT, jsonPath)}\n`);

  process.exit(allPassed ? 0 : 1);
}

/** Run main() only when this file is the process entry point — not when
 *  imported by tests. tsx normalises CLI argv to a real path, so a
 *  realpath comparison against `import.meta.url` is the canonical
 *  ESM-friendly entrypoint check. */
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
    process.stderr.write(`Eval error: ${err instanceof Error ? err.stack : String(err)}\n`);
    process.exit(2);
  });
}
