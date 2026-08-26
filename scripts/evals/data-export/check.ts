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
// Run: npm run check:data-export   (part of npm run check:dist)
//
// Exit codes:
//   0 — every dist/data/*.json satisfies the contract
//   1 — at least one violation (file + reason printed)
//   2 — dist/data missing or empty (build first)

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

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

/** Both layers for one parsed file. */
export function checkFile(file: string, data: unknown): Violation[] {
  const out = checkEnvelope(file, data);
  const items = (data as { items?: unknown } | null)?.items;
  if (Array.isArray(items)) out.push(...checkItems(file, items));
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

  const violations: Violation[] = [];
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

  console.log(`✓ data-export: ${files.length} export(s) carry a valid envelope`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) process.exit(main());
