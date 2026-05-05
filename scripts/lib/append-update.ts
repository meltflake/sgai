// scripts/lib/append-update.ts
// ────────────────────────────────────────────────────────────────────────
// Shared appender for the cross-site updates feed (src/data/updates.ts).
// Refresh pipelines call this in their emit step, after writing data, so
// each auto-PR also surfaces a one-line "what changed" entry on the site.
//
// USAGE:
//   import { appendUpdate } from '../../lib/append-update';
//   appendUpdate({
//     date: '2026-05-05',
//     type: 'policy',
//     title: '新增 3 条政策档案',
//     titleEn: '3 new policy entries',
//     summary: '本周新增 3 条政策，涉及 MDDI / IMDA。',
//     summaryEn: 'Three new policy entries from MDDI / IMDA.',
//     links: [{ href: '/policies/foo/', label: 'Foo', labelEn: 'Foo' }],
//   });
//
// Inserts the entry at the TOP of the UPDATES array so the freshest item
// is first. Validates i18n pairing post-write (regression delta only) and
// rolls back on regression — same contract as auto-discovered-emit.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { findUnpairedFields } from './i18n-pair.ts';

export type UpdateType =
  | 'policy'
  | 'debate'
  | 'video'
  | 'startup'
  | 'people'
  | 'tracker'
  | 'benchmark'
  | 'ecosystem'
  | 'lever'
  | 'longform'
  | 'site'
  | 'fix';

export interface UpdateLinkInput {
  href: string;
  label: string;
  labelEn: string;
}

export interface UpdateInput {
  date: string;
  type: UpdateType;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  links?: UpdateLinkInput[];
}

const REPO_ROOT = path.resolve(new URL('../../', import.meta.url).pathname);
const DEFAULT_TARGET = path.join(REPO_ROOT, 'src/data/updates.ts');

function escapeQuote(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatLink(link: UpdateLinkInput): string {
  return [
    '      {',
    `        href: '${escapeQuote(link.href)}',`,
    `        label: '${escapeQuote(link.label)}',`,
    `        labelEn: '${escapeQuote(link.labelEn)}',`,
    '      },',
  ].join('\n');
}

function formatEntry(e: UpdateInput): string {
  const lines: string[] = [];
  lines.push('  {');
  lines.push(`    date: '${escapeQuote(e.date)}',`);
  lines.push(`    type: '${e.type}',`);
  lines.push(`    title: '${escapeQuote(e.title)}',`);
  lines.push(`    titleEn: '${escapeQuote(e.titleEn)}',`);
  lines.push(`    summary: '${escapeQuote(e.summary)}',`);
  lines.push(`    summaryEn: '${escapeQuote(e.summaryEn)}',`);
  if (e.links && e.links.length > 0) {
    lines.push('    links: [');
    for (const link of e.links) lines.push(formatLink(link));
    lines.push('    ],');
  }
  lines.push('  },');
  return lines.join('\n');
}

/**
 * Insert a new update at the top of the UPDATES array in updates.ts.
 *
 * Returns the absolute path written and the index inserted (always 0).
 * Throws on file-not-found, regex-miss, or i18n pairing regression.
 */
export function appendUpdate(
  entry: UpdateInput,
  options: { targetFile?: string } = {}
): { file: string; inserted: number } {
  const file = options.targetFile ?? DEFAULT_TARGET;
  if (!existsSync(file)) throw new Error(`updates.ts not found: ${file}`);

  const original = readFileSync(file, 'utf8');
  const formatted = formatEntry(entry);

  // Match `export const UPDATES: Update[] = [` and insert immediately after.
  const openRe = /(export const UPDATES:\s*Update\[\]\s*=\s*\[\n)/;
  if (!openRe.test(original)) {
    throw new Error(`Could not find UPDATES export anchor in ${file}`);
  }
  const updated = original.replace(openRe, `$1${formatted}\n`);

  const baselineCount = findUnpairedFields(file, {
    fields: ['title', 'summary', 'label'],
  }).length;
  writeFileSync(file, updated);

  const issuesAfter = findUnpairedFields(file, {
    fields: ['title', 'summary', 'label'],
  });
  if (issuesAfter.length > baselineCount) {
    writeFileSync(file, original);
    throw new Error(
      `i18n pairing regressed in updates.ts append: ${baselineCount} → ${issuesAfter.length} unpaired. Rolled back.`
    );
  }

  return { file, inserted: 0 };
}
