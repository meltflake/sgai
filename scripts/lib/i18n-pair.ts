// scripts/lib/i18n-pair.ts
// ────────────────────────────────────────────────────────────────────────
// Static check: every zh field that can be locale-paired has its
// per-locale sibling populated (e.g. `*En` for en, `*Ja` for ja).
//
// This is a *source-level* check (parses .ts string literals). It runs
// pre-emit in refresh pipelines so we never write a record that would
// later be flagged by the build-time `npm run check:i18n`. Belt and
// braces.
//
// Strategy:
//   1. Read the target file as text.
//   2. Find every `<key>: '<chinese-string>',` literal where <key> is one
//      of the configurable user-facing field names (title, description,
//      name, label, summary, note, excerpt, ...).
//   3. For each match, look for the sibling `<key><Suffix>:` within the
//      same record block, for each target locale. If missing or empty,
//      report.
//   4. Skip blocks marked `// i18n-allow-unpaired` on the line above.
//
// USAGE (programmatic):
//   import { findUnpairedFields } from './lib/i18n-pair';
//   const issues = findUnpairedFields('src/data/policies.ts', { fields: ['title', 'description'], locales: ['en', 'ja'] });
//   if (issues.length) throw new Error('i18n pairing failed');
//
// USAGE (cli):
//   npx tsx scripts/lib/i18n-pair.ts src/data/policies.ts
//   npx tsx scripts/lib/i18n-pair.ts src/data/*.ts
//   npx tsx scripts/lib/i18n-pair.ts --fields=title,description src/data/policies.ts
//   npx tsx scripts/lib/i18n-pair.ts --locales=en,ja src/data/*.ts

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export interface UnpairedField {
  file: string;
  line: number;
  recordStartLine: number;
  field: string;
  chineseValue: string;
  reason: 'missing-sibling' | 'empty-sibling';
  /** Which target locale's sibling is missing/empty (e.g. 'en', 'ja'). */
  locale: string;
}

const DEFAULT_FIELDS = [
  'title',
  'description',
  'name',
  'label',
  'summary',
  'note',
  'excerpt',
  'tagline',
  'role',
  'org',
  'context',
  'reason',
  'caption',
  'subtitle',
];

const DEFAULT_LOCALES = ['en'];

const CJK_RE = /[一-鿿]/;

/** Compute the sibling-field suffix for a locale. zh → '' (bare key);
 *  en → 'En'; ja → 'Ja'. Mirrors src/i18n/index.ts:siblingSuffix. */
function siblingSuffix(locale: string): string {
  if (locale === 'zh') return '';
  return locale.charAt(0).toUpperCase() + locale.slice(1);
}

/**
 * Find every record that has a zh string in `field` but lacks a non-empty
 * `${field}En` sibling within the same brace-balanced block.
 *
 * The parser is regex-based, intentionally simple, and works on the
 * conventional formatting that all sgai data files follow. It doesn't
 * understand TS expressions — only string literals on dedicated lines.
 */
