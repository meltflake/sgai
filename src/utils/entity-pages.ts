import slugify from 'limax';

import {
  benchmarkCases,
  regions,
  regionDetails,
  type BenchmarkAnalysisSource,
  type BenchmarkCase,
  type RegionDetail,
  type RegionSummary,
} from '~/data/benchmarking';
import { sections as legalSections, type LegalItem, type LegalSection } from '~/data/legal-ai';
import { levers, type Lever, type LeverGroup, type LeverItem } from '~/data/levers';
import { ecosystemCategories, type EcosystemCategory, type EcosystemEntity } from '~/data/ecosystem';
import {
  exits,
  investors,
  unicorns,
  verticals,
  type Exit,
  type Investor,
  type Startup,
  type Unicorn,
  type Vertical,
} from '~/data/startups';

export function toSeoSlug(value: string): string {
  const slug = slugify(value).replace(/^\/+|\/+$/g, '');
  return slug || 'item';
}

export function regionSlug(region: Pick<RegionSummary, 'name' | 'nameEn'>): string {
  return toSeoSlug(region.nameEn || region.name);
}

function sameRegion(a: Pick<RegionSummary, 'name' | 'nameEn'>, b: Pick<RegionDetail, 'name' | 'nameEn'>): boolean {
  return (a.nameEn || a.name).toLowerCase() === (b.nameEn || b.name).toLowerCase();
}

export interface RegionPage {
  slug: string;
  summary: RegionSummary;
  detail?: RegionDetail;
}

export const regionPages: RegionPage[] = regions.map((summary) => ({
  slug: regionSlug(summary),
  summary,
  detail: regionDetails.find((detail) => sameRegion(summary, detail)),
}));

export function benchmarkCaseSlug(benchmarkCase: Pick<BenchmarkCase, 'id' | 'name' | 'nameEn'>): string {
  return benchmarkCase.id || toSeoSlug(benchmarkCase.nameEn || benchmarkCase.name);
}

export interface BenchmarkCasePage {
  kind: 'case';
  slug: string;
  caseItem: BenchmarkCase;
}

export const benchmarkCasePages: BenchmarkCasePage[] = benchmarkCases.map((caseItem) => ({
  kind: 'case',
  slug: benchmarkCaseSlug(caseItem),
  caseItem,
}));

export type BenchmarkDrilldownKind = 'summary' | 'strategy' | 'investment' | 'initiative' | 'body';

export interface BenchmarkDrilldownFact {
  label: string;
  labelEn?: string;
  value: string;
  valueEn?: string;
}

export interface BenchmarkDrilldownPage {
  kind: 'drilldown';
  slug: string;
  localId: string;
  drilldownKind: BenchmarkDrilldownKind;
  region: RegionPage;
  category: string;
  categoryEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  body: string;
  bodyEn: string;
  facts: BenchmarkDrilldownFact[];
  sources: string[];
  sourcesEn?: string[];
  /** True until a `drilldownEnrichments[localId]` entry exists. Drives
   *  noindex on the rendered page so unfilled stubs don't get indexed. */
  analysisPending: boolean;
  /** Structured sources accompanying an enrichment. When present these
   *  render alongside (or instead of) the inherited region-level
   *  string-only sources list. */
  analysisSources?: BenchmarkAnalysisSource[];
}

function benchmarkDrilldownSlug(regionPage: RegionPage, localId: string, title: string): string {
  if (['core-strategy', 'investment-overview', 'governance-model', 'comparative-strength'].includes(localId)) {
    return toSeoSlug(`${regionPage.slug} ${localId}`);
  }

  return toSeoSlug(`${regionPage.slug} ${localId} ${title}`);
}

