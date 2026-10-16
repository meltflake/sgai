// scripts/refresh/signals/scan.ts
// Collect candidate URLs from SOURCES. Cheap filters only (keyword, speech
// slug, sitemap lastmod, known URLs); the body date and the relevance
// judgment happen later in run.ts. Fetchers are injectable for tests. A
// failing source is reported and never stops the others.

import { listSitemapEntries } from '../../lib/gov-fetch.ts';
import { normalizeUrl } from '../../lib/scan-filters.ts';
import { parseDateLoose } from '../../lib/stale-gate.ts';
import { AI_KEYWORD, SPEECH_SLUG, type SignalSource } from './sources.ts';

export interface SignalCandidate {
  url: string;
  /** Headline from the feed; '' for sitemap entries (page title comes later). */
  title: string;
  sourceId: string;
  sourceName: string;
  kind: 'rss' | 'sitemap';
  /** YYYY-MM-DD from RSS pubDate or sitemap lastmod. */
  hintedDate?: string;
}

export interface RssItem {
  title: string;
  link: string;
  pubDate?: string;
  categories: string[];
}

export function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, '&')
    .trim();
}

export function parseRssXml(xml: string): RssItem[] {
  const head = xml.trim().slice(0, 200).toLowerCase();
  if (head.startsWith('<!doctype html') || head.startsWith('<html') || xml.includes('<title>Just a moment')) return [];
  const items: RssItem[] = [];
  for (const m of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/g)) {
    const block = m[1];
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1];
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];
    const categories = [...block.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/g)].map((c) => decodeEntities(c[1])).filter(Boolean);
    if (title && link) items.push({ title: decodeEntities(title), link: decodeEntities(link), pubDate: pubDate ? decodeEntities(pubDate) : undefined, categories });
  }
  return items;
}

export interface ScanDeps {
  today: string;
  days: number;
  /** URLs already on the site or rejected before. */
  known: Set<string>;
  fetchText?: (url: string) => Promise<string>;
  listSitemap?: (url: string) => Promise<Array<{ loc: string; lastmod?: string }>>;
}

export interface ScanResult {
  candidates: SignalCandidate[];
  failures: Array<{ sourceId: string; error: string }>;
  checked: number;
}

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

async function defaultFetchText(url: string): Promise<string> {
  const r = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml, */*' },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

function slugText(url: string): string {
  try {
    return decodeURIComponent(new URL(url).pathname).replace(/[_/]+/g, '-');
  } catch {
    return url;
  }
}

/** A /20YY/ path segment older than the window's first year proves a page is old. */
function oldPathYear(url: string, today: string, days: number): boolean {
  const m = url.match(/\/(20\d\d)\//);
  if (!m) return false;
  const floor = new Date(Date.parse(`${today}T00:00:00Z`) - days * 86_400_000).getUTCFullYear();
  return Number(m[1]) < floor;
}

function olderThan(date: string | null, today: string, days: number): boolean {
  if (!date) return false;
  return Date.parse(`${date}T00:00:00Z`) < Date.parse(`${today}T00:00:00Z`) - days * 86_400_000;
}

export async function scanAll(sources: SignalSource[], deps: ScanDeps): Promise<ScanResult> {
  const fetchText = deps.fetchText ?? defaultFetchText;
  const listSitemap = deps.listSitemap ?? ((u: string) => listSitemapEntries(u));
  const knownKeys = new Set([...deps.known].map(normalizeUrl));
  const seen = new Set<string>();
  const candidates: SignalCandidate[] = [];
  const failures: ScanResult['failures'] = [];
  let checked = 0;

  const admit = (url: string): boolean => {
    const key = normalizeUrl(url);
    if (knownKeys.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  };

  for (const src of sources) {
    try {
      if (src.kind === 'rss') {
        const items = parseRssXml(await fetchText(src.url));
        checked += items.length;
        const excl = (src.rssCategoryExcludes ?? []).map((c) => c.toLowerCase());
        for (const it of items) {
          const text = `${it.title} ${slugText(it.link)}`;
          if (src.urlFilter && !src.urlFilter.test(it.link)) continue;
          if (src.requireAiKeyword && !AI_KEYWORD.test(text)) continue;
          if (src.excludeSpeeches && SPEECH_SLUG.test(slugText(it.link))) continue;
          if (excl.length && it.categories.some((c) => excl.includes(c.toLowerCase()))) continue;
          const date = parseDateLoose(it.pubDate);
          if (olderThan(date, deps.today, deps.days)) continue;
          if (!admit(it.link)) continue;
          candidates.push({ url: it.link, title: it.title, sourceId: src.id, sourceName: src.name, kind: 'rss', hintedDate: date ?? undefined });
        }
      } else {
        const entries = await listSitemap(src.url);
        checked += entries.length;
        for (const { loc, lastmod } of entries) {
          if (src.urlFilter && !src.urlFilter.test(loc)) continue;
          const slug = slugText(loc);
          if (src.requireAiKeyword && !AI_KEYWORD.test(slug)) continue;
          if (src.excludeSpeeches && SPEECH_SLUG.test(slug)) continue;
          if (src.yearInPath && oldPathYear(loc, deps.today, deps.days)) continue;
          // lastmod can only prove a page is old; a fresh lastmod proves nothing.
          const date = parseDateLoose(lastmod);
          if (olderThan(date, deps.today, deps.days)) continue;
          if (!admit(loc)) continue;
          candidates.push({ url: loc, title: '', sourceId: src.id, sourceName: src.name, kind: 'sitemap', hintedDate: date ?? undefined });
        }
      }
    } catch (e) {
      failures.push({ sourceId: src.id, error: e instanceof Error ? e.message : String(e) });
    }
  }
  return { candidates, failures, checked };
}
