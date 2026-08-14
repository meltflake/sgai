// /data/debates.csv — CSV export (P2-4). Header row + one row per debate.

import { debates } from '~/data/debates';

export const prerender = true;

const esc = (v: string | undefined | null) => {
  const s = (v ?? '').replace(/"/g, '""');
  return `"${s}"`;
};

export const GET = () => {
  const header = ['id', 'date', 'type', 'title', 'titleEn', 'topics', 'speakers', 'sourceUrl'].join(',');
  const lines = debates.map((d) =>
    [
      d.id,
      d.date,
      d.type,
      esc(d.title),
      esc(d.titleEn),
      esc(d.topics.join('; ')),
      esc(d.speakers.join('; ')),
      d.sourceUrl,
    ].join(',')
  );
  return new Response([header, ...lines].join('\n'), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
  });
};
