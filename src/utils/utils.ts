import { I18N } from 'astrowind:config';

import type { Lang } from '~/i18n';

const dateOpts: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
};

const FORMATTERS: Record<Lang, Intl.DateTimeFormat> = {
  zh: new Intl.DateTimeFormat('zh-CN', dateOpts),
  en: new Intl.DateTimeFormat('en-US', dateOpts),
  ja: new Intl.DateTimeFormat('ja-JP', dateOpts),
  'zh-tw': new Intl.DateTimeFormat('zh-Hant-TW', dateOpts),
  ko: new Intl.DateTimeFormat('ko-KR', dateOpts),
};

// Default formatter mirrors site-wide locale (kept for backward-compat).
export const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(I18N?.language, dateOpts);

/** Format a date using the locale matching the given lang. */
export const getFormattedDate = (date: Date, lang: Lang = 'zh'): string => {
  if (!date) return '';
  return (FORMATTERS[lang] ?? FORMATTERS.zh).format(date);
};

export const trim = (str = '', ch?: string) => {
  let start = 0,
    end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

// Function to format a number in thousands (K) or millions (M) format depending on its value
export const toUiAmount = (amount: number) => {
  if (!amount) return 0;

  let value: string;

  if (amount >= 1000000000) {
    const formattedNumber = (amount / 1000000000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'B';
    } else {
      value = formattedNumber + 'B';
    }
  } else if (amount >= 1000000) {
    const formattedNumber = (amount / 1000000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'M';
    } else {
      value = formattedNumber + 'M';
    }
  } else if (amount >= 1000) {
    const formattedNumber = (amount / 1000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'K';
    } else {
      value = formattedNumber + 'K';
    }
  } else {
    value = Number(amount).toFixed(0);
  }

  return value;
};

// Convert a YYYY-MM-DD string into an ISO 8601 datetime with timezone, as required by
// schema.org/VideoObject.uploadDate. Google Search Console flags pure dates ("2026-05-02")
// as "Invalid datetime value" + "missing a timezone".
export const toSchemaOrgDateTime = (date: string): string => `${date}T00:00:00+08:00`;

/** Build a meta description from prose fragments: strip markdown syntax
 *  (fenced code, links, emphasis, headings, list markers), collapse
 *  whitespace, join with a space, and cut at a word boundary near `maxLen`.
 *  Data fields like whatItIs / judgment are authored as markdown body copy,
 *  so they can't go into <meta name="description"> verbatim. Fenced code
 *  blocks in particular (e.g. an entity's ```yaml config example) must be
 *  dropped WHOLE — stripping only the backtick fences would flatten the
 *  code body into the snippet ("yaml nodes: - input.visual: source: webcam
 *  …"), which also trips the ja/ko enSentence purity ratchet. */
export const synthesizeMetaDescription = (parts: Array<string | null | undefined>, maxLen = 200): string => {
  const text = parts
    .filter((p): p is string => Boolean(p && p.trim()))
    .join('\n')
    .replace(/```[\s\S]*?```/g, ' ') // drop fenced code blocks whole (before other strips)
    .replace(/^[ \t]*[-*+]\s+/gm, '') // drop list-item markers
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // [label](url) → label
    .replace(/[*_`#>]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  // Prefer the last word boundary; CJK prose has no spaces, so fall back
  // to a hard cut when none is found in the tail.
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
};
