// scripts/evals/entity-pages-i18n/check.ts
// ────────────────────────────────────────────────────────────────────────
// Closes the "synthesized page object missing locales" bug class.
//
// src/utils/entity-pages.ts synthesizes page objects at RUNTIME (benchmark
// drilldowns, startup entities, AI-relation labels) — Layer A
// (scripts/lib/i18n-pair.ts) only walks the src/data/*.ts AST and never sees
// these objects, Layer E (source-i18n-hardcode) only catches binary-lang
// ternaries, and the dist check (scripts/i18n-check.mjs) ratchet-baselines
// existing leaks. That blind spot shipped the 2026-07 regression: the
// builders emitted zh + *En template fields only (no *Ja / *Ko), so
// pickLocalized fell through to English on every /ja/ + /ko/ benchmarking
// drilldown and startup entity page — 2220 EN-sentence hits on /ja/ alone.
//
// This eval imports the synthesized arrays and asserts, for every object
// field whose BASE value contains CJK and that has an `*En` sibling, that
// non-empty `*Ja` and `*Ko` siblings exist too. It checks PRESENCE, not
// language: baked fallback chains (`x.fieldJa || x.fieldEn || x.field`) are
// legal — value-level EN residue is the dist ratchet's jurisdiction.
//
// Boundary vs the other i18n gates:
//   Layer A (i18n-pair)        → src/data/*.ts source records
//   THIS EVAL                  → the synthesized view in src/utils/entity-pages.ts
//   localized-rendering (dist) → built HTML actually shows the localized strings
//
// Flags:
//   --dry-run    Skip writing the JSON/MD report
//   --help       Usage
//
// Exit codes:
//   0 — every CJK base field in every synthesized object carries Ja + Ko
//   1 — at least one missing/empty sibling
//   2 — invocation / setup error (entity-pages import failed)

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPORT_DIR = join(import.meta.dirname, 'reports');

interface CliOptions {
  dryRun: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = { dryRun: false };
  for (const a of argv) {
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:entity-pages-i18n [--dry-run]\n' +
          '\nImports the synthesized page arrays from src/utils/entity-pages.ts and\n' +
          'asserts every CJK base field with an `*En` sibling also carries non-empty\n' +
          '`*Ja` + `*Ko` siblings. Guards the 2026-07 En-only-synthesis regression.\n',
      );
      process.exit(0);
    }
  }
  return opts;
}

// Mirror scripts/lib/i18n-pair.ts semantics: only a CJK base value creates a
// localization obligation. Latin/numeric passthroughs (strategyYear, brand
// names like `acquirerEn: 'SoundCloud'`, empty notes) are legal En-only.
const CJK_RE = /[一-鿿]/;
// A key that is itself a locale sibling of an existing base key is never a
// base ("bodyJa" next to "body" must not demand "bodyJaJa").
const SIBLING_SUFFIX_RE = /^(.+)(En|Ja|Ko)$/;
// Raw-data back-references on synthesized pages (page.region → RegionSummary/
// RegionDetail etc.). Those records are src/data/* territory — Layer A's
// jurisdiction — and descending into them would double-report and drown the
// synthesized-field signal this eval exists for.
export const DEFAULT_SKIP_KEYS: ReadonlySet<string> = new Set([
  'region',
  'vertical',
  'startup',
  'unicorn',
  'exit',
  'investor',
  'detail',
  'summary',
  'caseItem',
]);

export interface Violation {
  source: string; // exported array the object came from
  pageKey: string; // page slug / relation level
  path: string; // dotted path to the offending base field
  missing: string[]; // which siblings are absent/empty ('Ja' / 'Ko')
  preview: string; // first chars of the base value, for the report
}

const isStr = (v: unknown): v is string => typeof v === 'string';
const isStrArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);

// A sibling counts only when it actually renders something: non-blank string,
// or non-empty array of non-blank strings. `''` / `[]` / wrong type = missing.
function siblingOk(sib: unknown): boolean {
  if (isStr(sib)) return sib.trim() !== '';
  if (Array.isArray(sib)) return sib.length > 0 && sib.every((s) => isStr(s) && s.trim() !== '');
  return false;
}

/**
 * Pure recursive walker (no fs / process access — unit-testable).
 * For every string / string[] field `k` on any object reachable from `root`:
 *   - skip if `k` is a locale sibling of an existing base key;
 *   - skip if there is no `${k}En` sibling (not a localized pair);
 *   - skip if the base value carries no CJK (proper noun / number / URL);
 *   - otherwise require non-empty `${k}Ja` and `${k}Ko`.
 */
