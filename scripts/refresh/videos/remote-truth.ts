// scripts/refresh/videos/remote-truth.ts
// ────────────────────────────────────────────────────────────────────────
// Cross-checkout truth for video id allocation and dedupe.
//
// Incident 2026-08-16/17 (#207–#210): each daily run cut its branch from
// the LOCAL main and allocated ids from the LOCAL videos.ts — a stale
// checkout and unmerged sibling PRs were both invisible, so three PRs
// emitted the same video as v081 on consecutive days.
//
// This module unions the local file with:
//   1. origin/main:src/data/videos.ts   (protects against a stale local main)
//   2. every open data-refresh/videos/* PR branch's videos.ts
//      (protects against unmerged sibling PRs)
//
// Every remote read is FAIL-OPEN: on any git/gh error the union degrades
// to whatever was gathered so far (worst case: exactly the old local-only
// behaviour, never worse).

import { execFileSync } from 'node:child_process';

export interface VideosFileFacts {
  /** YouTube video ids present in the file. */
  youtubeIds: Set<string>;
  /** Highest vNNN number in the file (0 when none). */
  maxId: number;
}

/** Pure parser: youtube ids + max vNNN from a videos.ts source string. */
export function parseVideosFile(content: string): VideosFileFacts {
  const youtubeIds = new Set<string>();
  for (const m of content.matchAll(/youtubeUrl:\s*'https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]+)'/g)) {
    youtubeIds.add(m[1]);
  }
  let maxId = 0;
  for (const m of content.matchAll(/id:\s*'v(\d{3,})'/g)) {
    const n = Number(m[1]);
    if (n > maxId) maxId = n;
  }
  return { youtubeIds, maxId };
}

/** Union facts in place: a ∪= b. */
export function unionFacts(a: VideosFileFacts, b: VideosFileFacts): VideosFileFacts {
  for (const id of b.youtubeIds) a.youtubeIds.add(id);
  if (b.maxId > a.maxId) a.maxId = b.maxId;
  return a;
}

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

/** Facts from origin/main + all open data-refresh/videos/* PR branches.
 *  `notes` records what was actually reachable (for run logs). */
export function gatherRemoteVideoFacts(): { facts: VideosFileFacts; notes: string[] } {
  const facts: VideosFileFacts = { youtubeIds: new Set(), maxId: 0 };
  const notes: string[] = [];

  try {
    git(['fetch', 'origin', 'main', '--quiet']);
    const content = git(['show', 'origin/main:src/data/videos.ts']);
    const f = parseVideosFile(content);
    unionFacts(facts, f);
    notes.push(`origin/main: ${f.youtubeIds.size} videos, max v${String(f.maxId).padStart(3, '0')}`);
  } catch (error) {
    notes.push(`origin/main unreachable (${error instanceof Error ? error.message.slice(0, 60) : 'error'})`);
  }

  let branches: string[] = [];
  try {
    const out = execFileSync(
      'gh',
      ['pr', 'list', '--state', 'open', '--json', 'headRefName', '--jq', '.[].headRefName'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    );
    branches = out
      .split('\n')
      .map((s) => s.trim())
      .filter((b) => b.startsWith('data-refresh/videos/'));
  } catch (error) {
    notes.push(`gh pr list failed (${error instanceof Error ? error.message.slice(0, 60) : 'error'})`);
  }

  for (const branch of branches) {
    try {
      git(['fetch', 'origin', branch, '--quiet']);
      const content = git(['show', `origin/${branch}:src/data/videos.ts`]);
      const f = parseVideosFile(content);
      unionFacts(facts, f);
      notes.push(`${branch}: ${f.youtubeIds.size} videos, max v${String(f.maxId).padStart(3, '0')}`);
    } catch {
      notes.push(`${branch}: unreadable, skipped`);
    }
  }

  return { facts, notes };
}
