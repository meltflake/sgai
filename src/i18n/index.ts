// i18n core (v0.8.0).
//
// Routing vs content locales (decoupled by design):
//
//   ROUTE_DEFAULT_LOCALE = 'en' — decides which locale's URLs are
//     unprefixed (en lives at `/`, zh under `/zh/`). Used by
//     getLangFromPath / localePrefix / localizedHref / unprefixed.
//
//   DEFAULT_LOCALE = 'zh' — decides which language sits in bare data
//     fields (`title`, `description` etc.) without a `*Lang` suffix.
//     The corresponding sibling for 'en' is `titleEn`. Used by
//     siblingSuffix / pickLocalized.
//
// Why two constants: the project's data is curated in zh first; renaming
// every bare field to a Chinese-suffix sibling (`titleZh`) just to flip
// the routing is gratuitous churn. Decoupling lets us flip routing
// independently from the historical data convention.
//
// Lang code == URL segment:
//
//   The Lang code (e.g. 'zh-tw') is *also* the URL segment — pages live
//   at `/zh-tw/...` and `Astro.params.lang === 'zh-tw'` matches the
//   Lang union directly. siblingSuffix handles the kebab-cased lang
//   code by splitting on '-' and capitalizing each part, so 'zh-tw'
//   derives the `titleZhTw` sibling-field name.
//
//   HTML lang / hreflang use BCP-47 via IN_LANGUAGES (`zh-Hant`).
//
// To add a new locale L:
//   1. Add 'L' to the Lang union and LOCALES array (use kebab-case if
//      the locale needs a region tag, e.g. 'zh-tw', 'pt-br').
//   2. Add an `<L>` dictionary export below (mirroring `zh`'s keys).
//   3. Backfill `titleL` / `descriptionL` / etc. on user-visible data
//      fields you want translated (otherwise pickLocalized falls back
//      through FALLBACK_CHAINS).
//   4. Add a fallback chain entry for L if you want a different chain
//      than [L, DEFAULT_LOCALE].
//   5. Run `npm run check:i18n -- --lang L --root dist/<L>` to verify.

export type Lang = 'zh' | 'en' | 'ja' | 'zh-tw' | 'ko';

// Display order for the language switcher dropdown and sitemap alternates.
// en first (route default, biggest reader base), then zh (data-default + 2nd
// largest audience), then 繁中 next to 简中, then ja, then ko. Reordering is
// safe: NON_DEFAULT_ROUTE_LOCALES / FALLBACK_CHAINS / DICTIONARIES key by
// Lang code, not array position.
export const LOCALES: Lang[] = ['en', 'zh', 'zh-tw', 'ja', 'ko'];

/** Routing default: this locale's URLs live at the bare root (no prefix). */
export const ROUTE_DEFAULT_LOCALE: Lang = 'en';

/** Content default: this locale's value is in bare data fields. */
export const DEFAULT_LOCALE: Lang = 'zh';

/** Non-default routing locales — used by [lang] dynamic routes' getStaticPaths. */
export const NON_DEFAULT_ROUTE_LOCALES = LOCALES.filter((l) => l !== ROUTE_DEFAULT_LOCALE);

/** JSON-LD / schema.org inLanguage values per locale (BCP 47). */
export const IN_LANGUAGES: Record<Lang, string> = {
  zh: 'zh-CN',
  en: 'en',
  ja: 'ja',
  'zh-tw': 'zh-Hant',
  ko: 'ko',
};

/** Per-locale fallback chain. Looked up in order; the first non-empty
 *  hit wins. Always ends with `DEFAULT_LOCALE` (the bare-field locale).
 *
 *  ja falls back to en before zh: Japanese readers' English literacy is
 *  generally higher than their Chinese literacy.
 *
 *  zh-tw falls back directly to zh (Simplified). pickLocalized / t will
 *  pass the zh hit through OpenCC s2twp at render time, so missing
 *  `*ZhTw` siblings degrade to OpenCC-converted Traditional rather than
 *  raw Simplified.
 *
 *  ko falls back to en, then zh (same reasoning as ja). */
const FALLBACK_CHAINS: Record<Lang, Lang[]> = {
  zh: ['zh'],
  en: ['en', 'zh'],
  ja: ['ja', 'en', 'zh'],
  'zh-tw': ['zh-tw', 'zh'],
  ko: ['ko', 'en', 'zh'],
};

/** Derive sibling-field suffix from a lang code.
 *  zh → '' (uses bare `key`), en → 'En', ja → 'Ja', zh-tw → 'ZhTw',
 *  ko → 'Ko'. Splits on '-' and capitalizes each segment so kebab-cased
 *  region tags ('zh-tw', 'pt-br') produce valid JS identifier suffixes. */
function siblingSuffix(lang: Lang): string {
  if (lang === DEFAULT_LOCALE) return '';
  return lang
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

/** Read locale from a URL pathname. /zh/foo → 'zh', /zh-tw/foo → 'zh-tw',
 *  /foo → 'en'. */
export function getLangFromPath(pathname: string): Lang {
  const seg = pathname.replace(/^\/+/, '').split('/')[0] as Lang;
  return (LOCALES as string[]).includes(seg) && seg !== ROUTE_DEFAULT_LOCALE ? seg : ROUTE_DEFAULT_LOCALE;
}

/** Return URL prefix for a locale. en → '', zh → '/zh', zh-tw → '/zh-tw'. */
export function localePrefix(lang: Lang): string {
  return lang === ROUTE_DEFAULT_LOCALE ? '' : `/${lang}`;
}

/** Build a localized href. localizedHref('/policies/', 'en') → '/policies/'.
 *  localizedHref('/policies/', 'zh') → '/zh/policies/'.
 *  localizedHref('/policies/', 'zh-tw') → '/zh-tw/policies/'. */
export function localizedHref(path: string, lang: Lang): string {
  if (!path.startsWith('/')) path = '/' + path;
  if (lang === ROUTE_DEFAULT_LOCALE) return path;
  const prefix = `/${lang}`;
  if (path === prefix || path.startsWith(prefix + '/')) return path;
  return prefix + path;
}

/** Strip route-locale prefix to recover the bare (route-default) path.
 *  unprefixed('/zh/policies/') → '/policies/'.
 *  unprefixed('/zh-tw/policies/') → '/policies/'. */
export function unprefixed(path: string): string {
  for (const lang of LOCALES) {
    if (lang === ROUTE_DEFAULT_LOCALE) continue;
    const prefix = `/${lang}`;
    if (path === prefix || path === prefix + '/') return '/';
    if (path.startsWith(prefix + '/')) return path.slice(prefix.length);
  }
  return path;
}

import { toTraditional as openccConvert } from './opencc';

/** Apply OpenCC s2twp to a string when the target lang is zh-tw and the
 *  matched value came from the zh fallback. No-op for other langs. The
 *  OpenCC converter is a singleton inside ./opencc.ts so first-call cold
 *  is paid once per build, not per record.
 *
 *  Array values (e.g. keyPoints: string[]) are converted element-wise.
 *  Non-string scalars pass through untouched — pickLocalized may carry
 *  numbers / booleans / nested objects, and the OpenCC underlying
 *  matchPrefix crashes on non-string input. */
function maybeConvertToTraditional<T>(value: T, targetLang: Lang, matchedLang: Lang): T {
  if (targetLang !== 'zh-tw') return value;
  if (matchedLang !== 'zh') return value;
  if (typeof value === 'string') return openccConvert(value) as T;
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'string' ? openccConvert(v) : v)) as T;
  }
  return value;
}

/** Pick a localized field from an object using the lang's fallback chain.
 *
 *  Two call shapes (kept compatible with the existing call sites):
 *
 *    pickLocalized(record, 'title', lang)              // shape A: scales to N langs
 *    pickLocalized(record, 'title', 'titleEn', lang)   // shape B: legacy 2-lang
 *
 *  Shape A computes the sibling field name automatically:
 *    lang='zh' → record.title
 *    lang='en' → record.titleEn   (fallback record.title)
 *    lang='ja' → record.titleJa   (fallback record.title)
 *
 *  Shape B is the legacy explicit form; both keys are honoured but the
 *  function only looks up exactly those two. New code should prefer
 *  shape A. */
export function pickLocalized<T = string>(record: unknown, baseKey: string, lang: Lang): T | null | undefined;
export function pickLocalized<T = string>(
  record: unknown,
  zhKey: string,
  enKey: string,
  lang: Lang
): T | null | undefined;
export function pickLocalized(
  record: unknown,
  baseOrZhKey: string,
  enKeyOrLang: string | Lang,
  maybeLang?: Lang
): string | null | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = record as any;
  if (r == null) return undefined;

  // Shape B (legacy): (record, zhKey, enKey, lang)
  // Caller passed explicit zh/en keys. For non-default locales we walk the
  // FALLBACK_CHAIN — for ja that's [ja, en, zh]. The ja step is computed
  // from `zhKey + siblingSuffix('ja')` (= `${zhKey}Ja`), which is the
  // project-wide convention for sibling field naming. This means a call
  // like `pickLocalized(insight, 'title', 'titleEn', lang)` on a JA page
  // first tries `insight.titleJa`, then `insight.titleEn`, then
  // `insight.title` — matching the canonical fallback chain. (Without
  // this derivation, the 'ja' step had no key to look up and was silently
  // skipped, so JA pages always dropped to enKey — a stealth bug that
  // negated every titleJa / descriptionJa added by the data pipelines.)
  // New code should still prefer shape A; shape B is kept for the ~50
  // existing call sites that pass explicit zh/en keys.
  if (typeof maybeLang === 'string') {
    const lang = maybeLang as Lang;
    const zhKey = baseOrZhKey;
    const enKey = enKeyOrLang as string;
    if (lang === DEFAULT_LOCALE) {
      return r[zhKey] as string | null | undefined;
    }
    for (const candidate of FALLBACK_CHAINS[lang] || [lang, DEFAULT_LOCALE]) {
      let key: string;
      if (candidate === DEFAULT_LOCALE) key = zhKey;
      else if (candidate === 'en') key = enKey;
      else key = `${zhKey}${siblingSuffix(candidate)}`; // e.g. ja → `${zhKey}Ja`
      const v = r[key];
      if (v != null && v !== '') return maybeConvertToTraditional(v, lang, candidate);
    }
    return r[zhKey] as string | null | undefined;
  }

  // Shape A: (record, baseKey, lang)
  const lang = enKeyOrLang as Lang;
  const baseKey = baseOrZhKey;
  for (const candidate of FALLBACK_CHAINS[lang] || [lang, DEFAULT_LOCALE]) {
    const key = candidate === DEFAULT_LOCALE ? baseKey : `${baseKey}${siblingSuffix(candidate)}`;
    const v = r[key];
    if (v != null && v !== '') return maybeConvertToTraditional(v as string, lang, candidate);
  }
  return r[baseKey] as string | null | undefined;
}

/** Like pickLocalized, but with NO cross-language fallback: return the
 *  record's own-locale sibling or undefined. zh-tw derives from zh via
 *  OpenCC (zh always exists by the rule-#5 data contract).
 *
 *  Use this when *extending* page copy (e.g. appending optional fields to
 *  a meta description): pickLocalized's fallback chain would splice an
 *  English sentence into a ja/ko page, tripping the check:i18n enSentence
 *  ratchet. With this helper the extension simply doesn't happen unless
 *  the exact-locale sibling exists. */
export function pickLocalizedOwn(record: unknown, baseKey: string, lang: Lang): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = record as any;
  if (r == null) return undefined;
  if (lang === DEFAULT_LOCALE) {
    const v = r[baseKey];
    return typeof v === 'string' && v !== '' ? v : undefined;
  }
  if (lang === 'zh-tw') {
    const own = r[`${baseKey}${siblingSuffix('zh-tw')}`];
    if (typeof own === 'string' && own !== '') return own;
    const zh = r[baseKey];
    return typeof zh === 'string' && zh !== '' ? (openccConvert(zh) as string) : undefined;
  }
  const v = r[`${baseKey}${siblingSuffix(lang)}`];
  return typeof v === 'string' && v !== '' ? v : undefined;
}

/** Default English labels for known social-channel platforms. Pages may
 *  augment this map locally if they want platform-specific labels. */
const PLATFORM_LABELS_EN: Record<string, string> = {
  twitter: 'X (Twitter)',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  website: 'Website',
  newsletter: 'Newsletter',
  github: 'GitHub',
  youtube: 'YouTube',
};

/** Resolve a SocialChannel display label for the given lang.
 *  zh (default): prefer label → platform map.
 *  Other locales: prefer labelXx for the target locale (e.g. labelEn,
 *  labelJa), then walk the FALLBACK_CHAIN. As a last resort, fall back
 *  to platform map or to a Latin-only `label`. Never emits CJK on a
 *  non-zh page as long as data sets the matching `labelXx`. */
export function channelLabel(
  ch: { platform: string; label?: string; labelEn?: string; labelJa?: string },
  lang: Lang,
  platformLabelsOverride?: Record<string, string>
): string {
  const platformMap = platformLabelsOverride ?? PLATFORM_LABELS_EN;
  if (lang === DEFAULT_LOCALE) {
    return ch.label || platformMap[ch.platform] || ch.platform;
  }
  // Index into ch via a string key derived from the FALLBACK_CHAIN. We
  // cast to a generic record to allow the dynamic key lookup.
  const chRec = ch as unknown as Record<string, unknown>;
  for (const candidate of FALLBACK_CHAINS[lang] || [lang, DEFAULT_LOCALE]) {
    if (candidate === DEFAULT_LOCALE) {
      // The default-locale label is zh; only use it if it's Latin-only,
      // unless we're rendering zh-tw — then run it through OpenCC.
      if (ch.label && !/[一-鿿]/.test(ch.label)) return ch.label;
      if (ch.label && lang === 'zh-tw') return openccConvert(ch.label);
      continue;
    }
    const key = `label${siblingSuffix(candidate)}`;
    const v = chRec[key];
    if (typeof v === 'string' && v) return v;
  }
  if (platformMap[ch.platform]) return platformMap[ch.platform];
  if (ch.label && !/[一-鿿]/.test(ch.label)) return ch.label;
  return ch.platform;
}

/** Dictionary lookup. Returns a stable string. Walks the fallback chain
 *  for the target lang, returning the first non-empty hit. zhTw entries
 *  that miss the chain and fall to zh get auto-converted via OpenCC. */
export function t(lang: Lang, key: keyof typeof zh): string {
  for (const candidate of FALLBACK_CHAINS[lang] || [lang, DEFAULT_LOCALE]) {
    const dict = DICTIONARIES[candidate];
    const value = dict?.[key];
    if (typeof value === 'string' && value !== '') {
      return maybeConvertToTraditional(value, lang, candidate);
    }
  }
  return (zh[key] as string) ?? (key as string);
}

// ---- Dictionaries ------------------------------------------------------

