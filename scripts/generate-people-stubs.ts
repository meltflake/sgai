// Phase 1: read scripts/out/speaker-map.json (from audit-speakers.ts) and
// emit TypeScript Person stubs for every "unseen" raw that looks like an
// actual person (not a role-title placeholder like "Minister for Defence").
//
// Stubs include placeholders for fields the operator will hand-fill over
// time (zhName, zhTitle, summary). The point of the stub: every speaker
// string in debates.ts can resolve to a stable Person.id via findPersonId.
//
// Usage:
//   npx tsx scripts/generate-people-stubs.ts > scripts/out/people-stubs.ts
//
// Then visually inspect, then merge into src/data/people.ts.

import { readFileSync } from 'node:fs';

interface AuditOutput {
  matched: Record<string, string>;
  unseen: string[];
  ambiguous: Record<string, string[]>;
}

// Patterns that mark a raw string as a role/title rather than a person.
// These should be left in `speakersRaw` and skipped from personIds.
const ROLE_PATTERNS = [
  /^Minister for /i,
  /^Senior Minister of State /i,
  /^Senior Minister for /i,
  /^Senior Minister$/i,
  /^Minister of State for /i,
  /^Deputy Prime Minister$/i,
  /^Deputy Prime Minister for /i,
  /^Second Minister for /i,
  /^Acting Minister for /i,
  /^The Prime Minister$/i,
  /^The President$/i,
  /^The Speaker$/i,
];

function isRole(raw: string): boolean {
  return ROLE_PATTERNS.some((re) => re.test(raw.trim()));
}

// Strip honorifics (mirrors src/utils/people.ts but keeps original casing).
const HONORIFIC_PATTERNS = [
  /^(Mr|Mrs|Ms|Miss|Madam|Mdm|Dr|Prof|Professor|Assoc\.?\s*Prof\.?|Associate Professor|Sen\.?|Senator)\.?\s+/i,
];

function stripHonorific(s: string): string {
  let out = s.trim();
  for (const re of HONORIFIC_PATTERNS) out = out.replace(re, '');
  return out.trim();
}

function toKebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeTs(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function main() {
  const audit: AuditOutput = JSON.parse(readFileSync('scripts/out/speaker-map.json', 'utf8'));
  const stubs: string[] = [];
  const seenIds = new Set<string>();

  for (const raw of audit.unseen) {
    if (isRole(raw)) continue; // skip role-title strings — left in speakersRaw

    const stripped = stripHonorific(raw);
    let id = toKebab(stripped);

    // Disambiguate accidental id collisions across batch.
    let suffix = 2;
    while (seenIds.has(id)) {
      id = `${toKebab(stripped)}-${suffix++}`;
    }
    seenIds.add(id);

    // The original raw (with honorific) goes into aliases for fuzzy lookup.
    const aliases =
      stripped !== raw
        ? `aliases: ['${escapeTs(raw)}'],
    `
        : '';

    stubs.push(
      `  {
    id: '${id}',
    name: '${escapeTs(stripped)}',
    zhName: '',
    ${aliases}title: '',
    zhTitle: '',
    category: 'government',
    roles: ['mp'],
    affiliations: ['Other'],
    party: null,
    summary: '[需补充] ${escapeTs(stripped)}',
    channels: [],
  }`
    );
  }

  console.log(`// Auto-generated from scripts/out/speaker-map.json`);
  console.log(`// ${stubs.length} stub Person records — hand-curate fields over time.`);
  console.log(`// Skipped role-title strings (e.g. "Minister for Defence") — those`);
  console.log(`// stay in debates.ts speakersRaw without resolving to a Person.`);
  console.log('');
  console.log(stubs.join(',\n'));
  console.log(',');
}

main();
