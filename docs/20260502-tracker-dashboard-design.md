# Tracker 改造方案：评判仪表盘（Dashboard）

日期：2026-05-02
状态：proposal（待审核）
取代：`docs/20260502-tracker-redesign.md`（"信号雷达"方向不再采用，定调改为"评判仪表盘"）
关联文件：`src/data/tracker.ts`、`src/pages/tracker/index.astro`、`src/data/levers.ts`、`src/data/policies.ts`、`src/navigation.ts`

---

## 一、定位

> **回答一个问题：新加坡 AI 做得好不好？**

不是指标参考表（80 条数字罗列），不是信号雷达（编辑追踪 5–10 条动态），而是 **6 维度评判仪表盘**——每个维度有评级、有依据、有趋势、有短板，让访客 30 秒内得出结论，5 分钟内追溯依据。

### 与现有页面的职能划分

| 页面     | 职能           | 节奏     | 形态                          |
| -------- | -------------- | -------- | ----------------------------- |
| levers   | 稳态结构地图   | 季度级   | 6 抓手 × 子分组 × 项目        |
| tracker  | **评判仪表盘** | 季度级   | **6 维度评级卡 + 详情页**     |
| policies | 文件清单       | 文件级   | 政策文件目录                  |
| timeline | 历史回溯       | 事件级   | 时间线                        |

四者互补：levers 看"有什么"、tracker 看"做得怎样"、policies 看"规则是什么"、timeline 看"发生过什么"。

---

## 二、评级方法（混合制）

来源 3：**第三方排名 × 目标完成度 × 趋势 → sgai 编辑综合给评级**。

### 三因子权重

每个维度评级综合三个因子：

1. **第三方国际排名**（Tortoise / Oxford / WIPO / Stanford / Microsoft 等）——硬锚点
2. **目标完成度**（vs 政府发布的目标，如 15K AI 专才 by 2029）——执行进度
3. **5 年趋势**（↗ ↘ →）——动量

文字判断卡（如"治理影响力"）以第三方排名 + 编辑判断为主，不强求量化目标。

### A/B/C/D 切分线

| 评级 | 含义 | 典型组合 |
| ---- | ---- | -------- |
| **A**   | 全球领先 | 全球前 3 + 目标在轨或超额 + 趋势 ↗/→ |
| **A-**  | 准领先 | 全球前 5 + 目标基本在轨 + 趋势 → |
| **B+**  | 强但有短板 | 全球前 10 或目标 50–70% + 趋势 ↗ |
| **B**   | 在路上 | 全球前 15 或目标 30–50% |
| **C**   | 落后 | 主流排名外或目标 <30% |
| **D**   | 危险 | 显著下滑或重大失败 |

### 评级公开化

每个评级在卡片正面 + 详情页头部 **必须公开依据**：写明用了哪些第三方排名、目标完成度多少、趋势怎样、为什么是 A/B 而不是 A-/B+。

### 复评节奏

季度复评（每 3 个月一次）。重大事件（重要发布会、Budget、新政策）触发即时复评。每次复评在 `methodology` 页留 changelog。

### 评级身份

明确标注 **"sgai 编辑评级 · YYYY-MM-DD"**，由 @meltflake 编辑团队负责。不是中立第三方，是有立场的观察站。

---

## 三、信息架构

### 路由

```
/tracker/                          # 仪表盘首页（卡片墙 + Hero）
/tracker/<dimension>/              # 6 个维度详情页
   ├── investment                  # 投入强度
   ├── talent                      # 人才储备
   ├── compute                     # 算力底座
   ├── adoption                    # 产业渗透（含政府自用）
   ├── research                    # 研究质量
   └── governance                  # 治理影响力
/tracker/methodology/              # 评级方法论页

/en/tracker/、/en/tracker/<dimension>/、/en/tracker/methodology/
```

路径保留 `/tracker/`（SEO 不断链）。

### 文件清单

```
src/data/tracker.ts                # 重写：dashboard schema + 6 维度评级 + 全部 metrics（按维度归类）
src/pages/tracker/index.astro      # 重写：Hero + 卡片墙
src/pages/tracker/[dim].astro      # 新增：维度详情页（动态路由）
src/pages/tracker/methodology.astro # 新增：方法论
src/pages/en/tracker/index.astro   # EN 同步
src/pages/en/tracker/[dim].astro   # EN 同步
src/pages/en/tracker/methodology.astro # EN 同步

src/components/tracker/DimensionCard.astro  # 卡片组件（量化版 + 文字判断版二态）
src/components/tracker/DimensionDetail.astro # 详情页主体组件
```