function buildBenchmarkDrilldownPages(): BenchmarkDrilldownPage[] {
  const pages: BenchmarkDrilldownPage[] = [];

  function addPage(page: Omit<BenchmarkDrilldownPage, 'kind' | 'slug' | 'analysisPending' | 'analysisSources'>): void {
    const enrichment = page.region.detail?.drilldownEnrichments?.[page.localId];
    const enrichedBody = enrichment?.analysis ?? page.body;
    const enrichedBodyEn = enrichment?.analysisEn ?? enrichment?.analysis ?? page.bodyEn;
    pages.push({
      kind: 'drilldown',
      slug: benchmarkDrilldownSlug(page.region, page.localId, page.titleEn || page.title),
      ...page,
      body: enrichedBody,
      bodyEn: enrichedBodyEn,
      analysisPending: !enrichment,
      analysisSources: enrichment?.sources,
    });
  }

  for (const region of regionPages) {
    const { summary, detail } = region;
    const regionNameEn = summary.nameEn || summary.name;
    const sources = detail?.sources || [];
    const sourcesEn = detail?.sourcesEn;

    addPage({
      localId: 'core-strategy',
      drilldownKind: 'summary',
      region,
      category: '地区概览',
      categoryEn: 'Region overview',
      title: `${summary.name} 核心战略`,
      titleEn: `${regionNameEn} Core Strategy`,
      description: `${summary.name} 的核心 AI 战略是 ${summary.strategy}，当前公开年份为 ${summary.strategyYear}。`,
      descriptionEn: `${regionNameEn}'s core AI strategy is ${summary.strategyEn || summary.strategy}, with the public year marked as ${summary.strategyYear}.`,
      body: detail?.strategies.length
        ? `${summary.name} 的战略栈由 ${detail.strategies.map((item) => item.name).join('、')} 等文件和政策组成。这个下钻页用于把地区页顶部的“核心战略”卡片从摘要入口变成可继续扩写的档案。`
        : `${summary.name} 目前只有总览层面的战略摘要。后续可在数据文件中补充完整 RegionDetail，页面会自动展开到具体战略文件。`,
      bodyEn: detail?.strategies.length
        ? `${regionNameEn}'s strategy stack includes ${detail.strategies
            .map((item) => item.nameEn || item.name)
            .join(
              ', '
            )} and related policy documents. This drilldown page turns the region-level core-strategy card into an expandable profile.`
        : `${regionNameEn} currently has only an overview-level strategy summary. Add a full RegionDetail record later and this page will automatically expand into concrete strategy documents.`,
      facts: [
        {
          label: '战略',
          labelEn: 'Strategy',
          value: summary.strategy,
          valueEn: summary.strategyEn || summary.strategy,
        },
        { label: '年份', labelEn: 'Year', value: summary.strategyYear, valueEn: summary.strategyYear },
        { label: '地区', labelEn: 'Region', value: summary.name, valueEn: regionNameEn },
      ],
      sources,
      sourcesEn,
    });

    addPage({
      localId: 'investment-overview',
      drilldownKind: 'summary',
      region,
      category: '地区概览',
      categoryEn: 'Region overview',
      title: `${summary.name} 投资规模`,
      titleEn: `${regionNameEn} Investment Scale`,
      description: `${summary.name} 的 AI 投资口径为：${summary.investment}。`,
      descriptionEn: `${regionNameEn}'s AI investment signal is: ${summary.investmentEn || summary.investment}.`,
      body: detail?.investment.length
        ? `${summary.name} 的投资与资源项包括 ${detail.investment.map((item) => item.item).join('、')}。这页汇总地区层面的资金、算力和资源配置，后续可继续补官方预算、时间线和执行进度。`
        : `${summary.name} 目前只有总览层面的投资摘要。后续可补充具体投资项目。`,
      bodyEn: detail?.investment.length
        ? `${regionNameEn}'s investment and resource items include ${detail.investment
            .map((item) => item.itemEn || item.item)
            .join(
              ', '
            )}. This page groups regional capital, compute, and resource allocation signals for future enrichment.`
        : `${regionNameEn} currently has only an overview-level investment summary. Concrete investment items can be added later.`,
      facts: [
        {
          label: '投资口径',
          labelEn: 'Investment signal',
          value: summary.investment,
          valueEn: summary.investmentEn || summary.investment,
        },
        {
          label: '项目数',
          labelEn: 'Tracked items',
          value: String(detail?.investment.length || 0),
          valueEn: String(detail?.investment.length || 0),
        },
        { label: '地区', labelEn: 'Region', value: summary.name, valueEn: regionNameEn },
      ],
      sources,
      sourcesEn,
    });

    addPage({
      localId: 'governance-model',
      drilldownKind: 'summary',
      region,
      category: '地区概览',
      categoryEn: 'Region overview',
      title: `${summary.name} 治理模式`,
      titleEn: `${regionNameEn} Governance Model`,
      description: `${summary.name} 的 AI 治理模式可概括为：${summary.governance}。`,
      descriptionEn: `${regionNameEn}'s AI governance model can be summarised as: ${summary.governanceEn || summary.governance}.`,
      body:
        detail?.governance ||
        `${summary.name} 的治理模式目前只保留摘要口径。后续可继续补充主管机关、法律状态、沙盒机制和行业指引。`,
      bodyEn:
        detail?.governanceEn ||
        detail?.governance ||
        `${regionNameEn}'s governance model currently has only the summary signal. Future updates can add agencies, legal status, sandbox mechanisms, and sectoral guidance.`,
      facts: [
        {
          label: '治理模式',
          labelEn: 'Governance model',
          value: summary.governance,
          valueEn: summary.governanceEn || summary.governance,
        },
        { label: '战略年份', labelEn: 'Strategy year', value: summary.strategyYear, valueEn: summary.strategyYear },
        { label: '地区', labelEn: 'Region', value: summary.name, valueEn: regionNameEn },
      ],
      sources,
      sourcesEn,
    });

    addPage({
      localId: 'comparative-strength',
      drilldownKind: 'summary',
      region,
      category: '地区概览',
      categoryEn: 'Region overview',
      title: `${summary.name} 核心优势`,
      titleEn: `${regionNameEn} Core Strength`,
      description: `${summary.name} 相对新加坡的核心优势是：${summary.strength}。`,
      descriptionEn: `${regionNameEn}'s comparative strength versus Singapore is: ${summary.strengthEn || summary.strength}.`,
      body: detail?.strengths.length
        ? `${summary.name} 相对新加坡的优势包括 ${detail.strengths.join('；')}。这个页面用于沉淀优势判断，后续可补充指标和反例。`
        : `${summary.name} 目前只有总览层面的优势摘要。后续可继续补充详细优势、短板和指标依据。`,
      bodyEn: detail?.strengthsEn?.length
        ? `${regionNameEn}'s strengths versus Singapore include ${detail.strengthsEn.join('; ')}. This page stores the comparative-strength judgment and can later gain metrics and counterexamples.`
        : detail?.strengths.length
          ? `${regionNameEn}'s strengths versus Singapore include ${detail.strengths.join('; ')}. This page stores the comparative-strength judgment and can later gain metrics and counterexamples.`
          : `${regionNameEn} currently has only an overview-level strength summary. Future updates can add detailed strengths, weaknesses, and metric evidence.`,
      facts: [
        {
          label: '核心优势',
          labelEn: 'Core strength',
          value: summary.strength,
          valueEn: summary.strengthEn || summary.strength,
        },
        { label: 'AI 排名', labelEn: 'AI ranking', value: summary.aiRanking || '—', valueEn: summary.aiRanking || '—' },
        { label: '地区', labelEn: 'Region', value: summary.name, valueEn: regionNameEn },
      ],
      sources,
      sourcesEn,
    });

    if (!detail) continue;

    detail.strategies.forEach((strategy, index) => {
      addPage({
        localId: `strategy-${index + 1}`,
        drilldownKind: 'strategy',
        region,
        category: '核心战略',
        categoryEn: 'Core strategy',
        title: strategy.name,
        titleEn: strategy.nameEn || strategy.name,
        description: strategy.description,
        descriptionEn: strategy.descriptionEn || strategy.description,
        body: `${strategy.name} 是 ${detail.name} AI 政策栈中的一项战略 / 政策文件，公开年份为 ${strategy.year}。当前档案先保留公开描述，后续可补原文链接、政策目标、执行机构和最新进展。`,
        bodyEn: `${strategy.nameEn || strategy.name} is a strategy or policy document in ${detail.nameEn || detail.name}'s AI policy stack, with public year ${strategy.year}. This profile currently preserves the public description and can later add source links, policy targets, executing bodies, and progress updates.`,
        facts: [
          { label: '年份', labelEn: 'Year', value: strategy.year, valueEn: strategy.year },
          { label: '地区', labelEn: 'Region', value: detail.name, valueEn: detail.nameEn || detail.name },
          { label: '类型', labelEn: 'Type', value: '战略 / 政策文件', valueEn: 'Strategy / policy document' },
        ],
        sources: detail.sources,
        sourcesEn: detail.sourcesEn,
      });
    });

    detail.investment.forEach((investment, index) => {
      addPage({
        localId: `investment-${index + 1}`,
        drilldownKind: 'investment',
        region,
        category: '投资与资源',
        categoryEn: 'Investment and resources',
        title: investment.item,
        titleEn: investment.itemEn || investment.item,
        description: `${investment.amount} — ${investment.note}`,
        descriptionEn: `${investment.amountEn || investment.amount} — ${investment.noteEn || investment.note}`,
        body: `${investment.item} 是 ${detail.name} AI 投资与资源配置中的一项公开记录。当前口径为 ${investment.amount}，备注为“${investment.note}”。后续可继续补预算来源、执行机构、项目周期和实际支出。`,
        bodyEn: `${investment.itemEn || investment.item} is a public investment or resource-allocation record in ${detail.nameEn || detail.name}'s AI strategy. The current amount signal is ${investment.amountEn || investment.amount}, with note: “${investment.noteEn || investment.note}”. Future updates can add budget source, executing agency, project period, and actual spending.`,
        facts: [
          {
            label: '金额',
            labelEn: 'Amount',
            value: investment.amount,
            valueEn: investment.amountEn || investment.amount,
          },
          { label: '备注', labelEn: 'Note', value: investment.note, valueEn: investment.noteEn || investment.note },
          { label: '地区', labelEn: 'Region', value: detail.name, valueEn: detail.nameEn || detail.name },
        ],
        sources: detail.sources,
        sourcesEn: detail.sourcesEn,
      });
    });

    detail.keyInitiatives.forEach((initiative, index) => {
      const initiativeEn = detail.keyInitiativesEn?.[index] || initiative;
      addPage({
        localId: `initiative-${index + 1}`,
        drilldownKind: 'initiative',
        region,
        category: '关键举措',
        categoryEn: 'Key initiative',
        title: initiative,
        titleEn: initiativeEn,
        description: `${initiative} 是 ${detail.name} AI 战略中的关键举措之一。`,
        descriptionEn: `${initiativeEn} is one of the key initiatives in ${detail.nameEn || detail.name}'s AI strategy.`,
        body: `${initiative} 目前作为地区页关键举措收录。这个档案页用于后续补充项目背景、牵头机构、执行状态、指标和相关来源。`,
        bodyEn: `${initiativeEn} is currently tracked as a key initiative on the region page. This profile is ready for project background, lead agency, execution status, metrics, and source links.`,
        facts: [
          { label: '类型', labelEn: 'Type', value: '关键举措', valueEn: 'Key initiative' },
          { label: '地区', labelEn: 'Region', value: detail.name, valueEn: detail.nameEn || detail.name },
          { label: '来源层级', labelEn: 'Source layer', value: '地区档案', valueEn: 'Region profile' },
        ],
        sources: detail.sources,
        sourcesEn: detail.sourcesEn,
      });
    });

    detail.keyBodies.forEach((body, index) => {
      addPage({
        localId: `body-${index + 1}`,
        drilldownKind: 'body',
        region,
        category: '关键机构',
        categoryEn: 'Key body',
        title: body.name,
        titleEn: body.nameEn || body.name,
        description: body.role,
        descriptionEn: body.roleEn || body.role,
        body: `${body.name} 在 ${detail.name} AI 生态中的角色是：${body.role}。这个机构档案后续可继续补负责人、官网、政策权限和相关项目。`,
        bodyEn: `${body.nameEn || body.name}'s role in ${detail.nameEn || detail.name}'s AI ecosystem is: ${body.roleEn || body.role}. This institutional profile can later add leadership, official website, policy authority, and related projects.`,
        facts: [
          { label: '角色', labelEn: 'Role', value: body.role, valueEn: body.roleEn || body.role },
          { label: '地区', labelEn: 'Region', value: detail.name, valueEn: detail.nameEn || detail.name },
          { label: '类型', labelEn: 'Type', value: '关键机构', valueEn: 'Key body' },
        ],
        sources: detail.sources,
        sourcesEn: detail.sourcesEn,
      });
    });
  }

  return pages;
}