export function walkForMissingSiblings(
  root: unknown,
  source: string,
  pageKey: string,
  skipKeys: ReadonlySet<string> = DEFAULT_SKIP_KEYS,
  maxDepth = 8,
): Violation[] {
  const violations: Violation[] = [];
  const seen = new WeakSet<object>();

  function walk(node: unknown, path: string, depth: number): void {
    if (depth > maxDepth || node === null || typeof node !== 'object') return;
    if (seen.has(node)) return; // cycle guard
    seen.add(node);
    if (Array.isArray(node)) {
      node.forEach((el, i) => walk(el, `${path}[${i}]`, depth + 1));
      return;
    }
    const rec = node as Record<string, unknown>;
    for (const key of Object.keys(rec)) {
      if (skipKeys.has(key)) continue;
      const sib = SIBLING_SUFFIX_RE.exec(key);
      if (sib && sib[1] in rec) continue; // this key IS a locale sibling
      const value = rec[key];
      if (isStr(value) || isStrArray(value)) {
        if (!(`${key}En` in rec)) continue; // no En sibling → not a localized pair
        const baseCjk = isStr(value) ? CJK_RE.test(value) : value.some((s) => CJK_RE.test(s));
        if (!baseCjk) continue;
        const missing = (['Ja', 'Ko'] as const).filter((suffix) => !siblingOk(rec[`${key}${suffix}`]));
        if (missing.length > 0) {
          const previewSrc = isStr(value) ? value : value.join(' / ');
          violations.push({
            source,
            pageKey,
            path: path ? `${path}.${key}` : key,
            missing,
            preview: previewSrc.slice(0, 40),
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        walk(value, path ? `${path}.${key}` : key, depth + 1);
      }
    }
  }

  walk(root, '', 0);
  return violations;
}

interface ScanResult {
  scanned: Array<{ source: string; count: number }>;
  violations: Violation[];
}

function writeReport(result: ScanResult) {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  writeFileSync(
    join(REPORT_DIR, `report-${stamp}.json`),
    JSON.stringify({ generatedAt: new Date().toISOString(), ...result, fail: result.violations.length }, null, 2) +
      '\n',
  );
  const lines = [
    `# Entity-Pages i18n Report — ${stamp}`,
    '',
    result.scanned.map((s) => `${s.source}: ${s.count}`).join(' · '),
    `**Violations: ${result.violations.length}**`,
    '',
  ];
  if (result.violations.length) {
    lines.push('## Missing Ja/Ko siblings on synthesized CJK fields', '');
    for (const v of result.violations) {
      lines.push(`- \`${v.source}\` · \`${v.pageKey}\` · \`${v.path}\` missing ${v.missing.join('+')} — “${v.preview}”`);
    }
    lines.push(
      '',
      '> Fix: synthesize the `*Ja` / `*Ko` sibling in src/utils/entity-pages.ts —',
      '> author the ja/ko template string, or bake a data fallback chain',
      '> (`x.fieldJa || x.fieldEn || x.field`). Never ship an En-only synthesized field.',
      '',
    );
  }
  writeFileSync(join(REPORT_DIR, `report-${stamp}.md`), lines.join('\n'));
}

async function main(): Promise<void> {
  const opts = parseCli(process.argv.slice(2));

  let result: ScanResult;
  try {
    // Lazy import: building the page arrays executes the synthesizers over the
    // full src/data corpus — a syntax error there must exit 2, not throw raw.
    const mod = await import('../../../src/utils/entity-pages.ts');
    const relations = [...new Set(mod.startupEntityPages.map((p) => mod.getStartupAiRelation(p)))];
    const sources = [
      {
        source: 'benchmarkDrilldownPages',
        items: mod.benchmarkDrilldownPages.map((p) => ({ key: p.slug, obj: p as unknown })),
      },
      {
        source: 'startupEntityPages',
        items: mod.startupEntityPages.map((p) => ({ key: p.slug, obj: p as unknown })),
      },
      {
        source: 'startupAiRelations',
        items: relations.map((r) => ({ key: r.level, obj: r as unknown })),
      },
    ];
    result = {
      scanned: sources.map((s) => ({ source: s.source, count: s.items.length })),
      violations: sources.flatMap((s) => s.items.flatMap((it) => walkForMissingSiblings(it.obj, s.source, it.key))),
    };
  } catch (err) {
    process.stderr.write(
      `[entity-pages-i18n] setup error: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}\n`,
    );
    process.exit(2);
  }

  const { scanned, violations } = result;
  process.stdout.write(
    `[entity-pages-i18n] scanned ${scanned.map((s) => `${s.source}=${s.count}`).join(', ')} — violations: ${violations.length}\n`,
  );
  if (violations.length > 0) {
    // Group by source → field path so the console stays readable even when a
    // whole builder regresses (hundreds of per-page hits collapse to a few rows).
    const byField = new Map<string, { count: number; sample: Violation }>();
    for (const v of violations) {
      const k = `${v.source} :: ${v.path.replace(/\[\d+\]/g, '[]')} (missing ${v.missing.join('+')})`;
      const cur = byField.get(k);
      if (cur) cur.count++;
      else byField.set(k, { count: 1, sample: v });
    }
    process.stdout.write('\n[entity-pages-i18n] missing Ja/Ko siblings by synthesized field:\n');
    const rows = [...byField.entries()].sort((a, b) => b[1].count - a[1].count);
    for (const [k, { count, sample }] of rows.slice(0, 50)) {
      process.stdout.write(`  ${String(count).padStart(4)}×  ${k}\n         e.g. ${sample.pageKey} — “${sample.preview}”\n`);
    }
    if (rows.length > 50) process.stdout.write(`  … and ${rows.length - 50} more field groups\n`);
    process.stdout.write(
      '\n  → synthesize the missing *Ja/*Ko in src/utils/entity-pages.ts (author the ja/ko\n' +
        '    template, or bake `x.fieldJa || x.fieldEn || x.field` for data passthroughs)\n',
    );
  }

  if (!opts.dryRun) writeReport(result);
  process.exit(violations.length > 0 ? 1 : 0);
}

// Run as CLI only — importing this module (e.g. from a unit test) must not
// fire the entity-pages import / report write / process.exit.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('entity-pages-i18n/check.ts')) {
  void main();
}
