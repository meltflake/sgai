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
  sources: [
    {
      domain: 'businesstimes.com.sg',
      feedUrl: 'https://www.businesstimes.com.sg/rss/technology',
      feedType: 'rss',
      urlFilter: /(ai|artificial-intelligence|fund|raise|series|investment|startup|unicorn|exit|ipo|acquisition)/i,
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
