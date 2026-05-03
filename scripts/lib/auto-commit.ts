// scripts/lib/auto-commit.ts
// ────────────────────────────────────────────────────────────────────────
// Safe automatic commit + PR helper for refresh pipelines.
//
// Two-stage flow:
//
//   autoCommit()        → cuts a branch, commits target files (local only).
//   pushAndOpenPR()     → pushes branch + opens GitHub PR via `gh` CLI.
//
// Stages are split so callers can:
//   - dry-run the commit step in isolation (no network)
//   - retry the PR step independently if `gh` fails transiently
//   - skip the PR step entirely when running offline / in tests
//
// Behaviour:
//   1. Refuse if the working tree is dirty BEFORE the pipeline ran (we'd
//      pollute Luca's WIP). Exception: changes confined to the pipeline's
//      own data dir or the target file are allowed because we just made them.
//   2. Create a branch named `data-refresh/<domain>/<YYYY-MM-DD>` (idempotent
//      — appends `-N` suffix if branch exists).
//   3. Commit ONLY the listed files. Never `git add -A`.
//   4. Stay on the new branch on success; return SHA + diff stat.
//   5. Never push to main. Never amend. Never force.
//   6. PR step requires `gh` CLI authenticated (`gh auth status`). On Mac,
//      this uses the user's keychain; cron jobs inherit it.
//
// USAGE:
//   import { autoCommit, pushAndOpenPR } from './lib/auto-commit';
//   const commit = autoCommit({
//     domain: 'policies',
//     files: ['src/data/policies.ts', 'src/version.ts'],
//     message: 'data(policies): add 3 new IMDA AI advisories',
//     allowDirtyPaths: ['scripts/refresh/policies/data/'],
//   });
//   const pr = await pushAndOpenPR({
//     branch: commit.branch,
//     title: '[data-refresh] policies: +3 entries',
//     body: '## Summary\n- 3 new IMDA advisories\n\n## Diff\n```\n' + commit.diffStat + '\n```',
//   });
//   console.log(pr.url);

import { spawnSync } from 'node:child_process';

export interface AutoCommitOptions {
  domain: string;
  files: string[];
  message: string;
  /** Glob-like prefixes that may be dirty before commit (the pipeline's own cache). */
  allowDirtyPaths?: string[];
  /** Set to true to commit on the current branch instead of cutting a new one. */
  inPlace?: boolean;
}

export interface AutoCommitResult {
  branch: string;
  sha: string;
  diffStat: string;
  filesCommitted: string[];
}

function git(args: string[], opts: { input?: string; cwd?: string } = {}): { stdout: string; stderr: string; code: number } {
  const result = spawnSync('git', args, {
    encoding: 'utf8',
    cwd: opts.cwd,
    input: opts.input,
  });
  return {
    stdout: (result.stdout || '').toString(),
    stderr: (result.stderr || '').toString(),
    code: result.status ?? 1,
  };
}

