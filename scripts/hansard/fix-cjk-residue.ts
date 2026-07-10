// scripts/hansard/fix-cjk-residue.ts
// ────────────────────────────────────────────────────────────────────────
// Surgical CJK-residue fixer for transcript data files. The zh→ja / zh→ko
// batch translations occasionally leave Chinese proper nouns / simplified
// characters that fail `check:i18n` (foreign-script residue). This re-translates
// ONLY the offending paragraphs (element-level) with the hardened SCRIPT-PURITY
// system prompt, then rewrites the whole field array via brace-aware injection
// (matching the existing translate scripts' safe replacement), preserving count
// parity. Idempotent: re-run until zero residue remains.
//
// USAGE:
//   SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/hansard/fix-cjk-residue.ts [--dry-run] [--limit=N] [--file=debate|speech|video]
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { debateTranscripts } from '../../src/data/debate-transcripts.ts';
import { speechTranscripts } from '../../src/data/speech-transcripts.ts';
import { videoTranscripts } from '../../src/data/video-transcripts.ts';
import { translateBatch, type TranslateDirection } from '../lib/translate.ts';

const DRY = process.argv.includes('--dry-run');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : Infinity;
const fileArg = process.argv.find((a) => a.startsWith('--file='));
const ONLY_FILE = fileArg ? fileArg.split('=')[1] : undefined;

// Mirror scripts/i18n-check.mjs residue detectors.
const SIMPLIFIED_ONLY =
  /[们这个让给还经历战业长进应时现过对边远难听说话网决织续选责险验总较单风转务习头质闻关开师龙标异该后处见级观产场际线门约电汉东种钟严员问纸读买卖钱实询试讲请运银项报]/;
const HAN = /[一-鿿]/;
const KO_ALLOW = ['中文', '日本語', '繁體中文'];

function jaHasResidue(s: string): boolean {
  return SIMPLIFIED_ONLY.test(s);
}
function koHasResidue(s: string): boolean {
  let t = s;
  for (const a of KO_ALLOW) t = t.split(a).join('');
  return HAN.test(t);
}

type FieldSpec = { field: string; src: string; dir: TranslateDirection; detect: (s: string) => boolean; cacheDir: string };
type Target = { name: string; file: string; map: Record<string, Record<string, unknown>>; fields: FieldSpec[] };

const JA_CACHE = resolve('scripts/hansard/data/translate-cache-ja');
const KO_CACHE = resolve('scripts/hansard/data/translate-cache-ko');

