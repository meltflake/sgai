// scripts/refresh/signals/page.ts
// Turn a fetched page into a judgeable candidate (headline, publication
// date, body) or a skip reason, plus small text cleanups for drafted fields.
// Lessons from the first live run (2026-10-17):
//   - an IMDA press release renders client-side; the fetched body was 361
//     characters and the draft was written from the title alone → MIN_BODY.
//   - EDB's metadata date is its repost date (AST: released 29 Sep, reposted
//     7 Oct) → a source may name a visible-date pattern that wins.
//   - a last-modified time says nothing about first publication.

import type { GovPage } from '../../lib/gov-fetch.ts';
import { parseDateLoose } from '../../lib/stale-gate.ts';
import { decodeEntities, type SignalCandidate } from './scan.ts';
import { withinWindow } from './select.ts';

export const MIN_BODY_CHARS = 800;

const MONTHS: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

/** "29 Sept 2026" / "8 October 2026" → YYYY-MM-DD. */
function dayMonthYear(s: string): string | null {
  const m = s.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  const month = m ? MONTHS[m[2].slice(0, 3).toLowerCase()] : undefined;
  return m && month ? `${m[3]}-${month}-${m[1].padStart(2, '0')}` : null;
}

export type ResolvedCandidate = { title: string; date: string; text: string } | { skip: string };

export function resolveCandidate(
  page: Pick<GovPage, 'title' | 'publishedDate' | 'publishedDateSource' | 'contentText'>,
  c: SignalCandidate,
  opts: { today: string; days: number; visibleDate?: RegExp }
): ResolvedCandidate {
  const text = page.contentText || '';
  if (text.length < MIN_BODY_CHARS) return { skip: `thin body (${text.length} chars)` };

  let date: string | null = null;
  const visible = opts.visibleDate ? text.match(opts.visibleDate) : null;
  if (visible) date = dayMonthYear(visible[1]);
  if (!date && page.publishedDateSource !== 'modified') date = parseDateLoose(page.publishedDate);
  if (!date && c.kind === 'rss') date = c.hintedDate ?? null;
  if (!withinWindow(date, opts.today, opts.days)) return { skip: `date ${date ?? 'unknown'} outside window` };

  const title = decodeEntities(c.title || page.title).replace(/\s*\|\s*[^|]{1,40}$/, '').trim();
  return { title, date: date!, text };
}

/** Headlines carry no sentence-final punctuation (。．.！!). */
export function cleanHeadline(s: string): string {
  return s.trim().replace(/[。．.！!]+$/u, '').trim();
}

const HAN = '\\u4e00-\\u9fff';
/** One space between Chinese characters and Latin letters / digits (site style). */
export function spaceCjkLatin(s: string): string {
  return s
    .replace(new RegExp(`([${HAN}])([A-Za-z0-9])`, 'g'), '$1 $2')
    .replace(new RegExp(`([A-Za-z0-9*$%])([${HAN}])`, 'g'), '$1 $2');
}
