import { SITE_UPDATED } from '~/version';
import { debates } from '~/data/debates';
import { videos } from '~/data/videos';
import { allPeople } from '~/data/people';
import { categories } from '~/data/policies';
import { allCommunityOpenSourceProjects } from '~/data/community-opensource';
import {
  benchmarkCasePages,
  benchmarkDrilldownPages,
  legalItemPages,
  regionPages,
  leverPages,
  startupEntityPages,
} from '~/utils/entity-pages';

export const prerender = true;

const base = 'https://sgai.md';

const policies = categories.flatMap((category) =>
  category.policies.filter((policy) => policy.id).map((policy) => `- ${base}/policies/${policy.id}/ — ${policy.title}`)
);

const enPolicies = categories.flatMap((category) =>
  category.policies
    .filter((policy) => policy.id)
    .map((policy) => `- ${base}/en/policies/${policy.id}/ — ${policy.titleEn || policy.title}`)
);

const lines = [
  '# 新加坡 AI 观察 — Full LLM Index',
  '',
  `Last updated: ${SITE_UPDATED}`,
  `Canonical domain: ${base}`,
  '',
  '## Core Sections',
  '',
  `- ${base}/ — 新加坡 AI 观察首页`,
  `- ${base}/en/ — Singapore AI Observatory home`,
  `- ${base}/policies/ — 政策文件`,
  `- ${base}/debates/ — 国会 AI 焦点`,
  `- ${base}/voices/ — AI 影响力图谱`,
  `- ${base}/videos/ — AI 视频观点`,
  `- ${base}/levers/ — 国家 AI 抓手图谱`,
  `- ${base}/legal-ai/ — AI 法律框架`,
  `- ${base}/benchmarking/ — 国际对标`,
  `- ${base}/startups/ — AI 创业生态`,
  `- ${base}/community-opensource/ — 产学研开源生态`,
  `- ${base}/updates/ — 最近更新流（中文）`,
  `- ${base}/en/updates/ — Recent updates feed (English)`,
  `- ${base}/updates.rss.xml — 中文更新 RSS`,
  `- ${base}/en/updates.rss.xml — English updates RSS`,
  '',
  '## Policy Detail Pages',
  '',
  ...policies,
  '',
  '## English Policy Detail Pages',
  '',
  ...enPolicies,
  '',
  '## Debate Detail Pages',
  '',
  ...debates.map((debate) => `- ${base}/debates/${debate.id}/ — ${debate.zhTitle}`),
  '',
  '## English Debate Detail Pages',
  '',
  ...debates.map((debate) => `- ${base}/en/debates/${debate.id}/ — ${debate.title}`),
  '',
  '## Person Detail Pages',
  '',
  ...allPeople.map((person) => `- ${base}/voices/${person.id}/ — ${person.zhName || person.name}`),
  '',
  '## English Person Detail Pages',
  '',
  ...allPeople.map((person) => `- ${base}/en/voices/${person.id}/ — ${person.name}`),
  '',
  '## Video Detail Pages',
  '',
  ...videos.map((video) => `- ${base}/videos/${video.id}/ — ${video.title}`),
  '',
  '## English Video Detail Pages',
  '',
  ...videos.map((video) => `- ${base}/en/videos/${video.id}/ — ${video.titleEn || video.title}`),
  '',
  '## Lever and Project Detail Pages',
  '',
  ...leverPages.map((page) =>
    page.kind === 'lever'
      ? `- ${base}/levers/${page.slug}/ — 抓手 ${page.lever.number} · ${page.lever.name}`
      : `- ${base}/levers/${page.slug}/ — ${page.item.name}`
  ),
  '',
  '## English Lever and Project Detail Pages',
  '',
  ...leverPages.map((page) =>
    page.kind === 'lever'
      ? `- ${base}/en/levers/${page.slug}/ — Lever ${page.lever.number} · ${page.lever.nameEn || page.lever.name}`
      : `- ${base}/en/levers/${page.slug}/ — ${page.item.nameEn || page.item.name}`
  ),
  '',
  '## Legal Detail Pages',
  '',
  ...legalItemPages.map((page) => `- ${base}/legal-ai/${page.slug}/ — ${page.item.title}`),
  '',
  '## English Legal Detail Pages',
  '',
  ...legalItemPages.map((page) => `- ${base}/en/legal-ai/${page.slug}/ — ${page.item.titleEn || page.item.title}`),
  '',
  '## Benchmark Detail Pages',
  '',
  ...regionPages.map((page) => `- ${base}/benchmarking/${page.slug}/ — ${page.summary.name}`),
  '',
  '## English Benchmark Detail Pages',
  '',
  ...regionPages.map((page) => `- ${base}/en/benchmarking/${page.slug}/ — ${page.summary.nameEn || page.summary.name}`),
  '',
  '## Benchmark Case Detail Pages',
  '',
  ...benchmarkCasePages.map((page) => `- ${base}/benchmarking/${page.slug}/ — ${page.caseItem.name}`),
  '',
  '## English Benchmark Case Detail Pages',
  '',
  ...benchmarkCasePages.map(
    (page) => `- ${base}/en/benchmarking/${page.slug}/ — ${page.caseItem.nameEn || page.caseItem.name}`
  ),
  '',
  '## Benchmark Region Drilldown Pages — Enriched',
  '',
  ...benchmarkDrilldownPages
    .filter((page) => !page.analysisPending)
    .map((page) => `- ${base}/benchmarking/${page.slug}/ — ${page.title}`),
  '',
  '## English Benchmark Region Drilldown Pages — Enriched',
  '',
  ...benchmarkDrilldownPages
    .filter((page) => !page.analysisPending)
    .map((page) => `- ${base}/en/benchmarking/${page.slug}/ — ${page.titleEn}`),
  '',
  '## Startup Ecosystem Entity Pages',
  '',
  ...startupEntityPages.map((page) => `- ${base}/startups/${page.slug}/ — ${page.name}`),
  '',
  '## English Startup Ecosystem Entity Pages',
  '',
  ...startupEntityPages.map((page) => `- ${base}/en/startups/${page.slug}/ — ${page.name}`),
  '',
  '## Community Open Source Project Pages',
  '',
  ...allCommunityOpenSourceProjects.map((project) => `- ${base}/community-opensource/${project.id}/ — ${project.name}`),
  '',
  '## English Community Open Source Project Pages',
  '',
  ...allCommunityOpenSourceProjects.map(
    (project) => `- ${base}/en/community-opensource/${project.id}/ — ${project.nameEn || project.name}`
  ),
  '',
];

export function GET() {
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
