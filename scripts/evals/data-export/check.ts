// scripts/evals/data-export/check.ts
// ────────────────────────────────────────────────────────────────────────
// Dist-layer gate for the /data/*.json exports.
//
// Why a build-artifact gate and not just types: the envelope's promises are
// promises to *downstream* users, and none of them are expressible in the
// type system. `count === items.length` can drift the moment someone
// filters rows after wrapping. `dataset` matching the filename can drift on
// a copy-paste of one endpoint into the next (the exact way these six files
// were written). And `links.sgai` — the whole reason the envelope exists,
// because a bare array cannot be cited — silently loses a locale the day
// LOCALES grows or someone hand-builds a URL instead of calling
// recordLinks(). All three are cheap to assert against the real bytes we
// are about to ship, and impossible to assert anywhere else.
//
// Two of the assertions guard the gate itself rather than the data:
// EXPECTED_DATASETS pins the six filenames so a route that stops emitting
// shrinks the sample loudly instead of silently, and checkRecordsOrder()
// holds records.json to the newest-first ordering that openapi.json and the
// /agent/ page promise consumers.
//
// Run: npm run check:data-export   (part of npm run check:dist)
//
// Exit codes:
//   0 — every dist/data/*.json satisfies the contract
//   1 — at least one violation (file + reason printed)
//   2 — dist/data missing or empty (build first)

import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(import.meta.dirname, '../../..');
const DIST_DATA = join(REPO_ROOT, 'dist/data');

export const SITE_ORIGIN = 'https://sgai.md';
export const DATA_LICENSE_URL = 'https://github.com/meltflake/sgai/blob/main/DATA-LICENSE.md';

/** Locale key → URL path prefix. English is the route default: no prefix. */
export const LOCALE_PREFIX: Record<string, string> = {
  en: '',
  zh: '/zh',
  'zh-tw': '/zh-tw',
  ja: '/ja',
  ko: '/ko',
};

export const LOCALE_KEYS = Object.keys(LOCALE_PREFIX);

/**
 * The exports that must exist. Listing them by name (rather than trusting
 * whatever readdir returns) is the difference between "all six datasets are
 * healthy" and "the four that happened to build are healthy". A route that
 * stops emitting — a renamed file, a `prerender = false`, a page that threw
 * during build — would otherwise shrink the sample silently and still pass.
 */
export const EXPECTED_DATASETS = ['debates', 'index', 'policies', 'records', 'tracker', 'videos'];

export interface Violation {
  file: string;
  reason: string;
}

// ── Assertions (pure; unit-tested) ──────────────────────────────────────

/**
 * Envelope-level contract: version, dataset↔filename agreement, count
 * honesty, license pointer.
 */
export function checkEnvelope(file: string, data: unknown): Violation[] {
  const out: Violation[] = [];
  const push = (reason: string) => out.push({ file, reason });

  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    push('top level is not an object — a bare array means the envelope was lost');
    return out;
  }
  const env = data as Record<string, unknown>;

  if (env.schemaVersion !== 1) push(`schemaVersion is ${JSON.stringify(env.schemaVersion)}, expected 1`);

  const expectedDataset = file.replace(/\.json$/, '');
  if (env.dataset !== expectedDataset)
    push(`dataset is ${JSON.stringify(env.dataset)}, expected ${JSON.stringify(expectedDataset)} (the filename)`);

  if (!Array.isArray(env.items)) {
    push('items is not an array');
    return out;
  }
  if (env.count !== env.items.length) push(`count is ${JSON.stringify(env.count)} but items.length is ${env.items.length}`);

  const license = env.license as { terms?: unknown } | undefined;
  if (!license || typeof license !== 'object') push('license block is missing');
  else if (license.terms !== DATA_LICENSE_URL)
    push(`license.terms is ${JSON.stringify(license.terms)}, expected ${DATA_LICENSE_URL}`);

  return out;
}

/**
 * Per-item contract. Only items that CARRY links.sgai are checked (the
 * index dataset's rows describe files, not pages, and have none) — but an
 * item that carries it must carry all five locales, each absolute and each
 * under the prefix its key promises.
 */
