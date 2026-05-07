// scripts/refresh/ecosystem/emit.ts
// ────────────────────────────────────────────────────────────────────────
// Append enriched ecosystem entries to src/data/ecosystem.ts.
//
// Auto-added entries always carry `_pendingReview: true` so listing pages
// can hide them until Luca clears the flag (single keystroke in PR review).

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { findUnpairedFields } from '../../lib/i18n-pair.ts';
import type { EnrichedEntity } from './enrich.ts';

export interface EcosystemEmitResult {
  filePath: string;
  recordsAdded: number;
  perCategory: Record<string, number>;
  skipped: Array<{ id: string; reason: string }>;
}

const ECOSYSTEM_FILE = resolve('src/data/ecosystem.ts');

function escapeQuote(s: string): string {
  return s.replace(/'/g, "\\'");
}

function formatEntity(e: EnrichedEntity): string {
  const s = e.summary;
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  lines.push('      {');
  lines.push(`        id: '${e.id}',`);
  lines.push(`        name: '${escapeQuote(s.title)}',`);
  lines.push(`        nameEn: '${escapeQuote(s.titleEn)}',`);
  if (s.titleJa) lines.push(`        nameJa: '${escapeQuote(s.titleJa)}',`);
  lines.push(`        description: '${escapeQuote(s.description)}',`);
  lines.push(`        descriptionEn:`);
  lines.push(`          '${escapeQuote(s.descriptionEn)}',`);
  if (s.descriptionJa) {
    lines.push(`        descriptionJa:`);
    lines.push(`          '${escapeQuote(s.descriptionJa)}',`);
  }
  lines.push(`        url: '${e.candidate.sourceUrl}',`);
  lines.push(`        entityType: '${e.candidate.defaultEntityType}',`);
  lines.push(`        status: 'active',`);
  if (s.publishedDate) lines.push(`        founded: '${s.publishedDate.slice(0, 7)}',`);
  lines.push('        sources: [');
  lines.push('          {');
  lines.push(`            label: '${escapeQuote(e.candidate.label)}',`);
  lines.push(`            url: '${e.candidate.sourceUrl}',`);
  lines.push(`            date: '${(s.publishedDate || today).slice(0, 10)}',`);
  lines.push('          },');
  lines.push('        ],');
  lines.push(`        updated: '${today}',`);
  lines.push('        _pendingReview: true,');
  lines.push(
    `        discoveryNote: 'Auto-discovered via ${e.candidate.label}; confidence=${s.confidence}${s.reasonForLowConfidence ? `; ${escapeQuote(s.reasonForLowConfidence)}` : ''}',`
  );
  lines.push('      },');
  return lines.join('\n');
}

function findCategoryArrayCloseLine(lines: string[], categoryName: string): number {
  const openRe = new RegExp(`name:\\s*['"]${categoryName}['"]`);
  let openLine = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (openRe.test(lines[i])) {
      openLine = i;
      break;
    }
  }
  if (openLine === -1) throw new Error(`Category "${categoryName}" not found in ecosystem.ts`);

  let entitiesOpen = -1;
  for (let i = openLine; i < lines.length; i += 1) {
    if (/^\s*entities:\s*\[/.test(lines[i])) {
      entitiesOpen = i;
      break;
    }
  }
  if (entitiesOpen === -1) throw new Error(`No entities: [ found after ${categoryName}`);

  let depth = 0;
  for (let i = entitiesOpen; i < lines.length; i += 1) {
    const opens = (lines[i].match(/\[/g) || []).length;
    const closes = (lines[i].match(/\]/g) || []).length;
    depth += opens;
    depth -= closes;
    if (depth === 0 && i > entitiesOpen) return i;
  }
  throw new Error(`Could not find closing ] for ${categoryName}`);
}

export function emit(
  enriched: EnrichedEntity[],
  options: { filePath?: string; dryRun?: boolean } = {}
): EcosystemEmitResult {
  const filePath = options.filePath || ECOSYSTEM_FILE;
  if (!existsSync(filePath)) throw new Error(`Target not found: ${filePath}`);

  const accepted: EnrichedEntity[] = [];
  const skipped: EcosystemEmitResult['skipped'] = [];
  for (const e of enriched) {
    if (!e.candidate.sourceUrl || !/^https?:\/\//.test(e.candidate.sourceUrl)) {
      skipped.push({ id: e.id, reason: 'missing sourceUrl' });
      continue;
    }
    if (!e.summary.titleEn || !e.summary.title) {
      skipped.push({ id: e.id, reason: 'empty title' });
      continue;
    }
    if (!e.summary.descriptionEn || !e.summary.description) {
      skipped.push({ id: e.id, reason: 'empty description' });
      continue;
    }
    accepted.push(e);
  }

  if (accepted.length === 0) {
    return { filePath, recordsAdded: 0, perCategory: {}, skipped };
  }

  const byCategory = new Map<string, EnrichedEntity[]>();
  for (const e of accepted) {
    const cat = e.summary.category;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(e);
  }

  const original = readFileSync(filePath, 'utf8');
  let lines = original.split('\n');

  const orderedCats = Array.from(byCategory.keys()).sort(
    (a, b) => findCategoryArrayCloseLine(lines, b) - findCategoryArrayCloseLine(lines, a)
  );
  const perCategory: Record<string, number> = {};
  for (const cat of orderedCats) {
    const closeLine = findCategoryArrayCloseLine(lines, cat);
    const records = byCategory.get(cat)!;
    const formatted = records.map((r) => formatEntity(r)).join('\n');
    lines = [...lines.slice(0, closeLine), formatted, ...lines.slice(closeLine)];
    perCategory[cat] = (perCategory[cat] || 0) + records.length;
  }

  if (!options.dryRun) {
    const baselineCount = findUnpairedFields(filePath, { fields: ['name', 'description', 'title'] }).length;
    writeFileSync(filePath, lines.join('\n'));
    const issuesAfter = findUnpairedFields(filePath, { fields: ['name', 'description', 'title'] });
    if (issuesAfter.length > baselineCount) {
      writeFileSync(filePath, original);
      throw new Error(
        `i18n pairing regressed: ${baselineCount} → ${issuesAfter.length} unpaired. Rolled back.`
      );
    }
  }

  return { filePath, recordsAdded: accepted.length, perCategory, skipped };
}
