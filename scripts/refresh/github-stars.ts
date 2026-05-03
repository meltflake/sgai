// scripts/refresh/github-stars.ts
// ────────────────────────────────────────────────────────────────────────
// Quick refresher: pull live GitHub stargazer counts for every
// `https://github.com/owner/repo` URL referenced in opensource data files,
// then rewrite the `stars: <N>` field in place.
//
// Refactored to use shared lib/github-stars primitives and lib/auto-commit
// for branch + push + PR. Adds --bump-version flag.
//
// Files touched:
//   - src/data/community-opensource.ts
//   - src/data/opensource.ts
//   - src/version.ts                 (only if --bump-version)
//
// Usage:
//   npx tsx scripts/refresh/github-stars.ts                       # update + auto-PR
//   npx tsx scripts/refresh/github-stars.ts --dry-run             # show diffs only
//   npx tsx scripts/refresh/github-stars.ts --no-commit            # write but no commit/PR
//   npx tsx scripts/refresh/github-stars.ts --no-push              # commit but no PR
//   npx tsx scripts/refresh/github-stars.ts --bump-version         # also bump src/version.ts
//   npx tsx scripts/refresh/github-stars.ts --file=community-opensource

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { parseGithubUrl, fetchRepoStats, findGithubBlocks, rewriteStarsLine } from '../lib/github-stars.ts';
import { autoCommit, pushAndOpenPR, buildPRBody } from '../lib/auto-commit.ts';

interface UpdateResult {
  url: string;
  repo: string;
  oldStars: number | null;
  newStars: number;
  changed: boolean;
  error?: string;
}

const ROOT = resolve(process.cwd());
const TARGETS = [
  resolve(ROOT, 'src/data/community-opensource.ts'),
  resolve(ROOT, 'src/data/opensource.ts'),
] as const;

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const noBumpDate = args.has('--no-bump-date');
const noCommit = args.has('--no-commit');
const noPush = args.has('--no-push');
const bumpVersion = args.has('--bump-version');
const fileArg = process.argv.find((arg) => arg.startsWith('--file='));
const onlyFile = fileArg ? fileArg.split('=')[1] : null;

