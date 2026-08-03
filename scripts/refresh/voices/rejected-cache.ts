// scripts/refresh/voices/rejected-cache.ts
// ────────────────────────────────────────────────────────────────────────
// Persistent reject cache for the voices pipeline. Two decisions are
// cached so a rejected candidate never blocks the weekly --limit slots
// again (without this, the same 3 old / non-AI pages would be re-fetched
// and re-judged every single run and the pipeline would stall forever —
// fatal for PMO, whose sitemap carries ~575 speech pages back to 2012
// with no usable date signal before fetch):
//   'pre-floor' — published before the new-source intake floor
//   'non-ai'    — content judge said the speech is not about AI
//
// Same pattern as scripts/refresh/reg-lookahead's judged-non-ai.json.
// The file is committed so cron runs on a fresh checkout inherit it.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface RejectedEntry {
  reason: 'pre-floor' | 'non-ai';
  /** Publication date when known (pre-floor rejects). */
  date?: string | null;
  decidedAt: string;
  /** Judge reason snippet for non-ai rejects. */
  note?: string;
}

const CACHE_FILE = resolve('scripts/refresh/voices/data/rejected-ids.json');

export function loadRejectedIds(filePath: string = CACHE_FILE): Record<string, RejectedEntry> {
  if (!existsSync(filePath)) return {};
  try {
    const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, RejectedEntry>;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveRejectedIds(
  entries: Record<string, RejectedEntry>,
  filePath: string = CACHE_FILE
): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const sorted = Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(filePath, `${JSON.stringify(sorted, null, 2)}\n`);
}
