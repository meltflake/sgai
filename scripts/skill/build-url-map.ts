// scripts/skill/build-url-map.ts
// ────────────────────────────────────────────────────────────────────────
// Regenerate the `validIds` arrays in skill/url-map.json from the live data
// files, so the skill's detail-page templates (`/policies/{id}`,
// `/debates/{id}`) can be expanded into real URLs by consumers — and by
// `npm run check:skill-urls`, which HEAD-checks every expansion.
//
// Everything else in the file is hand-maintained: this script rewrites ONLY
// `domains[].validIds` for `policies` and `debates`, preserving key order
// for every other field.
//
// Usage: npm run skill:build-url-map
//
// Run it whenever policies.ts / debates.ts gain or lose records, then commit
// the regenerated skill/url-map.json (public/skill/ is generated at build
// time from it by scripts/publish-skill.mjs — never edit that copy).

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { format, resolveConfig } from 'prettier';

import { categories } from '../../src/data/policies.ts';
import { debates } from '../../src/data/debates.ts';

const REPO_ROOT = resolve(import.meta.dirname, '../..');
const MAP_PATH = resolve(REPO_ROOT, 'skill/url-map.json');

/** Domains whose detail template is expandable from a data file. */
const VALID_IDS: Record<string, () => string[]> = {
  policies: () => categories.flatMap((cat) => cat.policies.map((p) => p.id).filter((id): id is string => Boolean(id))),
  debates: () => debates.map((d) => d.id),
};

interface Domain {
  id: string;
  validIds?: string[];
  [key: string]: unknown;
}

interface UrlMap {
  domains: Domain[];
  [key: string]: unknown;
}

async function main() {
  const map: UrlMap = JSON.parse(readFileSync(MAP_PATH, 'utf8'));

  for (const domain of map.domains) {
    const collect = VALID_IDS[domain.id];
    if (!collect) continue;
    const ids = [...new Set(collect())].sort();
    if (ids.length === 0) {
      throw new Error(`No ids collected for domain "${domain.id}" — refusing to write an empty validIds array.`);
    }
    // Assign through a rebuild so `validIds` always lands last in the object,
    // whether or not the key already existed (stable diffs across runs).
    delete domain.validIds;
    domain.validIds = ids;
    console.log(`${domain.id}: ${ids.length} validIds`);
  }

  const json = JSON.stringify(map, null, 2);
  const prettierConfig = await resolveConfig(MAP_PATH);
  const formatted = await format(json, { ...prettierConfig, filepath: MAP_PATH });
  writeFileSync(MAP_PATH, formatted);
  console.log(`Wrote ${MAP_PATH}`);
}

main().catch((err) => {
  console.error('build-url-map failed:', err);
  process.exit(1);
});
