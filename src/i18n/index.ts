// i18n core (v0.6.0).
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
// To add a new locale L:
//   1. Add 'L' to the Lang union and LOCALES array.
//   2. Add an `<L>` dictionary export below (mirroring `zh`'s keys).
//   3. Backfill `titleL` / `descriptionL` / etc. on user-visible data
//      fields you want translated (otherwise pickLocalized falls back
//      through FALLBACK_CHAINS).
//   4. Add a fallback chain entry for L if you want a different chain
//      than [L, DEFAULT_LOCALE].
//   5. Run `npm run check:i18n -- --lang L --root dist/L` to verify.

export type Lang = 'zh' | 'en' | 'ja';

export const LOCALES: Lang[] = ['zh', 'en', 'ja'];

/** Routing default: this locale's URLs live at the bare root (no prefix). */
export const ROUTE_DEFAULT_LOCALE: Lang = 'en';

/** Content default: this locale's value is in bare data fields. */
export const DEFAULT_LOCALE: Lang = 'zh';

/** Non-default routing locales — used by [lang] dynamic routes' getStaticPaths. */
export const NON_DEFAULT_ROUTE_LOCALES = LOCALES.filter((l) => l !== ROUTE_DEFAULT_LOCALE);

/** JSON-LD / schema.org inLanguage values per locale. */
export const IN_LANGUAGES: Record<Lang, string> = { zh: 'zh-CN', en: 'en', ja: 'ja' };

/** Per-locale fallback chain. Looked up in order; the first non-empty
 *  hit wins. Always ends with `DEFAULT_LOCALE` (the bare-field locale).
 *  ja falls back to en before zh: Japanese readers' English literacy is
 *  generally higher than their Chinese literacy. */
const FALLBACK_CHAINS: Record<Lang, Lang[]> = {
  zh: ['zh'],
  en: ['en', 'zh'],
  ja: ['ja', 'en', 'zh'],
};

/** Capitalize first char for sibling-field naming.
 *  zh → '' (uses bare `key`), en → 'En', ja → 'Ja', ... */
function siblingSuffix(lang: Lang): string {
  if (lang === DEFAULT_LOCALE) return '';
  return lang.charAt(0).toUpperCase() + lang.slice(1);
}

/** Read locale from a URL pathname. /zh/foo → 'zh', /foo → 'en'. */
export function getLangFromPath(pathname: string): Lang {
  const seg = pathname.replace(/^\/+/, '').split('/')[0] as Lang;
  return LOCALES.includes(seg) && seg !== ROUTE_DEFAULT_LOCALE ? seg : ROUTE_DEFAULT_LOCALE;
}

/** Return URL prefix for a locale. en → '', zh → '/zh'. */
export function localePrefix(lang: Lang): string {
  return lang === ROUTE_DEFAULT_LOCALE ? '' : `/${lang}`;
}

/** Build a localized href. localizedHref('/policies/', 'en') → '/policies/'.
 *  localizedHref('/policies/', 'zh') → '/zh/policies/'. */
export function localizedHref(path: string, lang: Lang): string {
  if (!path.startsWith('/')) path = '/' + path;
  if (lang === ROUTE_DEFAULT_LOCALE) return path;
  const prefix = `/${lang}`;
  if (path === prefix || path.startsWith(prefix + '/')) return path;
  return prefix + path;
}

/** Strip route-locale prefix to recover the bare (route-default) path.
 *  unprefixed('/zh/policies/') → '/policies/'. */
