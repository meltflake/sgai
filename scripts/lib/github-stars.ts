// scripts/lib/github-stars.ts
// ────────────────────────────────────────────────────────────────────────
// GitHub repo metadata primitives. Extracted from
// scripts/refresh/github-stars.ts so other pipelines (e.g. ecosystem with
// company GitHub orgs) can reuse the same parser + fetcher.
//
// USAGE:
//   import { parseGithubUrl, fetchRepoStats, findGithubBlocks } from './lib/github-stars';
//   const repo = parseGithubUrl('https://github.com/aisingapore/sealion');
//   const stats = await fetchRepoStats(repo.owner, repo.repo);

import { spawnSync } from 'node:child_process';

export interface ParsedRepo {
  owner: string;
  repo: string;
}

export interface RepoStats {
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string | null;
  archived: boolean;
}

export interface GithubBlock {
  url: string;
  urlLineIndex: number;
  starsLineIndex: number | null;
  starsValue: number | null;
}

/**
 * Parse a GitHub repo URL. Returns null for org pages (no /<repo>),
 * raw asset URLs, gists, or non-github hosts.
 */
export function parseGithubUrl(url: string): ParsedRepo | null {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/?#]+)(?:[/?#].*)?$/i);
  if (!match) return null;
  const owner = match[1];
  const repo = match[2].replace(/\.git$/, '');
  if (!owner || !repo) return null;
  return { owner, repo };
}

/**
 * Resolve a GitHub token. Priority:
 *   1. GITHUB_TOKEN env var
 *   2. `gh auth token` (uses the keychain token from gh CLI login)
 *   3. unauthenticated (60 req/hour cap)
 */
function resolveGithubToken(): string | null {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const r = spawnSync('gh', ['auth', 'token'], { encoding: 'utf8' });
    if (r.status === 0) {
      const token = r.stdout.toString().trim();
      if (token) return token;
    }
  } catch {
    /* gh not installed; fall through to unauthenticated */
  }
  return null;
}

let _cachedToken: string | null | undefined;
function getGithubToken(): string | null {
  if (_cachedToken === undefined) _cachedToken = resolveGithubToken();
  return _cachedToken;
}

/**
 * Fetch repo stats from the GitHub API. Auto-resolves auth from
 * GITHUB_TOKEN or `gh auth token`. Falls back to unauthenticated
 * (60 req/hour) only if neither is available.
 */
export async function fetchRepoStats(owner: string, repo: string): Promise<RepoStats> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'sgai-refresh',
  };
  const token = getGithubToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${text.slice(0, 200)}`);
  }
  const data = (await response.json()) as RepoStats;
  return data;
}

/** Test-only: clear the cached token resolution (lets tests swap env vars). */
export function _resetGithubTokenCache(): void {
  _cachedToken = undefined;
}

/**
 * Scan source text for `url: '<github-url>'` literals and pair each with
 * its adjacent `stars: <N>,` field within the same record block. Returns
 * one entry per github URL.
 *
 * Matches both layouts:
 *   - stars line BEFORE url line
 *   - stars line AFTER url line
 * up to 12 lines apart, stopping at any record-closing brace.
 */
export function findGithubBlocks(source: string): GithubBlock[] {
  const lines = source.split('\n');
  const matches: GithubBlock[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const m = line.match(/url:\s*['"](https:\/\/github\.com\/[^'"]+)['"]/);
    if (!m) continue;
    const url = m[1];

    let starsLine: number | null = null;
    let starsVal: number | null = null;

    for (let j = i - 1; j >= Math.max(0, i - 12); j -= 1) {
      if (/^\s*\},?\s*$/.test(lines[j])) break;
      const sm = lines[j].match(/^\s*stars:\s*(\d+)\s*,/);
      if (sm) {
        starsLine = j;
        starsVal = Number(sm[1]);
        break;
      }
    }

    if (starsLine === null) {
      for (let j = i + 1; j < Math.min(lines.length, i + 12); j += 1) {
        if (/^\s*\},?\s*$/.test(lines[j])) break;
        const sm = lines[j].match(/^\s*stars:\s*(\d+)\s*,/);
        if (sm) {
          starsLine = j;
          starsVal = Number(sm[1]);
          break;
        }
      }
    }

    matches.push({ url, urlLineIndex: i, starsLineIndex: starsLine, starsValue: starsVal });
  }

  return matches;
}

/**
 * In-place rewrite of a `stars: N` line to a new value. Returns the
 * mutated lines array. Pure; doesn't touch disk.
 */
export function rewriteStarsLine(lines: string[], lineIndex: number, newStars: number): string[] {
  const out = lines.slice();
  out[lineIndex] = out[lineIndex].replace(/stars:\s*\d+/, `stars: ${newStars}`);
  return out;
}
