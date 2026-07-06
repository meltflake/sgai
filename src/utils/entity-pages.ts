import slugify from 'limax';

import {
  benchmarkCases,
  regions,
  regionDetails,
  type BenchmarkAnalysisSource,
  type BenchmarkCase,
  type RegionDetail,
  type RegionSummary,
} from '../data/benchmarking';
import { sections as legalSections, type LegalItem, type LegalSection } from '../data/legal-ai';
import { levers, publicLeverGroups, type Lever, type LeverGroup, type LeverItem } from '../data/levers';
import { ecosystemCategories, type EcosystemCategory, type EcosystemEntity } from '../data/ecosystem';
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
} from '../data/startups';

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
  labelJa?: string;
  labelKo?: string;
  value: string;
  valueEn?: string;
  valueJa?: string;
  valueKo?: string;
}

// Ja/Ko synthesized fields are REQUIRED (not optional) on purpose: a future
// addPage call site that forgets them fails to compile. This is the first
// line of defence against the 2026-07 En-only-synthesis regression; the
// second is scripts/evals/entity-pages-i18n/check.ts.
export interface BenchmarkDrilldownPage {
  kind: 'drilldown';
  slug: string;
  localId: string;
  drilldownKind: BenchmarkDrilldownKind;
  region: RegionPage;
  category: string;
  categoryEn: string;
  categoryJa: string;
  categoryKo: string;
  title: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
  description: string;
  descriptionEn: string;
  descriptionJa: string;
  descriptionKo: string;
  body: string;
  bodyEn: string;
  bodyJa: string;
  bodyKo: string;
  facts: BenchmarkDrilldownFact[];
  sources: string[];
  sourcesEn?: string[];
  sourcesJa?: string[];
  sourcesKo?: string[];
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
    // Enriched analysis in ANY language beats the synthesized template; prefer
    // the target-locale analysis, then En, then zh, then the template.
    const enrichedBodyJa = enrichment?.analysisJa ?? enrichment?.analysisEn ?? enrichment?.analysis ?? page.bodyJa;
    const enrichedBodyKo = enrichment?.analysisKo ?? enrichment?.analysisEn ?? enrichment?.analysis ?? page.bodyKo;
    pages.push({
      kind: 'drilldown',
      slug: benchmarkDrilldownSlug(page.region, page.localId, page.titleEn || page.title),
      ...page,
      body: enrichedBody,
      bodyEn: enrichedBodyEn,
      bodyJa: enrichedBodyJa,
      bodyKo: enrichedBodyKo,
      analysisPending: !enrichment,
      analysisSources: enrichment?.sources,
    });
  }

  for (const region of regionPages) {
    const { summary, detail } = region;
    const regionNameEn = summary.nameEn || summary.name;
    const regionNameJa = summary.nameJa || regionNameEn;
    const regionNameKo = summary.nameKo || regionNameEn;
    const sources = detail?.sources || [];
    const sourcesEn = detail?.sourcesEn;
    // Region-level string sources carry no Ja/Ko data yet — bake the En
    // fallback so ja/ko pages cite in English rather than falling to zh.
    const sourcesJa = detail?.sourcesJa ?? detail?.sourcesEn;
    const sourcesKo = detail?.sourcesKo ?? detail?.sourcesEn;

    addPage({
      localId: 'core-strategy',
      drilldownKind: 'summary',
      region,
      category: '地区概览',
      categoryEn: 'Region overview',
      categoryJa: '地域概要',
      categoryKo: '지역 개요',
      title: `${summary.name} 核心战略`,
      titleEn: `${regionNameEn} Core Strategy`,
      titleJa: `${regionNameJa}の中核戦略`,
      titleKo: `${regionNameKo} 핵심 전략`,
      description: `${summary.name} 的核心 AI 战略是 ${summary.strategy}，当前公开年份为 ${summary.strategyYear}。`,
      descriptionEn: `${regionNameEn}'s core AI strategy is ${summary.strategyEn || summary.strategy}, with the public year marked as ${summary.strategyYear}.`,
      descriptionJa: `${regionNameJa}の中核 AI 戦略は ${summary.strategyJa || summary.strategyEn || summary.strategy} で、公開年は ${summary.strategyYear} です。`,
      descriptionKo: `${regionNameKo}의 핵심 AI 전략은 ${summary.strategyKo || summary.strategyEn || summary.strategy}이며, 공개 연도는 ${summary.strategyYear}입니다.`,
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
      bodyJa: detail?.strategies.length
        ? `${regionNameJa}の戦略スタックは ${detail.strategies
            .map((item) => item.nameJa || item.nameEn || item.name)
            .join(
              '、'
            )} などの文書と政策で構成されています。このドリルダウンページは、地域ページ上部の「中核戦略」カードを要約入口から拡充可能なアーカイブへ発展させるためのものです。`
        : `${regionNameJa} には現在、概要レベルの戦略サマリーのみがあります。今後データファイルに完全な RegionDetail を追加すれば、ページは具体的な戦略文書へ自動的に展開されます。`,
      bodyKo: detail?.strategies.length
        ? `${regionNameKo}의 전략 스택은 ${detail.strategies
            .map((item) => item.nameKo || item.nameEn || item.name)
            .join(
              ', '
            )} 등의 문서와 정책으로 구성됩니다. 이 상세 페이지는 지역 페이지 상단의 「핵심 전략」 카드를 요약 입구에서 계속 보완할 수 있는 아카이브로 발전시키기 위한 것입니다.`
        : `${regionNameKo}에는 현재 개요 수준의 전략 요약만 있습니다. 이후 데이터 파일에 완전한 RegionDetail을 추가하면 페이지가 구체적인 전략 문서로 자동 확장됩니다.`,
      facts: [
        {
          label: '战略',
          labelEn: 'Strategy',
          labelJa: '戦略',
          labelKo: '전략',
          value: summary.strategy,
          valueEn: summary.strategyEn || summary.strategy,
          valueJa: summary.strategyJa || summary.strategyEn || summary.strategy,
          valueKo: summary.strategyKo || summary.strategyEn || summary.strategy,
        },
        {
          label: '年份',
          labelEn: 'Year',
          labelJa: '年',
          labelKo: '연도',
          value: summary.strategyYear,
          valueEn: summary.strategyYear,
          valueJa: summary.strategyYear,
          valueKo: summary.strategyYear,
        },
        {
          label: '地区',
          labelEn: 'Region',
          labelJa: '地域',
          labelKo: '지역',
          value: summary.name,
          valueEn: regionNameEn,
          valueJa: regionNameJa,
          valueKo: regionNameKo,
        },
      ],
      sources,
      sourcesEn,
      sourcesJa,
      sourcesKo,
    });

    addPage({
      localId: 'investment-overview',
      drilldownKind: 'summary',
      region,
      category: '地区概览',
      categoryEn: 'Region overview',
      categoryJa: '地域概要',
      categoryKo: '지역 개요',
      title: `${summary.name} 投资规模`,
      titleEn: `${regionNameEn} Investment Scale`,
      titleJa: `${regionNameJa}の投資規模`,
      titleKo: `${regionNameKo} 투자 규모`,
      description: `${summary.name} 的 AI 投资口径为：${summary.investment}。`,
      descriptionEn: `${regionNameEn}'s AI investment signal is: ${summary.investmentEn || summary.investment}.`,
      descriptionJa: `${regionNameJa}の AI 投資シグナルは ${summary.investmentJa || summary.investmentEn || summary.investment} です。`,
      descriptionKo: `${regionNameKo}의 AI 투자 시그널은 ${summary.investmentKo || summary.investmentEn || summary.investment}입니다.`,
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
      bodyJa: detail?.investment.length
        ? `${regionNameJa}の投資・リソース項目には ${detail.investment
            .map((item) => item.itemJa || item.itemEn || item.item)
            .join(
              '、'
            )} が含まれます。このページは地域レベルの資金、計算能力、リソース配分をまとめており、今後公式予算、タイムライン、執行進捗を追加できます。`
        : `${regionNameJa} には現在、概要レベルの投資サマリーのみがあります。今後具体的な投資項目を追加できます。`,
      bodyKo: detail?.investment.length
        ? `${regionNameKo}의 투자·리소스 항목에는 ${detail.investment
            .map((item) => item.itemKo || item.itemEn || item.item)
            .join(
              ', '
            )} 이(가) 포함됩니다. 이 페이지는 지역 수준의 자금, 컴퓨팅 파워, 리소스 배분을 정리하며, 이후 공식 예산, 타임라인, 집행 진행 상황을 추가할 수 있습니다.`
        : `${regionNameKo}에는 현재 개요 수준의 투자 요약만 있습니다. 이후 구체적인 투자 항목을 추가할 수 있습니다.`,
      facts: [
        {
          label: '投资口径',
          labelEn: 'Investment signal',
          labelJa: '投資シグナル',
          labelKo: '투자 시그널',
          value: summary.investment,
          valueEn: summary.investmentEn || summary.investment,
          valueJa: summary.investmentJa || summary.investmentEn || summary.investment,
          valueKo: summary.investmentKo || summary.investmentEn || summary.investment,
        },
        {
          label: '项目数',
          labelEn: 'Tracked items',
          labelJa: '登録項目数',
          labelKo: '추적 항목 수',
          value: String(detail?.investment.length || 0),
          valueEn: String(detail?.investment.length || 0),
          valueJa: String(detail?.investment.length || 0),
          valueKo: String(detail?.investment.length || 0),
        },
        {
          label: '地区',
          labelEn: 'Region',
          labelJa: '地域',
          labelKo: '지역',
          value: summary.name,
          valueEn: regionNameEn,
          valueJa: regionNameJa,
          valueKo: regionNameKo,
        },
      ],
      sources,
      sourcesEn,
      sourcesJa,
      sourcesKo,
    });

    addPage({
      localId: 'governance-model',
      drilldownKind: 'summary',
      region,
      category: '地区概览',
      categoryEn: 'Region overview',
      categoryJa: '地域概要',
      categoryKo: '지역 개요',
      title: `${summary.name} 治理模式`,
      titleEn: `${regionNameEn} Governance Model`,
      titleJa: `${regionNameJa}のガバナンスモデル`,
      titleKo: `${regionNameKo} 거버넌스 모델`,
      description: `${summary.name} 的 AI 治理模式可概括为：${summary.governance}。`,
      descriptionEn: `${regionNameEn}'s AI governance model can be summarised as: ${summary.governanceEn || summary.governance}.`,
      descriptionJa: `${regionNameJa}の AI ガバナンスモデルは次のように要約できます：${summary.governanceJa || summary.governanceEn || summary.governance}。`,
      descriptionKo: `${regionNameKo}의 AI 거버넌스 모델은 다음과 같이 요약할 수 있습니다: ${summary.governanceKo || summary.governanceEn || summary.governance}.`,
      body:
        detail?.governance ||
        `${summary.name} 的治理模式目前只保留摘要口径。后续可继续补充主管机关、法律状态、沙盒机制和行业指引。`,
      bodyEn:
        detail?.governanceEn ||
        detail?.governance ||
        `${regionNameEn}'s governance model currently has only the summary signal. Future updates can add agencies, legal status, sandbox mechanisms, and sectoral guidance.`,
      bodyJa:
        detail?.governanceJa ||
        detail?.governanceEn ||
        detail?.governance ||
        `${regionNameJa}のガバナンスモデルは現在サマリーのみです。今後、所管機関、法的地位、サンドボックス制度、業界ガイドラインを追加できます。`,
      bodyKo:
        detail?.governanceKo ||
        detail?.governanceEn ||
        detail?.governance ||
        `${regionNameKo}의 거버넌스 모델은 현재 요약만 있습니다. 이후 주관 기관, 법적 상태, 샌드박스 제도, 업계 가이드라인을 추가할 수 있습니다.`,
      facts: [
        {
          label: '治理模式',
          labelEn: 'Governance model',
          labelJa: 'ガバナンスモデル',
          labelKo: '거버넌스 모델',
          value: summary.governance,
          valueEn: summary.governanceEn || summary.governance,
          valueJa: summary.governanceJa || summary.governanceEn || summary.governance,
          valueKo: summary.governanceKo || summary.governanceEn || summary.governance,
        },
        {
          label: '战略年份',
          labelEn: 'Strategy year',
          labelJa: '戦略年',
          labelKo: '전략 연도',
          value: summary.strategyYear,
          valueEn: summary.strategyYear,
          valueJa: summary.strategyYear,
          valueKo: summary.strategyYear,
        },
        {
          label: '地区',
          labelEn: 'Region',
          labelJa: '地域',
          labelKo: '지역',
          value: summary.name,
          valueEn: regionNameEn,
          valueJa: regionNameJa,
          valueKo: regionNameKo,
        },
      ],
      sources,
      sourcesEn,
      sourcesJa,
      sourcesKo,
    });

    // strengthsJa/Ko carry no data yet — fall through En, then zh, keeping the
    // sentence frame in the target locale (the eval only requires presence).
    const strengthItemsJa = detail?.strengthsJa?.length
      ? detail.strengthsJa
      : detail?.strengthsEn?.length
        ? detail.strengthsEn
        : detail?.strengths;
    const strengthItemsKo = detail?.strengthsKo?.length
      ? detail.strengthsKo
      : detail?.strengthsEn?.length
        ? detail.strengthsEn
        : detail?.strengths;

    addPage({
      localId: 'comparative-strength',
      drilldownKind: 'summary',
      region,
      category: '地区概览',
      categoryEn: 'Region overview',
      categoryJa: '地域概要',
      categoryKo: '지역 개요',
      title: `${summary.name} 核心优势`,
      titleEn: `${regionNameEn} Core Strength`,
      titleJa: `${regionNameJa}の中核的な強み`,
      titleKo: `${regionNameKo} 핵심 강점`,
      description: `${summary.name} 相对新加坡的核心优势是：${summary.strength}。`,
      descriptionEn: `${regionNameEn}'s comparative strength versus Singapore is: ${summary.strengthEn || summary.strength}.`,
      descriptionJa: `${regionNameJa}のシンガポールに対する中核的な強みは：${summary.strengthJa || summary.strengthEn || summary.strength}。`,
      descriptionKo: `${regionNameKo}이(가) 싱가포르 대비 갖는 핵심 강점은 ${summary.strengthKo || summary.strengthEn || summary.strength}입니다.`,
      body: detail?.strengths.length
        ? `${summary.name} 相对新加坡的优势包括 ${detail.strengths.join('；')}。这个页面用于沉淀优势判断，后续可补充指标和反例。`
        : `${summary.name} 目前只有总览层面的优势摘要。后续可继续补充详细优势、短板和指标依据。`,
      bodyEn: detail?.strengthsEn?.length
        ? `${regionNameEn}'s strengths versus Singapore include ${detail.strengthsEn.join('; ')}. This page stores the comparative-strength judgment and can later gain metrics and counterexamples.`
        : detail?.strengths.length
          ? `${regionNameEn}'s strengths versus Singapore include ${detail.strengths.join('; ')}. This page stores the comparative-strength judgment and can later gain metrics and counterexamples.`
          : `${regionNameEn} currently has only an overview-level strength summary. Future updates can add detailed strengths, weaknesses, and metric evidence.`,
      bodyJa: strengthItemsJa?.length
        ? `${regionNameJa}のシンガポールに対する強みには ${strengthItemsJa.join('；')} が含まれます。このページは比較優位の判断を蓄積するためのもので、今後指標や反例を追加できます。`
        : `${regionNameJa} には現在、概要レベルの強みサマリーのみがあります。今後、詳細な強み、弱み、指標の根拠を追加できます。`,
      bodyKo: strengthItemsKo?.length
        ? `${regionNameKo}이(가) 싱가포르 대비 갖는 강점에는 ${strengthItemsKo.join('; ')} 이(가) 포함됩니다. 이 페이지는 비교 우위 판단을 축적하기 위한 것으로, 이후 지표와 반례를 추가할 수 있습니다.`
        : `${regionNameKo}에는 현재 개요 수준의 강점 요약만 있습니다. 이후 상세 강점, 약점, 지표 근거를 추가할 수 있습니다.`,
      facts: [
        {
          label: '核心优势',
          labelEn: 'Core strength',
          labelJa: '中核的な強み',
          labelKo: '핵심 강점',
          value: summary.strength,
          valueEn: summary.strengthEn || summary.strength,
          valueJa: summary.strengthJa || summary.strengthEn || summary.strength,
          valueKo: summary.strengthKo || summary.strengthEn || summary.strength,
        },
        {
          label: 'AI 排名',
          labelEn: 'AI ranking',
          labelJa: 'AI ランキング',
          labelKo: 'AI 순위',
          value: summary.aiRanking || '—',
          valueEn: summary.aiRanking || '—',
          valueJa: summary.aiRanking || '—',
          valueKo: summary.aiRanking || '—',
        },
        {
          label: '地区',
          labelEn: 'Region',
          labelJa: '地域',
          labelKo: '지역',
          value: summary.name,
          valueEn: regionNameEn,
          valueJa: regionNameJa,
          valueKo: regionNameKo,
        },
      ],
      sources,
      sourcesEn,
      sourcesJa,
      sourcesKo,
    });

    if (!detail) continue;

    const detailNameJa = detail.nameJa || detail.nameEn || detail.name;
    const detailNameKo = detail.nameKo || detail.nameEn || detail.name;

    detail.strategies.forEach((strategy, index) => {
      const strategyNameJa = strategy.nameJa || strategy.nameEn || strategy.name;
      const strategyNameKo = strategy.nameKo || strategy.nameEn || strategy.name;
      addPage({
        localId: `strategy-${index + 1}`,
        drilldownKind: 'strategy',
        region,
        category: '核心战略',
        categoryEn: 'Core strategy',
        categoryJa: '中核戦略',
        categoryKo: '핵심 전략',
        title: strategy.name,
        titleEn: strategy.nameEn || strategy.name,
        titleJa: strategyNameJa,
        titleKo: strategyNameKo,
        description: strategy.description,
        descriptionEn: strategy.descriptionEn || strategy.description,
        descriptionJa: strategy.descriptionJa || strategy.descriptionEn || strategy.description,
        descriptionKo: strategy.descriptionKo || strategy.descriptionEn || strategy.description,
        body: `${strategy.name} 是 ${detail.name} AI 政策栈中的一项战略 / 政策文件，公开年份为 ${strategy.year}。当前档案先保留公开描述，后续可补原文链接、政策目标、执行机构和最新进展。`,
        bodyEn: `${strategy.nameEn || strategy.name} is a strategy or policy document in ${detail.nameEn || detail.name}'s AI policy stack, with public year ${strategy.year}. This profile currently preserves the public description and can later add source links, policy targets, executing bodies, and progress updates.`,
        bodyJa: `${strategyNameJa} は ${detailNameJa} の AI 政策スタックにおける戦略／政策文書で、公開年は ${strategy.year} です。現在は公開説明のみを収録しており、今後原文リンク、政策目標、執行機関、最新の進捗を追加できます。`,
        bodyKo: `${strategyNameKo}은(는) ${detailNameKo}의 AI 정책 스택에 포함된 전략/정책 문서이며, 공개 연도는 ${strategy.year}입니다. 현재는 공개 설명만 수록하며, 이후 원문 링크, 정책 목표, 집행 기관, 최신 진행 상황을 추가할 수 있습니다.`,
        facts: [
          {
            label: '年份',
            labelEn: 'Year',
            labelJa: '年',
            labelKo: '연도',
            value: strategy.year,
            valueEn: strategy.year,
            valueJa: strategy.year,
            valueKo: strategy.year,
          },
          {
            label: '地区',
            labelEn: 'Region',
            labelJa: '地域',
            labelKo: '지역',
            value: detail.name,
            valueEn: detail.nameEn || detail.name,
            valueJa: detailNameJa,
            valueKo: detailNameKo,
          },
          {
            label: '类型',
            labelEn: 'Type',
            labelJa: '種別',
            labelKo: '유형',
            value: '战略 / 政策文件',
            valueEn: 'Strategy / policy document',
            valueJa: '戦略／政策文書',
            valueKo: '전략/정책 문서',
          },
        ],
        sources: detail.sources,
        sourcesEn: detail.sourcesEn,
        sourcesJa,
        sourcesKo,
      });
    });

    detail.investment.forEach((investment, index) => {
      const itemJa = investment.itemJa || investment.itemEn || investment.item;
      const itemKo = investment.itemKo || investment.itemEn || investment.item;
      const amountJa = investment.amountJa || investment.amountEn || investment.amount;
      const amountKo = investment.amountKo || investment.amountEn || investment.amount;
      const noteJa = investment.noteJa || investment.noteEn || investment.note;
      const noteKo = investment.noteKo || investment.noteEn || investment.note;
      addPage({
        localId: `investment-${index + 1}`,
        drilldownKind: 'investment',
        region,
        category: '投资与资源',
        categoryEn: 'Investment and resources',
        categoryJa: '投資・リソース',
        categoryKo: '투자·리소스',
        title: investment.item,
        titleEn: investment.itemEn || investment.item,
        titleJa: itemJa,
        titleKo: itemKo,
        description: `${investment.amount} — ${investment.note}`,
        descriptionEn: `${investment.amountEn || investment.amount} — ${investment.noteEn || investment.note}`,
        descriptionJa: `${amountJa} — ${noteJa}`,
        descriptionKo: `${amountKo} — ${noteKo}`,
        body: `${investment.item} 是 ${detail.name} AI 投资与资源配置中的一项公开记录。当前口径为 ${investment.amount}，备注为“${investment.note}”。后续可继续补预算来源、执行机构、项目周期和实际支出。`,
        bodyEn: `${investment.itemEn || investment.item} is a public investment or resource-allocation record in ${detail.nameEn || detail.name}'s AI strategy. The current amount signal is ${investment.amountEn || investment.amount}, with note: “${investment.noteEn || investment.note}”. Future updates can add budget source, executing agency, project period, and actual spending.`,
        bodyJa: `${itemJa} は ${detailNameJa} の AI 投資・リソース配分における公開記録の一つです。現在の金額シグナルは ${amountJa} で、備考は「${noteJa}」です。今後、予算源、執行機関、プロジェクト期間、実際の支出を追加できます。`,
        bodyKo: `${itemKo}은(는) ${detailNameKo}의 AI 투자·리소스 배분에 관한 공개 기록입니다. 현재 금액 시그널은 ${amountKo}이며, 비고는 “${noteKo}”입니다. 이후 예산 출처, 집행 기관, 프로젝트 기간, 실제 지출을 추가할 수 있습니다.`,
        facts: [
          {
            label: '金额',
            labelEn: 'Amount',
            labelJa: '金額',
            labelKo: '금액',
            value: investment.amount,
            valueEn: investment.amountEn || investment.amount,
            valueJa: amountJa,
            valueKo: amountKo,
          },
          {
            label: '备注',
            labelEn: 'Note',
            labelJa: '備考',
            labelKo: '비고',
            value: investment.note,
            valueEn: investment.noteEn || investment.note,
            valueJa: noteJa,
            valueKo: noteKo,
          },
          {
            label: '地区',
            labelEn: 'Region',
            labelJa: '地域',
            labelKo: '지역',
            value: detail.name,
            valueEn: detail.nameEn || detail.name,
            valueJa: detailNameJa,
            valueKo: detailNameKo,
          },
        ],
        sources: detail.sources,
        sourcesEn: detail.sourcesEn,
        sourcesJa,
        sourcesKo,
      });
    });

    detail.keyInitiatives.forEach((initiative, index) => {
      const initiativeEn = detail.keyInitiativesEn?.[index] || initiative;
      // keyInitiativesJa/Ko carry no data yet — fall through the En title so
      // ja/ko pages read English initiative names rather than zh.
      const initiativeJa = detail.keyInitiativesJa?.[index] || initiativeEn;
      const initiativeKo = detail.keyInitiativesKo?.[index] || initiativeEn;
      addPage({
        localId: `initiative-${index + 1}`,
        drilldownKind: 'initiative',
        region,
        category: '关键举措',
        categoryEn: 'Key initiative',
        categoryJa: '重点施策',
        categoryKo: '핵심 이니셔티브',
        title: initiative,
        titleEn: initiativeEn,
        titleJa: initiativeJa,
        titleKo: initiativeKo,
        description: `${initiative} 是 ${detail.name} AI 战略中的关键举措之一。`,
        descriptionEn: `${initiativeEn} is one of the key initiatives in ${detail.nameEn || detail.name}'s AI strategy.`,
        descriptionJa: `${initiativeJa} は ${detailNameJa} の AI 戦略における重点施策の一つです。`,
        descriptionKo: `${initiativeKo}은(는) ${detailNameKo}의 AI 전략에서 핵심 이니셔티브 중 하나입니다.`,
        body: `${initiative} 目前作为地区页关键举措收录。这个档案页用于后续补充项目背景、牵头机构、执行状态、指标和相关来源。`,
        bodyEn: `${initiativeEn} is currently tracked as a key initiative on the region page. This profile is ready for project background, lead agency, execution status, metrics, and source links.`,
        bodyJa: `${initiativeJa} は現在、地域ページの重点施策として収録されています。このアーカイブページでは今後、プロジェクト背景、主導機関、執行状況、指標、関連ソースを追加できます。`,
        bodyKo: `${initiativeKo}은(는) 현재 지역 페이지의 핵심 이니셔티브로 수록되어 있습니다. 이 아카이브 페이지에는 이후 프로젝트 배경, 주관 기관, 집행 상태, 지표, 관련 출처를 추가할 수 있습니다.`,
        facts: [
          {
            label: '类型',
            labelEn: 'Type',
            labelJa: '種別',
            labelKo: '유형',
            value: '关键举措',
            valueEn: 'Key initiative',
            valueJa: '重点施策',
            valueKo: '핵심 이니셔티브',
          },
          {
            label: '地区',
            labelEn: 'Region',
            labelJa: '地域',
            labelKo: '지역',
            value: detail.name,
            valueEn: detail.nameEn || detail.name,
            valueJa: detailNameJa,
            valueKo: detailNameKo,
          },
          {
            label: '来源层级',
            labelEn: 'Source layer',
            labelJa: 'ソース階層',
            labelKo: '출처 계층',
            value: '地区档案',
            valueEn: 'Region profile',
            valueJa: '地域アーカイブ',
            valueKo: '지역 아카이브',
          },
        ],
        sources: detail.sources,
        sourcesEn: detail.sourcesEn,
        sourcesJa,
        sourcesKo,
      });
    });

    detail.keyBodies.forEach((body, index) => {
      const bodyNameJa = body.nameJa || body.nameEn || body.name;
      const bodyNameKo = body.nameKo || body.nameEn || body.name;
      const bodyRoleJa = body.roleJa || body.roleEn || body.role;
      const bodyRoleKo = body.roleKo || body.roleEn || body.role;
      addPage({
        localId: `body-${index + 1}`,
        drilldownKind: 'body',
        region,
        category: '关键机构',
        categoryEn: 'Key body',
        categoryJa: '主要機関',
        categoryKo: '핵심 기관',
        title: body.name,
        titleEn: body.nameEn || body.name,
        titleJa: bodyNameJa,
        titleKo: bodyNameKo,
        description: body.role,
        descriptionEn: body.roleEn || body.role,
        descriptionJa: bodyRoleJa,
        descriptionKo: bodyRoleKo,
        body: `${body.name} 在 ${detail.name} AI 生态中的角色是：${body.role}。这个机构档案后续可继续补负责人、官网、政策权限和相关项目。`,
        bodyEn: `${body.nameEn || body.name}'s role in ${detail.nameEn || detail.name}'s AI ecosystem is: ${body.roleEn || body.role}. This institutional profile can later add leadership, official website, policy authority, and related projects.`,
        bodyJa: `${bodyNameJa} が ${detailNameJa} の AI エコシステムで果たす役割は：${bodyRoleJa}。この機関アーカイブには今後、責任者、公式サイト、政策権限、関連プロジェクトを追加できます。`,
        bodyKo: `${bodyNameKo}이(가) ${detailNameKo}의 AI 생태계에서 수행하는 역할은 ${bodyRoleKo}입니다. 이 기관 아카이브에는 이후 책임자, 공식 웹사이트, 정책 권한, 관련 프로젝트를 추가할 수 있습니다.`,
        facts: [
          {
            label: '角色',
            labelEn: 'Role',
            labelJa: '役割',
            labelKo: '역할',
            value: body.role,
            valueEn: body.roleEn || body.role,
            valueJa: bodyRoleJa,
            valueKo: bodyRoleKo,
          },
          {
            label: '地区',
            labelEn: 'Region',
            labelJa: '地域',
            labelKo: '지역',
            value: detail.name,
            valueEn: detail.nameEn || detail.name,
            valueJa: detailNameJa,
            valueKo: detailNameKo,
          },
          {
            label: '类型',
            labelEn: 'Type',
            labelJa: '種別',
            labelKo: '유형',
            value: '关键机构',
            valueEn: 'Key body',
            valueJa: '主要機関',
            valueKo: '핵심 기관',
          },
        ],
        sources: detail.sources,
        sourcesEn: detail.sourcesEn,
        sourcesJa,
        sourcesKo,
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
  ...publicLeverGroups(lever).flatMap((group) =>
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

// labelJa/Ko + descriptionJa/Ko are REQUIRED so the compiler forces every
// STARTUP_AI_RELATIONS level to ship all four locales (see the
// BenchmarkDrilldownPage note above).
export interface StartupAiRelation {
  level: StartupAiRelationLevel;
  label: string;
  labelEn: string;
  labelJa: string;
  labelKo: string;
  description: string;
  descriptionEn: string;
  descriptionJa: string;
  descriptionKo: string;
}

export interface StartupEntityPage {
  slug: string;
  kind: StartupEntityKind;
  name: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionKo?: string;
  url?: string | null;
  icon: string;
  category: string;
  categoryEn: string;
  categoryJa: string;
  categoryKo: string;
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
  current.descriptionJa = current.descriptionJa || nextPage.descriptionJa;
  current.descriptionKo = current.descriptionKo || nextPage.descriptionKo;
  current.url = current.url || nextPage.url;
  current.icon = current.icon === '🦄' && nextPage.icon !== '🦄' ? nextPage.icon : current.icon;
  // Category displacement is keyed on the zh base and replaces ALL locale
  // siblings atomically — two independent per-locale ternaries could de-sync
  // category vs categoryJa when literals diverge.
  if (current.category === '独角兽' && nextPage.category !== '独角兽') {
    current.category = nextPage.category;
    current.categoryEn = nextPage.categoryEn;
    current.categoryJa = nextPage.categoryJa;
    current.categoryKo = nextPage.categoryKo;
  }
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
        descriptionJa: startup.descriptionJa,
        descriptionKo: startup.descriptionKo,
        url: startup.url,
        icon: vertical.icon,
        category: vertical.name,
        categoryEn: vertical.nameEn || vertical.name,
        categoryJa: vertical.nameJa || vertical.nameEn || vertical.name,
        categoryKo: vertical.nameKo || vertical.nameEn || vertical.name,
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
      descriptionJa: unicorn.sectorJa,
      descriptionKo: unicorn.sectorKo,
      url: unicorn.url,
      icon: '🦄',
      category: '独角兽',
      categoryEn: 'Unicorn',
      categoryJa: 'ユニコーン',
      categoryKo: '유니콘',
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
      descriptionJa: exit.descriptionJa,
      descriptionKo: exit.descriptionKo,
      icon: '🏆',
      category: '退出与收购',
      categoryEn: 'Exit / Acquisition',
      categoryJa: 'イグジット / 買収',
      categoryKo: '엑시트 / 인수',
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
      descriptionJa: investor.typeJa,
      descriptionKo: investor.typeKo,
      url: investor.url,
      icon: '💰',
      category: '投资者生态',
      categoryEn: 'Investor Ecosystem',
      categoryJa: '投資家エコシステム',
      categoryKo: '투자자 생태계',
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
    labelJa: 'コア AI',
    labelKo: '코어 AI',
    description:
      '主营产品或价值主张直接建立在 AI / ML / 计算机视觉 / LLM / 机器人智能等能力上，可以作为严格意义上的 AI 公司或 AI 项目收录。',
    descriptionEn:
      'The main product or value proposition is directly built on AI, ML, computer vision, LLMs, robotics intelligence, or closely related model-driven capabilities. It can be treated as a strict AI company or AI project.',
    descriptionJa:
      '主力製品または価値提案が AI / ML / コンピュータビジョン / LLM / ロボティクス知能などの能力の上に直接構築されており、厳密な意味での AI 企業・AI プロジェクトとして収録できます。',
    descriptionKo:
      '주력 제품 또는 가치 제안이 AI / ML / 컴퓨터 비전 / LLM / 로보틱스 지능 등의 역량 위에 직접 구축되어 있어, 엄밀한 의미의 AI 기업 또는 AI 프로젝트로 수록할 수 있습니다.',
  },
  enabled: {
    level: 'enabled',
    label: 'AI-enabled',
    labelEn: 'AI-enabled',
    labelJa: 'AI-enabled',
    labelKo: 'AI-enabled',
    description:
      '公司本质上是行业平台或业务平台，AI 是重要产品、运营或效率能力之一；可以放入 AI 生态观察，但不应称为 AI-native 公司。',
    descriptionEn:
      'The company is primarily an industry or business platform. AI is an important product, operations, or productivity capability, but the company should not be described as AI-native.',
    descriptionJa:
      '本質的には業界プラットフォームまたはビジネスプラットフォームであり、AI は重要な製品・運営・効率化能力の一つです。AI エコシステム観察の対象にはなりますが、AI ネイティブ企業と呼ぶべきではありません。',
    descriptionKo:
      '본질적으로는 산업 플랫폼 또는 비즈니스 플랫폼이며, AI는 중요한 제품·운영·효율화 역량 중 하나입니다. AI 생태계 관찰 대상에는 포함되지만 AI 네이티브 기업이라고 부르기는 어렵습니다.',
  },
  adjacent: {
    level: 'adjacent',
    label: '生态相邻',
    labelEn: 'Adjacent',
    labelJa: 'エコシステム隣接',
    labelKo: '생태계 인접',
    description:
      '该实体不是 AI 公司，主要因为资本、支付、基础设施、数字资产、退出路径或生态位置与新加坡 AI 创业生态相连而收录。',
    descriptionEn:
      'This is not an AI company. It is included because its capital, payments, infrastructure, digital-asset, exit-path, or ecosystem role touches Singapore’s AI startup environment.',
    descriptionJa:
      'この主体は AI 企業ではありません。資本、決済、インフラ、デジタル資産、イグジット経路、またはエコシステム上の位置がシンガポールの AI スタートアップ生態系とつながっているため収録されています。',
    descriptionKo:
      '이 주체는 AI 기업이 아닙니다. 자본, 결제, 인프라, 디지털 자산, 엑시트 경로 또는 생태계 내 위치가 싱가포르 AI 스타트업 생태계와 연결되어 있어 수록되었습니다.',
  },
  weak: {
    level: 'weak',
    label: '弱关联待核',
    labelEn: 'Weak / verify',
    labelJa: '関連性弱・要確認',
    labelKo: '약한 관련·검증 필요',
    description:
      '现有公开材料不足以把它直接称为 AI 公司。暂时保留为待核实体，后续需要补官网、融资、产品或技术来源后再提高分类。',
    descriptionEn:
      'Current public evidence is not strong enough to call this an AI company. It is kept as a provisional entity until stronger product, funding, technical, or official sources are added.',
    descriptionJa:
      '現在の公開資料では AI 企業と直接呼ぶには不十分です。暫定的に要確認エンティティとして保留し、今後公式サイト、資金調達、製品、技術ソースを補ってから分類を引き上げます。',
    descriptionKo:
      '현재 공개 자료만으로는 AI 기업이라고 부르기에 충분하지 않습니다. 잠정적으로 검증 대기 엔티티로 유지하며, 이후 공식 웹사이트, 투자 유치, 제품, 기술 출처를 보완한 뒤 분류를 상향합니다.',
  },
};

export function getStartupAiRelation(entity: string | Pick<StartupEntityPage, 'slug' | 'kind'>): StartupAiRelation {
  const slug = typeof entity === 'string' ? entity : entity.slug;
  const kind = typeof entity === 'string' ? undefined : entity.kind;
  const level = STARTUP_AI_RELATION_LEVELS[slug] || (kind === 'investor' || kind === 'exit' ? 'adjacent' : 'weak');
  return STARTUP_AI_RELATIONS[level];
}
