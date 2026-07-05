// src/data/topic-mappings.ts
// ────────────────────────────────────────────────────────────────────────
// Deterministic enum → topicIds seed mappings + per-domain resolvers.
//
// Coverage model (two layers, explicit wins):
//   1. A record's own `topicIds` field, when non-empty, is authoritative —
//      it is the editorial override written directly in the data file.
//   2. Otherwise the resolver derives topicIds from the record's existing
//      controlled enum (debates.topics, videos.topic, policy category,
//      tracker dimension id, lever number, talent category, ecosystem
//      category name, startup vertical). This gives the enum-driven
//      domains full coverage without materialising 400 mechanical lines —
//      and new records from the refresh pipelines are covered on arrival
//      because their enums already exist at emit time.
//
// Domains with no usable enum (timeline, people, legal-ai items,
// benchmark cases, posts frontmatter, unicorns/exits/investors industry
// refinements) carry explicit hand-written `topicIds` in their data files;
// scripts/verify-graph.ts asserts both validity (ids ∈ vocabulary) and
// coverage (hard domains resolve to ≥1 topic).
//
// Every map value must stay inside src/data/topics.ts's vocabulary —
// verify-graph checks these tables too, so a typo fails `npm run check`.

// ── Seed maps (enum value → topic ids) ──────────────────────────────────

/** debates[].topics values (11, English controlled vocabulary). */
export const DEBATE_TOPIC_TO_TOPIC_IDS: Record<string, string[]> = {
  'AI Strategy': ['national-strategy'],
  'AI Governance & Regulation': ['governance-regulation'],
  'AI Safety & Ethics': ['safety-ethics'],
  'AI & National Security': ['national-security'],
  'Deepfakes & Disinformation': ['deepfakes-disinformation'],
  'AI Economy & Industry': ['economy-industry'],
  'AI & Employment': ['employment-workforce'],
  'AI in Education': ['talent-education'],
  'AI in Healthcare': ['healthcare'],
  'AI in Public Sector': ['public-sector'],
  'AI Infrastructure & Research': ['infrastructure-research'],
};

/** videos[].topic values (5, zh display enum from VIDEO_CATEGORIES). */
export const VIDEO_TOPIC_TO_TOPIC_IDS: Record<string, string[]> = {
  'AI 战略与愿景': ['national-strategy'],
  'AI 治理与监管': ['governance-regulation'],
  'AI 产业与应用': ['economy-industry'],
  'AI 人才与教育': ['talent-education'],
  国际合作与对标: ['international'],
};

/** policies category names (5, zh). */
export const POLICY_CATEGORY_TO_TOPIC_IDS: Record<string, string[]> = {
  国家战略: ['national-strategy'],
  治理框架: ['governance-regulation'],
  行业监管: ['governance-regulation'],
  预算与资金: ['national-strategy'],
  国际合作: ['international'],
};

/** tracker dimension ids (6). */
export const TRACKER_DIMENSION_TO_TOPIC_IDS: Record<string, string[]> = {
  investment: ['startups-investment'],
  talent: ['talent-education'],
  compute: ['infrastructure-research'],
  adoption: ['economy-industry'],
  research: ['infrastructure-research'],
  governance: ['governance-regulation'],
};

/** lever numbers (6): 基建/治理/人才/应用/政府自用/外交. */
export const LEVER_NUMBER_TO_TOPIC_IDS: Record<number, string[]> = {
  1: ['infrastructure-research'],
  2: ['governance-regulation'],
  3: ['talent-education'],
  4: ['economy-industry'],
  5: ['public-sector'],
  6: ['international'],
};

/** talent programme categories (zh). All are talent-education; a few also
 *  belong to the employment / enterprise-adoption conversations. */
export const TALENT_CATEGORY_TO_TOPIC_IDS: Record<string, string[]> = {
  职业转型: ['talent-education', 'employment-workforce'],
  '企业 GenAI 落地': ['talent-education', 'economy-industry'],
  基础研究人才: ['talent-education', 'infrastructure-research'],
  本硕研究通道: ['talent-education'],
  全民与职场学习: ['talent-education', 'employment-workforce'],
  学生实践竞赛: ['talent-education'],
  国际青年赛事: ['talent-education', 'international'],
  中小学与教师: ['talent-education'],
};

