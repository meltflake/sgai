export interface ReferenceLink {
  text: string;
  textEn?: string;
  url: string;
  note?: string;
  noteEn?: string;
  translation?: string;
}

export interface ReferenceSection {
  icon: string;
  title: string;
  titleEn?: string;
  links: ReferenceLink[];
}

export const sections: ReferenceSection[] = [
  {
    icon: '🏛️',
    title: '官方文件与战略',
    titleEn: 'Official Documents and Strategy',
    links: [
      {
        text: 'National AI Strategy 2.0 (NAIS 2.0)',
        textEn: 'National AI Strategy 2.0 (NAIS 2.0)',
        url: 'https://www.smartnation.gov.sg/initiatives/national-ai-strategy/',
        note: 'SNDGO, 2023',
        noteEn: 'SNDGO, 2023',
      },
      {
        text: 'National AI Strategy 1.0',
        textEn: 'National AI Strategy 1.0',
        url: 'https://file.go.gov.sg/nais2019.pdf',
        note: 'SNDGO, 2019',
        noteEn: 'SNDGO, 2019',
      },
      {
        text: 'Model AI Governance Framework (2nd Ed.)',
        textEn: 'Model AI Governance Framework (2nd Ed.)',
        url: 'https://www.pdpc.gov.sg/help-and-resources/2020/01/model-ai-governance-framework',
        note: 'IMDA/PDPC, 2020',
        noteEn: 'IMDA/PDPC, 2020',
      },
      {
        text: 'AI Verify Foundation',
        textEn: 'AI Verify Foundation',
        url: 'https://aiverifyfoundation.sg/',
        note: 'IMDA, 2023',
        noteEn: 'IMDA, 2023',
      },
      {
        text: 'Proposed Gen AI Governance Framework',
        textEn: 'Proposed Gen AI Governance Framework',
        url: 'https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2024/gen-ai-and-digital-foss-ai-governance-playbook',
        note: 'IMDA, 2024',
        noteEn: 'IMDA, 2024',
      },
      {
        text: 'Personal Data Protection Act (PDPA)',
        textEn: 'Personal Data Protection Act (PDPA)',
        url: 'https://www.pdpc.gov.sg/overview-of-pdpa/the-legislation/personal-data-protection-act',
        note: 'PDPC',
        noteEn: 'PDPC',
      },
      {
        text: 'Smart Nation and Digital Government Office',
        textEn: 'Smart Nation and Digital Government Office',
        url: 'https://www.smartnation.gov.sg/',
      },
    ],
  },
  {
    icon: '🔬',
    title: '研究机构与项目',
    titleEn: 'Research Institutions and Programmes',
    links: [
      {
        text: 'AI Singapore (AISG)',
        textEn: 'AI Singapore (AISG)',
        url: 'https://aisingapore.org/',
        note: '国家 AI 项目',
        noteEn: 'National AI programme',
      },
      {
        text: 'AI Apprenticeship Programme (AIAP)',
        textEn: 'AI Apprenticeship Programme (AIAP)',
        url: 'https://aisingapore.org/aiap/',
      },
      {
        text: 'SEA Lion',
        textEn: 'SEA Lion',
        url: 'https://sea-lion.ai/',
        note: '东南亚多语言大模型',
        noteEn: 'Southeast Asia multilingual large language model',
      },
      {
        text: 'A*STAR',
        textEn: 'A*STAR',
        url: 'https://www.a-star.edu.sg/',
        note: '科技研究局',
        noteEn: 'Agency for Science, Technology and Research',
      },
      {
        text: 'National Research Foundation (NRF)',
        textEn: 'National Research Foundation (NRF)',
        url: 'https://www.nrf.gov.sg/',
      },
    ],
  },
  {
    icon: '📊',
    title: '指标与报告',
    titleEn: 'Indicators and Reports',
    links: [
      {
        text: 'Stanford AI Index Report',
        textEn: 'Stanford AI Index Report',
        url: 'https://aiindex.stanford.edu/',
        note: '年度全球 AI 发展报告',
        noteEn: 'Annual global AI development report',
      },
      {
        text: 'Tortoise Global AI Index',
        textEn: 'Tortoise Global AI Index',
        url: 'https://www.tortoisemedia.com/intelligence/global-ai/',
        note: '全球 AI 就绪度排名',
        noteEn: 'Global AI readiness ranking',
      },
      {
        text: 'Oxford Insights Government AI Readiness Index',
        textEn: 'Oxford Insights Government AI Readiness Index',
        url: 'https://oxfordinsights.com/ai-readiness/ai-readiness-index/',
      },
      {
        text: 'Microsoft AI Economy Institute — Global AI Adoption 2025',
        textEn: 'Microsoft AI Economy Institute — Global AI Adoption 2025',
        url: 'https://www.microsoft.com/en-us/corporate-responsibility/topics/ai-economy-institute/reports/global-ai-adoption-2025/',
        note: '新加坡 AI 采用率全球第 2（60.9%），2026.1 发布',
        noteEn: 'Singapore ranked 2nd globally on AI adoption (60.9%); released January 2026',
        translation: '/microsoft-global-ai-adoption-2025/',
      },
      {
        text: 'AI Diffusion 技术论文',
        textEn: 'AI Diffusion technical paper',
        url: 'https://arxiv.org/abs/2511.02781',
        note: '报告方法论详解，arXiv 2025.11',
        noteEn: 'Detailed methodology for the report; arXiv, November 2025',
      },
      {
        text: 'data.gov.sg',
        textEn: 'data.gov.sg',
        url: 'https://data.gov.sg/',
        note: '新加坡政府开放数据',
        noteEn: 'Singapore government open data portal',
      },
    ],
  },
  {
    icon: '📰',
    title: '分析与报道',
    titleEn: 'Analysis and Reporting',
    links: [
      {
        text: 'CNA — AI in Singapore',
        textEn: 'CNA — AI in Singapore',
        url: 'https://www.channelnewsasia.com/topic/artificial-intelligence',
      },
      {
        text: 'Straits Times — AI Coverage',
        textEn: 'Straits Times — AI Coverage',
        url: 'https://www.straitstimes.com/tags/artificial-intelligence',
      },
      {
        text: 'GovInsider — Smart Government',
        textEn: 'GovInsider — Smart Government',
        url: 'https://govinsider.asia/intl-en/category/smart-gov',
      },
      {
        text: 'Tech in Asia — AI',
        textEn: 'Tech in Asia — AI',
        url: 'https://www.techinasia.com/tag/artificial-intelligence-singapore',
      },
    ],
  },
  {
    icon: '🌏',
    title: '国际对标',
    titleEn: 'International Benchmarks',
    links: [
      { text: 'OECD AI Policy Observatory', textEn: 'OECD AI Policy Observatory', url: 'https://oecd.ai/' },
      {
        text: 'US AI Bill of Rights',
        textEn: 'US AI Bill of Rights',
        url: 'https://bidenwhitehouse.archives.gov/ostp/ai-bill-of-rights/',
      },
      {
        text: 'EU AI Act',
        textEn: 'EU AI Act',
        url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
      },
      {
        text: 'ASEAN Guide on AI Governance and Ethics',
        textEn: 'ASEAN Guide on AI Governance and Ethics',
        url: 'https://asean.org/book/asean-guide-on-ai-governance-and-ethics/',
      },
    ],
  },
  {
    icon: '🎓',
    title: '学术与深度',
    titleEn: 'Academic and Long-Form',
    links: [
      {
        text: "Harmonizing AI governance: Singapore and France's AI policies",
        textEn: "Harmonizing AI governance: Singapore and France's AI policies",
        url: 'https://link.springer.com/article/10.1007/s43508-025-00116-w',
        note: 'AI & Society',
        noteEn: 'AI & Society',
      },
      {
        text: 'Asian Journal of Law and Society — AI Law',
        textEn: 'Asian Journal of Law and Society — AI Law',
        url: 'https://www.cambridge.org/core/journals/asian-journal-of-law-and-society',
      },
    ],
  },
];