export const zh = {
  // Site identity
  siteName: '新加坡 AI 观察',
  siteShortName: '新加坡 AI',
  siteTagline: '深度观察新加坡 AI 生态与战略',
  siteDescription:
    '新加坡 AI 观察是一个独立、多语言的研究型观察站，基于公开资料和一手来源，持续追踪新加坡 AI 战略、政策执行、国会辩论、产业生态、人才培养、开源项目与国际对标。',

  // Navigation labels (top-level)
  navAnalysis: '观察',
  navPolicy: '政策与战略',
  navDebates: '辩论与声音',
  navData: '数据追踪',
  navAbout: '关于',

  // Sub-navigation
  navPolicies: '政策文件',
  navLevers: '国家 AI 抓手图谱',
  navLegalAi: 'AI 法律框架',
  navTimeline: '发展时间线',
  navEcosystem: '生态地图',
  navParliament: '国会 AI 焦点',
  navVoices: 'AI 影响力图谱',
  navVideos: 'AI 视频观点',
  navTracker: 'AI 仪表盘',
  navStartups: 'AI 创业生态',
  navTalent: '人才培养',
  navOpensource: '官方开源与研究',
  navCommunityOpensource: '产学研开源生态',
  navBenchmarking: '国际对标',
  navAboutSite: '关于本站',
  navFieldnotes: '实战经验',
  navReferences: '参考资源',
  navAllArticles: '全部文章',
  navHome: '首页',
  navBackToBlog: '返回观察',
  postPrevOlder: '← 上一篇（更早）',
  postNextNewer: '下一篇（更新） →',
  footerMaintainedBy: '由 {handle} 维护',

  // Common UI
  search: '搜索',
  searchPlaceholder: '搜索政策、辩论、抓手、人物、博文……',
  closeSearch: '关闭搜索',
  searchSiteLabel: '站内搜索',
  searchFallbackMessage: '搜索暂时不可用，请刷新页面后重试。',
  navAsk: 'AI 问答',
  askPageDesc: '就新加坡 AI 战略、政策、生态随便提问，AI 基于本站数据回答，并附来源链接。',
  askDisclaimer: '回答由 AI 生成，可能有误，请以站内原文与官方来源为准。',
  askPlaceholder: '问关于新加坡 AI 的任何问题…',
  askSend: '发送',
  askNewChat: '新对话',
  askPresetHeading: '试试这些问题',
  askThinking: '思考中…',
  askQuotaLeft: '今日剩余 {n} 次提问',
  askQuotaExceeded: '今日提问次数已用完，明天再来；也可以先浏览站内内容。',
  askErrorGeneric: '出错了，请重试。',
  askErrorUnavailable: 'AI 问答暂未开通。',
  askRetry: '重试',
  askEntryTitle: '问 AI',
  loadMore: '加载更多',
  readMore: '阅读全文',
  backTo: '返回',
  back: '返回',
  related: '关联',
  relatedReading: '相关阅读',
  source: '来源',
  officialSourceText: '官方原文',
  sourcePdf: '原文 PDF',
  translation: '中文翻译',
  englishTranslation: 'English translation',
  participants: '参与人员',
  authors: '主要作者 / 推动者',
  policySignal: '政策信号',
  governmentStance: '政府立场',
  oppositionStance: '质询立场',
  keyPoints: '关键要点',
  fullTextEn: '英文原文',
  hansardSource: 'Hansard 原始记录',
  controversyLevel: '争议度',

  // Homepage chrome
  heroEyebrow: '新加坡 AI 观察',
  heroHeadline: '新加坡的 AI 战略不在算法。',
  heroHeadline2: '在 6 个抓手。',
  heroSubtitle: '把整个国家当作企业 AI-native 转型的"包装层"——国家自己不必成为 AI-native，只要把企业转型速度放大就够。',
  heroSubtitleNeutral: '一个城邦在 AI 时代的国家级转型——政策文件、国会辩论、抓手图谱、创业生态、法律框架的独立分析。',
  ctaReadCore: '阅读核心论证',
  ctaBrowseAll: '浏览全部观察 →',
  freshnessPolicies: '核心政策',
  freshnessDebates: '国会辩论',
  freshnessLevers: '抓手项目',
  freshnessUpdated: '最近更新',
  latestAnalyses: '最新观察',
  viewAll: '查看全部 →',
  viewAllLeversCta: '完整图谱 →',
  viewAllDebatesCta: '全部 {count} 场 →',
  leversSection: '国家级 AI-native 抓手图谱',
  leversBlurb: '6 个抓手覆盖 {count} 个具体落地项目。按"AI 引入路径"重新切片，跨多个部委串成完整执行管线。',
  leverMapColPassThrough: '穿透到企业',
  leverMapColDirect: '国家直接做',
  leverMapColPassThroughHint: '国家通过这些抓手把企业 AI 转型放大',
  leverMapColDirectHint: '国家自己直接做，不依赖企业',
  leverProjectsSuffix: '项目',
  transmissionFootnote: '7 条传导杠杆里，只有 2 条是国家直接做的；其他 5 条都是国家穿透到企业的杠杆。',
  transmissionFootnoteCta: '了解 7 条传导杠杆 →',
  recentDebatesSection: '最近国会辩论',
  recentDebatesBlurb: '从 {from} 到 {to}，议会围绕 AI 的每一次质询、答复与辩论。',
  closingThesis: 'AI-native 不是规模，是架构。国家不可能"自己"AI-native——它必须穿透到企业。',
  closingCta: '读"AI-native 国家"全文',
  leverWord: '抓手',
  homeTrackerSection: '新加坡 AI 仪表盘',
  homeTrackerBlurb: '6 个维度的当下读数，按月更新。',
  homeTrackerCta: '完整仪表盘 →',

  // Listings / categories
  policiesPageTitle: '新加坡 AI 政策库 — 全文档案与时间线',
  policiesPageBlurb:
    '新加坡 AI 政策档案库：NAIS 2.0、Model AI Governance Framework、Copyright §244、AI Verify、ASEAN Guide 等核心政策全文与摘要，按战略/治理/法律/部门分类，时间倒序。',
  policiesItemsSuffix: '份',
  policyArchiveSuffix: '政策档案',
  backToPolicies: '返回政策库',
  debatesPageTitle: '国会 AI 焦点',
  blogIndexTitle: '观察',
  blogPageNumber: '第 {n} 页',
  blogTagTitle: '标签「{tag}」的文章',
  aboutPageTitle: '关于本站',
  aboutPageDesc: '关于新加坡 AI 观察——独立维护的新加坡 AI 战略观察平台。研究方法、利益声明、反馈方式。',
  evolutionPageTitle: '政策演进分析',
  evolutionPageDesc: '新加坡 AI 政策演进全景——从 2014 年智慧国家到 2024 年 NAIS 2.0 的战略转型历程。',
  timelinePageTitle: '发展时间线',
  timelinePageDesc: '新加坡 AI 发展时间线：从 2014 年智慧国家到 2027 年国际 AI 奥林匹克，关键里程碑按时间排列。',
  ecosystemPageTitle: '生态地图',
  ecosystemPageDesc: '新加坡 AI 生态地图——政府机构、研究院所、企业与初创公司的完整版图。',
  leversPageTitle: '新加坡国家 AI 抓手图谱 — 6 大跨部委执行管线',
  leversPageDesc:
    '新加坡国家级 AI-native 转型，按"AI 引入路径"重新归类 Budget 2026 + 各部委 AI 政策——基建、治理、人才、应用、政府自用、外交六个抓手，每条抓手都跨部委，链接政策原文。',
  investorNotableDeals: '代表交易：',
  startupsPageTitle: '新加坡 AI 创业公司',
  startupsPageSubtitle:
    '新加坡 AI-native、AI-enabled 与相邻资本生态的实体目录；每家公司、项目与投资者都进入可持续扩展的档案。',
  talentPageTitle: '人才培养',
  talentPageDesc: '新加坡 AI 人才培养体系——高校项目、政府培训计划、人才引进政策一览。',
  talentProgrammeProfile: '项目档案',
  talentOfficialSourceHeading: '官方来源',
  talentCheckedByThisSite: '本站校验：',
  talentMoreProgrammes: '其他人才项目',
  talentSourcesNote: '数据来源：AI Singapore、LearnAI、AIAP、NAISC 与 IOAI 官方页面。本站校验日期：{date}。',
  jobsIndexHeading: 'AI 人才需求侧：在招职位月度快照',
  regLookaheadHeading: '监管前瞻：进行中的咨询与法案',
  regLookaheadIntro:
    '成法之前的管道——开放中的公众咨询和正在国会走程序的相关法案，每周自动刷新。成法后由编辑移入下方正式分组。',
  regLookaheadOpenBadge: '咨询开放中',
  regLookaheadDeadline: '截止',
  regLookaheadDaysLeft: '还剩 {n} 天',
  regLookaheadCoreBadge: '核心 AI 相关',
  regLookaheadArchive: '已归档',
  regLookaheadStage_introduced: '一读提交',
  'regLookaheadStage_second-reading': '二读',
  regLookaheadStage_passed: '通过',
  regLookaheadStage_assented: '总统批准',
  regLookaheadStage_withdrawn: '撤回',
  regLookaheadStatus_open: '开放中',
  regLookaheadStatus_closed: '已截止',
  'regLookaheadStatus_response-published': '回应已发布',
  jobsRoleEngineering: '工程',
  jobsRoleResearch: '研究',
  jobsRoleData: '数据 / ML',
  jobsRoleProduct: '产品',
  jobsRoleGtm: '市场与销售',
  jobsRoleOpsOther: '运营及其他',
  jobsIndexIntro:
    '以上是供给侧（培训与竞赛计划）。这里是需求侧：MyCareersFuture 官方招聘门户上在招 AI 职位的月度聚合快照——只做聚合统计，不转载职位。序列按月积累，方法论冻结，长期形成独家时间线。',
  jobsIndexTotalLabel: '在招 AI 职位',
  jobsIndexMedianLabel: '月薪中位数（披露样本）',
  jobsIndexBandLabel: 'P25–P75 区间',
  jobsIndexDisclosureLabel: '薪资披露率',
  jobsIndexTopEmployersLabel: 'Top 10 雇主',
  jobsIndexRolesLabel: '职能分布',
  jobsIndexMoMLabel: '环比上月',
  jobsIndexAccumulating: '时间序列积累中——首个季度对比将在两个季度数据齐备后呈现。',
  jobsIndexMethodNote:
    '方法论 v{v}：固定查询篮子按职位 uuid 去重；薪资仅统计披露的月薪区间中点；快照不可变。快照月份：{month}。',
  videosPageTitle: 'AI 视频观点',
  videosPageDesc: '新加坡政府官员、学者和行业领袖关于 AI 战略、治理、人才和产业的 YouTube 演讲与访谈合集。',
  voicesPageTitle: '新加坡 AI 影响力图谱 — 关键人物、机构、官方演讲库',
  voicesPageDesc:
    '新加坡 AI 政策关键决策者完整档案：部长、议员、学者、企业家——其国会发言、主导政策、视频观点与官方信息渠道；含 MDDI AI 相关演讲全文检索。',
  opensourcePageTitle: '官方开源与研究',
  opensourcePageDesc: '新加坡政府与官方机构的 AI 开源项目和研究成果汇总——SEA-LION、AI Verify 等。',
  opensourcePageSubtitle: 'AI Singapore 及新加坡政府资助的开源项目与研究成果',
  opensourceIntroBefore:
    'ℹ️ 本页收录 AI Singapore 及新加坡政府资助的开源项目与研究成果。新加坡产学研社区的更多开源项目请查看',
  opensourceIntroAfter: '页面。',
  opensourceSeaLionSection: '🦁 SEA-LION 模型生态',
  opensourceStatTotalModels: '模型总数',
  opensourceStatTotalDownloads: '总下载量',
  opensourceStatTotalLikes: '总点赞数',
  opensourceStatTopModelDownloads: '最热门模型下载',
  osTableVersion: '版本',
  osTableModels: '模型数',
  osTableDownloads: '下载量',
  osTableLikes: '点赞',
  osTablePeriod: '时期',
  opensourceViewOnHuggingFace: '🤗 在 HuggingFace 上查看全部模型 →',
  opensourceSeaGuardSection: '🛡️ SEA-Guard 安全模型',
  opensourceModelsCountSuffix: '个模型',
  opensourceDownloadsCountSuffix: '次下载',
  opensourceAiVerifySection: '✅ AI Verify 治理框架',
  opensourceOpenSourcedOn: '开源于 {date}',
  opensourcePartners: '合作伙伴',
  opensourceOfficialIndexSection: '📦 官方项目索引',
  opensourceOfficialIndexBlurb: '每张卡片都是一个可持续补充的项目档案。',
  opensourcePapersSection: '📄 研究论文',
  opensourceChineseTranslation: '中文翻译 →',
  communityOsPageTitle: '产学研开源生态',
  communityOsPageDesc: '新加坡产学研 AI 开源生态——大学、企业实验室、创业公司的开源贡献全景。',
  communityOsPageSubtitle: '新加坡大学、国际企业实验室与创业公司的 AI 开源项目',
  communityOsUniversitiesSection: '大学与研究机构',
  communityOsUniversitiesBlurb: '高校实验室输出的模型、工具箱和训练系统；每张卡片进入独立项目档案。',
  communityOsCorporateLabsSection: '国际企业新加坡实验室',
  communityOsCorporateLabsBlurb: '跨国科技公司在新加坡及相关研究网络中的开源模型、训练框架和工具。',
  communityOsStartupsSection: '创业公司',
  communityOsStartupsBlurb: '以开源作为产品分发和开发者社区入口的新加坡 AI 创业样本。',
  benchmarkingPageTitle: '国际对标',
  benchmarkingPageDesc: '新加坡 AI 战略国际对标——与美国、英国、中国、欧盟等主要经济体的对比分析。',
  legalAiPageTitle: '新加坡 AI 法律框架',
  legalAiPageDesc:
    '新加坡 AI 法律框架——"训练宽松 + 输出严管"双轨：Copyright §244 全球最宽松的 AI 训练例外，配合 OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill 四件套输出严管。',
  legalCorePoint: '核心结论',
  legalDetailedNote: '详细说明',
  legalFrameworkPosition: '在法律框架中的位置',
  legalStatuteSource: '法律原文 / 来源',
  legalViewLevers: '查看国家 AI 抓手',
  legalRelatedCards: '同组法律卡片',
  challengesPageTitle: '挑战与约束分析',
  challengesPageDesc: '新加坡 AI 发展面临的核心挑战——人才竞争、数据限制、算力约束与伦理治理。',
  fieldnotesPageTitle: '实战经验',
  fieldnotesPageDesc: '在新加坡从事 AI 工作的一线观察与实战经验分享，按主题聚合，帮你少走弯路。',
  referencesPageTitle: '参考资料库',
  referencesPageDesc: '新加坡 AI 参考资源——官方报告、研究论文、数据集、工具与推荐阅读。',
  policiesStatProfiles: '档案总数',
  policiesStatCategories: '分类',
  policiesStatFormat: '形态',
  policiesStatFormatValue: '档案页',

  // Banner: language switch suggestion
  langBannerEn: 'English version available',
  langBannerSwitch: 'Read in English →',
  langBannerDismiss: '关闭',
  langZh: '中文',
  langEn: 'English',
  langToggleLabel: '切换语言',

  // Footnotes
  footnotes: '参考文献',
  tocLabel: '目录',
  tocSummary: '📑 目录（{count} 节）',

  // Tracker dashboard
  trackerPageTitle: '新加坡 AI 观察仪表盘',
  trackerPageBlurb:
    '6 维度呈现新加坡 AI 真实状态——核心数字、第三方排名、目标进度、趋势、编辑解读、关键短板。我们不打分。',
  trackerSectionTopRankings: '国际参照',
  trackerSectionMethodologyNote: '方法说明',
  trackerSectionMethodology: '详细方法论',
  trackerCardTrendUp: '↗ 向上',
  trackerCardTrendFlat: '→ 持平',
  trackerCardTrendDown: '↘ 向下',
  trackerDetailJudgment: '编辑解读',
  trackerDetailShortcoming: '关键短板',
  trackerDetailRankings: '第三方排名锚',
  trackerDetailProgress: '目标进度',
  trackerDetailMetrics: '完整数据',
  trackerDetailRelated: '关联阅读',
  trackerDetailMetricsHeaderName: '指标',
  trackerDetailMetricsHeaderValue: '数据',
  trackerDetailMetricsHeaderSource: '来源 / 时间',
  trackerDetailMetricsHeaderCategory: '分组',
  trackerDetailCardHeadline: '核心数字',
  trackerDetailCardBenchmark: '参照系',
  trackerDetailCardBadge: '定位',
  trackerDetailCardTrend: '趋势',
  trackerCategoryEnterprise: '企业采用',
  trackerCategoryGovernment: '政府自用',
  trackerMethodologyTitle: '仪表盘方法论',
  trackerMethodologyDesc: '我们怎么做仪表盘——呈现什么、不呈现什么、为什么不打总评分。',
  capitalSectionTitle: '资本与基础设施',
  capitalSectionLead:
    '把散在散文里的资本事件做成带日期、带金额、带来源的记录。金额是该事件的总规模，不拆分到单个参与方。',
  capitalEventLabel: '事件',
  fpMissionsSection: '四大国家 AI 任务',
  newsletterTitle: '月度邮件',
  newsletterBlurb: '每月一封：当月更新精选加一段站方判断。不卖广告，不发垃圾。',
  newsletterEmailLabel: '你的邮箱',
  newsletterSubmit: '订阅',
  capitalKindColumnLabel: '类型',
  capitalDateLabel: '日期 / 来源',
  capitalKindHyperscaler: '超大规模厂商承诺',
  capitalKindSovereign: '主权投资',
  capitalKindFund: '资金盘',
  capitalAmountTypeRound: '轮次规模',
  capitalAmountTypeCommitment: '累计承诺',
  capitalAmountTypeExposure: '持仓规模',
  capitalAmountTypeJointVenture: '合资规模',
  capitalAmountTypeCumulative: '累计拨付',
  capitalAmountTypeEnvelope: '政府专项',
  capitalAmountTypeUndisclosed: '未披露',
  capitalPartiesLabel: '参与方',
  capitalAmountLabel: '金额',
  capitalRatioLabel: '放大倍数',
  capitalRatioCaveat:
    '比值口径：分子为五家超大规模厂商在新加坡的累计承诺（US$260 亿+，数据中心与区域总部），分母为 2023–2026 政府 AI 专项（S$20 亿+）。跨币种未做汇率折算，比值仅作示意；「+」表示披露口径为下限。',
  trackerHomeSummaryTitle: '🇸🇬 新加坡 AI 仪表盘',
  trackerHomeSummaryCta: '6 维度看现状 → 完整仪表盘',
  trackerEditorialAttribution: 'sgai 编辑解读',
  trackerBackToDashboard: '返回仪表盘',
  trackerLastUpdated: '数据更新',

  // Voice profile sections (curated)
  voiceSignatureWork: '主导工作',
  voiceNotableQuotes: '公开发声',
  voiceSpeakingRecord: '近期演讲',
  voiceExternalRoles: '跨机构身份',
  voiceSinceLabel: '自',
  voiceSourceLabel: '来源',
  voiceAuthorLabel: '作者',

  // Task-based homepage entries — "what can you do here?"
  tasksSection: '从这里开始',
  tasksBlurb: '不同问题，不同入口。先告诉我你想做什么。',
  taskUnderstandTitle: '我要理解新加坡 AI 战略',
  taskUnderstandBlurb: '6 抓手图谱、政策演进、国际对标——把整个故事串起来。',
  taskUnderstandCta: '从核心论证读起 →',
  taskPolicyTitle: '我要找政策、法规、官方出处',
  taskPolicyBlurb: '政策库、AI 法律框架、国会辩论、参考资源——可引用的一手来源。',
  taskPolicyCta: '查政策与辩论 →',
  taskBusinessTitle: '我要看企业和创业机会',
  taskBusinessBlurb: '创业生态、生态地图、人才培养、开源项目、国际对标。',
  taskBusinessCta: '看生态与公司 →',
  taskTrackTitle: '我要跟踪最新变化',
  taskTrackBlurb: '最近更新、tracker 数据、最新国会辩论、新发布的政策。',
  taskTrackCta: '看更新流 →',

  // Updates feed
  updatesNav: '最近更新',
  updatesPageTitle: '最近更新',
  updatesPageBlurb: '本站每周新增的政策、辩论、视频、创业、长文与数据修正——一个流，全在这里。',
  updatesHomeSection: '最近更新',
  updatesHomeBlurb: '本周和上周新加进站的政策、辩论、视频、长文。每条都直达原页面。',
  updatesHomeCta: '完整更新流 →',
  updatesEmpty: '最近暂无更新。',
  updatesRssTitle: '新加坡 AI 观察 — 最近更新',
  updatesRssDescription: '新增政策、辩论、视频、创业档案、长文和数据修正。',
  updateTypePolicy: '政策',
  updateTypeDebate: '辩论',
  updateTypeVideo: '视频',
  updateTypeStartup: '创业',
  updateTypePeople: '人物',
  updateTypeSpeech: '演讲',
  updateTypeTracker: '仪表盘',
  updateTypeBenchmark: '对标',
  updateTypeEcosystem: '生态',
  updateTypeLever: '抓手',
  updateTypeLongform: '长文',
  updateTypeSite: '站点',
  updateTypeFix: '修正',

  // Front page (news-portal homepage)
  fpMastheadTagline: '最新动态',
  fpMastheadUpdated: '更新于',
  fpStatVideos: '视频观点',
  fpFocusEyebrow: '焦点',
  fpBrowseSection: '浏览方式',
  fpBrowseByTime: '按时间浏览',
  fpBrowseByTopic: '按主题浏览',
  fpHotSection: '热门入口',
  fpPicksSection: '热门专题',
  fpDirectorySection: '全站内容导览',
  fpDirectoryBlurb: '12 个持续更新的数据域，每张卡片都显示最新收录。',
  fpLatestPrefix: '最新',
  fpEntriesSuffix: '条记录',
  fpStartHereSection: '理解这套框架',
  listingLatestSection: '最新收录',
  crossRailHeading: '继续探索',

  // Nav additions (news-portal)
  navLatest: '最新',
  navChallenges: '挑战与约束',
  navEvolution: '政策演进',

  // Full-page search (/search/)
  searchPageDesc: '搜索全站内容：政策、辩论、视频、人物、抓手、文章。支持中文、English、日本語、한국어、繁體中文。',

  // Topics hub (/topics/)
  topicsIndexDesc: '15 个主题横切全站内容——每个主题一页，汇集相关辩论、政策、视频、人物与文章。',
  topicEntriesCount: '{count} 条相关内容',
  topicViewAll: '查看全部 {count} 条 →',
  relatedTopicsHeading: '相关主题',
  sameTopicHeading: '同主题更多',
  topicKindLegal: '法律',
  topicKindTimeline: '时间线',
  topicKindTalent: '人才',
  pnOlder: '← 更早一条',
  pnNewer: '更新一条 →',

  // Detail page sections (shared across debate/speech/video/voice detail pages)
  fullTextTranslated: '完整译文（中文）',
  coreViewpoint: '核心观点',
  relatedVideos: '关联视频',
  speaker: '演讲者',
  videoType: '类型',
  videoSource: '来源',
  videoSummary: '内容摘要',
  videoFullTranscript: '完整字幕（原文整理）',
  videoReadableTranscript: '可读字幕整理',
  videoCaptionLanguage: '字幕语言：',
  videoFetched: '抓取日期：',
  videoCaptionsUnavailable: '暂无可读字幕，可点击上方播放原视频。',
  parliamentSession: '届国会',
  speechSummaryPoints: '要点',
  mddiSpeechLabel: 'MDDI 演讲稿',
  mddiSourceLabel: 'MDDI 官网原文',
  categoryGovernment: '政府',
  categoryAcademic: '学术',
  categoryIndustry: '产业',
  officialChannels: '官方渠道',
  oneLinerTitle: '一句话定位',
  profilePending: '此人物档案待补充。当前页面先根据已有数据自动汇总其国会发言与政策关联。',
  debateCount: '国会发言',
  policyCount: '主导政策',
  videoCount: '视频观点',
  noDebateRecords: '暂无关联辩论记录。',
  voiceParlRecord: '国会 AI 发言记录',
  voiceParlByYear: '按年份',
  voiceParlByTopic: '按议题',
  officialWebsite: '官网',
  ecosystemReadMore: '了解详情 →',
  ecosystemVisitWebsite: '访问 {name} 官网',
  ecosystemSubtitle: 'AI Singapore 七大支柱与关键参与者，呈现新加坡 AI 生态系统全貌。',
  ecosystemSourceFootnote: '数据来源：AI Singapore 官网及公开信息。生态持续演进，欢迎补充。',

  // Benchmarking profile pages (CaseProfile / RegionProfile / DrilldownProfile)
  benchmarkCrumb: '国际对标',
  benchmarkDrilldownEyebrow: '对标下钻 · 更新于',
  benchmarkOwnerLabel: '归属方',
  benchmarkWhyItMatters: '为什么值得观察',
  benchmarkSingaporeTakeaway: '对新加坡的启发',
  benchmarkSourcesHeading: '参考来源',
  benchmarkReferencesHeading: '参考来源',
  benchmarkOfficialSourceLabel: '官方来源',
  benchmarkRegionBackground: '地区背景',
  benchmarkAnotherCase: '另一个案例',
  benchmarkContinueCases: '继续看案例',
  benchmarkDataNoteHeading: '数据说明',
  benchmarkBackTo: '返回国际对标',
  benchmarkCoreStrategy: '核心战略',
  benchmarkInvestmentScale: '投资规模',
  benchmarkGovernanceModel: '治理模式',
  benchmarkComparativeStrength: '核心优势',
  benchmarkOneLineRead: '一句话判断',
  benchmarkCoreStrategiesHeading: '核心战略',
  benchmarkInvestmentHeading: '投资与资源',
  benchmarkGovernanceHeading: '治理模式',
  benchmarkStrengthsHeading: '相对新加坡的优势',
  benchmarkWeaknessesHeading: '相对新加坡的劣势',
  benchmarkKeyHeading: '关键举措与机构',
  benchmarkKeyInitiatives: '关键举措',
  benchmarkKeyBodies: '关键机构',
  benchmarkItemLabel: '项目',
  benchmarkAmountLabel: '金额',
  benchmarkNoteLabel: '备注',
  benchmarkPendingHeading: '详情待扩展',
  benchmarkRelatedHeading: '关联阅读',
  benchmarkOverview: '国际对标总览',
  benchmarkLeversCta: '新加坡国家 AI 抓手',
  benchmarkLegalCta: '新加坡 AI 法律框架',
  benchmarkContinueHeading: '继续比较',
  benchmarkExpandHeading: '展开说明',
  benchmarkContinueRegion: '同地区继续下钻',
  benchmarkIntroSubtitle: '从国家战略下钻到具体公司、项目、机构和基础设施。',
  benchmarkIntroCallout:
    '真正有用的对标，不是"某国 AI 很强"这种空话，而是看它把哪个具体对象做成了国家能力：一只基金、一所大学、一个模型、一套测试框架、一个政府 AI 助手，或一个供应链节点。',
  benchmarkStatCaseProfiles: '案例档案',
  benchmarkStatRegionProfiles: '地区背景',
  benchmarkStatProfilesUpdated: '档案更新',
  benchmarkLibraryHeading: '标杆案例库',
  benchmarkLibrarySubtitle: '每张卡片对应一个可继续丰富的公司、项目或机构档案。',
  benchmarkViewRegionOverview: '看地区总览',
  benchmarkKeyInsightsHeading: '关键洞察',
  benchmarkOverviewComparisonHeading: '总览对比表',
  benchmarkColRegion: '地区',
  benchmarkColCoreStrategy: '核心战略',
  benchmarkColYear: '年份',
  benchmarkColInvestment: '投资规模',
  benchmarkColGovernance: '治理模式',
  benchmarkColStrength: '核心优势',
  benchmarkColAiRanking: 'AI 排名',
  benchmarkRegionPagesHeading: '地区背景页',
  benchmarkViewRegionProfile: '查看国家 / 地区档案',
  benchmarkBaseDataUpdated: '基础数据更新',
  benchmarkCaseProfilesCurated: '案例档案整理',
  benchmarkReportArchiveHeading: 'Stanford AI Index 报告档案',
  benchmarkReportArchiveIntro:
    '本页多项国际对比数据源自斯坦福 HAI 的年度 AI Index 报告。这里按年份归档各版报告的核心内容与原文链接。',
  benchmarkReportArchiveRead: '阅读原报告',

  // Open source / community open source project detail pages
  osBack: '返回官方开源与研究',
  osCommunityBack: '返回产学研开源生态',
  osProfile: '项目档案',
  osCommunityProfile: '项目档案',
  osOwner: '归属',
  osOrg: '机构',
  osOrgType: '分组',
  osCategory: '类别',
  osStatus: '状态',
  osFounded: '启动',
  osLanguage: '语言 / 形态',
  osLicense: '协议',
  osUpdated: '信息更新',
  osWhatItIs: '是什么',
  osAiRelevance: '与 AI 的关系',
  osSingaporeRelevance: '与新加坡的关系',
  osMilestones: '关键里程碑',
  osResources: '资源入口',
  osCommunityRelated: '更多产学研项目',
  osOrgTypeUniversity: '大学与研究机构',
  osOrgTypeCorporateLab: '国际企业实验室',
  osOrgTypeStartup: '创业公司',

  // RelatedRail cross-link component
  railRel: '关联：',
  railNoneYet: '尚未关联其他资源。',
  railPeople: '人物',
  railPolicies: '政策',
  railDebates: '国会辩论',
  railLevers: '抓手',
  railTimeline: '时间节点',
  railAnalyses: '观点',
  railMoreDebates: '…另有 {n} 条',
  railMoreDebatesInline: '+{n} 条辩论',

  // Startup entity detail page
  startupKindCompany: '公司 / 项目',
  startupKindExit: '退出 / 收购样本',
  startupKindInvestor: '投资机构',
  startupPositioning: '定位',
  startupCapitalSignals: '资本与市场信号',
  startupAiRelationHeading: 'AI 关联判断',
  startupWhyItMatters: '为什么值得观察',
  startupSignalsToTrack: '后续追踪问题',
  startupSignalsPending: '公开资本信号待补。',
  startupNote: '备注',
  startupRelatedEntities: '相关实体',
  startupDataNote: '数据说明',
  startupTypeLabel: '类型',
  startupVerticalLabel: '领域 / 分组',
  startupAiRelationLabel: 'AI 关联度',
  startupPublicFunding: '公开融资',
  startupValuation: '估值',
  startupStatusLabel: '状态',
  startupInvestorsLabel: '投资者',
  startupAcquirerLabel: '收购方',
  startupAmountYear: '金额 / 年份',
  startupTrackRecord: '投资记录',
  startupFocusLabel: '重点领域',
  startupUnicornBadge: '独角兽',
  startupBackTo: '返回 AI 创业生态',
  startupNav: 'AI 创业生态',

  // Startups listing page (/startups/)
  startupStatAiCompanies: 'AI 公司数（Tracxn 收录）',
  startupStatGlobalRank: '全球第 {rank}',
  startupStatHubRank: 'AI 枢纽排名',
  startupStatSeaFundingShare: '东南亚 AI 融资占比',
  startupStatTotalVcRaised: 'VC 融资总额',
  startupStatUnicorns: '独角兽',
  startupStatGovCommitment: '政府 AI 承诺投入',
  startupUnicornsSectionTitle: '独角兽与上市样本',
  startupByVerticalTitle: '按领域分类',
  startupExitsSectionTitle: '重要退出与收购',
  startupInvestorEcosystemTitle: '投资者生态',
  startupRaisedLabel: '融资',
  startupTrackRecordColon: '投资记录：',
  startupFocusColon: '重点领域：',

  // Generic count suffixes / small chrome shared across listing pages
  openProfileCta: '查看档案',
  entitiesCountSuffix: '个实体',
  institutionsCountSuffix: '家机构',
  companiesCountSuffix: '家',
  recordsCountSuffix: '条',
  yearPending: '年份待补',

  // Generic filter-bar chrome (voices/videos listing pages)
  filterTopicLabel: '主题',
  filterYearLabel: '年份',
  filterSpeakerLabel: '演讲者',
  filterSpeakerTypeLabel: '演讲者类型',
  filterAllLabel: '全部',
  filterClearLabel: '清除筛选',
  filterClearAllLabel: '清除所有筛选',
  filterShowingLabel: '显示',
  filterResultsSuffix: '条结果',
  noVideosMatchFilter: '没有符合筛选条件的视频',
  noSpeechesMatchFilter: '没有符合筛选条件的演讲稿',

  // Voices listing page (/voices/)
  voicesIntroBlurb: '新加坡 AI 领域的关键人物与机构，及其官方信息传播渠道。',
  voicesIntroSubBlurb: '追踪他们的动态，获取第一手 AI 政策与战略信息',
  voicesStatPeople: '关键人物',
  voicesStatInstitutions: '核心机构',
  voicesStatSpeeches: '官方演讲稿',
  voicesStatVideos: 'YouTube 视频',
  voicesKeyPeopleSection: '关键人物',
  voicesCoreInstitutionsSection: '核心机构',
  voicesMddiSpeechesSection: '官方 AI 相关演讲稿',
  voicesYoutubeVideosSection: 'YouTube AI 视频',
  mddiSourceTitle: 'MDDI 官网原文',

  // Videos listing page (/videos/)
  videosIntroBlurb: '新加坡政府官员、学者和行业领袖关于人工智能的 YouTube 演讲与访谈。',
  videosIntroSubBlurb: '点击视频卡片查看摘要、字幕与关联视频',
  videosStatTotal: '视频总数',
  videosStatSpeakers: '演讲者',
  videosStatYears: '覆盖年份',

  // Voice profile detail page (/voices/[id]/)
  voicePositioningHeading: '一句话定位',
  voicePoliciesChampionedHeading: '主导政策（{count}）',
  voiceAiVideosHeading: '视频观点（{count}）',

  // Debate/speech detail page chrome
  sprsHansardOriginal: 'SPRS Hansard 原始记录',
  fetchedAtColon: '抓取日期：',

  // Misc
  viewSource: '查看源码',
  countSuffix: '场',
  copyrightOpenSource: '源代码 MIT 许可证；内容 CC BY 4.0',
};

