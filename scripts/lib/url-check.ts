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
 * - 999 — LinkedIn's anti-bot signal (and a few similar JS-required sites).
 *   Treated as a soft-warn rather than a hard fail; the page exists, the
 *   server just doesn't want a non-browser User-Agent.
 *
 * Anything else (404, 410, 5xx, network/DNS error, timeout) → broken.
 */
export function isReachable(status: number | string): boolean {
  if (typeof status !== 'number') return false;
  if (status >= 200 && status < 400) return true;
  return status === 401 || status === 403 || status === 429 || status === 999;
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
  // Browser-shaped User-Agent. A bare "sgai url-check" UA gets bot-walled
  // (LinkedIn 404, several .gov.sg pages 403). Sites that block bots on
  // a real browser UA via JS challenge already return 999 / 403, which
  // isReachable treats as soft-warn anyway.
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  async function fetchOnce(method: 'HEAD' | 'GET'): Promise<Response> {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { method, redirect: 'follow', signal: controller.signal, headers });
    } finally {
      clearTimeout(t);
    }
  }

  try {
    let resp = await fetchOnce('HEAD');
    // Some servers reject HEAD or return wrong status for HEAD.
    if (resp.status === 405 || resp.status === 501 || resp.status === 404) {
      try {
        const getResp = await fetchOnce('GET');
        // Only override if GET reveals the page is actually live.
        if (getResp.status < 400 || getResp.status === 401 || getResp.status === 403 || getResp.status === 429) {
          resp = getResp;
        } else if (resp.status === 405 || resp.status === 501) {
          resp = getResp;
        }
      } catch {
        /* keep HEAD result */
      }
    }
    return resp.status;
  } catch (err) {
    const e = err as { name?: string };
    // Slow / flaky server → AbortError. Retry once with GET; servers
    // sometimes stall on HEAD but stream a quick GET.
    if (e.name === 'AbortError') {
      try {
        const resp = await fetchOnce('GET');
        return resp.status;
      } catch (err2) {
        const e2 = err2 as { name?: string };
        return `ERR:${e2.name ?? 'fetch'}`;
      }
    }
    return `ERR:${e.name ?? 'fetch'}`;
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
