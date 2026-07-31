// src/utils/derived-updates.ts
// ────────────────────────────────────────────────────────────────────────
// Derive homepage "Recent updates" entries from the addedAt timestamps on
// every data record (videos, policies, debates, people, tracker dimensions,
// benchmarking cases, ecosystem entities, levers, startups, legal-ai items,
// talent programmes).
//
// Why this exists: src/data/updates.ts used to be a manually maintained
// ledger that drifted from the underlying data files whenever someone
// edited a data file by hand (or via a fix PR that bypassed the standard
// emit pipeline). The 2026-05-09 incident — commit a608bc0 added v059/v060
// to videos.ts but updates.ts was never touched, so the homepage feed
// silently missed the change for a day — exposed the architectural bug.
//
// The fix: each data record carries `addedAt: 'YYYY-MM-DD'` (the date it
// was first written to the repo). This module groups records by
// (addedAt, type) and synthesises one Update entry per group. The result
// merges with manual UPDATES from updates.ts (site/fix/longform editorial
// content) at recentUpdates() / sortedUpdates() time.
//
// Records without addedAt are silently skipped. They are either pre-rule
// historical entries or future schema additions still being filled in.
// scripts/evals/addedAt-coverage/check.ts asserts every NEW record (per
// branch diff) has addedAt — old records can stay undefined forever.

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
import { programmes as talentProgrammes, type TalentProgramme } from '~/data/talent';
import { legalItemSlug } from '~/utils/entity-pages';

import type { Update, UpdateLink, UpdateType } from '~/data/updates';

// ── Common shape produced by each per-type harvester ────────────────────

// Fine-grained origin of a harvested record. Unlike UpdateType (the feed's
// display taxonomy, where legal-ai folds into 'policy' and talent folds
// into 'people'), `source` keeps the original data-file granularity so the
// homepage domain directory / listing "latest additions" strips can filter
// by actual domain.
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
  | 'talent';

export interface Harvested {
  type: UpdateType;
  source: DataSource;
  addedAt: string; // YYYY-MM-DD
  zhTitle: string;
  enTitle: string;
  jaTitle: string;
  koTitle: string;
  href: string;
}

// ── Per-type templates for the merged Update entry header ───────────────

interface TypeTemplate {
  /** Pluralised title in each lang. `n` is the number of records added on
   *  the same day for the same type. */
  zhTitle: (n: number) => string;
  jaTitle: (n: number) => string;
  enTitle: (n: number) => string;
  koTitle: (n: number) => string;
  /** Listing-page link rendered as the last item under `links`. */
  listingHref: string;
  listingLabel: string;
  listingLabelJa: string;
  listingLabelEn: string;
  listingLabelKo: string;
  /** Pluralised summary trailer when there are more than 3 items shown. */
  zhMore: (n: number) => string;
  jaMore: (n: number) => string;
  enMore: (n: number) => string;
  koMore: (n: number) => string;
}

