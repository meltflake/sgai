// src/utils/signals.ts
// ────────────────────────────────────────────────────────────────────────
// Pure view logic for Signals: the homepage window, ISO-week grouping for
// /signals/, and topic counts for the filter bar. Dates are YYYY-MM-DD
// strings, handled in UTC so the build machine's timezone never shifts a day.

import type { Signal } from '~/data/signals';

const DAY = 86_400_000;

function toUtc(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

function fromUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function byDateDesc(a: Signal, b: Signal): number {
  return b.date.localeCompare(a.date) || a.id.localeCompare(b.id);
}

/**
 * Signals for the homepage block: the last `days` days (newest first, at
 * most `max`). When that window holds fewer than `min`, show the newest
 * `max` overall so the block never looks abandoned. Empty in → empty out.
 */
export function homeSignals(
  all: Signal[],
  today: string,
  opts: { days?: number; max?: number; min?: number } = {}
): Signal[] {
  const { days = 14, max = 6, min = 3 } = opts;
  const sorted = [...all].sort(byDateDesc);
  const cutoff = toUtc(today) - (days - 1) * DAY;
  const recent = sorted.filter((s) => toUtc(s.date) >= cutoff);
  return (recent.length >= min ? recent : sorted).slice(0, max);
}

export interface SignalWeek {
  /** ISO week key, e.g. '2026-W42'. */
  key: string;
  monday: string;
  sunday: string;
  items: Signal[];
}

/** ISO 8601 week: weeks start Monday; week 1 holds the year's first Thursday. */
function isoWeek(date: string): { key: string; monday: string; sunday: string } {
  const ms = toUtc(date);
  const dow = (new Date(ms).getUTCDay() + 6) % 7; // Monday = 0
  const monday = ms - dow * DAY;
  const thursday = monday + 3 * DAY;
  const isoYear = new Date(thursday).getUTCFullYear();
  const week = Math.floor((thursday - Date.UTC(isoYear, 0, 1)) / (7 * DAY)) + 1;
  return {
    key: `${isoYear}-W${String(week).padStart(2, '0')}`,
    monday: fromUtc(monday),
    sunday: fromUtc(monday + 6 * DAY),
  };
}

/** Group signals by ISO week, newest week first, items date desc. */
export function groupByIsoWeek(all: Signal[]): SignalWeek[] {
  const weeks = new Map<string, SignalWeek>();
  for (const s of [...all].sort(byDateDesc)) {
    const w = isoWeek(s.date);
    const bucket = weeks.get(w.key) ?? { ...w, items: [] };
    bucket.items.push(s);
    weeks.set(w.key, bucket);
  }
  return [...weeks.values()].sort((a, b) => b.monday.localeCompare(a.monday));
}

/** Topic ids with their signal counts, count desc then id asc. */
export function topicCounts(all: Signal[]): Array<{ id: string; count: number }> {
  const counts = new Map<string, number>();
  for (const s of all) for (const id of s.topicIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  return [...counts.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
}
