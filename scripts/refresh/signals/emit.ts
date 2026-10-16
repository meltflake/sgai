// scripts/refresh/signals/emit.ts
// Render Signal records as TS object literals and insert them at the top of
// `signals` in src/data/signals.ts. run.ts runs Prettier on the file after.

import type { Signal } from '../../../src/data/signals.ts';

function q(s: string): string {
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ')}'`;
}

export function renderSignal(s: Signal): string {
  const lines = [
    '  {',
    `    id: ${q(s.id)},`,
    `    date: ${q(s.date)},`,
    `    title: ${q(s.title)},`,
    `    titleEn: ${q(s.titleEn)},`,
    `    titleJa: ${q(s.titleJa)},`,
    `    titleKo: ${q(s.titleKo)},`,
    `    whyItMatters: ${q(s.whyItMatters)},`,
    `    whyItMattersEn: ${q(s.whyItMattersEn)},`,
    `    whyItMattersJa: ${q(s.whyItMattersJa)},`,
    `    whyItMattersKo: ${q(s.whyItMattersKo)},`,
    `    sourceUrl: ${q(s.sourceUrl)},`,
    `    sourceName: ${q(s.sourceName)},`,
    `    topicIds: [${s.topicIds.map(q).join(', ')}],`,
  ];
  if (s.related && s.related.length > 0) {
    lines.push(`    related: [${s.related.map((r) => `{ kind: ${q(r.kind)}, id: ${q(r.id)} }`).join(', ')}],`);
  }
  lines.push(`    addedAt: ${q(s.addedAt)},`, '  },');
  return lines.join('\n') + '\n';
}

const ANCHOR = 'export const signals: Signal[] = [';

export function insertSignals(src: string, records: Signal[]): string {
  const at = src.indexOf(ANCHOR);
  if (at < 0) throw new Error(`insertSignals: anchor "${ANCHOR}" not found`);
  const body = records.map(renderSignal).join('');
  const after = src.slice(at + ANCHOR.length);
  if (after.startsWith('];')) return src.slice(0, at) + ANCHOR + '\n' + body + after;
  return src.slice(0, at) + ANCHOR + '\n' + body + after.replace(/^\n/, '');
}

export function signalId(date: string, eventKey: string, existing: Set<string>): string {
  const slug = eventKey.replace(/[^a-z0-9-]/g, '').slice(0, 40).replace(/-+$/, '') || 'item';
  const base = `sig-${date.replace(/-/g, '')}-${slug}`;
  let id = base;
  for (let n = 2; existing.has(id); n += 1) id = `${base}-${n}`;
  return id;
}
