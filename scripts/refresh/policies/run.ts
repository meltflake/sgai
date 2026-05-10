// scripts/refresh/policies/run.ts
// ────────────────────────────────────────────────────────────────────────
// Orchestrator for the policies refresh pipeline.
//
// Flow:
//   1. Read existing sourceUrls from src/data/policies.ts.
//   2. scan() → candidate URLs from configured sources.
//   3. enrich() → AI summary + bilingual fields per candidate.
//   4. emit() → append records to policies.ts (with i18n validation rollback).
//   5. autoCommit() → branch + commit (no push).
//   6. pushAndOpenPR() → push branch + open GitHub PR.
//   7. Print structured report to stdout (caller / cron emails it).
//
// CLI flags:
//   --dry-run         Skip enrichment, emit, commit, push. Just scan + report.
//   --limit=N         Cap number of candidates (default 5 to keep PRs small).
//   --only-domain=X   Restrict scan to one source.
//   --no-commit       Run scan + enrich + emit, but don't commit / push.
//   --no-push         Run commit but skip push + PR.
//   --force           Bypass enrichment cache (re-summarise even if cached).

import { resolve } from 'node:path';

import { loadState, saveState } from '../../lib/state.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { scan, readExistingPolicyUrls } from './scan.ts';
import { enrich } from './enrich.ts';
import { emit } from './emit.ts';

interface CliFlags {
  dryRun: boolean;
  limit: number;
  onlyDomain: string | null;
  noCommit: boolean;
  noPush: boolean;
  force: boolean;
}

function parseFlags(): CliFlags {
  const argv = process.argv.slice(2);
  const flagSet = new Set(argv.filter((a) => !a.includes('=')));
  const limitArg = argv.find((a) => a.startsWith('--limit='));
  const onlyArg = argv.find((a) => a.startsWith('--only-domain='));
  return {
    dryRun: flagSet.has('--dry-run'),
    limit: limitArg ? Number(limitArg.split('=')[1]) : 5,
    onlyDomain: onlyArg ? onlyArg.split('=')[1] : null,
    noCommit: flagSet.has('--no-commit'),
    noPush: flagSet.has('--no-push'),
    force: flagSet.has('--force'),
  };
}