### 命名

- 中文显示名：`落地执行追踪器` → **`新加坡 AI 评判仪表盘`**（或更短：`AI 仪表盘`）
- EN 显示名：`Tracker` → **`Singapore AI Dashboard`**

`src/navigation.ts` 同步改名。

---

## 四、数据模型

完全替换现有 `TrackerSection` / `TrackerRow`。

```ts
// src/data/tracker.ts

export type Grade = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C' | 'D';
export type Trend = 'up' | 'flat' | 'down'; // 视觉对应 ↗ → ↘
export type DimensionId =
  | 'investment'
  | 'talent'
  | 'compute'
  | 'adoption'
  | 'research'
  | 'governance';

/** 第三方排名锚点 */
export interface RankingAnchor {
  source: string;           // "Tortoise Global AI Index 2024"
  sourceEn?: string;
  rank: string;             // "#3" / "#2 (after US)" / "60.9%"
  rankEn?: string;
  url: string;
}

/** 目标完成度（数字维度才有，文字判断维度可空） */
export interface ProgressAgainstTarget {
  current: string;          // "5,000"
  currentEn?: string;
  target: string;           // "15,000 by 2029"
  targetEn?: string;
  pct?: number;             // 0–100，UI 渲染进度条用
  url?: string;
}

/** 完整数据条目（旧 tracker.ts 的 80+ 条迁到这里，按维度归类） */
export interface MetricRow {
  name: string;
  nameEn?: string;
  value: string;
  valueEn?: string;
  source: string;
  sourceEn?: string;
  sourceUrl: string;
  /** 子分组（仅 adoption 维度用到，区分"企业采用" vs "政府自用"） */
  category?: string;
  categoryEn?: string;
}

/** 量化型卡片：投入 / 人才 / 算力 / 渗透 */
export interface QuantifiedDimension {
  id: DimensionId;
  kind: 'quantified';
  icon: string;
  title: string;            // "投入强度"
  titleEn?: string;
  oneLiner: string;         // "舍不舍得花钱？"
  oneLinerEn?: string;

  grade: Grade;
  trend: Trend;

  // 卡片正面三块
  headline: string;         // 大数字 / 核心指标，如 "S$139/人"
  headlineEn?: string;
  benchmark: string;        // 参照系，如 "vs US $33 / 中国 $7"
  benchmarkEn?: string;
  progress?: ProgressAgainstTarget; // 可空

  // 详情页用
  rankingAnchors: RankingAnchor[]; // 第三方排名（1–3 个）
  rationale: string;        // 评级理由（30–80 字）
  rationaleEn?: string;
  shortcoming: string;      // 关键短板/盲点（20–60 字）
  shortcomingEn?: string;

  // 完整数据（来自旧 tracker.ts，按维度归类）
  metrics: MetricRow[];

  // 关联（hand-curated）
  relatedLeverNumbers?: number[];
  relatedPolicyIds?: string[];
  relatedDebateIds?: string[];
  relatedPostSlugs?: string[];
}

/** 文字判断型卡片：治理 + 研究（部分文字） */
export interface QualitativeDimension {
  id: DimensionId;
  kind: 'qualitative';
  icon: string;
  title: string;
  titleEn?: string;
  oneLiner: string;
  oneLinerEn?: string;

  grade: Grade;
  trend: Trend;

  // 卡片正面：替代大数字的"一词定位" + 核心判断
  badge: string;            // "规则制定者" / "前沿强但缺原创"
  badgeEn?: string;
  judgment: string;         // 核心判断 60–100 字
  judgmentEn?: string;

  // 详情页用
  rankingAnchors: RankingAnchor[]; // 仍然引用第三方
  rationale: string;
  rationaleEn?: string;
  shortcoming: string;
  shortcomingEn?: string;

  metrics: MetricRow[];
  relatedLeverNumbers?: number[];
  relatedPolicyIds?: string[];
  relatedDebateIds?: string[];
  relatedPostSlugs?: string[];
}

export type Dimension = QuantifiedDimension | QualitativeDimension;

/** Hero 总评 */
export interface OverallVerdict {
  grade: Grade;
  oneLiner: string;
  oneLinerEn?: string;
  asOf: string;             // YYYY-MM-DD
  topRankings: RankingAnchor[]; // Hero 横排参照（4 条）
  methodologyNote: string;  // 一句话方法说明 + 链到 methodology
  methodologyNoteEn?: string;
}

export const dataDate = '2026-05-02';

// 实际值：§五 Hero 文案对应的字面量
export const overallVerdict: OverallVerdict = { /* 见 §五 */ };

// 6 个维度的实际数据：§六各维度小节给出完整字段
export const dimensions: Dimension[] = [ /* 6 个，见 §六 */ ];
```