export function findUnpairedFields(
  filePath: string,
  options: { fields?: string[]; locales?: string[]; ignoreUnpairedAnnotation?: string } = {}
): UnpairedField[] {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const fields = options.fields || DEFAULT_FIELDS;
  const locales = options.locales || DEFAULT_LOCALES;
  const ignoreMarker = options.ignoreUnpairedAnnotation || 'i18n-allow-unpaired';
  const source = readFileSync(filePath, 'utf8');
  const lines = source.split('\n');
  const issues: UnpairedField[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    // Match `<field>: '...'` or `<field>: "..."` where field is one of the configured names.
    const fieldRe = new RegExp(`^(\\s*)(${fields.join('|')}):\\s*['"](.+?)['"]\\s*,?\\s*$`);
    // Also accept multi-line literals where Prettier wrapped a long zh
    // string onto the next line:
    //   description:
    //     '中文内容...',
    const fieldKeyOnlyRe = new RegExp(`^(\\s*)(${fields.join('|')}):\\s*$`);
    let field: string;
    let value: string;
    const m = line.match(fieldRe);
    if (m) {
      field = m[2];
      value = m[3];
    } else {
      const m2 = line.match(fieldKeyOnlyRe);
      if (!m2) continue;
      // Peek the next non-empty line for a single-string-literal continuation.
      const next = lines[i + 1] ?? '';
      const nextMatch = next.match(/^\s*['"](.*?)['"]\s*,?\s*$/);
      if (!nextMatch) continue;
      field = m2[2];
      value = nextMatch[1];
    }

    // Only check zh strings (those containing CJK).
    if (!CJK_RE.test(value)) continue;

    // Skip if previous line annotates suppression.
    const prev = lines[i - 1] || '';
    if (prev.includes(ignoreMarker)) continue;

    // Find enclosing record start (walk back to first '{' that is not closed).
    const recordStart = findEnclosingRecordStart(lines, i);

    // For each target locale, search for `<field><Suffix>:` within the
    // same record block. Accept three layouts:
    //   (a) `fieldXx: 'value',`        — same-line literal
    //   (b) `fieldXx: \n      '...'`   — multi-line literal (Prettier wraps long strings)
    //   (c) `fieldXx: [...]` / object  — non-string value (just check key exists)
    for (const locale of locales) {
      const siblingKey = `${field}${siblingSuffix(locale)}`;
      const sameLineRe = new RegExp(`^\\s*${siblingKey}:\\s*['"](.*?)['"]\\s*,?\\s*$`);
      const keyOnlyRe = new RegExp(`^\\s*${siblingKey}:\\s*$`);
      const keyAnyValueRe = new RegExp(`^\\s*${siblingKey}:\\s*[\\[\\{]`);
      let foundSibling = false;
      let emptySibling = false;
      for (let j = recordStart; j < lines.length; j += 1) {
        const candidate = lines[j];
        if (j > recordStart && /^\s*\},?\s*$/.test(candidate)) break;
        const sameLine = candidate.match(sameLineRe);
        if (sameLine) {
          foundSibling = true;
          emptySibling = sameLine[1].length === 0;
          break;
        }
        if (keyOnlyRe.test(candidate)) {
          // Multi-line literal: peek the next non-empty line; if it's a quoted string, treat as paired.
          const next = lines[j + 1] || '';
          if (/^\s*['"]/.test(next)) {
            foundSibling = true;
            // Best-effort empty check: extract the leading string literal.
            const leading = next.match(/^\s*['"](.*?)['"]/);
            emptySibling = leading ? leading[1].length === 0 : false;
            break;
          }
        }
        if (keyAnyValueRe.test(candidate)) {
          // Array/object value — just confirm presence; can't easily check empty.
          foundSibling = true;
          break;
        }
      }

      if (!foundSibling) {
        issues.push({
          file: filePath,
          line: i + 1,
          recordStartLine: recordStart + 1,
          field,
          chineseValue: value,
          reason: 'missing-sibling',
          locale,
        });
      } else if (emptySibling) {
        issues.push({
          file: filePath,
          line: i + 1,
          recordStartLine: recordStart + 1,
          field,
          chineseValue: value,
          reason: 'empty-sibling',
          locale,
        });
      }
    }
  }

  return issues;
}

function findEnclosingRecordStart(lines: string[], lineIndex: number): number {
  // Walk back to the closest unmatched '{' on its own line.
  let depth = 0;
  for (let j = lineIndex; j >= 0; j -= 1) {
    const line = lines[j];
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    depth += closes;
    depth -= opens;
    if (depth < 0) return j;
  }
  return 0;
}

// ── CLI ─────────────────────────────────────────────────────────────────
async function cliMain(): Promise<void> {
  const argv = process.argv.slice(2);
  const fieldsArg = argv.find((a) => a.startsWith('--fields='));
  const fields = fieldsArg ? fieldsArg.split('=')[1].split(',').map((s) => s.trim()) : undefined;
  const localesArg = argv.find((a) => a.startsWith('--locales='));
  const locales = localesArg ? localesArg.split('=')[1].split(',').map((s) => s.trim()) : undefined;
  const files = argv.filter((a) => !a.startsWith('--'));

  if (files.length === 0) {
    process.stderr.write('Usage: i18n-pair <file...> [--fields=title,description] [--locales=en,ja]\n');
    process.exit(2);
  }

  let total = 0;
  for (const file of files) {
    const abs = resolve(file);
    const issues = findUnpairedFields(abs, { fields, locales });
    if (issues.length === 0) continue;
    total += issues.length;
    process.stdout.write(`\n${file}: ${issues.length} unpaired\n`);
    for (const issue of issues.slice(0, 20)) {
      process.stdout.write(
        `  L${issue.line} ${issue.field}[${issue.locale}] (${issue.reason}): ${issue.chineseValue.slice(0, 50)}\n`
      );
    }
    if (issues.length > 20) {
      process.stdout.write(`  … and ${issues.length - 20} more\n`);
    }
  }

  if (total > 0) {
    process.stderr.write(`\nTotal unpaired fields: ${total}\n`);
    process.exit(1);
  }
  process.stdout.write('OK — all checked fields paired.\n');
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('i18n-pair.ts')) {
  await cliMain();
}
