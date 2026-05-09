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
  updateType: 'benchmark',
  updateLabels: {
    title: '国际对标新增报告',
    titleJa: '国際ベンチマークの新規レポート',
    titleEn: 'International benchmarks: new reports',
    summary: '从 Stanford HAI / IMD 抓到的新报告进入待审队列，具体数字仍需手工提取。',
    summaryJa:
      'Stanford HAI / IMD から取得した新規レポートを審査待ちキューに登録しました。数値は手動抽出が必要です。',
    summaryEn:
      'New benchmark reports auto-discovered from Stanford HAI / IMD; rankings still need manual extraction.',
    listingHref: '/benchmarking/',
    listingLabel: '国际对标',
    listingLabelJa: '国際ベンチマーク',
    listingLabelEn: 'International benchmarks',
  },
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