### 字段约束（i18n）

含 CJK 的字段必须配 `*En`（遵 `docs/i18n.md`）。`metrics` 数组继承现有数据的 `*En` 字段。EN 页面渲染走 `pickLocalized()` 或 `record.titleEn || record.title`。

---

## 五、Hero 设计（首页顶部）

```
┌─────────────────────────────────────────────────────────────────┐
│ 🇸🇬  新加坡 AI 整体表现         sgai 编辑评级 · 2026-05-02       │
│                                                                 │
│              A-                                                 │
│                                                                 │
│  领先：强投入、强治理、强基建。但人才自给率低、原创研究偏少      │
│  是结构性短板，决定它从"快跟随"升到"真领跑"还差一档。            │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│  Tortoise #3 · Oxford #2 · Microsoft Adoption #2 · WIPO #5     │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│  评级方法：综合 (a) 第三方国际排名 (b) 目标完成度 (c) 5 年趋势  │
│            → 详细方法论                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Hero 完整文案（中文）

- **标题**：新加坡 AI 整体表现
- **总评**：**A-**
- **一句话定位**：领先：强投入、强治理、强基建。但人才自给率低、原创研究偏少是结构性短板，决定它从"快跟随"升到"真领跑"还差一档。
- **国际参照横排**：
  - Tortoise Global AI Index 2024 · #3
  - Oxford Government AI Readiness 2024 · #2
  - Microsoft AI Adoption 2026 · #2（60.9%）
  - WIPO Global Innovation Index 2025 · #5
- **方法说明（一句话）**：综合第三方国际排名 + 目标完成度 + 5 年趋势，详见方法论。

---

## 六、6 个维度卡片设计与文案

### 卡片视觉规则

- 量化卡 vs 文字判断卡 **同尺寸、同视觉权重**，但内部布局不同
- 卡片正面共有元素：图标、维度名、一句话问题、评级、趋势箭头
- 卡片正面差异：量化卡显大数字 + benchmark + 进度条；文字判断卡显 badge + 核心判断
- 整张卡可点击 → 维度详情页

### 维度 1：投入强度（量化）

```
┌────────────────────────────────────┐
│ 💰  投入强度       政府舍得花钱吗？ │
│                                    │
│       A      ↗                     │
│                                    │
│  S$139/人                          │ ← headline
│  ████████████░░  US 的 4.2 倍      │ ← benchmark + 进度条
│                                    │
│  vs US $33 · 中国 $7               │
│                                    │
│  Stanford AI Index #1 人均投入     │ ← 第三方锚（首条）
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `investment`
- `icon`: 💰
- `title`: 投入强度
- `oneLiner`: 政府舍得花钱吗？
- `grade`: **A**
- `trend`: ↗
- `headline`: S$139/人
- `benchmark`: vs US $33 / 中国 $7（人均）
- `progress`: 政府 AI 专项已超 S$2B + Budget 2026 加码（无明确目标值，故展示"超额"）
- `rankingAnchors`:
  - Stanford AI Index 2025 · 人均政府 AI 投入全球前列
  - Budget 2026 · 400% AI 税收激励（创新政策）
- `rationale`：人均 S$139 是美国 4.2 倍、中国 19 倍。Budget 2026 在已有 S$2B 基础上加 S$70M Multimodal LLM、S$1.5B FSDF、400% 税收激励——节奏不放缓。RIE2030 总盘 S$37B 兜底未来 5 年。资金强度全球第一梯队，故 A。
- `shortcoming`：私有部门跟投比例偏低，仍是政府推为主；钱花在算力和大企业上较多，SME 端补贴渗透不够。

