// scripts/refresh/tracker/run.ts
// ────────────────────────────────────────────────────────────────────────
// Refresh national AI tracker (6 dimensions: investment / talent / compute
// / adoption / research / governance). Half-yearly cadence.
// Sources: Stanford HAI, IMD, MAS, IMDA, EDB.

import { runPipeline } from '../_shared/run-template.ts';

await runPipeline({
  domain: 'tracker',
  targetFile: 'src/data/tracker.ts',
  cacheDir: 'scripts/refresh/tracker/data/summaries',
  branchLabel: 'tracker',
  domainContext:
    'Singapore AI tracker: investment, talent, compute, adoption, research, governance. Classify each new data point into one of the 6 dimensions.',
  categories: ['投资', '人才', '算力', '采纳', '研究', '治理'],
  defaultLimit: 3,
  sources: [
    {
      domain: 'imda.gov.sg',
      feedUrl: 'https://www.imda.gov.sg/sitemap.xml',
      feedType: 'sitemap',
      urlFilter: /(report|study|statistic|investment|adoption|workforce|index|annual)/i,
    },
    {
      domain: 'edb.gov.sg',
      feedUrl: 'https://www.edb.gov.sg/sitemap.xml',
      feedType: 'sitemap',
      urlFilter: /(investment|report|economic|industry|research)/i,
    },
    {
      domain: 'hai.stanford.edu',
      feedUrl: 'https://hai.stanford.edu/sitemap.xml',
      feedType: 'sitemap',
      urlFilter: /(ai-index|country|investment|talent|research)/i,
    },
  ],
});
