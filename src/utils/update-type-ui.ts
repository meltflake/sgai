// src/utils/update-type-ui.ts
// ────────────────────────────────────────────────────────────────────────
// Presentation helpers shared by every surface that renders an Update row
// (homepage feed, /updates/ listing, masthead delta, RSS titles). Used to be
// copy-pasted into three components; one drifted copy is one too many.

import { createHash } from 'node:crypto';

import type { Update, UpdateLink, UpdateType } from '~/data/updates';
import type { DataSource } from '~/utils/derived-updates';
import { t, type Lang } from '~/i18n';
import { toTraditional } from '~/i18n/opencc';

export const TYPE_CHIP: Record<UpdateType, string> = {
  policy: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  debate: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  video: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  startup: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  people: 'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  speech: 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
  tracker: 'bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  benchmark: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  ecosystem: 'bg-lime-50 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
  lever: 'bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  longform: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  site: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300',
  fix: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
};

export const CHIP_FALLBACK = 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300';

export type DictKey = Parameters<typeof t>[1];

export const TYPE_LABEL_KEY: Record<UpdateType, DictKey> = {
  policy: 'updateTypePolicy',
  debate: 'updateTypeDebate',
  video: 'updateTypeVideo',
  startup: 'updateTypeStartup',
  people: 'updateTypePeople',
  speech: 'updateTypeSpeech',
  tracker: 'updateTypeTracker',
  benchmark: 'updateTypeBenchmark',
  ecosystem: 'updateTypeEcosystem',
  lever: 'updateTypeLever',
  longform: 'updateTypeLongform',
  site: 'updateTypeSite',
  fix: 'updateTypeFix',
};

/** Localized type label ("政策" / "Policy" / …). */
export function typeLabel(type: UpdateType, lang: Lang): string {
  return t(lang, TYPE_LABEL_KEY[type]);
}

/**
 * Which label to hang on a record's eventDate: a debate's date is the
 * sitting, a video / policy / speech date is publication, a capital event
 * or report edition is an announcement. Sources without a meaningful event
 * date return undefined (the row then shows addedAt only).
 */
export function eventDateLabelKey(source: DataSource | undefined): DictKey | undefined {
  switch (source) {
    case 'debate':
      return 'evtDateSitting';
    case 'video':
    case 'policy':
    case 'speech':
    case 'legal':
      return 'evtDatePublished';
    case 'capital':
    case 'benchmark':
      return 'evtDateAnnounced';
    default:
      return undefined;
  }
}

/**
 * Per-lang text for an Update's title or summary. Strict for non-zh langs:
 * en → En only; ja → Ja then En; ko → Ko then En. Never falls back to the
 * zh field, so an untranslated summary renders as '' (nothing) instead of
 * leaking Chinese onto an EN/JA/KO page. zh-tw derives from zh via OpenCC.
 */
export function updateText(u: Update, field: 'title' | 'summary', lang: Lang): string {
  const zh = field === 'title' ? u.title : u.summary;
  const en = field === 'title' ? u.titleEn : u.summaryEn;
  const ja = field === 'title' ? u.titleJa : u.summaryJa;
  const ko = field === 'title' ? u.titleKo : u.summaryKo;
  return pickStrict({ zh, en, ja, ko }, lang);
}

/**
 * Stable, unique RSS guid for an Update. `@astrojs/rss` defaults the guid to
 * the item link, but ~70 of the feed's rows share a link (manual editorial
 * entries fall back to /updates/, id-less startups to /startups/, capital
 * events to /ecosystem/#capital) and readers dedupe on guid — those rows
 * would collapse to a handful. Records with an id use it; the rest hash
 * the title. Type + date keep the key unique even across data files.
 */
export function updateGuid(u: Update): string {
  const key = u.id ?? createHash('sha1').update(u.title).digest('hex').slice(0, 12);
  return `sgai:${u.type}:${u.date}:${key}`;
}

/**
 * Link path for an RSS item. `@astrojs/rss` runs the link through
 * createCanonicalURL, which appends the trailing slash AFTER any fragment
 * (`/ecosystem/#capital/`), so anchored hrefs are trimmed to their page.
 */
export function updateLinkPath(u: Update): string {
  return (u.href ?? '/updates/').split('#')[0];
}

/** Same strict per-lang resolution for a manual entry's link labels. */
export function linkLabel(link: UpdateLink, lang: Lang): string {
  return pickStrict({ zh: link.label, en: link.labelEn, ja: link.labelJa, ko: link.labelKo }, lang);
}

function pickStrict(v: { zh?: string; en?: string; ja?: string; ko?: string }, lang: Lang): string {
  if (lang === 'en') return v.en ?? '';
  if (lang === 'ja') return v.ja || v.en || '';
  if (lang === 'ko') return v.ko || v.en || '';
  if (lang === 'zh-tw') return toTraditional(v.zh ?? '');
  return v.zh ?? '';
}
