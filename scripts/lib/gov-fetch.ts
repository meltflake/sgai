// scripts/lib/gov-fetch.ts
// ────────────────────────────────────────────────────────────────────────
// Generic .gov.sg / official-site fetcher.
//
// Pulls a URL with retries + polite throttling, then extracts:
//   - title (from <title>, og:title, h1)
//   - publishedDate (from <time>, meta tags, common date selectors)
//   - contentText (visible body text, stripped of nav/footer)
//   - pdfLinks[] (any <a href> ending in .pdf)
//   - sourceUrl (canonical URL after redirects)
//
// Designed for hand-coded scan strategies in policies/levers/legal-ai
// pipelines, NOT for crawling. Each call is one URL; caller orchestrates.
//
// USAGE:
//   import { govFetch, listSitemap } from './lib/gov-fetch';
//   const page = await govFetch('https://www.imda.gov.sg/news/...');
//   const urls = await listSitemap('https://www.imda.gov.sg/sitemap.xml');

export interface GovPage {
  sourceUrl: string;
  title: string;
  publishedDate: string | null;
  /** Which rule produced publishedDate. 'modified' means the page only states
   *  a last-modified time, which says nothing about when it was first published. */
  publishedDateSource?: DateSource | null;
  contentText: string;
  pdfLinks: string[];
  status: number;
}

export type DateSource = 'time' | 'published' | 'modified' | 'meta' | 'inline';

export interface FetchOptions {
  retries?: number;
  timeoutMs?: number;
  userAgent?: string;
  sleepBetweenMs?: number;
}

