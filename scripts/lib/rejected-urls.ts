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
 * File: scripts/refresh/<domain>/data/rejected-urls.json
 *   [{ "url": "...", "reason": "...", "decidedAt": "YYYY-MM-DD", "ref": "#204" }]
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface RejectedUrl {
  url: string;
  reason: string;
  decidedAt: string;
  ref?: string;
}

export function rejectedUrlsPath(domain: string): string {
  return resolve(`scripts/refresh/${domain}/data/rejected-urls.json`);
}

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

/** Add every rejected URL for `domain` into `existing` (mutates and returns it). */
export function mergeRejectedUrls(domain: string, existing: Set<string>, path?: string): number {
  const rejected = loadRejectedUrls(domain, path);
  for (const r of rejected) existing.add(r.url);
  return rejected.length;
}
