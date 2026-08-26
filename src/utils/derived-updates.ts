// src/utils/derived-updates.ts
// ────────────────────────────────────────────────────────────────────────
// Derive the "Recent updates" feed from the addedAt timestamps on every
// data record (videos, policies, debates, people, speeches, tracker
// dimensions, benchmarking cases + report editions, ecosystem entities,
// levers, startups, legal-ai items, reg-lookahead, talent programmes,
// ai-capital events).
//
// Why this exists: src/data/updates.ts used to be a manually maintained
// ledger that drifted from the underlying data files whenever someone
// edited a data file by hand (or via a fix PR that bypassed the standard
// emit pipeline). The 2026-05-09 incident — commit a608bc0 added v059/v060
// to videos.ts but updates.ts was never touched, so the homepage feed
// silently missed the change for a day — exposed the architectural bug.
//
// The fix: each data record carries `addedAt: 'YYYY-MM-DD'` (the date it
// was first written to the repo). This module harvests every such record
// and emits ONE Update per record — title, one-line summary (when the
// record has one), the record's own event date next to the site's addedAt,
// and a direct href. The result merges with manual UPDATES from updates.ts
// (site/fix/longform editorial content) at recentUpdates() / sortedUpdates()
// time.
//
// 2026-08-26: switched from (addedAt, type)-grouped rows ("3 new videos:
// A、B、C…") to per-record rows. sgai adds ~5 records a week; collapsing
// them hid the titles behind a joined string and gave the RSS feed nothing
// to link to. Batch imports are rare and the homepage window caps at 20 rows.
//
// Records without addedAt are silently skipped. They are either pre-rule
// historical entries or future schema additions still being filled in.
// scripts/evals/addedAt-coverage/check.ts asserts every NEW record (per
// branch diff) has addedAt — old records can stay undefined forever. Its
// DATA_FILES list must mirror the imports below; a unit test
// (scripts/evals/addedAt-coverage/__tests__/data-files-sync.test.ts) pins
// the two together.

import { videos, type VideoItem } from '~/data/videos';
import { categories as policyCategories, type Policy } from '~/data/policies';
import { debates, type Debate } from '~/data/debates';
import { people, type Person } from '~/data/people';
import { mddiSpeeches, type MddiSpeech } from '~/data/voices';
import { speechId } from '~/data/speech-transcripts';
import { dimensions, type Dimension } from '~/data/tracker';
import { benchmarkCases, reportArchive, type BenchmarkCase, type BenchmarkReportEdition } from '~/data/benchmarking';
import { ecosystemCategories, type EcosystemEntity } from '~/data/ecosystem';
import { levers, type Lever } from '~/data/levers';
import { verticals, type Startup } from '~/data/startups';
import { sections as legalSections, type LegalItem } from '~/data/legal-ai';
import { consultations as regConsultations, bills as regBills } from '~/data/reg-lookahead';
import type { ConsultationItem, BillItem } from '~/data/reg-lookahead';
import { programmes as talentProgrammes, type TalentProgramme } from '~/data/talent';
import { capitalRecords, type CapitalRecord } from '~/data/ai-capital';
import { legalItemSlug } from '~/utils/entity-pages';
import { shiftIsoDate } from '~/utils/date-format';
import { t } from '~/i18n';

import type { Update, UpdateType } from '~/data/updates';

// ── Common shape produced by each per-type harvester ────────────────────

// Fine-grained origin of a harvested record. Unlike UpdateType (the feed's
// display taxonomy, where legal-ai folds into 'policy', talent folds into
// 'people' and ai-capital folds into 'ecosystem'), `source` keeps the
// original data-file granularity so the homepage domain directory / listing
// "latest additions" strips can filter by actual domain.
export type DataSource =
  | 'policy'
  | 'debate'
  | 'video'
  | 'people'
  | 'speech'
  | 'tracker'
  | 'benchmark'
  | 'ecosystem'
  | 'lever'
  | 'startup'
  | 'legal'
  | 'talent'
  | 'capital';