const TARGETS: Target[] = [
  {
    name: 'debate',
    file: resolve('src/data/debate-transcripts.ts'),
    map: debateTranscripts as unknown as Record<string, Record<string, unknown>>,
    fields: [
      { field: 'paragraphsJa', src: 'paragraphs', dir: 'zh→ja', detect: jaHasResidue, cacheDir: JA_CACHE },
      { field: 'paragraphsKo', src: 'paragraphs', dir: 'zh→ko', detect: koHasResidue, cacheDir: KO_CACHE },
    ],
  },
  {
    name: 'speech',
    file: resolve('src/data/speech-transcripts.ts'),
    map: speechTranscripts as unknown as Record<string, Record<string, unknown>>,
    fields: [
      { field: 'paragraphsJa', src: 'paragraphs', dir: 'zh→ja', detect: jaHasResidue, cacheDir: JA_CACHE },
      { field: 'paragraphsKo', src: 'paragraphs', dir: 'zh→ko', detect: koHasResidue, cacheDir: KO_CACHE },
      { field: 'tldrJa', src: 'tldr', dir: 'zh→ja', detect: jaHasResidue, cacheDir: JA_CACHE },
      { field: 'tldrKo', src: 'tldr', dir: 'zh→ko', detect: koHasResidue, cacheDir: KO_CACHE },
    ],
  },
  {
    name: 'video',
    file: resolve('src/data/video-transcripts.ts'),
    map: videoTranscripts as unknown as Record<string, Record<string, unknown>>,
    fields: [
      { field: 'paragraphsJa', src: 'paragraphs', dir: 'zh→ja', detect: jaHasResidue, cacheDir: JA_CACHE },
      { field: 'paragraphsKo', src: 'paragraphs', dir: 'zh→ko', detect: koHasResidue, cacheDir: KO_CACHE },
    ],
  },
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatArray(field: string, items: string[], indent: string): string {
  const inner = items.map((p) => `${indent}  ${JSON.stringify(p)},`).join('\n');
  return `${indent}${field}: [\n${inner}\n${indent}],`;
}

// Replace the whole `<field>: [ ... ],` array inside the brace-balanced body of
// record `id`. Brace-aware header location matches the existing scripts.
function injectFieldArray(source: string, id: string, field: string, items: string[]): string {
  const headerRe = new RegExp(`(\\n\\s{2,}['"]?${escapeRegex(id)}['"]?:\\s*\\{)`);
  const headerMatch = headerRe.exec(source);
  if (!headerMatch) throw new Error(`record header not found: ${id}`);
  const openIdx = headerMatch.index + headerMatch[0].length - 1;
  let depth = 1;
  let cursor = openIdx + 1;
  let inStr: string | null = null;
  while (cursor < source.length && depth > 0) {
    const ch = source[cursor];
    const prev = source[cursor - 1];
    if (inStr) {
      if (ch === inStr && prev !== '\\') inStr = null;
    } else if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
    else if (ch === '{') depth += 1;
    else if (ch === '}') depth -= 1;
    cursor += 1;
  }
  const closeIdx = cursor - 1;
  const body = source.slice(openIdx, closeIdx + 1);

  const fieldRe = new RegExp(`\\n(\\s+)${field}:\\s*\\[[\\s\\S]*?\\n\\1\\],`);
  const fm = fieldRe.exec(body);
  if (!fm) throw new Error(`field ${field} not found in record ${id}`);
  const indent = fm[1];
  const replacement = '\n' + formatArray(field, items, indent);
  const newBody = body.slice(0, fm.index) + replacement + body.slice(fm.index + fm[0].length);
  return source.slice(0, openIdx) + newBody + source.slice(closeIdx + 1);
}

async function main() {
  // 1) Collect residue items across all targets.
  type Item = { targetName: string; id: string; field: string; index: number; zh: string; dir: TranslateDirection; cacheDir: string };
  const items: Item[] = [];
  for (const t of TARGETS) {
    if (ONLY_FILE && t.name !== ONLY_FILE) continue;
    for (const [id, rec] of Object.entries(t.map)) {
      for (const f of t.fields) {
        const arr = rec[f.field] as string[] | undefined;
        const src = rec[f.src] as string[] | undefined;
        if (!Array.isArray(arr) || !Array.isArray(src)) continue;
        for (let i = 0; i < arr.length; i++) {
          if (f.detect(arr[i]) && typeof src[i] === 'string') {
            items.push({ targetName: t.name, id, field: f.field, index: i, zh: src[i], dir: f.dir, cacheDir: f.cacheDir });
          }
        }
      }
    }
  }
  process.stdout.write(`Found ${items.length} residue paragraphs across ${new Set(items.map((x) => x.targetName + '/' + x.id + '/' + x.field)).size} record-fields.\n`);
  const byField = new Map<string, number>();
  for (const it of items) byField.set(`${it.targetName}:${it.field}`, (byField.get(`${it.targetName}:${it.field}`) || 0) + 1);
  for (const [k, n] of [...byField.entries()].sort()) process.stdout.write(`  ${k}: ${n}\n`);
  if (DRY) {
    process.stdout.write('\n[dry-run] sample residue → will re-translate:\n');
    for (const it of items.slice(0, 8)) process.stdout.write(`  ${it.targetName}/${it.id}/${it.field}[${it.index}] ← zh: ${it.zh.slice(0, 80)}\n`);
    return;
  }
  if (items.length === 0) {
    process.stdout.write('Nothing to fix. ✅\n');
    return;
  }

  // 2) Re-translate unique (dir, zh) sources with force (hardened prompt).
  const jaSrc = [...new Set(items.filter((x) => x.dir === 'zh→ja').map((x) => x.zh))];
  const koSrc = [...new Set(items.filter((x) => x.dir === 'zh→ko').map((x) => x.zh))];
  process.stdout.write(`Re-translating ${jaSrc.length} unique zh→ja + ${koSrc.length} unique zh→ko sources ...\n`);
  const jaOut = jaSrc.length ? await translateBatch(jaSrc, { direction: 'zh→ja', cacheDir: JA_CACHE, force: true }) : [];
  const koOut = koSrc.length ? await translateBatch(koSrc, { direction: 'zh→ko', cacheDir: KO_CACHE, force: true }) : [];
  const jaMap = new Map(jaSrc.map((s, i) => [s, jaOut[i]]));
  const koMap = new Map(koSrc.map((s, i) => [s, koOut[i]]));

  // 3) Verify residue-free; warn on stragglers.
  let straggler = 0;
  for (const it of items) {
    const nt = it.dir === 'zh→ja' ? jaMap.get(it.zh) : koMap.get(it.zh);
    const detect = it.dir === 'zh→ja' ? jaHasResidue : koHasResidue;
    if (typeof nt !== 'string' || detect(nt)) {
      straggler += 1;
      process.stdout.write(`  ⚠ still-residue ${it.targetName}/${it.id}/${it.field}[${it.index}]\n`);
    }
  }
  process.stdout.write(`Stragglers still with residue after retranslate: ${straggler}\n`);

  // 4) Apply: per (target,record,field) rebuild the array with fixed indices, inject.
  let recordFieldsFixed = 0;
  for (const t of TARGETS) {
    if (ONLY_FILE && t.name !== ONLY_FILE) continue;
    const groups = new Map<string, Item[]>();
    for (const it of items) if (it.targetName === t.name) {
      const k = `${it.id}::${it.field}`;
      (groups.get(k) || groups.set(k, []).get(k)!).push(it);
    }
    if (groups.size === 0) continue;
    let source = readFileSync(t.file, 'utf8');
    let applied = 0;
    for (const [k, its] of groups) {
      if (applied >= LIMIT) break;
      const [id, field] = k.split('::');
      const arr = [...(t.map[id][field] as string[])];
      let changed = false;
      for (const it of its) {
        const nt = it.dir === 'zh→ja' ? jaMap.get(it.zh) : koMap.get(it.zh);
        const detect = it.dir === 'zh→ja' ? jaHasResidue : koHasResidue;
        if (typeof nt === 'string' && !detect(nt)) {
          arr[it.index] = nt;
          changed = true;
        }
      }
      if (!changed) continue;
      source = injectFieldArray(source, id, field, arr);
      applied += 1;
      recordFieldsFixed += 1;
    }
    writeFileSync(t.file, source);
    process.stdout.write(`  ${t.name}: injected ${applied} record-fields → ${t.file}\n`);
  }
  process.stdout.write(`\nDone. record-fields fixed: ${recordFieldsFixed}, stragglers: ${straggler}\n`);
}

await main();
