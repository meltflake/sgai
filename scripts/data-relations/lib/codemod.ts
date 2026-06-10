// Regex-based write-back of accepted relations into src/data/*.ts.
//
// We mirror the style of scripts/codemod-debates.ts (string-level edits, no
// ts-morph) for two reasons:
//   1. The data files are append-only-ish object literals — full AST is
//      overkill, and prettier reformats consistently after each write.
//   2. Easier to dry-run + diff visually.
//
// Given a record id and an array field name, the editor finds the matching
// record block, locates the array literal, and replaces it with a new
// literal that's the union of the existing values and the newly accepted
// values. If the field doesn't exist on the record, we insert it just
// before the closing brace.
//
// Bidirectional sync: when a debate gets a policy added to its
// relatedPolicyIds, the same policy gets the debate added to its
// relatedDebateIds, and vice versa. This keeps the graph symmetric so
// renderers on both sides surface the relation.

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

import type { Domain, Field } from './queue';

interface SourceFile {
  path: string;
  text: string;
}

const FILE_OF: Record<Domain, string> = {
  debates: 'src/data/debates.ts',
  policies: 'src/data/policies.ts',
};

/** Inverse of (domain, field) describing the bidirectional sibling. */
export const SIBLING: Record<Domain, { domain: Domain; field: Field }> = {
  debates: { domain: 'policies', field: 'relatedDebateIds' },
  policies: { domain: 'debates', field: 'relatedPolicyIds' },
};

export function loadSource(domain: Domain): SourceFile {
  const path = FILE_OF[domain];
  try {
    return { path, text: readFileSync(path, 'utf-8') };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') throw new Error(`source file not found: ${path}`);
    throw err;
  }
}

/** Locate the record block (text between `{` and matching `}`) that
 *  contains `id: '<id>'`. Returns indices into the source text, or null
 *  if the record can't be found.
 *
 *  We rely on the data files using the canonical formatter style — a
 *  record block always opens with `  {` (two-space indent) and closes
 *  with `  }`. This matches what prettier emits for the project. */
export function findRecordBlock(text: string, id: string): { open: number; close: number } | null {
  // Match either id: 'xxx' or id: "xxx" or id: `xxx`. Single-line value.
  const idRe = new RegExp(`\\bid:\\s*['"\\\`]${escapeRegex(id)}['"\\\`]`);
  const m = idRe.exec(text);
  if (!m) return null;

  // Walk backwards to find the opening brace of this record.
  let i = m.index;
  let openBrace = -1;
  while (i > 0) {
    if (text[i] === '{' && (text[i - 1] === '\n' || /\s/.test(text[i - 1]))) {
      // Heuristic: assume the nearest preceding `{` at the start of an
      // indented line is the record opener.
      openBrace = i;
      break;
    }
    i -= 1;
  }
  if (openBrace === -1) return null;

  // Walk forward, tracking brace depth, to find the matching close.
  let depth = 1;
  let j = openBrace + 1;
  let inString: '"' | "'" | '`' | null = null;
  while (j < text.length) {
    const ch = text[j];
    const prev = text[j - 1];
    if (inString) {
      if (ch === inString && prev !== '\\') inString = null;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
    } else if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return { open: openBrace, close: j };
      }
    }
    j += 1;
  }
  return null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Read the existing array values for `field` inside a record block.
 *  Returns null if the field is missing entirely. */
export function readArrayField(text: string, blockOpen: number, blockClose: number, field: string): string[] | null {
  const block = text.slice(blockOpen, blockClose + 1);
  // Look for `<field>:` followed by a `[ ... ]` literal. Field name may be
  // bare or quoted; we accept both.
  const fieldRe = new RegExp(`\\b${escapeRegex(field)}:\\s*\\[([\\s\\S]*?)\\]`);
  const m = fieldRe.exec(block);
  if (!m) return null;
  const inner = m[1];
  const ids = [...inner.matchAll(/['"`]([^'"`]+)['"`]/g)].map((mm) => mm[1]);
  return ids;
}

function formatStringArray(ids: string[]): string {
  if (ids.length === 0) return '[]';
  return '[' + ids.map((id) => `'${id}'`).join(', ') + ']';
}

/** Write back `<field>: [<ids...>]` into the record at (blockOpen, blockClose).
 *  - If the field exists: replace the array literal in place.
 *  - If absent: insert a new line `<field>: [...]` right before the
 *    closing brace, with the same indentation as adjacent fields.
 *  Returns the mutated full source. */
export function writeArrayField(
  text: string,
  blockOpen: number,
  blockClose: number,
  field: string,
  ids: string[]
): string {
  const block = text.slice(blockOpen, blockClose + 1);
  const replacement = formatStringArray(ids);

  const fieldRe = new RegExp(`(\\b${escapeRegex(field)}:\\s*)\\[[\\s\\S]*?\\]`);
  if (fieldRe.test(block)) {
    const newBlock = block.replace(fieldRe, `$1${replacement}`);
    return text.slice(0, blockOpen) + newBlock + text.slice(blockClose + 1);
  }

  // Insert new field. Detect leading indent of an existing inner line as
  // template, fall back to four spaces.
  const inner = text.slice(blockOpen + 1, blockClose);
  const indentMatch = inner.match(/\n([ \t]+)\S/);
  const indent = indentMatch ? indentMatch[1] : '    ';
  const insertion = `${indent}${field}: ${replacement},\n${indent.slice(0, -2)}`;
  return text.slice(0, blockClose) + insertion + text.slice(blockClose);
}

export interface ApplyResult {
  domain: Domain;
  field: Field;
  recordId: string;
  before: string[] | null;
  after: string[];
  found: boolean;
}

/** Merge `accepted` into the existing array for (domain, field, recordId).
 *  De-dupes; preserves prior values. Mutates the SourceFile.text. */
export function applyAcceptedToRecord(
  src: SourceFile,
  domain: Domain,
  field: Field,
  recordId: string,
  accepted: string[]
): ApplyResult {
  if (accepted.length === 0) {
    return { domain, field, recordId, before: null, after: [], found: false };
  }
  const block = findRecordBlock(src.text, recordId);
  if (!block) {
    return { domain, field, recordId, before: null, after: accepted, found: false };
  }
  const before = readArrayField(src.text, block.open, block.close, field) ?? [];
  const merged = [...new Set([...before, ...accepted])];
  src.text = writeArrayField(src.text, block.open, block.close, field, merged);
  return { domain, field, recordId, before, after: merged, found: true };
}

export function persist(src: SourceFile): void {
  writeFileSync(src.path, src.text);
}

export function runPrettier(paths: string[]): void {
  if (paths.length === 0) return;
  execSync(`npx prettier --write ${paths.map((p) => `"${p}"`).join(' ')}`, { stdio: 'inherit' });
}
