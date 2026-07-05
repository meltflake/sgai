// scripts/topics/backfill.ts
// ────────────────────────────────────────────────────────────────────────
// One-off (but idempotent) writer for the EXPLICIT topicIds hand labels —
// the domains where no controlled enum exists to derive from:
//   timeline events, people, legal-ai items, benchmark cases, unicorn
//   industry refinements, ecosystem per-entity overrides, and the zh blog
//   posts' frontmatter.
//
// Enum-driven domains (debates/videos/policies/tracker/levers/talent/
// startup verticals/ecosystem categories) need NO materialised topicIds —
// src/data/topic-mappings.ts derives them at read time; an explicit
// topicIds on any record overrides the derivation.
//
// Mechanics: every label is keyed to a unique literal anchor line already
// present in the target file (an id:/name:/title: line). The script
// asserts the anchor appears exactly once, then inserts a `topicIds:`
// line right below it at the same indentation. Records that already have
// a topicIds line directly after the anchor are skipped, so re-running is
// safe. Object shapes are never re-printed — eval:addedAt (which counts
// `+ id:` lines in diffs) cannot be tripped.
//
// Usage:
//   npx tsx scripts/topics/backfill.ts --dry-run   # report only
//   npx tsx scripts/topics/backfill.ts             # write

import { readFileSync, writeFileSync } from 'node:fs';
import { topicIdSet } from '../../src/data/topics';

const DRY = process.argv.includes('--dry-run');

interface FilePlan {
  file: string;
  /** anchor line content (without indentation) → topic ids */
  labels: Record<string, string[]>;
}

// ── Hand labels (the reviewed annotation pass) ──────────────────────────

const TIMELINE: Record<string, string[]> = {
  "title: '新加坡主办国际 AI 奥林匹克竞赛',": ['talent-education', 'international'],
  "title: 'Anthropic 650 亿美元 Series H：GIC 共同领投、淡马锡首次入股',": ['startups-investment'],
  "title: 'ATxSummit 2026：NAIS 更新与真实场景 AI 部署包',": ['national-strategy'],
  "title: 'Meta–Manus 收购被中国 NDRC 否决：「Singapore washing」红线划定',": ['startups-investment', 'international'],
  "title: 'ISO/IEC 42119-8 提案：全球首个生成式 AI 测试国际标准',": ['safety-ethics', 'international'],
  "title: '淡马锡参与 OpenAI 1220 亿美元融资',": ['startups-investment'],
  "title: 'GIC 与 Coatue 共同领投 Anthropic 300 亿美元 Series G',": ['startups-investment'],
  "title: 'NAIRD 发布 + 财政预算：AI 全面加速',": ['national-strategy'],
  "title: '樟宜机场获全球首张 ISO/IEC 42001 AI 管理体系认证',": ['governance-regulation', 'economy-industry'],
  "title: 'Agentic AI 治理与科技巨头落地',": ['governance-regulation', 'economy-industry'],
  "title: '智慧国家 2.0 落地与 AI 预算井喷',": ['national-strategy'],
  "title: 'NAIS 2.0 发布与 AI Verify 开源',": ['national-strategy', 'safety-ethics', 'open-source'],
  "title: 'AI Verify 发布与 NAISC 启动',": ['safety-ethics', 'governance-regulation'],
  "title: 'PDPA 修订与 GPAI 创始',": ['governance-regulation', 'international'],
  "title: 'NAIS 1.0 发布',": ['national-strategy'],
  "title: 'AIAP 与 100E 计划启动',": ['talent-education', 'economy-industry'],
  "title: 'AI Singapore 成立',": ['national-strategy', 'infrastructure-research'],
  "title: '智慧国家倡议启动',": ['national-strategy'],
};

