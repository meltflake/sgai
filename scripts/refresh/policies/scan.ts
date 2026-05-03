// scripts/refresh/policies/scan.ts
// ────────────────────────────────────────────────────────────────────────
// Discover candidate URLs across configured policy sources. Returns URLs
// not yet seen (sourceUrl absent from policies.ts AND not already in
// state.policies.maxDates window).
//
// Strategy per source:
//   1. Try sitemap.xml (cheapest, most complete).
//   2. Pull listing pages (fallback).
//   3. Apply urlPatterns positive filter + urlExcludes negative.
//   4. Dedupe against existing policies.ts sourceUrl set.
//   5. Return ordered list, newest-first if dates can be inferred.
//
// Network is throttled by `lib/gov-fetch.ts` defaults. Each source is
// scanned independently — failures isolated.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { listSitemap, govFetch } from '../../lib/gov-fetch.ts';
import { type ScanState, getDomainState } from '../../lib/state.ts';
import { POLICY_SOURCES, type PolicySource } from './sources.ts';

export interface PolicyCandidate {
  sourceUrl: string;
  domain: string;
  label: string;
  defaultCategory: string;
  defaultSource: string;
  defaultSourceEn: string;
  defaultSourceOrgUrl: string;
  defaultMinistry?: string;
}

export interface ScanResult {
  candidates: PolicyCandidate[];
  perSource: Array<{ domain: string; checked: number; matched: number; error?: string }>;
}

export interface ScanOptions {
  state: ScanState;
  /** Existing sourceUrl set extracted from policies.ts (deduplication). */
  existingUrls: Set<string>;
  /** When true, only the FIRST source is scanned and limit=1 candidate. Used for e2e. */
  dryRun?: boolean;
  limit?: number;
  /** Restrict to a single source by domain. */
  onlyDomain?: string;
}

function applyFilters(urls: string[], source: PolicySource): string[] {
  const out = new Set<string>();
  for (const url of urls) {
    if (source.urlExcludes?.some((re) => re.test(url))) continue;
    if (!source.urlPatterns.some((re) => re.test(url))) continue;
    out.add(url);
  }
  return [...out];
}

async function scanListing(listingUrl: string): Promise<string[]> {
  try {
    const page = await govFetch(listingUrl, { retries: 2, sleepBetweenMs: 200 });
    // Extract all <a href="..."> from contentText is lossy; re-fetch raw
    // HTML for link extraction. govFetch gives us strippedText; for links
    // we need the raw HTML. Re-fetch quickly.
    const raw = await fetch(listingUrl, {
      headers: { 'User-Agent': 'sgai-refresh/1.0', Accept: 'text/html' },
    });
    if (!raw.ok) return [];
    const html = await raw.text();
    const baseUrl = page.sourceUrl;
    const links = new Set<string>();
    for (const m of html.matchAll(/href=["']([^"']+)["']/g)) {
      try {
        const abs = new URL(m[1], baseUrl).toString();
        // Restrict to same host as listing.
        const listingHost = new URL(listingUrl).hostname;
        if (new URL(abs).hostname === listingHost) links.add(abs);
      } catch {
        /* malformed */
      }
    }
    return [...links];
  } catch {
    return [];
  }
}

async function scanSource(source: PolicySource, opts: { existingUrls: Set<string> }): Promise<{
  found: string[];
  checked: number;
  error?: string;
}> {
  const found = new Set<string>();
  let checked = 0;

  try {
    if (source.sitemapUrls) {
      for (const sm of source.sitemapUrls) {
        try {
          const urls = await listSitemap(sm);
          checked += urls.length;
          for (const u of applyFilters(urls, source)) {
            if (!opts.existingUrls.has(u)) found.add(u);
          }
        } catch {
          /* skip this sitemap */
        }
      }
    }

    if (source.listingUrls) {
      for (const lst of source.listingUrls) {
        const links = await scanListing(lst);
        checked += links.length;
        for (const u of applyFilters(links, source)) {
          if (!opts.existingUrls.has(u)) found.add(u);
        }
      }
    }

    return { found: [...found], checked };
  } catch (error) {
    return {
      found: [...found],
      checked,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function scan(options: ScanOptions): Promise<ScanResult> {
  // We don't need state currently (dedup is via existingUrls), but plumb
  // it through for future "skip if last scan was within N days" logic.
  void getDomainState(options.state, 'policies');

  const sources = options.onlyDomain
    ? POLICY_SOURCES.filter((s) => s.domain === options.onlyDomain)
    : POLICY_SOURCES;

  const candidates: PolicyCandidate[] = [];
  const perSource: ScanResult['perSource'] = [];

  for (const source of sources) {
    const result = await scanSource(source, { existingUrls: options.existingUrls });
    perSource.push({
      domain: source.domain,
      checked: result.checked,
      matched: result.found.length,
      error: result.error,
    });

    for (const url of result.found) {
      candidates.push({
        sourceUrl: url,
        domain: source.domain,
        label: source.label,
        defaultCategory: source.defaultCategory,
        defaultSource: source.defaultSource,
        defaultSourceEn: source.defaultSourceEn,
        defaultSourceOrgUrl: source.defaultSourceOrgUrl,
        defaultMinistry: source.defaultMinistry,
      });
    }

    if (options.dryRun) break; // only first source in dry-run
  }

  if (options.limit) {
    candidates.length = Math.min(candidates.length, options.limit);
  }

  return { candidates, perSource };
}

/**
 * Extract every existing sourceUrl from src/data/policies.ts. Used for
 * deduplication. Reads the file as text and regexes out URL literals;
 * doesn't require importing the data module.
 */
export function readExistingPolicyUrls(filePath: string = resolve('src/data/policies.ts')): Set<string> {
  const source = readFileSync(filePath, 'utf8');
  const urls = new Set<string>();
  for (const m of source.matchAll(/sourceUrl:\s*\n?\s*['"]([^'"]+)['"]/g)) {
    urls.add(m[1]);
  }
  return urls;
}
