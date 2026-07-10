// scripts/evals/facade-stats/check.ts
// ────────────────────────────────────────────────────────────────────────
// Closes the "front-door number contradicts the data files" bug class
// (2026-07-07 audit, judgment 5). README.md carried three generations of
// hand-written stats at once — 139 vs 179 debates in the same file, "650+"
// startups vs the ecosystemStats ground truth of 548, "20 core policies"
// vs 44 records — and the About page held a third set (150 debates,
// "500+" companies). The site's whole pitch is traceability; a facade that
// disagrees with its own data files burns that credibility first.
//
// Two assertions:
//   1. README.md — every front-door claim (zh + en) is located via a
//      pattern with one capture group and must equal the value computed
//      from src/data/*.ts. A pattern that no longer matches ALSO fails:
//      a reworded README must update README_CLAIMS, not silently escape.
//   2. AboutPage.astro — the prose interpolates its figures from the data
//      files (`${debateCount}` etc. in all three authored locales). This
//      eval asserts those interpolations stay in place, so nobody can
//      reintroduce a hand-written number that rots.
//
// Flags:
//   --help    Usage
//
// Exit codes:
//   0 — every facade claim matches the data ground truth
//   1 — at least one drifted / missing claim
//   2 — invocation / setup error

import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const README_PATH = join(REPO_ROOT, 'README.md');
const ABOUT_PATH = join(REPO_ROOT, 'src/components/about/AboutPage.astro');

export interface FacadeTruth {
  debates: number;
  policies: number;
  startups: number;
  unicorns: number;
  economies: number;
  trackerMetrics: number;
}

export interface FacadeClaim {
  metric: keyof FacadeTruth;
  label: string;
  pattern: RegExp; // exactly one capture group: the claimed number
}

// README front-door claims, zh + en sections. Patterns are anchored to the
// phrasing in README.md — a reword that breaks a pattern fails the eval on
// purpose (update the claim here alongside the reword).
export const README_CLAIMS: FacadeClaim[] = [
  { metric: 'debates', label: 'zh 议会辩论数', pattern: /(\d[\d,]*)\s*场议会辩论/g },
  { metric: 'debates', label: 'en parliamentary debates', pattern: /(\d[\d,]*)\s+parliamentary debates/g },
  { metric: 'policies', label: 'zh 政策文档数', pattern: /(\d[\d,]*)\s*份政策文档/g },
  { metric: 'policies', label: 'en policy documents', pattern: /(\d[\d,]*)\s+policy documents/g },
  { metric: 'startups', label: 'zh AI 创业公司数', pattern: /(\d[\d,]*)\+?\s*家 AI 创业公司/g },
  { metric: 'startups', label: 'en AI startups', pattern: /(\d[\d,]*)\+?\s+AI startups/g },
  { metric: 'unicorns', label: 'zh 独角兽数', pattern: /(\d[\d,]*)\s*家独角兽/g },
  { metric: 'unicorns', label: 'en unicorns', pattern: /(\d[\d,]*)\s+unicorns/g },
  { metric: 'economies', label: 'zh 经济体数', pattern: /(\d[\d,]*)\s*个经济体/g },
  { metric: 'economies', label: 'en economies', pattern: /across\s+(\d[\d,]*)\s+economies/g },
  { metric: 'trackerMetrics', label: 'zh 关键指标数', pattern: /(\d[\d,]*)\s*项关键指标/g },
  { metric: 'trackerMetrics', label: 'en key metrics', pattern: /(\d[\d,]*)\s+key metrics/g },
];

// AboutPage.astro must keep sourcing its figures from the data files. Each
// snippet is required `minCount` times (3 = one per authored locale zh/en/ja;
// zh-tw derives via OpenCC and ko falls back to en, so 3 covers all five).
export const ABOUT_REQUIRED_SNIPPETS: Array<{ snippet: string; minCount: number; why: string }> = [
  { snippet: 'debates.length', minCount: 1, why: 'debate count must come from ~/data/debates' },
  { snippet: 'ecosystemStats.totalStartups', minCount: 1, why: 'startup count must come from ~/data/startups' },
  { snippet: 'ecosystemStats.unicorns', minCount: 1, why: 'unicorn count must come from ~/data/startups' },
  { snippet: '${debateCount}', minCount: 3, why: 'zh/en/ja COPY must interpolate the debate count' },
  { snippet: '${startupCount}', minCount: 3, why: 'zh/en/ja COPY must interpolate the startup count' },
  { snippet: '${unicornCount}', minCount: 3, why: 'zh/en/ja COPY must interpolate the unicorn count' },
  { snippet: '${leverItemCount}', minCount: 3, why: 'zh/en/ja COPY must interpolate the lever-item count' },
  { snippet: '${leverCount}', minCount: 3, why: 'zh/en/ja COPY must interpolate the lever count' },
];

