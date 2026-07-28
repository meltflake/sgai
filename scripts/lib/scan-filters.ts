// scripts/lib/scan-filters.ts
// ────────────────────────────────────────────────────────────────────────
// Shared URL-layer noise filters for refresh-pipeline scans.
//
// Origin: policies/scan.ts grew a well-tested generic-page filter
// (GENERIC_SECTION_EXCLUDES + LISTING_ROOTS + isGenericOrLanding) while
// every other pipeline scanned raw. The 2026-07-28 dry-run audit (issue
// #166) showed the cost: legal-ai surfaced SSO /Browse/ index pages,
// tracker surfaced `?page=1..4` pagination duplicates of one IMDA film
// section, benchmarking kept resurfacing 2017-2024 archive-year reports.
// This module hoists the policies filter into lib/, adds the three
// missing capabilities (query-string awareness, URL normalization, year
// extraction), and provides a fair cross-source candidate selector.
//
// Consumers: policies/scan.ts (re-exports for its existing tests),
// _shared/run-template.ts (tracker / talent / benchmarking / startups),
// ecosystem/scan.ts, levers & legal-ai scanAll.

/** Sections that never hold a substantive policy / news / entity document.
 *  Applied to pathname only — see isGenericOrLanding for query handling. */
export const GENERIC_SECTION_EXCLUDES: RegExp[] = [
  /\/about(?:-us)?\//,
  /\/citizen-engagement\//,
  /\/engagement-programmes?\//,
  /\/events?\//,
  /\/showcases?\//,
  /\/careers?\//,
  /\/contact(?:-us)?\b/,
  /\/faqs?\b/,
  /\/feedback\//,
  /\/newsletter\b/,
  /\/subscribe\b/,
  /\/our-people\//,
  /\/leadership\//,
  /\/tenders?\//,
  /\/sitemap/,
  /\/search\b/,
  // Browse/index shells (sso.agc.gov.sg statute browser — issue #166:
  // /Browse/Act/Current etc. are navigation, never a specific statute).
  /\/browse\//i,
];

/** Listing / section-index roots: the URL terminates at the section itself
 *  with no article slug after it (e.g. `/initiatives/`, `/news/`).
 *  Substantive documents always carry a further slug. */
export const LISTING_ROOTS = new Set([
  'initiatives',
  'programmes-and-initiatives',
  'news',
  'newsroom',
  'media',
  'media-room',
  'press-releases',
  'resources',
  'publications',
  'announcements',
]);

/** Query params that mark a paginated listing view rather than a document.
 *  A URL carrying one is never a substantive doc, and its variants
 *  (?page=1..N) must collapse to one dedupe key. */
const PAGINATION_PARAMS = new Set(['page', 'start', 'offset', 'pg']);

function hasPaginationParam(u: URL): boolean {
  for (const key of u.searchParams.keys()) {
    if (PAGINATION_PARAMS.has(key.toLowerCase())) return true;
  }
  return false;
}

/** True when a URL is a generic section, an engagement/about page, a bare
 *  listing index, or a paginated listing view — anything that is not a
 *  specific document. Unparseable URLs are treated as noise (drop). */
export function isGenericOrLanding(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return true; // unparseable → drop
  }
  if (hasPaginationParam(parsed)) return true;
  const path = parsed.pathname;
  if (GENERIC_SECTION_EXCLUDES.some((re) => re.test(path))) return true;
  const lastSeg = path.replace(/\/+$/, '').split('/').pop() || '';
  return LISTING_ROOTS.has(lastSeg);
}

/** Canonical dedupe KEY for a URL: lowercased host, fragment stripped,
 *  pagination params stripped, trailing slash collapsed. Use the returned
 *  string for Set membership only — keep the ORIGINAL url for fetching
 *  (normalization must never change what gets requested). */
export function normalizeUrl(url: string): string {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  u.hash = '';
  for (const key of [...u.searchParams.keys()]) {
    if (PAGINATION_PARAMS.has(key.toLowerCase())) u.searchParams.delete(key);
  }
  u.hostname = u.hostname.toLowerCase();
  if (u.pathname !== '/' && u.pathname.endsWith('/')) {
    u.pathname = u.pathname.replace(/\/+$/, '');
  }
  let s = u.toString();
  if (s.endsWith('?')) s = s.slice(0, -1);
  return s;
}

/** First plausible year (19xx/20xx) in the URL path, or undefined. Used by
 *  sources with `minUrlYear` to skip archive editions (benchmarking kept
 *  re-surfacing 2017-2024 AI Index years). Fail-open: a URL with no year
 *  token is admitted — the gate only rejects provably-old editions. */
export function extractYearFromUrl(url: string): number | undefined {
  let path: string;
  try {
    path = new URL(url).pathname;
  } catch {
    return undefined;
  }
  const m = path.match(/(?:^|[^0-9])((?:19|20)\d{2})(?:[^0-9]|$)/);
  return m ? Number(m[1]) : undefined;
}

/** Fair candidate selection across sources: cap each source at `limit`,
 *  round-robin interleave, stop at `limit` total. Replaces run-template's
 *  old `limit * 4` early break, which let the FIRST source starve all
 *  later ones, in sitemap document order (archives first). Pure function
 *  — unit-testable without network. */
export function selectCandidates(perSource: string[][], limit: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const capped = perSource.map((list) => list.slice(0, limit));
  const maxLen = capped.reduce((max, list) => Math.max(max, list.length), 0);
  for (let i = 0; i < maxLen && out.length < limit; i += 1) {
    for (const list of capped) {
      if (out.length >= limit) break;
      const url = list[i];
      if (url === undefined || seen.has(url)) continue;
      seen.add(url);
      out.push(url);
    }
  }
  return out;
}
