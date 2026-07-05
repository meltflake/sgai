// Phase 1.14 — knowledge-graph foreign-key verifier. Walks every entity
// in the data layer and asserts that every cross-reference id points to
// a real record. Run as part of CI to catch typos / dangling references.
//
// Usage:
//   npx tsx scripts/verify-graph.ts
//
// Exit code: 0 if clean; 1 if any unresolved references found.
//
// Hooked into npm-run check via package.json (see Phase 1.15).

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { debates } from '../src/data/debates';
import { categories } from '../src/data/policies';
import { levers } from '../src/data/levers';
import { timelineEvents } from '../src/data/timeline';
import { allPeople } from '../src/data/people';
import { ecosystemCategories } from '../src/data/ecosystem';
import { videos } from '../src/data/videos';
import { dimensions } from '../src/data/tracker';
import { programmes as talentProgrammes } from '../src/data/talent';
import { sections as legalSections } from '../src/data/legal-ai';
import { benchmarkCases } from '../src/data/benchmarking';
import { unicorns, verticals, exits, investors } from '../src/data/startups';
import { topics, topicIdSet } from '../src/data/topics';
import {
  DEBATE_TOPIC_TO_TOPIC_IDS,
  VIDEO_TOPIC_TO_TOPIC_IDS,
  POLICY_CATEGORY_TO_TOPIC_IDS,
  TRACKER_DIMENSION_TO_TOPIC_IDS,
  LEVER_NUMBER_TO_TOPIC_IDS,
  TALENT_CATEGORY_TO_TOPIC_IDS,
  ECOSYSTEM_CATEGORY_TO_TOPIC_IDS,
  STARTUP_VERTICAL_TO_TOPIC_IDS,
  debateTopicIds,
  videoTopicIds,
  policyTopicIds,
  trackerTopicIds,
  leverTopicIds,
  talentTopicIds,
  ecosystemTopicIds,
  startupTopicIds,
  startupEntityTopicIds,
  benchmarkTopicIds,
  explicitTopicIds,
} from '../src/data/topic-mappings';

const errors: string[] = [];

const personIds = new Set(allPeople.map((p) => p.id));
const debateIds = new Set(debates.map((d) => d.id));
const policyIds = new Set<string>();
for (const c of categories) for (const p of c.policies) if (p.id) policyIds.add(p.id);
const leverNumbers = new Set(levers.map((lv) => lv.number));
const timelineYears = new Set(timelineEvents.map((e) => e.year));

function check(label: string, ids: (string | number)[] | undefined, valid: Set<string | number>) {
  if (!ids) return;
  for (const id of ids) {
    if (!valid.has(id)) {
      errors.push(`${label}: unresolved reference "${id}"`);
    }
  }
}

// ── debates.ts ───────────────────────────────────────────────────────────
for (const d of debates) {
  if (!d.id) errors.push(`debate (no id): missing id`);
  check(`debate[${d.id}].personIds`, d.personIds, personIds as Set<string | number>);
  check(`debate[${d.id}].relatedPolicyIds`, d.relatedPolicyIds, policyIds as Set<string | number>);
  check(`debate[${d.id}].relatedLeverNumbers`, d.relatedLeverNumbers, leverNumbers as Set<string | number>);
  check(`debate[${d.id}].relatedTimelineYears`, d.relatedTimelineYears, timelineYears as Set<string | number>);
}

// ── policies.ts ──────────────────────────────────────────────────────────
for (const c of categories) {
  for (const p of c.policies) {
    if (!p.id) errors.push(`policy in "${c.name}": missing id`);
    check(`policy[${p.id}].authorPersonIds`, p.authorPersonIds, personIds as Set<string | number>);
    check(`policy[${p.id}].relatedDebateIds`, p.relatedDebateIds, debateIds as Set<string | number>);
    check(`policy[${p.id}].relatedLeverNumbers`, p.relatedLeverNumbers, leverNumbers as Set<string | number>);
    check(`policy[${p.id}].relatedTimelineYears`, p.relatedTimelineYears, timelineYears as Set<string | number>);
  }
}

// ── levers.ts ────────────────────────────────────────────────────────────
for (const lv of levers) {
  check(`lever[${lv.number}].championPersonIds`, lv.championPersonIds, personIds as Set<string | number>);
  check(`lever[${lv.number}].relatedPolicyIds`, lv.relatedPolicyIds, policyIds as Set<string | number>);
  for (const g of lv.groups) {
    for (const it of g.items) {
      if (!it.id) errors.push(`leverItem in lever ${lv.number} / group "${g.title}": missing id`);
      check(`leverItem[${it.id}].relatedPolicyIds`, it.relatedPolicyIds, policyIds as Set<string | number>);
      check(`leverItem[${it.id}].relatedDebateIds`, it.relatedDebateIds, debateIds as Set<string | number>);
    }
  }
}