export const benchmarkDrilldownPages: BenchmarkDrilldownPage[] = buildBenchmarkDrilldownPages();

export function getBenchmarkDrilldownsForRegion(regionSlugValue: string): BenchmarkDrilldownPage[] {
  return benchmarkDrilldownPages.filter((page) => page.region.slug === regionSlugValue);
}

export type BenchmarkPage =
  | ({
      kind: 'region';
    } & RegionPage)
  | BenchmarkCasePage
  | BenchmarkDrilldownPage;

export const benchmarkPages: BenchmarkPage[] = [
  ...regionPages.map((page) => ({ kind: 'region' as const, ...page })),
  ...benchmarkCasePages,
  ...benchmarkDrilldownPages,
];

export function leverSlug(lever: Pick<Lever, 'number' | 'name' | 'nameEn'>): string {
  return toSeoSlug(`lever ${lever.number} ${lever.nameEn || lever.name}`);
}

export function leverItemSlug(item: Pick<LeverItem, 'id' | 'name' | 'nameEn'>): string {
  return toSeoSlug(item.nameEn || item.id || item.name);
}

export type LeverPage =
  | {
      kind: 'lever';
      slug: string;
      lever: Lever;
    }
  | {
      kind: 'item';
      slug: string;
      lever: Lever;
      group: LeverGroup;
      item: LeverItem;
    };