export const en: Partial<Record<keyof typeof zh, string>> = {
  siteName: 'Singapore AI Observatory',
  siteShortName: 'SG AI',
  siteTagline: 'In-depth coverage of Singapore’s AI strategy',
  siteDescription:
    'Singapore AI Observatory is an independent, multilingual research observatory tracking Singapore’s AI strategy, policy execution, parliamentary debates, industry ecosystem, talent pipeline, open-source projects, and international benchmarks from public and primary sources.',

  navAnalysis: 'Opinion',
  navPolicy: 'Policy & Strategy',
  navDebates: 'Debates & Voices',
  navData: 'Data',
  navAbout: 'About',

  navPolicies: 'Policy Library',
  navLevers: 'National AI Levers',
  navLegalAi: 'AI Legal Framework',
  navTimeline: 'Timeline',
  navEcosystem: 'Ecosystem Map',
  navParliament: 'Parliament AI Focus',
  navVoices: 'Influence Map',
  navVideos: 'Video Library',
  navTracker: 'AI Dashboard',
  navStartups: 'AI Startups',
  navTalent: 'Talent Pipeline',
  navOpensource: 'Official Open Source',
  navCommunityOpensource: 'Community Open Source',
  navBenchmarking: 'International Benchmarks',
  navAboutSite: 'About',
  navFieldnotes: 'Field Notes',
  navReferences: 'References',
  navAllArticles: 'All articles',
  navHome: 'Home',
  navBackToBlog: 'Back to Opinion',
  postPrevOlder: '← Previous (older)',
  postNextNewer: 'Next (newer) →',
  footerMaintainedBy: 'Maintained by {handle}',

  search: 'Search',
  searchPlaceholder: 'Search policies, debates, levers, people, articles…',
  closeSearch: 'Close search',
  searchSiteLabel: 'Site search',
  searchFallbackMessage: 'Search is temporarily unavailable. Please refresh the page and try again.',
  navAsk: 'Ask AI',
  askPageDesc:
    'Ask anything about Singapore AI strategy, policy, or the ecosystem — the AI answers from this site’s data with source links.',
  askDisclaimer: 'Answers are AI-generated and may contain mistakes; rely on the site’s pages and official sources.',
  askPlaceholder: 'Ask anything about Singapore AI…',
  askSend: 'Send',
  askNewChat: 'New conversation',
  askPresetHeading: 'Try one of these',
  askThinking: 'Thinking…',
  askQuotaLeft: '{n} questions left today',
  askQuotaExceeded: 'You’ve used today’s questions. Come back tomorrow — or keep browsing the site.',
  askErrorGeneric: 'Something went wrong. Please try again.',
  askErrorUnavailable: 'Ask AI isn’t configured yet.',
  askRetry: 'Retry',
  askEntryTitle: 'Ask the AI',
  loadMore: 'Load more',
  readMore: 'Read more',
  backTo: 'Back to',
  back: 'Back',
  related: 'Related',
  relatedReading: 'Related Reading',
  source: 'Source',
  officialSourceText: 'Official source text',
  sourcePdf: 'PDF',
  translation: 'Chinese translation',
  englishTranslation: 'English translation',
  participants: 'Participants',
  authors: 'Lead authors / drivers',
  policySignal: 'Policy Signal',
  governmentStance: 'Government Position',
  oppositionStance: 'Opposition Position',
  keyPoints: 'Key Points',
  fullTextEn: 'Original Text (English)',
  hansardSource: 'Hansard Source',
  controversyLevel: 'Controversy',

  heroEyebrow: 'Singapore AI Observatory',
  heroHeadline: 'Singapore’s AI strategy isn’t algorithms.',
  heroHeadline2: 'It’s 6 levers.',
  heroSubtitle:
    'The state wraps itself around enterprise AI-native transformation. The state itself doesn’t need to become AI-native — it just needs to amplify how fast enterprises do.',
  heroSubtitleNeutral:
    'How one city-state is reorganising itself for the AI era — independent analysis of policy, parliament, levers, startups, and law.',
  ctaReadCore: 'Read the core argument',
  ctaBrowseAll: 'Browse all opinions →',
  freshnessPolicies: 'Core policies',
  freshnessDebates: 'Parliamentary debates',
  freshnessLevers: 'Lever items',
  freshnessUpdated: 'Last updated',
  latestAnalyses: 'Latest Opinions',
  viewAll: 'View all →',
  viewAllLeversCta: 'Full lever map →',
  viewAllDebatesCta: 'All {count} debates →',
  leversSection: 'National AI-Native Lever Map',
  leversBlurb:
    'Six levers, {count} concrete projects. Re-sliced by "how AI gets pushed in" — cutting across ministries into a single execution pipeline.',
  leverMapColPassThrough: 'Pass-through',
  leverMapColDirect: 'Direct',
  leverMapColPassThroughHint: 'The state amplifies enterprise AI adoption through these levers',
  leverMapColDirectHint: 'The state acts directly — not via enterprises',
  leverProjectsSuffix: 'projects',
  transmissionFootnote:
    'Of 7 transmission channels, only 2 are run directly by the state; the other 5 transmit through to enterprises.',
  transmissionFootnoteCta: 'Read the 7 transmission channels →',
  recentDebatesSection: 'Recent Parliamentary Debates',
  recentDebatesBlurb: 'Every parliamentary question, response, and debate on AI from {from} to {to}.',
  closingThesis:
    'AI-native isn’t scale — it’s architecture. A country cannot be AI-native "on its own"; it has to transmit through to enterprises.',
  closingCta: 'Read the "AI-native country" essay',
  leverWord: 'Lever',
  homeTrackerSection: 'Singapore AI Dashboard',
  homeTrackerBlurb: 'Six dimensions, current reading, refreshed monthly.',
  homeTrackerCta: 'Full dashboard →',

  policiesPageTitle: 'Singapore AI Policy Library — full archive & timeline',
  policiesPageBlurb:
    'Singapore AI policy archive: NAIS 2.0, Model AI Governance Framework, Copyright §244, AI Verify, ASEAN Guide and other core documents — full text and digests, grouped by strategy / governance / law / sector, newest first.',
  policiesItemsSuffix: 'items',
  policyArchiveSuffix: 'Policy Archive',
  backToPolicies: 'Back to Policy Library',
  debatesPageTitle: 'Parliamentary AI Focus',
  blogIndexTitle: 'Opinion',
  blogPageNumber: 'Page {n}',
  blogTagTitle: "Posts by tag '{tag}'",
  aboutPageTitle: 'About',
  aboutPageDesc:
    "About Singapore AI Observatory — an independently-maintained research platform tracking Singapore's AI strategy. Methodology, conflict-of-interest disclosure, feedback channels.",
  evolutionPageTitle: 'Singapore AI Policy Evolution',
  evolutionPageDesc:
    "Singapore's AI policy evolution — the strategic transformation arc from the 2014 Smart Nation Initiative to the 2024 generative AI governance framework.",
  timelinePageTitle: 'Timeline',
  timelinePageDesc:
    "Singapore's AI development timeline: from the 2014 Smart Nation Initiative through NAIS 2.0 to the 2027 International AI Olympiad — key milestones in chronological order.",
  ecosystemPageTitle: 'Ecosystem Map',
  ecosystemPageDesc:
    "Singapore's AI ecosystem map — government agencies, research institutes, corporates, and startups in one view.",
  leversPageTitle: 'Singapore National AI Levers — 6 cross-ministry pipelines',
  leversPageDesc:
    "Singapore's national AI-native transformation re-classified by AI-injection path — infrastructure, governance, talent, applications, government self-use, and diplomacy. Six cross-ministry levers, with policy-source links from Budget 2026 and every ministry.",
  investorNotableDeals: 'Notable AI deals: ',
  startupsPageTitle: 'Singapore AI Startups',
  startupsPageSubtitle:
    'A directory of Singapore AI-native, AI-enabled, and adjacent capital ecosystem entities, with growing profiles for companies, projects, exits, and investors.',
  talentPageTitle: 'Talent Pipeline',
  talentPageDesc:
    "Singapore's AI talent pipeline — university programmes, government-led training schemes, and talent attraction policies in one view.",
  talentProgrammeProfile: 'Programme Profile',
  talentOfficialSourceHeading: 'Official Source',
  talentCheckedByThisSite: 'Checked by this site: ',
  talentMoreProgrammes: 'More Talent Programmes',
  talentSourcesNote:
    'Sources: official AI Singapore, LearnAI, AIAP, NAISC and IOAI pages. Checked by this site on {date}.',
  jobsIndexHeading: 'AI talent, demand side: monthly snapshot of open roles',
  regLookaheadHeading: 'Regulatory lookahead: live consultations & bills',
  regLookaheadIntro:
    'The pipeline before the law — open public consultations and relevant bills moving through Parliament, refreshed weekly. Once enacted, items graduate into the sections below.',
  regLookaheadOpenBadge: 'Consultation open',
  regLookaheadDeadline: 'Deadline',
  regLookaheadDaysLeft: '{n} days left',
  regLookaheadCoreBadge: 'Core AI',
  regLookaheadArchive: 'Archived',
  regLookaheadStage_introduced: 'Introduced',
  'regLookaheadStage_second-reading': '2nd reading',
  regLookaheadStage_passed: 'Passed',
  regLookaheadStage_assented: 'Assented',
  regLookaheadStage_withdrawn: 'Withdrawn',
  regLookaheadStatus_open: 'Open',
  regLookaheadStatus_closed: 'Closed',
  'regLookaheadStatus_response-published': 'Response published',
  jobsRoleEngineering: 'Engineering',
  jobsRoleResearch: 'Research',
  jobsRoleData: 'Data / ML',
  jobsRoleProduct: 'Product',
  jobsRoleGtm: 'Sales & marketing',
  jobsRoleOpsOther: 'Ops & other',
  jobsIndexIntro:
    'Above is the supply side (training and competition programmes). This is the demand side: a monthly aggregate snapshot of open AI job postings on MyCareersFuture, the official jobs portal — aggregates only, no listings republished. The series accumulates monthly under a frozen methodology into a long-run exclusive timeline.',
  jobsIndexTotalLabel: 'Open AI postings',
  jobsIndexMedianLabel: 'Median monthly salary (disclosed)',
  jobsIndexBandLabel: 'P25–P75 band',
  jobsIndexDisclosureLabel: 'Salary disclosure rate',
  jobsIndexTopEmployersLabel: 'Top 10 employers',
  jobsIndexRolesLabel: 'Role mix',
  jobsIndexMoMLabel: 'vs previous month',
  jobsIndexAccumulating:
    'Series accumulating — the first quarter-on-quarter view unlocks once two quarters of data exist.',
  jobsIndexMethodNote:
    'Methodology v{v}: frozen query basket, uuid-level dedup; salary stats use midpoints of disclosed monthly ranges only; snapshots are immutable. Snapshot month: {month}.',
  videosPageTitle: 'AI Video Library',
  videosPageDesc:
    'A curated collection of YouTube talks and interviews from Singapore government officials, academics, and industry leaders on AI strategy, governance, talent, and applications.',
  voicesPageTitle: 'Singapore AI Influence Map — Ministers, MPs, Academics, official speeches',
  voicesPageDesc:
    "Singapore's AI policy decision-makers in one map: ministers, MPs, academics, and industry leaders — their parliamentary speeches, policies championed, video positions, and official channels; full MDDI AI speech archive.",
  opensourcePageTitle: 'Official Open Source & Research',
  opensourcePageDesc:
    'Open-source projects and research output from the Singapore government and official agencies — SEA-LION, AI Verify, and more.',
  opensourcePageSubtitle: 'Open-source projects and research backed by AI Singapore and the Singapore government.',
  opensourceIntroBefore:
    'ℹ️ This page covers AI Singapore and government-backed open-source projects and research. For broader academic and corporate contributions, see the',
  opensourceIntroAfter: 'page.',
  opensourceSeaLionSection: '🦁 SEA-LION Model Ecosystem',
  opensourceStatTotalModels: 'Total models',
  opensourceStatTotalDownloads: 'Total downloads',
  opensourceStatTotalLikes: 'Total likes',
  opensourceStatTopModelDownloads: 'Top model downloads',
  osTableVersion: 'Version',
  osTableModels: 'Models',
  osTableDownloads: 'Downloads',
  osTableLikes: 'Likes',
  osTablePeriod: 'Period',
  opensourceViewOnHuggingFace: '🤗 View all models on HuggingFace →',
  opensourceSeaGuardSection: '🛡️ SEA-Guard Safety Models',
  opensourceModelsCountSuffix: 'models',
  opensourceDownloadsCountSuffix: 'downloads',
  opensourceAiVerifySection: '✅ AI Verify Governance Framework',
  opensourceOpenSourcedOn: 'Open-sourced {date}',
  opensourcePartners: 'Partners',
  opensourceOfficialIndexSection: '📦 Official Project Index',
  opensourceOfficialIndexBlurb: 'Each card opens a project profile that can keep growing over time.',
  opensourcePapersSection: '📄 Research Papers',
  opensourceChineseTranslation: 'Chinese translation →',
  communityOsPageTitle: 'Community Open Source',
  communityOsPageDesc:
    "Singapore's community AI open-source ecosystem — universities, international corporate labs, and startups contributing to open source.",
  communityOsPageSubtitle:
    "AI open-source projects from Singapore's universities, international corporate labs, and startups.",
  communityOsUniversitiesSection: 'Universities & Research Institutions',
  communityOsUniversitiesBlurb:
    'Models, toolboxes, and training systems from university labs. Each card opens a project profile.',
  communityOsCorporateLabsSection: 'International Corporate Labs in Singapore',
  communityOsCorporateLabsBlurb:
    'Open models, training frameworks, and tools from multinational technology research networks connected to Singapore.',
  communityOsStartupsSection: 'Startups',
  communityOsStartupsBlurb:
    'Singapore AI startup examples using open source as product distribution and developer-community entry.',
  benchmarkingPageTitle: 'International Benchmarks',
  benchmarkingPageDesc:
    "International benchmarks for Singapore's AI strategy — comparison with the United States, the United Kingdom, China, the EU and other major economies.",
  legalAiPageTitle: 'AI Legal Framework',
  legalAiPageDesc:
    "Singapore's AI legal framework — 'permissive on training, strict on outputs' dual track: Copyright §244 (one of the world's most permissive AI training exceptions) paired with the OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill quartet on outputs.",
  legalCorePoint: 'Core Point',
  legalDetailedNote: 'Detailed Note',
  legalFrameworkPosition: 'Position in the Legal Framework',
  legalStatuteSource: 'Statute text / source',
  legalViewLevers: 'View National AI Levers',
  legalRelatedCards: 'Related Legal Cards',
  challengesPageTitle: 'Challenges',
  challengesPageDesc:
    "Core challenges in Singapore's AI development — talent competition, data limitations, compute constraints, and ethics-governance tradeoffs.",
  fieldnotesPageTitle: 'Field Notes',
  fieldnotesPageDesc:
    'Frontline observations and field experience from doing AI work in Singapore — clustered by topic to help you avoid common pitfalls.',
  referencesPageTitle: 'References',
  referencesPageDesc:
    "Singapore AI references — official documents, research reports, news coverage, and analytical reading on Singapore's AI policy.",
  policiesStatProfiles: 'Profiles',
  policiesStatCategories: 'Categories',
  policiesStatFormat: 'Format',
  policiesStatFormatValue: 'Archive',

  langBannerEn: 'English version available',
  langBannerSwitch: 'Read in English →',
  langBannerDismiss: 'Dismiss',
  langZh: '中文',
  langEn: 'English',
  langToggleLabel: 'Switch language',

  footnotes: 'References',
  tocLabel: 'Contents',
  tocSummary: '📑 Contents ({count} sections)',

  trackerPageTitle: 'Singapore AI Observatory Dashboard',
  trackerPageBlurb:
    'Six dimensions showing where Singapore AI actually stands — headline numbers, third-party rankings, target progress, trend, editorial interpretation, key shortcomings. We do not assign grades.',
  trackerSectionTopRankings: 'International Anchors',
  trackerSectionMethodologyNote: 'Method',
  trackerSectionMethodology: 'Full methodology',
  trackerCardTrendUp: '↗ Up',
  trackerCardTrendFlat: '→ Flat',
  trackerCardTrendDown: '↘ Down',
  trackerDetailJudgment: 'Editorial Interpretation',
  trackerDetailShortcoming: 'Key Shortcoming',
  trackerDetailRankings: 'Third-Party Ranking Anchors',
  trackerDetailProgress: 'Target Progress',
  trackerDetailMetrics: 'Full Data',
  trackerDetailRelated: 'Related',
  trackerDetailMetricsHeaderName: 'Metric',
  trackerDetailMetricsHeaderValue: 'Value',
  trackerDetailMetricsHeaderSource: 'Source / Date',
  trackerDetailMetricsHeaderCategory: 'Group',
  trackerDetailCardHeadline: 'Headline',
  trackerDetailCardBenchmark: 'Benchmark',
  trackerDetailCardBadge: 'Badge',
  trackerDetailCardTrend: 'Trend',
  trackerCategoryEnterprise: 'Enterprise Adoption',
  trackerCategoryGovernment: 'Government Adoption',
  trackerMethodologyTitle: 'Dashboard Methodology',
  trackerMethodologyDesc:
    "How the dashboard is built — what we present, what we don't, and why we don't assign overall grades.",
  capitalSectionTitle: 'Capital & Infrastructure',
  capitalSectionLead:
    'Capital events that used to live inside prose, now as dated, sourced records. Amounts are event totals, not per-party shares.',
  capitalEventLabel: 'Event',
  fpMissionsSection: 'Four National AI Missions',
  newsletterTitle: 'Monthly email',
  newsletterBlurb: "One email a month: the month's updates plus a short editorial take. No ads, no spam.",
  newsletterEmailLabel: 'Your email',
  newsletterSubmit: 'Subscribe',
  capitalKindColumnLabel: 'Kind',
  capitalDateLabel: 'Date / source',
  capitalKindHyperscaler: 'Hyperscaler commitments',
  capitalKindSovereign: 'Sovereign investment',
  capitalKindFund: 'Funding envelope',
  capitalAmountTypeRound: 'Round size',
  capitalAmountTypeCommitment: 'Cumulative commitment',
  capitalAmountTypeExposure: 'Portfolio exposure',
  capitalAmountTypeJointVenture: 'Joint venture',
  capitalAmountTypeCumulative: 'Cumulative funding',
  capitalAmountTypeEnvelope: 'Government envelope',
  capitalAmountTypeUndisclosed: 'Undisclosed',
  capitalPartiesLabel: 'Parties',
  capitalAmountLabel: 'Amount',
  capitalRatioLabel: 'Amplification ratio',
  capitalRatioCaveat:
    "Ratio definition: numerator is the five hyperscalers' cumulative Singapore commitments (US$26B+, data centres and regional HQs); denominator is the 2023–2026 government AI envelope (S$2B+). No FX conversion is applied, so the ratio is illustrative; '+' marks floor disclosures.",
  trackerHomeSummaryTitle: '🇸🇬 Singapore AI Dashboard',
  trackerHomeSummaryCta: '6 dimensions, current state → Full dashboard',
  trackerEditorialAttribution: 'sgai editorial interpretation',
  trackerBackToDashboard: 'Back to dashboard',
  trackerLastUpdated: 'Data updated',

  voiceSignatureWork: 'Signature Work',
  voiceNotableQuotes: 'Public Statements',
  voiceSpeakingRecord: 'Recent Talks',
  voiceExternalRoles: 'External Roles',
  voiceSinceLabel: 'Since',
  voiceSourceLabel: 'Source',
  voiceAuthorLabel: 'Author',

  tasksSection: 'Start Here',
  tasksBlurb: 'Different questions, different entry points. Tell us what you’re trying to do.',
  taskUnderstandTitle: 'Understand Singapore’s AI strategy',
  taskUnderstandBlurb: 'Six-lever map, policy evolution, international benchmarks — the whole story, joined up.',
  taskUnderstandCta: 'Read the core argument →',
  taskPolicyTitle: 'Find policies, laws, primary sources',
  taskPolicyBlurb: 'Policy library, AI legal framework, parliamentary debates, references — citable sources.',
  taskPolicyCta: 'Browse policy & debates →',
  taskBusinessTitle: 'See companies and startup opportunities',
  taskBusinessBlurb: 'Startup ecosystem, ecosystem map, talent pipeline, open source, international benchmarks.',
  taskBusinessCta: 'Browse ecosystem →',
  taskTrackTitle: 'Track what’s changing',
  taskTrackBlurb: 'Recent updates, tracker readings, latest parliamentary debates, fresh policies.',
  taskTrackCta: 'View updates feed →',

  updatesNav: 'Updates',
  updatesPageTitle: 'Recent Updates',
  updatesPageBlurb:
    'Every policy, debate, video, startup, longform, and data fix added each week — one stream, all here.',
  updatesHomeSection: 'Recent Updates',
  updatesHomeBlurb:
    'New policies, debates, videos, and longform added in the past two weeks. Every entry links straight to the source page.',
  updatesHomeCta: 'Full updates feed →',
  updatesEmpty: 'No recent updates.',
  updatesRssTitle: 'Singapore AI Observatory — Recent Updates',
  updatesRssDescription: 'New policies, debates, videos, startup profiles, longform, and data fixes.',
  updateTypePolicy: 'Policy',
  updateTypeDebate: 'Debate',
  updateTypeVideo: 'Video',
  updateTypeStartup: 'Startup',
  updateTypePeople: 'Person',
  updateTypeSpeech: 'Speech',
  updateTypeTracker: 'Tracker',
  updateTypeBenchmark: 'Benchmark',
  updateTypeEcosystem: 'Ecosystem',
  updateTypeLever: 'Lever',
  updateTypeLongform: 'Longform',
  updateTypeSite: 'Site',
  updateTypeFix: 'Fix',

  // Front page (news-portal homepage)
  fpMastheadTagline: 'Latest developments',
  fpMastheadUpdated: 'Updated',
  fpStatVideos: 'Videos',
  fpFocusEyebrow: 'Focus',
  fpBrowseSection: 'Ways to browse',
  fpBrowseByTime: 'Browse by timeline',
  fpBrowseByTopic: 'Browse by topic',
  fpHotSection: 'Popular sections',
  fpPicksSection: 'In focus',
  fpDirectorySection: 'Browse the whole site',
  fpDirectoryBlurb: '12 continuously updated datasets — each card shows its latest addition.',
  fpLatestPrefix: 'Latest',
  fpEntriesSuffix: 'entries',
  fpStartHereSection: 'Understand the framework',
  listingLatestSection: 'Latest additions',
  crossRailHeading: 'Keep exploring',

  // Nav additions (news-portal)
  navLatest: 'Latest',
  navChallenges: 'Challenges',
  navEvolution: 'Policy evolution',

  // Full-page search (/search/)
  searchPageDesc: 'Search everything on this site: policies, debates, videos, people, levers and articles.',

  // Topics hub (/topics/)
  topicsIndexDesc:
    '15 topics cut across everything on this site — each one gathers the related debates, policies, videos, people and articles on a single page.',
  topicEntriesCount: '{count} related items',
  topicViewAll: 'View all {count} →',
  relatedTopicsHeading: 'Related topics',
  sameTopicHeading: 'More on these topics',
  topicKindLegal: 'Legal',
  topicKindTimeline: 'Timeline',
  topicKindTalent: 'Talent',
  pnOlder: '← Older',
  pnNewer: 'Newer →',

  fullTextTranslated: 'Full Translation',
  coreViewpoint: 'In Brief',
  relatedVideos: 'Related Videos',
  speaker: 'Speaker',
  videoType: 'Type',
  videoSource: 'Source',
  videoSummary: 'Summary',
  videoFullTranscript: 'Full transcript',
  videoReadableTranscript: 'Readable transcript',
  videoCaptionLanguage: 'Caption language: ',
  videoFetched: 'Fetched: ',
  videoCaptionsUnavailable: 'No readable transcript yet — please play the video above.',
  parliamentSession: 'Parliament',
  speechSummaryPoints: 'Key Points',
  mddiSpeechLabel: 'MDDI Speech',
  mddiSourceLabel: 'MDDI Original',
  categoryGovernment: 'Government',
  categoryAcademic: 'Academic',
  categoryIndustry: 'Industry',
  officialChannels: 'Official Channels',
  oneLinerTitle: 'One-liner',
  profilePending:
    'This profile is pending. The page currently aggregates parliamentary speeches and policy links from available data.',
  debateCount: 'Parliament',
  policyCount: 'Policies',
  videoCount: 'Videos',
  noDebateRecords: 'No related debate records.',
  voiceParlRecord: 'Parliamentary AI record',
  voiceParlByYear: 'By year',
  voiceParlByTopic: 'By topic',
  officialWebsite: 'Website',
  ecosystemReadMore: 'Read more →',
  ecosystemVisitWebsite: 'Visit {name} website',
  ecosystemSubtitle:
    "The seven pillars of AI Singapore and their key participants — a full-system view of Singapore's AI landscape.",
  ecosystemSourceFootnote:
    'Sources: AI Singapore and other public information. The ecosystem evolves continuously — additions welcome.',

  // Benchmarking profile pages
  benchmarkCrumb: 'International Benchmarks',
  benchmarkDrilldownEyebrow: 'Benchmark Drilldown · Updated',
  benchmarkOwnerLabel: 'Owner',
  benchmarkWhyItMatters: 'Why It Matters',
  benchmarkSingaporeTakeaway: 'Singapore Takeaway',
  benchmarkSourcesHeading: 'Sources',
  benchmarkReferencesHeading: 'References',
  benchmarkOfficialSourceLabel: 'Official source',
  benchmarkRegionBackground: 'Region background',
  benchmarkAnotherCase: 'Another case',
  benchmarkContinueCases: 'Continue With Cases',
  benchmarkDataNoteHeading: 'Data Note',
  benchmarkBackTo: 'Back to International Benchmarks',
  benchmarkCoreStrategy: 'Core strategy',
  benchmarkInvestmentScale: 'Investment',
  benchmarkGovernanceModel: 'Governance',
  benchmarkComparativeStrength: 'Core strength',
  benchmarkOneLineRead: 'One-line Read',
  benchmarkCoreStrategiesHeading: 'Core Strategies',
  benchmarkInvestmentHeading: 'Investment and Resources',
  benchmarkGovernanceHeading: 'Governance Model',
  benchmarkStrengthsHeading: 'Strengths vs Singapore',
  benchmarkWeaknessesHeading: 'Weaknesses vs Singapore',
  benchmarkKeyHeading: 'Key Initiatives and Bodies',
  benchmarkKeyInitiatives: 'Key Initiatives',
  benchmarkKeyBodies: 'Key Bodies',
  benchmarkItemLabel: 'Item',
  benchmarkAmountLabel: 'Amount',
  benchmarkNoteLabel: 'Note',
  benchmarkPendingHeading: 'Detail profile pending',
  benchmarkRelatedHeading: 'Related Reading',
  benchmarkOverview: 'Benchmark Overview',
  benchmarkLeversCta: 'Singapore National AI Levers',
  benchmarkLegalCta: 'Singapore AI Legal Framework',
  benchmarkContinueHeading: 'Continue Comparing',
  benchmarkExpandHeading: 'Detail',
  benchmarkContinueRegion: 'Continue exploring this region',
  benchmarkIntroSubtitle:
    'From national strategy down to concrete companies, projects, institutions, and infrastructure.',
  benchmarkIntroCallout:
    'Useful benchmarking is not "Country X is strong at AI". It asks which concrete object became a national capability: a fund, a university, a model, a testing framework, a government assistant, or a supply-chain node.',
  benchmarkStatCaseProfiles: 'Case profiles',
  benchmarkStatRegionProfiles: 'Region profiles',
  benchmarkStatProfilesUpdated: 'Profiles updated',
  benchmarkLibraryHeading: 'Benchmark Case Library',
  benchmarkLibrarySubtitle: 'Each card maps to a profile that can grow over time.',
  benchmarkViewRegionOverview: 'View region overview',
  benchmarkKeyInsightsHeading: 'Key Insights',
  benchmarkOverviewComparisonHeading: 'Overview Comparison',
  benchmarkColRegion: 'Region',
  benchmarkColCoreStrategy: 'Core strategy',
  benchmarkColYear: 'Year',
  benchmarkColInvestment: 'Investment',
  benchmarkColGovernance: 'Governance',
  benchmarkColStrength: 'Strength',
  benchmarkColAiRanking: 'AI ranking',
  benchmarkRegionPagesHeading: 'Region Background Pages',
  benchmarkViewRegionProfile: 'View region profile',
  benchmarkBaseDataUpdated: 'Base data updated',
  benchmarkCaseProfilesCurated: 'case profiles curated',
  benchmarkReportArchiveHeading: 'Stanford AI Index Report Archive',
  benchmarkReportArchiveIntro:
    "Much of this page's cross-country data draws on Stanford HAI's annual AI Index reports. Each edition is archived here with its key findings and a link to the original.",
  benchmarkReportArchiveRead: 'Read the report',

  // Open source / community open source project detail pages
  osBack: 'Back to Official Open Source',
  osCommunityBack: 'Back to Community Open Source',
  osProfile: 'Project Profile',
  osCommunityProfile: 'Community Project Profile',
  osOwner: 'Owner',
  osOrg: 'Organisation',
  osOrgType: 'Group',
  osCategory: 'Category',
  osStatus: 'Status',
  osFounded: 'Started',
  osLanguage: 'Language / Form',
  osLicense: 'License',
  osUpdated: 'Updated',
  osWhatItIs: 'What It Is',
  osAiRelevance: 'AI Relevance',
  osSingaporeRelevance: 'Singapore Relevance',
  osMilestones: 'Milestones',
  osResources: 'Resources',
  osCommunityRelated: 'More Community Projects',
  osOrgTypeUniversity: 'University / research',
  osOrgTypeCorporateLab: 'International corporate lab',
  osOrgTypeStartup: 'Startup',

  // RelatedRail cross-link component
  railRel: 'Related: ',
  railNoneYet: 'No related references yet.',
  railPeople: 'People',
  railPolicies: 'Policies',
  railDebates: 'Parliamentary debates',
  railLevers: 'Levers',
  railTimeline: 'Timeline',
  railAnalyses: 'Opinions',
  railMoreDebates: '… and {n} more',
  railMoreDebatesInline: '+{n} more debates',

  // Startup entity detail page
  startupKindCompany: 'Company / Project',
  startupKindExit: 'Exit / Acquisition',
  startupKindInvestor: 'Investor',
  startupPositioning: 'Positioning',
  startupCapitalSignals: 'Capital And Market Signals',
  startupAiRelationHeading: 'AI Relation',
  startupWhyItMatters: 'Why It Matters',
  startupSignalsToTrack: 'Signals To Track',
  startupSignalsPending: 'Public capital signals are still being filled in.',
  startupNote: 'Note',
  startupRelatedEntities: 'Related Entities',
  startupDataNote: 'Data Note',
  startupTypeLabel: 'Type',
  startupVerticalLabel: 'Vertical / Group',
  startupAiRelationLabel: 'AI Relation',
  startupPublicFunding: 'Public Funding',
  startupValuation: 'Valuation',
  startupStatusLabel: 'Status',
  startupInvestorsLabel: 'Investors',
  startupAcquirerLabel: 'Acquirer',
  startupAmountYear: 'Amount / Year',
  startupTrackRecord: 'Track Record',
  startupFocusLabel: 'Focus',
  startupUnicornBadge: 'Unicorn',
  startupBackTo: 'Back to AI Startup Ecosystem',
  startupNav: 'AI Startups',

  // Startups listing page (/startups/)
  startupStatAiCompanies: 'AI companies (Tracxn)',
  startupStatGlobalRank: '#{rank}',
  startupStatHubRank: 'Global AI hub rank',
  startupStatSeaFundingShare: 'SEA AI funding share',
  startupStatTotalVcRaised: 'Total VC raised',
  startupStatUnicorns: 'Unicorns',
  startupStatGovCommitment: 'Government AI commitment',
  startupUnicornsSectionTitle: 'Unicorns And Listed-Scale Companies',
  startupByVerticalTitle: 'By Vertical',
  startupExitsSectionTitle: 'Notable Exits And Acquisitions',
  startupInvestorEcosystemTitle: 'Investor Ecosystem',
  startupRaisedLabel: 'Raised',
  startupTrackRecordColon: 'Track record: ',
  startupFocusColon: 'Focus: ',

  // Generic count suffixes / small chrome shared across listing pages
  openProfileCta: 'Open profile',
  entitiesCountSuffix: 'entities',
  institutionsCountSuffix: 'institutions',
  companiesCountSuffix: 'companies',
  recordsCountSuffix: 'records',
  yearPending: 'Year pending',

  // Generic filter-bar chrome (voices/videos listing pages)
  filterTopicLabel: 'Topic',
  filterYearLabel: 'Year',
  filterSpeakerLabel: 'Speaker',
  filterSpeakerTypeLabel: 'Speaker type',
  filterAllLabel: 'All',
  filterClearLabel: 'Clear filters',
  filterClearAllLabel: 'Clear all filters',
  filterShowingLabel: 'Showing',
  filterResultsSuffix: 'results',
  noVideosMatchFilter: 'No videos match the current filters.',
  noSpeechesMatchFilter: 'No speeches match the current filters.',

  // Voices listing page (/voices/)
  voicesIntroBlurb:
    "Singapore's key AI people and institutions, and the official channels through which they communicate.",
  voicesIntroSubBlurb: 'Track them to get first-hand AI policy and strategy intelligence.',
  voicesStatPeople: 'Key people',
  voicesStatInstitutions: 'Core institutions',
  voicesStatSpeeches: 'Official speeches',
  voicesStatVideos: 'YouTube videos',
  voicesKeyPeopleSection: 'Key People',
  voicesCoreInstitutionsSection: 'Core Institutions',
  voicesMddiSpeechesSection: 'Official AI Speeches',
  voicesYoutubeVideosSection: 'YouTube AI Videos',
  mddiSourceTitle: 'Source on mddi.gov.sg',

  // Videos listing page (/videos/)
  videosIntroBlurb:
    'YouTube talks and interviews from Singapore government officials, academics, and industry leaders on artificial intelligence.',
  videosIntroSubBlurb: 'Click any video card for the readable transcript, summary, and related videos.',
  videosStatTotal: 'Total videos',
  videosStatSpeakers: 'Speakers',
  videosStatYears: 'Years covered',

  // Voice profile detail page (/voices/[id]/)
  voicePositioningHeading: 'Positioning',
  voicePoliciesChampionedHeading: 'Policies championed ({count})',
  voiceAiVideosHeading: 'AI videos ({count})',

  // Debate/speech detail page chrome
  sprsHansardOriginal: 'SPRS Hansard Record',
  fetchedAtColon: 'Fetched: ',

  viewSource: 'View source',
  countSuffix: '',
  copyrightOpenSource: 'Source MIT-licensed; content CC BY 4.0',
};