export function checkItems(file: string, items: unknown[]): Violation[] {
  const out: Violation[] = [];
  const push = (reason: string) => out.push({ file, reason });
  const dataset = file.replace(/\.json$/, '');

  items.forEach((raw, i) => {
    if (raw === null || typeof raw !== 'object') {
      push(`items[${i}] is not an object`);
      return;
    }
    const item = raw as Record<string, unknown>;
    const links = item.links as { sgai?: unknown } | undefined;

    if (links && typeof links === 'object' && links.sgai !== undefined) {
      const sgai = links.sgai;
      if (sgai === null || typeof sgai !== 'object' || Array.isArray(sgai)) {
        push(`items[${i}].links.sgai is not an object`);
      } else {
        const map = sgai as Record<string, unknown>;
        for (const lang of LOCALE_KEYS) {
          const url = map[lang];
          if (typeof url !== 'string' || url.length === 0) {
            push(`items[${i}].links.sgai is missing locale "${lang}"`);
            continue;
          }
          if (!url.startsWith(`${SITE_ORIGIN}/`)) {
            push(`items[${i}].links.sgai.${lang} is not an absolute ${SITE_ORIGIN} URL: ${url}`);
            continue;
          }
          const path = url.slice(SITE_ORIGIN.length);
          const prefix = LOCALE_PREFIX[lang];
          const ok = prefix === '' ? !isPrefixed(path) : path === prefix || path.startsWith(`${prefix}/`);
          if (!ok) push(`items[${i}].links.sgai.${lang} does not sit under "${prefix || '/'}": ${url}`);
        }
      }
    }

    if (dataset === 'records') {
      const title = item.title as Record<string, unknown> | undefined;
      const en = title && typeof title === 'object' ? title.en : undefined;
      if (typeof en !== 'string' || en.trim() === '') push(`items[${i}].title.en is empty`);
    }
  });

  return out;
}

/** Does this path already carry a non-default locale prefix? */
function isPrefixed(path: string): boolean {
  return LOCALE_KEYS.some((lang) => {
    const p = LOCALE_PREFIX[lang];
    return p !== '' && (path === p || path.startsWith(`${p}/`));
  });
}

/**
 * Every dataset in EXPECTED_DATASETS must be present. `found` is the list of
 * .json basenames actually in dist/data.
 */
export function checkExpectedFiles(found: string[]): Violation[] {
  const have = new Set(found.map((f) => f.replace(/\.json$/, '')));
  return EXPECTED_DATASETS.filter((d) => !have.has(d)).map((d) => ({
    file: `${d}.json`,
    reason: 'expected export is missing from dist/data — the route stopped emitting',
  }));
}

/**
 * records.json promises newest-first ordering, in openapi.json and on the
 * /agent/ page. A consumer polling for what is new reads the head of the
 * array and stops; if the order silently flips, they see the oldest records
 * forever and nothing errors. So assert the promise.
 */
export function checkRecordsOrder(file: string, items: unknown[]): Violation[] {
  const out: Violation[] = [];
  let prev: string | undefined;
  items.forEach((raw, i) => {
    const addedAt = (raw as { addedAt?: unknown } | null)?.addedAt;
    if (typeof addedAt !== 'string' || addedAt === '') {
      out.push({ file, reason: `items[${i}].addedAt is missing — cannot verify ordering` });
      return;
    }
    if (prev !== undefined && addedAt > prev)
      out.push({ file, reason: `items[${i}].addedAt (${addedAt}) is newer than items[${i - 1}] (${prev}) — not sorted descending` });
    prev = addedAt;
  });
  return out;
}

/** Both layers for one parsed file. */
export function checkFile(file: string, data: unknown): Violation[] {
  const out = checkEnvelope(file, data);
  const items = (data as { items?: unknown } | null)?.items;
  if (Array.isArray(items)) {
    out.push(...checkItems(file, items));
    if (file === 'records.json') out.push(...checkRecordsOrder(file, items));
  }
  return out;
}

// ── CLI ─────────────────────────────────────────────────────────────────

function main(): number {
  if (!existsSync(DIST_DATA)) {
    console.error(`✗ ${DIST_DATA} does not exist — run \`npm run build\` first.`);
    return 2;
  }
  const files = readdirSync(DIST_DATA).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.error(`✗ ${DIST_DATA} contains no .json exports — run \`npm run build\` first.`);
    return 2;
  }

  const violations: Violation[] = checkExpectedFiles(files);
  for (const file of files.sort()) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(join(DIST_DATA, file), 'utf8'));
    } catch (err) {
      violations.push({ file, reason: `does not parse as JSON: ${(err as Error).message}` });
      continue;
    }
    violations.push(...checkFile(file, parsed));
  }

  if (violations.length > 0) {
    console.error(`✗ data-export: ${violations.length} violation(s)\n`);
    // Long runs of the same failure per file are the norm (one bad locale
    // key repeats across every row); cap so the log stays readable.
    let shown = 0;
    for (const v of violations) {
      if (shown++ >= 40) {
        console.error(`  … and ${violations.length - 40} more`);
        break;
      }
      console.error(`  dist/data/${v.file}: ${v.reason}`);
    }
    return 1;
  }

  console.log(`✓ data-export: ${files.length} export(s) carry a valid envelope (${EXPECTED_DATASETS.join(', ')})`);
  return 0;
}

/** Run as CLI only — importing this module from a unit test must not fire
 *  fs reads or process.exit.
 *
 *  Why realpath and not a string compare against import.meta.url: the naive
 *  form silently no-ops whenever argv[1] is a symlink or carries a
 *  percent-encoded character, and a gate that no-ops is worse than no gate —
 *  check:dist would pass having checked nothing. Same shape as
 *  scripts/evals/i18n-coverage/check.ts and source-i18n-hardcode/check.ts. */
function isEntryPoint(): boolean {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isEntryPoint()) process.exit(main());
