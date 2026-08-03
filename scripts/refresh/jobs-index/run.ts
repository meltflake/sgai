// scripts/refresh/jobs-index/run.ts
// ────────────────────────────────────────────────────────────────────────
// Orchestrator for the monthly AI Jobs Index capture (source-expansion
// plan 2026-08-03). Flow:
//   1. Sweep the frozen QUERY_BASKET against the MyCareersFuture API.
//   2. Dedup by uuid; abort if the union is implausibly small (a
//      throttled sweep must never poison the immutable series).
//   3. Aggregate: salary percentiles, top employers, role types
//      (deterministic rules first, one batched haiku call for leftovers).
//   4. Emit the snapshot into src/data/ai-jobs-index.ts, commit, PR.
//
// CLI (pipeline contract): --dry-run | --limit=N (caps LLM batch, not the
// sweep) | --no-commit | --no-push | --force (replace current month —
// NEVER touches past months; snapshots are immutable).
//
// The dispatcher parses the LAST stdout line as a JSON report.

import { execFileSync } from 'node:child_process';

import { callLlmJson, ensureClaudeAuthed } from '../../lib/llm.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { QUERY_BASKET, type JobsIndexSnapshot, type RoleTypeId } from '../../../src/data/ai-jobs-index.ts';
import { sweepQuery, searchUrl, type QuerySweep } from './api.ts';
import {
  dedupByUuid,
  salaryStats,
  topEmployers,
  classifyRoleByRules,
  roleTypeCounts,
  MIN_PLAUSIBLE_TOTAL,
} from './compute.ts';
import { emitSnapshot } from './emit.ts';

interface CliFlags {
  dryRun: boolean;
  limit: number;
  noCommit: boolean;
  noPush: boolean;
  force: boolean;
}

function parseFlags(): CliFlags {
  const argv = process.argv.slice(2);
  const flagSet = new Set(argv.filter((a) => !a.includes('=')));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  return {
    dryRun: flagSet.has('--dry-run'),
    limit: limitArg ? Number(limitArg.split('=')[1]) : 200,
    noCommit: flagSet.has('--no-commit'),
    noPush: flagSet.has('--no-push'),
    force: flagSet.has('--force'),
  };
}

function report(fields: Record<string, unknown>): void {
  process.stdout.write('\n' + JSON.stringify(fields) + '\n');
}

const VALID_ROLES: RoleTypeId[] = ['engineering', 'research', 'data', 'product', 'gtm', 'ops-other'];

/** One batched haiku call for titles the deterministic rules couldn't
 *  place. Failure is non-fatal: leftovers become 'ops-other'. */
