/**
 * Per-domain "seen and rejected" URL ledger for the refresh pipelines.
 *
 * Why: run-template dedupes candidates only against URLs already present in
 * the target data file. When a reviewer closes an auto-PR without merging,
 * the candidate is in neither the data file nor any committed cache, so the
 * next run proposes it again (2026-08-15 tracker/benchmarking candidates
 * came back verbatim on 2026-09-04). Closing a PR should therefore also add
 * the URL here — the file is committed on main and consulted before scan.
 *
 * Two files are consulted for every domain:
 *   scripts/refresh/<domain>/data/rejected-urls.json  — this domain only
 *   scripts/refresh/_shared/data/rejected-urls.json   — every domain
 * Entries look like:
 *   [{ "url": "...", "reason": "...", "decidedAt": "YYYY-MM-DD", "ref": "#204" }]
 *
 * The shared file exists because a per-domain ledger is escapable: the Global
 * AI Vibrancy Tool was rejected for benchmarking in #205 and came back three
 * weeks later as a tracker candidate (#273). "Already covered elsewhere on the
 * site" is a site-wide judgement, so it belongs in the shared file; reasons
 * that are about fit for one domain stay in that domain's file.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface RejectedUrl {
  url: string;
  reason: string;
  decidedAt: string;
  ref?: string;
}

export function rejectedUrlsPath(domain: string): string {
  return resolve(`scripts/refresh/${domain}/data/rejected-urls.json`);
}

export const SHARED_REJECTED_URLS_PATH = resolve('scripts/refresh/_shared/data/rejected-urls.json');

export function loadRejectedUrls(domain: string, path = rejectedUrlsPath(domain)): RejectedUrl[] {
  if (!existsSync(path)) return [];
  const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  if (!Array.isArray(raw)) throw new Error(`${path}: expected a JSON array`);
  return raw.map((entry, i) => {
    if (typeof entry === 'string') return { url: entry, reason: 'rejected', decidedAt: '' };
    const e = entry as Partial<RejectedUrl>;
    if (!e.url || typeof e.url !== 'string') throw new Error(`${path}[${i}]: missing url`);
    return { url: e.url, reason: e.reason ?? 'rejected', decidedAt: e.decidedAt ?? '', ref: e.ref };
  });
}

/**
 * Add every rejected URL for `domain` into `existing` (mutates it); returns how
 * many were added. Reads the domain ledger plus the shared one. Passing an
 * explicit `path` reads only that file (used by tests).
 */
export function mergeRejectedUrls(domain: string, existing: Set<string>, path?: string): number {
  const rejected =
    path === undefined
      ? [...loadRejectedUrls(domain), ...loadRejectedUrls('_shared', SHARED_REJECTED_URLS_PATH)]
      : loadRejectedUrls(domain, path);
  for (const r of rejected) existing.add(r.url);
  return rejected.length;
}

/**
 * Record pipeline-side rejections (e.g. the AI-relevance judge said "off-topic")
 * so the same pages do not come back and use the next run's --limit budget
 * (2026-10-21: five unrelated MDDI pages headed the policies list every month).
 * Appends entries whose URL is not already in the file; returns how many.
 */
export function appendRejectedUrls(domain: string, entries: RejectedUrl[], path = rejectedUrlsPath(domain)): number {
  if (entries.length === 0) return 0;
  const existing = loadRejectedUrls(domain, path);
  const have = new Set(existing.map((e) => e.url));
  const fresh = entries.filter((e) => !have.has(e.url) && have.add(e.url));
  if (fresh.length === 0) return 0;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify([...existing, ...fresh], null, 2) + '\n');
  return fresh.length;
}