export interface Harvested {
  type: UpdateType;
  source: DataSource;
  /** Stable record id where the record has one (used for JSON exports). */
  id?: string;
  /** Date the record entered the site. YYYY-MM-DD. */
  addedAt: string;
  /**
   * The record's OWN date — parliamentary sitting, publication, announcement
   * — exactly as written in the data file (YYYY-MM-DD, YYYY-MM or YYYY).
   * Display only; never parsed. Undefined for records that have no event
   * date (people, tracker dimensions, levers, …).
   */
  eventDate?: string;
  zhTitle: string;
  enTitle: string;
  jaTitle: string;
  koTitle: string;
  /** One-line summary where the record carries one. Never falls back to zh
   *  for non-zh langs — an empty string means "render nothing". */
  zhSummary?: string;
  enSummary?: string;
  jaSummary?: string;
  koSummary?: string;
  href: string;
}

// ── Per-type harvesters ─────────────────────────────────────────────────

// Each harvester: take the raw data, return a flat Harvested[] for any
// record whose addedAt is set. zh title is canonical; ja/en fall back to
// each other or the zh field if missing, so a record can still be derived
// even if its translations are mid-flight.

function pickJa(zh: string, ja: string | undefined, en: string | undefined): string {
  return ja ?? en ?? zh;
}

function pickEn(zh: string, en: string | undefined): string {
  return en ?? zh;
}

function pickKo(zh: string, ko: string | undefined, en: string | undefined): string {
  return ko ?? en ?? zh;
}

interface SummarySource {
  summary?: string;
  summaryEn?: string;
  summaryJa?: string;
  summaryKo?: string;
  whyItMatters?: string;
  whyItMattersEn?: string;
  whyItMattersJa?: string;
  whyItMattersKo?: string;
}

/**
 * The feed's one-liner. Prefers the record's `whyItMatters` judgment (why a
 * reader should care) over its `summary` (what happened) — that is the whole
 * point of the field. Strictly per-lang, no zh fallback for en/ja/ko.
 */
function summaries(r: SummarySource): Pick<Harvested, 'zhSummary' | 'enSummary' | 'jaSummary' | 'koSummary'> {
  return {
    zhSummary: r.whyItMatters || r.summary || undefined,
    enSummary: r.whyItMattersEn || r.summaryEn || undefined,
    jaSummary: r.whyItMattersJa || r.summaryJa || undefined,
    koSummary: r.whyItMattersKo || r.summaryKo || undefined,
  };
}

function harvestVideos(rs: VideoItem[]): Harvested[] {
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'video',
      source: 'video',
      id: r.id,
      addedAt: r.addedAt,
      eventDate: r.date,
      zhTitle: r.title,
      enTitle: pickEn(r.title, r.titleEn),
      jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
      koTitle: pickKo(r.title, r.titleKo, r.titleEn),
      ...summaries(r),
      href: `/videos/${r.id}/`,
    });
  }
  return out;
}

function harvestPolicies(cats: Array<{ policies: Policy[] }>): Harvested[] {
  const out: Harvested[] = [];
  for (const cat of cats) {
    for (const r of cat.policies ?? []) {
      if (!r.addedAt) continue;
      out.push({
        type: 'policy',
        source: 'policy',
        id: r.id,
        addedAt: r.addedAt,
        eventDate: r.date,
        zhTitle: r.title,
        enTitle: pickEn(r.title, r.titleEn),
        jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
        koTitle: pickKo(r.title, r.titleKo, r.titleEn),
        ...summaries(r),
        href: r.id ? `/policies/${r.id}/` : '/policies/',
      });
    }
  }
  return out;
}

function harvestDebates(rs: Debate[]): Harvested[] {
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'debate',
      source: 'debate',
      id: r.id,
      addedAt: r.addedAt,
      eventDate: r.date,
      zhTitle: r.title,
      enTitle: pickEn(r.title, r.titleEn),
      jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
      koTitle: pickKo(r.title, r.titleKo, r.titleEn),
      ...summaries(r),
      href: `/debates/${r.id}/`,
    });
  }
  return out;
}