async function classifyLeftovers(titles: string[], cap: number): Promise<Map<string, RoleTypeId>> {
  const out = new Map<string, RoleTypeId>();
  if (titles.length === 0) return out;
  const batch = titles.slice(0, cap);
  try {
    const res = await callLlmJson<Record<string, string>>(
      `Classify each job title into exactly one of: engineering, research, data, product, gtm, ops-other.\n` +
        `Return STRICT JSON mapping title → category, no prose.\n\nTitles:\n${batch.map((t) => `- ${t}`).join('\n')}`,
      { systemPrompt: 'You classify job titles. Output strict JSON only.', model: 'haiku' }
    );
    for (const [title, role] of Object.entries(res)) {
      if ((VALID_ROLES as string[]).includes(role)) out.set(title, role as RoleTypeId);
    }
  } catch (err) {
    process.stdout.write(`  ! role LLM fallback failed (non-fatal): ${err instanceof Error ? err.message : err}\n`);
  }
  return out;
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();
  process.stdout.write('\n[jobs-index] starting\n');

  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);

  // 1. Sweep.
  const sweeps: QuerySweep[] = [];
  for (const q of QUERY_BASKET) {
    const sweep = await sweepQuery(q);
    sweeps.push(sweep);
    process.stdout.write(`  "${q}": total=${sweep.total}, fetched=${sweep.jobs.length}\n`);
  }

  // 2. Dedup + sanity bound.
  const jobs = dedupByUuid(sweeps.map((s) => s.jobs));
  process.stdout.write(`  union after uuid dedup: ${jobs.length}\n`);
  if (jobs.length < MIN_PLAUSIBLE_TOTAL) {
    process.stdout.write('  ! implausibly small union — refusing to write a corrupt snapshot\n');
    report({ domain: 'jobs-index', added: 0, failures: 1, reason: 'implausible-low', union: jobs.length });
    process.exit(1);
  }

  // 3. Aggregate.
  const stats = salaryStats(jobs);
  const employers = topEmployers(jobs);
  const ruleAssigned: RoleTypeId[] = [];
  const leftoverTitles: string[] = [];
  for (const j of jobs) {
    const role = classifyRoleByRules(j.title);
    if (role) ruleAssigned.push(role);
    else leftoverTitles.push(j.title);
  }
  process.stdout.write(
    `  salary: disclosed=${stats.disclosedCount} (${(stats.disclosureRate * 100).toFixed(1)}%), median=${stats.median}\n`
  );
  process.stdout.write(`  roles: rules=${ruleAssigned.length}, leftover=${leftoverTitles.length}\n`);

  if (flags.dryRun) {
    process.stdout.write('\n[jobs-index] dry-run done (no LLM, no writes).\n');
    report({
      domain: 'jobs-index',
      added: 0,
      reason: 'dry-run',
      union: jobs.length,
      median: stats.median,
      elapsed_seconds: Math.round((Date.now() - startedAt) / 1000),
    });
    return;
  }

  let llmAssigned = new Map<string, RoleTypeId>();
  if (leftoverTitles.length > 0) {
    ensureClaudeAuthed();
    llmAssigned = await classifyLeftovers(leftoverTitles, flags.limit);
  }
  const allRoles: RoleTypeId[] = [
    ...ruleAssigned,
    ...leftoverTitles.map((t) => llmAssigned.get(t) ?? ('ops-other' as RoleTypeId)),
  ];

  const snapshot: JobsIndexSnapshot = {
    month,
    capturedAt: today,
    addedAt: today,
    totalOpenings: jobs.length,
    queryTotals: Object.fromEntries(sweeps.map((s) => [s.query, s.total])),
    salaryDisclosureRate: stats.disclosureRate,
    disclosedCount: stats.disclosedCount,
    salaryMidpointP25: stats.p25,
    salaryMidpointMedian: stats.median,
    salaryMidpointP75: stats.p75,
    topEmployers: employers,
    roleTypes: roleTypeCounts(allRoles),
    sourceUrl: searchUrl(QUERY_BASKET[0]),
  };

  // 4. Emit (idempotent per month; --force removes the current month first
  //    via a fresh git checkout of the file — implemented as replace-guard
  //    inside emitSnapshot's already-captured check).
  if (flags.force) {
    // Replace = drop this month's block if present, then re-emit. Simple
    // and safe: revert the file from git, which restores the pre-capture
    // state ONLY if this month was the newest (snapshots are prepended).
    execFileSync('git', ['checkout', '--', 'src/data/ai-jobs-index.ts']);
  }
  const emitted = emitSnapshot(snapshot);
  if (!emitted.written) {
    process.stdout.write(`\n[jobs-index] skipped: ${emitted.reason}\n`);
    report({ domain: 'jobs-index', added: 0, reason: emitted.reason });
    return;
  }
  process.stdout.write(`  snapshot ${month} written\n`);

  if (flags.noCommit) {
    process.stdout.write('\n--no-commit set; working tree left dirty for review.\n');
    report({ domain: 'jobs-index', added: 1, reason: 'no-commit', month });
    return;
  }

  const commit = autoCommit({
    domain: 'jobs-index',
    files: ['src/data/ai-jobs-index.ts'],
    message: `data(jobs-index): ${month} snapshot — ${jobs.length} openings, median ${stats.median ?? 'n/a'}`,
  });
  process.stdout.write(`  committed ${commit.sha.slice(0, 7)} on ${commit.branch}\n`);

  let prUrl = '';
  if (!flags.noPush) {
    const employerLines = employers.map((e) => `- ${e.employer}: ${e.openings}`).join('\n');
    const body = buildPRBody({
      domain: 'jobs-index',
      diffStat: commit.diffStat,
      newEntries: [
        {
          title: `${month} snapshot: ${jobs.length} openings, median ${stats.median ? `S$${stats.median}` : 'n/a'} (disclosed ${stats.disclosedCount})`,
          sourceUrl: snapshot.sourceUrl,
          confidence: 'high' as const,
        },
      ],
    });
    const pr = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] jobs-index: ${month} snapshot (${jobs.length} openings)`,
      body: `${body}\n\n## Top employers (eyeball for agencies → AGENCY_DENYLIST)\n${employerLines}`,
      labels: ['data-refresh'],
    });
    if (pr.error) process.stdout.write(`  ! PR step error: ${pr.error}\n`);
    else if (pr.pr) {
      prUrl = pr.pr.url;
      process.stdout.write(`  PR: ${prUrl}\n`);
    }
  }

  report({
    domain: 'jobs-index',
    added: 1,
    failures: 0,
    month,
    pr_url: prUrl || null,
    elapsed_seconds: Math.round((Date.now() - startedAt) / 1000),
  });
}

await main();