// Per-type wording. Keep zh/ja/en parallel; if the wording changes here,
// the rendered homepage changes for all three languages immediately.
const TYPE_TEMPLATES: Record<UpdateType, TypeTemplate | undefined> = {
  video: {
    zhTitle: (n) => `AI 视频新增 ${n} 条`,
    jaTitle: (n) => `AI ビデオを${n}件追加`,
    enTitle: (n) => `${n} new AI video${n > 1 ? 's' : ''}`,
    koTitle: (n) => `AI 비디오 ${n}개 추가`,
    listingHref: '/videos/',
    listingLabel: 'AI 视频观点',
    listingLabelJa: 'AI ビデオ観点',
    listingLabelEn: 'Video library',
    listingLabelKo: 'AI 비디오 라이브러리',
    zhMore: (n) => `（共 ${n} 条）`,
    jaMore: (n) => `（合計${n}件）`,
    enMore: (n) => ` (${n} total)`,
    koMore: (n) => ` (총 ${n}개)`,
  },
  policy: {
    zhTitle: (n) => `新增 ${n} 条政策档案`,
    jaTitle: (n) => `${n}件のポリシーアーカイブを追加`,
    enTitle: (n) => `${n} new policy entries`,
    koTitle: (n) => `정책 문서 ${n}건 추가`,
    listingHref: '/policies/',
    listingLabel: '政策库',
    listingLabelJa: 'ポリシーライブラリー',
    listingLabelEn: 'Policy library',
    listingLabelKo: '정책 라이브러리',
    zhMore: (n) => `（共 ${n} 条）`,
    jaMore: (n) => `（合計${n}件）`,
    enMore: (n) => ` (${n} total)`,
    koMore: (n) => ` (총 ${n}건)`,
  },
  debate: {
    zhTitle: (n) => `国会辩论新增 ${n} 场`,
    jaTitle: (n) => `議会討論を${n}件追加`,
    enTitle: (n) => `${n} new parliamentary debate${n > 1 ? 's' : ''}`,
    koTitle: (n) => `국회 토론 ${n}건 추가`,
    listingHref: '/debates/',
    listingLabel: '国会辩论',
    listingLabelJa: '議会討論',
    listingLabelEn: 'Parliamentary debates',
    listingLabelKo: '국회 토론',
    zhMore: (n) => `（共 ${n} 场）`,
    jaMore: (n) => `（合計${n}件）`,
    enMore: (n) => ` (${n} total)`,
    koMore: (n) => ` (총 ${n}건)`,
  },
  people: {
    zhTitle: (n) => `Voices 图谱新增 ${n} 位`,
    jaTitle: (n) => `Voices マップに${n}名を追加`,
    enTitle: (n) => `${n} new voice${n > 1 ? 's' : ''} in the influence map`,
    koTitle: (n) => `영향력 지도에 ${n}명 추가`,
    listingHref: '/voices/',
    listingLabel: 'AI 影响力图谱',
    listingLabelJa: 'AI インフルエンスマップ',
    listingLabelEn: 'Influence map',
    listingLabelKo: 'AI 영향력 지도',
    zhMore: (n) => `（共 ${n} 位）`,
    jaMore: (n) => `（合計${n}名）`,
    enMore: (n) => ` (${n} total)`,
    koMore: (n) => ` (총 ${n}명)`,
  },
  speech: {
    zhTitle: (n) => `MDDI 演讲新增 ${n} 篇`,
    jaTitle: (n) => `MDDI スピーチを${n}件追加`,
    enTitle: (n) => `${n} new MDDI speech${n > 1 ? 'es' : ''}`,
    koTitle: (n) => `MDDI 연설 ${n}건 추가`,
    listingHref: '/voices/',
    listingLabel: 'MDDI AI 相关演讲稿',
    listingLabelJa: 'MDDI AI 関連スピーチ',
    listingLabelEn: 'MDDI AI speeches',
    listingLabelKo: 'MDDI AI 관련 연설',
    zhMore: (n) => `（共 ${n} 篇）`,
    jaMore: (n) => `（合計${n}件）`,
    enMore: (n) => ` (${n} total)`,
    koMore: (n) => ` (총 ${n}건)`,
  },
  tracker: {
    zhTitle: (n) => `Tracker 维度新增 ${n} 项`,
    jaTitle: (n) => `Tracker 次元を${n}件追加`,
    enTitle: (n) => `${n} new tracker dimension${n > 1 ? 's' : ''}`,
    koTitle: (n) => `트래커 차원 ${n}개 추가`,
    listingHref: '/tracker/',
    listingLabel: 'AI 仪表盘',
    listingLabelJa: 'AI ダッシュボード',
    listingLabelEn: 'AI dashboard',
    listingLabelKo: 'AI 대시보드',
    zhMore: (n) => `（共 ${n} 项）`,
    jaMore: (n) => `（合計${n}件）`,
    enMore: (n) => ` (${n} total)`,
    koMore: (n) => ` (총 ${n}개)`,
  },
  benchmark: {
    zhTitle: (n) => `国际对标新增 ${n} 例`,
    jaTitle: (n) => `国際ベンチマークを${n}件追加`,
    enTitle: (n) => `${n} new benchmark case${n > 1 ? 's' : ''}`,
    koTitle: (n) => `국제 벤치마크 ${n}건 추가`,
    listingHref: '/benchmarking/',
    listingLabel: '国际对标',
    listingLabelJa: '国際ベンチマーク',
    listingLabelEn: 'International benchmarks',
    listingLabelKo: '국제 벤치마크',
    zhMore: (n) => `（共 ${n} 例）`,
    jaMore: (n) => `（合計${n}件）`,
    enMore: (n) => ` (${n} total)`,
    koMore: (n) => ` (총 ${n}건)`,
  },
  ecosystem: {
    zhTitle: (n) => `生态地图新增 ${n} 个实体`,
    jaTitle: (n) => `エコシステムマップに${n}件のエンティティを追加`,
    enTitle: (n) => `${n} new ecosystem entit${n > 1 ? 'ies' : 'y'}`,
    koTitle: (n) => `생태계 지도에 ${n}개 엔티티 추가`,
    listingHref: '/ecosystem/',
    listingLabel: '生态地图',
    listingLabelJa: 'エコシステムマップ',
    listingLabelEn: 'Ecosystem map',
    listingLabelKo: '생태계 지도',
    zhMore: (n) => `（共 ${n} 个）`,
    jaMore: (n) => `（合計${n}件）`,
    enMore: (n) => ` (${n} total)`,
    koMore: (n) => ` (총 ${n}개)`,
  },
  lever: {
    zhTitle: (n) => `抓手图谱新增 ${n} 项`,
    jaTitle: (n) => `レバーマップに${n}件を追加`,
    enTitle: (n) => `${n} new lever${n > 1 ? 's' : ''}`,
    koTitle: (n) => `레버 지도에 ${n}개 추가`,
    listingHref: '/levers/',
    listingLabel: '国家 AI 抓手图谱',
    listingLabelJa: '国家 AI レバーマップ',
    listingLabelEn: 'National AI levers',
    listingLabelKo: '국가 AI 레버 지도',
    zhMore: (n) => `（共 ${n} 项）`,
    jaMore: (n) => `（合計${n}件）`,
    enMore: (n) => ` (${n} total)`,
    koMore: (n) => ` (총 ${n}개)`,
  },
  startup: {
    zhTitle: (n) => `创业生态新增 ${n} 家公司`,
    jaTitle: (n) => `スタートアップエコシステムに${n}社を追加`,
    enTitle: (n) => `${n} new AI startup${n > 1 ? 's' : ''}`,
    koTitle: (n) => `AI 스타트업 ${n}개 추가`,
    listingHref: '/startups/',
    listingLabel: 'AI 创业生态',
    listingLabelJa: 'AI スタートアップエコシステム',
    listingLabelEn: 'AI startup ecosystem',
    listingLabelKo: 'AI 스타트업 생태계',
    zhMore: (n) => `（共 ${n} 家）`,
    jaMore: (n) => `（合計${n}社）`,
    enMore: (n) => ` (${n} total)`,
    koMore: (n) => ` (총 ${n}개)`,
  },
  // longform / site / fix are editorial-only — never derived from data files.
  // They live in the manual UPDATES array in src/data/updates.ts.
  longform: undefined,
  site: undefined,
  fix: undefined,
};

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

