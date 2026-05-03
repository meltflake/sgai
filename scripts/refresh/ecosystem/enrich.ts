// scripts/refresh/ecosystem/enrich.ts
// ────────────────────────────────────────────────────────────────────────
// Fetch + summarize each candidate. Same shape as policies/enrich.ts; the
// AI summarizer outputs an entity-shaped record instead of a policy.

import { resolve } from 'node:path';

import { govFetch } from '../../lib/gov-fetch.ts';
import { summarizePage, type BilingualSummary } from '../../lib/ai-summarize.ts';
import { ECOSYSTEM_CATEGORIES } from './sources.ts';
import type { EcosystemCandidate } from './scan.ts';

export interface EnrichedEntity {
  candidate: EcosystemCandidate;
  summary: BilingualSummary;
  id: string;
  pageTitle: string;
  pageDate: string | null;
  contentText: string;
}

export interface EcosystemEnrichResult {
  enriched: EnrichedEntity[];
  failures: Array<{ sourceUrl: string; error: string }>;
}

const CACHE_DIR = resolve('scripts/refresh/ecosystem/data/summaries');

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
  candidates: EcosystemCandidate[],
  options: { force?: boolean } = {}
): Promise<EcosystemEnrichResult> {
  const enriched: EnrichedEntity[] = [];
  const failures: EcosystemEnrichResult['failures'] = [];

  for (const candidate of candidates) {
    try {
      const page = await govFetch(candidate.sourceUrl, { retries: 3, sleepBetweenMs: 1000 });
      const summary = await summarizePage(
        {
          sourceUrl: page.sourceUrl,
          title: candidate.hintedTitle || page.title,
          contentText: page.contentText,
        },
        {
          categories: [...ECOSYSTEM_CATEGORIES],
          cacheDir: CACHE_DIR,
          force: options.force,
          domainContext:
            'a Chinese-language Singapore AI ecosystem observatory. The user-facing schema is one entry per company / research lab / institute / programme.',
        }
      );

      enriched.push({
        candidate,
        summary,
        id: slugify(summary.titleEn),
        pageTitle: page.title,
        pageDate: page.publishedDate,
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
