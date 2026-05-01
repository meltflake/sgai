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

import { debates } from '../src/data/debates';
import { categories } from '../src/data/policies';
import { levers } from '../src/data/levers';
import { timelineEvents } from '../src/data/timeline';
import { allPeople } from '../src/data/people';

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

// ── Report ───────────────────────────────────────────────────────────────
const stats = {
  people: personIds.size,
  debates: debateIds.size,
  policies: policyIds.size,
  leverNumbers: leverNumbers.size,
  timelineYears: timelineYears.size,
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
