// /data/policies.json — static machine-readable export (P2-4).

import { categories } from '~/data/policies';

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
    }))
  );
  return new Response(JSON.stringify(rows, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