function harvestPeople(rs: Person[]): Harvested[] {
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'people',
      source: 'people',
      id: r.id,
      addedAt: r.addedAt,
      zhTitle: r.name,
      enTitle: pickEn(r.name, r.nameEn),
      jaTitle: pickJa(r.name, r.nameJa, r.nameEn),
      koTitle: pickKo(r.name, r.nameKo, r.nameEn),
      href: `/voices/${r.id}/`,
    });
  }
  return out;
}

function harvestSpeeches(rs: MddiSpeech[]): Harvested[] {
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    const id = speechId(r);
    out.push({
      type: 'speech',
      source: 'speech',
      id,
      addedAt: r.addedAt,
      eventDate: r.date,
      zhTitle: r.title,
      enTitle: pickEn(r.title, r.titleEn),
      jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
      koTitle: pickKo(r.title, r.titleKo, r.titleEn),
      href: `/speeches/${id}/`,
    });
  }
  return out;
}

function harvestTracker(rs: Dimension[]): Harvested[] {
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'tracker',
      source: 'tracker',
      id: r.id,
      addedAt: r.addedAt,
      zhTitle: r.title,
      enTitle: pickEn(r.title, r.titleEn),
      jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
      koTitle: pickKo(r.title, r.titleKo, r.titleEn),
      href: `/tracker/${r.id}/`,
    });
  }
  return out;
}

function harvestBenchmarking(rs: BenchmarkCase[]): Harvested[] {
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'benchmark',
      source: 'benchmark',
      id: r.id,
      addedAt: r.addedAt,
      zhTitle: r.name,
      enTitle: pickEn(r.name, r.nameEn),
      jaTitle: pickJa(r.name, r.nameJa, r.nameEn),
      koTitle: pickKo(r.name, r.nameKo, r.nameEn),
      href: `/benchmarking/${r.id}/`,
    });
  }
  return out;
}

function harvestReportArchive(rs: BenchmarkReportEdition[]): Harvested[] {
  // Report-archive editions (promoted 2026-07-28) are real published
  // content on /benchmarking/ — surface their arrival in the feed and let
  // the benchmarking directory card show them as its latest addition.
  // They link to the listing (the archive is a section, not detail pages).
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'benchmark',
      source: 'benchmark',
      addedAt: r.addedAt,
      eventDate: String(r.year),
      zhTitle: r.title,
      enTitle: pickEn(r.title, r.titleEn),
      jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
      koTitle: pickKo(r.title, r.titleKo, r.titleEn),
      href: '/benchmarking/',
    });
  }
  return out;
}

function harvestEcosystem(cats: Array<{ entities: EcosystemEntity[] }>): Harvested[] {
  const out: Harvested[] = [];
  for (const cat of cats) {
    for (const r of cat.entities ?? []) {
      if (!r.addedAt) continue;
      // Hide pending-review entries from the homepage feed; they are not
      // listed elsewhere on the site either until reviewed.
      if (r._pendingReview) continue;
      out.push({
        type: 'ecosystem',
        source: 'ecosystem',
        id: r.id,
        addedAt: r.addedAt,
        zhTitle: r.name,
        enTitle: pickEn(r.name, r.nameEn),
        jaTitle: pickJa(r.name, r.nameJa, r.nameEn),
        koTitle: pickKo(r.name, r.nameKo, r.nameEn),
        href: r.id ? `/ecosystem/${r.id}/` : '/ecosystem/',
      });
    }
  }
  return out;
}

function harvestLevers(rs: Lever[]): Harvested[] {
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'lever',
      source: 'lever',
      id: String(r.number),
      addedAt: r.addedAt,
      zhTitle: r.name,
      enTitle: pickEn(r.name, r.nameEn),
      jaTitle: pickJa(r.name, r.nameJa, r.nameEn),
      koTitle: pickKo(r.name, r.nameKo, r.nameEn),
      href: `/levers/${r.number}/`,
    });
  }
  return out;
}

