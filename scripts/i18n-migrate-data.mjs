// scripts/i18n-migrate-data.mjs
// One-shot codemod (v2): scope-aware. Only renames top-level fields inside
// the explicit data array we care about, leaving sibling exports untouched.
//
// Strategy:
//   1. Slice the file at the start anchor of the target export.
//   2. Slice again at the next `export const ` (or end-of-file).
//   3. Apply renames only inside that slice.
//   4. Re-stitch.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATA_DIR = resolve(process.cwd(), 'src/data');

const V = `(?=(['"\`{\\[\\d-]|null|true|false))`;

// Two-branch matcher: either `key: <inline value>` (with value guard) or
// `key:$` followed by a multi-line value indented further on the next line.
function renameKeyTwoForms(slice, indent, oldKey, tombstone) {
  // Inline form with value guard
  let s = slice.replace(
    new RegExp(`^(${indent})${oldKey}: ${V}`, 'gm'),
    `$1${tombstone}: `
  );
  // Multi-line form: `key:` at end of line, next non-blank line has deeper indent
  s = s.replace(
    new RegExp(`^(${indent})${oldKey}:$`, 'gm'),
    `$1${tombstone}:`
  );
  return s;
}

function sliceExport(src, exportName) {
  const startRe = new RegExp(`^export const ${exportName}\\b[^\\n]*$`, 'm');
  const m = startRe.exec(src);
  if (!m) return null;
  const start = m.index;
  const after = src.slice(start + m[0].length);
  const next = /^export const \w/m.exec(after);
  const end = next ? start + m[0].length + next.index : src.length;
  return { start, end, slice: src.slice(start, end) };
}

function spliceSlice(src, slice, newSlice) {
  return src.slice(0, slice.start) + newSlice + src.slice(slice.end);
}

function renameKeyInSlice(slice, indent, oldKey, tombstone) {
  return renameKeyTwoForms(slice, indent, oldKey, tombstone);
}

function settle(text, tombstone, finalName) {
  return text.replaceAll(tombstone, finalName);
}

function applyDebateRecordRenames(slice) {
  let s = slice;
  // Tombstones (record-level, 4-space indent inside `debates: Debate[]`)
  s = renameKeyInSlice(s, '    ', 'title', '__D_TITLE_EN__');
  s = renameKeyInSlice(s, '    ', 'zhTitle', '__D_TITLE__');
  s = renameKeyInSlice(s, '    ', 'summary', '__D_TRANSCRIPT_EN__');
  s = renameKeyInSlice(s, '    ', 'zhSummary', '__D_SUMMARY__');
  s = renameKeyInSlice(s, '    ', 'summaryShortEn', '__D_SUMMARY_EN__');
  s = settle(s, '__D_TITLE_EN__', 'titleEn');
  s = settle(s, '__D_TITLE__', 'title');
  s = settle(s, '__D_TRANSCRIPT_EN__', 'transcriptEn');
  s = settle(s, '__D_SUMMARY__', 'summary');
  s = settle(s, '__D_SUMMARY_EN__', 'summaryEn');
  return s;
}

