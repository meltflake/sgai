// 新加坡 AI 法律框架 — "训练宽松 + 输出严管"双轨
// 这个组合让新加坡成为目前世界上对 AI 公司最清晰可预测的法域之一。

export interface LegalItem {
  title: string;
  titleEn: string;
  date: string;
  authority: string; // 主管机构
  authorityUrl?: string;
  scope: 'training' | 'output' | 'liability' | 'governance'; // 训练侧 / 输出侧 / 责任 / 治理
  status: '已生效' | '已颁布' | '咨询中' | '提案';
  summary: string;
  body: string;
  sourceUrl?: string;
}

export interface LegalSection {
  title: string;
  philosophy: string; // 该侧的整体哲学
  items: LegalItem[];
}

export const dataDate = '2026-04-26';

export const introBody = `新加坡的 AI 法律框架可以用一句话概括：**训练宽松 + 输出严管**。

- **训练侧**：合法获取的内容（不论是否有版权）可用于 AI 训练——与日本并列全球最宽松。
- **输出侧**：深伪、AI 私密图像、AI 生成的虚假信息、选举操纵——四件套立法严管。

这个组合让新加坡成为目前世界上**对 AI 公司最清晰可预测的法域之一**：你能做什么、不能做什么，边界清晰。这是 EDB 能引进 OpenAI、Anthropic、DeepMind、Mistral 等机构的关键背景之一。`;

