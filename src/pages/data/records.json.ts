// /data/records.json — one row per dated record on the site.
//
// The machine twin of the homepage "Recent updates" feed and of
// updates.rss.xml: everything src/utils/derived-updates.ts harvests, which
// is every record in every data file that carries an `addedAt` stamp —
// debates, policies, videos, people, speeches, tracker dimensions,
// benchmarking, ecosystem, levers, startups, legal-ai, talent, capital.
//
// This is the endpoint to poll if you only want to know what is new: one
// flat, cross-domain, addedAt-sorted list, four languages per row, with a
// direct link per locale. Records predating the addedAt rule are skipped
// (they have no honest "when did this appear" answer).

import { harvestAll } from '~/utils/derived-updates';
import { envelope, recordLinks } from '~/utils/data-export';

export const prerender = true;

export const GET = () => {
  // Newest first. Array.prototype.sort is stable, so records sharing an
  // addedAt keep harvest (data-file) order — the byte output only moves
  // when the data moves.
  const harvested = [...harvestAll()].sort((a, b) => (a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0));

  const rows = harvested.map((h) => {
    const summary =
      h.zhSummary || h.enSummary || h.jaSummary || h.koSummary
        ? {
            zh: h.zhSummary ?? null,
            en: h.enSummary ?? null,
            ja: h.jaSummary ?? null,
            ko: h.koSummary ?? null,
          }
        : null;
    return {
      type: h.type,
      source: h.source,
      id: h.id ?? null,
      addedAt: h.addedAt,
      eventDate: h.eventDate ?? null,
      title: { zh: h.zhTitle, en: h.enTitle, ja: h.jaTitle, ko: h.koTitle },
      summary,
      links: recordLinks(h.href),
    };
  });

  return new Response(JSON.stringify(envelope('records', rows), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
