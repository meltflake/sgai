// scripts/lib/stale-gate.ts
// ────────────────────────────────────────────────────────────────────────
// Old-news gate for discovery pipelines.
//
// Why: the ecosystem refresh on 2026-09-07 (#294) proposed a GovTech press
// release from June 2020 as a new entity. The sitemap source has no dates,
// nothing in the pipeline looked at one, and the six-year-old page sailed
// through summarisation, the AI-relevance judge and emit. A discovery feed
// is for what is new; anything older than the window is not a candidate.
//
// Three cheap date hints, in order of trust:
//   1. an explicit date (RSS pubDate, sitemap lastmod, page meta, summary)
//   2. a year embedded in the URL path (/2020/06/...) — upper-bounded to
//      Dec 31 of that year, so it can only ever say "definitely old"
//   3. nothing → not stale (unknown age is a human's call, not a drop)

import { extractYearFromUrl } from './scan-filters.ts';

export interface StaleVerdict {
  stale: boolean;
  /** ISO YYYY-MM-DD the verdict was based on, or null when unknown. */
  date: string | null;
  /** Whole days between `date` and now; null when unknown. */
  ageDays: number | null;
}

const DAY_MS = 86_400_000;

/** Normalise an RFC 2822 / ISO / "YYYY-MM" date string to YYYY-MM-DD, or null. */
export function parseDateLoose(input: string | null | undefined): string | null {
  if (!input) return null;
  const s = String(input).trim();
  if (!s) return null;
  const ym = s.match(/^(\d{4})-(\d{2})$/);
  if (ym) return `${ym[1]}-${ym[2]}-01`;
  const t = Date.parse(s);
  if (Number.isNaN(t)) return null;
  const d = new Date(t);
  if (d.getUTCFullYear() < 1990 || d.getUTCFullYear() > 2100) return null;
  return d.toISOString().slice(0, 10);
}

/**
 * Is `date` older than `maxAgeDays`? `maxAgeDays <= 0` disables the gate.
 * Unknown / unparseable dates are never stale.
 */
export function isStale(
  date: string | null | undefined,
  maxAgeDays: number,
  now: Date = new Date()
): StaleVerdict {
  const iso = parseDateLoose(date);
  if (!iso) return { stale: false, date: null, ageDays: null };
  const ageDays = Math.floor((now.getTime() - Date.parse(iso)) / DAY_MS);
  if (!(maxAgeDays > 0)) return { stale: false, date: iso, ageDays };
  return { stale: ageDays > maxAgeDays, date: iso, ageDays };
}

/**
 * Stale by URL year alone. A year in the path (`/2020/06/slug`) bounds the
 * publication date to that calendar year, so use Dec 31 as the latest it
 * could be. Returns a non-stale verdict when the URL carries no year.
 */
export function isStaleByUrlYear(url: string, maxAgeDays: number, now: Date = new Date()): StaleVerdict {
  const year = extractYearFromUrl(url);
  if (!year) return { stale: false, date: null, ageDays: null };
  return isStale(`${year}-12-31`, maxAgeDays, now);
}

export interface StaleHints {
  /** Publication dates (RSS pubDate, page meta, summariser). Authoritative:
   *  the first one that parses decides, fresh or stale. */
  published?: Array<string | null | undefined>;
  /** Last-modified dates (sitemap lastmod). A CMS migration refreshes
   *  every page's lastmod, so a recent value proves nothing; an old value
   *  still proves the page is at least that old. */
  modified?: Array<string | null | undefined>;
  /** URL whose path may carry a year (/2021-10-28-slug). Proves old only. */
  url?: string;
}

/**
 * Combine the hints: a parseable publication date decides outright;
 * otherwise any modified date or URL year that is past the window makes
 * the page stale; otherwise unknown (not stale).
 */
export function staleVerdict(hints: StaleHints, maxAgeDays: number, now: Date = new Date()): StaleVerdict {
  for (const h of hints.published ?? []) {
    const v = isStale(h, maxAgeDays, now);
    if (v.date) return v;
  }
  let firstBound: StaleVerdict | null = null;
  for (const h of hints.modified ?? []) {
    const v = isStale(h, maxAgeDays, now);
    if (!v.date) continue;
    if (v.stale) return v;
    firstBound ??= v;
  }
  if (hints.url) {
    const v = isStaleByUrlYear(hints.url, maxAgeDays, now);
    if (v.stale) return v;
    firstBound ??= v.date ? v : null;
  }
  return firstBound ?? { stale: false, date: null, ageDays: null };
}
