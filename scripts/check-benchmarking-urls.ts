#!/usr/bin/env tsx
// HEAD-checks every analysisSources[].url written into RegionDetail.drilldownEnrichments.
// Per CLAUDE.md rule #6 (sourceUrl 真实性约定): drilldown enrichment pipelines
// must HEAD-verify all source URLs before they ship; broken URLs in the data
// file silently degrade trust and SEO signal.
//
// Run:
//   npx tsx scripts/check-benchmarking-urls.ts
//   # exit 0 = all reachable, exit 2 = at least one broken (diagnostic printed)
//
// Doesn't touch the network for stub / un-enriched drilldowns — they have no
// analysisSources to check.

import { regionDetails } from '../src/data/benchmarking';
import { validateUrls, type UrlCheckEntry } from './lib/url-check';

function collectBenchmarkUrls(): UrlCheckEntry[] {
  const out: UrlCheckEntry[] = [];
  for (const region of regionDetails) {
    const enrichments = region.drilldownEnrichments;
    if (!enrichments) continue;
    for (const [localId, enrichment] of Object.entries(enrichments)) {
      const sources = enrichment.sources;
      if (!sources) continue;
      sources.forEach((source, i) => {
        if (typeof source.url !== 'string' || !/^https?:\/\//i.test(source.url)) return;
        out.push({
          url: source.url,
          context: `${region.nameEn || region.name} · ${localId} · sources[${i}]`,
        });
      });
    }
  }
  return out;
}

async function main(): Promise<void> {
  const entries = collectBenchmarkUrls();
  if (entries.length === 0) {
    console.log('[check-benchmarking-urls] No analysisSources[].url to validate yet.');
    return;
  }
  console.log(`[check-benchmarking-urls] Checking ${entries.length} URL(s)…`);
  const broken = await validateUrls(entries, { concurrency: 6, timeoutMs: 12000 });
  if (broken.length === 0) {
    console.log(`[check-benchmarking-urls] OK — all ${entries.length} URLs reachable.`);
    return;
  }
  console.error(`[check-benchmarking-urls] ${broken.length} broken URL(s):`);
  for (const item of broken) {
    console.error(`  [${item.status}] ${item.context} — ${item.url}`);
  }
  process.exit(2);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
