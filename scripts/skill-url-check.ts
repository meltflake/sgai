// Validate every concrete URL in skill/url-map.json is reachable.
//
// Skill release gate: run before publishing a new SKILL.md / url-map.json
// version. Catches URL drift when sgai.md pages are renamed without
// updating the skill's URL contract.
//
// Usage: tsx scripts/skill-url-check.ts
// Exit 0 = all good. Exit 1 = at least one broken URL.

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { validateUrls, type UrlCheckEntry } from './lib/url-check.ts';

type DomainEntry = {
  id: string;
  intent: string;
  list?: { zh: string; en: string };
  detail?: { zh: string; en: string };
  validIds?: string[];
};

type UrlMap = {
  primaryIndex: { url: string };
  shortIndex: { url: string };
  domains: DomainEntry[];
};

function isConcrete(url: string): boolean {
  // Patterns like /policies/{id} are templates, not URLs to check.
  return !url.includes('{');
}

async function main() {
  const mapPath = resolve(import.meta.dirname, '../skill/url-map.json');
  const raw = await readFile(mapPath, 'utf8');
  const map: UrlMap = JSON.parse(raw);

  const entries: UrlCheckEntry[] = [];

  entries.push({ url: map.primaryIndex.url, context: 'primaryIndex' });
  entries.push({ url: map.shortIndex.url, context: 'shortIndex' });

  for (const d of map.domains) {
    if (d.list) {
      if (isConcrete(d.list.zh)) entries.push({ url: d.list.zh, context: `${d.id}.list.zh` });
      if (isConcrete(d.list.en)) entries.push({ url: d.list.en, context: `${d.id}.list.en` });
    }
    // Detail templates: expand with validIds if provided (e.g., levers 1-6).
    if (d.detail && d.validIds) {
      for (const id of d.validIds) {
        const zh = d.detail.zh.replace(/\{[^}]+\}/g, id);
        const en = d.detail.en.replace(/\{[^}]+\}/g, id);
        entries.push({ url: zh, context: `${d.id}.detail.zh[${id}]` });
        entries.push({ url: en, context: `${d.id}.detail.en[${id}]` });
      }
    }
  }

  console.log(`Checking ${entries.length} URL(s) from skill/url-map.json...`);
  const broken = await validateUrls(entries, { concurrency: 6, timeoutMs: 12000 });

  if (broken.length === 0) {
    console.log('OK: all URLs reachable.');
    return;
  }

  console.error(`FAIL: ${broken.length} broken URL(s):`);
  for (const b of broken) {
    console.error(`  [${b.context ?? '?'}] ${b.url} → ${b.status}`);
  }
  process.exit(1);
}

main().catch((err) => {
  console.error('skill-url-check crashed:', err);
  process.exit(1);
});
