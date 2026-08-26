// src/utils/data-export.ts
// ────────────────────────────────────────────────────────────────────────
// The JSON envelope every `/data/*.json` endpoint ships in.
//
// Why an envelope at all: the first generation of exports (P2-4) were bare
// arrays. A downstream user who pulled `/data/policies.json` got rows with
// no schema version, no license, no attribution and — worst — no link back
// to the sgai page the row came from. They could not cite us even if they
// wanted to, and we could never change the row shape without silently
// breaking them. The envelope fixes all four: `schemaVersion` gives us a
// versioning handle, `license` + `attribution` travel with the data, and
// per-row `links.sgai` gives every record its five canonical page URLs.
//
// Static-build honesty: `dataUpdated` is SITE_UPDATED (derived from the
// data's own addedAt stamps), never `new Date()`. A build timestamp would
// change the bytes of every dataset on every deploy, busting ETags and
// making "did the data change?" unanswerable from the file alone.

import { LOCALES, localizedHref, type Lang } from '~/i18n';
import { licenseObject } from '~/utils/license';
import { SITE_VERSION, SITE_UPDATED } from '~/version';

/** Absolute origin every machine-readable URL is built from. */
export const SITE_ORIGIN = 'https://sgai.md';

/** Attribution block. Frozen wording — downstream users may string-match it. */
export const ATTRIBUTION = {
  name: 'Singapore AI Observatory / sgai.md',
  url: 'https://sgai.md',
  note: 'Link to the specific page (links.sgai) when reusing a record.',
} as const;

export interface Envelope<T> {
  /** Bumped only on a breaking row-shape change. Additive fields do not bump. */
  schemaVersion: 1;
  /** 'debates' | 'policies' | 'tracker' | 'videos' | 'records' | 'index' */
  dataset: string;
  siteVersion: string;
  /** YYYY-MM-DD, derived from the data (SITE_UPDATED) — not a build clock. */
  dataUpdated: string;
  license: ReturnType<typeof licenseObject>;
  attribution: typeof ATTRIBUTION;
  count: number;
  items: T[];
}

/** Per-record link block: the five locale pages, plus the original source. */
export interface RecordLinks {
  sgai: Record<Lang, string>;
  source?: string;
}

/** Wrap a row array in the standard envelope. */
export function envelope<T>(dataset: string, items: T[]): Envelope<T> {
  return {
    schemaVersion: 1,
    dataset,
    siteVersion: SITE_VERSION,
    dataUpdated: SITE_UPDATED,
    license: licenseObject(),
    attribution: ATTRIBUTION,
    count: items.length,
    items,
  };
}

/**
 * Absolute page URLs for one record, one per locale, plus the upstream
 * `source` when the record has one. `href` is the bare (route-default)
 * path, e.g. '/debates/oral-answer-4088/'.
 */
export function recordLinks(href: string, sourceUrl?: string): RecordLinks {
  const sgai = {} as Record<Lang, string>;
  for (const lang of LOCALES) sgai[lang] = SITE_ORIGIN + localizedHref(href, lang);
  return sourceUrl ? { sgai, source: sourceUrl } : { sgai };
}

/** Absolute URL for one of the exports themselves (used by /data/index.json). */
export function datasetUrl(file: string): string {
  return `${SITE_ORIGIN}/data/${file}`;
}