function harvestStartups(verts: Array<{ startups: Startup[] }>): Harvested[] {
  const out: Harvested[] = [];
  for (const v of verts) {
    for (const r of v.startups ?? []) {
      if (!r.addedAt) continue;
      out.push({
        type: 'startup',
        source: 'startup',
        id: r.id,
        addedAt: r.addedAt,
        zhTitle: r.name,
        enTitle: r.name, // Startup names are usually brand strings — same in en
        jaTitle: r.name,
        koTitle: r.name,
        href: r.id ? `/startups/${r.id}/` : '/startups/',
      });
    }
  }
  return out;
}

function harvestLegalAi(secs: Array<{ items: LegalItem[] }>): Harvested[] {
  const out: Harvested[] = [];
  for (const sec of secs) {
    for (const r of sec.items ?? []) {
      if (!r.addedAt) continue;
      const slug = legalItemSlug(r);
      // LegalItem.date is localized prose ("2026 年 3 月生效"), not an ISO
      // date — deliberately not surfaced as eventDate.
      out.push({
        type: 'policy', // legal-ai surfaces as 'policy' in the updates feed
        source: 'legal',
        id: slug,
        addedAt: r.addedAt,
        zhTitle: r.title,
        enTitle: pickEn(r.title, r.titleEn),
        jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
        koTitle: pickKo(r.title, r.titleKo, r.titleEn),
        href: `/legal-ai/${slug}/`,
      });
    }
  }
  return out;
}

function harvestRegLookahead(cs: ConsultationItem[], bs: BillItem[]): Harvested[] {
  // Lookahead records surface as 'policy' updates (precedent: legal-ai →
  // 'policy'); lifecycle TRANSITIONS on existing records don't create new
  // addedAt and are surfaced by the weekly PR itself, not the feed.
  const out: Harvested[] = [];
  for (const r of cs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'policy',
      source: 'legal',
      addedAt: r.addedAt,
      eventDate: r.opensAt,
      zhTitle: r.title,
      enTitle: pickEn(r.title, r.titleEn),
      jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
      koTitle: pickKo(r.title, r.titleKo, r.titleEn),
      href: '/legal-ai/#reg-lookahead',
    });
  }
  for (const r of bs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'policy',
      source: 'legal',
      addedAt: r.addedAt,
      eventDate: r.introducedAt,
      zhTitle: r.title,
      enTitle: pickEn(r.title, r.titleEn),
      jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
      koTitle: pickKo(r.title, r.titleKo, r.titleEn),
      href: '/legal-ai/#reg-lookahead',
    });
  }
  return out;
}

function harvestTalent(rs: TalentProgramme[]): Harvested[] {
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'people', // talent programmes surface as 'people' in the feed
      source: 'talent',
      id: r.id,
      addedAt: r.addedAt,
      zhTitle: r.name,
      enTitle: pickEn(r.name, r.nameEn),
      jaTitle: pickJa(r.name, r.nameJa, r.nameEn),
      koTitle: pickKo(r.name, r.nameKo, r.nameEn),
      href: `/talent/${r.id}/`,
    });
  }
  return out;
}

// ai-capital records have no title field — the ledger row is "parties ×
// kind × amount". Synthesise the same string per lang from the dictionary
// keys CapitalSection.astro uses, so the feed row matches the section row.
function capitalAmount(r: CapitalRecord): string {
  if (r.amountType === 'undisclosed') return '';
  const n = r.amountUsd ?? r.amountSgd ?? 0;
  const unit = r.amountUsd !== undefined ? 'US$' : 'S$';
  const b = n / 1e9;
  const num = b % 1 === 0 ? b.toFixed(0) : b.toFixed(1);
  return `${unit}${num}B${r.isFloor ? '+' : ''}`;
}

const CAPITAL_KIND_KEY = {
  'hyperscaler-commitment': 'capitalKindHyperscaler',
  'sovereign-investment': 'capitalKindSovereign',
  fund: 'capitalKindFund',
} as const;

