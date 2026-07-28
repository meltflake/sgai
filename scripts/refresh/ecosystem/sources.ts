// scripts/refresh/ecosystem/sources.ts
// ────────────────────────────────────────────────────────────────────────
// Source registry for ecosystem refresh. Ecosystem entities (companies /
// research labs / institutes) don't have a single canonical announcement
// firehose like policies do; each source provides a different slice.
//
// Initial coverage (MVP — extend over time):
//   - e27 RSS         → SG-based AI startup launches / funding rounds
//   - tech.gov.sg     → government tech / AI announcements (overlap with policies acceptable)
//
// Each source declares:
//   - feedUrl  (RSS / sitemap / listing)
//   - urlFilter regex deciding which entries to keep
//   - defaultCategory mapping to ecosystem.ts category names
//   - defaultEntityType (so AI summarizer can override)

export interface EcosystemSourceEntry {
  domain: string;
  label: string;
  feedUrl: string;
  feedType: 'rss' | 'sitemap';
  defaultCategory: string;
  defaultEntityType: string;
  /** Filter on URL slug. */
  urlFilter: RegExp;
  urlExcludes?: RegExp[];
  /** RSS only: drop items whose WordPress <category> matches one of these
   *  (exact, case-insensitive). URL-path excludes can't work on bare-slug
   *  permalinks (aisingapore.org/<slug>/), but the feed's own taxonomy
   *  separates paper posts from ecosystem content. */
  rssCategoryExcludes?: string[];
}

// Working sources (verified 2026-05-03):
//   - aisingapore.org/feed/        ✅ WordPress RSS, AI Singapore official
//   - businesstimes.com.sg/rss/technology  ✅ SG tech news incl. fundings
//   - tech.gov.sg/sitemap.xml      ✅ GovTech products/launches
//
// Blocked sources (Cloudflare JS challenge or anti-bot — skip):
//   - e27.co/feed/                 ❌ Cloudflare JS challenge
//   - govinsider.asia/feed         ❌ JS-rendered (Next.js, no real RSS)
//   - straitstimes.com/rss/*       ❌ JS-rendered
export const ECOSYSTEM_SOURCES: EcosystemSourceEntry[] = [
  {
    domain: 'aisingapore.org',
    label: 'AI Singapore',
    feedUrl: 'https://aisingapore.org/feed/',
    feedType: 'rss',
    defaultCategory: '基础研究',
    defaultEntityType: 'program',
    urlFilter: /.*/,
    // The AISG WordPress feed is dominated by research paper posts —
    // content, not ecosystem entities. The 2026-07-28 dry-run (issue #166)
    // surfaced only these. Their permalinks are bare slugs
    // (aisingapore.org/<slug>/), so path excludes can't catch them; the
    // feed's own 'AI Research' category can (verified against the live
    // feed: 7/10 items carry it, all paper posts).
    rssCategoryExcludes: ['AI Research'],
  },
  {
    domain: 'businesstimes.com.sg',
    label: 'Business Times Tech',
    feedUrl: 'https://www.businesstimes.com.sg/rss/technology',
    feedType: 'rss',
    defaultCategory: '创新孵化',
    defaultEntityType: 'product',
    // Whole BT tech section admitted by document type; the run.ts
    // AI-relevance judge decides AI on the body. A funding story whose URL is
    // /companies/x-raises-50m has no "ai" keyword but can be on-topic.
    urlFilter: /businesstimes\.com\.sg\//i,
  },
  {
    domain: 'tech.gov.sg',
    label: 'GovTech Singapore',
    feedUrl: 'https://www.tech.gov.sg/sitemap.xml',
    feedType: 'sitemap',
    defaultCategory: '产业伙伴',
    defaultEntityType: 'platform',
    urlFilter: /(media|news|product|launch|smart-nation|ai)/i,
  },
];

/**
 * Closed-set classification labels that the AI summarizer must pick from.
 * MUST match exact `name:` values in src/data/ecosystem.ts (verified 2026-05-03).
 */
export const ECOSYSTEM_CATEGORIES = [
  '核心枢纽',
  '基础研究',
  '治理体系',
  '核心技术',
  '创新孵化',
  'AI 产品',
  '人才培养',
  '国际合作',
  '医疗科技',
  '产业伙伴',
] as const;

export type EcosystemCategoryName = (typeof ECOSYSTEM_CATEGORIES)[number];
