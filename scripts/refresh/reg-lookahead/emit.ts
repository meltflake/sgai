// scripts/refresh/reg-lookahead/emit.ts
// ────────────────────────────────────────────────────────────────────────
// Text surgery on src/data/reg-lookahead.ts. Two operations:
//   - appendRecord: insert a formatted literal at the head of the
//     consultations/bills array (handles the prettier empty one-liner
//     `= [];` form — the PR #170 lesson).
//   - updateRecordFields: IN-PLACE field replacement + history append on
//     an existing record located by id. The data file is the lifecycle
//     diff baseline; git diffs of these edits ARE the review surface.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { formatWithPrettier } from '../../lib/prettier-format.ts';
import { findUnpairedFields } from '../../lib/i18n-pair.ts';

const TARGET = resolve('src/data/reg-lookahead.ts');

export type ArrayName = 'consultations' | 'bills';

const ARRAY_DECL: Record<ArrayName, string> = {
  consultations: 'export const consultations: ConsultationItem[] = [',
  bills: 'export const bills: BillItem[] = [',
};

export function appendRecord(array: ArrayName, formattedRecord: string): void {
  const original = readFileSync(TARGET, 'utf8');
  const decl = ARRAY_DECL[array];
  const emptyForm = `${decl}];`;
  let updated: string;
  if (original.includes(emptyForm)) {
    updated = original.replace(emptyForm, `${decl}\n${formattedRecord}\n];`);
  } else if (original.includes(`${decl}\n`)) {
    updated = original.replace(`${decl}\n`, `${decl}\n${formattedRecord}\n`);
  } else {
    throw new Error(`${array} array not found in reg-lookahead.ts`);
  }
  writeGuarded(original, updated);
}

/** Locate the record block `{ ... id: '<id>' ... }` inside the file and
 *  apply per-field replacements + history append. Field values must be
 *  plain scalars (strings in single quotes / undefined-able). */
export function updateRecordFields(
  id: string,
  fields: Record<string, string>,
  historyField: 'statusHistory' | 'stageHistory',
  historyEntry: string
): void {
  const original = readFileSync(TARGET, 'utf8');
  const idAnchor = `id: '${id}',`;
  const idAt = original.indexOf(idAnchor);
  if (idAt === -1) throw new Error(`record id '${id}' not found`);
  const blockStart = original.lastIndexOf('\n  {', idAt);
  const blockEnd = original.indexOf('\n  },', idAt);
  if (blockStart === -1 || blockEnd === -1) throw new Error(`record block for '${id}' not delimited`);
  let block = original.slice(blockStart, blockEnd + 5);

  for (const [field, valueLiteral] of Object.entries(fields)) {
    const fieldRe = new RegExp(`(\\n\\s*)${field}: [^\\n]*`, '');
    if (fieldRe.test(block)) {
      block = block.replace(fieldRe, `$1${field}: ${valueLiteral},`);
    } else {
      // Insert the new field right after the id line.
      block = block.replace(idAnchor, `${idAnchor}\n    ${field}: ${valueLiteral},`);
    }
  }

  // Append to history array: `statusHistory: [ ... ],` — insert before its
  // closing bracket.
  const histRe = new RegExp(`(${historyField}: \\[[\\s\\S]*?)(\\n\\s*\\],)`);
  if (!histRe.test(block)) throw new Error(`${historyField} not found on '${id}'`);
  block = block.replace(histRe, `$1\n      ${historyEntry}$2`);

  const updated = original.slice(0, blockStart) + block + original.slice(blockEnd + 5);
  writeGuarded(original, updated);
}

function writeGuarded(original: string, updated: string): void {
  const baseline = findUnpairedFields(TARGET, { fields: ['title', 'summary'] }).length;
  writeFileSync(TARGET, updated);
  const after = findUnpairedFields(TARGET, { fields: ['title', 'summary'] });
  if (after.length > baseline) {
    writeFileSync(TARGET, original);
    throw new Error(`i18n pairing regressed (${baseline} → ${after.length}); rolled back`);
  }
  formatWithPrettier(TARGET);
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
export const q = (s: string) => `'${esc(s)}'`;

export function formatConsultation(c: {
  id: string;
  agency: string;
  title: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
  summary: string;
  summaryEn: string;
  summaryJa: string;
  summaryKo: string;
  status: string;
  opensAt?: string;
  deadline?: string;
  observedAt: string;
  sourceUrl: string;
  addedAt: string;
}): string {
  const lines = [
    '  {',
    `    id: ${q(c.id)},`,
    `    agency: ${q(c.agency)},`,
    `    title: ${q(c.title)},`,
    `    titleEn: ${q(c.titleEn)},`,
    `    titleJa: ${q(c.titleJa)},`,
    `    titleKo: ${q(c.titleKo)},`,
    `    summary: ${q(c.summary)},`,
    `    summaryEn: ${q(c.summaryEn)},`,
    `    summaryJa: ${q(c.summaryJa)},`,
    `    summaryKo: ${q(c.summaryKo)},`,
    `    status: ${q(c.status)},`,
  ];
  if (c.opensAt) lines.push(`    opensAt: ${q(c.opensAt)},`);
  if (c.deadline) lines.push(`    deadline: ${q(c.deadline)},`);
  lines.push(
    `    statusHistory: [{ status: ${q(c.status)}, observedAt: ${q(c.observedAt)} }],`,
    `    sourceUrl: ${q(c.sourceUrl)},`,
    `    addedAt: ${q(c.addedAt)},`,
    '  },'
  );
  return lines.join('\n');
}

export function formatBill(b: {
  id: string;
  billNumber?: string;
  title: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
  summary: string;
  summaryEn: string;
  summaryJa: string;
  summaryKo: string;
  stage: string;
  introducedAt?: string;
  secondReadingAt?: string;
  passedAt?: string;
  aiRelevance: string;
  observedAt: string;
  sourceUrl: string;
  addedAt: string;
}): string {
  const lines = ['  {', `    id: ${q(b.id)},`];
  if (b.billNumber) lines.push(`    billNumber: ${q(b.billNumber)},`);
  lines.push(
    `    title: ${q(b.title)},`,
    `    titleEn: ${q(b.titleEn)},`,
    `    titleJa: ${q(b.titleJa)},`,
    `    titleKo: ${q(b.titleKo)},`,
    `    summary: ${q(b.summary)},`,
    `    summaryEn: ${q(b.summaryEn)},`,
    `    summaryJa: ${q(b.summaryJa)},`,
    `    summaryKo: ${q(b.summaryKo)},`,
    `    stage: ${q(b.stage)},`
  );
  if (b.introducedAt) lines.push(`    introducedAt: ${q(b.introducedAt)},`);
  if (b.secondReadingAt) lines.push(`    secondReadingAt: ${q(b.secondReadingAt)},`);
  if (b.passedAt) lines.push(`    passedAt: ${q(b.passedAt)},`);
  lines.push(
    `    stageHistory: [{ stage: ${q(b.stage)}, observedAt: ${q(b.observedAt)} }],`,
    `    aiRelevance: ${q(b.aiRelevance)},`,
    `    sourceUrl: ${q(b.sourceUrl)},`,
    `    addedAt: ${q(b.addedAt)},`,
    '  },'
  );
  return lines.join('\n');
}