### 维度 2：人才储备（量化）

```
┌────────────────────────────────────┐
│ 👩‍💻  人才储备     人够不够，自给率？│
│                                    │
│       B      ↗                     │
│                                    │
│  5,000 / 15,000                    │
│  ████░░░░░░░  33%（目标 2029）     │
│                                    │
│  外籍占比 35% · TeSA 21K 安置      │
│                                    │
│  Tortoise Talent ~#6–8             │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `talent`
- `icon`: 👩‍💻
- `title`: 人才储备
- `oneLiner`: 人够不够、自给率多少？
- `grade`: **B**
- `trend`: ↗
- `headline`: 5,000 / 15,000
- `benchmark`: 目标 2029 完成 33%（外籍占比 35%）
- `progress`: { current: "5,000", target: "15,000 by 2029", pct: 33 }
- `rankingAnchors`:
  - Tortoise Global AI Index Talent 子项 ~#6–8
  - SkillsFuture · 105K 人 / 1,600 课程（2025）
  - TeSA · 21K 本地人就业 + 340K 技能提升
- `rationale`：盘子在涨——SkillsFuture 105K 入读、TeSA 安置 21K、AIAP 22 批毕业 ~500–600 人——但目标完成度只有 33%，且外籍占比稳定在 35% 显示结构性依赖。Tortoise Talent 子项在 #6–8 区间，距离 #1 美国差一截。趋势向上但坡度陡，故 B 不到 B+。
- `shortcoming`：AIAP 60 人/批是产能瓶颈；本地名校 AI 博士流失率高（去美/去工业界）；"AI Bilingual 100K"刚启动，会计/法律首批要 H1 2026 上线，效果未知。

### 维度 3：算力底座（量化）

```
┌────────────────────────────────────┐
│ 🖥️  算力底座     跑得起前沿模型吗？ │
│                                    │
│       A-     →                     │
│                                    │
│  1.4 GW                            │
│  数据中心容量 + 70+ 设施           │
│                                    │
│  NSCC 20 PetaFLOPS · GPU 集群完整  │
│                                    │
│  Tortoise Infrastructure #2        │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `compute`
- `icon`: 🖥️
- `title`: 算力底座
- `oneLiner`: 跑得起前沿模型吗？
- `grade`: **A-**
- `trend`: →
- `headline`: 1.4 GW
- `benchmark`: 数据中心容量 + 70+ 设施 + NSCC ASPIRE 2A+ 20 PFLOPS
- `progress`: 额外 300MW 已分配 + 80MW 试点 2026–2028（增量在路上）
- `rankingAnchors`:
  - Tortoise Global AI Index Infrastructure · #2
  - NVIDIA Singapore · 占全球营收 15%（人均 $600）
  - 全球数据中心市场 · $4.16B（2024）
- `rationale`：NSCC ASPIRE 2A+（H100, 20 PFLOPS）+ 商用集群（SMC 2,048 H100/集群）+ Singtel GPU-as-a-Service + 国家计算网格——分层覆盖完整，企业够用、科研够用、政府有自用 SuperPOD（HTX NGINE B200）。Tortoise 基建排 #2，仅次于美国。趋势 → 而不是 ↗ 因为电力配额是天花板。故 A- 不到 A。
- `shortcoming`：电力配额 vs 绿电承诺的张力会卡未来 5 年扩张；前沿芯片（H100/B200）仍依赖进口，地缘风险存在；自研芯片或定制 ASIC 缺位。

### 维度 4：产业渗透（含政府自用）（量化）