/** Japanese dictionary. Seeded by `npx tsx scripts/i18n/build-ja-dict.ts`,
 *  which runs the zh values through Claude haiku via translateBatch with
 *  a glossary baked into the system prompt (see scripts/i18n/build-ja-dict.ts).
 *  Re-running the script is idempotent (sha256 cache), so add new keys to
 *  zh first, re-run the script, and splice the new entries here. Hand
 *  edits in this dict take precedence over re-runs because the script
 *  emits a fresh literal block but does NOT auto-merge. */
export const ja: Partial<Record<keyof typeof zh, string>> = {
  siteName: 'シンガポール AI 観測',
  siteShortName: 'SG AI',
  siteTagline: 'シンガポール AI エコシステムと戦略の詳細なコラム',
  siteDescription:
    'シンガポール AI 観測は、独立した多言語の研究型観測ステーションであり、公開資料と一次情報源に基づき、シンガポール AI 戦略、政策実行、議会討論、産業エコシステム、人材育成、オープンソースプロジェクト、および国際ベンチマークを継続的に追跡しています。',
  navAnalysis: 'コラム',
  navPolicy: '政策と戦略',
  navDebates: '議論と声',
  navData: 'データ追跡',
  navAbout: 'について',
  navPolicies: '政策文書',
  navLevers: '国家 AI レバーマップ',
  navLegalAi: 'AI 法的枠組み',
  navTimeline: '発展タイムライン',
  navEcosystem: 'エコシステムマップ',
  navParliament: '議会 AI フォーカス',
  navVoices: 'AI インフルエンスマップ',
  navVideos: 'AI ビデオ観点',
  navTracker: 'AI ダッシュボード',
  navStartups: 'AI スタートアップエコシステム',
  navTalent: '人材育成',
  navOpensource: '公式オープンソースと研究',
  navCommunityOpensource: '産学連携オープンソースエコシステム',
  navBenchmarking: '国際ベンチマーク',
  navAboutSite: 'このサイトについて',
  navFieldnotes: 'フィールドノート',
  navReferences: '参考資料',
  navAllArticles: '全記事',
  navHome: 'ホーム',
  navBackToBlog: 'コラム一覧へ',
  postPrevOlder: '← 前の投稿（より古い）',
  postNextNewer: '次の投稿（より新しい） →',
  footerMaintainedBy: '{handle} 個人による運営',
  search: '検索',
  searchPlaceholder: '政策、議論、レバー、人物、ブログ投稿などを検索',
  closeSearch: '検索を閉じる',
  searchSiteLabel: 'サイト内検索',
  searchFallbackMessage: '検索は現在ご利用いただけません。ページを再読み込みしてもう一度お試しください。',
  navAsk: 'AIに質問',
  askPageDesc:
    'シンガポールの AI 戦略・政策・エコシステムについて質問すると、AI が本サイトのデータに基づいて回答し、出典リンクを示します。',
  askDisclaimer: '回答は AI が生成したもので、誤りを含む可能性があります。サイト内の原文と公式出典をご確認ください。',
  askPlaceholder: 'シンガポール AI について何でも質問してください…',
  askSend: '送信',
  askNewChat: '新しい会話',
  askPresetHeading: 'こんな質問はいかがですか',
  askThinking: '考え中…',
  askQuotaLeft: '本日の残り質問回数：{n} 回',
  askQuotaExceeded: '本日の質問回数を使い切りました。明日またお試しください。サイト内のコンテンツもご覧いただけます。',
  askErrorGeneric: 'エラーが発生しました。もう一度お試しください。',
  askErrorUnavailable: 'AI 質問機能はまだ利用できません。',
  askRetry: '再試行',
  askEntryTitle: 'AIに聞く',
  loadMore: 'もっと読む',
  readMore: '全文を読む',
  backTo: '戻る',
  back: '戻る',
  related: '関連',
  relatedReading: '関連記事',
  source: '出典',
  officialSourceText: '公式原文',
  sourcePdf: '原文 PDF',
  translation: '中国語訳',
  englishTranslation: '英訳',
  participants: '参加者',
  authors: '主な筆者/推進者',
  policySignal: '政策シグナル',
  governmentStance: '政府の立場',
  oppositionStance: '質問の立場',
  keyPoints: '重要なポイント',
  fullTextEn: '英語原文',
  hansardSource: 'Hansard 原文',
  controversyLevel: '争点度',
  heroEyebrow: 'シンガポール AI 観測',
  heroHeadline: 'シンガポールの AI 戦略はアルゴリズムにあるのではありません。',
  heroHeadline2: '6 つのレバーにあります。',
  heroSubtitle:
    '国全体を企業の AI-native トランスフォーメーションの「ラッパー層」として扱う――国自体が AI-native である必要はなく、企業のトランスフォーメーション速度を拡大するだけで十分です。',
  heroSubtitleNeutral:
    'AI 時代における 1 つのシティステートの国家レベルのトランスフォーメーション――政策文書、議会討論、レバーマップ、スタートアップエコシステム、法的枠組みの独立分析。',
  ctaReadCore: 'コア論証を読む',
  ctaBrowseAll: 'すべてのコラムを閲覧する →',
  freshnessPolicies: 'コア政策',
  freshnessDebates: '議会討論',
  freshnessLevers: 'レバープロジェクト',
  freshnessUpdated: '最近の更新',
  latestAnalyses: '最新のコラム',
  viewAll: 'すべてを表示 →',
  viewAllLeversCta: '完全なマップ →',
  viewAllDebatesCta: 'すべて {count} 件 →',
  leversSection: '国家レベル AI-native レバーマップ',
  leversBlurb:
    '6 つのレバーが {count} 件の具体的な実行プロジェクトをカバーしています。「AI 導入パス」に従って再スライスし、複数の省庁にまたがる完全な実行パイプラインとしてつなぎます。',
  leverMapColPassThrough: '企業への浸透',
  leverMapColDirect: '国家が直接実行',
  leverMapColPassThroughHint: '国家はこれらのレバーを通じて企業の AI トランスフォーメーションを拡大します',
  leverMapColDirectHint: '国家が自ら直接実行し、企業には依存しません',
  leverProjectsSuffix: 'プロジェクト',
  transmissionFootnote:
    '7 つの伝導レバーの中で、2 つだけが国家により直接実行されます。その他の 5 つはすべて国家が企業に浸透させるレバーです。',
  transmissionFootnoteCta: '7 つの伝導レバーを理解する →',
  recentDebatesSection: '最近の議会討論',
  recentDebatesBlurb: '{from} から {to} まで、議会が AI について行った毎回の質問、回答、および討論。',
  closingThesis:
    'AI-native はスケールではなく、アーキテクチャです。国家が自ら「AI-native」になることは不可能です――企業に浸透しなければなりません。',
  closingCta: '「AI-native 国家」の全文を読む',
  leverWord: 'レバー',
  homeTrackerSection: 'シンガポール AI ダッシュボード',
  homeTrackerBlurb: '6 つの観点の現在の数値、月ごとに更新されます。',
  homeTrackerCta: '完全なダッシュボード →',
  policiesPageTitle: 'シンガポール AI 政策ライブラリ — 全文アーカイブとタイムライン',
  policiesPageBlurb:
    'シンガポール AI 政策アーカイブ：NAIS 2.0、Model AI Governance Framework、Copyright §244、AI Verify、ASEAN Guide 等の中核文書の全文と要約。戦略・ガバナンス・法律・省庁別に分類、時系列逆順。',
  policiesItemsSuffix: '件',
  policyArchiveSuffix: '政策アーカイブ',
  backToPolicies: '政策ライブラリに戻る',
  debatesPageTitle: '議会 AI フォーカス',
  blogIndexTitle: 'コラム',
  blogPageNumber: '{n} ページ目',
  blogTagTitle: 'タグ「{tag}」の投稿',
  aboutPageTitle: 'このサイトについて',
  aboutPageDesc:
    'シンガポール AI 観測について——独立運営のシンガポール AI 戦略観測プラットフォーム。研究方法、利益声明、フィードバック方法。',
  evolutionPageTitle: '政策変遷分析',
  evolutionPageDesc:
    'シンガポール AI 政策変遷の全体像——2014年スマートネイションから2024年 NAIS 2.0 への戦略転換の軌跡。',
  timelinePageTitle: '発展タイムライン',
  timelinePageDesc:
    'シンガポール AI 発展タイムライン：2014年スマートネイションから2027年国際 AI オリンピックまで、主要マイルストーンを時系列で整理。',
  ecosystemPageTitle: 'エコシステムマップ',
  ecosystemPageDesc: 'シンガポール AI エコシステムマップ——政府機関、研究機関、企業、スタートアップの全体像。',
  leversPageTitle: 'シンガポール国家 AI レバー — 6 つの省庁横断パイプライン',
  leversPageDesc:
    'シンガポールの国家レベル AI ネイティブ転換を「AI 導入経路」で再分類——インフラ・ガバナンス・人材・応用・政府自身の活用・外交の6つのレバー。Budget 2026 と各省庁政策の原典リンク付き。',
  investorNotableDeals: '主な AI 取引：',
  startupsPageTitle: 'シンガポール AI スタートアップ',
  startupsPageSubtitle:
    'シンガポールの AI ネイティブ、AI 活用、および隣接資本エコシステムのエンティティディレクトリ——企業、プロジェクト、投資家それぞれが拡張可能なプロフィールを持ちます。',
  talentPageTitle: '人材育成',
  talentPageDesc: 'シンガポール AI 人材育成体系——大学プログラム、政府研修計画、人材招致政策の一覧。',
  talentProgrammeProfile: 'プログラムプロファイル',
  talentOfficialSourceHeading: '公式ソース',
  talentCheckedByThisSite: '本サイトによる確認：',
  talentMoreProgrammes: '他の人材プログラム',
  talentSourcesNote:
    'データ出典：AI Singapore、LearnAI、AIAP、NAISC、IOAI 各公式ページ。本サイトによる確認日：{date}。',
  jobsIndexHeading: 'AI 人材の需要側：求人月次スナップショット',
  regLookaheadHeading: '規制ルックアヘッド：進行中の協議と法案',
  regLookaheadIntro:
    '成立前のパイプライン——開放中のパブリックコンサルテーションと国会審議中の関連法案を毎週自動更新。成立後は下の正式セクションへ移されます。',
  regLookaheadOpenBadge: '協議受付中',
  regLookaheadDeadline: '締切',
  regLookaheadDaysLeft: '残り {n} 日',
  regLookaheadCoreBadge: 'コア AI 関連',
  regLookaheadArchive: 'アーカイブ',
  regLookaheadStage_introduced: '一読提出',
  'regLookaheadStage_second-reading': '二読',
  regLookaheadStage_passed: '可決',
  regLookaheadStage_assented: '大統領承認',
  regLookaheadStage_withdrawn: '撤回',
  regLookaheadStatus_open: '受付中',
  regLookaheadStatus_closed: '締切済み',
  'regLookaheadStatus_response-published': '回答公表済み',
  jobsRoleEngineering: 'エンジニアリング',
  jobsRoleResearch: '研究',
  jobsRoleData: 'データ / ML',
  jobsRoleProduct: 'プロダクト',
  jobsRoleGtm: '営業・マーケ',
  jobsRoleOpsOther: '運営・その他',
  jobsIndexIntro:
    '上は供給側（研修・コンテスト事業）。こちらは需要側：公式求人ポータル MyCareersFuture 上の AI 求人の月次集計スナップショットです——集計のみで求人の転載はしません。凍結された方法論のもと毎月蓄積され、長期的に独自のタイムラインを形成します。',
  jobsIndexTotalLabel: '掲載中の AI 求人',
  jobsIndexMedianLabel: '月給中央値（開示サンプル）',
  jobsIndexBandLabel: 'P25–P75 レンジ',
  jobsIndexDisclosureLabel: '給与開示率',
  jobsIndexTopEmployersLabel: '雇用主トップ 10',
  jobsIndexRolesLabel: '職種構成',
  jobsIndexMoMLabel: '前月比',
  jobsIndexAccumulating: '時系列を蓄積中——四半期比較は 2 四半期分のデータが揃い次第公開します。',
  jobsIndexMethodNote:
    '方法論 v{v}：固定クエリバスケット、求人 uuid で重複排除；給与統計は開示された月給レンジの中点のみ；スナップショットは不変です。対象月：{month}。',
  videosPageTitle: 'AI ビデオ・オピニオン',
  videosPageDesc:
    'シンガポール政府高官、学者、業界リーダーによる AI 戦略・ガバナンス・人材・産業に関する YouTube スピーチとインタビュー集。',
  voicesPageTitle: 'シンガポール AI インフルエンスマップ — 大臣・議員・学者・公式スピーチ',
  voicesPageDesc:
    'シンガポール AI 政策の意思決定者を一望：大臣、議員、学者、産業リーダー——議会発言、主導政策、動画ポジション、公式チャネル。MDDI AI 関連スピーチ全文検索付き。',
  opensourcePageTitle: '公式オープンソースと研究',
  opensourcePageDesc:
    'シンガポール政府と公式機関の AI オープンソースプロジェクトおよび研究成果——SEA-LION、AI Verify 等。',
  opensourcePageSubtitle: 'AI Singapore とシンガポール政府が支援するオープンソースプロジェクトと研究成果',
  opensourceIntroBefore:
    'ℹ️ 本ページは AI Singapore およびシンガポール政府が支援するオープンソースプロジェクトと研究成果を収録しています。シンガポールの産学界によるその他のオープンソースプロジェクトは',
  opensourceIntroAfter: 'ページをご覧ください。',
  opensourceSeaLionSection: '🦁 SEA-LION モデルエコシステム',
  opensourceStatTotalModels: 'モデル総数',
  opensourceStatTotalDownloads: '総ダウンロード数',
  opensourceStatTotalLikes: '総いいね数',
  opensourceStatTopModelDownloads: '人気モデルのダウンロード数',
  osTableVersion: 'バージョン',
  osTableModels: 'モデル数',
  osTableDownloads: 'ダウンロード数',
  osTableLikes: 'いいね',
  osTablePeriod: '期間',
  opensourceViewOnHuggingFace: '🤗 HuggingFace ですべてのモデルを見る →',
  opensourceSeaGuardSection: '🛡️ SEA-Guard セーフティモデル',
  opensourceModelsCountSuffix: 'モデル',
  opensourceDownloadsCountSuffix: 'ダウンロード',
  opensourceAiVerifySection: '✅ AI Verify ガバナンスフレームワーク',
  opensourceOpenSourcedOn: '{date} にオープンソース化',
  opensourcePartners: 'パートナー',
  opensourceOfficialIndexSection: '📦 公式プロジェクトインデックス',
  opensourceOfficialIndexBlurb: '各カードは継続的に拡充されるプロジェクトプロフィールにつながっています。',
  opensourcePapersSection: '📄 研究論文',
  opensourceChineseTranslation: '中国語訳 →',
  communityOsPageTitle: '産学研オープンソースエコシステム',
  communityOsPageDesc:
    'シンガポール産学研 AI オープンソースエコシステム——大学、企業ラボ、スタートアップのオープンソース貢献の全体像。',
  communityOsPageSubtitle: 'シンガポールの大学、国際企業ラボ、スタートアップによる AI オープンソースプロジェクト',
  communityOsUniversitiesSection: '大学・研究機関',
  communityOsUniversitiesBlurb:
    '大学研究室が生み出したモデル、ツールキット、トレーニングシステム。各カードは独立したプロジェクトプロフィールにつながっています。',
  communityOsCorporateLabsSection: 'シンガポールの国際企業ラボ',
  communityOsCorporateLabsBlurb:
    'シンガポールに関連する研究ネットワークにおける多国籍テクノロジー企業のオープンソースモデル、トレーニングフレームワーク、ツール。',
  communityOsStartupsSection: 'スタートアップ',
  communityOsStartupsBlurb:
    'オープンソースを製品配布と開発者コミュニティへの入口として活用するシンガポールの AI スタートアップ事例。',
  benchmarkingPageTitle: '国際ベンチマーク',
  benchmarkingPageDesc: 'シンガポール AI 戦略の国際ベンチマーク——米国、英国、中国、EU 等の主要経済圏との比較分析。',
  legalAiPageTitle: 'シンガポール AI 法的フレームワーク',
  legalAiPageDesc:
    'シンガポール AI 法的フレームワーク——「学習には寛容、出力には厳格」のデュアルトラック：著作権法§244（世界で最も寛容な AI 学習例外の一つ）と OCHA + 選挙法改正 + 刑法改正 + オンライン安全法の四法による出力規制。',
  legalCorePoint: 'コアな結論',
  legalDetailedNote: '詳細説明',
  legalFrameworkPosition: '法的枠組みにおける位置づけ',
  legalStatuteSource: '法令原文 / 出典',
  legalViewLevers: 'シンガポール国家 AI レバーを見る',
  legalRelatedCards: '同グループの法律カード',
  challengesPageTitle: '課題と制約分析',
  challengesPageDesc: 'シンガポール AI 発展が直面する主要課題——人材競争、データ制約、計算資源の制約、倫理ガバナンス。',
  fieldnotesPageTitle: '実践ノート',
  fieldnotesPageDesc:
    'シンガポールで AI 業務に従事する現場からの観察と実践経験の共有。テーマ別に整理し、遠回りを減らすお手伝いをします。',
  referencesPageTitle: '参考資料ライブラリ',
  referencesPageDesc: 'シンガポール AI 参考リソース——公式レポート、研究論文、データセット、ツール、推薦記事。',
  policiesStatProfiles: 'アーカイブ総数',
  policiesStatCategories: 'カテゴリ',
  policiesStatFormat: '形式',
  policiesStatFormatValue: 'アーカイブページ',
  langBannerEn: '英語版が利用可能です',
  langBannerSwitch: '英語で読む →',
  langBannerDismiss: '閉じる',
  langZh: '中文',
  langEn: 'English',
  langToggleLabel: '言語を切り替える',
  footnotes: '参考文献',
  tocLabel: '目次',
  tocSummary: '📑 目次（{count} セクション）',
  trackerPageTitle: 'シンガポール AI 観測ダッシュボード',
  trackerPageBlurb:
    '6 つの観点でシンガポール AI の実際の状態を呈現します――コア数値、サードパーティランキング、目標進捗、トレンド、編集解釈、重要な弱点。私たちはスコアを付けていません。',
  trackerSectionTopRankings: '国際参照',
  trackerSectionMethodologyNote: 'メソッド説明',
  trackerSectionMethodology: '詳細な方法論',
  trackerCardTrendUp: '↗ 上昇',
  trackerCardTrendFlat: '→ 横ばい',
  trackerCardTrendDown: '↘ 低下',
  trackerDetailJudgment: '編集解釈',
  trackerDetailShortcoming: '重要な弱点',
  trackerDetailRankings: 'サードパーティランキングアンカー',
  trackerDetailProgress: '目標進捗',
  trackerDetailMetrics: '完全なデータ',
  trackerDetailRelated: '関連記事',
  trackerDetailMetricsHeaderName: '指標',
  trackerDetailMetricsHeaderValue: 'データ',
  trackerDetailMetricsHeaderSource: '出典 / 時間',
  trackerDetailMetricsHeaderCategory: 'グループ',
  trackerDetailCardHeadline: 'コア数値',
  trackerDetailCardBenchmark: 'リファレンスフレーム',
  trackerDetailCardBadge: 'ポジショニング',
  trackerDetailCardTrend: 'トレンド',
  trackerCategoryEnterprise: '企業採用',
  trackerCategoryGovernment: '政府自己使用',
  trackerMethodologyTitle: 'ダッシュボード方法論',
  trackerMethodologyDesc: 'ダッシュボードの作り方——何を提示し、何を提示しないか、そしてなぜ総合評点をつけないのか。',
  capitalSectionTitle: '資本とインフラ',
  capitalSectionLead:
    '散文に散らばっていた資本イベントを、日付・金額・出典付きの記録にしました。金額はイベント総額で、個別参加者への按分はしていません。',
  capitalEventLabel: 'イベント',
  fpMissionsSection: '4 つの国家 AI ミッション',
  newsletterTitle: '月刊メール',
  newsletterBlurb: '月に一通：当月の更新ダイジェストと短い編集判断。広告なし、スパムなし。',
  newsletterEmailLabel: 'メールアドレス',
  newsletterSubmit: '購読',
  capitalKindColumnLabel: '種別',
  capitalDateLabel: '日付 / 出典',
  capitalKindHyperscaler: 'ハイパースケーラーのコミットメント',
  capitalKindSovereign: 'ソブリン投資',
  capitalKindFund: '資金枠',
  capitalAmountTypeRound: 'ラウンド規模',
  capitalAmountTypeCommitment: '累計コミットメント',
  capitalAmountTypeExposure: 'ポートフォリオ比率',
  capitalAmountTypeJointVenture: '合弁規模',
  capitalAmountTypeCumulative: '累計拠出',
  capitalAmountTypeEnvelope: '政府専門枠',
  capitalAmountTypeUndisclosed: '非公開',
  capitalPartiesLabel: '参加主体',
  capitalAmountLabel: '金額',
  capitalRatioLabel: '増幅倍率',
  capitalRatioCaveat:
    '比率の定義：分子は 5 社のハイパースケーラーによるシンガポール累計コミットメント（US$260 億+、データセンターと地域 HQ）、分母は 2023–2026 年の政府 AI 専門枠（S$20 億+）。為替換算は行っておらず、比率は参考値です。「+」は下限開示を示します。',
  trackerHomeSummaryTitle: '🇸🇬 シンガポール AI ダッシュボード',
  trackerHomeSummaryCta: '6 つの観点で現状を見る → 完全なダッシュボード',
  trackerEditorialAttribution: 'sgai 編集解釈',
  trackerBackToDashboard: 'ダッシュボードに戻る',
  trackerLastUpdated: 'データ更新',
  voiceSignatureWork: 'リード作業',
  voiceNotableQuotes: 'パブリック声明',
  voiceSpeakingRecord: '最近のスピーチ',
  voiceExternalRoles: '機関横断的な役職',
  voiceSinceLabel: 'から',
  voiceSourceLabel: '出典',
  voiceAuthorLabel: '筆者',
  tasksSection: 'ここから始める',
  tasksBlurb: '異なる質問には、異なるエントリーポイントがあります。最初に、あなたが何をしたいのか教えてください。',
  taskUnderstandTitle: 'シンガポール AI 戦略を理解したい',
  taskUnderstandBlurb: '6 つのレバーマップ、政策進化、国際ベンチマーク――全体のストーリーをつなぎます。',
  taskUnderstandCta: 'コア論証から読む →',
  taskPolicyTitle: '政策、法規、公式出典を見つけたい',
  taskPolicyBlurb: '政策ライブラリ、AI 法律フレームワーク、議会討論、参考資料――引用可能なファーストハンドソース。',
  taskPolicyCta: '政策と討論を確認する →',
  taskBusinessTitle: '企業とスタートアップの機会を見たい',
  taskBusinessBlurb:
    'スタートアップエコシステム、エコシステムマップ、人材育成、オープンソースプロジェクト、国際ベンチマーク。',
  taskBusinessCta: 'エコシステムと企業を見る →',
  taskTrackTitle: '最新の変化を追跡したい',
  taskTrackBlurb: '最近の更新、tracker データ、最新の議会討論、新しくリリースされた政策。',
  taskTrackCta: '更新フローを見る →',
  updatesNav: '最近の更新',
  updatesPageTitle: '最近の更新',
  updatesPageBlurb:
    '本サイトが毎週新規追加する政策、討論、ビデオ、スタートアップ、ロング記事とデータ修正――1 つのフロー、すべてがここに。',
  updatesHomeSection: '最近の更新',
  updatesHomeBlurb:
    '今週と前週にサイトに追加された政策、討論、ビデオ、ロング記事。各項目が元のページに直接リンクしています。',
  updatesHomeCta: '完全な更新フロー →',
  updatesEmpty: '最近は更新がありません。',
  updatesRssTitle: 'シンガポール AI 観測 — 最近の更新',
  updatesRssDescription: '新規政策、討論、ビデオ、スタートアッププロファイル、ロング記事およびデータ修正。',
  updateTypePolicy: '政策',
  updateTypeDebate: '討論',
  updateTypeVideo: 'ビデオ',
  updateTypeStartup: 'スタートアップ',
  updateTypePeople: '人物',
  updateTypeSpeech: 'スピーチ',
  updateTypeTracker: 'ダッシュボード',
  updateTypeBenchmark: 'ベンチマーク',
  updateTypeEcosystem: 'エコシステム',
  updateTypeLever: 'レバー',
  updateTypeLongform: 'ロング記事',
  updateTypeSite: 'サイト',
  updateTypeFix: '修正',

  // Front page (news-portal homepage)
  fpMastheadTagline: '最新の動き',
  fpMastheadUpdated: '更新日',
  fpStatVideos: '動画',
  fpFocusEyebrow: '注目',
  fpBrowseSection: '閲覧方法',
  fpBrowseByTime: '時系列で見る',
  fpBrowseByTopic: 'テーマで見る',
  fpHotSection: '人気セクション',
  fpPicksSection: '注目トピック',
  fpDirectorySection: 'サイト全体を見る',
  fpDirectoryBlurb: '継続的に更新される 12 のデータ領域。各カードに最新の収録を表示します。',
  fpLatestPrefix: '最新',
  fpEntriesSuffix: '件',
  fpStartHereSection: 'フレームワークを理解する',
  listingLatestSection: '新着収録',
  crossRailHeading: 'さらに探索',

  // Nav additions (news-portal)
  navLatest: '最新',
  navChallenges: '課題と制約',
  navEvolution: '政策の変遷',

  // Full-page search (/search/)
  searchPageDesc: 'サイト全体を検索：政策、議会討論、動画、人物、レバー、記事。',

  // Topics hub (/topics/)
  topicsIndexDesc: '15 のテーマでサイト全体を横断——各テーマのページに関連する議会討論・政策・動画・人物・記事を集約。',
  topicEntriesCount: '関連コンテンツ {count} 件',
  topicViewAll: 'すべて見る（{count} 件）→',
  relatedTopicsHeading: '関連テーマ',
  sameTopicHeading: '同じテーマの続き',
  topicKindLegal: '法律',
  topicKindTimeline: '年表',
  topicKindTalent: '人材',
  pnOlder: '← 前へ（古い）',
  pnNewer: '次へ（新しい）→',

  fullTextTranslated: '全文翻訳（日本語）',
  coreViewpoint: 'コア観点',
  relatedVideos: '関連動画',
  speaker: '講演者',
  videoType: '種類',
  videoSource: '出典',
  videoSummary: '内容サマリー',
  videoFullTranscript: '完全字幕（原文整形）',
  videoReadableTranscript: '読みやすい字幕整形',
  videoCaptionLanguage: '字幕言語：',
  videoFetched: '取得日：',
  videoCaptionsUnavailable: '読みやすい字幕はまだありません。上の動画を直接ご視聴ください。',
  parliamentSession: '議会',
  speechSummaryPoints: '要点',
  mddiSpeechLabel: 'MDDI スピーチ',
  mddiSourceLabel: 'MDDI 公式サイト原文',
  categoryGovernment: '政府',
  categoryAcademic: '学術',
  categoryIndustry: '産業',
  officialChannels: '公式チャンネル',
  oneLinerTitle: '一言で表すと',
  profilePending:
    'このプロフィールは補完中です。現在のページは利用可能なデータから議会発言と政策関連を自動集約しています。',
  debateCount: '議会発言',
  policyCount: '主導政策',
  videoCount: '動画観点',
  noDebateRecords: '関連する議会討論記録はありません。',
  voiceParlRecord: '議会 AI 発言記録',
  voiceParlByYear: '年別',
  voiceParlByTopic: 'テーマ別',
  officialWebsite: '公式サイト',
  ecosystemReadMore: '詳細を見る →',
  ecosystemVisitWebsite: '{name} 公式サイトを訪問',
  ecosystemSubtitle: 'AI Singapore の七つの柱と主要プレイヤー、シンガポール AI エコシステムの全体像を提示します。',
  ecosystemSourceFootnote:
    'データ出典：AI Singapore 公式サイトおよび公開情報。エコシステムは進化し続けています。情報追加歓迎。',

  // Benchmarking profile pages
  benchmarkCrumb: '国際ベンチマーク',
  benchmarkDrilldownEyebrow: 'ベンチマーク詳細 · 更新日',
  benchmarkOwnerLabel: '所属機関',
  benchmarkWhyItMatters: '観察に値する理由',
  benchmarkSingaporeTakeaway: 'シンガポール向けの示唆',
  benchmarkSourcesHeading: '参考出典',
  benchmarkReferencesHeading: '参考出典',
  benchmarkOfficialSourceLabel: '公式ソース',
  benchmarkRegionBackground: '地域背景',
  benchmarkAnotherCase: '別の事例',
  benchmarkContinueCases: '事例を見る',
  benchmarkDataNoteHeading: 'データの説明',
  benchmarkBackTo: '国際ベンチマークに戻る',
  benchmarkCoreStrategy: 'コア戦略',
  benchmarkInvestmentScale: '投資規模',
  benchmarkGovernanceModel: 'ガバナンスモデル',
  benchmarkComparativeStrength: 'コア優位',
  benchmarkOneLineRead: '一文判定',
  benchmarkCoreStrategiesHeading: 'コア戦略',
  benchmarkInvestmentHeading: '投資とリソース',
  benchmarkGovernanceHeading: 'ガバナンスモデル',
  benchmarkStrengthsHeading: '対シンガポール優位',
  benchmarkWeaknessesHeading: '対シンガポール劣位',
  benchmarkKeyHeading: '主要施策と機関',
  benchmarkKeyInitiatives: '主要施策',
  benchmarkKeyBodies: '主要機関',
  benchmarkItemLabel: 'プロジェクト',
  benchmarkAmountLabel: '金額',
  benchmarkNoteLabel: '備考',
  benchmarkPendingHeading: '詳細は今後追加予定',
  benchmarkRelatedHeading: '関連記事',
  benchmarkOverview: '国際ベンチマーク概要',
  benchmarkLeversCta: 'シンガポール国家 AI レバー',
  benchmarkLegalCta: 'シンガポール AI 法的枠組み',
  benchmarkContinueHeading: '比較を続ける',
  benchmarkExpandHeading: '説明を展開',
  benchmarkContinueRegion: '同じ地域で掘り下げる',
  benchmarkIntroSubtitle: '国家戦略から具体的な企業、プロジェクト、機関、インフラまで掘り下げます。',
  benchmarkIntroCallout:
    '本当に役立つベンチマークとは、「某国は AI が強い」といった空虚な話ではなく、どの具体的な対象が国家の能力になったかを見ることです：ファンド、大学、モデル、テストフレームワーク、政府 AI アシスタント、あるいはサプライチェーンの拠点。',
  benchmarkStatCaseProfiles: '事例プロファイル',
  benchmarkStatRegionProfiles: '地域プロファイル',
  benchmarkStatProfilesUpdated: 'プロファイル更新',
  benchmarkLibraryHeading: 'ベンチマーク事例ライブラリ',
  benchmarkLibrarySubtitle: '各カードは今後も充実していくプロファイルに対応しています。',
  benchmarkViewRegionOverview: '地域概要を見る',
  benchmarkKeyInsightsHeading: '主要な洞察',
  benchmarkOverviewComparisonHeading: '総覧比較表',
  benchmarkColRegion: '地域',
  benchmarkColCoreStrategy: 'コア戦略',
  benchmarkColYear: '年',
  benchmarkColInvestment: '投資規模',
  benchmarkColGovernance: 'ガバナンス',
  benchmarkColStrength: '強み',
  benchmarkColAiRanking: 'AI ランキング',
  benchmarkRegionPagesHeading: '地域背景ページ',
  benchmarkViewRegionProfile: '国・地域プロファイルを見る',
  benchmarkBaseDataUpdated: '基礎データ更新',
  benchmarkCaseProfilesCurated: '事例プロファイル整理',
  benchmarkReportArchiveHeading: 'Stanford AI Index レポートアーカイブ',
  benchmarkReportArchiveIntro:
    '本ページの国際比較データの多くは、スタンフォード HAI の年次 AI Index レポートに基づいています。ここでは各年版の要点と原文リンクを年別に整理しています。',
  benchmarkReportArchiveRead: 'レポート原文を読む',

  // Open source / community open source project detail pages
  osBack: '公式オープンソース・研究に戻る',
  osCommunityBack: '産学研オープンソースエコシステムに戻る',
  osProfile: 'プロジェクト情報',
  osCommunityProfile: 'プロジェクト情報',
  osOwner: '所属',
  osOrg: '機関',
  osOrgType: 'グループ',
  osCategory: 'カテゴリー',
  osStatus: 'ステータス',
  osFounded: 'ローンチ',
  osLanguage: '言語 / 形態',
  osLicense: 'ライセンス',
  osUpdated: '情報更新',
  osWhatItIs: '説明',
  osAiRelevance: 'AIとの関係',
  osSingaporeRelevance: 'シンガポールとの関係',
  osMilestones: '重要マイルストーン',
  osResources: 'リソース入口',
  osCommunityRelated: 'その他の産学研プロジェクト',
  osOrgTypeUniversity: '大学・研究機関',
  osOrgTypeCorporateLab: '国際企業ラボ',
  osOrgTypeStartup: 'スタートアップ',

  // RelatedRail cross-link component
  railRel: '関連：',
  railNoneYet: '他のリソースはまだ関連付けられていません。',
  railPeople: '人物',
  railPolicies: '政策',
  railDebates: '議会討論',
  railLevers: 'レバー',
  railTimeline: '時点',
  railAnalyses: '観点',
  railMoreDebates: '…他 {n} 件',
  railMoreDebatesInline: '+{n} 件の討論',

  // Startup entity detail page
  startupKindCompany: '会社 / プロジェクト',
  startupKindExit: 'エグジット / 買収サンプル',
  startupKindInvestor: '投資機関',
  startupPositioning: 'ポジショニング',
  startupCapitalSignals: '資本と市場のシグナル',
  startupAiRelationHeading: 'AI 関連度',
  startupWhyItMatters: '観察に値する理由',
  startupSignalsToTrack: '今後の追跡ポイント',
  startupSignalsPending: '公開資本シグナルは補充中です。',
  startupNote: '備考',
  startupRelatedEntities: '関連エンティティ',
  startupDataNote: 'データの説明',
  startupTypeLabel: 'タイプ',
  startupVerticalLabel: '分野 / グループ',
  startupAiRelationLabel: 'AI 関連度',
  startupPublicFunding: '公開資金調達',
  startupValuation: '評価額',
  startupStatusLabel: 'ステータス',
  startupInvestorsLabel: '投資家',
  startupAcquirerLabel: '買収者',
  startupAmountYear: '金額 / 年',
  startupTrackRecord: '投資実績',
  startupFocusLabel: '重点分野',
  startupUnicornBadge: 'ユニコーン',
  startupBackTo: 'AI スタートアップエコシステムに戻る',
  startupNav: 'AI スタートアップ',

  // Startups listing page (/startups/)
  startupStatAiCompanies: 'AI 企業数（Tracxn 収録）',
  startupStatGlobalRank: '世界第 {rank} 位',
  startupStatHubRank: 'AI ハブランキング',
  startupStatSeaFundingShare: '東南アジア AI 資金調達シェア',
  startupStatTotalVcRaised: 'VC 資金調達総額',
  startupStatUnicorns: 'ユニコーン',
  startupStatGovCommitment: '政府 AI コミットメント',
  startupUnicornsSectionTitle: 'ユニコーンと上場規模企業',
  startupByVerticalTitle: '分野別分類',
  startupExitsSectionTitle: '主要なエグジットと買収',
  startupInvestorEcosystemTitle: '投資家エコシステム',
  startupRaisedLabel: '資金調達額',
  startupTrackRecordColon: '投資実績：',
  startupFocusColon: '重点分野：',

  // Generic count suffixes / small chrome shared across listing pages
  openProfileCta: '詳細を見る',
  entitiesCountSuffix: 'エンティティ',
  institutionsCountSuffix: '機関',
  companiesCountSuffix: '社',
  recordsCountSuffix: '件',
  yearPending: '年度未定',

  // Generic filter-bar chrome (voices/videos listing pages)
  filterTopicLabel: 'テーマ',
  filterYearLabel: '年',
  filterSpeakerLabel: '講演者',
  filterSpeakerTypeLabel: '講演者タイプ',
  filterAllLabel: 'すべて',
  filterClearLabel: 'フィルターをクリア',
  filterClearAllLabel: 'すべてのフィルターをクリア',
  filterShowingLabel: '表示中',
  filterResultsSuffix: '件の結果',
  noVideosMatchFilter: '条件に一致する動画がありません。',
  noSpeechesMatchFilter: '条件に一致するスピーチがありません。',

  // Voices listing page (/voices/)
  voicesIntroBlurb: 'シンガポールの AI 分野における重要な人物と機関、およびその公式情報発信チャネル。',
  voicesIntroSubBlurb: '彼らの動向を追跡し、AI 政策と戦略の一次情報を入手しましょう。',
  voicesStatPeople: '重要人物',
  voicesStatInstitutions: '主要機関',
  voicesStatSpeeches: '公式スピーチ',
  voicesStatVideos: 'YouTube 動画',
  voicesKeyPeopleSection: '重要人物',
  voicesCoreInstitutionsSection: '主要機関',
  voicesMddiSpeechesSection: '公式 AI 関連スピーチ',
  voicesYoutubeVideosSection: 'YouTube AI 動画',
  mddiSourceTitle: 'MDDI 公式サイト原文',

  // Videos listing page (/videos/)
  videosIntroBlurb: 'シンガポール政府高官、学者、業界リーダーによる人工知能に関する YouTube スピーチとインタビュー。',
  videosIntroSubBlurb: '動画カードをクリックすると、読みやすい字幕、要約、関連動画を確認できます。',
  videosStatTotal: '動画総数',
  videosStatSpeakers: '講演者',
  videosStatYears: 'カバー年数',

  // Voice profile detail page (/voices/[id]/)
  voicePositioningHeading: 'ポジショニング',
  voicePoliciesChampionedHeading: '主導政策（{count} 件）',
  voiceAiVideosHeading: 'AI 動画（{count} 本）',

  // Debate/speech detail page chrome
  sprsHansardOriginal: 'SPRS Hansard 原本記録',
  fetchedAtColon: '取得日：',

  viewSource: 'ソースコードを表示',
  countSuffix: '件',
  copyrightOpenSource: 'ソースコード MIT ライセンス；コンテンツ CC BY 4.0',
};

