// scripts/refresh/signals/select.ts
// Window gate and final selection: keep SG + AI items scoring >= minScore,
// collapse duplicates of one event (same eventKey or overlapping headline,
// higher-priority source wins), then sort by score desc, date desc.

import type { Judgment } from './judge.ts';
import type { SignalCandidate } from './scan.ts';
import { sourcePriority } from './sources.ts';

export interface Judged {
  candidate: SignalCandidate;
  judgment: Judgment;
  /** YYYY-MM-DD publication date resolved from the page or the feed. */
  pageDate: string;
  contentText: string;
}

const DAY = 86_400_000;

/** True when `date` is between `today - days` and `today`, both inclusive —
 *  the same bound the scan's cheap date filter uses. */
export function withinWindow(date: string | null, today: string, days: number): boolean {
  if (!date) return false;
  const d = Date.parse(`${date}T00:00:00Z`);
  const t = Date.parse(`${today}T00:00:00Z`);
  if (!Number.isFinite(d) || !Number.isFinite(t)) return false;
  return d <= t && d >= t - days * DAY;
}

const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'for', 'in', 'on', 'and', 'with', 'at', 'by', 'its', 'as', 'from', 'new']);

function words(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 1 && !STOP.has(w))
  );
}

function sameHeadline(a: string, b: string): boolean {
  const A = words(a);
  const B = words(b);
  if (A.size < 3 || B.size < 3) return false;
  let shared = 0;
  for (const w of A) if (B.has(w)) shared += 1;
  return shared / Math.min(A.size, B.size) >= 0.8;
}

function sameEvent(x: Judged, y: Judged): boolean {
  if (x.judgment.eventKey && x.judgment.eventKey === y.judgment.eventKey) return true;
  return sameHeadline(x.candidate.title, y.candidate.title);
}

function better(x: Judged, y: Judged): Judged {
  const px = sourcePriority(x.candidate.url);
  const py = sourcePriority(y.candidate.url);
  if (px !== py) return px > py ? x : y;
  return x.judgment.score >= y.judgment.score ? x : y;
}

/** Fetch order for the per-run cap: gov.sg, then institutions, then media;
 *  newest hinted date first within a tier, undated last. Stable otherwise. */
export function orderForFetch<T extends { url: string; hintedDate?: string }>(cands: T[]): T[] {
  return cands
    .map((c, i) => ({ c, i }))
    .sort(
      (a, b) =>
        sourcePriority(b.c.url) - sourcePriority(a.c.url) ||
        (b.c.hintedDate ?? '').localeCompare(a.c.hintedDate ?? '') ||
        a.i - b.i
    )
    .map((x) => x.c);
}

export function selectSignals(judged: Judged[], limit: number, minScore = 4): Judged[] {
  const eligible = judged.filter((j) => j.judgment.singapore && j.judgment.ai && j.judgment.score >= minScore);
  const groups: Judged[] = [];
  for (const j of eligible) {
    const i = groups.findIndex((g) => sameEvent(g, j));
    if (i < 0) groups.push(j);
    else groups[i] = better(groups[i], j);
  }
  return groups
    .sort((a, b) => b.judgment.score - a.judgment.score || b.pageDate.localeCompare(a.pageDate))
    .slice(0, limit);
}
