// scripts/refresh/ecosystem/scan.ts
// ────────────────────────────────────────────────────────────────────────
// Discover candidate ecosystem entities from configured feeds (RSS / sitemap).
// MVP: returns articles matching keyword filter + not already in ecosystem.ts.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { listSitemapEntries } from '../../lib/gov-fetch.ts';
import { isGenericOrLanding, normalizeUrl } from '../../lib/scan-filters.ts';
import { staleVerdict } from '../../lib/stale-gate.ts';
import type { ScanState } from '../../lib/state.ts';
import { DEFAULT_MAX_AGE_DAYS, ECOSYSTEM_SOURCES, type EcosystemSourceEntry } from './sources.ts';

export interface EcosystemCandidate {
  sourceUrl: string;
  domain: string;
  label: string;
  defaultCategory: string;
  defaultEntityType: string;
  /** RSS title if extracted from feed. */
  hintedTitle?: string;
  /** RSS pubDate or sitemap lastmod if available. */
  hintedDate?: string;
  /** What hintedDate is: a publication date (authoritative) or a
   *  last-modified stamp (proves old only). */
  hintedDateKind?: 'published' | 'modified';
}

export interface EcosystemScanResult {
  candidates: EcosystemCandidate[];
  perSource: Array<{ domain: string; checked: number; matched: number; stale: number; error?: string }>;
}

export interface EcosystemScanOptions {
  state: ScanState;
  existingUrls: Set<string>;
  dryRun?: boolean;
  limit?: number;
  onlyDomain?: string;
  /** Old-news window in days; 0 disables. Default DEFAULT_MAX_AGE_DAYS. */
  maxAgeDays?: number;
  /** Injectable clock for tests. */
  now?: Date;
}

interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
  categories: string[];
}

const REAL_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

async function parseRss(feedUrl: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: { 'User-Agent': REAL_UA, Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      redirect: 'follow',
    });
    if (!response.ok) return [];
    const xml = await response.text();
    // Detect HTML returned in place of RSS (Cloudflare challenge etc.) and bail.
    if (xml.trim().toLowerCase().startsWith('<!doctype html') || xml.includes('<title>Just a moment')) {
      return [];
    }
    const items: RSSItem[] = [];
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const block = m[1];
      const title = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim();
      const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim();
      const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim();
      const categories = [...block.matchAll(/<category>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/g)]
        .map((c) => c[1].trim())
        .filter(Boolean);
      if (title && link) items.push({ title, link, pubDate, categories });
    }
    return items;
  } catch {
    return [];
  }
}

