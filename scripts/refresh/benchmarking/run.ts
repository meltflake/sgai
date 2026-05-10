// scripts/refresh/benchmarking/run.ts
// ────────────────────────────────────────────────────────────────────────
// Refresh international benchmarking data. Annual cadence.
// Sources: Stanford HAI sitemap (AI Index), IMD feed (World Competitiveness),
// MAS / EDB. Mostly surfaces NEW REPORTS for Luca to manually pull
// numbers from — auto-extracting rankings from PDFs is out of scope.

import { runPipeline } from '../_shared/run-template.ts';

await runPipeline({
  domain: 'benchmarking',
  targetFile: 'src/data/benchmarking.ts',
  cacheDir: 'scripts/refresh/benchmarking/data/summaries',
  branchLabel: 'benchmarking',
  domainContext:
    'International AI benchmarking: rankings, country comparisons, indices. Classify each new report into one of the listed categories.',
  categories: ['国际排名', '区域对标', '投资规模', '人才评估', '治理成熟度', '基础设施'],
  defaultLimit: 3,
  sources: [
    {
      domain: 'hai.stanford.edu',
      feedUrl: 'https://hai.stanford.edu/sitemap.xml',
      feedType: 'sitemap',
      urlFilter: /(ai-index|report|country|index|ranking|compute|talent)/i,
    },
    {
      domain: 'imd.org',
      feedUrl: 'https://www.imd.org/feed/',
      feedType: 'rss',
      urlFilter: /(competitiveness|ranking|digital|talent|wcy|wcr)/i,
    },
  ],
});
