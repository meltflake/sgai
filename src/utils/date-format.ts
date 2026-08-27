// src/utils/date-format.ts
// ────────────────────────────────────────────────────────────────────────
// Locale-aware date formatting for the updates feed (day headers, week
// ranges, month headers, per-record event dates) plus the two ISO-date
// arithmetic helpers the feed grouping needs.
//
// All inputs are ISO strings ('YYYY-MM-DD', 'YYYY-MM' or 'YYYY'); parsing is
// done in UTC so a build on any machine yields identical output.
//
// zh-tw: the characters used here (年 月 日 星期 一…日) are identical in
// Simplified and Traditional, so zh-tw shares the zh branch via
// `lang.startsWith('zh')` — no OpenCC pass needed and no `=== 'zh-tw'`
// branch for check:zh-tw-renderers to flag.

import type { Lang } from '~/i18n';

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EN_MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const EN_WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ZH_WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const JA_WEEKDAYS = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
const KO_WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_MONTH = /^\d{4}-\d{2}$/;
const ISO_YEAR = /^\d{4}$/;

function parts(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map((s) => parseInt(s, 10));
  return { y, m, d };
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function toIso(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

/** 'YYYY-MM-DD' ± days, computed in UTC. */
export function shiftIsoDate(iso: string, days: number): string {
  const { y, m, d } = parts(iso);
  return toIso(new Date(Date.UTC(y, m - 1, d + days)));
}

/** 0 = Sunday … 6 = Saturday. */
export function weekdayIndex(iso: string): number {
  const { y, m, d } = parts(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Monday of the ISO week containing `iso`. */
export function startOfIsoWeek(iso: string): string {
  const wd = weekdayIndex(iso);
  return shiftIsoDate(iso, wd === 0 ? -6 : 1 - wd);
}

/** 'YYYY-MM' → '2026 年 8 月' / 'August 2026' / '2026年8月' / '2026년 8월'. */
export function formatMonth(ym: string, lang: Lang): string {
  const [y, m] = ym.split('-');
  const mn = parseInt(m, 10);
  if (lang === 'en') return `${EN_MONTHS_LONG[mn - 1]} ${y}`;
  if (lang === 'ja') return `${y}年${mn}月`;
  if (lang === 'ko') return `${y}년 ${mn}월`;
  return `${y} 年 ${mn} 月`;
}

/** 'YYYY-MM-DD' → '8月14日 · 星期五' / 'Aug 14 · Friday' / '8月14日 · 金曜日' / '8월 14일 · 금요일'. */
export function formatDayHeader(iso: string, lang: Lang): string {
  const { m, d } = parts(iso);
  const wd = weekdayIndex(iso);
  if (lang === 'en') return `${EN_MONTHS[m - 1]} ${d} · ${EN_WEEKDAYS[wd]}`;
  if (lang === 'ja') return `${m}月${d}日 · ${JA_WEEKDAYS[wd]}`;
  if (lang === 'ko') return `${m}월 ${d}일 · ${KO_WEEKDAYS[wd]}`;
  return `${m}月${d}日 · ${ZH_WEEKDAYS[wd]}`;
}

/** Monday..Sunday range → '8月18日–24日' / 'Aug 18–24' / '8月18日〜24日' / '8월 18일–24일'
 *  (month repeated when the week crosses a month boundary). */
export function formatWeekRange(start: string, end: string, lang: Lang): string {
  const a = parts(start);
  const b = parts(end);
  const sameMonth = a.m === b.m;
  if (lang === 'en') {
    return sameMonth
      ? `${EN_MONTHS[a.m - 1]} ${a.d}–${b.d}`
      : `${EN_MONTHS[a.m - 1]} ${a.d} – ${EN_MONTHS[b.m - 1]} ${b.d}`;
  }
  if (lang === 'ja') {
    return sameMonth ? `${a.m}月${a.d}日〜${b.d}日` : `${a.m}月${a.d}日〜${b.m}月${b.d}日`;
  }
  if (lang === 'ko') {
    return sameMonth ? `${a.m}월 ${a.d}일–${b.d}일` : `${a.m}월 ${a.d}일 – ${b.m}월 ${b.d}일`;
  }
  return sameMonth ? `${a.m}月${a.d}日–${b.d}日` : `${a.m}月${a.d}日–${b.m}月${b.d}日`;
}

/**
 * A record's own date at whatever precision the data file gives:
 *   '2026-07-08' → '2026-07-08' (kept ISO — unambiguous next to addedAt)
 *   '2026-05'    → '2026 年 5 月' / 'May 2026' / '2026年5月' / '2026년 5월'
 *   '2023'       → '2023'
 * Anything else is returned untouched.
 */
export function formatEventDate(value: string, lang: Lang): string {
  if (ISO_DAY.test(value)) return value;
  if (ISO_MONTH.test(value)) return formatMonth(value, lang);
  if (ISO_YEAR.test(value)) return value;
  return value;
}
