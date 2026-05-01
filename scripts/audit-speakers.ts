// Phase 1 audit: scan every speakers[] entry in debates.ts and bucket
// each distinct string into matched / ambiguous / unseen against the
// known people in src/data/people.ts.
//
// Usage:
//   npx tsx scripts/audit-speakers.ts
//
// Output: prints buckets to stdout AND writes scripts/out/speaker-map.json
// for the codemod to consume.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { debates } from '../src/data/debates';
import { allPeople } from '../src/data/people';
import { findPersonId, normalizeName } from '../src/utils/people';

interface AuditResult {
  matched: Record<string, string>; // raw → personId
  unseen: string[]; // distinct raws with no match — caller seeds new Person records
  ambiguous: Record<string, string[]>; // raw → multiple candidate ids (rare; reserved for future)
  stats: { distinctRaws: number; totalOccurrences: number; matchedCount: number; unseenCount: number };
}

function audit(): AuditResult {
  // Frequency map of every distinct raw speaker string.
  const freq = new Map<string, number>();
  for (const d of debates) {
    for (const s of d.speakers || []) {
      const k = String(s).trim();
      if (!k) continue;
      freq.set(k, (freq.get(k) || 0) + 1);
    }
  }

  // Optional: sanity check there's no ambiguity in the seed people index.
  // Two people with the same normalized name would collide; assert here.
  const seen = new Map<string, string>();
  for (const p of allPeople) {
    const allKeys = new Set<string>([p.name, p.zhName, ...(p.aliases || [])].map(normalizeName));
    for (const k of allKeys) {
      if (!k) continue;
      if (seen.has(k) && seen.get(k) !== p.id) {
        // Surface but don't throw — operator can fix in next pass.
        console.warn(`[audit] alias collision: "${k}" → ${seen.get(k)} vs ${p.id}`);
      }
      seen.set(k, p.id);
    }
  }

  const matched: Record<string, string> = {};
  const unseen: string[] = [];
  for (const raw of freq.keys()) {
    const id = findPersonId(raw);
    if (id) matched[raw] = id;
    else unseen.push(raw);
  }

  // Sort unseen by frequency desc — operator wants high-frequency first.
  unseen.sort((a, b) => (freq.get(b) || 0) - (freq.get(a) || 0));

  return {
    matched,
    unseen,
    ambiguous: {},
    stats: {
      distinctRaws: freq.size,
      totalOccurrences: [...freq.values()].reduce((a, b) => a + b, 0),
      matchedCount: Object.keys(matched).length,
      unseenCount: unseen.length,
    },
  };
}

function main() {
  const result = audit();
  const outPath = resolve('scripts/out/speaker-map.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(result, null, 2));

  console.log('=== Speaker audit ===');
  console.log(`Distinct raws: ${result.stats.distinctRaws}`);
  console.log(`Total occurrences: ${result.stats.totalOccurrences}`);
  console.log(`Matched: ${result.stats.matchedCount}`);
  console.log(`Unseen: ${result.stats.unseenCount}`);
  console.log(`\nWritten to ${outPath}\n`);

  if (result.unseen.length > 0) {
    console.log('Unseen speakers (sorted by frequency desc):');
    for (const raw of result.unseen) {
      console.log(`  • ${raw}`);
    }
  }
}

main();
