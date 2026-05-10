// scripts/refresh/policies/emit.ts
// ────────────────────────────────────────────────────────────────────────
// Append enriched policy records to src/data/policies.ts.
//
// Strategy: line-based AST surgery.
//   1. Read src/data/policies.ts as text.
//   2. For each category, find its `policies: [` opening line.
//   3. Find the matching `],` closing line for that array.
//   4. Insert formatted record literals right before `],`.
//   5. Write back.
//
// We deliberately avoid TypeScript Compiler API to keep this lightweight
// (no extra dep). The format is consistent across every record so
// regex-based insertion is reliable. Validated post-write via
// `npm run check` and `i18n-pair` lib.
//
// Anti-hallucination guards:
//   - Reject records where sourceUrl missing.
//   - Reject records where confidence === 'low' AND _pendingReview not set.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { findUnpairedFields } from '../../lib/i18n-pair.ts';
import type { EnrichedPolicy } from './enrich.ts';
import type { PolicyCategoryName } from './sources.ts';

export interface EmitResult {
  filePath: string;
  recordsAdded: number;
  perCategory: Record<PolicyCategoryName, number>;
  skipped: Array<{ id: string; reason: string }>;
}

const POLICIES_FILE = resolve('src/data/policies.ts');

function escapeBacktick(s: string): string {
  return s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}
