// scripts/refresh/ecosystem/enrich.ts
// ────────────────────────────────────────────────────────────────────────
// Fetch + gate + summarize each candidate. Same shape as policies/enrich.ts;
// the AI summarizer outputs an entity-shaped record instead of a policy.
//
// Per-candidate order (cheap → expensive, each gate can stop the rest):
//   1. govFetch                       — body + page date
//   2. old-news gate (free)           — lib/stale-gate.ts
//   3. summarizePage (LLM)            — bilingual description
//   4. empty-shell guard (free)       — lib/empty-shell.ts
//   5. AI-relevance judge (LLM)       — lib/judge-ai-relevance.ts
//   6. entity extraction (LLM)        — lib/extract-entity.ts: proper name, not headline
//   7. already-covered check (free)   — entity already on the map
//
// Stops once `targetCount` candidates are accepted, so the run's --limit
// counts entries proposed, not URLs fetched.

import { resolve } from 'node:path';

import { govFetch } from '../../lib/gov-fetch.ts';
import { summarizePage, type BilingualSummary } from '../../lib/ai-summarize.ts';
import { isEmptyShellSummary } from '../../lib/empty-shell.ts';
import { judgeAiRelevance } from '../../lib/judge-ai-relevance.ts';
import { extractEntity, type ExtractedEntity } from '../../lib/extract-entity.ts';
import { isStale, staleVerdict } from '../../lib/stale-gate.ts';
import {
  DEFAULT_MAX_AGE_DAYS,
  ECOSYSTEM_CATEGORIES,
  ECOSYSTEM_ENTITY_TYPES,
  ECOSYSTEM_ENTITY_TYPE_GLOSS,
} from './sources.ts';
import type { EcosystemCandidate } from './scan.ts';

export interface EnrichedEntity {
  candidate: EcosystemCandidate;
  summary: BilingualSummary;
  /** The entity the page is about — its proper name drives `name` / `id`. */
  entity: ExtractedEntity;
  /** slugified entity.nameEn */
  id: string;
  /** Article / page headline (summary.titleEn), kept for provenance. */
  headlineEn: string;
  pageTitle: string;
  pageDate: string | null;
  contentText: string;
}

export type DropReason = 'stale' | 'empty-shell' | 'off-topic' | 'no-entity' | 'already-covered';

export interface DroppedCandidate {
  sourceUrl: string;
  reason: DropReason;
  detail: string;
}

export interface EcosystemEnrichResult {
  enriched: EnrichedEntity[];
  failures: Array<{ sourceUrl: string; error: string }>;
  dropped: DroppedCandidate[];
}

export interface EnrichOptions {
  force?: boolean;
  /** Old-news window in days; 0 disables. Default DEFAULT_MAX_AGE_DAYS. */
  maxAgeDays?: number;
  /** Stop after this many accepted candidates. Default: all. */
  targetCount?: number;
  /** Entities already in ecosystem.ts (ids + lowercase names). */
  existing?: { ids: Set<string>; names: Set<string> };
  /** Injectable clock for tests. */
  now?: Date;
}

const CACHE_DIR = resolve('scripts/refresh/ecosystem/data/summaries');
const ENTITY_CACHE_DIR = resolve('scripts/refresh/ecosystem/data/entities');

