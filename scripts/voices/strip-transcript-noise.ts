// scripts/voices/strip-transcript-noise.ts
// ────────────────────────────────────────────────────────────────────────
// One-off cleanup for the transcript-quality eval failures: 31 historical
// speechTranscripts records whose paragraph[0] is leaked page chrome
// (CMS "has been migrated…" notice / "Newsroom" breadcrumb). The cause is
// already fixed at fetch time (scripts/refresh/voices/fetch.ts filters via
// scripts/lib/transcript-noise.ts); this strips the chrome from records
// committed before that filter existed.
//
// SAFETY (CLAUDE.md rule #8/#11 — never full-rewrite a transcript file):
//   - Noise indices are detected on paragraphsEn (the source the other
//     locales translate from) and removed from ALL locale arrays at the
//     same indices, preserving zh/en/ja/ko alignment.
//   - Removal is LINE-SURGICAL: it deletes only the element lines, leaving
//     every other byte untouched. Before touching an array it asserts the
//     array is one-element-per-line (line count between the brackets ==
//     array length). If any array violates that, the record is SKIPPED and
//     reported — we never guess across a multi-line literal.
//   - --dry-run prints the exact lines that would be deleted; run it first.
//
// Usage:
//   npx tsx scripts/voices/strip-transcript-noise.ts --dry-run
//   npx tsx scripts/voices/strip-transcript-noise.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { speechTranscripts } from '../../src/data/speech-transcripts.ts';
import { findNoiseParagraphs } from '../lib/transcript-noise.ts';

const FILE = resolve('src/data/speech-transcripts.ts');
const LOCALE_FIELDS = ['paragraphs', 'paragraphsEn', 'paragraphsJa', 'paragraphsKo'] as const;
const dryRun = process.argv.includes('--dry-run');

interface RecordPlan {
  speechId: string;
  noiseIndices: number[];
  enPreview: string;
}

// 1. Which records carry noise, and at which indices (detected on EN).
const plans: RecordPlan[] = [];
for (const [speechId, rec] of Object.entries(speechTranscripts)) {
  const en = (rec as { paragraphsEn?: string[] }).paragraphsEn;
  if (!Array.isArray(en)) continue;
  const hits = findNoiseParagraphs(en);
  if (hits.length === 0) continue;
  plans.push({
    speechId,
    noiseIndices: hits.map((h) => h.index).sort((a, b) => a - b),
    enPreview: hits.map((h) => `[${h.label}]#${h.index}`).join(' '),
  });
}

if (plans.length === 0) {
  process.stdout.write('[strip-noise] no noisy records — nothing to do.\n');
  process.exit(0);
}

// A map entry key line, e.g. `  'speech-id': {` or (Prettier-wrapped for a
// long key) `  'very-long-id':` with the `{` on the next line. Distinguished
// from inner fields (which are `field:`, unquoted) by the leading quote.
const KEY_LINE_RE = /^\s+'[^']+':\s*\{?\s*$/;

// Index of the next record's key line after `afterLine`, or lines.length.
function nextRecordLine(lines: string[], afterLine: number): number {
  for (let i = afterLine + 1; i < lines.length; i += 1) {
    if (KEY_LINE_RE.test(lines[i])) return i;
  }
  return lines.length;
}

// 2. Locate a record's `<field>: [` open line and its matching `]` close line,
//    searching ONLY within this record's line span. Returns null if absent.
function findArrayBounds(lines: string[], start: number, end: number, field: string): [number, number] | null {
  const openRe = new RegExp(`^\\s+${field}:\\s*\\[`);
  for (let i = start; i < end; i += 1) {
    if (!openRe.test(lines[i])) continue;
    if (/\[\s*\]/.test(lines[i])) return [i, i]; // inline empty array
    for (let j = i + 1; j < end; j += 1) {
      if (/^\s+\],?$/.test(lines[j])) return [i, j];
    }
    return null;
  }
  return null;
}

function recordStartLine(lines: string[], speechId: string): number {
  // Match the key line whether `{` is same-line or wrapped to the next line.
  const re = new RegExp(`^\\s+'${speechId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{?\\s*$`);
  for (let i = 0; i < lines.length; i += 1) if (re.test(lines[i])) return i;
  return -1;
}

const original = readFileSync(FILE, 'utf8');
const lines = original.split('\n');
const toDelete = new Set<number>(); // 0-based line numbers to drop
const applied: string[] = [];
const skipped: string[] = [];

for (const plan of plans) {
  const start = recordStartLine(lines, plan.speechId);
  if (start === -1) {
    skipped.push(`${plan.speechId}: record line not found`);
    continue;
  }
  const end = nextRecordLine(lines, start);
  const rec = speechTranscripts[plan.speechId] as unknown as Record<string, unknown>;
  const lineHits: number[] = [];
  let ok = true;
  for (const field of LOCALE_FIELDS) {
    const arr = rec[field];
    if (!Array.isArray(arr)) continue; // ja/ko optional
    const bounds = findArrayBounds(lines, start, end, field);
    if (!bounds) {
      ok = false;
      skipped.push(`${plan.speechId}: could not bound ${field}`);
      break;
    }
    const [open, close] = bounds;
    const elementLines = close - open - 1;
    if (elementLines !== arr.length) {
      ok = false;
      skipped.push(`${plan.speechId}: ${field} not one-element-per-line (${elementLines} lines vs ${arr.length} items)`);
      break;
    }
    for (const idx of plan.noiseIndices) lineHits.push(open + 1 + idx);
  }
  if (!ok) continue;
  lineHits.forEach((l) => toDelete.add(l));
  applied.push(`${plan.speechId}  ${plan.enPreview}  → drop ${lineHits.length} lines`);
}

process.stdout.write(`[strip-noise] noisy records: ${plans.length}, applied: ${applied.length}, skipped: ${skipped.length}\n`);
for (const a of applied) process.stdout.write(`  ✓ ${a}\n`);
for (const s of skipped) process.stdout.write(`  ⚠ ${s}\n`);

if (dryRun) {
  process.stdout.write(`\n[strip-noise] --dry-run: would delete ${toDelete.size} lines. Sample:\n`);
  [...toDelete].sort((a, b) => a - b).slice(0, 8).forEach((l) => process.stdout.write(`  L${l + 1}: ${lines[l].trim().slice(0, 80)}\n`));
  process.exit(0);
}

const kept = lines.filter((_, i) => !toDelete.has(i));
writeFileSync(FILE, kept.join('\n'));
process.stdout.write(`\n[strip-noise] removed ${toDelete.size} noise lines from ${applied.length} records.\n`);