function gitOk(args: string[]): string {
  const r = git(args);
  if (r.code !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${r.stderr.trim()}`);
  }
  return r.stdout.trim();
}

export function getCurrentBranch(): string {
  return gitOk(['rev-parse', '--abbrev-ref', 'HEAD']);
}

/**
 * Returns paths that are dirty (untracked or modified) outside the
 * `allowDirtyPaths` whitelist. Empty array = clean.
 */
export function getUnexpectedDirty(allowDirtyPaths: string[] = [], targetFiles: string[] = []): string[] {
  const r = gitOk(['status', '--porcelain']);
  if (!r) return [];
  const lines = r.split('\n').filter(Boolean);
  const allowed = new Set(targetFiles);
  return lines
    .map((line) => line.slice(3)) // strip "XY "
    .filter((path) => {
      if (allowed.has(path)) return false;
      return !allowDirtyPaths.some((prefix) => path.startsWith(prefix));
    });
}

/**
 * Cut a unique branch name. If `data-refresh/policies/2026-05-03` exists,
 * tries `-2`, `-3`, ... up to -99.
 */
export function uniqueBranchName(domain: string, dateOverride?: string): string {
  const date = dateOverride || new Date().toISOString().slice(0, 10);
  const base = `data-refresh/${domain}/${date}`;
  const existing = new Set(
    gitOk(['branch', '--list', '--all'])
      .split('\n')
      .map((s) => s.replace(/^[*+]?\s*/, '').replace(/^remotes\/[^/]+\//, ''))
  );
  if (!existing.has(base)) return base;
  for (let i = 2; i < 100; i += 1) {
    const candidate = `${base}-${i}`;
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error(`Could not find unique branch name for ${base}`);
}

export function autoCommit(options: AutoCommitOptions): AutoCommitResult {
  const allowDirty = options.allowDirtyPaths || [];
  const dirty = getUnexpectedDirty(allowDirty, options.files);
  if (dirty.length > 0) {
    throw new Error(
      `Refusing to auto-commit: working tree has unexpected dirty paths.\n  ${dirty.join('\n  ')}\nCommit or stash them first.`
    );
  }

  // Ensure the target files actually have changes.
  const stagedDiff = gitOk(['diff', '--name-only', '--', ...options.files]);
  const untrackedR = git(['ls-files', '--others', '--exclude-standard', '--', ...options.files]);
  const untracked = untrackedR.code === 0 ? untrackedR.stdout.trim() : '';
  if (!stagedDiff && !untracked) {
    throw new Error('No changes detected in target files; nothing to commit.');
  }

  const startBranch = getCurrentBranch();
  let branchName = startBranch;

  if (!options.inPlace) {
    branchName = uniqueBranchName(options.domain);
    gitOk(['checkout', '-b', branchName]);
  }

  try {
    gitOk(['add', '--', ...options.files]);
    gitOk(['commit', '-m', options.message]);
  } catch (error) {
    // Roll back branch creation on failure
    if (!options.inPlace) {
      git(['checkout', startBranch]);
      git(['branch', '-D', branchName]);
    }
    throw error;
  }

  const sha = gitOk(['rev-parse', 'HEAD']);
  const diffStat = gitOk(['diff', '--stat', `${sha}^!`]);
  const filesCommitted = gitOk(['diff-tree', '--no-commit-id', '--name-only', '-r', sha]).split('\n').filter(Boolean);

  return {
    branch: branchName,
    sha,
    diffStat,
    filesCommitted,
  };
}

// ── Push + PR ──────────────────────────────────────────────────────────

export interface PushAndPROptions {
  branch: string;
  title: string;
  body: string;
  /** Base branch for the PR. Defaults to 'main'. */
  base?: string;
  /** Set to true to leave PR as draft. Defaults to false. */
  draft?: boolean;
  /** Optional reviewers / labels passed through to `gh pr create`. */
  reviewers?: string[];
  labels?: string[];
  /** Skip the PR step entirely (push only). Returns null in `pr` field. */
  pushOnly?: boolean;
}

export interface PushAndPRResult {
  branch: string;
  pushed: boolean;
  pr: { url: string; number: number } | null;
  error?: string;
}

/**
 * Push the branch to origin and open a GitHub PR via `gh`. Caller is
 * expected to have just called autoCommit() and is currently checked out
 * on `branch`. Network-dependent — keep separate from autoCommit() so
 * tests / dry-runs can skip it.
 */
export async function pushAndOpenPR(options: PushAndPROptions): Promise<PushAndPRResult> {
  const base = options.base || 'main';
  const branch = options.branch;

  // 1. Push (set upstream).
  const pushR = git(['push', '-u', 'origin', branch]);
  if (pushR.code !== 0) {
    return {
      branch,
      pushed: false,
      pr: null,
      error: `git push failed: ${pushR.stderr.trim()}`,
    };
  }

  if (options.pushOnly) {
    return { branch, pushed: true, pr: null };
  }

  // 2. Open PR via `gh`.
  const ghArgs = [
    'pr',
    'create',
    '--base',
    base,
    '--head',
    branch,
    '--title',
    options.title,
    '--body',
    options.body,
  ];
  if (options.draft) ghArgs.push('--draft');
  for (const reviewer of options.reviewers || []) {
    ghArgs.push('--reviewer', reviewer);
  }
  for (const label of options.labels || []) {
    ghArgs.push('--label', label);
  }

  const ghR = spawnSync('gh', ghArgs, { encoding: 'utf8' });
  if (ghR.status !== 0) {
    return {
      branch,
      pushed: true,
      pr: null,
      error: `gh pr create failed: ${(ghR.stderr || '').toString().trim()}\nRun \`gh auth status\` to verify CLI auth.`,
    };
  }

  // gh prints PR URL on stdout, e.g. "https://github.com/meltflake/sgai/pull/42"
  const url = ghR.stdout.toString().trim().split('\n').filter(Boolean).pop() || '';
  const numMatch = url.match(/\/pull\/(\d+)/);
  return {
    branch,
    pushed: true,
    pr: numMatch ? { url, number: Number(numMatch[1]) } : null,
  };
}

/**
 * Build a standardised PR body for data-refresh PRs. Pipelines call this
 * to get a uniform PR description with diff stat, source list, and
 * confidence breakdown.
 */
export interface PRBodyArgs {
  domain: string;
  diffStat: string;
  newEntries: { title: string; sourceUrl: string; confidence?: 'high' | 'medium' | 'low' }[];
  failedSources?: { url: string; error: string }[];
  checksPassed?: string[];
}

export function buildPRBody(args: PRBodyArgs): string {
  const lines: string[] = [];
  const high = args.newEntries.filter((e) => (e.confidence || 'high') === 'high').length;
  const med = args.newEntries.filter((e) => e.confidence === 'medium').length;
  const low = args.newEntries.filter((e) => e.confidence === 'low').length;

  lines.push('## Summary');
  lines.push(`- Domain: \`${args.domain}\``);
  lines.push(`- New entries: **${args.newEntries.length}**`);
  if (high + med + low > 0) {
    lines.push(`- Confidence: ${high} high · ${med} medium · ${low} low`);
  }
  if (low > 0) {
    lines.push(`- ⚠️ ${low} low-confidence entries marked \`_pendingReview: true\` (not rendered until cleared).`);
  }

  lines.push('');
  lines.push('## New entries');
  for (const entry of args.newEntries.slice(0, 50)) {
    const conf = entry.confidence ? ` _(${entry.confidence})_` : '';
    lines.push(`- ${entry.title}${conf} — ${entry.sourceUrl}`);
  }
  if (args.newEntries.length > 50) {
    lines.push(`- … and ${args.newEntries.length - 50} more`);
  }

  if (args.failedSources && args.failedSources.length > 0) {
    lines.push('');
    lines.push('## Failed sources');
    for (const f of args.failedSources.slice(0, 20)) {
      lines.push(`- ${f.url} — ${f.error}`);
    }
  }

  lines.push('');
  lines.push('## Diff');
  lines.push('```');
  lines.push(args.diffStat.trim());
  lines.push('```');

  if (args.checksPassed && args.checksPassed.length > 0) {
    lines.push('');
    lines.push('## Pre-merge checks (run locally before commit)');
    for (const c of args.checksPassed) lines.push(`- [x] ${c}`);
  }

  lines.push('');
  lines.push('🤖 Generated by sgai data-refresh pipeline.');
  return lines.join('\n');
}
