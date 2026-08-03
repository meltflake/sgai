// scripts/refresh/jobs-index/api.ts
// ────────────────────────────────────────────────────────────────────────
// MyCareersFuture v2 API client. Public government API (Workforce
// Singapore), JSON, no auth. We sweep each basket query with pagination
// and hand raw job objects to compute.ts.

import type { McfJob } from './compute.ts';

const API_BASE = 'https://api.mycareersfuture.gov.sg/v2/jobs';
const PAGE_SIZE = 100;
/** Hard page cap per query — 30 pages = 3,000 jobs, far above any observed
 *  total; guards against a pagination bug looping forever. */
const MAX_PAGES = 30;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

interface McfResponse {
  total?: number;
  results?: McfJob[];
  _links?: { next?: { href?: string } };
}

async function fetchUrl(url: string, retries = 2): Promise<McfResponse> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
      if (r.status === 429 || r.status >= 500) throw new Error(`HTTP ${r.status}`);
      if (!r.ok) throw new Error(`HTTP ${r.status} (non-retryable)`);
      return (await r.json()) as McfResponse;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (attempt >= retries || msg.includes('non-retryable')) throw err;
      await new Promise((res) => setTimeout(res, (attempt + 1) ** 2 * 1000));
    }
  }
}

export interface QuerySweep {
  query: string;
  total: number;
  jobs: McfJob[];
}

/** Sweep one query to exhaustion by following the API's own `_links.next`
 *  cursor. IMPORTANT (verified live 2026-08-03): the `offset` query param
 *  is silently IGNORED by this API — pagination is `page`-based, and
 *  `_links.next` is the authority. Offset-based paging fetched the first
 *  page repeatedly and collapsed the union to a fraction of the real
 *  total. Validates payload shape loudly — schema drift must fail the
 *  run, not emit garbage. */
export async function sweepQuery(query: string): Promise<QuerySweep> {
  const jobs: McfJob[] = [];
  let total = 0;
  let url: string | undefined = `${API_BASE}?search=${encodeURIComponent(query)}&limit=${PAGE_SIZE}`;
  for (let page = 0; url && page < MAX_PAGES; page += 1) {
    const data: McfResponse = await fetchUrl(url);
    if (typeof data.total !== 'number' || !Array.isArray(data.results)) {
      throw new Error(`MCF API schema drift on "${query}": missing total/results`);
    }
    total = data.total;
    for (const job of data.results) {
      if (typeof job.uuid !== 'string' || typeof job.title !== 'string') {
        throw new Error(`MCF API schema drift on "${query}": job missing uuid/title`);
      }
      jobs.push(job);
    }
    if (data.results.length === 0) break;
    url = data._links?.next?.href;
    if (url) await new Promise((res) => setTimeout(res, 300)); // be polite
  }
  return { query, total, jobs };
}

/** Human-visitable search URL recorded on each snapshot (url-health). */
export function searchUrl(query: string): string {
  return `https://www.mycareersfuture.gov.sg/search?search=${encodeURIComponent(query)}&sortBy=relevancy`;
}