// ── timeline.ts ──────────────────────────────────────────────────────────
for (const e of timelineEvents) {
  if (!e.id) errors.push(`timeline event year=${e.year}: missing id`);
  check(`timeline[${e.id}].personIds`, e.personIds, personIds as Set<string | number>);
  check(`timeline[${e.id}].relatedPolicyIds`, e.relatedPolicyIds, policyIds as Set<string | number>);
  check(`timeline[${e.id}].relatedDebateIds`, e.relatedDebateIds, debateIds as Set<string | number>);
}

// ── ecosystem.ts ─────────────────────────────────────────────────────────
const ecosystemIds = new Set<string>();
for (const c of ecosystemCategories) for (const e of c.entities) if (e.id) ecosystemIds.add(e.id);
for (const c of ecosystemCategories) {
  for (const e of c.entities) {
    const label = `ecosystem[${e.id ?? e.name}]`;
    check(`${label}.relatedPolicyIds`, e.relatedPolicyIds, policyIds as Set<string | number>);
    check(`${label}.relatedDebateIds`, e.relatedDebateIds, debateIds as Set<string | number>);
    check(`${label}.relatedLeverNumbers`, e.relatedLeverNumbers, leverNumbers as Set<string | number>);
    check(`${label}.relatedEntityIds`, e.relatedEntityIds, ecosystemIds as Set<string | number>);
    check(`${label}.championPersonIds`, e.championPersonIds, personIds as Set<string | number>);
    if (e.parentEntityId) check(`${label}.parentEntityId`, [e.parentEntityId], ecosystemIds as Set<string | number>);
  }
}

// ── Topic taxonomy (src/data/topics.ts + topic-mappings.ts) ─────────────
//
// Two gates:
//   1. VALIDITY — every explicit `topicIds` value on any record, and every
//      value inside the mapping tables, must exist in the vocabulary.
//   2. COVERAGE — hard domains (everything a /topics/ hub aggregates from
//      an enum or a completed hand-label pass) must resolve to ≥1 topic
//      per record. people stays validity-only (soft domain).

function checkTopicIds(label: string, ids: string[] | undefined) {
  if (!ids) return;
  for (const id of ids) {
    if (!topicIdSet.has(id)) errors.push(`${label}.topicIds: unknown topic "${id}"`);
  }
}

function requireCoverage(label: string, resolved: string[]) {
  checkTopicIds(label, resolved);
  if (resolved.length === 0) errors.push(`${label}: resolves to zero topics (coverage gate)`);
}

// Mapping tables: all values must be real topic ids.
for (const [table, name] of [
  [DEBATE_TOPIC_TO_TOPIC_IDS, 'DEBATE_TOPIC_TO_TOPIC_IDS'],
  [VIDEO_TOPIC_TO_TOPIC_IDS, 'VIDEO_TOPIC_TO_TOPIC_IDS'],
  [POLICY_CATEGORY_TO_TOPIC_IDS, 'POLICY_CATEGORY_TO_TOPIC_IDS'],
  [TRACKER_DIMENSION_TO_TOPIC_IDS, 'TRACKER_DIMENSION_TO_TOPIC_IDS'],
  [TALENT_CATEGORY_TO_TOPIC_IDS, 'TALENT_CATEGORY_TO_TOPIC_IDS'],
  [ECOSYSTEM_CATEGORY_TO_TOPIC_IDS, 'ECOSYSTEM_CATEGORY_TO_TOPIC_IDS'],
  [STARTUP_VERTICAL_TO_TOPIC_IDS, 'STARTUP_VERTICAL_TO_TOPIC_IDS'],
] as const) {
  for (const [key, ids] of Object.entries(table)) checkTopicIds(`${name}["${key}"]`, ids);
}
for (const [num, ids] of Object.entries(LEVER_NUMBER_TO_TOPIC_IDS)) {
  checkTopicIds(`LEVER_NUMBER_TO_TOPIC_IDS[${num}]`, ids);
}

// Enum completeness: a new enum value without a mapping breaks derivation
// silently — fail loudly instead.
for (const d of debates) {
  for (const tp of d.topics) {
    if (!DEBATE_TOPIC_TO_TOPIC_IDS[tp]) errors.push(`debate[${d.id}]: topics value "${tp}" has no topic mapping`);
  }
}
for (const v of videos) {
  if (!VIDEO_TOPIC_TO_TOPIC_IDS[v.topic]) errors.push(`video[${v.id}]: topic "${v.topic}" has no topic mapping`);
}