/** Traditional Chinese (zh-Hant) dictionary.
 *
 *  Intentionally empty: zh-tw renders by passing the zh dict through
 *  OpenCC s2twp at runtime (see maybeConvertToTraditional + t()). Hand
 *  override only the entries where 简→繁 conversion produces awkward TW
 *  copy (e.g. proper-noun branding, Singapore-specific terms) — for
 *  everything else the converter handles it correctly.
 *
 *  Add an entry here whenever you spot OpenCC misfires in QA. */
export const zhTwDict: Partial<Record<keyof typeof zh, string>> = {};

/** Korean dictionary. Seeded by `npx tsx scripts/i18n/build-ko-dict.ts`,
 *  which mirrors the ja seed (translateBatch + glossary + sha256 cache).
 *  Hand edits take precedence over re-runs because the script emits a
 *  fresh literal block but does NOT auto-merge. */
export const ko: Partial<Record<keyof typeof zh, string>> = {
  siteName: '싱가포르 AI 옵저버토리',
  siteShortName: 'SG AI',
  siteTagline: '싱가포르 AI 생태계 및 전략의 심층 관찰',
  siteDescription:
    '싱가포르 AI 옵저버토리는 독립적인 다국어 연구 관찰소로, 공개 자료와 1차 출처를 기반하여 싱가포르 AI 전략, 정책 이행, 국회 토론, 산업 생태계, 인재 양성, 오픈소스 프로젝트 및 국제 벤치마크를 지속적으로 추적합니다.',
  navAnalysis: '컬럼',
  navPolicy: '정책 및 전략',
  navDebates: '토론 및 의견',
  navData: '데이터 추적',
  navAbout: '소개',
  navPolicies: '정책 문서',
  navLevers: '국가 AI 레버 지도',
  navLegalAi: 'AI 법적 프레임워크',
  navTimeline: '발전 타임라인',
  navEcosystem: '생태계 지도',
  navParliament: '국회 AI 포커스',
  navVoices: 'AI 영향력 지도',
  navVideos: 'AI 비디오 컬럼',
  navTracker: 'AI 대시보드',
  navStartups: 'AI 스타트업 생태계',
  navTalent: '인재 양성',
  navOpensource: '공식 오픈소스 및 연구',
  navCommunityOpensource: '산학 협력 오픈소스 생태계',
  navBenchmarking: '국제 벤치마크',
  navAboutSite: '사이트 소개',
  navFieldnotes: '실전 노트',
  navReferences: '참고 자료',
  navAllArticles: '전체 글',
  navHome: '홈',
  navBackToBlog: '컬럼 목록으로',
  postPrevOlder: '← 이전 글(더 오래된)',
  postNextNewer: '다음 글(업데이트) →',
  footerMaintainedBy: '{handle}이(가) 관리합니다',
  search: '검색',
  searchPlaceholder: '정책, 토론, 레버, 인물, 블로그 글을 검색하세요……',
  closeSearch: '검색 닫기',
  searchSiteLabel: '사이트 내 검색',
  searchFallbackMessage: '검색을 일시적으로 사용할 수 없습니다. 페이지를 새로고침한 후 다시 시도해 주세요.',
  navAsk: 'AI 질문',
  askPageDesc:
    '싱가포르 AI 전략·정책·생태계에 대해 무엇이든 질문하면, AI가 본 사이트 데이터를 바탕으로 답변하고 출처 링크를 제공합니다.',
  askDisclaimer: '답변은 AI가 생성한 것으로 오류가 있을 수 있습니다. 사이트 내 원문과 공식 출처를 확인해 주세요.',
  askPlaceholder: '싱가포르 AI에 대해 무엇이든 질문하세요…',
  askSend: '보내기',
  askNewChat: '새 대화',
  askPresetHeading: '이런 질문은 어떨까요',
  askThinking: '생각 중…',
  askQuotaLeft: '오늘 남은 질문 횟수: {n}회',
  askQuotaExceeded:
    '오늘의 질문 횟수를 모두 사용했습니다. 내일 다시 시도해 주세요. 사이트 콘텐츠도 둘러보실 수 있습니다.',
  askErrorGeneric: '오류가 발생했습니다. 다시 시도해 주세요.',
  askErrorUnavailable: 'AI 질문 기능은 아직 이용할 수 없습니다.',
  askRetry: '다시 시도',
  askEntryTitle: 'AI에게 질문',
  loadMore: '더 보기',
  readMore: '전체 읽기',
  backTo: '뒤로',
  back: '뒤로',
  related: '관련',
  relatedReading: '관련 글',
  source: '출처',
  officialSourceText: '공식 원문',
  sourcePdf: '원문 PDF',
  translation: '중국어 번역',
  englishTranslation: 'English translation',
  participants: '참여자',
  authors: '주요 저자/추진자',
  policySignal: '정책 신호',
  governmentStance: '정부 입장',
  oppositionStance: '질의 입장',
  keyPoints: '핵심 요점',
  fullTextEn: '영어 원문',
  hansardSource: 'Hansard 원문',
  controversyLevel: '논쟁도',
  heroEyebrow: '싱가포르 AI 옵저버토리',
  heroHeadline: '싱가포르의 AI 전략은 알고리즘에 있지 않습니다.',
  heroHeadline2: '6개의 레버에 있습니다.',
  heroSubtitle:
    '전체 국가를 기업 AI-native 전환의 「포장 계층」으로 취급합니다——국가 자체가 AI-native가 될 필요는 없으며, 기업 전환 속도를 확대하기만 하면 충분합니다.',
  heroSubtitleNeutral:
    '한 도시 국가의 AI 시대 국가 차원 전환 — 정책 문서, 국회 토론, 레버 지도, 스타트업 생태계, 법적 프레임워크의 독립적 분석.',
  ctaReadCore: '핵심 논증 읽기',
  ctaBrowseAll: '모든 컬럼 둘러보기 →',
  freshnessPolicies: '핵심 정책',
  freshnessDebates: '국회 토론',
  freshnessLevers: '레버 프로젝트',
  freshnessUpdated: '최근 업데이트',
  latestAnalyses: '최신 컬럼',
  viewAll: '전체 보기 →',
  viewAllLeversCta: '전체 지도 →',
  viewAllDebatesCta: '전체 {count}개 →',
  leversSection: '국가 차원 AI-native 레버 지도',
  leversBlurb:
    '6개 레버가 {count}개의 구체적인 착지 프로젝트를 포함합니다. 「AI 도입 경로」에 따라 다시 분할하여 여러 부처에 걸쳐 완전한 실행 파이프라인으로 이어집니다.',
  leverMapColPassThrough: '기업으로 관통',
  leverMapColDirect: '국가가 직접 함',
  leverMapColPassThroughHint: '국가가 이러한 레버를 통해 기업의 AI 전환을 확대',
  leverMapColDirectHint: '국가가 스스로 직접 하고, 기업에 의존하지 않음',
  leverProjectsSuffix: '프로젝트',
  transmissionFootnote:
    '7개 전달 레버 중에서, 오직 2개만 국가가 직접 하는 것입니다. 다른 5개는 모두 국가가 기업으로 관통하는 레버입니다.',
  transmissionFootnoteCta: '7개 전달 레버 알아보기 →',
  recentDebatesSection: '최근 국회 토론',
  recentDebatesBlurb: '{from}부터 {to}까지, 의회의 AI 관련 모든 질문, 답변, 토론.',
  closingThesis:
    'AI-native는 규모가 아니라 아키텍처입니다. 국가는 「스스로」AI-native일 수 없습니다 — 반드시 기업으로 관통해야 합니다.',
  closingCta: '「AI-native 국가」 전문 읽기',
  leverWord: '레버',
  homeTrackerSection: '싱가포르 AI 대시보드',
  homeTrackerBlurb: '6개 차원의 현재 수치, 월별 업데이트.',
  homeTrackerCta: '전체 대시보드 →',
  policiesPageTitle: '싱가포르 AI 정책 라이브러리 — 전체 아카이브와 타임라인',
  policiesPageBlurb:
    '싱가포르 AI 정책 아카이브: NAIS 2.0, Model AI Governance Framework, Copyright §244, AI Verify, ASEAN Guide 등 핵심 문서의 전문과 요약. 전략·거버넌스·법률·부처별 분류, 시간 역순.',
  policiesItemsSuffix: '부',
  policyArchiveSuffix: '정책 아카이브',
  backToPolicies: '정책 라이브러리로 돌아가기',
  debatesPageTitle: '국회 AI 초점',
  blogIndexTitle: '컬럼',
  blogPageNumber: '{n}페이지',
  blogTagTitle: "'{tag}' 태그 글",
  aboutPageTitle: '사이트 소개',
  aboutPageDesc:
    '싱가포르 AI 옵저버토리 소개 — 독립적으로 유지 관리되는 싱가포르 AI 전략 관찰 플랫폼. 연구 방법론, 이해관계 선언, 피드백 방식.',
  evolutionPageTitle: '정책 진화 분석',
  evolutionPageDesc: '싱가포르 AI 정책 진화 종합 전망 — 2014년 스마트 네이션에서 2024년 NAIS 2.0으로의 전략 전환 여정.',
  timelinePageTitle: '발전 타임라인',
  timelinePageDesc:
    '싱가포르 AI 발전 타임라인: 2014년 스마트 네이션에서 2027년 국제 AI 올림픽으로, 핵심 이정표를 시간 순서로 정렬.',
  ecosystemPageTitle: '생태계 지도',
  ecosystemPageDesc: '싱가포르 AI 생태계 지도 — 정부 기관, 연구 기관, 기업 및 스타트업의 완전한 지형도.',
  leversPageTitle: '싱가포르 국가 AI 레버 — 6개 부처 횡단 실행 파이프라인',
  leversPageDesc:
    '싱가포르의 국가급 AI-native 전환을 「AI 도입 경로」로 재분류 — 기반시설, 거버넌스, 인재, 애플리케이션, 정부 자체 사용, 외교의 6개 레버. Budget 2026 및 각 부처 정책 원문 링크 포함.',
  investorNotableDeals: '주요 AI 거래: ',
  startupsPageTitle: '싱가포르 AI 스타트업',
  startupsPageSubtitle:
    '싱가포르 AI-native, AI-enabled 및 인접 자본 생태계 엔티티 디렉터리 — 각 기업, 프로젝트, 투자자가 계속 확장되는 프로필을 갖습니다.',
  talentPageTitle: '인재 양성',
  talentPageDesc: '싱가포르 AI 인재 양성 체계 — 대학 프로그램, 정부 교육 계획, 인재 유입 정책 개요입니다.',
  talentProgrammeProfile: '프로그램 프로필',
  talentOfficialSourceHeading: '공식 출처',
  talentCheckedByThisSite: '본 사이트 확인: ',
  talentMoreProgrammes: '다른 인재 프로그램',
  talentSourcesNote: '출처: AI Singapore, LearnAI, AIAP, NAISC 및 IOAI 공식 페이지. 본 사이트 확인일: {date}.',
  jobsIndexHeading: 'AI 인재 수요 측: 채용 공고 월간 스냅샷',
  regLookaheadHeading: '규제 전망: 진행 중인 협의와 법안',
  regLookaheadIntro:
    '법 제정 이전의 파이프라인——개방 중인 공개 협의와 국회에서 절차를 밟고 있는 관련 법안을 매주 자동 갱신합니다. 제정 후에는 아래 정식 섹션으로 이동합니다.',
  regLookaheadOpenBadge: '협의 진행 중',
  regLookaheadDeadline: '마감',
  regLookaheadDaysLeft: '{n}일 남음',
  regLookaheadCoreBadge: '핵심 AI 관련',
  regLookaheadArchive: '보관됨',
  regLookaheadStage_introduced: '1독회 제출',
  'regLookaheadStage_second-reading': '2독회',
  regLookaheadStage_passed: '통과',
  regLookaheadStage_assented: '대통령 승인',
  regLookaheadStage_withdrawn: '철회',
  regLookaheadStatus_open: '진행 중',
  regLookaheadStatus_closed: '마감됨',
  'regLookaheadStatus_response-published': '응답 발표됨',
  jobsRoleEngineering: '엔지니어링',
  jobsRoleResearch: '연구',
  jobsRoleData: '데이터 / ML',
  jobsRoleProduct: '프로덕트',
  jobsRoleGtm: '영업·마케팅',
  jobsRoleOpsOther: '운영·기타',
  jobsIndexIntro:
    '위는 공급 측(교육·경진 프로그램)입니다. 여기는 수요 측: 공식 채용 포털 MyCareersFuture의 AI 채용 공고 월간 집계 스냅샷입니다——집계만 하며 공고를 전재하지 않습니다. 고정된 방법론 아래 매월 축적되어 장기적으로 독점적인 타임라인을 형성합니다.',
  jobsIndexTotalLabel: '게시 중인 AI 공고',
  jobsIndexMedianLabel: '월급 중위값(공개 샘플)',
  jobsIndexBandLabel: 'P25–P75 구간',
  jobsIndexDisclosureLabel: '급여 공개율',
  jobsIndexTopEmployersLabel: '상위 10개 고용주',
  jobsIndexRolesLabel: '직무 구성',
  jobsIndexMoMLabel: '전월 대비',
  jobsIndexAccumulating: '시계열 축적 중——분기 비교는 두 분기 데이터가 갖춰지는 대로 공개됩니다.',
  jobsIndexMethodNote:
    '방법론 v{v}: 고정 쿼리 바스켓, 공고 uuid 중복 제거; 급여 통계는 공개된 월급 구간의 중점만 사용; 스냅샷은 불변입니다. 대상 월: {month}.',
  videosPageTitle: 'AI 영상 인사이트',
  videosPageDesc:
    '싱가포르 정부 관계자, 학자, 업계 지도자의 AI 전략, 거버넌스, 인재 및 산업에 관한 YouTube 강연 및 인터뷰 모음입니다.',
  voicesPageTitle: '싱가포르 AI 영향력 지도 — 장관·국회의원·학자·공식 연설',
  voicesPageDesc:
    '싱가포르 AI 정책 의사결정자를 한 눈에: 장관, 국회의원, 학자, 산업 리더 — 국회 발언, 주도 정책, 영상 입장, 공식 채널. MDDI AI 관련 연설 전문 검색 포함.',
  opensourcePageTitle: '공식 오픈소스 및 연구',
  opensourcePageDesc:
    '싱가포르 정부 및 공식 기관의 AI 오픈소스 프로젝트 및 연구 성과 요약 — SEA-LION, AI Verify 등입니다.',
  opensourcePageSubtitle: 'AI Singapore 및 싱가포르 정부가 지원하는 오픈소스 프로젝트 및 연구 성과',
  opensourceIntroBefore:
    'ℹ️ 이 페이지는 AI Singapore 및 싱가포르 정부가 지원하는 오픈소스 프로젝트와 연구 성과를 다룹니다. 싱가포르 산학계의 더 많은 오픈소스 프로젝트는',
  opensourceIntroAfter: '페이지를 참고하세요.',
  opensourceSeaLionSection: '🦁 SEA-LION 모델 생태계',
  opensourceStatTotalModels: '모델 총수',
  opensourceStatTotalDownloads: '총 다운로드 수',
  opensourceStatTotalLikes: '총 좋아요 수',
  opensourceStatTopModelDownloads: '최다 인기 모델 다운로드',
  osTableVersion: '버전',
  osTableModels: '모델 수',
  osTableDownloads: '다운로드 수',
  osTableLikes: '좋아요',
  osTablePeriod: '기간',
  opensourceViewOnHuggingFace: '🤗 HuggingFace에서 전체 모델 보기 →',
  opensourceSeaGuardSection: '🛡️ SEA-Guard 안전 모델',
  opensourceModelsCountSuffix: '개 모델',
  opensourceDownloadsCountSuffix: '회 다운로드',
  opensourceAiVerifySection: '✅ AI Verify 거버넌스 프레임워크',
  opensourceOpenSourcedOn: '{date} 오픈소스 공개',
  opensourcePartners: '파트너',
  opensourceOfficialIndexSection: '📦 공식 프로젝트 인덱스',
  opensourceOfficialIndexBlurb: '각 카드는 지속적으로 보완되는 프로젝트 프로필로 연결됩니다.',
  opensourcePapersSection: '📄 연구 논문',
  opensourceChineseTranslation: '중국어 번역 →',
  communityOsPageTitle: '산학 협력 오픈소스 생태계',
  communityOsPageDesc:
    '싱가포르 산학 협력 AI 오픈소스 생태계 — 대학, 기업 실험실, 스타트업의 오픈소스 기여 전망입니다.',
  communityOsPageSubtitle: '싱가포르 대학, 국제 기업 연구소, 스타트업의 AI 오픈소스 프로젝트',
  communityOsUniversitiesSection: '대학 및 연구 기관',
  communityOsUniversitiesBlurb:
    '대학 연구실이 만든 모델, 툴킷, 훈련 시스템. 각 카드는 독립된 프로젝트 프로필로 연결됩니다.',
  communityOsCorporateLabsSection: '싱가포르 소재 국제 기업 연구소',
  communityOsCorporateLabsBlurb:
    '싱가포르와 연계된 연구 네트워크에서 나온 다국적 기술 기업의 오픈소스 모델, 훈련 프레임워크 및 도구.',
  communityOsStartupsSection: '스타트업',
  communityOsStartupsBlurb: '오픈소스를 제품 배포 및 개발자 커뮤니티 진입 통로로 활용하는 싱가포르 AI 스타트업 사례.',
  benchmarkingPageTitle: '국제 벤치마크',
  benchmarkingPageDesc: '싱가포르 AI 전략 국제 벤치마크 — 미국, 영국, 중국, EU 등 주요 경제체와의 비교 분석입니다.',
  legalAiPageTitle: '싱가포르 AI 법적 프레임워크',
  legalAiPageDesc:
    '싱가포르 AI 법적 프레임워크——「훈련 관대 + 출력 엄격 관리」이중 트랙: Copyright §244는 전 세계 최관대 AI 훈련 예외이며, OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill 4개 항목의 출력 엄격 관리를 함께 시행합니다.',
  legalCorePoint: '핵심 결론',
  legalDetailedNote: '상세 설명',
  legalFrameworkPosition: '법적 프레임워크 내 위치',
  legalStatuteSource: '법률 원문 / 출처',
  legalViewLevers: '싱가포르 국가 AI 레버 보기',
  legalRelatedCards: '동일 그룹 법률 카드',
  challengesPageTitle: '도전 과제 및 제약 분석',
  challengesPageDesc: '싱가포르 AI 발전이 직면한 핵심 도전——인재 경쟁, 데이터 제한, 컴퓨팅 파워 제약 및 윤리 거버넌스.',
  fieldnotesPageTitle: '실전 노트',
  fieldnotesPageDesc:
    '싱가포르에서 AI 업무에 종사하는 현장 관찰 및 실전 경험 공유, 주제별 집계로 당신이 불필요한 우회를 피하도록 도와줍니다.',
  referencesPageTitle: '참고 자료',
  referencesPageDesc: '싱가포르 AI 참고 자료——공식 보고서, 연구 논문, 데이터셋, 도구 및 추천 읽기.',
  policiesStatProfiles: '기록 총수',
  policiesStatCategories: '분류',
  policiesStatFormat: '형태',
  policiesStatFormatValue: '기록 페이지',
  langBannerEn: 'English version available',
  langBannerSwitch: 'Read in English →',
  langBannerDismiss: '닫기',
  langZh: '중국어',
  langEn: 'English',
  langToggleLabel: '언어 전환',
  footnotes: '참고 문헌',
  tocLabel: '목차',
  tocSummary: '📑 목차({count} 항목)',
  trackerPageTitle: '싱가포르 AI 옵저버토리 대시보드',
  trackerPageBlurb:
    '6개 차원으로 싱가포르 AI의 실제 상태를 제시합니다——핵심 수치, 제3자 순위, 목표 진행도, 추세, 편집 해석, 핵심 약점. 우리는 점수를 매기지 않습니다.',
  trackerSectionTopRankings: '국제 참조',
  trackerSectionMethodologyNote: '방법 설명',
  trackerSectionMethodology: '상세 방법론',
  trackerCardTrendUp: '↗ 상향',
  trackerCardTrendFlat: '→ 유지',
  trackerCardTrendDown: '↘ 하향',
  trackerDetailJudgment: '편집 해석',
  trackerDetailShortcoming: '핵심 약점',
  trackerDetailRankings: '제3자 순위 앵커',
  trackerDetailProgress: '목표 진행 상황',
  trackerDetailMetrics: '전체 데이터',
  trackerDetailRelated: '관련 글',
  trackerDetailMetricsHeaderName: '지표',
  trackerDetailMetricsHeaderValue: '데이터',
  trackerDetailMetricsHeaderSource: '출처 / 시간',
  trackerDetailMetricsHeaderCategory: '분류',
  trackerDetailCardHeadline: '주요 수치',
  trackerDetailCardBenchmark: '기준 체계',
  trackerDetailCardBadge: '정의',
  trackerDetailCardTrend: '추세',
  trackerCategoryEnterprise: '기업 채택',
  trackerCategoryGovernment: '정부 자체 사용',
  trackerMethodologyTitle: '대시보드 방법론',
  trackerMethodologyDesc:
    '대시보드를 어떻게 만드는가——무엇을 보여주고, 무엇을 보여주지 않으며, 왜 종합 등급을 매기지 않는가.',
  capitalSectionTitle: '자본 및 인프라',
  capitalSectionLead:
    '산문 속에 흩어져 있던 자본 이벤트를 날짜·금액·출처가 붙은 기록으로 정리했습니다. 금액은 이벤트 총액이며 개별 참여자별로 나누지 않았습니다.',
  capitalEventLabel: '이벤트',
  fpMissionsSection: '4대 국가 AI 미션',
  newsletterTitle: '월간 이메일',
  newsletterBlurb: '한 달에 한 통: 이달의 업데이트 정리와 짧은 편집 판단. 광고 없음, 스팸 없음.',
  newsletterEmailLabel: '이메일',
  newsletterSubmit: '구독',
  capitalKindColumnLabel: '유형',
  capitalDateLabel: '날짜 / 출처',
  capitalKindHyperscaler: '하이퍼스케일러 커밋먼트',
  capitalKindSovereign: '국부 투자',
  capitalKindFund: '자금 규모',
  capitalAmountTypeRound: '라운드 규모',
  capitalAmountTypeCommitment: '누적 커밋먼트',
  capitalAmountTypeExposure: '포트폴리오 비중',
  capitalAmountTypeJointVenture: '합작 규모',
  capitalAmountTypeCumulative: '누적 출자',
  capitalAmountTypeEnvelope: '정부 전용 예산',
  capitalAmountTypeUndisclosed: '미공개',
  capitalPartiesLabel: '참여 주체',
  capitalAmountLabel: '금액',
  capitalRatioLabel: '증폭 배수',
  capitalRatioCaveat:
    '배수 정의: 분자는 5개 하이퍼스케일러의 싱가포르 누적 커밋먼트(US$260억+, 데이터센터 및 지역 본부), 분모는 2023–2026 정부 AI 전용 예산(S$20억+). 환율 환산은 적용하지 않아 배수는 참고용이며, 「+」는 하한 공개를 뜻합니다.',
  trackerHomeSummaryTitle: '🇸🇬 싱가포르 AI 대시보드',
  trackerHomeSummaryCta: '6개 차원으로 현황 보기 → 전체 대시보드',
  trackerEditorialAttribution: 'sgai 편집 해석',
  trackerBackToDashboard: '대시보드로 돌아가기',
  trackerLastUpdated: '데이터 업데이트',
  voiceSignatureWork: '주도 업무',
  voiceNotableQuotes: '공개 성명',
  voiceSpeakingRecord: '최근 발표',
  voiceExternalRoles: '기관 간 신원',
  voiceSinceLabel: '자신',
  voiceSourceLabel: '출처',
  voiceAuthorLabel: '저자',
  tasksSection: '여기서 시작',
  tasksBlurb: '질문이 다르면 입구도 다릅니다. 먼저 무엇을 하고 싶은지 말씀해 주세요.',
  taskUnderstandTitle: '싱가포르 AI 전략을 이해하고 싶습니다.',
  taskUnderstandBlurb: '6 레버 지도, 정책 진화, 국제 벤치마크——전체 이야기를 연결합니다.',
  taskUnderstandCta: '핵심 논의부터 읽기 →',
  taskPolicyTitle: '정책, 법규, 공식 출처를 찾고 싶어요',
  taskPolicyBlurb: '정책 라이브러리, AI 법적 프레임워크, 국회 토론, 참고 자료——인용 가능한 1차 출처입니다.',
  taskPolicyCta: '정책과 토론 조회 →',
  taskBusinessTitle: '기업과 창업 기회를 보고 싶어요',
  taskBusinessBlurb: '스타트업 생태계, 생태계 지도, 인재 양성, 오픈소스 프로젝트, 국제 벤치마크.',
  taskBusinessCta: '생태계와 기업 보기 →',
  taskTrackTitle: '최신 변화를 추적하고 싶어요',
  taskTrackBlurb: '최근 업데이트, 트래커 데이터, 최신 국회 토론, 새로 발표된 정책.',
  taskTrackCta: '업데이트 흐름 보기 →',
  updatesNav: '최근 업데이트',
  updatesPageTitle: '최근 업데이트',
  updatesPageBlurb:
    '본 사이트의 매주 새로운 정책, 토론, 비디오, 창업, 긴 글 및 데이터 수정——하나의 흐름, 모두 여기에 있습니다.',
  updatesHomeSection: '최근 업데이트',
  updatesHomeBlurb: '이번 주와 지난주 추가된 정책, 토론, 비디오, 긴 글. 각 항목이 원본 페이지로 직접 연결됩니다.',
  updatesHomeCta: '전체 업데이트 흐름 →',
  updatesEmpty: '최근 업데이트가 없습니다.',
  updatesRssTitle: '싱가포르 AI 옵저버토리 — 최근 업데이트',
  updatesRssDescription: '새 정책, 토론, 비디오, 창업 프로필, 긴 글 및 데이터 수정.',
  updateTypePolicy: '정책',
  updateTypeDebate: '토론',
  updateTypeVideo: '비디오',
  updateTypeStartup: '창업',
  updateTypePeople: '인물',
  updateTypeSpeech: '강연',
  updateTypeTracker: '대시보드',
  updateTypeBenchmark: '벤치마크',
  updateTypeEcosystem: '생태계',
  updateTypeLever: '레버',
  updateTypeLongform: '장문',
  updateTypeSite: '사이트',
  updateTypeFix: '정정',

  // Front page (news-portal homepage)
  fpMastheadTagline: '최신 동향',
  fpMastheadUpdated: '업데이트',
  fpStatVideos: '비디오',
  fpFocusEyebrow: '포커스',
  fpBrowseSection: '탐색 방법',
  fpBrowseByTime: '시간순으로 보기',
  fpBrowseByTopic: '주제별로 보기',
  fpHotSection: '인기 섹션',
  fpPicksSection: '주목 토픽',
  fpDirectorySection: '사이트 전체 보기',
  fpDirectoryBlurb: '지속적으로 업데이트되는 12개 데이터 영역. 각 카드에 최신 수록을 표시합니다.',
  fpLatestPrefix: '최신',
  fpEntriesSuffix: '건',
  fpStartHereSection: '프레임워크 이해하기',
  listingLatestSection: '최신 수록',
  crossRailHeading: '계속 탐색하기',

  // Nav additions (news-portal)
  navLatest: '최신',
  navChallenges: '도전과 제약',
  navEvolution: '정책 변천',

  // Full-page search (/search/)
  searchPageDesc: '사이트 전체 검색: 정책, 국회 토론, 비디오, 인물, 레버, 글.',

  // Topics hub (/topics/)
  topicsIndexDesc:
    '15개 주제로 사이트 전체를 가로지릅니다 — 주제별 페이지에 관련 토론·정책·비디오·인물·글을 한데 모았습니다.',
  topicEntriesCount: '관련 콘텐츠 {count}건',
  topicViewAll: '전체 {count}건 보기 →',
  relatedTopicsHeading: '관련 주제',
  sameTopicHeading: '같은 주제 더 보기',
  topicKindLegal: '법률',
  topicKindTimeline: '타임라인',
  topicKindTalent: '인재',
  pnOlder: '← 이전(과거)',
  pnNewer: '다음(최신) →',

  fullTextTranslated: '전문 번역(한국어)',
  coreViewpoint: '핵심 관점',
  relatedVideos: '관련 영상',
  speaker: '연사',
  videoType: '유형',
  videoSource: '출처',
  videoSummary: '내용 요약',
  videoFullTranscript: '완전 자막(원문 정렬)',
  videoReadableTranscript: '가독성 있는 자막 정렬',
  videoCaptionLanguage: '자막 언어:',
  videoFetched: '수집 날짜:',
  videoCaptionsUnavailable: '가독성 있는 자막이 없습니다. 위의 원본 영상을 클릭하여 재생할 수 있습니다.',
  parliamentSession: '국회',
  speechSummaryPoints: '요점',
  mddiSpeechLabel: 'MDDI 연설문',
  mddiSourceLabel: 'MDDI 공식 웹사이트 원문',
  categoryGovernment: '정부',
  categoryAcademic: '학술',
  categoryIndustry: '산업',
  officialChannels: '공식 채널',
  oneLinerTitle: '한 문장 포지셔닝',
  profilePending:
    '이 인물의 정보는 보완 대기 중입니다. 현재 페이지는 먼저 기존 데이터를 바탕으로 이 인물의 국회 발언 및 정책 연관성을 자동으로 집계합니다.',
  debateCount: '국회 발언',
  policyCount: '주도 정책',
  videoCount: '영상 관점',
  noDebateRecords: '관련 토론 기록이 없습니다.',
  voiceParlRecord: '국회 AI 발언 기록',
  voiceParlByYear: '연도별',
  voiceParlByTopic: '주제별',
  officialWebsite: '공식 웹사이트',
  ecosystemReadMore: '자세히 알아보기 →',
  ecosystemVisitWebsite: '{name} 공식 웹사이트 방문',
  ecosystemSubtitle: 'AI Singapore의 일곱 가지 핵심 기둥과 주요 참여자들이 싱가포르 AI 생태계 전체상을 보여줍니다.',
  ecosystemSourceFootnote:
    '데이터 출처: AI Singapore 공식 웹사이트 및 공개 정보. 생태계는 지속적으로 진화하고 있으며, 보완을 환영합니다.',
  // Benchmarking profile pages
  benchmarkCrumb: '국제 벤치마크',
  benchmarkDrilldownEyebrow: '벤치마크 상세 · 업데이트',
  benchmarkOwnerLabel: '소유 기관',
  benchmarkWhyItMatters: '주목할 이유',
  benchmarkSingaporeTakeaway: '싱가포르를 위한 시사점',
  benchmarkSourcesHeading: '참고 출처',
  benchmarkReferencesHeading: '참고 출처',
  benchmarkOfficialSourceLabel: '공식 출처',
  benchmarkRegionBackground: '지역 배경',
  benchmarkAnotherCase: '다른 사례',
  benchmarkContinueCases: '사례 계속 보기',
  benchmarkDataNoteHeading: '데이터 설명',
  benchmarkBackTo: '국제 벤치마크로 돌아가기',
  benchmarkCoreStrategy: '핵심 전략',
  benchmarkInvestmentScale: '투자 규모',
  benchmarkGovernanceModel: '거버넌스 모델',
  benchmarkComparativeStrength: '핵심 우위',
  benchmarkOneLineRead: '한 줄 판단',
  benchmarkCoreStrategiesHeading: '핵심 전략',
  benchmarkInvestmentHeading: '투자와 자원',
  benchmarkGovernanceHeading: '거버넌스 모델',
  benchmarkStrengthsHeading: '싱가포르 대비 강점',
  benchmarkWeaknessesHeading: '싱가포르 대비 약점',
  benchmarkKeyHeading: '핵심 이니셔티브와 기관',
  benchmarkKeyInitiatives: '핵심 이니셔티브',
  benchmarkKeyBodies: '핵심 기관',
  benchmarkItemLabel: '항목',
  benchmarkAmountLabel: '금액',
  benchmarkNoteLabel: '비고',
  benchmarkPendingHeading: '상세 정보 확장 예정',
  benchmarkRelatedHeading: '관련 읽기',
  benchmarkOverview: '국제 벤치마크 개요',
  benchmarkLeversCta: '싱가포르 국가 AI 레버',
  benchmarkLegalCta: '싱가포르 AI 법적 프레임워크',
  benchmarkContinueHeading: '비교 계속하기',
  benchmarkExpandHeading: '설명 펼치기',
  benchmarkContinueRegion: '같은 지역 계속 살펴보기',
  benchmarkIntroSubtitle: '국가 전략에서 구체적인 기업, 프로젝트, 기관, 인프라까지 파고듭니다.',
  benchmarkIntroCallout:
    '진짜 유용한 벤치마킹은 "어느 나라가 AI를 잘한다"는 공허한 말이 아니라, 어떤 구체적 대상이 국가 역량으로 완성되었는지를 보는 것입니다: 하나의 펀드, 하나의 대학, 하나의 모델, 하나의 테스트 프레임워크, 하나의 정부 AI 어시스턴트, 또는 하나의 공급망 거점.',
  benchmarkStatCaseProfiles: '사례 프로필',
  benchmarkStatRegionProfiles: '지역 프로필',
  benchmarkStatProfilesUpdated: '프로필 업데이트',
  benchmarkLibraryHeading: '벤치마크 사례 라이브러리',
  benchmarkLibrarySubtitle: '각 카드는 계속 확장될 수 있는 기업, 프로젝트 또는 기관 프로필에 대응합니다.',
  benchmarkViewRegionOverview: '지역 개요 보기',
  benchmarkKeyInsightsHeading: '핵심 인사이트',
  benchmarkOverviewComparisonHeading: '개요 비교표',
  benchmarkColRegion: '지역',
  benchmarkColCoreStrategy: '핵심 전략',
  benchmarkColYear: '연도',
  benchmarkColInvestment: '투자 규모',
  benchmarkColGovernance: '거버넌스',
  benchmarkColStrength: '강점',
  benchmarkColAiRanking: 'AI 순위',
  benchmarkRegionPagesHeading: '지역 배경 페이지',
  benchmarkViewRegionProfile: '국가/지역 프로필 보기',
  benchmarkBaseDataUpdated: '기본 데이터 업데이트',
  benchmarkCaseProfilesCurated: '사례 프로필 정리',
  benchmarkReportArchiveHeading: 'Stanford AI Index 보고서 아카이브',
  benchmarkReportArchiveIntro:
    '이 페이지의 국제 비교 데이터 다수는 스탠퍼드 HAI의 연례 AI Index 보고서에 기반합니다. 여기에서는 각 연도판의 핵심 내용과 원문 링크를 연도별로 정리합니다.',
  benchmarkReportArchiveRead: '보고서 원문 읽기',

  // Open source / community open source project detail pages
  osBack: '공식 오픈소스 및 연구로 돌아가기',
  osCommunityBack: '산학 협력 오픈소스 생태계로 돌아가기',
  osProfile: '프로젝트 정보',
  osCommunityProfile: '프로젝트 정보',
  osOwner: '소속',
  osOrg: '기관',
  osOrgType: '분류',
  osCategory: '카테고리',
  osStatus: '상태',
  osFounded: '시작',
  osLanguage: '언어 / 형태',
  osLicense: '라이선스',
  osUpdated: '정보 업데이트',
  osWhatItIs: '무엇인가',
  osAiRelevance: 'AI와의 관계',
  osSingaporeRelevance: '싱가포르와의 관계',
  osMilestones: '주요 마일스톤',
  osResources: '리소스 입구',
  osCommunityRelated: '더 많은 산학 협력 프로젝트',
  osOrgTypeUniversity: '대학 및 연구 기관',
  osOrgTypeCorporateLab: '국제 기업 연구소',
  osOrgTypeStartup: '스타트업',

  // RelatedRail cross-link component
  railRel: '관련:',
  railNoneYet: '아직 연결된 다른 자료가 없습니다.',
  railPeople: '인물',
  railPolicies: '정책',
  railDebates: '국회 토론',
  railLevers: '레버',
  railTimeline: '시점',
  railAnalyses: '관점',
  railMoreDebates: '… 외 {n}건',
  railMoreDebatesInline: '+{n}건의 토론',

  // Startup entity detail page
  startupKindCompany: '회사 / 프로젝트',
  startupKindExit: '엑싯 / 인수 사례',
  startupKindInvestor: '투자 기관',
  startupPositioning: '포지셔닝',
  startupCapitalSignals: '자본 및 시장 신호',
  startupAiRelationHeading: 'AI 연관도',
  startupWhyItMatters: '주목할 이유',
  startupSignalsToTrack: '향후 추적 질문',
  startupSignalsPending: '공개 자본 신호는 보완 예정입니다.',
  startupNote: '비고',
  startupRelatedEntities: '관련 엔티티',
  startupDataNote: '데이터 설명',
  startupTypeLabel: '유형',
  startupVerticalLabel: '분야 / 그룹',
  startupAiRelationLabel: 'AI 연관도',
  startupPublicFunding: '공개 자금 조달',
  startupValuation: '기업 가치',
  startupStatusLabel: '상태',
  startupInvestorsLabel: '투자자',
  startupAcquirerLabel: '인수자',
  startupAmountYear: '금액 / 연도',
  startupTrackRecord: '투자 실적',
  startupFocusLabel: '중점 분야',
  startupUnicornBadge: '유니콘',
  startupBackTo: 'AI 스타트업 생태계로 돌아가기',
  startupNav: 'AI 스타트업',

  // Startups listing page (/startups/)
  startupStatAiCompanies: 'AI 기업 수 (Tracxn 등록)',
  startupStatGlobalRank: '세계 {rank}위',
  startupStatHubRank: 'AI 허브 순위',
  startupStatSeaFundingShare: '동남아 AI 자금 조달 비중',
  startupStatTotalVcRaised: 'VC 총 자금 조달액',
  startupStatUnicorns: '유니콘',
  startupStatGovCommitment: '정부 AI 투자 공약',
  startupUnicornsSectionTitle: '유니콘 및 상장 규모 기업',
  startupByVerticalTitle: '분야별 분류',
  startupExitsSectionTitle: '주요 엑싯 및 인수',
  startupInvestorEcosystemTitle: '투자자 생태계',
  startupRaisedLabel: '투자 유치액',
  startupTrackRecordColon: '투자 실적:',
  startupFocusColon: '중점 분야:',

  // Generic count suffixes / small chrome shared across listing pages
  openProfileCta: '프로필 보기',
  entitiesCountSuffix: '개 엔티티',
  institutionsCountSuffix: '개 기관',
  companiesCountSuffix: '개',
  recordsCountSuffix: '건',
  yearPending: '연도 미정',

  // Generic filter-bar chrome (voices/videos listing pages)
  filterTopicLabel: '주제',
  filterYearLabel: '연도',
  filterSpeakerLabel: '연설자',
  filterSpeakerTypeLabel: '연설자 유형',
  filterAllLabel: '전체',
  filterClearLabel: '필터 초기화',
  filterClearAllLabel: '모든 필터 초기화',
  filterShowingLabel: '표시 중',
  filterResultsSuffix: '건 결과',
  noVideosMatchFilter: '필터 조건에 맞는 영상이 없습니다.',
  noSpeechesMatchFilter: '필터 조건에 맞는 연설문이 없습니다.',

  // Voices listing page (/voices/)
  voicesIntroBlurb: '싱가포르 AI 분야의 핵심 인물과 기관, 그리고 이들의 공식 정보 채널.',
  voicesIntroSubBlurb: '이들의 동향을 추적하여 AI 정책과 전략에 대한 1차 정보를 얻으세요.',
  voicesStatPeople: '핵심 인물',
  voicesStatInstitutions: '핵심 기관',
  voicesStatSpeeches: '공식 연설문',
  voicesStatVideos: 'YouTube 영상',
  voicesKeyPeopleSection: '핵심 인물',
  voicesCoreInstitutionsSection: '핵심 기관',
  voicesMddiSpeechesSection: '공식 AI 관련 연설문',
  voicesYoutubeVideosSection: 'YouTube AI 영상',
  mddiSourceTitle: 'MDDI 공식 웹사이트 원문',

  // Videos listing page (/videos/)
  videosIntroBlurb: '싱가포르 정부 관계자, 학자, 업계 리더가 인공지능에 대해 이야기하는 YouTube 강연과 인터뷰.',
  videosIntroSubBlurb: '영상 카드를 클릭하면 읽기 쉬운 자막, 요약, 관련 영상을 볼 수 있습니다.',
  videosStatTotal: '영상 총수',
  videosStatSpeakers: '연설자',
  videosStatYears: '커버 연도',

  // Voice profile detail page (/voices/[id]/)
  voicePositioningHeading: '포지셔닝',
  voicePoliciesChampionedHeading: '주도 정책 ({count}건)',
  voiceAiVideosHeading: 'AI 영상 ({count}편)',

  // Debate/speech detail page chrome
  sprsHansardOriginal: 'SPRS Hansard 원본 기록',
  fetchedAtColon: '수집일: ',

  viewSource: '소스 코드 보기',
  countSuffix: '장',
  copyrightOpenSource: '소스 코드 MIT 라이선스; 콘텐츠 CC BY 4.0',
};

/** Lookup table from Lang code to its dictionary. Used by `t()` to walk
 *  the fallback chain. Adding a new locale L means: append to LOCALES,
 *  add a fallback chain entry, export an `<L>` dict, and register here. */
const DICTIONARIES: Record<Lang, Partial<Record<keyof typeof zh, string>>> = {
  zh,
  en,
  ja,
  'zh-tw': zhTwDict,
  ko,
};