export const sections: LegalSection[] = [
  {
    title: '训练侧 — 全球最宽松',
    philosophy:
      '"Computational Data Analysis" 例外让 AI 训练数据使用免责。与日本《著作权法》第 30-4 条并列。美国仍在 fair use 案例法争议中、欧盟需依赖 TDM Exception 的 opt-out 机制——新加坡和日本是世界上目前唯二明确写入法律的国家。',
    items: [
      {
        title: 'Copyright Act §244',
        titleEn: 'Copyright Act 2021 — Section 244 (Computational Data Analysis Exception)',
        date: '2021-11',
        authority: 'MINLAW',
        authorityUrl: 'https://www.mlaw.gov.sg/',
        scope: 'training',
        status: '已生效',
        summary: 'AI 训练免责条款——合法获取的内容可用于 AI 模型训练、文本与数据挖掘等用途，不构成版权侵权。',
        body: 'Copyright Act 2021 第 244 条 "Computational Data Analysis" 给 AI 训练数据使用提供明确的免责条款。"合法获取" 意指通过订阅、购买、合法 API、公开网页等正常渠道获取的内容。这条规定使新加坡成为全球 AI 训练版权立场最清晰的法域之一，也是 EDB 引进 OpenAI / Anthropic / DeepMind 等机构的关键背景。',
        sourceUrl: 'https://sso.agc.gov.sg/Act/CA2021?ProvIds=P14-#pr244-',
      },
      {
        title: 'IPOS "When Code Creates" 报告',
        titleEn: 'IPOS — When Code Creates: AI Authorship Position Paper',
        date: '2024',
        authority: 'IPOS（知识产权局）',
        authorityUrl: 'https://www.ipos.gov.sg/',
        scope: 'training',
        status: '已颁布',
        summary: '明确 AI 生成内容的 Authorship 立场：人类有实质创作贡献时方可主张著作权。',
        body: '"When Code Creates" 是 IPOS 2024 年发布的官方立场文件，回应 GenAI 时代著作权归属问题。核心立场：完全 AI 生成、无人类实质创作贡献的输出不构成著作权法意义上的"作品"；但如果人类做了实质性的创作选择（prompt 设计、输出筛选、迭代修改），则人类可主张为作者。这与英国 1988 法案"无作者计算机生成作品"模式不同，更接近美国 USCO 立场。',
      },
    ],
  },
  {
    title: '输出侧 — 四件套严管',
    philosophy:
      '训练宽松不等于输出宽松。深伪、AI 私密图像、AI 生成虚假信息、选举操纵——四件套立法严管。这是新加坡防止"AI 自由"被滥用的政策对冲。',
    items: [
      {
        title: 'Online Criminal Harms Act (OCHA)',
        titleEn: 'Online Criminal Harms Act',
        date: '2023-07',
        authority: 'MHA',
        authorityUrl: 'https://www.mha.gov.sg/',
        scope: 'output',
        status: '已生效',
        summary: '统一治理网络刑事伤害——AI 生成的诈骗、勒索、恐吓内容均覆盖。',
        body: 'OCHA 2023 年通过，给警察、检察官提供统一的网络刑事伤害治理工具。AI 时代特别相关：AI 生成的诈骗信息、深伪勒索内容、自动化骚扰——都可以依据 OCHA 进行治理性命令、内容下架、限制访问、阻止支付等。OCHA 是新加坡 AI 输出侧治理的"基础底座"，不专门针对 AI，但 AI 触发的行为大多可以按 OCHA 处理。',
        sourceUrl: 'https://sso.agc.gov.sg/Acts-Supp/22-2023/',
      },
      {
        title: 'Elections (Integrity of Online Advertising) (Amendment) Bill',
        titleEn: 'Elections (Integrity of Online Advertising) (Amendment) Bill',
        date: '2024-09',
        authority: 'MDDI / Elections Department',
        authorityUrl: 'https://www.mddi.gov.sg/',
        scope: 'output',
        status: '已生效',
        summary: '选举期间禁止深伪：禁止发布"误导性、AI 生成的、声称是候选人发言或行为"的内容。',
        body: '2024 年通过的选举法修正案，针对深伪进行专项立法。核心条款：在选举期间（writ of election 颁布到投票日）禁止发布"误导性、AI 生成、深度伪造的、声称表示候选人发言或行为"的内容。任何人发布、转发、出资制作此类内容均属犯罪。竞选期内可发出"corrective directions"要求平台移除内容、阻止访问、显示更正声明。这是世界上较早的针对选举深伪的专项立法，比欧盟 AI Act 选举条款落地更早。',
      },
      {
        title: 'Criminal Law (Miscellaneous Amendments) Bill 2025',
        titleEn: 'Criminal Law (Miscellaneous Amendments) Bill 2025',
        date: '2025',
        authority: 'MHA',
        authorityUrl: 'https://www.mha.gov.sg/',
        scope: 'output',
        status: '已颁布',
        summary: 'AI 生成的私密图像与儿童性剥削图像入刑——制作、持有、传播均可起诉。',
        body: '2025 年的 Criminal Law 修正案明确把 AI 生成的私密图像（裸露、性图像）和儿童性剥削图像纳入刑法。创新点：(1) 即便图像中的"人"是虚构的（AI 生成而非真实人物），如果看起来像未成年人，依然入刑；(2) 制作、持有、传播均构成犯罪；(3) 加重刑罚针对针对实名个人的深伪私密图像。这填补了"AI 生成不存在的人"这种新型情形的法律空白。',
      },
      {
        title: 'Online Safety (Relief and Accountability) Bill 2025',
        titleEn: 'Online Safety (Relief and Accountability) Bill 2025',
        date: '2025',
        authority: 'MDDI',
        authorityUrl: 'https://www.mddi.gov.sg/',
        scope: 'output',
        status: '已颁布',
        summary: '受害者快速救济通道 + 平台问责机制——24 小时内须处理 AI 滥用投诉。',
        body: '2025 年通过的 Online Safety 新法，重点是受害者救济与平台问责：(1) 受害者可向 Online Safety Commission（OSC）提交投诉，平台 24 小时内须处理；(2) 平台未履行义务可面临高额罚款；(3) AI 生成的诽谤、骚扰、性图像均覆盖。这是新加坡输出侧治理从"事后惩罚"转向"过程问责"的关键一步。',
      },
    ],
  },
  {
    title: '责任与治理',
    philosophy: '原则到工具到执法的渐进式路径——FEAT → Veritas → MindForge → AI Risk Management Guidelines。',
    items: [
      {
        title: '法院生成式 AI 使用指南',
        titleEn: 'Guide on Use of Generative AI Tools by Court Users',
        date: '2024-10',
        authority: '新加坡最高法院',
        authorityUrl: 'https://www.judiciary.gov.sg/',
        scope: 'liability',
        status: '已颁布',
        summary: '律师和当事人对使用 AI 准备的法律文件负最终责任，须披露 AI 使用情况。',
        body: "新加坡最高法院 2024 年发布的 Registrar's Circular No. 1 of 2024 适用于所有法院体系。三大原则：(1) 律师和当事人对提交法院的所有内容负最终责任，无论是否使用 AI 生成；(2) 使用 GenAI 辅助准备的法律文件须披露 AI 使用情况；(3) 引用的案例和法律条文须经人工核实（防止 AI 编造判例的风险）。这是司法系统对 AI 工具的务实态度——不禁止使用，但人类责任不可转移。",
        sourceUrl: 'https://www.judiciary.gov.sg/news-and-resources/news',
      },
      {
        title: 'MAS AI Risk Management Guidelines',
        titleEn: 'AI Risk Management Guidelines for Banks',
        date: '2024-12',
        authority: 'MAS',
        authorityUrl: 'https://www.mas.gov.sg/',
        scope: 'governance',
        status: '已生效',
        summary: '金融业 AI 模型风险管理的正式监管期望书——全球首批专门针对银行业 AI 的监管文件。',
        body: 'MAS 把 FEAT (2018) → Veritas (2021) → MindForge (2024) 多年实践累积的经验固化为正式监管期望书。覆盖：模型治理、第三方 AI 风险、模型监控、人在回路、事件应对与责任。配套 BuildFin.ai 平台让被监管机构能持续测试和报告。这是全球首批专门针对银行业 AI 的监管文件，比欧盟 AI Act 金融条款落地更快。',
        sourceUrl: 'https://www.mas.gov.sg/regulation/notices/notice-fsm-n29',
      },
      {
        title: 'CSA Securing AI Systems Guidelines',
        titleEn: 'Guidelines and Companion Guide on Securing AI Systems',
        date: '2024-10',
        authority: 'CSA',
        authorityUrl: 'https://www.csa.gov.sg/',
        scope: 'governance',
        status: '已颁布',
        summary: 'AI 系统全生命周期安全最佳实践——填补 AI 安全治理空白。',
        body: 'CSA 2024 年 10 月发布，覆盖 AI 系统全生命周期：规划与设计阶段的威胁建模、开发阶段的数据与模型安全、部署阶段的安全测试、运维阶段的监控与事件响应。重点关注对抗性攻击防御、数据投毒防范、模型窃取防护、供应链安全等 AI 特有风险。配套 Securing Agentic AI 增补稿（2025）扩展到 Agentic AI 场景。',
      },
      {
        title: 'PDPA × AI 边界',
        titleEn: 'Personal Data Protection Act (PDPA) — AI Application',
        date: '2012 / 2020 修订',
        authority: 'PDPC',
        authorityUrl: 'https://www.pdpc.gov.sg/',
        scope: 'governance',
        status: '已生效',
        summary: '为 AI 数据使用划定法律边界——合法利益例外（Business Improvement Exception）让 AI 训练有空间。',
        body: 'PDPA 2012 年通过，2020 年大幅修订加入 AI 相关条款。AI 时代特别重要的修改：(1) Business Improvement Exception——允许在不获取用户同意的情况下使用个人数据改进产品和服务（包括 AI 训练，需符合合理性测试）；(2) 数据可携带权；(3) 强化执法与处罚力度。配合 Copyright Act §244 形成新加坡 AI 训练数据使用的双重法律基础。',
      },
    ],
  },
];

export const conclusion = `**为什么这套法律组合对 AI 公司有吸引力**：

1. **训练数据明确合法**——不像美国还在 fair use 法庭案例堆里挣扎
2. **输出端严但清晰**——你不能做什么写得很明白，而不是泛泛"风险"
3. **金融、医疗、法律分行业有规则**——而不是一个 EU AI Act 式的横切监管
4. **责任分配明确**——人在回路、披露义务、第三方 AI 责任都有书面规则

这是新加坡战略中"Trust 杠杆"（让企业敢部署）和"International 杠杆"（让外资把治理总部放新加坡）的法律支柱。`;