```
┌────────────────────────────────────┐
│ 🏢  产业渗透     企业真在用吗？     │
│                                    │
│       B+     ↗                     │
│                                    │
│  62.5% 大企业 · 14.5% SME          │
│                                    │
│  Microsoft AI Adoption #2 (60.9%)  │
│                                    │
│  政府自用：Pair → 150K 公务员目标  │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `adoption`
- `icon`: 🏢
- `title`: 产业渗透
- `oneLiner`: 企业真在用吗？
- `grade`: **B+**
- `trend`: ↗
- `headline`: 62.5% 大企业 / 14.5% SME
- `benchmark`: SME YoY 3 倍增长（2023 4.2% → 2024 14.5%）
- `progress`: NAIIP 目标 10K 企业 + 100K 工人（2026–2029）
- `rankingAnchors`:
  - Microsoft AI Economy Institute 2026 · 全球第 2（60.9%，仅次于 UAE）
  - 数字经济占 GDP · 18.6%（2024，2019 14.9%）
  - DBS · 800+ 模型、350+ 用例、2024 年创造 S$750M 经济价值
- `rationale`：大企业达标——Microsoft 测全球第 2、DBS 等头部样板成熟。SME 端 YoY 3 倍是真增长但绝对值仍只 14.5%，离"普及"还远。政府自用（Pair / AIBots / VICA）目标 150K 公务员、Note Buddy 5K 医护、AV 巴士、ISO/IEC 42001 全球首张——案例厚但渗透率公开度有限。综合 B+，差 A- 在 SME 短板。
- `shortcoming`：SME 14.5% 看起来涨快、绝对值仍低，普惠 AI 还要 2–3 年；政府自用以效率工具为主，决策类 AI 渗透浅；NAIIP 拨款规模未公开，执行力存疑。

**政府自用子项处理**：不新增 schema 字段，而是在详情页 `metrics` 表里加一个 `category` 子分组（"企业采用" / "政府自用"），用现有的 `MetricRow` 数据自然分组展示。具体一句话总结写进 `rationale`：政府自用是 Pair / AIBots / VICA 三件套，目标 150K 公务员，亚洲首例 air-gapped agentic AI（GovTech Agentspace），但公开渗透率仅有目标无进度。

> Schema 调整：`MetricRow` 增加可选字段 `category?: string` / `categoryEn?: string`，仅 adoption 维度用到。

### 维度 5：研究质量（量化为主，部分文字）

```
┌────────────────────────────────────┐
│ 🔬  研究质量     有真东西出来吗？   │
│                                    │
│       B+     →                     │
│                                    │
│  人均论文 #1 · NTU AI #3           │
│                                    │
│  SEA-LION v4 · ICLR 2025 主办      │
│                                    │
│  顶级原创性仍差一档                │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `research`
- `icon`: 🔬
- `title`: 研究质量
- `oneLiner`: 有真东西出来吗？
- `grade`: **B+**
- `trend`: →
- `headline`: 人均论文全球 #1
- `benchmark`: NTU AI #3（仅次 MIT/CMU）· NUS #9
- `progress`: SEA-LION v4（11 语言、4B–33B 参数）+ 100E 100+ 项目 + ICLR 2025 主办
- `rankingAnchors`:
  - Wiley 2024 · 人均 AI 论文全球 #1（每百万人 250 篇，2022）
  - CSRankings AI · NTU #3
  - QS · NUS AI #9
- `rationale`：产出量级和学校排名都很硬——人均论文 #1、NTU AI #3、NUS #9、ICLR 2025 主办。SEA-LION 是少有的非英美中的有规模基座模型。但顶级原创（FAIR/DeepMind 级 frontier work）仍少：顶会一作占比、被引大于 1000 的代表作、自研基座模型市场份额——差一档。趋势 → 因为短期内提不上去。
- `shortcoming`：顶会一作占比、被引数、自研基座市场份额都还差一档；顶尖博士流失率高；产学研转化对企业自用强但对外输出弱（无 OpenAI / Anthropic 量级的 spinoff）。

### 维度 6：治理影响力（文字判断为主）

