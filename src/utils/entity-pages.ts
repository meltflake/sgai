import slugify from 'limax';

import { regions, regionDetails, type RegionDetail, type RegionSummary } from '~/data/benchmarking';
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
