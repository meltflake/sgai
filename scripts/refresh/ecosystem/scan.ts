// scripts/refresh/ecosystem/scan.ts
// ────────────────────────────────────────────────────────────────────────
// Discover candidate ecosystem entities from configured feeds (RSS / sitemap).
// MVP: returns articles matching keyword filter + not already in ecosystem.ts.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { listSitemap } from '../../lib/gov-fetch.ts';
import type { ScanState } from '../../lib/state.ts';
import { ECOSYSTEM_SOURCES, type EcosystemSourceEntry } from './sources.ts';

export interface EcosystemCandidate {
  sourceUrl: string;
  domain: string;
  label: string;
  defaultCategory: string;
  defaultEntityType: string;
  /** RSS title if extracted from feed. */
  hintedTitle?: string;
  /** RSS pubDate if available. */
  hintedDate?: string;
}

export interface EcosystemScanResult {
  candidates: EcosystemCandidate[];
  perSource: Array<{ domain: string; checked: number; matched: number; error?: string }>;
}

export interface EcosystemScanOptions {
  state: ScanState;
  existingUrls: Set<string>;
  dryRun?: boolean;
  limit?: number;
  onlyDomain?: string;
}

interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
}

async function parseRss(feedUrl: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: { 'User-Agent': 'sgai-refresh/1.0', Accept: 'application/rss+xml,*/*' },
    });
    if (!response.ok) return [];
    const xml = await response.text();
    const items: RSSItem[] = [];
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const block = m[1];
      const title = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim();
      const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim();
      const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim();
      if (title && link) items.push({ title, link, pubDate });
    }
    return items;
  } catch {
    return [];
  }
}

async function scanSource(
  source: EcosystemSourceEntry,
  opts: { existingUrls: Set<string> }
): Promise<{ found: EcosystemCandidate[]; checked: number; error?: string }> {
  const found: EcosystemCandidate[] = [];
  let checked = 0;

  try {
    if (source.feedType === 'rss') {
      const items = await parseRss(source.feedUrl);
      checked = items.length;
      for (const item of items) {
        if (opts.existingUrls.has(item.link)) continue;
        const slug = item.link + ' ' + item.title;
        if (!source.urlFilter.test(slug)) continue;
        if (source.urlExcludes?.some((re) => re.test(item.link))) continue;
        found.push({
          sourceUrl: item.link,
          domain: source.domain,
          label: source.label,
          defaultCategory: source.defaultCategory,
          defaultEntityType: source.defaultEntityType,
          hintedTitle: item.title,
          hintedDate: item.pubDate,
        });
      }
    } else {
      const urls = await listSitemap(source.feedUrl);
      checked = urls.length;
      for (const url of urls) {
        if (opts.existingUrls.has(url)) continue;
        if (!source.urlFilter.test(url)) continue;
        if (source.urlExcludes?.some((re) => re.test(url))) continue;
        found.push({
          sourceUrl: url,
          domain: source.domain,
          label: source.label,
          defaultCategory: source.defaultCategory,
          defaultEntityType: source.defaultEntityType,
        });
      }
    }
    return { found, checked };
  } catch (error) {
    return { found, checked, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function scan(options: EcosystemScanOptions): Promise<EcosystemScanResult> {
  void options.state;
  const sources = options.onlyDomain
    ? ECOSYSTEM_SOURCES.filter((s) => s.domain === options.onlyDomain)
    : ECOSYSTEM_SOURCES;

  const perSource: EcosystemScanResult['perSource'] = [];
  const all: EcosystemCandidate[] = [];

  for (const source of sources) {
    const r = await scanSource(source, { existingUrls: options.existingUrls });
    perSource.push({ domain: source.domain, checked: r.checked, matched: r.found.length, error: r.error });
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
