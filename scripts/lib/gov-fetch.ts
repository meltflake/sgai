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
  contentText: string;
  pdfLinks: string[];
  status: number;
}

export interface FetchOptions {
  retries?: number;
  timeoutMs?: number;
  userAgent?: string;
  sleepBetweenMs?: number;
}

const DEFAULT_UA = 'sgai-refresh/1.0 (+https://sgai.md)';
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

function extractDate(html: string): string | null {
  // Prefer <time datetime="...">
  const timeTag = html.match(/<time[^>]+datetime=["']([^"']+)["']/i);
  if (timeTag) return normalizeDate(timeTag[1]);
  // Common meta tags
  const metas = [
    /<meta\s+(?:property|name)=["']article:published_time["']\s+content=["']([^"']+)["']/i,
    /<meta\s+(?:property|name)=["']article:modified_time["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']publish-date["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']date["']\s+content=["']([^"']+)["']/i,
  ];
  for (const re of metas) {
    const m = html.match(re);
    if (m) return normalizeDate(m[1]);
  }
  // Inline patterns: "Published on 5 May 2026" / "5 May 2026"
  const inline = html.match(/\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\b/);
  if (inline) return normalizeDate(inline[1]);
  return null;
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
        publishedDate: extractDate(html),
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

/**
 * Parse a sitemap.xml and return all <loc> URLs. Supports both URL
 * sitemaps and sitemap-index files (recurses one level deep).
 */
export async function listSitemap(url: string, options: FetchOptions = {}): Promise<string[]> {
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
    const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/gi)).map((m) => m[1].trim());

    // Detect sitemap-index (has <sitemap><loc>...</loc></sitemap>).
    const isIndex = /<sitemapindex/i.test(xml);
    if (!isIndex) return locs;

    const all: string[] = [];
    for (const childUrl of locs) {
      try {
        const childLocs = await listSitemap(childUrl, options);
        all.push(...childLocs);
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
