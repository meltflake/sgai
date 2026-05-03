// scripts/lib/notify-via-issue.ts
// ────────────────────────────────────────────────────────────────────────
// Open a GitHub issue (assigned to @me) as a notification channel for
// scan-only pipelines that don't open PRs (hansard / videos / voices) or
// for pipeline failures. Replaces the old SMTP/Gmail email path so the
// only out-of-process credential is `gh auth login`.
//
// The issue is always assigned to `@me` (the cron-running user), so
// GitHub's native notification system delivers the alert via email/web.
// Same UX as PR @-mentions — no separate SMTP setup.
//
// USAGE:
//   import { notifyViaIssue } from './lib/notify-via-issue';
//   await notifyViaIssue({
//     title: '[sgai] hansard: 3 new debates found',
//     body: 'New SPRS report IDs: ...',
//     labels: ['data-refresh', 'hansard', 'scan-result'],
//   });

import { spawnSync } from 'node:child_process';

export interface NotifyOptions {
  title: string;
  body: string;
  /** Defaults to ['@me']. Pass [] to skip assignment. */
  assignees?: string[];
  /** Optional labels. Created if missing? No — gh issue create requires existing labels.
   *  Use only labels you've created on the repo, or omit. */
  labels?: string[];
  /** Repo override (e.g. 'owner/repo'). Defaults to current dir's origin. */
  repo?: string;
}

export interface NotifyResult {
  url: string | null;
  error?: string;
}

/**
 * Open a new GitHub issue. Returns the URL on success or `error` on failure.
 * Failures are non-fatal — the caller decides whether to abort or continue.
 */
export function notifyViaIssue(options: NotifyOptions): NotifyResult {
  const args = ['issue', 'create', '--title', options.title, '--body', options.body];
  if (options.repo) args.push('--repo', options.repo);
  for (const a of options.assignees ?? ['@me']) args.push('--assignee', a);
  for (const l of options.labels ?? []) args.push('--label', l);

  const r = spawnSync('gh', args, { encoding: 'utf8' });
  if (r.status !== 0) {
    return {
      url: null,
      error: `gh issue create failed: ${(r.stderr || '').toString().trim()}`,
    };
  }
  const url = r.stdout.toString().trim().split('\n').filter(Boolean).pop() || null;
  return { url };
}
