// scripts/refresh/reg-lookahead/bills.ts
// ────────────────────────────────────────────────────────────────────────
// Parser for parliament.gov.sg/parliamentary-business/bills-introduced.
// The bills list is server-rendered as repeated `indv-bill` blocks
// (verified live 2026-08-03; fixture in __tests__/fixtures/):
//
//   <div class="indv-bill">
//     <div class="row bill-title 2">
//       <a href="/api/media/<id>/<slug>.pdf">TITLE (PDF, 166.73 KB)</a>
//       ... <b>Bill No:</b> 12/2026
//     </div>
//     <div class="row">
//       <b>Date Introduced:</b> ... 07.04.2026
//       <b>Date of 2nd Reading:</b> ... 07.05.2026
//       <b>Date Passed:</b> ... 07.05.2026
//     </div>
//   </div>
//
// Dates are DD.MM.YYYY; a stage not yet reached simply has no date. Pure
// functions — the fixture test pins the markup contract so a layout
// change fails loudly in CI instead of silently emitting nothing.

import type { BillStage } from '../../../src/data/reg-lookahead.ts';

export interface ParsedBill {
  title: string;
  billNumber?: string;
  pdfUrl?: string;
  introducedAt?: string;
  secondReadingAt?: string;
  passedAt?: string;
}

const DATE_RE = /(\d{2})\.(\d{2})\.(\d{4})/;

function toIso(ddmmyyyy: string | undefined): string | undefined {
  if (!ddmmyyyy) return undefined;
  const m = ddmmyyyy.match(DATE_RE);
  if (!m) return undefined;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function fieldDate(block: string, label: string): string | undefined {
  // <b>Date Introduced:</b> <br/> <!-- -->07.04.2026
  const re = new RegExp(`<b>\\s*${label}\\s*:?\\s*</b>[\\s\\S]{0,80}?(\\d{2}\\.\\d{2}\\.\\d{4})`);
  return toIso(block.match(re)?.[1]);
}

export function parseBillsPage(html: string): ParsedBill[] {
  const out: ParsedBill[] = [];
  const blocks = html.split('<div class="indv-bill">').slice(1);
  for (const block of blocks) {
    const titleRaw = block.match(/<a[^>]+href="([^"]+\.pdf)"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/);
    if (!titleRaw) continue;
    const pdfPath = titleRaw[1];
    const title = titleRaw[2]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s*\(PDF[^)]*\)\s*/i, '')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
    if (!title) continue;
    const billNumber = block.match(/<b>\s*Bill No\s*:?\s*<\/b>[\s\S]{0,40}?(\d+\/\d{4})/)?.[1];
    out.push({
      title,
      billNumber,
      pdfUrl: pdfPath.startsWith('http') ? pdfPath : `https://www.parliament.gov.sg${pdfPath}`,
      introducedAt: fieldDate(block, 'Date Introduced'),
      secondReadingAt: fieldDate(block, 'Date of 2nd Reading'),
      passedAt: fieldDate(block, 'Date Passed'),
    });
  }
  return out;
}

/** Observed stage from the dates present. 'assented' is not shown on this
 *  page — it is observed later from Gazette/SSO presence; 'passed' is the
 *  terminal stage this scanner can see. */
export function stageFromDates(b: ParsedBill): BillStage {
  if (b.passedAt) return 'passed';
  if (b.secondReadingAt) return 'second-reading';
  return 'introduced';
}

/** Keyword prefilter before spending a judge call — AI/digital nexus only.
 *  Broad on purpose; the judge is the real gate. */
export const BILL_PREFILTER =
  /(artificial.intelligence|\bai\b|digital|data|online|cyber|info.?comm|communications|media|technology|computer|telecom|electronic)/i;

export function slugifyBillTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[()',.]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
