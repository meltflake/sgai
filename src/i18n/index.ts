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
  policiesPageTitle: '新加坡 AI 政策库 — 全文档案与时间线 · sgai',
  policiesPageBlurb:
    '新加坡 AI 政策档案库：NAIS 2.0、Model AI Governance Framework、Copyright §244、AI Verify、ASEAN Guide 等核心政策全文与摘要，按战略/治理/法律/部门分类，时间倒序。',
  policiesItemsSuffix: '份',
  policyArchiveSuffix: '政策档案',
  backToPolicies: '返回政策库',
  debatesPageTitle: '国会 AI 焦点',
  blogIndexTitle: '观察',
  aboutPageTitle: '关于本站',
  aboutPageDesc: '关于新加坡 AI 观察——独立维护的新加坡 AI 战略观察平台。研究方法、利益声明、反馈方式。',
  evolutionPageTitle: '政策演进分析',
  evolutionPageDesc: '新加坡 AI 政策演进全景——从 2014 年智慧国家到 2024 年 NAIS 2.0 的战略转型历程。',
  timelinePageTitle: '发展时间线',
  timelinePageDesc: '新加坡 AI 发展时间线：从 2014 年智慧国家到 2027 年国际 AI 奥林匹克，关键里程碑按时间排列。',
  ecosystemPageTitle: '生态地图',
  ecosystemPageDesc: '新加坡 AI 生态地图——政府机构、研究院所、企业与初创公司的完整版图。',
  leversPageTitle: '新加坡国家 AI 抓手图谱 — 6 大跨部委执行管线 · sgai',
  leversPageDesc:
    '新加坡国家级 AI-native 转型，按"AI 引入路径"重新归类 Budget 2026 + 各部委 AI 政策——基建、治理、人才、应用、政府自用、外交六个抓手，每条抓手都跨部委，链接政策原文。',
  investorNotableDeals: '代表交易：',
  startupsPageTitle: '新加坡 AI 创业生态 — 500+ 公司、独角兽、融资、投资人 · sgai',
  startupsPageDesc:
    '新加坡 AI 创业生态完整地图：500+ AI-native / AI-enabled 公司样本、独角兽与上市级公司、按垂直领域分类、退出与并购案例、投资人网络与融资数据。',
  talentPageTitle: '人才培养',
  talentPageDesc: '新加坡 AI 人才培养体系——高校项目、政府培训计划、人才引进政策一览。',
  videosPageTitle: 'AI 视频观点',
  videosPageDesc: '新加坡政府官员、学者和行业领袖关于 AI 战略、治理、人才和产业的 YouTube 演讲与访谈合集。',
  voicesPageTitle: '新加坡 AI 影响力图谱 — 关键人物、机构、MDDI 演讲库 · sgai',
  voicesPageDesc:
    '新加坡 AI 政策关键决策者完整档案：部长、议员、学者、企业家——其国会发言、主导政策、视频观点与官方信息渠道；含 MDDI AI 相关演讲全文检索。',
  opensourcePageTitle: '官方开源与研究',
  opensourcePageDesc: '新加坡政府与官方机构的 AI 开源项目和研究成果汇总——SEA-LION、AI Verify 等。',
  communityOsPageTitle: '产学研开源生态',
  communityOsPageDesc: '新加坡产学研 AI 开源生态——大学、企业实验室、创业公司的开源贡献全景。',
  benchmarkingPageTitle: '国际对标',
  benchmarkingPageDesc: '新加坡 AI 战略国际对标——与美国、英国、中国、欧盟等主要经济体的对比分析。',
  legalAiPageTitle: '新加坡 AI 法律框架',
  legalAiPageDesc:
    '新加坡 AI 法律框架——"训练宽松 + 输出严管"双轨：Copyright §244 全球最宽松的 AI 训练例外，配合 OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill 四件套输出严管。',
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
  fpDirectorySection: '全站内容导览',
  fpDirectoryBlurb: '12 个持续更新的数据域，每张卡片都显示最新收录。',
  fpLatestPrefix: '最新',
  fpEntriesSuffix: '条记录',
  fpStartHereSection: '理解这套框架',

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
  fullTextZh: '完整译文（中文）',
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

  policiesPageTitle: 'Singapore AI Policy Library — full archive & timeline · sgai',
  policiesPageBlurb:
    'Singapore AI policy archive: NAIS 2.0, Model AI Governance Framework, Copyright §244, AI Verify, ASEAN Guide and other core documents — full text and digests, grouped by strategy / governance / law / sector, newest first.',
  policiesItemsSuffix: 'items',
  policyArchiveSuffix: 'Policy Archive',
  backToPolicies: 'Back to Policy Library',
  debatesPageTitle: 'Parliamentary AI Focus',
  blogIndexTitle: 'Opinion',
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
  leversPageTitle: 'Singapore National AI Levers — 6 cross-ministry pipelines · sgai',
  leversPageDesc:
    "Singapore's national AI-native transformation re-classified by AI-injection path — infrastructure, governance, talent, applications, government self-use, and diplomacy. Six cross-ministry levers, with policy-source links from Budget 2026 and every ministry.",
  investorNotableDeals: 'Notable AI deals: ',
  startupsPageTitle: 'Singapore AI Startup Ecosystem — 500+ companies, unicorns, funding, VCs · sgai',
  startupsPageDesc:
    "Singapore's AI startup ecosystem map: 500+ AI-native / AI-enabled company samples, unicorns and listed-scale companies, vertical breakdowns, exits and acquisitions, investor network, and funding data.",
  talentPageTitle: 'Talent Pipeline',
  talentPageDesc:
    "Singapore's AI talent pipeline — university programmes, government-led training schemes, and talent attraction policies in one view.",
  videosPageTitle: 'AI Video Library',
  videosPageDesc:
    'A curated collection of YouTube talks and interviews from Singapore government officials, academics, and industry leaders on AI strategy, governance, talent, and applications.',
  voicesPageTitle: 'Singapore AI Influence Map — Ministers, MPs, Academics, MDDI speeches · sgai',
  voicesPageDesc:
    "Singapore's AI policy decision-makers in one map: ministers, MPs, academics, and industry leaders — their parliamentary speeches, policies championed, video positions, and official channels; full MDDI AI speech archive.",
  opensourcePageTitle: 'Official Open Source & Research',
  opensourcePageDesc:
    'Open-source projects and research output from the Singapore government and official agencies — SEA-LION, AI Verify, and more.',
  communityOsPageTitle: 'Community Open Source',
  communityOsPageDesc:
    "Singapore's community AI open-source ecosystem — universities, international corporate labs, and startups contributing to open source.",
  benchmarkingPageTitle: 'International Benchmarks',
  benchmarkingPageDesc:
    "International benchmarks for Singapore's AI strategy — comparison with the United States, the United Kingdom, China, the EU and other major economies.",
  legalAiPageTitle: 'AI Legal Framework',
  legalAiPageDesc:
    "Singapore's AI legal framework — 'permissive on training, strict on outputs' dual track: Copyright §244 (one of the world's most permissive AI training exceptions) paired with the OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill quartet on outputs.",
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
  fpDirectorySection: 'Browse the whole site',
  fpDirectoryBlurb: '12 continuously updated datasets — each card shows its latest addition.',
  fpLatestPrefix: 'Latest',
  fpEntriesSuffix: 'entries',
  fpStartHereSection: 'Understand the framework',

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

  fullTextZh: 'Chinese Translation',
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
  policiesPageTitle: 'シンガポール AI 政策ライブラリ — 全文アーカイブとタイムライン · sgai',
  policiesPageBlurb:
    'シンガポール AI 政策アーカイブ：NAIS 2.0、Model AI Governance Framework、Copyright §244、AI Verify、ASEAN Guide 等の中核文書の全文と要約。戦略・ガバナンス・法律・省庁別に分類、時系列逆順。',
  policiesItemsSuffix: '件',
  policyArchiveSuffix: '政策アーカイブ',
  backToPolicies: '政策ライブラリに戻る',
  debatesPageTitle: '議会 AI フォーカス',
  blogIndexTitle: 'コラム',
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
  leversPageTitle: 'シンガポール国家 AI レバー — 6 つの省庁横断パイプライン · sgai',
  leversPageDesc:
    'シンガポールの国家レベル AI ネイティブ転換を「AI 導入経路」で再分類——インフラ・ガバナンス・人材・応用・政府自身の活用・外交の6つのレバー。Budget 2026 と各省庁政策の原典リンク付き。',
  investorNotableDeals: '主な AI 取引：',
  startupsPageTitle: 'シンガポール AI スタートアップエコシステム — 500+ 社、ユニコーン、資金、投資家 · sgai',
  startupsPageDesc:
    'シンガポール AI スタートアップ生態地図：500+ の AI ネイティブ / AI 活用企業サンプル、ユニコーンと上場規模企業、バーティカル分類、エグジットと M&A 事例、投資家ネットワークと資金調達データ。',
  talentPageTitle: '人材育成',
  talentPageDesc: 'シンガポール AI 人材育成体系——大学プログラム、政府研修計画、人材招致政策の一覧。',
  videosPageTitle: 'AI ビデオ・オピニオン',
  videosPageDesc:
    'シンガポール政府高官、学者、業界リーダーによる AI 戦略・ガバナンス・人材・産業に関する YouTube スピーチとインタビュー集。',
  voicesPageTitle: 'シンガポール AI インフルエンスマップ — 大臣・議員・学者・MDDI スピーチ · sgai',
  voicesPageDesc:
    'シンガポール AI 政策の意思決定者を一望：大臣、議員、学者、産業リーダー——議会発言、主導政策、動画ポジション、公式チャネル。MDDI AI 関連スピーチ全文検索付き。',
  opensourcePageTitle: '公式オープンソースと研究',
  opensourcePageDesc:
    'シンガポール政府と公式機関の AI オープンソースプロジェクトおよび研究成果——SEA-LION、AI Verify 等。',
  communityOsPageTitle: '産学研オープンソースエコシステム',
  communityOsPageDesc:
    'シンガポール産学研 AI オープンソースエコシステム——大学、企業ラボ、スタートアップのオープンソース貢献の全体像。',
  benchmarkingPageTitle: '国際ベンチマーク',
  benchmarkingPageDesc: 'シンガポール AI 戦略の国際ベンチマーク——米国、英国、中国、EU 等の主要経済圏との比較分析。',
  legalAiPageTitle: 'シンガポール AI 法的フレームワーク',
  legalAiPageDesc:
    'シンガポール AI 法的フレームワーク——「学習には寛容、出力には厳格」のデュアルトラック：著作権法§244（世界で最も寛容な AI 学習例外の一つ）と OCHA + 選挙法改正 + 刑法改正 + オンライン安全法の四法による出力規制。',
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
  fpDirectorySection: 'サイト全体を見る',
  fpDirectoryBlurb: '継続的に更新される 12 のデータ領域。各カードに最新の収録を表示します。',
  fpLatestPrefix: '最新',
  fpEntriesSuffix: '件',
  fpStartHereSection: 'フレームワークを理解する',

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

  fullTextZh: '完全翻訳（中国語）',
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
  policiesPageTitle: '싱가포르 AI 정책 라이브러리 — 전체 아카이브와 타임라인 · sgai',
  policiesPageBlurb:
    '싱가포르 AI 정책 아카이브: NAIS 2.0, Model AI Governance Framework, Copyright §244, AI Verify, ASEAN Guide 등 핵심 문서의 전문과 요약. 전략·거버넌스·법률·부처별 분류, 시간 역순.',
  policiesItemsSuffix: '부',
  policyArchiveSuffix: '정책 아카이브',
  backToPolicies: '정책 라이브러리로 돌아가기',
  debatesPageTitle: '국회 AI 초점',
  blogIndexTitle: '컬럼',
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
  leversPageTitle: '싱가포르 국가 AI 레버 — 6개 부처 횡단 실행 파이프라인 · sgai',
  leversPageDesc:
    '싱가포르의 국가급 AI-native 전환을 「AI 도입 경로」로 재분류 — 기반시설, 거버넌스, 인재, 애플리케이션, 정부 자체 사용, 외교의 6개 레버. Budget 2026 및 각 부처 정책 원문 링크 포함.',
  investorNotableDeals: '주요 AI 거래: ',
  startupsPageTitle: '싱가포르 AI 스타트업 생태계 — 500+ 기업·유니콘·자금·투자자 · sgai',
  startupsPageDesc:
    '싱가포르 AI 스타트업 생태계 지도: 500+ AI-native / AI-enabled 기업 샘플, 유니콘과 상장 규모 기업, 수직 분야 분류, 엑싯과 인수 사례, 투자자 네트워크와 자금 조달 데이터.',
  talentPageTitle: '인재 양성',
  talentPageDesc: '싱가포르 AI 인재 양성 체계 — 대학 프로그램, 정부 교육 계획, 인재 유입 정책 개요입니다.',
  videosPageTitle: 'AI 영상 인사이트',
  videosPageDesc:
    '싱가포르 정부 관계자, 학자, 업계 지도자의 AI 전략, 거버넌스, 인재 및 산업에 관한 YouTube 강연 및 인터뷰 모음입니다.',
  voicesPageTitle: '싱가포르 AI 영향력 지도 — 장관·국회의원·학자·MDDI 연설 · sgai',
  voicesPageDesc:
    '싱가포르 AI 정책 의사결정자를 한 눈에: 장관, 국회의원, 학자, 산업 리더 — 국회 발언, 주도 정책, 영상 입장, 공식 채널. MDDI AI 관련 연설 전문 검색 포함.',
  opensourcePageTitle: '공식 오픈소스 및 연구',
  opensourcePageDesc:
    '싱가포르 정부 및 공식 기관의 AI 오픈소스 프로젝트 및 연구 성과 요약 — SEA-LION, AI Verify 등입니다.',
  communityOsPageTitle: '산학 협력 오픈소스 생태계',
  communityOsPageDesc:
    '싱가포르 산학 협력 AI 오픈소스 생태계 — 대학, 기업 실험실, 스타트업의 오픈소스 기여 전망입니다.',
  benchmarkingPageTitle: '국제 벤치마크',
  benchmarkingPageDesc: '싱가포르 AI 전략 국제 벤치마크 — 미국, 영국, 중국, EU 등 주요 경제체와의 비교 분석입니다.',
  legalAiPageTitle: '싱가포르 AI 법적 프레임워크',
  legalAiPageDesc:
    '싱가포르 AI 법적 프레임워크——「훈련 관대 + 출력 엄격 관리」이중 트랙: Copyright §244는 전 세계 최관대 AI 훈련 예외이며, OCHA + Elections Bill + Criminal Law Bill + Online Safety Bill 4개 항목의 출력 엄격 관리를 함께 시행합니다.',
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
  fpDirectorySection: '사이트 전체 보기',
  fpDirectoryBlurb: '지속적으로 업데이트되는 12개 데이터 영역. 각 카드에 최신 수록을 표시합니다.',
  fpLatestPrefix: '최신',
  fpEntriesSuffix: '건',
  fpStartHereSection: '프레임워크 이해하기',

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

  fullTextZh: '완전 번역본(중문)',
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
