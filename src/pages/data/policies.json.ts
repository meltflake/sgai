// /data/policies.json — static machine-readable export (P2-4).
//
// 2026-08: envelope + per-row `links` (see src/utils/data-export.ts).
// BREAKING: rows moved from the top-level array to `.items`.

import { categories } from '~/data/policies';
import { envelope, recordLinks } from '~/utils/data-export';

export const prerender = true;

export const GET = () => {
  const rows = categories.flatMap((cat) =>
    cat.policies.map((p) => ({
      id: p.id ?? null,
      category: cat.name,
      categoryEn: cat.nameEn,
      title: p.title,
      titleEn: p.titleEn,
      date: p.date,
      source: p.source,
      sourceEn: p.sourceEn,
      sourceUrl: p.sourceUrl,
      summary: p.summary,
      summaryEn: p.summaryEn,
      // Id-less policies have no detail page; link the listing instead —
      // an honest link beats a 404.
      links: recordLinks(p.id ? `/policies/${p.id}/` : '/policies/', p.sourceUrl),
    }))
  );
  return new Response(JSON.stringify(envelope('policies', rows), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