export const leverPages: LeverPage[] = levers.flatMap((lever) => [
  { kind: 'lever' as const, slug: leverSlug(lever), lever },
  ...lever.groups.flatMap((group) =>
    group.items.map((item) => ({
      kind: 'item' as const,
      slug: leverItemSlug(item),
      lever,
      group,
      item,
    }))
  ),
]);

export function legalItemSlug(item: Pick<LegalItem, 'title' | 'titleEn'>): string {
  return toSeoSlug(item.titleEn || item.title);
}

export interface LegalItemPage {
  slug: string;
  section: LegalSection;
  sectionIndex: number;
  item: LegalItem;
}

export const legalItemPages: LegalItemPage[] = legalSections.flatMap((section, sectionIndex) =>
  section.items.map((item) => ({
    slug: legalItemSlug(item),
    section,
    sectionIndex,
    item,
  }))
);

export function ecosystemEntitySlug(entity: Pick<EcosystemEntity, 'id' | 'name' | 'nameEn'>): string {
  if (entity.id) return entity.id;
  return toSeoSlug(entity.nameEn || entity.name);
}

export interface EcosystemEntityPage {
  slug: string;
  category: EcosystemCategory;
  categoryIndex: number;
  entity: EcosystemEntity;
}

export const ecosystemEntityPages: EcosystemEntityPage[] = ecosystemCategories.flatMap((category, categoryIndex) =>
  category.entities
    .filter((entity) => entity.id)
    .map((entity) => ({
      slug: ecosystemEntitySlug(entity),
      category,
      categoryIndex,
      entity,
    }))
);