function harvestVideos(rs: VideoItem[]): Harvested[] {
  const out: Harvested[] = [];
  for (const r of rs) {
    if (!r.addedAt) continue;
    out.push({
      type: 'video',
      source: 'video',
      addedAt: r.addedAt,
      zhTitle: r.title,
      enTitle: pickEn(r.title, r.titleEn),
      jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
      koTitle: pickKo(r.title, r.titleKo, r.titleEn),
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
        addedAt: r.addedAt,
        zhTitle: r.title,
        enTitle: pickEn(r.title, r.titleEn),
        jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
        koTitle: pickKo(r.title, r.titleKo, r.titleEn),
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
      addedAt: r.addedAt,
      zhTitle: r.title,
      enTitle: pickEn(r.title, r.titleEn),
      jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
      koTitle: pickKo(r.title, r.titleKo, r.titleEn),
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
    out.push({
      type: 'speech',
      source: 'speech',
      addedAt: r.addedAt,
      zhTitle: r.title,
      enTitle: pickEn(r.title, r.titleEn),
      jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
      koTitle: pickKo(r.title, r.titleKo, r.titleEn),
      href: `/speeches/${speechId(r)}/`,
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
      out.push({
        type: 'policy', // legal-ai surfaces as 'policy' in the updates feed
        source: 'legal',
        addedAt: r.addedAt,
        zhTitle: r.title,
        enTitle: pickEn(r.title, r.titleEn),
        jaTitle: pickJa(r.title, r.titleJa, r.titleEn),
        koTitle: pickKo(r.title, r.titleKo, r.titleEn),
        href: `/legal-ai/${legalItemSlug(r)}/`,
      });
    }
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

// ── Group + format ──────────────────────────────────────────────────────

function groupKey(h: Harvested): string {
  return `${h.addedAt}|${h.type}`;
}

function joinZh(items: string[]): string {
  return items.join('、');
}

function joinJa(items: string[]): string {
  return items.join('、');
}

function joinEn(items: string[]): string {
  return items.join('; ');
}

function joinKo(items: string[]): string {
  return items.join('; ');
}

function buildUpdate(date: string, type: UpdateType, items: Harvested[]): Update | null {
  const tmpl = TYPE_TEMPLATES[type];
  if (!tmpl) return null;
  const sample = items.slice(0, 3);
  const more = items.length > 3;
  const links: UpdateLink[] = [
    ...sample.map((s) => ({
      href: s.href,
      label: s.zhTitle,
      labelJa: s.jaTitle,
      labelEn: s.enTitle,
      labelKo: s.koTitle,
    })),
    {
      href: tmpl.listingHref,
      label: tmpl.listingLabel,
      labelJa: tmpl.listingLabelJa,
      labelEn: tmpl.listingLabelEn,
      labelKo: tmpl.listingLabelKo,
    },
  ];
  return {
    date,
    type,
    title: tmpl.zhTitle(items.length),
    titleJa: tmpl.jaTitle(items.length),
    titleEn: tmpl.enTitle(items.length),
    titleKo: tmpl.koTitle(items.length),
    summary: joinZh(sample.map((s) => s.zhTitle)) + (more ? tmpl.zhMore(items.length) : '。'),
    summaryJa: joinJa(sample.map((s) => s.jaTitle)) + (more ? tmpl.jaMore(items.length) : '。'),
    summaryEn: joinEn(sample.map((s) => s.enTitle)) + (more ? tmpl.enMore(items.length) : '.'),
    summaryKo: joinKo(sample.map((s) => s.koTitle)) + (more ? tmpl.koMore(items.length) : '.'),
    links,
  };
}

// ── Public entry ────────────────────────────────────────────────────────

/**
 * Walk all data files, harvest every record with `addedAt`, group by
 * (addedAt, type), and synthesise one Update per group. Pure, deterministic,
 * cheap — safe to call from updates.ts on every render.
 *
 * Records without addedAt are skipped (pre-rule historical data).
 * Pending-review ecosystem entries are skipped.
 * Manual editorial entries (site / fix / longform) are NOT produced here —
 * they come from the manual UPDATES array in src/data/updates.ts.
 */
/**
 * Flat list of every record that carries `addedAt`, tagged with its
 * fine-grained `source` domain. This is the raw material both for
 * deriveUpdates() (grouped feed) and for the homepage / listing "latest
 * additions" strips (per-domain, ungrouped).
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
    ...harvestTalent(talentProgrammes),
  ];
}

export function deriveUpdates(): Update[] {
  const all: Harvested[] = harvestAll();

  const groups = new Map<string, Harvested[]>();
  for (const h of all) {
    const k = groupKey(h);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(h);
  }

  const out: Update[] = [];
  for (const [k, items] of groups) {
    const [date, type] = k.split('|') as [string, UpdateType];
    const u = buildUpdate(date, type, items);
    if (u) out.push(u);
  }
  return out;
}
