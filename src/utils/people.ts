// People-related utilities: id resolution, lookup, normalization.
// Used by the speaker codemod (scripts/audit-speakers.ts), runtime
// renderers that translate personIds → Person, and verify-graph.ts.

// Use `allPeople` (curated 7 + 213 MP stubs) for id resolution so every
// debate speaker can map to a stable Person.id. The /voices page reads
// only the curated `people` export.
import { allPeople, type Person } from '~/data/people';

// Honorifics and prefixes that vary across Hansard records and should be
// stripped before name comparison. Keep the list short and conservative —
// adding entries is cheap; over-stripping would cause false matches.
const HONORIFICS = [
  /^the\s+(prime\s+minister|minister|deputy\s+prime\s+minister|second\s+minister|senior\s+minister)\s+/i,
  /^(mr|mrs|ms|miss|madam|mdm|dr|prof|professor|assoc\.?\s*prof\.?|associate\s+professor|sen\.|senator)\.?\s+/i,
];

/** Lowercase, strip honorifics, collapse whitespace. */
export function normalizeName(raw: string): string {
  let s = String(raw || '').trim();
  for (const re of HONORIFICS) {
    s = s.replace(re, '');
  }
  return s.replace(/\s+/g, ' ').toLowerCase();
}

// Build an internal index once. Maps every known alias / canonical variant
// (lowercase, normalized) to the corresponding Person.id.
let _index: Map<string, string> | null = null;

function getIndex(): Map<string, string> {
  if (_index) return _index;
  const m = new Map<string, string>();
  for (const p of allPeople) {
    const variants = new Set<string>();
    variants.add(p.name);
    variants.add(p.zhName);
    if (p.aliases) for (const a of p.aliases) variants.add(a);
    for (const v of variants) {
      const key = normalizeName(v);
      if (key) m.set(key, p.id);
    }
  }
  _index = m;
  return m;
}

/**
 * Resolve a raw speaker string (possibly with honorifics or apostrophe noise)
 * to a Person.id. Returns null if no confident match — caller decides
 * whether to seed a new Person or drop the reference.
 */
export function findPersonId(raw: string): string | null {
  if (!raw) return null;
  const idx = getIndex();
  return idx.get(normalizeName(raw)) || null;
}

/** O(1) lookup by id across both curated + stub records. */
export function getPerson(id: string): Person | undefined {
  return allPeople.find((p) => p.id === id);
}

/**
 * Display name for a person id, preferring Chinese name when present.
 * Falls back to the raw id (kebab) if the person is unknown — useful for
 * dev-time debugging without crashing the renderer.
 */
export function personDisplayName(id: string): string {
  const p = getPerson(id);
  if (!p) return id;
  return p.zhName || p.name;
}