async function main(): Promise<void> {
  const flags = parseFlags();
  const startedAt = Date.now();

  process.stdout.write('\n[policies-refresh] starting\n');
  if (flags.dryRun) process.stdout.write('  --dry-run: scan only\n');

  // 1. Existing URLs (dedup set).
  const existingUrls = readExistingPolicyUrls();
  process.stdout.write(`  existing policies sourceUrls: ${existingUrls.size}\n`);

  // 2. State.
  const state = loadState();

  // 3. Scan.
  const scanResult = await scan({
    state,
    existingUrls,
    dryRun: flags.dryRun,
    limit: flags.limit,
    onlyDomain: flags.onlyDomain || undefined,
  });

  process.stdout.write(`  scan: ${scanResult.candidates.length} candidates from ${scanResult.perSource.length} sources\n`);
  for (const s of scanResult.perSource) {
    const errMark = s.error ? ` ⚠ ${s.error.slice(0, 80)}` : '';
    process.stdout.write(`    ${s.domain}: ${s.matched}/${s.checked}${errMark}\n`);
  }

  if (scanResult.candidates.length === 0) {
    process.stdout.write('\n[policies-refresh] no new candidates. exiting.\n');
    saveState(state);
    return;
  }

  // Print candidates so caller (cron email) can see them even on dry-run.
  process.stdout.write('\n  Candidates:\n');
  for (const c of scanResult.candidates.slice(0, 10)) {
    process.stdout.write(`    [${c.domain}] ${c.sourceUrl}\n`);
  }

  if (flags.dryRun) {
    process.stdout.write('\n[policies-refresh] dry-run complete.\n');
    return;
  }

  // 4. Enrich.
  process.stdout.write('\n  Enriching...\n');
  const enrichResult = await enrich(scanResult.candidates, { force: flags.force });
  process.stdout.write(`  enriched: ${enrichResult.enriched.length}, failures: ${enrichResult.failures.length}\n`);
  for (const f of enrichResult.failures) {
    process.stdout.write(`    ⚠ ${f.sourceUrl}: ${f.error.slice(0, 80)}\n`);
  }

  if (enrichResult.enriched.length === 0) {
    process.stdout.write('\n[policies-refresh] no items enriched. exiting.\n');
    return;
  }

  // 4b. Translate to ja.
  try {
    const { translateBatch } = await import('../../lib/translate.ts');
    const jaValues = await translateBatch(
      enrichResult.enriched.flatMap((e) => [e.summary.title, e.summary.description]),
      { direction: 'zh→ja', cacheDir: 'scripts/i18n/data/ja-cache' }
    );
    for (let i = 0; i < enrichResult.enriched.length; i++) {
      enrichResult.enriched[i].summary.titleJa = jaValues[i * 2] || undefined;
      enrichResult.enriched[i].summary.descriptionJa = jaValues[i * 2 + 1] || undefined;
    }
    process.stdout.write(`  translated ${enrichResult.enriched.length} entries to ja\n`);
  } catch (e) {
    process.stdout.write(`  [warn] ja translation failed: ${e instanceof Error ? e.message : e}\n`);
  }

  // 5. Emit.
  process.stdout.write('\n  Emitting...\n');
  const emitResult = emit(enrichResult.enriched);
  process.stdout.write(`  added ${emitResult.recordsAdded} records, skipped ${emitResult.skipped.length}\n`);
  for (const [cat, n] of Object.entries(emitResult.perCategory)) {
    if (n > 0) process.stdout.write(`    ${cat}: +${n}\n`);
  }
  for (const s of emitResult.skipped) {
    process.stdout.write(`    skipped ${s.id}: ${s.reason}\n`);
  }

  // The "最近更新" homepage feed now derives from each record's addedAt
  // field (set in formatPolicyRecord above) via src/utils/derived-updates.ts.
  // No manual appendUpdate call needed — was the source of the 2026-05-09
  // drift bug (commit a608bc0).

  // 6. Commit.
  if (flags.noCommit) {
    process.stdout.write('\n[policies-refresh] --no-commit: stopping after emit.\n');
    return;
  }
  process.stdout.write('\n  Committing...\n');
  const commit = autoCommit({
    domain: 'policies',
    files: [resolve('src/data/policies.ts')],
    message: `data(policies): refresh +${emitResult.recordsAdded} entries`,
    allowDirtyPaths: ['scripts/refresh/policies/data/'],
  });
  process.stdout.write(`  branch: ${commit.branch}\n`);
  process.stdout.write(`  sha: ${commit.sha}\n`);

  // 7. Push + PR.
  let prUrl = '';
  let prNumber = 0;
  if (!flags.noPush) {
    process.stdout.write('\n  Pushing + opening PR...\n');
    const body = buildPRBody({
      domain: 'policies',
      diffStat: commit.diffStat,
      newEntries: enrichResult.enriched.map((e) => ({
        title: `${e.summary.titleEn} (${e.summary.category})`,
        sourceUrl: e.candidate.sourceUrl,
        confidence: e.summary.confidence,
      })),
      failedSources: enrichResult.failures.map((f) => ({ url: f.sourceUrl, error: f.error })),
      checksPassed: ['i18n-pair (post-emit rollback guard)'],
    });
    const prResult = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] policies: +${emitResult.recordsAdded} entries`,
      body,
      labels: ['data-refresh', 'policies'],
    });
    if (prResult.error) {
      process.stdout.write(`  ⚠ PR step error: ${prResult.error}\n`);
    } else if (prResult.pr) {
      prUrl = prResult.pr.url;
      prNumber = prResult.pr.number;
      process.stdout.write(`  PR: ${prUrl}\n`);
    }
  }

  // 8. Persist state.
  saveState(state);

  // Final structured report (parsed by auto_update.py for emails).
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  process.stdout.write('\n[policies-refresh] DONE\n');
  process.stdout.write(JSON.stringify({
    domain: 'policies',
    added: emitResult.recordsAdded,
    failures: enrichResult.failures.length,
    branch: commit.branch,
    sha: commit.sha,
    pr_url: prUrl || null,
    pr_number: prNumber || null,
    elapsed_seconds: elapsed,
  }) + '\n');
}

await main();
