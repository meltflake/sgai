// /data/debates.json — static machine-readable export (P2-4).
// Same records the /debates/ pages render, minus transcript bodies.
// Linked from the CiteBlock-class pages so researchers can pull the
// dataset instead of scraping HTML.
//
// 2026-08: wrapped in the shared envelope (schemaVersion / license /
// attribution / count / items) and each row gained `links` — the five
// locale page URLs plus the original Hansard source. BREAKING for anyone
// who read the top-level array: rows now live under `.items`.

import { debates } from '~/data/debates';
import { envelope, recordLinks } from '~/utils/data-export';

export const prerender = true;

export const GET = () => {
  const rows = debates.map((d) => ({
    id: d.id,
    date: d.date,
    type: d.type,
    title: d.title,
    titleEn: d.titleEn,
    summary: d.summary,
    summaryEn: d.summaryEn,
    topics: d.topics,
    speakers: d.speakers,
    sourceUrl: d.sourceUrl,
    links: recordLinks(`/debates/${d.id}/`, d.sourceUrl),
  }));
  return new Response(JSON.stringify(envelope('debates', rows), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