export function unprefixed(path: string): string {
  for (const lang of LOCALES) {
    if (lang === ROUTE_DEFAULT_LOCALE) continue;
    const prefix = `/${lang}`;
    if (path === prefix || path === prefix + '/') return '/';
    if (path.startsWith(prefix + '/')) return path.slice(prefix.length);
  }
  return path;
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
      if (v != null && v !== '') return v as string;
    }
    return r[zhKey] as string | null | undefined;
  }

  // Shape A: (record, baseKey, lang)
  const lang = enKeyOrLang as Lang;
  const baseKey = baseOrZhKey;
  for (const candidate of FALLBACK_CHAINS[lang] || [lang, DEFAULT_LOCALE]) {
    const key = candidate === DEFAULT_LOCALE ? baseKey : `${baseKey}${siblingSuffix(candidate)}`;
    const v = r[key];
    if (v != null && v !== '') return v as string;
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
      // The default-locale label is zh; only use it if it's Latin-only.
      if (ch.label && !/[一-鿿]/.test(ch.label)) return ch.label;
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
 *  for the target lang, returning the first non-empty hit. */
export function t(lang: Lang, key: keyof typeof zh): string {
  for (const candidate of FALLBACK_CHAINS[lang] || [lang, DEFAULT_LOCALE]) {
    const dict = DICTIONARIES[candidate];
    const value = dict?.[key];
    if (typeof value === 'string' && value !== '') return value;
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
  searchFallbackMessage: '搜索索引尚未构建。请运行 npm run build 后再试，或访问已部署的 sgai.md 使用搜索。',
  loadMore: '加载更多',
  readMore: '阅读全文',
  backTo: '返回',
  back: '返回',
  related: '关联',
  relatedReading: '相关阅读',
  source: '来源',
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
  policiesPageTitle: 'AI 政策库',
  policiesPageBlurb: '新加坡核心 AI 相关政策文档汇编，按分类整理，每类按时间倒序排列。',
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
  leversPageTitle: '国家 AI 抓手图谱',
  leversPageDesc:
    '新加坡国家级 AI-native 转型不能按部门理解，要按"AI 引入路径"理解：基建、治理、人才、应用、政府自用、外交六个抓手，跨部委的完整执行管线。',
  startupsPageTitle: 'AI 创业生态',
  startupsPageDesc: '新加坡 AI 创业与相邻生态——650+ 相关样本、融资数据、独角兽、垂直领域与投资人一览。',
  talentPageTitle: '人才培养',
  talentPageDesc: '新加坡 AI 人才培养体系——高校项目、政府培训计划、人才引进政策一览。',
  videosPageTitle: 'AI 视频观点',
  videosPageDesc: '新加坡政府官员、学者和行业领袖关于 AI 战略、治理、人才和产业的 YouTube 演讲与访谈合集。',
  voicesPageTitle: 'AI 影响力图谱',
  voicesPageDesc: '新加坡 AI 领域关键人物与核心机构的官方信息渠道，及 MDDI AI 相关演讲稿全文链接。',
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
  searchFallbackMessage: 'Search index not yet built. Run npm run build first, or visit the deployed sgai.md.',
  loadMore: 'Load more',
  readMore: 'Read more',
  backTo: 'Back to',
  back: 'Back',
  related: 'Related',
  relatedReading: 'Related Reading',
  source: 'Source',
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

  policiesPageTitle: 'AI Policy Library',
  policiesPageBlurb: 'Singapore’s core AI policy documents, grouped by category, newest first within each.',
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
  leversPageTitle: 'National AI Levers',
  leversPageDesc:
    "Singapore's national-scale AI-native transformation cannot be read by ministry — read it by AI-injection path: infrastructure, governance, talent, applications, government self-use, and diplomacy. Six levers spanning multiple ministries form the full execution pipeline.",
  startupsPageTitle: 'AI Startup Ecosystem',
  startupsPageDesc:
    "Singapore's AI startup and adjacent ecosystem — 650+ related samples, funding data, unicorns, verticals, and investors.",
  talentPageTitle: 'Talent Pipeline',
  talentPageDesc:
    "Singapore's AI talent pipeline — university programmes, government-led training schemes, and talent attraction policies in one view.",
  videosPageTitle: 'AI Video Library',
  videosPageDesc:
    'A curated collection of YouTube talks and interviews from Singapore government officials, academics, and industry leaders on AI strategy, governance, talent, and applications.',
  voicesPageTitle: 'AI Influence Map',
  voicesPageDesc:
    "Singapore's key AI people and core institutions, their official communication channels, and the full archive of MDDI AI-related speeches.",
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
  searchFallbackMessage:
    '検索インデックスはまだ構築されていません。npm run build を実行した後にお試しいただくか、デプロイされた sgai.md にアクセスして検索を使用してください。',
  loadMore: 'もっと読む',
  readMore: '全文を読む',
  backTo: '戻る',
  back: '戻る',
  related: '関連',
  relatedReading: '関連記事',
  source: '出典',
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
  policiesPageTitle: 'AI 政策ライブラリ',
  policiesPageBlurb:
    'シンガポール AI コア関連政策ドキュメントの集約、カテゴリ別に整理され、各カテゴリは時系列の逆順で並んでいます。',
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
  leversPageTitle: '国家 AI レバーマップ',
  leversPageDesc:
    'シンガポールの国家レベル AI ネイティブ転換は、省庁別ではなく「AI 導入経路」で理解すべきです：インフラ・ガバナンス・人材・応用・政府自身の活用・外交という6つのレバーが省庁横断で構成する実行パイプライン。',
  startupsPageTitle: 'AI スタートアップエコシステム',
  startupsPageDesc:
    'シンガポール AI スタートアップと隣接エコシステム——650+ 関連サンプル、資金調達データ、ユニコーン、バーティカル分野と投資家一覧。',
  talentPageTitle: '人材育成',
  talentPageDesc: 'シンガポール AI 人材育成体系——大学プログラム、政府研修計画、人材招致政策の一覧。',
  videosPageTitle: 'AI ビデオ・オピニオン',
  videosPageDesc:
    'シンガポール政府高官、学者、業界リーダーによる AI 戦略・ガバナンス・人材・産業に関する YouTube スピーチとインタビュー集。',
  voicesPageTitle: 'AI インフルエンスマップ',
  voicesPageDesc:
    'シンガポール AI 分野のキーパーソンと中核機関の公式情報チャネル、および MDDI AI 関連スピーチ全文リンク。',
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

/** Lookup table from Lang code to its dictionary. Used by `t()` to walk
 *  the fallback chain. Adding a new locale L means: append to LOCALES,
 *  add a fallback chain entry, export an `<L>` dict, and register here. */
const DICTIONARIES: Record<Lang, Partial<Record<keyof typeof zh, string>>> = {
  zh,
  en,
  ja,
};