function harvestAiCapital(rs: CapitalRecord[]): Harvested[] {
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    const parties = r.parties.join(' × ');
    const amount = capitalAmount(r);
    const title = (lang: 'zh' | 'en' | 'ja' | 'ko') =>
      [parties, t(lang, CAPITAL_KIND_KEY[r.kind]), amount].filter(Boolean).join(' · ');
    out.push({
      type: 'ecosystem', // capital events surface as 'ecosystem' in the feed
      source: 'capital',
      id: r.id,
      addedAt: r.addedAt,
      eventDate: r.announcedAt,
      zhTitle: title('zh'),
      enTitle: title('en'),
      jaTitle: title('ja'),
      koTitle: title('ko'),
      href: '/ecosystem/#capital',
    });
  }
  return out;
}

// ── Public entry ────────────────────────────────────────────────────────

/**
 * Flat list of every record that carries `addedAt`, tagged with its
 * fine-grained `source` domain. Raw material for deriveUpdates() (the feed),
 * the homepage / listing "latest additions" strips, the sitemap lastmod
 * map, and the /data/records.json export.
 *
 * Records without addedAt are skipped (pre-rule historical data).
 * Pending-review ecosystem entries are skipped.
 * Manual editorial entries (site / fix / longform) are NOT produced here —
 * they come from the manual UPDATES array in src/data/updates.ts.
 */
export function harvestAll(): Harvested[] {
  return [
    ...harvestVideos(videos),
    ...harvestPolicies(policyCategories),
    ...harvestDebates(debates),
    ...harvestPeople(people),
    ...harvestSpeeches(mddiSpeeches),
    ...harvestTracker(dimensions),
    ...harvestBenchmarking(benchmarkCases),
    ...harvestReportArchive(reportArchive),
    ...harvestEcosystem(ecosystemCategories),
    ...harvestLevers(levers),
    ...harvestStartups(verticals),
    ...harvestLegalAi(legalSections),
    ...harvestRegLookahead(regConsultations, regBills),
    ...harvestTalent(talentProgrammes),
    ...harvestAiCapital(capitalRecords),
  ];
}

function harvestedToUpdate(h: Harvested): Update {
  return {
    date: h.addedAt,
    type: h.type,
    title: h.zhTitle,
    titleEn: h.enTitle,
    titleJa: h.jaTitle,
    titleKo: h.koTitle,
    summary: h.zhSummary ?? '',
    summaryEn: h.enSummary ?? '',
    summaryJa: h.jaSummary,
    summaryKo: h.koSummary,
    href: h.href,
    eventDate: h.eventDate,
    source: h.source,
    id: h.id,
  };
}

/**
 * One Update per harvested record, in harvest (data-file) order. Pure,
 * deterministic, cheap — safe to call from updates.ts on every render.
 */
export function deriveUpdates(): Update[] {
  return harvestAll().map(harvestedToUpdate);
}

// ── Freshness deltas (masthead) ─────────────────────────────────────────

/** Newest addedAt across all data records; undefined only in an empty repo. */
export function latestAddedAt(): string | undefined {
  let max: string | undefined;
  for (const h of harvestAll()) if (!max || h.addedAt > max) max = h.addedAt;
  return max;
}

export interface Delta {
  /** Newest addedAt in the data — the "as of" date the window ends on. */
  anchor: string;
  /** First day counted (inclusive). */
  cutoff: string;
  total: number;
  byType: Partial<Record<UpdateType, number>>;
}

/**
 * How many records entered the site in the `days` days ending on the
 * newest addedAt. Anchored on the data, not on the build clock, so a site
 * that has not been touched for a month says "+0 as of <last date>" rather
 * than silently drifting. Manual editorial entries are not counted.
 */
export function deltaSince(days: number): Delta {
  const anchor = latestAddedAt() ?? '1970-01-01';
  const cutoff = shiftIsoDate(anchor, -(days - 1));
  const byType: Partial<Record<UpdateType, number>> = {};
  let total = 0;
  for (const h of harvestAll()) {
    if (h.addedAt < cutoff || h.addedAt > anchor) continue;
    total++;
    byType[h.type] = (byType[h.type] ?? 0) + 1;
  }
  return { anchor, cutoff, total, byType };
}