export function getEcosystemEntityPage(slug: string): EcosystemEntityPage | undefined {
  return ecosystemEntityPages.find((p) => p.slug === slug);
}

export function getSiblingsInCategory(
  categoryIndex: number,
  excludeSlug: string,
  limit = 6
): Array<{ slug: string; entity: EcosystemEntity }> {
  return ecosystemEntityPages
    .filter((p) => p.categoryIndex === categoryIndex && p.slug !== excludeSlug)
    .slice(0, limit)
    .map((p) => ({ slug: p.slug, entity: p.entity }));
}

export type StartupEntityKind = 'company' | 'exit' | 'investor';
export type StartupAiRelationLevel = 'core' | 'enabled' | 'adjacent' | 'weak';

export interface StartupAiRelation {
  level: StartupAiRelationLevel;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
}

export interface StartupEntityPage {
  slug: string;
  kind: StartupEntityKind;
  name: string;
  description: string;
  descriptionEn?: string;
  url?: string | null;
  icon: string;
  category: string;
  categoryEn: string;
  vertical?: Vertical;
  startup?: Startup;
  unicorn?: Unicorn;
  exit?: Exit;
  investor?: Investor;
}

type SluggableStartupEntity = {
  id?: string;
  name: string;
  nameEn?: string;
};

