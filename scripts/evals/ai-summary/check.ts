// scripts/evals/ai-summary/check.ts
// ────────────────────────────────────────────────────────────────────────
// AI Summary regression eval. Runs scripts/lib/ai-summarize.ts against a
// golden corpus and asserts threshold-based properties of the output.
//
// Why threshold-based? LLM output is non-deterministic. We can't assert
// equal-string. We CAN assert:
//   - JSON schema validity (required fields, types)
//   - Closed-set classification (category in caller-supplied list)
//   - Length within ±30% of golden expected ranges
//   - Required terms (people / institutions / programmes) appear in output
//   - Self-reported confidence ≥ minimum threshold
//   - publishedDate matches expected (or both null)
//
// Cost: each golden case is one Claude haiku call. Cache hits skip the
// network. Plan to keep golden corpus ≤20 cases so monthly run stays
// under a couple cents.
//
// Usage:
//   npx tsx scripts/evals/ai-summary/check.ts             # all golden cases
//   npx tsx scripts/evals/ai-summary/check.ts --case=<id> # single case
//   npx tsx scripts/evals/ai-summary/check.ts --force     # bypass cache
//   npx tsx scripts/evals/ai-summary/check.ts --dry-run   # parse golden, no LLM
//
// Exit codes:
//   0 — all cases pass (or skipped because claude CLI missing)
//   1 — at least one case fails an assertion
//   2 — invocation error / malformed golden file

import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

import { summarizePage, type BilingualSummary } from '../../lib/ai-summarize.ts';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const GOLDEN_DIR = resolve(import.meta.dirname, 'golden');
const REPORT_DIR = resolve(import.meta.dirname, 'reports');
const CACHE_DIR = resolve(import.meta.dirname, 'cache');

type Confidence = 'high' | 'medium' | 'low';
const CONFIDENCE_RANK: Record<Confidence, number> = { low: 0, medium: 1, high: 2 };

interface GoldenCase {
  id: string;
  description?: string;
  input: { sourceUrl: string; title: string; contentText: string };
  expected: {
    categories: string[];
    domainContext?: string;
    category?: string;
    publishedDate?: string | null;
    minTitleZhLen?: number;
    maxTitleZhLen?: number;
    minDescZhLen?: number;
    maxDescZhLen?: number;
    minDescEnLen?: number;
    maxDescEnLen?: number;
    minConfidence?: Confidence;
    expectLowConfidence?: boolean;
    requiredTermsZh: string[];
    requiredTermsEn: string[];
  };
}

interface Assertion {
  name: string;
  passed: boolean;
  detail?: string;
}

interface CaseResult {
  id: string;
  passed: boolean;
  assertions: Assertion[];
  output?: BilingualSummary;
  error?: string;
}

interface CliOptions {
  caseId?: string;
  force: boolean;
  dryRun: boolean;
}

function parseCli(argv: string[]): CliOptions {
  const opts: CliOptions = { force: false, dryRun: false };
  for (const a of argv) {
    if (a === '--force') opts.force = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a.startsWith('--case=')) opts.caseId = a.slice('--case='.length);
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: eval:ai-summary [--case=<id>] [--force] [--dry-run]\n',
      );
      process.exit(0);
    }
  }
  return opts;
}

function loadGolden(): GoldenCase[] {
  if (!existsSync(GOLDEN_DIR)) return [];
  const files = readdirSync(GOLDEN_DIR).filter((f) => f.endsWith('.json'));
  return files.map((f) => {
    const path = join(GOLDEN_DIR, f);
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as GoldenCase;
    } catch (err) {
      throw new Error(`Malformed golden file ${f}: ${(err as Error).message}`);
    }
  });
}

function claudeAvailable(): boolean {
  if (process.env.SGAI_EVAL_FORCE_CLAUDE === '1') return true;
  const bin = process.env.SGAI_CLAUDE_BIN || 'claude';
  const r = spawnSync(bin, ['--version'], { stdio: 'ignore' });
  return r.status === 0;
}

function lengthAssert(name: string, value: string, min?: number, max?: number): Assertion {
  const len = value.length;
  if (min !== undefined && len < min) {
    return { name, passed: false, detail: `length ${len} < min ${min}` };
  }
  if (max !== undefined && len > max) {
    return { name, passed: false, detail: `length ${len} > max ${max}` };
  }
  return { name, passed: true, detail: `length ${len}` };
}

function termsAssert(name: string, haystack: string, terms: string[]): Assertion {
  if (terms.length === 0) return { name, passed: true, detail: 'no terms required' };
  const missing = terms.filter((t) => !haystack.toLowerCase().includes(t.toLowerCase()));
  const hitRate = (terms.length - missing.length) / terms.length;
  if (hitRate >= 0.8) return { name, passed: true, detail: `${terms.length - missing.length}/${terms.length} hit` };
  return { name, passed: false, detail: `missing: ${missing.join(', ')}` };
}