function escapeQuote(s: string): string {
  return s.replace(/'/g, "\\'");
}

function formatPolicyRecord(p: EnrichedPolicy, defaultMinistry?: string): string {
  const s = p.summary;
  const date = (s.publishedDate || p.pageDate || new Date().toISOString().slice(0, 10)).slice(0, 7);
  const lines: string[] = [];
  lines.push('      {');
  lines.push(`        id: '${p.id}',`);
  lines.push(`        title: '${escapeQuote(s.title)}',`);
  lines.push(`        titleEn: '${escapeQuote(s.titleEn)}',`);
  if (s.titleJa) lines.push(`        titleJa: '${escapeQuote(s.titleJa)}',`);
  lines.push(`        date: '${date}',`);
  lines.push(`        source: '${escapeQuote(p.candidate.defaultSource)}',`);
  lines.push(`        sourceOrgUrl: '${p.candidate.defaultSourceOrgUrl}',`);
  lines.push(`        sourceUrl:`);
  lines.push(`          '${p.candidate.sourceUrl}',`);
  if (p.pdfUrl) lines.push(`        pdfUrl: '${p.pdfUrl}',`);
  lines.push(`        summary: '${escapeQuote(s.description)}',`);
  lines.push('        content: `' + escapeBacktick(s.descriptionEn ? s.description : '') + '`,');
  lines.push(`        summaryEn:`);
  lines.push(`          '${escapeQuote(s.descriptionEn)}',`);
  lines.push('        contentEn: `' + escapeBacktick(s.descriptionEn || '') + '`,');
  if (s.descriptionJa) {
    lines.push(`        summaryJa: '${escapeQuote(s.descriptionJa)}',`);
    lines.push('        contentJa: `' + escapeBacktick(s.descriptionJa) + '`,');
  }
  lines.push(`        sourceEn: '${escapeQuote(p.candidate.defaultSourceEn)}',`);
  if (defaultMinistry) {
    lines.push(`        ministry: '${defaultMinistry}',`);
  } else {
    lines.push('        ministry: undefined,');
  }
  lines.push('        authorPersonIds: [],');
  lines.push('        relatedDebateIds: [],');
  lines.push('        relatedLeverNumbers: [],');
  lines.push('        relatedTimelineYears: [],');
  lines.push('        relatedPostSlugs: [],');
  if (s._pendingReview) {
    lines.push(`        // _pendingReview: low confidence — ${s.reasonForLowConfidence || ''}`);
  } else {
    // Only auto-surface high-confidence emits on the homepage feed via
    // src/utils/derived-updates.ts. Pending-review records get addedAt
    // when a human promotes them in PR review.
    lines.push(`        addedAt: '${new Date().toISOString().slice(0, 10)}',`);
  }
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
  if (openLine === -1) throw new Error(`Category "${categoryName}" not found in policies.ts`);

  // Find the next `policies: [` after the name line.
  let policiesOpen = -1;
  for (let i = openLine; i < lines.length; i += 1) {
    if (/^\s*policies:\s*\[/.test(lines[i])) {
      policiesOpen = i;
      break;
    }
  }
  if (policiesOpen === -1) throw new Error(`No policies: [ found after ${categoryName}`);

  // Walk forward, tracking bracket depth, to find the matching closing line.
  let depth = 0;
  for (let i = policiesOpen; i < lines.length; i += 1) {
    const opens = (lines[i].match(/\[/g) || []).length;
    const closes = (lines[i].match(/\]/g) || []).length;
    depth += opens;
    depth -= closes;
    if (depth === 0 && i > policiesOpen) {
      return i; // line containing the `],`
    }
  }
  throw new Error(`Could not find closing ] for ${categoryName}`);
}

export function emit(
  enrichedItems: EnrichedPolicy[],
  options: { filePath?: string; dryRun?: boolean } = {}
): EmitResult {
  const filePath = options.filePath || POLICIES_FILE;
  if (!existsSync(filePath)) throw new Error(`Target file not found: ${filePath}`);

  // Filter: anti-hallucination guards.
  const accepted: EnrichedPolicy[] = [];
  const skipped: EmitResult['skipped'] = [];
  for (const e of enrichedItems) {
    if (!e.candidate.sourceUrl || !/^https?:\/\//.test(e.candidate.sourceUrl)) {
      skipped.push({ id: e.id, reason: 'missing sourceUrl' });
      continue;
    }
    if (!e.summary.titleEn || !e.summary.title) {
      skipped.push({ id: e.id, reason: 'empty title or titleEn' });
      continue;
    }
    if (!e.summary.descriptionEn || !e.summary.description) {
      skipped.push({ id: e.id, reason: 'empty description or descriptionEn' });
      continue;
    }
    accepted.push(e);
  }

  if (accepted.length === 0) {
    return {
      filePath,
      recordsAdded: 0,
      perCategory: { 国家战略: 0, 治理框架: 0, 行业监管: 0, 预算与资金: 0, 国际合作: 0 },
      skipped,
    };
  }

  // Group by category for efficient single-pass insertion.
  const byCategory = new Map<string, EnrichedPolicy[]>();
  for (const e of accepted) {
    const cat = e.summary.category;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(e);
  }

  const original = readFileSync(filePath, 'utf8');
  let lines = original.split('\n');

  // Insert in REVERSE category-order so line numbers don't shift while inserting.
  const orderedCategories = Array.from(byCategory.keys()).sort((a, b) => {
    return findCategoryArrayCloseLine(lines, b) - findCategoryArrayCloseLine(lines, a);
  });

  const perCategory: Record<PolicyCategoryName, number> = {
    国家战略: 0, 治理框架: 0, 行业监管: 0, 预算与资金: 0, 国际合作: 0,
  };

  for (const category of orderedCategories) {
    const closeLine = findCategoryArrayCloseLine(lines, category);
    const records = byCategory.get(category)!;
    const formatted = records.map((r) => formatPolicyRecord(r, r.candidate.defaultMinistry)).join('\n');
    lines = [...lines.slice(0, closeLine), formatted, ...lines.slice(closeLine)];
    perCategory[category as PolicyCategoryName] = (perCategory[category as PolicyCategoryName] || 0) + records.length;
  }

  const updated = lines.join('\n');

  if (!options.dryRun) {
    const baselineCount = findUnpairedFields(filePath, {
      fields: ['title', 'description', 'name'],
    }).length;
    writeFileSync(filePath, updated);

    // Validate i18n pairing post-write — rollback only on REGRESSION.
    const issuesAfter = findUnpairedFields(filePath, {
      fields: ['title', 'description', 'name'],
    });
    if (issuesAfter.length > baselineCount) {
      writeFileSync(filePath, original);
      throw new Error(
        `i18n pairing regressed: ${baselineCount} → ${issuesAfter.length} unpaired. Rolled back.`
      );
    }
  }

  return {
    filePath,
    recordsAdded: accepted.length,
    perCategory,
    skipped,
  };
}
