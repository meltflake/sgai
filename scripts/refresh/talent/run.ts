// scripts/refresh/talent/run.ts
// ────────────────────────────────────────────────────────────────────────
// Refresh AI talent / training programmes. Half-yearly cadence.
// Sources: AISG feed (programmes / apprenticeship / scholarships), IMDA
// programmes pages, tech.gov.sg sitemap.

import { runPipeline } from '../_shared/run-template.ts';

await runPipeline({
  domain: 'talent',
  targetFile: 'src/data/talent.ts',
  cacheDir: 'scripts/refresh/talent/data/summaries',
  branchLabel: 'talent',
  domainContext:
    'Singapore AI talent / education / training programmes. Classify each into one of the listed categories.',
  categories: [
    '专业人才培养',
    '高校教育',
    '中小学 AI 教育',
    '企业上手',
    '海外引进',
    '教师培训',
  ],
  defaultLimit: 3,
  sources: [
    {
      domain: 'aisingapore.org',
      feedUrl: 'https://aisingapore.org/feed/',
      feedType: 'rss',
      urlFilter: /(aiap|programme|scholarship|apprentice|talent|learners|fellow|train|education|school)/i,
    },
    {
      domain: 'imda.gov.sg',
      feedUrl: 'https://www.imda.gov.sg/sitemap.xml',
      feedType: 'sitemap',
      urlFilter: /(programme|talent|skills|tech-pass|techskills|sgunited)/i,
    },
    {
      domain: 'tech.gov.sg',
      feedUrl: 'https://www.tech.gov.sg/sitemap.xml',
      feedType: 'sitemap',
      urlFilter: /(scholarship|programme|talent|career)/i,
    },
  ],
});