/** ecosystem category names (10, zh). Per-entity `topicIds` overrides win. */
export const ECOSYSTEM_CATEGORY_TO_TOPIC_IDS: Record<string, string[]> = {
  核心枢纽: ['national-strategy'],
  基础研究: ['infrastructure-research'],
  治理体系: ['governance-regulation'],
  核心技术: ['infrastructure-research'],
  创新孵化: ['startups-investment'],
  'AI 产品': ['public-sector'],
  人才培养: ['talent-education'],
  国际合作: ['international'],
  医疗科技: ['healthcare'],
  产业伙伴: ['economy-industry'],
};

/** startup vertical names (zh). Everything startup-shaped also carries
 *  startups-investment via the resolvers below. */
export const STARTUP_VERTICAL_TO_TOPIC_IDS: Record<string, string[]> = {
  金融科技: ['finance'],
  医疗健康: ['healthcare'],
  '企业 SaaS': ['economy-industry'],
  'AI 基础设施': ['infrastructure-research'],
  机器人与自动驾驶: ['economy-industry'],
};

// ── Resolvers (explicit topicIds win; else derive from the enum) ────────

interface WithTopicIds {
  topicIds?: string[];
}

function explicit(record: WithTopicIds): string[] | null {
  return record.topicIds && record.topicIds.length > 0 ? record.topicIds : null;
}

function uniq(ids: string[]): string[] {
  return [...new Set(ids)];
}

export function debateTopicIds(d: WithTopicIds & { topics: string[] }): string[] {
  return explicit(d) ?? uniq(d.topics.flatMap((tp) => DEBATE_TOPIC_TO_TOPIC_IDS[tp] ?? []));
}

export function videoTopicIds(v: WithTopicIds & { topic: string }): string[] {
  return explicit(v) ?? VIDEO_TOPIC_TO_TOPIC_IDS[v.topic] ?? [];
}

export function policyTopicIds(p: WithTopicIds, categoryName: string): string[] {
  return explicit(p) ?? POLICY_CATEGORY_TO_TOPIC_IDS[categoryName] ?? [];
}

export function trackerTopicIds(dim: WithTopicIds & { id: string }): string[] {
  return explicit(dim) ?? TRACKER_DIMENSION_TO_TOPIC_IDS[dim.id] ?? [];
}

export function leverTopicIds(lv: WithTopicIds & { number: number }): string[] {
  return explicit(lv) ?? LEVER_NUMBER_TO_TOPIC_IDS[lv.number] ?? [];
}

export function talentTopicIds(prog: WithTopicIds & { category: string }): string[] {
  return explicit(prog) ?? TALENT_CATEGORY_TO_TOPIC_IDS[prog.category] ?? ['talent-education'];
}

export function ecosystemTopicIds(entity: WithTopicIds, categoryName: string): string[] {
  return explicit(entity) ?? ECOSYSTEM_CATEGORY_TO_TOPIC_IDS[categoryName] ?? [];
}

/** Startups inside a vertical: vertical industry topics + startups-investment. */
export function startupTopicIds(s: WithTopicIds, verticalName: string): string[] {
  return explicit(s) ?? uniq([...(STARTUP_VERTICAL_TO_TOPIC_IDS[verticalName] ?? []), 'startups-investment']);
}

/** Unicorns / exits / investors: explicit industry refinements + the
 *  startups-investment umbrella they all live under. */
export function startupEntityTopicIds(record: WithTopicIds): string[] {
  return uniq([...(record.topicIds ?? []), 'startups-investment']);
}

/** Benchmark cases: explicit refinements + the international umbrella —
 *  every case is by construction a cross-country comparison. */
export function benchmarkTopicIds(c: WithTopicIds): string[] {
  return uniq([...(c.topicIds ?? []), 'international']);
}

/** Timeline / people / legal items / posts: explicit only. */
export function explicitTopicIds(record: WithTopicIds): string[] {
  return record.topicIds ?? [];
}