const PEOPLE: Record<string, string[]> = {
  "id: 'josephine-teo',": ['national-strategy', 'governance-regulation'],
  "id: 'lawrence-wong',": ['national-strategy'],
  "id: 'vivian-balakrishnan',": ['international', 'national-strategy'],
  "id: 'tharman',": ['national-strategy', 'international'],
  "id: 'tan-kiat-how',": ['national-strategy', 'governance-regulation'],
  "id: 'ho-teck-hua',": ['infrastructure-research', 'talent-education'],
  "id: 'laurence-liew',": ['economy-industry', 'talent-education'],
  "id: 'leslie-teo',": ['open-source', 'infrastructure-research'],
  "id: 'mohan-kankanhalli',": ['talent-education', 'infrastructure-research'],
  "id: 'luke-ong',": ['economy-industry', 'infrastructure-research'],
  "id: 'phoon-kok-kwang',": ['infrastructure-research'],
  "id: 'simon-chesterman',": ['governance-regulation', 'safety-ethics'],
  "id: 'bryan-low',": ['infrastructure-research'],
  "id: 'ng-see-kiong',": ['infrastructure-research'],
  "id: 'beh-kian-teik',": ['infrastructure-research', 'national-strategy'],
  "id: 'andy-hor',": ['infrastructure-research'],
  "id: 'lim-keng-hui',": ['infrastructure-research'],
  "id: 'ivor-tsang',": ['infrastructure-research'],
  "id: 'ong-yew-soon',": ['infrastructure-research'],
  "id: 'jermaine-loy',": ['economy-industry', 'startups-investment'],
  "id: 'tan-eng-chye',": ['talent-education'],
  "id: 'aaron-thean',": ['talent-education', 'infrastructure-research'],
  "id: 'lily-kong',": ['talent-education'],
  "id: 'ng-cher-pong',": ['governance-regulation', 'economy-industry'],
  "id: 'aileen-chia',": ['governance-regulation'],
  "id: 'kiren-kumar',": ['economy-industry'],
  "id: 'denise-wong',": ['governance-regulation'],
  "id: 'ong-chen-hui',": ['economy-industry'],
  "id: 'shameek-kundu',": ['safety-ethics', 'governance-regulation'],
  "id: 'chia-der-jiun',": ['finance', 'governance-regulation'],
  "id: 'leong-sing-chiong',": ['finance'],
  "id: 'foo-hee-jug',": ['healthcare', 'public-sector'],
};

const LEGAL: Record<string, string[]> = {
  "title: 'Copyright Act §244',": ['governance-regulation'],
  'title: \'IPOS "When Code Creates" 报告\',': ['governance-regulation'],
  "title: 'Online Criminal Harms Act (OCHA)',": ['governance-regulation', 'deepfakes-disinformation'],
  "title: 'Elections (Integrity of Online Advertising) (Amendment) Bill',": [
    'deepfakes-disinformation',
    'governance-regulation',
  ],
  "title: 'Criminal Law (Miscellaneous Amendments) Bill 2025',": ['governance-regulation', 'deepfakes-disinformation'],
  "title: 'Online Safety (Relief and Accountability) Bill 2025',": ['governance-regulation', 'safety-ethics'],
  "title: '法院生成式 AI 使用指南',": ['governance-regulation', 'public-sector'],
  "title: 'MAS AI Risk Management Guidelines',": ['finance', 'governance-regulation'],
  "title: 'CSA Securing AI Systems Guidelines',": ['safety-ethics', 'national-security'],
  "title: 'PDPA × AI 边界',": ['governance-regulation'],
};

// Benchmark cases: resolver adds 'international' to every case — these are
// the per-case industry refinements only.
const BENCHMARK: Record<string, string[]> = {
  "id: 'ai-verify',": ['safety-ethics', 'governance-regulation'],
  "id: 'cyberport-ai-supercomputing-centre',": ['infrastructure-research'],
  "id: 'tsmc-ai-chip-manufacturing',": ['infrastructure-research', 'economy-industry'],
  "id: 'falcon-llm',": ['open-source'],
  "id: 'mgx-ai-fund',": ['startups-investment'],
  "id: 'mbzuai',": ['talent-education'],
  "id: 'unit-8200-ai-talent-pipeline',": ['talent-education', 'national-security'],
  "id: 'korea-chaebol-llm-stack',": ['economy-industry'],
  "id: 'burokratt',": ['public-sector'],
  "id: 'elements-of-ai',": ['talent-education'],
  "id: 'eth-ai-center',": ['infrastructure-research', 'talent-education'],
  "id: 'pan-canadian-ai-institute-network',": ['infrastructure-research'],
};

// Unicorns: resolver adds 'startups-investment' — industry refinements only
// where the sector is unambiguous. Anchors carry the 4-space unicorn
// indentation: the same company can reappear as an 8-space vertical
// startup (Biofourmis does), and exact-line matching keeps them apart.
const UNICORNS: Record<string, string[]> = {
  "    name: 'Advance Intelligence',": ['finance'],
  "    name: 'Biofourmis',": ['healthcare'],
  "    name: 'Nium',": ['finance'],
  "    name: 'Sygnum',": ['finance'],
};

