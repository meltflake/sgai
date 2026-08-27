// /data/tracker.json — the six-dimension tracker as data (P2-4).
// Dimension headlines, judgment, anchors and metric rows — the same
// content the /tracker/ pages render, minus prose formatting.
//
// 2026-08: envelope + per-row `links` (see src/utils/data-export.ts).
// BREAKING: rows moved from the top-level array to `.items`.

import { dimensions } from '~/data/tracker';
import { envelope, recordLinks } from '~/utils/data-export';

export const prerender = true;

export const GET = () => {
  const rows = dimensions.map((d) => ({
    id: d.id,
    kind: d.kind,
    title: d.title,
    titleEn: d.titleEn,
    headline: d.kind === 'quantified' ? d.headline : null,
    headlineEn: d.kind === 'quantified' ? (d.headlineEn ?? null) : null,
    headlineAsOf:
      d.kind === 'quantified' && 'headlineAsOf' in d ? ((d as { headlineAsOf?: string }).headlineAsOf ?? null) : null,
    badge: d.kind === 'qualitative' ? d.badge : null,
    badgeEn: d.kind === 'qualitative' ? (d.badgeEn ?? null) : null,
    asOfDate: d.kind === 'qualitative' && 'asOfDate' in d ? ((d as { asOfDate?: string }).asOfDate ?? null) : null,
    trend: d.trend,
    anchors: d.rankingAnchors.map((a) => ({
      source: a.source,
      sourceEn: a.sourceEn ?? null,
      rank: a.rank,
      rankEn: a.rankEn ?? null,
      url: a.url,
    })),
    metrics: d.metrics.map((m) => ({
      name: m.name,
      nameEn: m.nameEn ?? null,
      value: m.value,
      valueEn: m.valueEn ?? null,
      source: m.source,
      sourceEn: m.sourceEn ?? null,
      sourceUrl: m.sourceUrl,
      asOfDate: 'asOfDate' in m ? ((m as { asOfDate?: string }).asOfDate ?? null) : null,
    })),
    links: recordLinks(`/tracker/${d.id}/`),
  }));
  return new Response(JSON.stringify(envelope('tracker', rows), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
