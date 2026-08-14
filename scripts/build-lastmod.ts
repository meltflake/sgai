// scripts/build-lastmod.ts
// ────────────────────────────────────────────────────────────────────────
// Pre-build step (P2-5): materialises the URL → lastmod map for sitemap
// serialization. astro.config.ts cannot import src/data directly — the
// config is evaluated without the `~` alias resolution that data files
// rely on — so this script (run inside the npm build chain, where tsx
// resolves aliases normally) writes the map to
// scripts/data/lastmod-map.json, which astro.config reads via fs.
//
// Map source: harvestAll() from the derived updates feed — every data
// record's addedAt and every manual longform entry, the same freshness
// signal the homepage "最近更新" module uses.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { harvestAll } from '../src/utils/derived-updates';

const outPath = resolve(import.meta.dirname, 'data/lastmod-map.json');

const map = new Map<string, string>();
for (const h of harvestAll()) {
  const p = h.href.startsWith('/') ? h.href : `/${h.href}`;
  const existing = map.get(p);
  if (!existing || h.addedAt > existing) map.set(p, h.addedAt);
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(Object.fromEntries(map), null, 2) + '\n');
process.stdout.write(`[build-lastmod] wrote ${map.size} path → date entries to scripts/data/lastmod-map.json\n`);