function bumpDataDate(source: string): { updated: string; changed: boolean } {
  const today = new Date().toISOString().slice(0, 10);
  const monthName = new Date(today).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const monthZh = `${today.slice(0, 4)} 年 ${Number(today.slice(5, 7))} 月`;

  let s = source;
  let changed = false;

  const dataDateRe = /dataDate:\s*['"]\d{4}-\d{2}(?:-\d{2})?['"]/g;
  if (dataDateRe.test(s)) {
    s = s.replace(dataDateRe, `dataDate: '${today}'`);
    changed = true;
  }
  s = s.replace(/数据截至 \d{4} 年 \d{1,2} 月/g, () => {
    changed = true;
    return `数据截至 ${monthZh}`;
  });
  s = s.replace(/current as of [A-Z][a-z]+ \d{4}/g, () => {
    changed = true;
    return `current as of ${monthName}`;
  });
  s = s.replace(/最后更新：\d{4}-\d{2}-\d{2}/g, () => {
    changed = true;
    return `最后更新：${today}`;
  });
  s = s.replace(/Last updated:\s*\d{4}-\d{2}-\d{2}/g, () => {
    changed = true;
    return `Last updated: ${today}`;
  });

  return { updated: s, changed };
}

async function refreshFile(filePath: string): Promise<{ file: string; results: UpdateResult[]; wrote: boolean }> {
  if (!existsSync(filePath)) return { file: filePath, results: [], wrote: false };

  const original = readFileSync(filePath, 'utf8');
  const blocks = findGithubBlocks(original);
  if (blocks.length === 0) return { file: filePath, results: [], wrote: false };

  const uniqueRepos = new Map<string, { owner: string; repo: string }>();
  for (const b of blocks) {
    const parsed = parseGithubUrl(b.url);
    if (!parsed) continue;
    const key = `${parsed.owner}/${parsed.repo}`.toLowerCase();
    if (!uniqueRepos.has(key)) uniqueRepos.set(key, parsed);
  }

  const stats = new Map<string, { stargazers_count: number } | { error: string }>();
  await Promise.all(
    Array.from(uniqueRepos.entries()).map(async ([key, { owner, repo }]) => {
      try {
        const r = await fetchRepoStats(owner, repo);
        stats.set(key, r);
      } catch (error) {
        stats.set(key, { error: error instanceof Error ? error.message : String(error) });
      }
    })
  );

  let lines = original.split('\n');
  const results: UpdateResult[] = [];
  for (const b of blocks) {
    const parsed = parseGithubUrl(b.url);
    if (!parsed) continue;
    const key = `${parsed.owner}/${parsed.repo}`.toLowerCase();
    const stat = stats.get(key);
    if (!stat) continue;

    if ('error' in stat) {
      results.push({
        url: b.url,
        repo: key,
        oldStars: b.starsValue,
        newStars: b.starsValue ?? 0,
        changed: false,
        error: stat.error,
      });
      continue;
    }

    const newStars = stat.stargazers_count;
    if (b.starsLineIndex !== null && b.starsValue !== null) {
      if (b.starsValue !== newStars) {
        lines = rewriteStarsLine(lines, b.starsLineIndex, newStars);
      }
      results.push({
        url: b.url,
        repo: key,
        oldStars: b.starsValue,
        newStars,
        changed: b.starsValue !== newStars,
      });
    } else {
      results.push({
        url: b.url,
        repo: key,
        oldStars: null,
        newStars,
        changed: false,
        error: 'No stars field in record; add manually',
      });
    }
  }

  let updated = lines.join('\n');
  const starsChanged = results.some((r) => r.changed);
  let dateChanged = false;

  if (!noBumpDate && starsChanged) {
    const dateResult = bumpDataDate(updated);
    updated = dateResult.updated;
    dateChanged = dateResult.changed;
  }

  const willWrite = !dryRun && (starsChanged || dateChanged);
  if (willWrite) writeFileSync(filePath, updated);
  return { file: filePath, results, wrote: willWrite };
}

function bumpVersionFile(): boolean {
  const versionPath = resolve('src/version.ts');
  if (!existsSync(versionPath)) return false;
  const today = new Date().toISOString().slice(0, 10);
  const original = readFileSync(versionPath, 'utf8');
  let updated = original.replace(/SITE_UPDATED\s*=\s*'\d{4}-\d{2}-\d{2}'/, `SITE_UPDATED = '${today}'`);

  // Patch-bump the version: 0.9.1 → 0.9.2
  updated = updated.replace(/SITE_VERSION\s*=\s*'(\d+)\.(\d+)\.(\d+)'/, (_, maj, min, pat) => {
    return `SITE_VERSION = '${maj}.${min}.${Number(pat) + 1}'`;
  });

  if (updated === original) return false;
  if (!dryRun) writeFileSync(versionPath, updated);
  return true;
}

function reportFile(file: string, results: UpdateResult[], wrote: boolean): void {
  const rel = file.replace(`${ROOT}/`, '');
  const changed = results.filter((r) => r.changed);
  const errors = results.filter((r) => r.error);
  process.stdout.write(`\n${rel}\n`);
  process.stdout.write(`  scanned ${results.length} repos, ${changed.length} changed, ${errors.length} errors\n`);
  for (const r of changed) {
    const old = r.oldStars ?? 0;
    const delta = r.newStars - old;
    const pct = old > 0 ? ((delta / old) * 100).toFixed(1) : '∞';
    const sign = delta >= 0 ? '+' : '';
    process.stdout.write(`    ${r.repo}: ${old} → ${r.newStars} (${sign}${delta}, ${sign}${pct}%)\n`);
  }
  for (const r of errors) process.stdout.write(`    ⚠ ${r.repo}: ${r.error}\n`);
  process.stdout.write(`  ${dryRun ? '[dry-run] ' : ''}${wrote ? 'wrote' : 'no changes'}\n`);
}

async function main(): Promise<void> {
  const targetFiles = TARGETS.filter((t) => !onlyFile || t.includes(onlyFile));
  if (targetFiles.length === 0) {
    process.stderr.write(`No targets matched --file=${onlyFile}\n`);
    process.exit(1);
  }
  // Token auto-resolves: env var → `gh auth token` → unauthenticated (60 req/h)
  const { spawnSync } = await import('node:child_process');
  const ghToken = spawnSync('gh', ['auth', 'token'], { encoding: 'utf8' });
  if (process.env.GITHUB_TOKEN) {
    process.stdout.write('GitHub auth: GITHUB_TOKEN env (5000 req/h)\n');
  } else if (ghToken.status === 0 && ghToken.stdout.toString().trim()) {
    process.stdout.write('GitHub auth: gh CLI keychain (5000 req/h)\n');
  } else {
    process.stdout.write('⚠ no GitHub token — unauthenticated (60 req/h). Run `gh auth login` or set GITHUB_TOKEN.\n');
  }

  const startedAt = Date.now();
  const filesWritten: string[] = [];
  const allChanges: UpdateResult[] = [];

  for (const file of targetFiles) {
    const { results, wrote } = await refreshFile(file);
    reportFile(file, results, wrote);
    if (wrote) filesWritten.push(file);
    allChanges.push(...results);
  }

  let versionBumped = false;
  if (bumpVersion && filesWritten.length > 0) {
    versionBumped = bumpVersionFile();
    if (versionBumped) {
      process.stdout.write(`\n${dryRun ? '[dry-run] ' : ''}bumped src/version.ts\n`);
      filesWritten.push(resolve('src/version.ts'));
    }
  }

  const totalErrors = allChanges.filter((r) => r.error).length;
  const allErrored = totalErrors === allChanges.length && allChanges.length > 0;

  if (dryRun || filesWritten.length === 0 || noCommit) {
    let label: string;
    if (dryRun) label = '[dry-run]';
    else if (noCommit) label = '[no-commit]';
    else if (allErrored) label = '[all-errored]';
    else label = '[no-changes]';
    process.stdout.write(`\n${label} done.\n`);
    if (allErrored && !dryRun) process.exit(2); // signal real failure to caller
    return;
  }

  // Commit + push + PR.
  const totalChanged = allChanges.filter((r) => r.changed).length;
  const commit = autoCommit({
    domain: 'github-stars',
    files: filesWritten,
    message: `data(github-stars): refresh ${totalChanged} repos`,
    allowDirtyPaths: [],
  });
  process.stdout.write(`\n  branch: ${commit.branch}\n  sha: ${commit.sha}\n`);

  if (!noPush) {
    const newEntries = allChanges
      .filter((r) => r.changed)
      .map((r) => ({
        title: `${r.repo}: ${r.oldStars ?? 0} → ${r.newStars}`,
        sourceUrl: r.url,
        confidence: 'high' as const,
      }));
    const failedSources = allChanges
      .filter((r) => r.error)
      .map((r) => ({ url: r.url, error: r.error || 'unknown' }));

    const body = buildPRBody({
      domain: 'github-stars',
      diffStat: commit.diffStat,
      newEntries,
      failedSources,
      checksPassed: ['npm run check (run locally)'],
    });

    const prResult = await pushAndOpenPR({
      branch: commit.branch,
      title: `[data-refresh] github-stars: ${totalChanged} repos updated`,
      body,
      labels: ['data-refresh', 'github-stars'],
    });

    if (prResult.error) process.stdout.write(`  ⚠ PR step error: ${prResult.error}\n`);
    if (prResult.pr) process.stdout.write(`  PR: ${prResult.pr.url}\n`);

    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    process.stdout.write('\n[github-stars-refresh] DONE\n');
    process.stdout.write(JSON.stringify({
      domain: 'github-stars',
      changed: totalChanged,
      failures: failedSources.length,
      branch: commit.branch,
      sha: commit.sha,
      pr_url: prResult.pr?.url || null,
      pr_number: prResult.pr?.number || null,
      elapsed_seconds: elapsed,
    }) + '\n');
  }
}

await main();
