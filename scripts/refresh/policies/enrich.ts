// scripts/refresh/policies/enrich.ts
// ────────────────────────────────────────────────────────────────────────
// For each candidate URL: fetch the page → AI summary → cache.
// Output is an "enriched" policy record ready for emit() to insert.

import { resolve } from 'node:path';

import { govFetch } from '../../lib/gov-fetch.ts';
import { summarizePage, type BilingualSummary } from '../../lib/ai-summarize.ts';
import { POLICY_CATEGORIES } from './sources.ts';
import type { PolicyCandidate } from './scan.ts';

export interface EnrichedPolicy {
  candidate: PolicyCandidate;
  summary: BilingualSummary;
  /** Generated stable id from titleEn (kebab-case). */
  id: string;
  /** Snapshot of fetched page metadata. */
  pageTitle: string;
  pageDate: string | null;
  pdfUrl: string | null;
  contentText: string;
}

export interface EnrichResult {
  enriched: EnrichedPolicy[];
  failures: Array<{ sourceUrl: string; error: string }>;
}

const CACHE_DIR = resolve('scripts/refresh/policies/data/summaries');
const RAW_DIR = resolve('scripts/refresh/policies/data/raw');

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export async function enrich(
  candidates: PolicyCandidate[],
  options: { force?: boolean; concurrency?: number } = {}
): Promise<EnrichResult> {
  const enriched: EnrichedPolicy[] = [];
  const failures: EnrichResult['failures'] = [];

  // Sequential to be polite to gov.sg sites (govFetch already throttles).
  for (const candidate of candidates) {
    try {
      const page = await govFetch(candidate.sourceUrl, { retries: 3, sleepBetweenMs: 1000 });

      // Cache raw page snapshot (for audit / re-runs).
      const fs = await import('node:fs');
      fs.mkdirSync(RAW_DIR, { recursive: true });
      const safeName = encodeURIComponent(candidate.sourceUrl).slice(0, 200);
      fs.writeFileSync(
        `${RAW_DIR}/${safeName}.json`,
        `${JSON.stringify({ candidate, page }, null, 2)}\n`
      );

      const summary = await summarizePage(
        {
          sourceUrl: page.sourceUrl,
          title: page.title,
          contentText: page.contentText,
        },
        {
          categories: [...POLICY_CATEGORIES],
          cacheDir: CACHE_DIR,
          force: options.force,
          domainContext: 'a Chinese-language Singapore AI policy observatory (sgai.md)',
        }
      );

      const id = slugify(summary.titleEn);
      enriched.push({
        candidate,
        summary,
        id,
        pageTitle: page.title,
        pageDate: page.publishedDate,
        pdfUrl: page.pdfLinks[0] || null,
        contentText: page.contentText,
      });
    } catch (error) {
      failures.push({
        sourceUrl: candidate.sourceUrl,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { enriched, failures };
}