```
┌────────────────────────────────────┐
│ 🌐  治理影响力   规则上是不是话事人？│
│                                    │
│       A      ↗                     │
│                                    │
│  规则制定者                        │ ← badge
│                                    │
│  Singapore Consensus 11 国签、     │
│  ASEAN AI 指南主导起草、AI Verify  │
│  Foundation 全球采纳——新加坡是    │
│  规则制定者而非接受者，话语权超出  │
│  体量。                            │
│                                    │
│  Oxford Gov AI Readiness #2        │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `governance`
- `icon`: 🌐
- `title`: 治理影响力
- `oneLiner`: 规则上是不是话事人？
- `grade`: **A**
- `trend`: ↗
- `badge`: 规则制定者
- `judgment`：Singapore Consensus on AI Safety 11 国签署（含中美）、ASEAN Guide on AI Governance 10 国采纳（新加坡主导起草）、AI Verify Foundation 在全球被引、REAIM 联合主办、ISESEA 已办两届——新加坡是规则制定者而不是接受者，话语权显著超出体量。
- `rankingAnchors`:
  - Oxford Government AI Readiness 2024 · #2（仅次美国）
  - Singapore Consensus · 11 国签署
  - ASEAN Guide on AI Governance · 10 国采纳
- `rationale`：在国际治理上的存在感是新加坡 AI 战略最被低估的部分。Bletchley、Seoul、Paris 三届 AI Safety Summit 全程参与；MAS Project MindForge 拉到 24 家机构 + 四大云厂；UN Independent International Scientific Panel 有席位。Oxford Gov AI Readiness #2 印证这不是自吹。故 A。
- `shortcoming`：规则制定 ≠ 规则被遵守——AI Verify 框架被采纳但执法层面影响力弱；中美 AI 治理分裂时新加坡的"居间者"定位可持续性存疑——若任一方要求选边，回旋空间会塌；治理研究投入（AISI S$10M/年）和影响力规模不匹配，结构性投入偏轻。

---

## 七、维度详情页（标准版）

每个维度页 `/tracker/<dim>/` 结构：

```
┌─ Hero ────────────────────────────────────┐
│ 🔬 研究质量                                │
│                                            │
│       B+      →     有真东西出来吗？        │
│                                            │
│ sgai 编辑评级 · 2026-05-02                 │
└────────────────────────────────────────────┘

┌─ 评级三因子 ──────────────────────────────┐
│ ① 第三方排名锚                              │
│   · 人均论文 #1（Wiley 2024）↗            │
│   · NTU AI #3（CSRankings）↗              │
│   · NUS AI #9（QS）↗                       │
│ ② 目标完成度                                │
│   · SEA-LION v4 已出 / 100E 已收官          │
│ ③ 5 年趋势 →                                │
│ ────────────                                │
│ 评级理由：[rationale]                       │
│ 关键短板：[shortcoming]                     │
└────────────────────────────────────────────┘

┌─ 关键数据（精选 3–5 条 visual） ──────────┐
│ [核心 metrics 视觉化]                       │
└────────────────────────────────────────────┘

┌─ 完整数据表 ──────────────────────────────┐
│ [本维度全部 metrics 表格，sortable]         │
└────────────────────────────────────────────┘

┌─ 关联 ─────────────────────────────────────┐
│ Levers: [3 治理 / 5 政府自用]               │
│ Policies: [NAIS 2.0 / NAIIP]                │
│ Debates: [...]                              │
│ Posts: [...]                                │
└────────────────────────────────────────────┘
```

详情页是 dimension 数据的全展开——三因子、文字判断、完整数据表、关联导航。

---

## 八、80+ 条现有 metrics 归类映射

`src/data/tracker.ts` 现有 7 大类 80+ 条 → 6 个维度的归属：

| 旧类（旧 tracker.ts）  | 数量 | 新归属                  |
| ---------------------- | ---- | ----------------------- |
| 投资与资金             | 22   | **investment**          |
| 人才培养               | 12   | **talent**              |
| 研究产出               | 7    | **research**            |
| 产业采用               | 17   | **adoption**            |
| 基础设施               | 11   | **compute**             |
| 国际治理影响力         | 7    | **governance**          |
| 国际排名               | 6    | 拆 → 各维度的 `rankingAnchors` |

### 例外条目（需个别归类）

- 投资里的 **Microsoft / AWS / Google 数据中心投资**（3 条）→ `compute`（性质属算力底座）
- 投资里的 **Microsoft / AWS / Google 数据中心投资**金额本身 → 同时在 `investment` 完整数据表保留（双挂）
- 国际排名 6 条 → 全部上升到对应维度的 `rankingAnchors` 数组：
  - Microsoft AI 采用率 #2 → `adoption`
  - Tortoise 全球 AI 指数 #3 → Hero `topRankings`
  - Oxford 政府 AI 就绪度 #2 → `governance`
  - WIPO 全球创新指数 #5 → Hero `topRankings`
  - Tortoise AI 基础设施 #2 → `compute`
  - 东南亚深科技融资份额 91.1% → `adoption`

允许同一条 metric 出现在 1–2 个维度（性质跨界的少数条目，如 SEA-LION 在 research 和 compute 都有意义）。

---

## 九、Methodology 页（完整文案）

路由：`/tracker/methodology/`、`/en/tracker/methodology/`

### 中文完整文案

```markdown
# 评级方法论