export function startupEntitySlug(entity: SluggableStartupEntity): string {
  if (entity.id) return entity.id;
  return toSeoSlug(entity.nameEn || entity.name);
}

function mergeStartupEntityPage(pagesBySlug: Map<string, StartupEntityPage>, nextPage: StartupEntityPage): void {
  const current = pagesBySlug.get(nextPage.slug);
  if (!current) {
    pagesBySlug.set(nextPage.slug, nextPage);
    return;
  }

  current.kind = current.kind === 'company' ? current.kind : nextPage.kind;
  current.description = current.description || nextPage.description;
  current.descriptionEn = current.descriptionEn || nextPage.descriptionEn;
  current.url = current.url || nextPage.url;
  current.icon = current.icon === '🦄' && nextPage.icon !== '🦄' ? nextPage.icon : current.icon;
  current.category =
    current.category === '独角兽' && nextPage.category !== '独角兽' ? nextPage.category : current.category;
  current.categoryEn =
    current.categoryEn === 'Unicorn' && nextPage.categoryEn !== 'Unicorn' ? nextPage.categoryEn : current.categoryEn;
  current.vertical = current.vertical || nextPage.vertical;
  current.startup = current.startup || nextPage.startup;
  current.unicorn = current.unicorn || nextPage.unicorn;
  current.exit = current.exit || nextPage.exit;
  current.investor = current.investor || nextPage.investor;
}

function buildStartupEntityPages(): StartupEntityPage[] {
  const pagesBySlug = new Map<string, StartupEntityPage>();

  for (const vertical of verticals) {
    for (const startup of vertical.startups) {
      mergeStartupEntityPage(pagesBySlug, {
        slug: startupEntitySlug(startup),
        kind: 'company',
        name: startup.name,
        description: startup.description,
        descriptionEn: startup.descriptionEn,
        url: startup.url,
        icon: vertical.icon,
        category: vertical.name,
        categoryEn: vertical.nameEn || vertical.name,
        vertical,
        startup,
      });
    }
  }

  for (const unicorn of unicorns) {
    mergeStartupEntityPage(pagesBySlug, {
      slug: startupEntitySlug(unicorn),
      kind: 'company',
      name: unicorn.name,
      description: unicorn.sector,
      descriptionEn: unicorn.sectorEn,
      url: unicorn.url,
      icon: '🦄',
      category: '独角兽',
      categoryEn: 'Unicorn',
      unicorn,
    });
  }

  for (const exit of exits) {
    mergeStartupEntityPage(pagesBySlug, {
      slug: startupEntitySlug(exit),
      kind: 'exit',
      name: exit.name,
      description: exit.description,
      descriptionEn: exit.descriptionEn,
      icon: '🏆',
      category: '退出与收购',
      categoryEn: 'Exit / Acquisition',
      exit,
    });
  }

  for (const investor of investors) {
    mergeStartupEntityPage(pagesBySlug, {
      slug: startupEntitySlug(investor),
      kind: 'investor',
      name: investor.name,
      description: investor.type,
      descriptionEn: investor.typeEn,
      url: investor.url,
      icon: '💰',
      category: '投资者生态',
      categoryEn: 'Investor Ecosystem',
      investor,
    });
  }

  return Array.from(pagesBySlug.values());
}

export const startupEntityPages: StartupEntityPage[] = buildStartupEntityPages();

export function getStartupEntityPage(slug: string): StartupEntityPage | undefined {
  return startupEntityPages.find((page) => page.slug === slug);
}

