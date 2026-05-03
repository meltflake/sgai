// scripts/lib/auto-discovered-emit.ts
// ────────────────────────────────────────────────────────────────────────
// Shared appender for "auto-discovered pending review" entries across
// data files where the schema is too varied to inject into the canonical
// arrays. Used by talent / startups / benchmarking / tracker pipelines.
//
// Appends a uniform export to the END of the target .ts file:
//
//   export interface AutoDiscoveredEntry {
//     title: string;
//     titleEn: string;
//     description: string;
//     descriptionEn: string;
//     category: string;
//     confidence: 'high' | 'medium' | 'low';
//     sourceUrl: string;
//     discoveredAt: string;
//     reasonForLowConfidence?: string;
//   }
//   export const autoDiscovered: AutoDiscoveredEntry[] = [ ... ];
//
// On subsequent runs, items are appended to the existing array instead
// of duplicating the export. Pages can import `autoDiscovered` and
// render a "Pending review" section, or ignore it until Luca clears
// items in PR review.
//
// USAGE:
//   import { appendAutoDiscovered, AutoDiscoveredEntry } from '../../lib/auto-discovered-emit';
//   appendAutoDiscovered(targetFile, [{ title: ..., ... }]);

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

import { findUnpairedFields } from './i18n-pair.ts';

export interface AutoDiscoveredEntry {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  sourceUrl: string;
  discoveredAt: string;
  reasonForLowConfidence?: string;
}

const INTERFACE_BLOCK = `\nexport interface AutoDiscoveredEntry {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  sourceUrl: string;
  discoveredAt: string;
  reasonForLowConfidence?: string;
}\n`;

function escapeQuote(s: string): string {
  return s.replace(/'/g, "\\'");
}

function formatEntry(e: AutoDiscoveredEntry): string {
  const lines: string[] = [];
  lines.push('  {');
  lines.push(`    title: '${escapeQuote(e.title)}',`);
  lines.push(`    titleEn: '${escapeQuote(e.titleEn)}',`);
  lines.push(`    description: '${escapeQuote(e.description)}',`);
  lines.push(`    descriptionEn: '${escapeQuote(e.descriptionEn)}',`);
  lines.push(`    category: '${escapeQuote(e.category)}',`);
  lines.push(`    confidence: '${e.confidence}',`);
  lines.push(`    sourceUrl: '${e.sourceUrl}',`);
  lines.push(`    discoveredAt: '${e.discoveredAt}',`);
  if (e.reasonForLowConfidence) {
    lines.push(`    reasonForLowConfidence: '${escapeQuote(e.reasonForLowConfidence)}',`);
  }
  lines.push('  },');
  return lines.join('\n');
}

/**
 * Append entries to (or create) the `autoDiscovered` export. Returns the
 * number of entries actually written. Reads existing export by regex —
 * fast and predictable for the consistent format we own.
 */
export function appendAutoDiscovered(
  filePath: string,
  entries: AutoDiscoveredEntry[]
): { added: number; created: boolean } {
  if (!existsSync(filePath)) throw new Error(`Target file not found: ${filePath}`);
  if (entries.length === 0) return { added: 0, created: false };

  const original = readFileSync(filePath, 'utf8');
  const formatted = entries.map(formatEntry).join('\n');

  let updated: string;
  let created = false;

  // Look for existing array close. Pattern: lines starting with `export const autoDiscovered:`
  // followed eventually by `];` on its own line.
  const exportRe = /export const autoDiscovered:\s*AutoDiscoveredEntry\[\]\s*=\s*\[([\s\S]*?)\n\];/;
  const match = original.match(exportRe);

  if (match) {
    // Insert before the `\n];` that closes the array.
    const arrayBody = match[1];
    const newBody = arrayBody.endsWith('\n') ? `${arrayBody}${formatted}` : `${arrayBody}\n${formatted}`;
    updated = original.replace(exportRe, `export const autoDiscovered: AutoDiscoveredEntry[] = [${newBody}\n];`);
  } else {
    // Append interface + new array at end of file.
    const tail = original.endsWith('\n') ? original : `${original}\n`;
    updated = `${tail}${INTERFACE_BLOCK}\nexport const autoDiscovered: AutoDiscoveredEntry[] = [\n${formatted}\n];\n`;
    created = true;
  }

  writeFileSync(filePath, updated);

  // Validate i18n pairing post-write; rollback on failure.
  const issues = findUnpairedFields(filePath, { fields: ['title', 'description'] });
  if (issues.length > 0) {
    writeFileSync(filePath, original);
    throw new Error(`i18n pairing failed after auto-discovered emit: ${issues.length} unpaired. Rolled back.`);
  }

  return { added: entries.length, created };
}