## 我们做什么

新加坡 AI 评判仪表盘试图回答一个简单问题：**新加坡 AI 做得好不好？**

不是中立的统计公报，是 sgai 编辑团队基于公开数据 + 专业判断给出的**评判**。

## 三因子评级

每个维度的评级（A/B/C）综合三个因子：

### ① 第三方国际排名（硬锚点）

我们引用经过同行评审的国际排名作为锚点：

- **Tortoise Global AI Index** — 综合实力（投资 + 实施 + 创新）
- **Oxford Government AI Readiness Index** — 政府就绪度
- **Microsoft AI Economy Institute** — 企业 AI 采用率
- **Stanford AI Index** — 投资 + 学术产出
- **WIPO Global Innovation Index** — 创新生态
- **CSRankings / QS** — 学术研究

### ② 目标完成度

新加坡政府公开了若干量化目标（如 NAIS 2.0 的 15K AI 专才 by 2029、NAIIP 的 10K 企业 + 100K 工人）。我们用进度百分比衡量执行力。

### ③ 5 年趋势

不是看截面值，是看动量。投入在加速还是在收缩？人才在涨还是在跌？这决定 B+ 还是 B、A 还是 A-。

## A/B/C/D 切分线

| 评级 | 含义 | 典型组合 |
| ---- | ---- | -------- |
| **A**   | 全球领先 | 全球前 3 + 目标在轨或超额 + 趋势 ↗/→ |
| **A-**  | 准领先 | 全球前 5 + 目标基本在轨 + 趋势 → |
| **B+**  | 强但有短板 | 全球前 10 或目标 50–70% + 趋势 ↗ |
| **B**   | 在路上 | 全球前 15 或目标 30–50% |
| **C**   | 落后 | 主流排名外或目标 <30% |
| **D**   | 危险 | 显著下滑或重大失败 |

## 文字判断卡的特殊处理

部分维度（如治理影响力）难以完全量化。这些维度仍有第三方排名作为锚点（如 Oxford Gov AI Readiness），但**核心判断由编辑文字给出**——例如"规则制定者而非规则接受者"。这种判断的依据写在卡片的 `rationale`，可追溯。

## 复评节奏

- **常规**：季度复评（每 3 个月）
- **触发**：Budget、重大政策发布、年度排名更新（Tortoise / Oxford 等）
- 每次复评 changelog 记在本页底部

## 关于"sgai 编辑"

仪表盘评级由 sgai（Singapore AI Observer）编辑团队 @meltflake 给出。我们不是中立第三方，是**有立场的观察站**：

- **不接受任何政府或企业资助**——评级独立于资金影响
- **公开依据**——每个评级的三因子全部在卡片和详情页可查
- **承认局限**——我们读得到的是公开数据，企业内部和政府内部的实际进度可能与公开值有差距
- **欢迎挑战**——发现评级有问题或新数据应该影响评级，请发邮件 / 提 issue

## Changelog