// Ecosystem per-entity overrides (category seed would file these under
// 核心技术 → infrastructure-research; they are first and foremost the
// open-source artifacts Singapore ships).
const ECOSYSTEM: Record<string, string[]> = {
  "id: 'sea-lion',": ['open-source', 'infrastructure-research'],
  "id: 'sea-helm',": ['open-source', 'safety-ethics'],
  "id: 'sea-guard',": ['open-source', 'safety-ethics'],
  "id: 'aquarium',": ['open-source'],
};

const PLANS: FilePlan[] = [
  { file: 'src/data/timeline.ts', labels: TIMELINE },
  { file: 'src/data/people.ts', labels: PEOPLE },
  { file: 'src/data/legal-ai.ts', labels: LEGAL },
  { file: 'src/data/benchmarking.ts', labels: BENCHMARK },
  { file: 'src/data/startups.ts', labels: UNICORNS },
  { file: 'src/data/ecosystem.ts', labels: ECOSYSTEM },
];

// zh blog posts: YAML frontmatter, flow-style array after the category line.
const POSTS: Record<string, string[]> = {
  'src/data/post/anthropic-economic-index-singapore.md': ['economy-industry'],
  'src/data/post/microsoft-global-ai-adoption-2025.md': ['economy-industry', 'international'],
  'src/data/post/national-ai-missions-2026.md': ['national-strategy'],
  'src/data/post/singapore-ai-native-companies-vs-nations.md': ['national-strategy', 'economy-industry'],
  'src/data/post/singapore-ai-strategy-the-real-moat.md': ['national-strategy'],
  'src/data/post/singapore-ai-vs-smart-nation-two-transformations.md': ['national-strategy', 'public-sector'],
  'src/data/post/sovereign-capital-frontier-ai.md': ['startups-investment', 'international'],
};

// ── Engine ──────────────────────────────────────────────────────────────

function fmtIds(ids: string[]): string {
  for (const id of ids) {
    if (!topicIdSet.has(id)) throw new Error(`unknown topic id '${id}' — not in src/data/topics.ts`);
  }
  return `[${ids.map((i) => `'${i}'`).join(', ')}]`;
}

let inserted = 0;
let skipped = 0;

for (const plan of PLANS) {
  let src = readFileSync(plan.file, 'utf8');
  const lines = src.split('\n');
  for (const [anchor, ids] of Object.entries(plan.labels)) {
    // Anchors WITH leading whitespace match exactly (disambiguates records
    // nested at different depths); bare anchors match on trimmed content.
    const exact = /^\s/.test(anchor);
    const hits = lines
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => (exact ? l === anchor : l.trim() === anchor.trim()));
    if (hits.length !== 1) {
      throw new Error(`${plan.file}: anchor matched ${hits.length}x (need exactly 1): ${anchor}`);
    }
    const { l, i } = hits[0];
    const indent = l.match(/^\s*/)?.[0] ?? '';
    const next = lines[i + 1] ?? '';
    if (next.trim().startsWith('topicIds:')) {
      skipped++;
      continue;
    }
    lines.splice(i + 1, 0, `${indent}topicIds: ${fmtIds(ids)},`);
    inserted++;
  }
  src = lines.join('\n');
  if (!DRY) writeFileSync(plan.file, src);
  console.log(`[backfill] ${plan.file}: done`);
}

for (const [file, ids] of Object.entries(POSTS)) {
  const src = readFileSync(file, 'utf8');
  if (src.includes('\ntopicIds:')) {
    // frontmatter already labeled
    skipped++;
    continue;
  }
  const m = src.match(/^category: .*$/m);
  if (!m || m.index === undefined) throw new Error(`${file}: no category line to anchor on`);
  const insertAt = m.index + m[0].length;
  const yamlIds = `\ntopicIds: [${ids.map((i) => `'${i}'`).join(', ')}]`;
  const out = src.slice(0, insertAt) + yamlIds + src.slice(insertAt);
  if (!DRY) writeFileSync(file, out);
  inserted++;
  console.log(`[backfill] ${file}: done`);
}

console.log(`[backfill] ${DRY ? 'DRY RUN — ' : ''}inserted ${inserted}, skipped(existing) ${skipped}`);
