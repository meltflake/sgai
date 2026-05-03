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
}

const SG_AI_KEYWORDS = /(singapore|ai|artificial-intelligence|machine-learning|llm|generative|robotics|autonomous|smart-nation)/i;

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
    defaultCategory: '核心枢纽',
    defaultEntityType: 'program',
    urlFilter: /.*/,
  },
  {
    domain: 'businesstimes.com.sg',
    label: 'Business Times Tech',
    feedUrl: 'https://www.businesstimes.com.sg/rss/technology',
    feedType: 'rss',
    defaultCategory: '本地创业生态',
    defaultEntityType: 'product',
    urlFilter: SG_AI_KEYWORDS,
  },
  {
    domain: 'tech.gov.sg',
    label: 'GovTech Singapore',
    feedUrl: 'https://www.tech.gov.sg/sitemap.xml',
    feedType: 'sitemap',
    defaultCategory: '政府平台',
    defaultEntityType: 'platform',
    urlFilter: /(media|news|product|launch|smart-nation|ai)/i,
  },
];

/**
 * Closed-set classification labels that the AI summarizer must pick from.
 * Keep aligned with category names in src/data/ecosystem.ts.
 */
export const ECOSYSTEM_CATEGORIES = [
  '核心枢纽',
  '研究机构',
  '政府平台',
  '本地创业生态',
  '本地企业',
  '跨国科技公司',
  '风险投资',
  '智库与媒体',
  '高校研究中心',
  '行业联盟',
] as const;

export type EcosystemCategoryName = (typeof ECOSYSTEM_CATEGORIES)[number];