export interface FacadeFinding {
  source: string; // 'README.md' | 'AboutPage.astro'
  label: string;
  ok: boolean;
  detail: string;
}

/** '548' → 548, '1,024' → 1024, '650+' → 650. NaN on garbage. */
export function normalizeCount(raw: string): number {
  return Number(raw.replace(/[,+]/g, ''));
}

/** Assert every README claim matches the ground truth at every occurrence. */
export function auditReadme(readme: string, truth: FacadeTruth, claims: FacadeClaim[] = README_CLAIMS): FacadeFinding[] {
  const findings: FacadeFinding[] = [];
  for (const claim of claims) {
    const expected = truth[claim.metric];
    // Re-create the regex so a shared claims array is safe across calls.
    const re = new RegExp(claim.pattern.source, claim.pattern.flags.includes('g') ? claim.pattern.flags : claim.pattern.flags + 'g');
    const matches = [...readme.matchAll(re)];
    if (matches.length === 0) {
      findings.push({
        source: 'README.md',
        label: claim.label,
        ok: false,
        detail: `pattern ${re} matched nothing — README reworded? Update README_CLAIMS alongside the copy.`,
      });
      continue;
    }
    for (const m of matches) {
      const claimed = normalizeCount(m[1]);
      findings.push({
        source: 'README.md',
        label: claim.label,
        ok: claimed === expected,
        detail:
          claimed === expected
            ? `"${m[0]}" == ${expected}`
            : `README says "${m[0]}" but src/data ground truth is ${expected} — update README.md`,
      });
    }
  }
  return findings;
}

/** Assert the About page still interpolates its figures from the data files. */
export function auditAboutSource(
  source: string,
  snippets: Array<{ snippet: string; minCount: number; why: string }> = ABOUT_REQUIRED_SNIPPETS,
): FacadeFinding[] {
  return snippets.map(({ snippet, minCount, why }) => {
    const count = source.split(snippet).length - 1;
    return {
      source: 'AboutPage.astro',
      label: snippet,
      ok: count >= minCount,
      detail:
        count >= minCount
          ? `found ${count}× (needs ${minCount})`
          : `found ${count}×, expected ≥${minCount} — ${why}. Hand-written figures drift; keep the interpolation.`,
    };
  });
}

async function loadTruth(): Promise<FacadeTruth> {
  const [{ debates }, { categories }, { ecosystemStats }, { regions }, { dimensions }] = await Promise.all([
    import('../../../src/data/debates'),
    import('../../../src/data/policies'),
    import('../../../src/data/startups'),
    import('../../../src/data/benchmarking'),
    import('../../../src/data/tracker'),
  ]);
  return {
    debates: debates.length,
    policies: categories.reduce((n, c) => n + c.policies.length, 0),
    startups: normalizeCount(ecosystemStats.totalStartups),
    unicorns: ecosystemStats.unicorns,
    economies: regions.length,
    trackerMetrics: dimensions.reduce((n, d) => n + ('metrics' in d ? d.metrics.length : 0), 0),
  };
}

async function main() {
  if (process.argv.slice(2).some((a) => a === '--help' || a === '-h')) {
    process.stdout.write(
      'Usage: eval:facade-stats\n' +
        '\nAsserts the front-door numbers in README.md and the AboutPage.astro data\n' +
        'interpolations agree with the src/data/*.ts ground truth.\n',
    );
    process.exit(0);
  }

  let findings: FacadeFinding[];
  try {
    const truth = await loadTruth();
    process.stdout.write(`[facade-stats] ground truth: ${JSON.stringify(truth)}\n`);
    findings = [
      ...auditReadme(readFileSync(README_PATH, 'utf8'), truth),
      ...auditAboutSource(readFileSync(ABOUT_PATH, 'utf8')),
    ];
  } catch (err) {
    process.stderr.write(`[facade-stats] setup error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(2);
  }

  const failed = findings.filter((f) => !f.ok);
  process.stdout.write(`[facade-stats] claims checked: ${findings.length}, drifted: ${failed.length}\n`);
  for (const f of failed) {
    process.stdout.write(`  DRIFT ${f.source} · ${f.label}: ${f.detail}\n`);
  }
  process.exit(failed.length > 0 ? 1 : 0);
}

// Run as CLI only — importing this module from a unit test must not touch
// the fs or call process.exit.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('facade-stats/check.ts')) {
  main();
}