async function scanSource(
  source: EcosystemSourceEntry,
  opts: { existingUrls: Set<string>; maxAgeDays: number; now: Date }
): Promise<{ found: EcosystemCandidate[]; checked: number; stale: number; error?: string }> {
  const found: EcosystemCandidate[] = [];
  let stale = 0;
  // Normalized keys: catch `?page=N` / trailing-slash / fragment variants of
  // stored URLs, and collapse in-scan duplicates (issue #166).
  const existingKeys = new Set([...opts.existingUrls].map(normalizeUrl));
  const seenKeys = new Set<string>();
  let checked = 0;

  const admit = (url: string): boolean => {
    const key = normalizeUrl(url);
    if (opts.existingUrls.has(url) || existingKeys.has(key)) return false;
    if (seenKeys.has(key)) return false;
    if (isGenericOrLanding(url)) return false;
    seenKeys.add(key);
    return true;
  };

  // Old-news gate, scan stage: cheap hints only (feed date, sitemap lastmod,
  // year in the URL). A page with no hint passes here and is re-checked in
  // enrich once its body date is known — see lib/stale-gate.ts.
  const fresh = (url: string, hint: { published?: string; modified?: string }): boolean => {
    const v = staleVerdict(
      { published: [hint.published], modified: [hint.modified], url },
      opts.maxAgeDays,
      opts.now
    );
    if (v.stale) stale += 1;
    return !v.stale;
  };

  try {
    if (source.feedType === 'rss') {
      const items = await parseRss(source.feedUrl);
      checked = items.length;
      const catExcludes = (source.rssCategoryExcludes ?? []).map((c) => c.toLowerCase());
      for (const item of items) {
        const slug = item.link + ' ' + item.title;
        if (!source.urlFilter.test(slug)) continue;
        if (source.urlExcludes?.some((re) => re.test(item.link))) continue;
        if (catExcludes.length && item.categories.some((c) => catExcludes.includes(c.toLowerCase()))) continue;
        if (!admit(item.link)) continue;
        if (!fresh(item.link, { published: item.pubDate })) continue;
        found.push({
          sourceUrl: item.link,
          domain: source.domain,
          label: source.label,
          defaultCategory: source.defaultCategory,
          defaultEntityType: source.defaultEntityType,
          hintedTitle: item.title,
          hintedDate: item.pubDate,
          hintedDateKind: 'published',
        });
      }
    } else {
      const entries = await listSitemapEntries(source.feedUrl);
      checked = entries.length;
      for (const { loc: url, lastmod } of entries) {
        if (!source.urlFilter.test(url)) continue;
        if (source.urlExcludes?.some((re) => re.test(url))) continue;
        if (!admit(url)) continue;
        // lastmod is "last modified", so it can only prove a page is old
        // (a recent lastmod on a 2020 press release is common after a CMS
        // migration). The body date in enrich is the real check.
        if (!fresh(url, { modified: lastmod })) continue;
        found.push({
          sourceUrl: url,
          domain: source.domain,
          label: source.label,
          defaultCategory: source.defaultCategory,
          defaultEntityType: source.defaultEntityType,
          hintedDate: lastmod,
          hintedDateKind: 'modified',
        });
      }
    }
    return { found, checked, stale };
  } catch (error) {
    return { found, checked, stale, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function scan(options: EcosystemScanOptions): Promise<EcosystemScanResult> {
  void options.state;
  const sources = options.onlyDomain
    ? ECOSYSTEM_SOURCES.filter((s) => s.domain === options.onlyDomain)
    : ECOSYSTEM_SOURCES;

  const perSource: EcosystemScanResult['perSource'] = [];
  const all: EcosystemCandidate[] = [];

  const maxAgeDays = options.maxAgeDays ?? DEFAULT_MAX_AGE_DAYS;
  const now = options.now ?? new Date();
  for (const source of sources) {
    const r = await scanSource(source, { existingUrls: options.existingUrls, maxAgeDays, now });
    perSource.push({
      domain: source.domain,
      checked: r.checked,
      matched: r.found.length,
      stale: r.stale,
      error: r.error,
    });
    all.push(...r.found);
    if (options.dryRun) break;
  }

  if (options.limit) all.length = Math.min(all.length, options.limit);
  return { candidates: all, perSource };
}

/** Extract every URL referenced as `url:` or `sourceUrl:` or in `sources[].url` from ecosystem.ts. */
export function readExistingEcosystemUrls(filePath: string = resolve('src/data/ecosystem.ts')): Set<string> {
  const source = readFileSync(filePath, 'utf8');
  const urls = new Set<string>();
  for (const m of source.matchAll(/(?:url|sourceUrl):\s*\n?\s*['"]([^'"]+)['"]/g)) {
    urls.add(m[1]);
  }
  return urls;
}

/**
 * Every entity `id` and `name` / `nameEn` already in ecosystem.ts, so a
 * candidate whose extracted entity is already on the map is reported as
 * "already covered" instead of emitted as a duplicate stub.
 */
export function readExistingEcosystemIdentity(filePath: string = resolve('src/data/ecosystem.ts')): {
  ids: Set<string>;
  names: Set<string>;
} {
  const source = readFileSync(filePath, 'utf8');
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const m of source.matchAll(/^ {8}id:\s*['"]([^'"]+)['"]/gm)) ids.add(m[1]);
  for (const m of source.matchAll(/^ {8}(?:name|nameEn):\s*\n?\s*['"]([^'"]+)['"]/gm)) {
    names.add(m[1].trim().toLowerCase());
  }
  return { ids, names };
}
