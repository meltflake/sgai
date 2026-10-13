// scripts/lib/ts-record-fields.ts
// ────────────────────────────────────────────────────────────────────────
// Locate and upsert a top-level field inside one record of a TS data file
// shaped like `export const x: Record<string, T> = { id: { field: [...], } }`.
//
// Why a bracket scanner, not a regex: prettier folds short arrays onto one
// line (`paragraphs: ['[音乐] >> 嗚！'],`), and a regex that expects
// `field: [\n ... \n],` misses them. 2026-10-09 the videos refresh failed
// on v120 for this reason. The scanner finds the value's matching close
// bracket, so one-line and multi-line layouts both work.
//
// Assumes prettier's record layout: records at 2-space indent, fields at
// 4-space indent, each field value followed by a `,`.

export interface Span {
  start: number;
  end: number;
}

const OPEN_TO_CLOSE: Record<string, string> = { '[': ']', '{': '}' };

// Index just past the bracket that closes the one at `openIdx`. Skips
// brackets inside '...', "..." and `...` strings. Returns -1 if unbalanced.
function matchClose(src: string, openIdx: number): number {
  const stack: string[] = [OPEN_TO_CLOSE[src[openIdx]]];
  let inStr: string | null = null;
  for (let i = openIdx + 1; i < src.length; i += 1) {
    const ch = src[i];
    if (inStr) {
      if (ch === '\\') i += 1;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
    else if (OPEN_TO_CLOSE[ch]) stack.push(OPEN_TO_CLOSE[ch]);
    else if (ch === stack[stack.length - 1]) {
      stack.pop();
      if (stack.length === 0) return i + 1;
    }
  }
  return -1;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Span of `\n    field: <[...] | {...}>,` inside a record body: from the
// leading newline to just past the trailing comma. Null if absent.
export function findFieldSpan(body: string, field: string): Span | null {
  const re = new RegExp(`\\n {4}${escapeRegex(field)}:\\s*([[{])`);
  const m = re.exec(body);
  if (!m) return null;
  const openIdx = m.index + m[0].length - 1;
  const closeEnd = matchClose(body, openIdx);
  if (closeEnd === -1 || body[closeEnd] !== ',') return null;
  return { start: m.index, end: closeEnd + 1 };
}

// Span of the `{ ... }` object literal for record `id`.
export function findRecordSpan(source: string, id: string): Span {
  const re = new RegExp(`\\n {2}${escapeRegex(id)}:\\s*\\{`);
  const m = re.exec(source);
  if (!m) throw new Error(`Could not locate record header for ${id}`);
  const openIdx = m.index + m[0].length - 1;
  const end = matchClose(source, openIdx);
  if (end === -1) throw new Error(`Unbalanced braces in record ${id}`);
  return { start: openIdx, end };
}

// Replace `field` in record `id` with `formatted` (the full field text,
// indented, with trailing comma, no leading newline). If the field is
// absent, insert it after the first anchor field that exists.
export function upsertRecordField(
  source: string,
  id: string,
  field: string,
  formatted: string,
  anchors: string[]
): string {
  const rec = findRecordSpan(source, id);
  const body = source.slice(rec.start, rec.end);

  let next: string;
  const existing = findFieldSpan(body, field);
  if (existing) {
    next = body.slice(0, existing.start) + `\n${formatted}` + body.slice(existing.end);
  } else {
    const anchor = anchors.map((a) => findFieldSpan(body, a)).find((s): s is Span => s !== null);
    if (!anchor) throw new Error(`No anchor (${anchors.join(', ')}) found in record ${id}`);
    next = body.slice(0, anchor.end) + `\n${formatted}` + body.slice(anchor.end);
  }
  return source.slice(0, rec.start) + next + source.slice(rec.end);
}