function evaluate(c: GoldenCase, summary: BilingualSummary): Assertion[] {
  const a: Assertion[] = [];
  const x = c.expected;

  // Schema: required fields present.
  for (const k of ['title', 'titleEn', 'description', 'descriptionEn', 'category', 'confidence'] as const) {
    a.push({
      name: `schema.${k}`,
      passed: typeof summary[k] === 'string' && (summary[k] as string).length > 0,
      detail: summary[k] ? '' : 'missing',
    });
  }

  // Category in closed-set.
  a.push({
    name: 'category.in-closed-set',
    passed: x.categories.includes(summary.category),
    detail: `got "${summary.category}"`,
  });

  // Category matches expected (only if golden specifies one).
  if (x.category) {
    a.push({
      name: 'category.match',
      passed: summary.category === x.category,
      detail: `expected "${x.category}", got "${summary.category}"`,
    });
  }

  // publishedDate match.
  if (x.publishedDate !== undefined) {
    a.push({
      name: 'publishedDate.match',
      passed: (summary.publishedDate ?? null) === (x.publishedDate ?? null),
      detail: `expected ${x.publishedDate}, got ${summary.publishedDate}`,
    });
  }

  // Confidence threshold.
  if (x.minConfidence) {
    const got = CONFIDENCE_RANK[summary.confidence];
    const min = CONFIDENCE_RANK[x.minConfidence];
    a.push({
      name: 'confidence.min',
      passed: got >= min,
      detail: `expected ≥${x.minConfidence}, got ${summary.confidence}`,
    });
  }

  // Adversarial cases: must self-report low.
  if (x.expectLowConfidence) {
    a.push({
      name: 'confidence.low-self-report',
      passed: summary.confidence === 'low' && summary._pendingReview === true,
      detail: `confidence=${summary.confidence} _pendingReview=${summary._pendingReview}`,
    });
  }

  // Lengths.
  a.push(lengthAssert('length.titleZh', summary.title, x.minTitleZhLen, x.maxTitleZhLen));
  a.push(lengthAssert('length.descriptionZh', summary.description, x.minDescZhLen, x.maxDescZhLen));
  a.push(lengthAssert('length.descriptionEn', summary.descriptionEn, x.minDescEnLen, x.maxDescEnLen));

  // Required term hits (each language scoped).
  a.push(termsAssert('terms.zh', `${summary.title}\n${summary.description}`, x.requiredTermsZh));
  a.push(termsAssert('terms.en', `${summary.titleEn}\n${summary.descriptionEn}`, x.requiredTermsEn));

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

  const lines: string[] = [];
  lines.push(`# AI Summary Eval Report — ${stamp}`);
  lines.push('');
  lines.push(`- Cases: ${payload.totals.cases}`);
  lines.push(`- Passed: ${payload.totals.passed}`);
  lines.push(`- Failed: ${payload.totals.failed}`);
  lines.push('');
  for (const r of results) {
    const tag = r.passed ? 'PASS' : 'FAIL';
    lines.push(`## [${tag}] ${r.id}`);
    if (r.error) {
      lines.push('');
      lines.push(`Error: \`${r.error}\``);
      lines.push('');
      continue;
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

async function main() {
  const opts = parseCli(process.argv.slice(2));
  const goldens = loadGolden();
  if (goldens.length === 0) {
    process.stdout.write('No golden cases found. Add JSON files to scripts/evals/ai-summary/golden/.\n');
    process.exit(0);
  }

  const cases = opts.caseId ? goldens.filter((g) => g.id === opts.caseId) : goldens;
  if (cases.length === 0) {
    process.stderr.write(`No case matches --case=${opts.caseId}\n`);
    process.exit(2);
  }

  if (opts.dryRun) {
    process.stdout.write(`Would run ${cases.length} case(s):\n`);
    for (const c of cases) process.stdout.write(`  - ${c.id}\n`);
    process.exit(0);
  }

  if (!claudeAvailable()) {
    process.stdout.write(
      'claude CLI not on PATH — skipping AI Summary eval (set SGAI_EVAL_FORCE_CLAUDE=1 to force).\n',
    );
    process.exit(0);
  }

  process.stdout.write(`Running ${cases.length} AI Summary case(s)…\n`);
  const results: CaseResult[] = [];
  for (const c of cases) {
    process.stdout.write(`  [${c.id}] `);
    try {
      const summary = await summarizePage(c.input, {
        categories: c.expected.categories,
        domainContext: c.expected.domainContext,
        cacheDir: CACHE_DIR,
        force: opts.force,
      });
      const assertions = evaluate(c, summary);
      const passed = assertions.every((a) => a.passed);
      results.push({ id: c.id, passed, assertions, output: summary });
      process.stdout.write(passed ? 'PASS\n' : `FAIL (${assertions.filter((a) => !a.passed).length} assertion(s))\n`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ id: c.id, passed: false, assertions: [], error: msg });
      process.stdout.write(`ERROR — ${msg}\n`);
    }
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
      process.stdout.write(`  ${r.id} — ${r.error}\n`);
      continue;
    }
    const failedAssertions = r.assertions.filter((a) => !a.passed);
    for (const a of failedAssertions) {
      process.stdout.write(`  ${r.id} :: ${a.name} — ${a.detail ?? ''}\n`);
    }
  }
  process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`Eval error: ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(2);
});