export function getStartupEntitySiblings(page: StartupEntityPage, limit = 6): StartupEntityPage[] {
  return startupEntityPages
    .filter((candidate) => candidate.slug !== page.slug)
    .map((candidate) => ({
      candidate,
      score: candidate.category === page.category || candidate.vertical === page.vertical ? 0 : 1,
    }))
    .filter(({ candidate, score }) => score === 0 || candidate.kind === page.kind)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

const STARTUP_AI_RELATION_LEVELS: Record<string, StartupAiRelationLevel> = {
  'advance-ai': 'core',
  aicadium: 'core',
  'aida-technologies': 'core',
  augmentus: 'core',
  biofourmis: 'core',
  'bot-md': 'core',
  botsync: 'core',
  credolab: 'core',
  datature: 'core',
  'engine-bio': 'core',
  'eureka-robotics': 'core',
  jan: 'core',
  manus: 'core',
  moovita: 'core',
  musiio: 'core',
  near: 'core',
  patsnap: 'core',
  pencil: 'core',
  qritive: 'core',
  'sentient-io': 'core',
  tookitaki: 'core',
  'transparently-ai': 'core',
  trax: 'core',
  visenze: 'core',
  'wiz-ai': 'core',

  carro: 'enabled',
  aspire: 'enabled',
  endowus: 'enabled',
  grab: 'enabled',
  tabsquare: 'enabled',

  antler: 'adjacent',
  gic: 'adjacent',
  nium: 'adjacent',
  sginnovate: 'adjacent',
  sygnum: 'adjacent',
  temasek: 'adjacent',
  'vertex-ventures': 'adjacent',
  'monks-hill-ventures': 'adjacent',

  galatek: 'weak',
  level3ai: 'weak',
  'mindverse-ai': 'weak',
  'nanyang-biologics': 'weak',
};

const STARTUP_AI_RELATIONS: Record<StartupAiRelationLevel, StartupAiRelation> = {
  core: {
    level: 'core',
    label: '核心 AI',
    labelEn: 'Core AI',
    description:
      '主营产品或价值主张直接建立在 AI / ML / 计算机视觉 / LLM / 机器人智能等能力上，可以作为严格意义上的 AI 公司或 AI 项目收录。',
    descriptionEn:
      'The main product or value proposition is directly built on AI, ML, computer vision, LLMs, robotics intelligence, or closely related model-driven capabilities. It can be treated as a strict AI company or AI project.',
  },
  enabled: {
    level: 'enabled',
    label: 'AI-enabled',
    labelEn: 'AI-enabled',
    description:
      '公司本质上是行业平台或业务平台，AI 是重要产品、运营或效率能力之一；可以放入 AI 生态观察，但不应称为 AI-native 公司。',
    descriptionEn:
      'The company is primarily an industry or business platform. AI is an important product, operations, or productivity capability, but the company should not be described as AI-native.',
  },
  adjacent: {
    level: 'adjacent',
    label: '生态相邻',
    labelEn: 'Adjacent',
    description:
      '该实体不是 AI 公司，主要因为资本、支付、基础设施、数字资产、退出路径或生态位置与新加坡 AI 创业生态相连而收录。',
    descriptionEn:
      'This is not an AI company. It is included because its capital, payments, infrastructure, digital-asset, exit-path, or ecosystem role touches Singapore’s AI startup environment.',
  },
  weak: {
    level: 'weak',
    label: '弱关联待核',
    labelEn: 'Weak / verify',
    description:
      '现有公开材料不足以把它直接称为 AI 公司。暂时保留为待核实体，后续需要补官网、融资、产品或技术来源后再提高分类。',
    descriptionEn:
      'Current public evidence is not strong enough to call this an AI company. It is kept as a provisional entity until stronger product, funding, technical, or official sources are added.',
  },
};

export function getStartupAiRelation(entity: string | Pick<StartupEntityPage, 'slug' | 'kind'>): StartupAiRelation {
  const slug = typeof entity === 'string' ? entity : entity.slug;
  const kind = typeof entity === 'string' ? undefined : entity.kind;
  const level = STARTUP_AI_RELATION_LEVELS[slug] || (kind === 'investor' || kind === 'exit' ? 'adjacent' : 'weak');
  return STARTUP_AI_RELATIONS[level];
}
