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

// Post-Phase-2 layout: EN at bare paths (`/policies/`), ZH under `/zh/`.
// We list EN canonical first (route default), ZH mirror second.

const enPolicies = categories.flatMap((category) =>
  category.policies
    .filter((policy) => policy.id)
    .map((policy) => `- ${base}/policies/${policy.id}/ — ${policy.titleEn || policy.title}`)
);

const zhPolicies = categories.flatMap((category) =>
  category.policies
    .filter((policy) => policy.id)
    .map((policy) => `- ${base}/zh/policies/${policy.id}/ — ${policy.title}`)
);

const lines = [
  '# Singapore AI Observatory — Full LLM Index',
  '',
  `Last updated: ${SITE_UPDATED}`,
  `Canonical domain: ${base}`,
  'Layout: EN at bare paths (route default), ZH mirrored under /zh/.',
  '',
  '## Core Sections',
  '',
  `- ${base}/ — Singapore AI Observatory home (EN)`,
  `- ${base}/zh/ — 新加坡 AI 观察首页 (ZH)`,
  `- ${base}/policies/ — Policy library (EN)  ·  ${base}/zh/policies/ (ZH)`,
  `- ${base}/debates/ — Parliamentary AI debates (EN)  ·  ${base}/zh/debates/ (ZH)`,
  `- ${base}/voices/ — AI Influence Map (EN)  ·  ${base}/zh/voices/ (ZH)`,
  `- ${base}/videos/ — AI video library (EN)  ·  ${base}/zh/videos/ (ZH)`,
  `- ${base}/levers/ — National AI Levers (EN)  ·  ${base}/zh/levers/ (ZH)`,
  `- ${base}/legal-ai/ — AI legal framework (EN)  ·  ${base}/zh/legal-ai/ (ZH)`,
  `- ${base}/benchmarking/ — International benchmarks (EN)  ·  ${base}/zh/benchmarking/ (ZH)`,
  `- ${base}/startups/ — AI startup ecosystem (EN)  ·  ${base}/zh/startups/ (ZH)`,
  `- ${base}/community-opensource/ — Community open source (EN)  ·  ${base}/zh/community-opensource/ (ZH)`,
  `- ${base}/updates/ — Recent updates feed (EN, RSS at ${base}/updates.rss.xml)  ·  ${base}/zh/updates/ (ZH, RSS at ${base}/zh/updates.rss.xml)`,
  '',
  '## Policy Detail Pages (EN canonical)',
  '',
  ...enPolicies,
  '',
  '## Policy Detail Pages (ZH mirror)',
  '',
  ...zhPolicies,
  '',
  '## Debate Detail Pages (EN canonical)',
  '',
  ...debates.map((debate) => `- ${base}/debates/${debate.id}/ — ${debate.titleEn || debate.title}`),
  '',
  '## Debate Detail Pages (ZH mirror)',
  '',
  ...debates.map((debate) => `- ${base}/zh/debates/${debate.id}/ — ${debate.title}`),
  '',
  '## Person Detail Pages (EN canonical)',
  '',
  ...allPeople.map((person) => `- ${base}/voices/${person.id}/ — ${person.nameEn || person.name}`),
  '',
  '## Person Detail Pages (ZH mirror)',
  '',
  ...allPeople.map((person) => `- ${base}/zh/voices/${person.id}/ — ${person.name || person.nameEn}`),
  '',
  '## Video Detail Pages (EN canonical)',
  '',
  ...videos.map((video) => `- ${base}/videos/${video.id}/ — ${video.titleEn || video.title}`),
  '',
  '## Video Detail Pages (ZH mirror)',
  '',
  ...videos.map((video) => `- ${base}/zh/videos/${video.id}/ — ${video.title}`),
  '',
  '## Lever / Project Detail Pages (EN canonical)',
  '',
  ...leverPages.map((page) =>
    page.kind === 'lever'
      ? `- ${base}/levers/${page.slug}/ — Lever ${page.lever.number} · ${page.lever.nameEn || page.lever.name}`
      : `- ${base}/levers/${page.slug}/ — ${page.item.nameEn || page.item.name}`
  ),
  '',
  '## Lever / Project Detail Pages (ZH mirror)',
  '',
  ...leverPages.map((page) =>
    page.kind === 'lever'
      ? `- ${base}/zh/levers/${page.slug}/ — 抓手 ${page.lever.number} · ${page.lever.name}`
      : `- ${base}/zh/levers/${page.slug}/ — ${page.item.name}`
  ),
  '',
  '## Legal Detail Pages (EN canonical)',
  '',
  ...legalItemPages.map((page) => `- ${base}/legal-ai/${page.slug}/ — ${page.item.titleEn || page.item.title}`),
  '',
  '## Legal Detail Pages (ZH mirror)',
  '',
  ...legalItemPages.map((page) => `- ${base}/zh/legal-ai/${page.slug}/ — ${page.item.title}`),
  '',
  '## Benchmark Region Pages (EN canonical)',
  '',
  ...regionPages.map((page) => `- ${base}/benchmarking/${page.slug}/ — ${page.summary.nameEn || page.summary.name}`),
  '',
  '## Benchmark Region Pages (ZH mirror)',
  '',
  ...regionPages.map((page) => `- ${base}/zh/benchmarking/${page.slug}/ — ${page.summary.name}`),
  '',
  '## Benchmark Case Detail Pages (EN canonical)',
  '',
  ...benchmarkCasePages.map(
    (page) => `- ${base}/benchmarking/${page.slug}/ — ${page.caseItem.nameEn || page.caseItem.name}`
  ),
  '',
  '## Benchmark Case Detail Pages (ZH mirror)',
  '',
  ...benchmarkCasePages.map((page) => `- ${base}/zh/benchmarking/${page.slug}/ — ${page.caseItem.name}`),
  '',
  '## Benchmark Region Drilldown Pages — Enriched (EN canonical)',
  '',
  ...benchmarkDrilldownPages
    .filter((page) => !page.analysisPending)
    .map((page) => `- ${base}/benchmarking/${page.slug}/ — ${page.titleEn}`),
  '',
  '## Benchmark Region Drilldown Pages — Enriched (ZH mirror)',
  '',
  ...benchmarkDrilldownPages
    .filter((page) => !page.analysisPending)
    .map((page) => `- ${base}/zh/benchmarking/${page.slug}/ — ${page.title}`),
  '',
  '## Startup Ecosystem Entity Pages (EN canonical)',
  '',
  ...startupEntityPages.map((page) => `- ${base}/startups/${page.slug}/ — ${page.name}`),
  '',
  '## Startup Ecosystem Entity Pages (ZH mirror)',
  '',
  ...startupEntityPages.map((page) => `- ${base}/zh/startups/${page.slug}/ — ${page.name}`),
  '',
  '## Community Open Source Project Pages (EN canonical)',
  '',
  ...allCommunityOpenSourceProjects.map(
    (project) => `- ${base}/community-opensource/${project.id}/ — ${project.nameEn || project.name}`
  ),
  '',
  '## Community Open Source Project Pages (ZH mirror)',
  '',
  ...allCommunityOpenSourceProjects.map(
    (project) => `- ${base}/zh/community-opensource/${project.id}/ — ${project.name}`
  ),
  '',
];

export function GET() {
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
