// scripts/refresh/signals/related.ts
// Deterministic links from a signal to on-site entity pages. Conservative on
// purpose: a wrong link renders on five locales. Multi-word names may match
// in the headline or the first 400 characters of the body; single-word names
// ("Grab", "Near", "NVIDIA") must appear in the headline. Case-sensitive,
// whole words only, at most 3 links, index order wins.

import type { SignalRelated, SignalRelatedKind } from '../../../src/data/signals.ts';

export type RelatedIndex = Array<{ kind: SignalRelatedKind; id: string; name: string }>;

const LEAD_CHARS = 400;
const MAX_RELATED = 3;

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function contains(text: string, name: string): boolean {
  return new RegExp(`(^|[^A-Za-z0-9])${escapeRe(name)}([^A-Za-z0-9]|$)`).test(text);
}

export function findRelated(title: string, body: string, index: RelatedIndex): SignalRelated[] {
  const lead = `${title}\n${body.slice(0, LEAD_CHARS)}`;
  const out: SignalRelated[] = [];
  const seen = new Set<string>();
  for (const e of index) {
    const name = e.name.trim();
    if (!name) continue;
    const multiWord = /\s/.test(name);
    if (!contains(multiWord ? lead : title, name)) continue;
    const key = `${e.kind}:${e.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ kind: e.kind, id: e.id });
    if (out.length === MAX_RELATED) break;
  }
  return out;
}