function applyPeopleRecordRenames(slice) {
  let s = slice;
  s = renameKeyInSlice(s, '    ', 'name', '__P_NAME_EN__');
  s = renameKeyInSlice(s, '    ', 'zhName', '__P_NAME__');
  s = renameKeyInSlice(s, '    ', 'title', '__P_TITLE_EN__');
  s = renameKeyInSlice(s, '    ', 'zhTitle', '__P_TITLE__');
  s = settle(s, '__P_NAME_EN__', 'nameEn');
  s = settle(s, '__P_NAME__', 'name');
  s = settle(s, '__P_TITLE_EN__', 'titleEn');
  s = settle(s, '__P_TITLE__', 'title');
  return s;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function applyVoicesRecordRenames(slice) {
  let s = slice;
  // Institution: name → abbreviation, zhName → name
  s = renameKeyInSlice(s, '    ', 'name', '__V_ABBR__');
  s = renameKeyInSlice(s, '    ', 'zhName', '__V_NAME__');
  // MddiSpeech: title → titleEn, zhTitle → title, event → eventEn, zhEvent → event
  s = renameKeyInSlice(s, '    ', 'title', '__V_TITLE_EN__');
  s = renameKeyInSlice(s, '    ', 'zhTitle', '__V_TITLE__');
  s = renameKeyInSlice(s, '    ', 'event', '__V_EVENT_EN__');
  s = renameKeyInSlice(s, '    ', 'zhEvent', '__V_EVENT__');
  s = settle(s, '__V_ABBR__', 'abbreviation');
  s = settle(s, '__V_NAME__', 'name');
  s = settle(s, '__V_TITLE_EN__', 'titleEn');
  s = settle(s, '__V_TITLE__', 'title');
  s = settle(s, '__V_EVENT_EN__', 'eventEn');
  s = settle(s, '__V_EVENT__', 'event');
  return s;
}

function migrateInterface(src, ifaceName, fieldRenames) {
  // fieldRenames: array of [oldLine, newLine]
  const re = new RegExp(`(export interface ${ifaceName} \\{[\\s\\S]*?^\\})`, 'm');
  return src.replace(re, (block) => {
    let b = block;
    for (const [from, to] of fieldRenames) {
      b = b.replace(from, to);
    }
    return b;
  });
}

// ── debates.ts ────────────────────────────────────────────────────────
function migrateDebates() {
  const file = resolve(DATA_DIR, 'debates.ts');
  const src = readFileSync(file, 'utf8');

  // 1. Interface: handle inline comments (the comment may follow the type).
  let out = migrateInterface(src, 'Debate', [
    [/(\s*)title: string;([^\n]*)$/m, '$1titleEn: string;$2'],
    [/(\s*)zhTitle: string;([^\n]*)$/m, '$1__D_IFACE_TITLE__: string;$2'],
    [/(\s*)summary: string;([^\n]*)$/m, '$1transcriptEn: string;$2'],
    [/(\s*)zhSummary: string;([^\n]*)$/m, '$1__D_IFACE_SUMMARY__: string;$2'],
    [/(\s*)summaryShortEn\?: string;([^\n]*)$/m, '$1summaryEn?: string;$2'],
  ]);
  out = settle(out, '__D_IFACE_TITLE__', 'title');
  out = settle(out, '__D_IFACE_SUMMARY__', 'summary');

  // 2. Slice the `debates` export array and rename only inside.
  const slice = sliceExport(out, 'debates');
  if (!slice) {
    console.log('[debates] could not find `export const debates`');
    return;
  }
  const newSlice = applyDebateRecordRenames(slice.slice);
  out = spliceSlice(out, slice, newSlice);

  // 3. MP_PROFILES sub-export: also reverse-convention (name=en, zhName=zh).
  const mpSlice = sliceExport(out, 'MP_PROFILES');
  if (mpSlice) {
    let s = mpSlice.slice;
    s = renameKeyInSlice(s, '    ', 'name', '__MP_NAME_EN__');
    s = renameKeyInSlice(s, '    ', 'zhName', '__MP_NAME__');
    s = settle(s, '__MP_NAME_EN__', 'nameEn');
    s = settle(s, '__MP_NAME__', 'name');
    out = spliceSlice(out, mpSlice, s);
  }

  if (out === src) {
    console.log('[debates] no changes');
    return;
  }
  writeFileSync(file, out);
  console.log('[debates] migrated');
}

// ── people.ts ─────────────────────────────────────────────────────────
function migratePeople() {
  const file = resolve(DATA_DIR, 'people.ts');
  const src = readFileSync(file, 'utf8');

  // 1. Person interface (handle inline comments).
  let out = migrateInterface(src, 'Person', [
    [/(\s*)name: string;([^\n]*)$/m, '$1nameEn: string;$2'],
    [/(\s*)zhName: string;([^\n]*)$/m, '$1__P_IFACE_NAME__: string;$2'],
    [/(\s*)title: string;([^\n]*)$/m, '$1titleEn: string;$2'],
    [/(\s*)title\?: string;([^\n]*)$/m, '$1titleEn?: string;$2'],
    [/(\s*)zhTitle: string;([^\n]*)$/m, '$1__P_IFACE_TITLE__: string;$2'],
    [/(\s*)zhTitle\?: string;([^\n]*)$/m, '$1__P_IFACE_TITLE__?: string;$2'],
  ]);
  out = settle(out, '__P_IFACE_NAME__', 'name');
  out = settle(out, '__P_IFACE_TITLE__', 'title');

  // 2. Slice the `people` export array.
  const slice = sliceExport(out, 'people');
  if (!slice) {
    console.log('[people] could not find `export const people`');
    return;
  }
  const newSlice = applyPeopleRecordRenames(slice.slice);
  out = spliceSlice(out, slice, newSlice);

  if (out === src) {
    console.log('[people] no changes');
    return;
  }
  writeFileSync(file, out);
  console.log('[people] migrated');
}

// ── voices.ts ─────────────────────────────────────────────────────────
function migrateVoices() {
  const file = resolve(DATA_DIR, 'voices.ts');
  const src = readFileSync(file, 'utf8');

  // 1. Institution interface
  let out = migrateInterface(src, 'Institution', [
    [/(\s*)name: string;([^\n]*)$/m, '$1abbreviation: string;$2'],
    [/(\s*)zhName: string;([^\n]*)$/m, '$1__I_IFACE_NAME__: string;$2'],
  ]);
  out = settle(out, '__I_IFACE_NAME__', 'name');

  // 2. MddiSpeech interface
  out = migrateInterface(out, 'MddiSpeech', [
    [/(\s*)title: string;([^\n]*)$/m, '$1titleEn: string;$2'],
    [/(\s*)zhTitle: string;([^\n]*)$/m, '$1__M_IFACE_TITLE__: string;$2'],
    [/(\s*)event: string;([^\n]*)$/m, '$1eventEn: string;$2'],
    [/(\s*)zhEvent: string;([^\n]*)$/m, '$1__M_IFACE_EVENT__: string;$2'],
  ]);
  out = settle(out, '__M_IFACE_TITLE__', 'title');
  out = settle(out, '__M_IFACE_EVENT__', 'event');

  // 3. Slice the `institutions` export.
  const instSlice = sliceExport(out, 'institutions');
  if (instSlice) {
    let s = instSlice.slice;
    s = renameKeyInSlice(s, '    ', 'name', '__V_ABBR__');
    s = renameKeyInSlice(s, '    ', 'zhName', '__V_NAME__');
    s = settle(s, '__V_ABBR__', 'abbreviation');
    s = settle(s, '__V_NAME__', 'name');
    out = spliceSlice(out, instSlice, s);
  }

  // 4. Slice the `mddiSpeeches` export.
  const speechSlice = sliceExport(out, 'mddiSpeeches');
  if (speechSlice) {
    let s = speechSlice.slice;
    s = renameKeyInSlice(s, '    ', 'title', '__V_TITLE_EN__');
    s = renameKeyInSlice(s, '    ', 'zhTitle', '__V_TITLE__');
    s = renameKeyInSlice(s, '    ', 'event', '__V_EVENT_EN__');
    s = renameKeyInSlice(s, '    ', 'zhEvent', '__V_EVENT__');
    s = settle(s, '__V_TITLE_EN__', 'titleEn');
    s = settle(s, '__V_TITLE__', 'title');
    s = settle(s, '__V_EVENT_EN__', 'eventEn');
    s = settle(s, '__V_EVENT__', 'event');
    out = spliceSlice(out, speechSlice, s);
  }

  if (out === src) {
    console.log('[voices] no changes');
    return;
  }
  writeFileSync(file, out);
  console.log('[voices] migrated');
}

// ── mp-stubs.json ─────────────────────────────────────────────────────
function migrateMpStubs() {
  const file = resolve(DATA_DIR, 'mp-stubs.json');
  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch {
    console.log('[mp-stubs] file not found');
    return;
  }
  const records = JSON.parse(raw);
  if (!Array.isArray(records)) {
    console.log('[mp-stubs] not an array');
    return;
  }
  let changed = 0;
  for (const r of records) {
    const orig = JSON.stringify(r);
    if ('zhName' in r) {
      const oldEn = r.name ?? '';
      r.name = r.zhName;
      r.nameEn = oldEn;
      delete r.zhName;
    }
    if ('zhTitle' in r) {
      const oldEn = r.title ?? '';
      r.title = r.zhTitle;
      r.titleEn = oldEn;
      delete r.zhTitle;
    }
    if (JSON.stringify(r) !== orig) changed += 1;
  }
  if (changed === 0) {
    console.log('[mp-stubs] no records changed');
    return;
  }
  writeFileSync(file, JSON.stringify(records, null, 2) + '\n');
  console.log(`[mp-stubs] migrated ${changed} records`);
}

migrateDebates();
migratePeople();
migrateVoices();
migrateMpStubs();
console.log('Done.');
