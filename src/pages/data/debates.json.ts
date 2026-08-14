// /data/debates.json — static machine-readable export (P2-4).
// Same records the /debates/ pages render, minus transcript bodies.
// Linked from the CiteBlock-class pages so researchers can pull the
// dataset instead of scraping HTML.

import { debates } from '~/data/debates';

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
  }));
  return new Response(JSON.stringify(rows, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
