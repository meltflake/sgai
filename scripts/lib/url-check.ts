// URL reachability validator for "LLM-supplemented" data pipelines.
//
// Front-line defense against fabricated URLs whose format looks right
// but the page never existed (e.g. `fintechfestival.sg/speakers/spkr<NUMBER>-<slug>`
// where the slug is real but the spkr ID was hallucinated).
//
// Per CLAUDE.md rule #6 (sourceUrl 真实性约定): every "LLM 补脑" pipeline
// — voices prospect, manual edits, agent batch backfill, etc. — must run
// every sourceUrl through this check before writing to src/data/*.ts.
//
// Pipelines that already have ground-truth APIs (hansard SPRS, YouTube)
// don't need this — the URL is asserted by the upstream API, not invented.

export type UrlCheckEntry = {
  url: string;
  /** Where in the prospect record the url lives, e.g. 'signatureWork[2].sourceUrl'. Used for error reports only. */
  context?: string;
};

export type UrlCheckResult = {
  url: string;
  context?: string;
  /** HTTP status number, or `'ERR:<name>'` for fetch failures. */
  status: number | string;
};

export type ValidateOptions = {
  /** Max parallel fetches. Default 6. */
  concurrency?: number;
  /** Per-request timeout. Default 10 s. */
  timeoutMs?: number;
};

/**
 * Treat as "reachable enough":
 * - 2xx, 3xx — page exists.
 * - 401 / 403 / 429 — bot wall, paywall, or rate limit. Page likely real;
 *   we can't disprove existence. Caller should still hand-verify.
 *
 * Anything else (404, 410, 5xx, network/DNS error, timeout) → broken.
 */
export function isReachable(status: number | string): boolean {
  if (typeof status !== 'number') return false;
  if (status >= 200 && status < 400) return true;
  return status === 401 || status === 403 || status === 429;
}

/**
 * Validate a list of URLs concurrently. Returns only the broken ones.
 * Pass an empty array → empty array (no work).
 */
export async function validateUrls(
  entries: UrlCheckEntry[],
  opts: ValidateOptions = {},
): Promise<UrlCheckResult[]> {
  const concurrency = opts.concurrency ?? 6;
  const timeoutMs = opts.timeoutMs ?? 10000;
  const broken: UrlCheckResult[] = [];
  const queue = [...entries];

  async function worker() {
    while (queue.length) {
      const item = queue.shift();
      if (!item) break;
      const status = await checkOne(item.url, timeoutMs);
      if (!isReachable(status)) broken.push({ url: item.url, context: item.context, status });
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, entries.length) }, () => worker());
  await Promise.all(workers);
  return broken;
}

async function checkOne(url: string, timeoutMs: number): Promise<number | string> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  const headers = { 'User-Agent': 'Mozilla/5.0 (sgai url-check)' };
  try {
    let resp = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal, headers });
    // Some servers reject HEAD; retry as GET.
    if (resp.status === 405 || resp.status === 501) {
      resp = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers });
    }
    return resp.status;
  } catch (err) {
    const e = err as { name?: string };
    return `ERR:${e.name ?? 'fetch'}`;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Walk a prospect-shaped object and pull every sourceUrl from the standard
 * voices fields. Handy default for voices/people-style data; other
 * pipelines should hand-build their own UrlCheckEntry[] list.
 */
export function collectVoicesSourceUrls(
  data: Record<string, unknown>,
  fields: readonly string[] = ['signatureWork', 'notableQuotes', 'speakingRecord', 'externalRoles'],
): UrlCheckEntry[] {
  const out: UrlCheckEntry[] = [];
  for (const k of fields) {
    const arr = data[k];
    if (!Array.isArray(arr)) continue;
    arr.forEach((entry, i) => {
      if (entry && typeof entry === 'object') {
        const url = (entry as Record<string, unknown>).sourceUrl;
        if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
          out.push({ url, context: `${k}[${i}].sourceUrl` });
        }
      }
    });
  }
  return out;
}
