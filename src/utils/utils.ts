import { I18N } from 'astrowind:config';

const dateOpts: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
};

const zhFormatter = new Intl.DateTimeFormat('zh-CN', dateOpts);
const enFormatter = new Intl.DateTimeFormat('en-US', dateOpts);

// Default formatter mirrors site-wide locale (kept for backward-compat).
export const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(I18N?.language, dateOpts);

/** Format a date using the locale matching the given lang. */
export const getFormattedDate = (date: Date, lang: 'zh' | 'en' = 'zh'): string => {
  if (!date) return '';
  return (lang === 'en' ? enFormatter : zhFormatter).format(date);
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