// Coverage per domain (explicit override ?? derived).
for (const d of debates) requireCoverage(`debate[${d.id}]`, debateTopicIds(d));
for (const v of videos) requireCoverage(`video[${v.id}]`, videoTopicIds(v));
for (const c of categories) {
  for (const p of c.policies) requireCoverage(`policy[${p.id}]`, policyTopicIds(p, c.name));
}
for (const dim of dimensions) requireCoverage(`tracker[${dim.id}]`, trackerTopicIds(dim));
for (const lv of levers) requireCoverage(`lever[${lv.number}]`, leverTopicIds(lv));
for (const prog of talentProgrammes) requireCoverage(`talent[${prog.id}]`, talentTopicIds(prog));
for (const sec of legalSections) {
  for (const item of sec.items) requireCoverage(`legal["${item.title}"]`, explicitTopicIds(item));
}
for (const bc of benchmarkCases) requireCoverage(`benchmark[${bc.id}]`, benchmarkTopicIds(bc));
for (const e of timelineEvents) requireCoverage(`timeline[${e.id ?? e.year}]`, explicitTopicIds(e));
for (const c of ecosystemCategories) {
  for (const e of c.entities) {
    if (e._pendingReview) continue; // promoted entries get labeled then
    requireCoverage(`ecosystem[${e.id ?? e.name}]`, ecosystemTopicIds(e, c.name));
  }
}
for (const u of unicorns) requireCoverage(`unicorn[${u.name}]`, startupEntityTopicIds(u));
for (const v of verticals) {
  for (const s of v.startups) requireCoverage(`startup[${s.name}]`, startupTopicIds(s, v.name));
}
for (const x of exits) requireCoverage(`exit[${x.name}]`, startupEntityTopicIds(x));
for (const inv of investors) requireCoverage(`investor[${inv.name}]`, startupEntityTopicIds(inv));

// people: validity only (soft domain — unlabeled people simply don't show
// in topic hubs).
for (const p of allPeople) checkTopicIds(`person[${p.id}]`, p.topicIds);

// zh blog posts: frontmatter topicIds required (7 posts, hand-labeled).
// Translated mirrors under post/<lang>/ derive from the zh source at hub
// level, so only top-level .md files are gated.
const postDir = 'src/data/post';
for (const f of readdirSync(postDir)) {
  if (!f.endsWith('.md')) continue;
  const raw = readFileSync(join(postDir, f), 'utf8');
  const fm = raw.split('---')[1] ?? '';
  const m = fm.match(/^topicIds: \[(.*)\]$/m);
  if (!m) {
    errors.push(`post[${f}]: missing topicIds in frontmatter (coverage gate)`);
    continue;
  }
  const ids = m[1]
    .split(',')
    .map((s) => s.trim().replace(/^'|'$/g, ''))
    .filter(Boolean);
  requireCoverage(`post[${f}]`, ids);
}

// Vocabulary sanity: warn (not fail) on topics no content resolves to —
// an empty hub page is a product smell, not a data corruption.
{
  const used = new Set<string>();
  const collect = (ids: string[]) => ids.forEach((i) => used.add(i));
  debates.forEach((d) => collect(debateTopicIds(d)));
  videos.forEach((v) => collect(videoTopicIds(v)));
  for (const c of categories) c.policies.forEach((p) => collect(policyTopicIds(p, c.name)));
  dimensions.forEach((d) => collect(trackerTopicIds(d)));
  levers.forEach((lv) => collect(leverTopicIds(lv)));
  talentProgrammes.forEach((p) => collect(talentTopicIds(p)));
  for (const sec of legalSections) sec.items.forEach((i) => collect(explicitTopicIds(i)));
  benchmarkCases.forEach((b) => collect(benchmarkTopicIds(b)));
  timelineEvents.forEach((e) => collect(explicitTopicIds(e)));
  for (const c of ecosystemCategories) c.entities.forEach((e) => collect(ecosystemTopicIds(e, c.name)));
  unicorns.forEach((u) => collect(startupEntityTopicIds(u)));
  for (const v of verticals) v.startups.forEach((s) => collect(startupTopicIds(s, v.name)));
  allPeople.forEach((p) => collect(p.topicIds ?? []));
  const unused = topics.filter((tp) => !used.has(tp.id));
  if (unused.length > 0) {
    console.warn(`⚠ topics with no resolved content: ${unused.map((tp) => tp.id).join(', ')}`);
  }
}

// ── Report ───────────────────────────────────────────────────────────────
const stats = {
  people: personIds.size,
  debates: debateIds.size,
  policies: policyIds.size,
  leverNumbers: leverNumbers.size,
  timelineYears: timelineYears.size,
  ecosystemEntities: ecosystemIds.size,
  topics: topics.length,
};

console.log('=== verify-graph ===');
console.log(stats);

if (errors.length > 0) {
  console.error(`\n❌ ${errors.length} unresolved reference(s):`);
  for (const e of errors.slice(0, 50)) console.error(`  ${e}`);
  if (errors.length > 50) console.error(`  ... and ${errors.length - 50} more`);
  process.exit(1);
}

console.log('\n✓ all foreign keys resolve.');