export function slugify(input: string): string {
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
  options: EnrichOptions = {}
): Promise<EcosystemEnrichResult> {
  const enriched: EnrichedEntity[] = [];
  const failures: EcosystemEnrichResult['failures'] = [];
  const dropped: DroppedCandidate[] = [];
  const maxAgeDays = options.maxAgeDays ?? DEFAULT_MAX_AGE_DAYS;
  const now = options.now ?? new Date();
  const existing = options.existing ?? { ids: new Set<string>(), names: new Set<string>() };

  const drop = (sourceUrl: string, reason: DropReason, detail: string): void => {
    dropped.push({ sourceUrl, reason, detail });
    process.stdout.write(`    ⊘ ${reason}: ${sourceUrl} — ${detail.slice(0, 80)}\n`);
  };

  for (const candidate of candidates) {
    if (options.targetCount && enriched.length >= options.targetCount) break;
    try {
      const page = await govFetch(candidate.sourceUrl, { retries: 3, sleepBetweenMs: 1000 });

      // Old-news gate on the body date (page meta first, feed hint second,
      // URL year last). This is where the 2020 GovTech press release dies.
      const hinted = candidate.hintedDate;
      const age = staleVerdict(
        {
          published: [page.publishedDate, candidate.hintedDateKind === 'published' ? hinted : null],
          modified: [candidate.hintedDateKind === 'modified' ? hinted : null],
          url: candidate.sourceUrl,
        },
        maxAgeDays,
        now
      );
      if (age.stale) {
        drop(candidate.sourceUrl, 'stale', `${age.date} (${age.ageDays} days old, window ${maxAgeDays})`);
        continue;
      }

      const headline = candidate.hintedTitle || page.title;
      const summary = await summarizePage(
        { sourceUrl: page.sourceUrl, title: headline, contentText: page.contentText },
        {
          categories: [...ECOSYSTEM_CATEGORIES],
          cacheDir: CACHE_DIR,
          force: options.force,
          domainContext:
            'a Chinese-language Singapore AI ecosystem observatory. The user-facing schema is one entry per company / research lab / institute / programme.',
        }
      );

      // Pages with no machine-readable date: fall back to the date the
      // summariser read out of the body.
      if (!age.date) {
        const bodyAge = isStale(summary.publishedDate, maxAgeDays, now);
        if (bodyAge.stale) {
          drop(candidate.sourceUrl, 'stale', `${bodyAge.date} per body (${bodyAge.ageDays} days old, window ${maxAgeDays})`);
          continue;
        }
      }

      // govFetch is a plain HTTP fetch; client-rendered pages yield only a
      // nav shell and the summariser then describes the emptiness. Drop
      // those instead of committing garbage — see lib/empty-shell.ts.
      if (isEmptyShellSummary(summary)) {
        drop(candidate.sourceUrl, 'empty-shell', 'govFetch got only a JS/nav shell');
        continue;
      }

      // Content-layer AI-relevance gate (shared). The BusinessTimes source
      // admits the whole tech section by document type, so confirm the body
      // actually concerns AI. Conservative: drop only a high-confidence "no";
      // low/medium stays for the _pendingReview backstop.
      const verdict = await judgeAiRelevance(
        { title: summary.titleEn || page.title, contentText: page.contentText, sourceUrl: candidate.sourceUrl },
        {
          kind: 'a company / product / ecosystem news item',
          scope:
            'AI / artificial-intelligence companies, products, infrastructure, or ecosystem developments — especially in Singapore',
          // Entity gate (2026-08-03): the ecosystem map catalogues THINGS,
          // not writing. An article about USING AI is not an ecosystem entity.
          requireScope:
            'an identifiable organisation, programme, product, platform, or facility as its subject — a how-to article, opinion piece, or research write-up ABOUT using AI fails',
        }
      );
      if (!verdict.relevant && verdict.confidence === 'high') {
        drop(candidate.sourceUrl, 'off-topic', verdict.reason);
        continue;
      }

      // Entity-name extraction: the record is named after the organisation /
      // programme the page is about, never after the headline (#294).
      const entity = await extractEntity(
        { title: headline, contentText: page.contentText, sourceUrl: candidate.sourceUrl },
        {
          entityTypes: ECOSYSTEM_ENTITY_TYPES,
          entityTypeGloss: ECOSYSTEM_ENTITY_TYPE_GLOSS,
          cacheDir: ENTITY_CACHE_DIR,
          force: options.force,
        }
      );
      if (!entity.isEntity && entity.confidence === 'high') {
        drop(candidate.sourceUrl, 'no-entity', entity.reason);
        continue;
      }

      const id = slugify(entity.nameEn) || slugify(summary.titleEn);
      if (existing.ids.has(id) || existing.names.has(entity.nameEn.toLowerCase())) {
        drop(candidate.sourceUrl, 'already-covered', `${entity.nameEn} (id: ${id}) is already on the map; consider updating it`);
        continue;
      }

      enriched.push({
        candidate,
        summary,
        entity,
        id,
        headlineEn: summary.titleEn,
        pageTitle: page.title,
        pageDate: age.date ?? summary.publishedDate,
        contentText: page.contentText,
      });
    } catch (error) {
      failures.push({
        sourceUrl: candidate.sourceUrl,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { enriched, failures, dropped };
}
