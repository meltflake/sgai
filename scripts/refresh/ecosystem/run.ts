// scripts/refresh/ecosystem/run.ts
// ────────────────────────────────────────────────────────────────────────
// Orchestrator for ecosystem refresh. Same shape as policies/run.ts.

import { resolve } from 'node:path';

import { loadState, saveState } from '../../lib/state.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../../lib/auto-commit.ts';
import { appendUpdate } from '../../lib/append-update.ts';
import { scan, readExistingEcosystemUrls } from './scan.ts';
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

  process.stdout.write('\n[ecosystem-refresh] starting\n');
  if (flags.dryRun) process.stdout.write('  --dry-run: scan only\n');

  const existingUrls = readExistingEcosystemUrls();
  process.stdout.write(`  existing ecosystem URLs: ${existingUrls.size}\n`);

  const state = loadState();
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
    process.stdout.write('\n[ecosystem-refresh] no candidates. exiting.\n');
    saveState(state);
    return;
  }

  process.stdout.write('\n  Candidates:\n');
  for (const c of scanResult.candidates.slice(0, 10)) {
    process.stdout.write(`    [${c.domain}] ${c.hintedTitle || c.sourceUrl}\n`);
  }

  if (flags.dryRun) {
    process.stdout.write('\n[ecosystem-refresh] dry-run complete.\n');
    return;
  }

  process.stdout.write('\n  Enriching...\n');
  const enrichResult = await enrich(scanResult.candidates, { force: flags.force });
  process.stdout.write(`  enriched: ${enrichResult.enriched.length}, failures: ${enrichResult.failures.length}\n`);

  if (enrichResult.enriched.length === 0) {
    process.stdout.write('\n[ecosystem-refresh] no enriched items. exiting.\n');
    return;
  }

  process.stdout.write('\n  Emitting...\n');
  const emitResult = emit(enrichResult.enriched);
  process.stdout.write(`  added ${emitResult.recordsAdded} records\n`);
  for (const [cat, n] of Object.entries(emitResult.perCategory)) {
    if (n > 0) process.stdout.write(`    ${cat}: +${n}\n`);
  }

  if (flags.noCommit) {
    process.stdout.write('\n[ecosystem-refresh] --no-commit: stopping.\n');
    return;
  }

  if (emitResult.recordsAdded > 0) {
    try {
      appendUpdate({
        date: new Date().toISOString().slice(0, 10),
        type: 'ecosystem',
        title: `生态地图新增 ${emitResult.recordsAdded} 条待审条目`,
        titleEn: `${emitResult.recordsAdded} new ecosystem entries (pending review)`,
        summary: '从 e27 / tech.gov.sg 抓到的新生态信号已入库，待审核后展示。',
        summaryEn:
          'New ecosystem signals from e27 / tech.gov.sg ingested with `_pendingReview: true`, hidden from listing until reviewed.',
        links: [{ href: '/ecosystem/', label: '生态地图', labelEn: 'Ecosystem map' }],
      });
      process.stdout.write('  appended updates feed entry (ecosystem)\n');
    } catch (err) {
      process.stdout.write(`  ⚠ updates feed append failed: ${err instanceof Error ? err.message : err}\n`);
    }
  }

  process.stdout.write('\n  Committing...\n');
  const commit = autoCommit({
    domain: 'ecosystem',
    files: [resolve('src/data/ecosystem.ts'), resolve('src/data/updates.ts')],
    message: `data(ecosystem): refresh +${emitResult.recordsAdded} entries (pending review)`,
    allowDirtyPaths: ['scripts/refresh/ecosystem/data/'],
  });
  process.stdout.write(`  branch: ${commit.branch}\n  sha: ${commit.sha}\n`);

  let prUrl = '';
  let prNumber = 0;
  if (!flags.noPush) {
    process.stdout.write('\n  Pushing + opening PR...\n');
    const body = buildPRBody({
      domain: 'ecosystem',
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
      title: `[data-refresh] ecosystem: +${emitResult.recordsAdded} entries (pending review)`,
      body: body + '\n\n> All entries marked `_pendingReview: true` and hidden from listing pages until you flip the flag.',
      labels: ['data-refresh', 'ecosystem', 'pending-review'],
    });
    if (prResult.error) process.stdout.write(`  ⚠ PR step error: ${prResult.error}\n`);
    if (prResult.pr) {
      prUrl = prResult.pr.url;
      prNumber = prResult.pr.number;
      process.stdout.write(`  PR: ${prUrl}\n`);
    }
  }

  saveState(state);

  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  process.stdout.write('\n[ecosystem-refresh] DONE\n');
  process.stdout.write(JSON.stringify({
    domain: 'ecosystem',
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
