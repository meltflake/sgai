// Phase 1.6 codemod: read scripts/out/speaker-map.json (from audit-speakers.ts)
// and inject personIds, topicIds, relatedPolicyIds, relatedLeverNumbers,
// relatedTimelineYears, relatedPostSlugs into every record in
// src/data/debates.ts.
//
// The speakers: string[] field is preserved as-is — kept until Phase 4
// when all consumers (debates renderer, /people/[id], graph helpers) are
// reading personIds. ESLint rule (Phase 1.14) flags new debates without
// relatedPolicyIds populated.
//
// Idempotent: running twice doesn't duplicate fields. We detect existing
// "personIds:" and skip records that already have it.
//
// Usage: npx tsx scripts/codemod-debates.ts

import { readFileSync, writeFileSync } from 'node:fs';

const speakerMap: Record<string, string> = JSON.parse(
  readFileSync('scripts/out/speaker-map.json', 'utf-8')
).matched;

const SRC = 'src/data/debates.ts';
let src = readFileSync(SRC, 'utf-8');

// Resolve the literal text inside speakers: [ ... ] to matching personIds.
// Drops anything that does not match — those raws stay in speakers but
// will not have a personId.
function resolveSpeakers(speakersJsonText: string): string[] {
  const ids: string[] = [];
  const re = /['"`]((?:[^'"`\\]|\\.)*)['"`]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(speakersJsonText)) !== null) {
    const raw = m[1].replace(/\\'/g, "'").replace(/\\"/g, '"');
    const id = speakerMap[raw];
    if (id) ids.push(id);
  }
  return ids;
}

function formatPersonIds(ids: string[]): string {
  if (ids.length === 0) return '[]';
  return '[' + ids.map((id) => `'${id}'`).join(', ') + ']';
}

// Bail if file already has personIds — second-pass refresh handled by
// regenerating the audit and rerunning over a clean source. For Phase 1
// we only run this once.
if (src.includes('personIds:')) {
  console.log('codemod-debates: file already has personIds — exiting (idempotent).');
  process.exit(0);
}

// Match every speakers: [...] literal at record level.
const SPEAKERS_RE = /(\n\s*)speakers:\s*\[([\s\S]*?)\]\s*,/g;
let count = 0;

src = src.replace(SPEAKERS_RE, (full, leadingWS, body) => {
  const personIds = resolveSpeakers(body);
  count++;
  const newFields = [
    `${leadingWS}personIds: ${formatPersonIds(personIds)},`,
    `${leadingWS}topicIds: [],`,
    `${leadingWS}relatedPolicyIds: [],`,
    `${leadingWS}relatedLeverNumbers: [],`,
    `${leadingWS}relatedTimelineYears: [],`,
    `${leadingWS}relatedPostSlugs: [],`,
  ].join('');
  return full + newFields;
});

writeFileSync(SRC, src);
console.log(`codemod-debates: injected fields into ${count} records.`);
