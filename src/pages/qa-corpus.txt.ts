// QA knowledge digest for the Ask-AI assistant (functions/api/ask.ts).
//
// The entire curated dataset, compressed to one deterministic plain-text
// file that fits in DeepSeek's context window as a stable, cacheable
// system-prompt prefix. English-primary (EN siblings are CI-enforced
// complete), with Chinese names kept for people/institutions so the model
// never invents Chinese transliterations. Ordering must stay deterministic
// — any byte churn between builds invalidates the provider's prefix cache.
//
// Size budget: warn at build time past MAX_BYTES; trim per TRIM ORDER in
// docs/20260814-ask-ai.md before raising the budget.

import { SITE_UPDATED } from '~/version';
import { debates } from '~/data/debates';
import { categories } from '~/data/policies';
import { dimensions, dataDate as trackerDataDate } from '~/data/tracker';
import { timelineEvents } from '~/data/timeline';
import { levers } from '~/data/levers';
import { people } from '~/data/people';
import { videos } from '~/data/videos';
import { programmes } from '~/data/talent';
import { regions } from '~/data/benchmarking';
import { seaLionStats, seaLionVersions, openSourceProjects } from '~/data/opensource';
import { allCommunityOpenSourceProjects } from '~/data/community-opensource';
import {
  benchmarkCasePages,
  ecosystemEntityPages,
  legalItemPages,
  leverPages,
  startupEntityPages,
} from '~/utils/entity-pages';
import { fetchPosts } from '~/utils/blog';

export const prerender = true;

const base = 'https://sgai.md';
const MAX_BYTES = 500_000;

/** Collapse whitespace and clip at a word boundary. */
function clip(text: string | null | undefined, max = 400): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + '…';
}