// Identify as a real desktop browser. Some publisher sites (Business Times,
// Stanford HAI) reject obvious bot UAs. Cloudflare-protected sites (e27,
// govinsider) will still block the JS challenge regardless — those need
// a headless browser (out of scope here).
const DEFAULT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 sgai-refresh/1.0';
const DEFAULT_RETRIES = 3;
const DEFAULT_TIMEOUT_MS = 15000;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
      .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
      .replace(/<header[\s\S]*?<\/header>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function extractTitle(html: string): string {
  const og = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (og) return decodeEntities(og[1].trim());
  const t = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (t) return decodeEntities(t[1].replace(/\s+/g, ' ').trim());
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return stripTags(h1[1]);
  return '';
}

function extractDate(html: string): { date: string | null; source: DateSource | null } {
  const hit = (raw: string, source: DateSource) => {
    const date = normalizeDate(raw.trim());
    return date ? { date, source } : null;
  };
  // Prefer <time datetime="...">
  const timeTag = html.match(/<time[^>]+datetime=["']([^"']+)["']/i);
  if (timeTag) {
    const h = hit(timeTag[1], 'time');
    if (h) return h;
  }
  // Structured publication fields: JSON-LD, and Next.js flight payloads where
  // the quotes are backslash-escaped (gov.sg sites: "publish_date":"07 Jun 2023").
  const structured = html.match(
    /\\?"(?:datePublished|publish_date|publishDate|published_date|date_published)\\?"\s*:\s*\\?"([^"\\]+)/i
  );
  if (structured) {
    const h = hit(structured[1], 'published');
    if (h) return h;
  }
  // Common meta tags
  const metas: Array<[RegExp, DateSource]> = [
    [/<meta\s+(?:property|name)=["']article:published_time["']\s+content=["']([^"']+)["']/i, 'published'],
    [/<meta\s+(?:property|name)=["']article:modified_time["']\s+content=["']([^"']+)["']/i, 'modified'],
    [/<meta\s+name=["']publish-date["']\s+content=["']([^"']+)["']/i, 'published'],
    [/<meta\s+name=["']date["']\s+content=["']([^"']+)["']/i, 'meta'],
  ];
  for (const [re, source] of metas) {
    const m = html.match(re);
    if (m) {
      const h = hit(m[1], source);
      if (h) return h;
    }
  }
  // Inline "5 May 2026". Skip "last updated" stamps: every gov.sg page carries
  // one set to the crawl day (footer attribute + "LAST UPDATED:" line), and
  // taking it made a 2023 press release look published today (2026-10-17).
  for (const m of html.matchAll(/\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\b/g)) {
    const before = html.slice(Math.max(0, (m.index ?? 0) - 60), m.index);
    if (/last[-_ ]?updated|lastupdated/i.test(before)) continue;
    const h = hit(m[1], 'inline');
    if (h) return h;
  }
  return { date: null, source: null };
}

function normalizeDate(input: string): string | null {
  // Try ISO first.
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) return input.slice(0, 10);
  // "5 May 2026"
  const months: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  };
  const m = input.toLowerCase().match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (m) {
    const day = m[1].padStart(2, '0');
    const month = months[m[2].slice(0, 3)];
    if (month) return `${m[3]}-${month}-${day}`;
  }
  // Last resort: Date parser
  const d = new Date(input);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

function extractPdfLinks(html: string, baseUrl: string): string[] {
  const links = new Set<string>();
  for (const m of html.matchAll(/href=["']([^"']+\.pdf)["']/gi)) {
    try {
      const url = new URL(m[1], baseUrl).toString();
      links.add(url);
    } catch {
      /* ignore malformed */
    }
  }
  return Array.from(links);
}

/**
 * Fetch a single page with retries, exponential backoff, and 15 s timeout.
 * Throws on persistent failure. Returns parsed metadata + body text.
 */
export async function govFetch(url: string, options: FetchOptions = {}): Promise<GovPage> {
  const retries = options.retries ?? DEFAULT_RETRIES;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const ua = options.userAgent || DEFAULT_UA;
  const sleepBetween = options.sleepBetweenMs ?? 0;

  let lastError = '';
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': ua, Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' },
        signal: ctrl.signal,
        redirect: 'follow',
      });
      clearTimeout(timer);
      if (!response.ok) {
        lastError = `${response.status} ${response.statusText}`;
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new Error(`${url}: ${lastError}`);
        }
        await sleep(attempt * attempt * 1000);
        continue;
      }
      const html = await response.text();
      const finalUrl = response.url || url;
      const result: GovPage = {
        sourceUrl: finalUrl,
        title: extractTitle(html),
        ...(() => {
          const d = extractDate(html);
          return { publishedDate: d.date, publishedDateSource: d.source };
        })(),
        contentText: stripTags(html).slice(0, 50000), // cap body to 50 KB
        pdfLinks: extractPdfLinks(html, finalUrl),
        status: response.status,
      };
      if (sleepBetween > 0) await sleep(sleepBetween);
      return result;
    } catch (error) {
      clearTimeout(timer);
      lastError = error instanceof Error ? error.message : String(error);
      if (attempt === retries) throw new Error(`${url}: ${lastError}`);
      await sleep(attempt * attempt * 1000);
    }
  }
  throw new Error(`${url}: ${lastError}`);
}

export interface SitemapEntry {
  loc: string;
  /** <lastmod> as written in the sitemap (ISO-ish), when present. */
  lastmod?: string;
}

/** Parse `<url>` blocks (loc + lastmod) from a sitemap body. Exported for tests. */
export function parseSitemapEntries(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const block = m[1];
    const loc = block.match(/<loc>([^<]+)<\/loc>/i)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/i)?.[1]?.trim();
    entries.push(lastmod ? { loc, lastmod } : { loc });
  }
  if (entries.length > 0) return entries;
  // Sitemaps without <url> wrappers (rare) — fall back to bare <loc>s.
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/gi)).map((m) => ({ loc: m[1].trim() }));
}

/**
 * Parse a sitemap.xml and return its entries (URL + lastmod when present).
 * Supports both URL sitemaps and sitemap-index files (recurses one level deep).
 */
export async function listSitemapEntries(url: string, options: FetchOptions = {}): Promise<SitemapEntry[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': options.userAgent || DEFAULT_UA },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!response.ok) return [];
    const xml = await response.text();

    // Detect sitemap-index (has <sitemap><loc>...</loc></sitemap>).
    const isIndex = /<sitemapindex/i.test(xml);
    if (!isIndex) return parseSitemapEntries(xml);

    const childUrls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/gi)).map((m) => m[1].trim());
    const all: SitemapEntry[] = [];
    for (const childUrl of childUrls) {
      try {
        all.push(...(await listSitemapEntries(childUrl, options)));
      } catch {
        /* ignore */
      }
    }
    return all;
  } catch {
    clearTimeout(timer);
    return [];
  }
}

/**
 * Parse a sitemap.xml and return all <loc> URLs. Supports both URL
 * sitemaps and sitemap-index files (recurses one level deep).
 */
export async function listSitemap(url: string, options: FetchOptions = {}): Promise<string[]> {
  return (await listSitemapEntries(url, options)).map((e) => e.loc);
}