- 2026-05-02 · v1.0 仪表盘上线，6 维度初始评级（投入 A · 人才 B · 算力 A- · 渗透 B+ · 研究 B+ · 治理 A，总评 A-）
```

EN 版同步翻译，spec 写定后批量补。

---

## 十、首页摘要挂法

`src/pages/index.astro` 的 hero 下增加一个"AI 评判摘要"模块，**取代**现有"功能板块入口"或与之并列：

```
┌────────────────────────────────────┐
│ 🇸🇬 新加坡 AI 评级 A-              │
│ 6 维度速览：A · B · A- · B+ · B+ · A│
│ → 看完整仪表盘                      │
└────────────────────────────────────┘
```

数据来源 `tracker.ts` 的 `overallVerdict` + `dimensions[].grade`——单一数据源，仪表盘改首页跟着改。

---

## 十一、i18n 处理

完全按 `docs/i18n.md` 规范：

- 含 CJK 的字段必须有 `*En` 兄弟字段（`title`/`titleEn`、`oneLiner`/`oneLinerEn` 等）
- EN 页面渲染 **永远**走 `pickLocalized()` 或 `field.titleEn || field.title`
- 路径走 `localizedHref()`，不硬编码 `/en/`
- 共享组件顶部 `getLangFromPath(new URL(Astro.url).pathname)` 推断 lang

EN 文案处理策略（spec 阶段）：

- 中文文案在 spec 内全部代笔写完
- EN 翻译在 spec 阶段**不写完整版**，仅列出需要翻译的字段清单
- spec 通过后 → 实现阶段批量补 EN 翻译 + 我自审 + Luca 审

提交前必须跑 `npm run build && node scripts/i18n-check.mjs`，扫 `dist/en/**/*.html` 不能有中文残留。

---

## 十二、导航与命名变更

`src/navigation.ts`：

- 中文：`落地执行追踪器` → `AI 评判仪表盘`（短）或 `新加坡 AI 评判仪表盘`（长）
- EN：`Tracker` → `AI Dashboard` 或 `Singapore AI Dashboard`

URL 保持 `/tracker/` 不变（SEO 不断链）。

---

## 十三、不做的事（YAGNI）

- **不做雷达图**：评级是离散值（A/B/C），雷达图轴不适合
- **不做 sparkline / 时间序列图**：需要历史快照数据，先不写。v2 再加
- **不做自动化抓取**：评级是编辑产物
- **不做 RSS / Email**：v3 再说
- **不删现有 metrics 数据**：80+ 条全部按维度归类保留
- **不重命名路径**：保持 `/tracker/`

---

## 十四、实现 MVP 边界

一步到位（Luca 已确认）。MVP 包含：

1. 数据：`src/data/tracker.ts` 完全重写（6 维度评级 + 全部 metrics 归类）
2. 卡片墙首页 + Hero
3. 6 个维度详情页（动态路由 `[dim].astro`）
4. Methodology 页
5. EN 版（双字段全套 + EN 路由）
6. 导航改名
7. 首页"AI 评判摘要"模块
8. 维度详情页底部的关联区——若现有 `RelatedRail` / `entity-pages.ts` 工具支持，复用并加 `dimension` 类型；若不支持，MVP 用静态卡片列表渲染 `relatedLeverNumbers` / `relatedPolicyIds` / `relatedDebateIds` / `relatedPostSlugs`，反向引用（lever → dimension 等）放 v2

不在 MVP：
- sparkline、雷达图
- 自动化数据抓取
- RSS / 邮件

---

## 十五、验收标准

- [ ] `npm run check` 全过（astro + eslint + prettier + graph）
- [ ] `npm run build && node scripts/i18n-check.mjs` 全过（EN 页面无中文残留）
- [ ] 6 维度卡片在首页正确展示评级 + 趋势 + 核心数字
- [ ] 6 个详情页（zh + EN 各 6）正确渲染：评级三因子 + rationale + shortcoming + 完整数据表 + 关联
- [ ] Methodology 页（zh + EN）渲染完整方法论
- [ ] 80+ 条 metrics 全部归类，无遗漏
- [ ] 首页"AI 评判摘要"模块工作
- [ ] 导航改名生效
- [ ] `src/version.ts` 更新版本号和日期

---

## 十六、待 Luca 审核的地方

代笔评级和文案集中在 §六 和 §九。**Luca 审核 checklist**：

- [ ] 总评 **A-** 准不准？太高 / 太低 / 刚好？
- [ ] 6 维度评级（投入 A · 人才 B · 算力 A- · 渗透 B+ · 研究 B+ · 治理 A）每条同意 / 调高 / 调低？
- [ ] 6 个 `rationale`（评级理由）措辞是否同意？
- [ ] 6 个 `shortcoming`（关键短板）措辞是否同意？是否有遗漏的关键短板？
- [ ] 治理卡的 `judgment`（核心判断 60–100 字）是否抓得准？
- [ ] Hero 的"一句话定位"措辞是否同意？
- [ ] Methodology 页的"关于 sgai 编辑"段落（独立、不接受资助、欢迎挑战）措辞是否同意？

中文审完之后 EN 翻译我代笔再让 Luca 终审。
