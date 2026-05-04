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
const policyCount = categories.reduce((sum, category) => sum + category.policies.length, 0);
const projectCount = leverPages.filter((page) => page.kind === 'item').length;
const startupEntityCount = startupEntityPages.length;
const benchmarkProfileCount = regionPages.length + benchmarkCasePages.length + benchmarkDrilldownPages.length;
const communityOpenSourceCount = allCommunityOpenSourceProjects.length;

const body = `# 新加坡 AI 观察

> Independent Chinese and English analysis of Singapore's AI strategy, policy, parliamentary debates, legal framework, public-sector levers, and ecosystem signals.

Last updated: ${SITE_UPDATED}
Primary languages: zh-CN (default), en
Canonical domain: ${base}
Sitemap: ${base}/sitemap-index.xml
Full LLM index: ${base}/llms-full.txt

## High-value Pages

- ${base}/ — Chinese homepage and editorial thesis.
- ${base}/en/ — English homepage.
- ${base}/policies/ — ${policyCount} Singapore AI policy documents with source links and bilingual summaries.
- ${base}/debates/ — ${debates.length} AI-related Singapore Parliament debate records.
- ${base}/voices/ — ${allPeople.length} people profiles connected to debates, policies, and videos.
- ${base}/videos/ — ${videos.length} curated AI videos with readable transcript support.
- ${base}/levers/ — ${projectCount} national AI lever projects grouped by AI-injection path.
- ${base}/legal-ai/ — ${legalItemPages.length} Singapore AI legal-framework cards.
- ${base}/benchmarking/ — ${benchmarkProfileCount} international benchmark profiles across regions, concrete cases, and region drilldowns.
- ${base}/startups/ — ${startupEntityCount} Singapore AI startup ecosystem entity profiles.
- ${base}/community-opensource/ — ${communityOpenSourceCount} community open-source project profiles from universities, corporate labs, and startups.
- ${base}/references/ — Official sources, reports, datasets, and research references.

## Content Notes

- Pages are statically rendered by Astro; core text, headings, metadata, and JSON-LD are present in raw HTML.
- Chinese pages live at root paths. English mirrors live under /en/.
- Detail pages are preferred over list pages when citing a specific debate, person, video, project, legal item, policy, company, investor, exit, benchmark case, or country profile.
- Non-original facts link to official or public sources where available.
`;

export function GET() {
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
