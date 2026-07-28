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
      // AI Index pages only. The old broad token list matched HAI news
      // articles ("computer-science" hits /compute/, etc.) — this source
      // exists to flag new AI Index editions, nothing else.
      urlFilter: /\/ai-index\//i,
      // This pipeline's job is to flag NEW report editions; the sitemap
      // lists every archive year and kept resurfacing 2017-2024 AI Index
      // pages (issue #166). All editions ≤ current live in
      // src/data/benchmarking.ts reportArchive[] already.
      minUrlYear: new Date().getFullYear(),
      // Chapter sub-pages of an edition (…/2026-ai-index-report/economy)
      // are parts of a report we already track — only the edition landing
      // page should candidate.
      urlExcludes: [/\d{4}-ai-index-report\/./],
    },
    {
      domain: 'imd.org',
      feedUrl: 'https://www.imd.org/feed/',
      feedType: 'rss',
      urlFilter: /(competitiveness|ranking|digital|talent|wcy|wcr)/i,
      // /ibyimd/ is IMD's magazine — opinion pieces in several languages
      // ("talento" hits /talent/). WCY/WCR ranking releases live outside it.
      urlExcludes: [/\/ibyimd\//i],
    },
  ],
});