function buildDigest(postLines: string[]): string {
  const lines: string[] = [];
  const push = (...items: string[]) => lines.push(...items);

  push(
    '# sgai.md — Singapore AI Observatory: knowledge digest for the Ask-AI assistant',
    '',
    `Site content updated: ${SITE_UPDATED}. Tracker data date: ${trackerDataDate}.`,
    `Counts: ${debates.length} parliamentary debates, ${categories.reduce((n, c) => n + c.policies.length, 0)} policies, ${videos.length} videos, ${people.length} profiled people, ${timelineEvents.length} timeline events.`,
    '',
    'URL scheme: English pages at https://sgai.md/<path>/. Other languages prefix the path:',
    '/zh/ (简体中文), /ja/ (日本語), /zh-tw/ (繁體中文), /ko/ (한국어). Example: /zh/debates/<id>/.',
    ''
  );

  push('## Tracker — six dimensions of Singapore AI reality (/tracker/)', '');
  for (const dim of dimensions) {
    push(`### ${dim.titleEn || dim.title} (${base}/tracker/${dim.id}/) — trend: ${dim.trend}`);
    if (dim.kind === 'quantified') {
      push(`Headline: ${dim.headlineEn || dim.headline}. Benchmark: ${clip(dim.benchmarkEn || dim.benchmark, 300)}`);
    }
    push(`One-liner: ${clip(dim.oneLinerEn || dim.oneLiner, 300)}`);
    push(`Shortcoming: ${clip(dim.shortcomingEn || dim.shortcoming, 300)}`);
    for (const row of dim.metrics) {
      push(`- ${row.nameEn || row.name}: ${row.valueEn || row.value} (source: ${row.sourceEn || row.source})`);
    }
    push('');
  }

  push('## Parliamentary debates on AI (/debates/)', '');
  for (const d of debates) {
    push(
      `### ${d.date} · ${d.titleEn || d.title} (${base}/debates/${d.id}/)`,
      `Type: ${d.type}. Speakers: ${d.speakers.join(', ')}. Topics: ${d.topics.join(', ')}.`,
      clip(d.summaryEn || (d.keyPointsEn || []).join(' '), 500),
      ...(d.whyItMattersEn ? [`Why it matters: ${clip(d.whyItMattersEn, 200)}`] : []),
      ''
    );
  }

  push('## Policy library (/policies/)', '');
  for (const c of categories) {
    for (const p of c.policies) {
      if (!p.id) continue;
      push(
        `### ${p.date} · ${p.titleEn || p.title} (${base}/policies/${p.id}/)`,
        `Source: ${p.sourceEn || p.source}.`,
        clip(p.summaryEn || p.summary, 500),
        ...(p.whyItMattersEn ? [`Why it matters: ${clip(p.whyItMattersEn, 200)}`] : []),
        ''
      );
    }
  }

  push('## Timeline of Singapore AI (/timeline/)', '');
  for (const e of timelineEvents) {
    push(`- ${e.date || e.year} · ${e.titleEn || e.title}: ${clip(e.descriptionEn || e.description, 300)}`);
  }
  push('');

  push('## National AI levers (/levers/) — six state entry-points for AI', '');
  for (const lever of levers) {
    push(
      `### Lever ${lever.number}: ${lever.nameEn || lever.name} — ${lever.subtitleEn || lever.subtitle}`,
      `What the state does: ${clip(lever.whatStateDoesEn || lever.whatStateDoes, 300)}`,
      lever.insightEn || lever.insight ? `Insight: ${clip(lever.insightEn || lever.insight, 300)}` : ''
    );
  }
  push('', 'Lever project pages:');
  for (const page of leverPages) {
    if (page.kind === 'item') {
      push(
        `- ${page.item.nameEn || page.item.name} (${page.item.ministryEn || page.item.ministry}${page.item.scaleEn || page.item.scale ? `; ${page.item.scaleEn || page.item.scale}` : ''}) ${base}/levers/${page.slug}/`
      );
    }
  }
  push('');

  push('## Key people (/voices/) — Chinese names are official; use them exactly, never transliterate', '');
  for (const person of people) {
    push(
      `### ${person.nameEn}（中文名：${person.name}） (${base}/voices/${person.id}/)`,
      `${person.titleEn || person.title}. Affiliations: ${person.affiliations.join(', ')}.`,
      clip(person.summaryEn || person.summary, 300),
      ''
    );
  }

  push('## AI ecosystem map (/ecosystem/)', '');
  for (const page of ecosystemEntityPages) {
    push(
      `- ${page.entity.nameEn || page.entity.name} [${page.entity.entityType || 'entity'}]: ${clip(page.entity.descriptionEn || page.entity.description, 250)} ${base}/ecosystem/${page.slug}/`
    );
  }
  push('');

  push('## Startup ecosystem (/startups/)', '');
  for (const page of startupEntityPages) {
    push(
      `- ${page.name} [${page.categoryEn}]: ${clip(page.descriptionEn || page.description, 200)} ${base}/startups/${page.slug}/`
    );
  }
  push('');

  push('## Legal & regulatory framework for AI (/legal-ai/)', '');
  for (const page of legalItemPages) {
    push(
      `- ${page.item.titleEn || page.item.title} (${page.item.dateEn || page.item.date}; ${page.item.authorityEn || page.item.authority}; scope: ${page.item.scope}; status: ${page.item.statusEn || page.item.status}) ${base}/legal-ai/${page.slug}/`
    );
  }
  push('');

  push('## Talent programmes (/talent/)', '');
  for (const prog of programmes) {
    push(
      `- ${prog.nameEn || prog.name} [${prog.categoryEn || prog.category}; ${prog.ownerEn || prog.owner}]: ${clip(prog.descriptionEn || prog.description, 250)} ${base}/talent/${prog.id}/`
    );
  }
  push('');

  push('## International benchmarking (/benchmarking/) — Singapore vs other AI hubs', '');
  for (const region of regions) {
    push(
      `- ${region.nameEn || region.name}: strategy ${region.strategyEn || region.strategy} (${region.strategyYear}); investment ${clip(region.investmentEn || region.investment, 150)}; governance ${clip(region.governanceEn || region.governance, 150)}; strength vs Singapore: ${clip(region.strengthEn || region.strength, 150)}${region.aiRanking ? `; AI ranking: ${region.aiRanking}` : ''}`
    );
  }
  push('', 'Benchmark case studies:');
  for (const page of benchmarkCasePages) {
    push(`- ${page.caseItem.nameEn || page.caseItem.name} ${base}/benchmarking/${page.slug}/`);
  }
  push('');

  push('## Official open source & SEA-LION (/opensource/)', '');
  push(
    `SEA-LION (AI Singapore's Southeast Asian LLM family): ${seaLionStats.totalModels} models on HuggingFace, ${seaLionStats.totalDownloads} downloads (as of ${seaLionStats.dataDate}). Top model: ${seaLionStats.topModel}.`,
    `Versions: ${seaLionVersions.map((v) => `${v.version} (${v.models} models, ${v.period})`).join('; ')}.`
  );
  for (const proj of openSourceProjects) {
    push(
      `- ${proj.nameEn || proj.name} [${proj.ownerEn || proj.owner}; ${proj.categoryEn || proj.category}]: ${clip(proj.descriptionEn || proj.description, 250)}`
    );
  }
  push('', 'Community open source (/community-opensource/):');
  for (const proj of allCommunityOpenSourceProjects) {
    push(`- ${proj.nameEn || proj.name} ${base}/community-opensource/${proj.id}/`);
  }
  push('');

  push('## Video library (/videos/)', '');
  for (const v of videos) {
    push(
      `- ${v.date} · ${v.titleEn || v.title} — ${v.speaker} (${v.speakerTitleEn || v.speakerTitle}) ${base}/videos/${v.id}/`
    );
    if (v.whyItMattersEn) push(`  Why it matters: ${clip(v.whyItMattersEn, 200)}`);
  }
  push('');

  push('## Analysis & long-form articles (/blog/)', '');
  push(...postLines);
  push('');

  push(
    '## Other site sections',
    '',
    `- ${base}/updates/ — recent updates feed`,
    `- ${base}/topics/ — browse by topic`,
    `- ${base}/evolution/ — how Singapore's AI strategy evolved`,
    `- ${base}/challenges/ — open challenges`,
    `- ${base}/fieldnotes/ — field notes`,
    `- ${base}/references/ — external references`,
    `- ${base}/about/ — about this site`,
    ''
  );

  return lines.filter((line) => line !== null && line !== undefined).join('\n');
}

export async function GET() {
  const posts = await fetchPosts();
  const langPrefix = /^(zh|ja|ko|zh-tw)\//;
  const postLines = posts
    .filter((post) => !langPrefix.test(post.permalink.replace(/^\//, '')))
    .map(
      (post) =>
        `- ${post.publishDate.toISOString().slice(0, 10)} · ${post.title}: ${clip(post.excerpt, 250)} ${base}/${post.permalink.replace(/^\//, '')}/`
    );

  const digest = buildDigest(postLines);
  const bytes = Buffer.byteLength(digest, 'utf8');
  if (bytes > MAX_BYTES) {
    console.warn(
      `[qa-corpus] digest is ${bytes} bytes (budget ${MAX_BYTES}). Trim fields per docs/20260814-ask-ai.md before raising the budget.`
    );
  }

  return new Response(digest, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
