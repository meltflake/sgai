// scripts/refresh/startups/run.ts
// ────────────────────────────────────────────────────────────────────────
// Refresh AI startup / unicorn / funding rounds. Quarterly cadence.
// Sources: Business Times tech RSS, AISG feed, EDB.
// (e27 is Cloudflare-protected — skipped; falls back to Business Times)

import { runPipeline } from '../_shared/run-template.ts';

await runPipeline({
  domain: 'startups',
  targetFile: 'src/data/startups.ts',
  cacheDir: 'scripts/refresh/startups/data/summaries',
  branchLabel: 'startups',
  domainContext:
    'Singapore AI startup ecosystem: company launches, funding rounds, exits, and investors. Classify each into one of the listed categories.',
  categories: ['独角兽', '融资轮', '退出', '投资机构', '新公司'],
  defaultLimit: 3,
  // The body-level AI-relevance judge (run-template) decides AI relevance,
  // so sources admit broadly by document type. A BusinessTimes AI funding
  // story whose URL is /companies/startup-x-raises-50m (no "ai"/"fund" in
  // the slug) is no longer dropped at the URL layer.
  judgeKind: 'a startup / funding / tech business news article',
  judgeScope:
    'AI / artificial-intelligence companies, startups, funding rounds, exits, or investors — especially in Singapore',
  sources: [
    {
      domain: 'businesstimes.com.sg',
      feedUrl: 'https://www.businesstimes.com.sg/rss/technology',
      feedType: 'rss',
      // Whole tech section admitted; AI relevance judged on the body.
      urlFilter: /businesstimes\.com\.sg\//i,
    },
    {
      domain: 'aisingapore.org',
      feedUrl: 'https://aisingapore.org/feed/',
      feedType: 'rss',
      urlFilter: /(startup|funding|investment|venture|acceleration|alumni)/i,
    },
    {
      domain: 'edb.gov.sg',
      feedUrl: 'https://www.edb.gov.sg/sitemap.xml',
      feedType: 'sitemap',
      urlFilter: /(news|investment|startup|fund|company)/i,
    },
  ],
});
