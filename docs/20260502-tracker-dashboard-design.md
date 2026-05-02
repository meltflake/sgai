# Tracker 改造方案：观察仪表盘（Dashboard）

日期：2026-05-02
状态：proposal（待审核）
取代：`docs/20260502-tracker-redesign.md`（"信号雷达"方向不再采用，定调改为"观察仪表盘"）
关联文件：`src/data/tracker.ts`、`src/pages/tracker/index.astro`、`src/data/levers.ts`、`src/data/policies.ts`、`src/navigation.ts`

---

## 一、定位

> **6 维度呈现新加坡 AI 的真实状态——数字、参照系、目标进度、趋势、编辑解读。让访客自己判断"做得好不好"，sgai 不打分。**

不是指标参考表（80 条数字罗列），不是信号雷达（编辑追踪 5–10 条动态），不是评级仪表盘（A/B/C 打分），而是 **6 维度观察仪表盘**——每个维度有核心数字 + 第三方排名锚 + 目标完成度 + 趋势 + 编辑解读 + 关键短板。

**不打分**是核心原则。理由：
- sgai 是观察站，不是评级机构。打分是把多维事实压缩到单一刻度，会损失张力
- 评级让访客停止思考（"哦 A- 还行"），仪表盘应该让人**点进去看**
- CSIS / Stanford AI Index / Tortoise 都不打总评分，只列子项 + 文字分析。这是有道理的

### 与现有页面的职能划分

| 页面     | 职能           | 节奏     | 形态                                |
| -------- | -------------- | -------- | ----------------------------------- |
| levers   | 稳态结构地图   | 季度级   | 6 抓手 × 子分组 × 项目              |
| tracker  | **观察仪表盘** | 季度级   | **6 维度数字+解读卡 + 详情页**     |
| policies | 文件清单       | 文件级   | 政策文件目录                        |
| timeline | 历史回溯       | 事件级   | 时间线                              |

四者互补：levers 看"有什么"、tracker 看"现在怎样"、policies 看"规则是什么"、timeline 看"发生过什么"。

---

## 二、呈现方法（不评级）

每个维度的卡片由 5 个元素组成，让数字 + 编辑解读自己说话：

1. **核心数字**（headline）——这维度最该被看到的 1–2 个数字
2. **参照系**（benchmark）——和谁比、差多少、领先多少
3. **目标进度**（progress，如适用）——vs 政府发布的明确目标（15K AI 专才 by 2029 等）
4. **第三方排名锚**（rankingAnchors）——Tortoise / Oxford / WIPO / Stanford / Microsoft 这些已有的国际排名
5. **趋势箭头**（trend ↗ → ↘）——动量

文字部分两段：

- **编辑解读**（judgment, 50–80 字）——这些数字代表什么状态、值得关注什么。**不是"为什么是 A"**，而是"这个数字意味着什么"
- **关键短板**（shortcoming, 20–60 字）——这维度公开数据没说的盲点 / 风险 / 结构性问题

### 没有的东西

- 没有 A/B/C 评级
- 没有总评分
- 没有"切分线"——不需要决定 B+ 和 A- 的区别在哪
- 没有"评级理由"——只有"数字解读"

### 编辑透明度

每张卡的解读和短板由 sgai 编辑团队 @meltflake 撰写。在 methodology 页和卡片底部明确标注 **"sgai 编辑解读 · YYYY-MM-DD"**——不是中立第三方，是有立场的观察站，但立场体现在"选哪些数字、怎么解读"，不体现在"打几分"。

### 复评节奏

季度复评（每 3 个月）。重大事件触发即时更新数字 + 解读。`methodology` 页留 changelog。

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
/tracker/methodology/              # 方法论页（怎么选指标、怎么写解读）

/en/tracker/、/en/tracker/<dimension>/、/en/tracker/methodology/
```

路径保留 `/tracker/`（SEO 不断链）。

### 文件清单

```
src/data/tracker.ts                # 重写：dashboard schema + 6 维度数据 + 全部 metrics（按维度归类）
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

- 中文显示名：`落地执行追踪器` → **`新加坡 AI 观察仪表盘`**（或 `AI 仪表盘`）
- EN 显示名：`Tracker` → **`Singapore AI Dashboard`**

`src/navigation.ts` 同步改名。

---

## 四、数据模型

完全替换现有 `TrackerSection` / `TrackerRow`。

```ts
// src/data/tracker.ts

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

/**
 * 目标完成度。
 * 两种形态：
 * - 结构化（current + target + pct）：talent 维度可用，渲染进度条
 * - 描述性（仅 description）：其他维度多用，因政府未必发布精确量化总目标
 */
export interface ProgressAgainstTarget {
  /** 结构化形态：当前值 */
  current?: string;
  currentEn?: string;
  /** 结构化形态：目标值 */
  target?: string;
  targetEn?: string;
  /** 0–100，存在则 UI 渲染进度条；否则仅显示文字 */
  pct?: number;
  /** 描述性形态：当 current/target 难以精确量化时使用，如"政府 AI 专项 > S$2B + Budget 2026 又加码" */
  description?: string;
  descriptionEn?: string;
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

  trend: Trend;

  // 卡片正面三块
  headline: string;         // 大数字 / 核心指标，如 "S$139/人"
  headlineEn?: string;
  benchmark: string;        // 参照系，如 "vs US $33 / 中国 $7"
  benchmarkEn?: string;
  progress?: ProgressAgainstTarget; // 可空

  // 详情页用
  rankingAnchors: RankingAnchor[]; // 第三方排名（1–3 个）
  judgment: string;         // 编辑解读（50–80 字）：这些数字代表什么状态
  judgmentEn?: string;
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

/** 文字判断型卡片：治理（数字少、判断多） */
export interface QualitativeDimension {
  id: DimensionId;
  kind: 'qualitative';
  icon: string;
  title: string;
  titleEn?: string;
  oneLiner: string;
  oneLinerEn?: string;

  trend: Trend;

  // 卡片正面：替代大数字的"一词定位" + 核心判断
  badge: string;            // "规则制定者"
  badgeEn?: string;
  judgment: string;         // 卡片正面核心判断 60–100 字
  judgmentEn?: string;

  // 详情页用
  rankingAnchors: RankingAnchor[]; // 仍然引用第三方
  shortcoming: string;
  shortcomingEn?: string;

  metrics: MetricRow[];
  relatedLeverNumbers?: number[];
  relatedPolicyIds?: string[];
  relatedDebateIds?: string[];
  relatedPostSlugs?: string[];
}

export type Dimension = QuantifiedDimension | QualitativeDimension;

/** Hero 顶部综述 */
export interface OverallSummary {
  oneLiner: string;         // 一句话定位（描述性，不打分）
  oneLinerEn?: string;
  asOf: string;             // YYYY-MM-DD
  topRankings: RankingAnchor[]; // Hero 横排参照（4 条）
  methodologyNote: string;  // 一句话方法说明 + 链到 methodology
  methodologyNoteEn?: string;
}

export const dataDate = '2026-05-02';

// 实际值：§五 Hero 文案对应的字面量
export const overallSummary: OverallSummary = { /* 见 §五 */ };

// 6 个维度的实际数据：§六各维度小节给出完整字段
export const dimensions: Dimension[] = [ /* 6 个，见 §六 */ ];
```

### 字段约束（i18n）

含 CJK 的字段必须配 `*En`（遵 `docs/i18n.md`）。`metrics` 数组继承现有数据的 `*En` 字段。EN 页面渲染走 `pickLocalized()` 或 `field.titleEn || field.title`。

---

## 五、Hero 设计（首页顶部）

```
┌─────────────────────────────────────────────────────────────────┐
│ 🇸🇬  新加坡 AI 观察仪表盘                                          │
│                                  数据更新 · 2026-05-02            │
│                                                                 │
│ 6 个维度看新加坡 AI：投入强、治理强、基建强；人才自给率低、      │
│ 原创研究偏少是结构性短板。数字和编辑解读各自呈现，访客自己判断。 │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│  Tortoise #3 · Oxford #2 · Microsoft Adoption #2 · WIPO #5     │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│  方法说明：每个维度呈现核心数字 + 第三方排名 + 目标进度 + 趋势   │
│            + 编辑解读，不打总评分。 → 详细方法论                  │
└─────────────────────────────────────────────────────────────────┘
```

### Hero 完整文案（中文）

- **标题**：新加坡 AI 观察仪表盘
- **一句话综述**：6 个维度看新加坡 AI：投入强、治理强、基建强；人才自给率低、原创研究偏少是结构性短板。数字和编辑解读各自呈现，访客自己判断。
- **国际参照横排**（4 条）：
  - Tortoise Global AI Index 2024 · #3
  - Oxford Government AI Readiness 2024 · #2
  - Microsoft AI Adoption 2026 · #2（60.9%）
  - WIPO Global Innovation Index 2025 · #5
- **方法说明**：每个维度呈现核心数字 + 第三方排名 + 目标进度 + 趋势 + 编辑解读，不打总评分。详见方法论。

---

## 六、6 个维度卡片设计与文案

### 卡片视觉规则

- 量化卡 vs 文字判断卡 **同尺寸、同视觉权重**，但内部布局不同
- 卡片正面共有元素：图标、维度名、一句话问题、趋势箭头、第三方锚一条
- 卡片正面差异：量化卡显大数字 + benchmark + 进度条；文字判断卡显 badge + 核心判断
- **没有评级显示**，所有维度卡片体量上无主次
- 整张卡可点击 → 维度详情页

### 维度 1：投入强度（量化）

```
┌────────────────────────────────────┐
│ 💰  投入强度       政府舍得花钱吗？ │
│                                    │
│  S$139/人      ↗                   │
│  ████████████░░  US 的 4.2 倍      │
│                                    │
│  vs US $33 · 中国 $7               │
│                                    │
│  Stanford AI Index 人均政府投入前列│
│                                    │
│  〔解读〕政府 AI 专项已超 S$2B、    │
│  Budget 2026 又加码（400% 税收     │
│  激励、S$1.5B FSDF）。资金强度全球 │
│  第一梯队，但私募跟投比例偏低，    │
│  仍以政府推为主。                  │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `investment`
- `icon`: 💰
- `title`: 投入强度
- `oneLiner`: 政府舍得花钱吗？
- `trend`: ↗
- `headline`: S$139/人
- `benchmark`: vs US $33 / 中国 $7（人均）
- `progress`: 政府 AI 专项 > S$2B（NAIS 2.0 + 公共 AI 研究 2026–2030 + ECI），无明确总目标，故展示"超额节奏"
- `rankingAnchors`:
  - Stanford AI Index 2025 · 人均政府 AI 投入全球前列
  - Budget 2026 · 400% AI 税收激励（创新政策）
- `judgment`：人均 S$139 是美国 4.2 倍、中国 19 倍。Budget 2026 在已有 S$2B 基础上加 S$70M Multimodal LLM、S$1.5B FSDF、400% 税收激励——节奏不放缓。RIE2030 总盘 S$37B 兜底未来 5 年。资金强度处于全球第一梯队。
- `shortcoming`：私有部门跟投比例偏低，仍是政府推为主；钱花在算力和大企业上较多，SME 端补贴渗透不够；估算和披露口径偶尔不一致，跨年比较要小心。

### 维度 2：人才储备（量化）

```
┌────────────────────────────────────┐
│ 👩‍💻  人才储备     人够不够、自给率？│
│                                    │
│  5,000 / 15,000   ↗                │
│  ████░░░░░░░  33%（目标 2029）     │
│                                    │
│  外籍占比 35% · TeSA 21K 安置      │
│                                    │
│  Tortoise Talent ~#6–8             │
│                                    │
│  〔解读〕盘子在涨——SkillsFuture   │
│  105K、TeSA 21K、AIAP 22 批毕业    │
│  ~500–600 人——但 33% 完成度和    │
│  35% 外籍占比说明自给率仍是结构性  │
│  问题。                            │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `talent`
- `icon`: 👩‍💻
- `title`: 人才储备
- `oneLiner`: 人够不够、自给率多少？
- `trend`: ↗
- `headline`: 5,000 / 15,000
- `benchmark`: 目标 2029 完成 33%（外籍占比 35%）
- `progress`: { current: "5,000", target: "15,000 by 2029", pct: 33 }
- `rankingAnchors`:
  - Tortoise Global AI Index Talent 子项 ~#6–8
  - SkillsFuture · 105K 人 / 1,600 课程（2025）
  - TeSA · 21K 本地人就业 + 340K 技能提升
- `judgment`：盘子在涨——SkillsFuture 105K 入读、TeSA 安置 21K、AIAP 22 批毕业 ~500–600 人——但目标完成度 33% 和外籍占比 35% 说明自给率仍是结构性问题。Tortoise Talent 子项在 #6–8 区间，距离美国差一截。
- `shortcoming`：AIAP 60 人/批是产能瓶颈；本地名校 AI 博士流失率高（去美/去工业界）；"AI Bilingual 100K" H1 2026 才上线（会计/法律首批），效果未知；非工程岗位（产品、设计、销售）培训供给薄弱。

### 维度 3：算力底座（量化）

```
┌────────────────────────────────────┐
│ 🖥️  算力底座     跑得起前沿模型吗？ │
│                                    │
│  1.4 GW       →                    │
│  数据中心容量 + 70+ 设施           │
│                                    │
│  NSCC 20 PFLOPS · GPU 集群完整     │
│                                    │
│  Tortoise Infrastructure #2        │
│                                    │
│  〔解读〕NSCC ASPIRE 2A+（H100）+ │
│  商用集群 + GPU-as-a-Service +     │
│  HTX SuperPOD——分层覆盖完整。    │
│  电力配额是天花板，扩张速度由能源  │
│  决定，不由钱决定。                │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `compute`
- `icon`: 🖥️
- `title`: 算力底座
- `oneLiner`: 跑得起前沿模型吗？
- `trend`: →
- `headline`: 1.4 GW
- `benchmark`: 数据中心容量 + 70+ 设施 + NSCC ASPIRE 2A+ 20 PFLOPS
- `progress`: 额外 300MW 已分配 + 80MW 试点 2026–2028（增量在路上，但电力是天花板）
- `rankingAnchors`:
  - Tortoise Global AI Index Infrastructure · #2
  - NVIDIA Singapore · 占全球营收 15%（人均 $600）
  - 全球数据中心市场 · $4.16B（2024）
- `judgment`：NSCC ASPIRE 2A+（H100, 20 PFLOPS）+ 商用集群（SMC 2,048 H100/集群）+ Singtel GPU-as-a-Service + 国家计算网格 + HTX NGINE B200 SuperPOD——分层覆盖完整，企业、科研、政府自用都够用。Tortoise 基建排 #2，仅次美国。趋势 → 而非 ↗ 是因为电力配额是天花板。
- `shortcoming`：电力配额 vs 绿电承诺的张力会卡未来 5 年扩张；前沿芯片（H100/B200）依赖进口，地缘风险存在；自研芯片或定制 ASIC 缺位；东南亚邻国（马来西亚、印尼）正在抢容量，新加坡的"算力中心"地位不是天然的。

### 维度 4：产业渗透（含政府自用）（量化）

```
┌────────────────────────────────────┐
│ 🏢  产业渗透     企业真在用吗？     │
│                                    │
│  62.5% 大企业 / 14.5% SME    ↗     │
│                                    │
│  SME YoY 3 倍（2023 4.2%→2024 14.5%)│
│                                    │
│  Microsoft AI Adoption #2 (60.9%)  │
│                                    │
│  〔解读〕大企业达标——Microsoft   │
│  全球 #2、DBS 800+ 模型 / S$750M   │
│  价值。SME 14.5% 是真涨但绝对值仍  │
│  低，离普及还远。政府自用案例厚但  │
│  公开渗透率有限。                  │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `adoption`
- `icon`: 🏢
- `title`: 产业渗透
- `oneLiner`: 企业真在用吗？
- `trend`: ↗
- `headline`: 62.5% 大企业 / 14.5% SME
- `benchmark`: SME YoY 3 倍增长（2023 4.2% → 2024 14.5%）
- `progress`: NAIIP 目标 10K 企业 + 100K 工人（2026–2029）
- `rankingAnchors`:
  - Microsoft AI Economy Institute 2026 · 全球第 2（60.9%，仅次 UAE）
  - 数字经济占 GDP · 18.6%（2024，2019 14.9%）
  - DBS · 800+ 模型、350+ 用例、2024 年创造 S$750M 经济价值
- `judgment`：大企业达标——Microsoft 测全球 #2、DBS 等头部样板成熟。SME 14.5% YoY 3 倍是真增长，但绝对值仍低，离普及还远。政府自用（Pair / AIBots / VICA）目标 150K 公务员、Note Buddy 5K 医护、AV 巴士、ISO/IEC 42001 全球首张——案例厚但公开渗透率有限。
- `shortcoming`：SME 14.5% 看起来涨快、绝对值仍低，普惠 AI 还要 2–3 年；政府自用以效率工具为主，决策类 AI 渗透浅；NAIIP 拨款规模未公开，执行力存疑；政府公开渗透率仅有目标无进度，对账困难。

**政府自用子项处理**：不新增 schema 字段，而是在详情页 `metrics` 表里加一个 `category` 子分组（"企业采用" / "政府自用"），用现有的 `MetricRow` 数据自然分组展示。

> Schema 调整：`MetricRow` 增加可选字段 `category?: string` / `categoryEn?: string`，仅 adoption 维度用到。

### 维度 5：研究质量（量化）

```
┌────────────────────────────────────┐
│ 🔬  研究质量     有真东西出来吗？   │
│                                    │
│  人均论文 #1   →                   │
│  NTU AI #3 · NUS AI #9             │
│                                    │
│  SEA-LION v4 · ICLR 2025 主办      │
│                                    │
│  Wiley 2024 / CSRankings           │
│                                    │
│  〔解读〕产出量级和学校排名硬——  │
│  人均论文 #1、NTU AI #3、NUS #9、  │
│  ICLR 2025 主办、SEA-LION 是少有  │
│  的非英美中基座模型。但顶级原创   │
│  （FAIR/DeepMind 级）仍少一档。    │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `research`
- `icon`: 🔬
- `title`: 研究质量
- `oneLiner`: 有真东西出来吗？
- `trend`: →
- `headline`: 人均论文全球 #1
- `benchmark`: NTU AI #3（仅次 MIT/CMU）· NUS AI #9
- `progress`: SEA-LION v4（11 语言、4B–33B 参数）+ 100E 100+ 项目 + ICLR 2025 主办
- `rankingAnchors`:
  - Wiley 2024 · 人均 AI 论文全球 #1（每百万人 250 篇，2022）
  - CSRankings AI · NTU #3
  - QS · NUS AI #9
- `judgment`：产出量级和学校排名都很硬——人均论文 #1、NTU AI #3、NUS #9、ICLR 2025 主办、SEA-LION 是少有的非英美中有规模的基座模型。但顶级原创（FAIR/DeepMind 级 frontier work）仍少一档：顶会一作占比、被引大于 1000 的代表作、自研基座的市场份额都还差。
- `shortcoming`：顶会一作占比、被引数、自研基座市场份额都还差一档；顶尖博士流失率高；产学研转化对企业自用强但对外输出弱（无 OpenAI / Anthropic 量级的 spinoff）；原创研究的国际可见度依赖少数明星教授。

### 维度 6：治理影响力（文字判断）

```
┌────────────────────────────────────┐
│ 🌐  治理影响力   规则上是不是话事人？│
│                                    │
│  规则制定者     ↗                  │
│                                    │
│  Singapore Consensus 11 国签、     │
│  ASEAN AI 指南主导起草、AI Verify  │
│  Foundation 全球采纳——新加坡是   │
│  规则制定者而非接受者，话语权显著  │
│  超出体量。                        │
│                                    │
│  Oxford Gov AI Readiness #2        │
└────────────────────────────────────┘
```

**完整文案**：

- `id`: `governance`
- `kind`: `qualitative`
- `icon`: 🌐
- `title`: 治理影响力
- `oneLiner`: 规则上是不是话事人？
- `trend`: ↗
- `badge`: 规则制定者
- `judgment`：Singapore Consensus on AI Safety 11 国签署（含中美）、ASEAN Guide on AI Governance 10 国采纳（新加坡主导起草）、AI Verify Foundation 在全球被引、REAIM 联合主办、ISESEA 已办两届——新加坡是规则制定者而不是接受者，话语权显著超出体量。Bletchley、Seoul、Paris 三届 AI Safety Summit 全程参与；MAS Project MindForge 拉到 24 家机构 + 四大云厂；UN Independent International Scientific Panel 有席位。
- `rankingAnchors`:
  - Oxford Government AI Readiness 2024 · #2（仅次美国）
  - Singapore Consensus · 11 国签署
  - ASEAN Guide on AI Governance · 10 国采纳
- `shortcoming`：规则制定 ≠ 规则被遵守——AI Verify 框架被采纳但执法层面影响力弱；中美 AI 治理分裂时新加坡的"居间者"定位可持续性存疑——任一方要求选边，回旋空间会塌；治理研究投入（AISI S$10M/年）和影响力规模不匹配，结构性投入偏轻。

---

## 七、维度详情页（标准版）

每个维度页 `/tracker/<dim>/` 结构：

```
┌─ Hero ────────────────────────────────────┐
│ 🔬 研究质量                                │
│                                            │
│  →   有真东西出来吗？                       │
│                                            │
│ sgai 编辑解读 · 2026-05-02                 │
└────────────────────────────────────────────┘

┌─ 核心数字 + 锚点 ──────────────────────────┐
│ 〔核心数字〕人均论文 #1（Wiley 2024）       │
│ 〔参照系〕NTU AI #3 · NUS AI #9             │
│ 〔进度/案例〕SEA-LION v4 · 100E · ICLR 2025│
│ 〔趋势〕→                                   │
│                                            │
│ 〔第三方锚〕                                │
│ · 人均论文 #1（Wiley 2024）↗              │
│ · NTU AI #3（CSRankings）↗                │
│ · NUS AI #9（QS）↗                        │
└────────────────────────────────────────────┘

┌─ 编辑解读 ─────────────────────────────────┐
│ 〔解读〕[judgment]                          │
│ 〔关键短板〕[shortcoming]                   │
└────────────────────────────────────────────┘

┌─ 完整数据表 ──────────────────────────────┐
│ [本维度全部 metrics 表格]                   │
└────────────────────────────────────────────┘

┌─ 关联 ─────────────────────────────────────┐
│ Levers: [3 治理 / 5 政府自用]               │
│ Policies: [NAIS 2.0 / NAIIP]                │
│ Debates: [...]                              │
│ Posts: [...]                                │
└────────────────────────────────────────────┘
```

详情页是 dimension 数据的全展开。

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

- 投资里的 **Microsoft / AWS / Google 数据中心投资**（3 条）→ `compute`（性质属算力底座）；金额本身在 `investment` 完整数据表也保留（双挂）
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
# 方法论

## 我们做什么

新加坡 AI 观察仪表盘**呈现**新加坡 AI 的真实状态——用数字、第三方排名、目标进度、趋势，加上 sgai 编辑团队对每个维度的解读。

**我们不打分**。

## 为什么不打分

- sgai 是观察站，不是评级机构。打分是把多维事实压缩到单一刻度，会丢失最有价值的张力（强投入 vs 弱原创、强治理 vs 弱执法）
- 评级让访客停止思考——看到 A- 就觉得"还行"，不再点进去看依据。仪表盘的价值在于让访客**点进去看数字、看解读、自己得结论**
- 国际上做得最严肃的观察机构（CSIS、Stanford AI Index、Tortoise）都不打总评分，只列子项 + 文字分析

## 每个维度呈现什么

每张卡由 5 个数据元素 + 2 段编辑文字组成：

### 数据元素

1. **核心数字**——这维度最该被看到的 1–2 个数字
2. **参照系**——和谁比、差多少、领先多少
3. **目标进度**（如适用）——vs 政府发布的明确目标（15K AI 专才 by 2029、150K 公务员 Pair、10K 企业 NAIIP）
4. **第三方排名锚**——Tortoise / Oxford / WIPO / Stanford / Microsoft 等已有的国际排名
5. **趋势箭头**（↗ → ↘）

### 编辑文字

- **解读**（50–80 字，治理卡因数字少所以更长）：这些数字代表什么状态、值得关注什么。**不是"为什么是 A"**，而是"这意味着什么"
- **关键短板**（20–60 字）：公开数据没说的盲点 / 风险 / 结构性问题

## 我们引用的第三方排名

- **Tortoise Global AI Index** — 综合实力（投资 + 实施 + 创新）
- **Oxford Government AI Readiness Index** — 政府就绪度
- **Microsoft AI Economy Institute** — 企业 AI 采用率
- **Stanford AI Index** — 投资 + 学术产出
- **WIPO Global Innovation Index** — 创新生态
- **CSRankings / QS** — 学术研究

## 我们引用的政府目标

- NAIS 2.0：15,000 AI 专才 by 2029
- NAIIP：10,000 企业 + 100,000 工人（2026–2029）
- GovTech Pair：150,000 公务员
- 公共 AI 研究 2026–2030：S$1B+
- Smart Nation 2.0：S$270M 下一代超算（2025 年底投运）

## 复评节奏

- **常规**：季度复评（每 3 个月）
- **触发**：Budget、重大政策发布、年度排名更新（Tortoise / Oxford 等）
- 每次复评的数字和解读变更记在本页底部 changelog

## 关于 sgai 编辑

仪表盘由 sgai（Singapore AI Observer）编辑团队 @meltflake 维护。我们**不是中立第三方**，是有立场的观察站：

- **不接受任何政府或企业资助**——选指标和写解读独立于资金影响
- **立场体现在选哪些数字、怎么解读**，不体现在打几分
- **公开依据**——每张卡的数字源、第三方排名、政府目标都附 URL，可追溯
- **承认局限**——我们读得到的是公开数据，企业内部和政府内部的实际进度可能与公开值有差距
- **欢迎挑战**——发现数字过期、解读偏差、有更好的指标，请发邮件 / 提 issue

## Changelog

- 2026-05-02 · v1.0 仪表盘上线，6 维度初始数据 + 解读
```

EN 版同步翻译，spec 写定后批量补。

---

## 十、首页摘要挂法

`src/pages/index.astro` 的 hero 下增加"AI 仪表盘速览"模块（取代或并列现有"功能板块入口"）：

```
┌────────────────────────────────────┐
│ 🇸🇬 新加坡 AI 仪表盘                │
│ 投入 · 人才 · 算力 · 渗透 · 研究 · 治理│
│ 6 维度看现状 → 完整仪表盘           │
└────────────────────────────────────┘
```

数据来源 `tracker.ts` 的 `overallSummary` + `dimensions[].title` + `dimensions[].trend`——单一数据源，仪表盘改首页跟着改。

不展示评级（因为没有评级），可选展示 6 维度的趋势箭头一行，给访客一眼看到"哪个维度在涨/在停"。

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

- 中文：`落地执行追踪器` → `AI 观察仪表盘` 或 `新加坡 AI 仪表盘`
- EN：`Tracker` → `AI Dashboard` 或 `Singapore AI Dashboard`

URL 保持 `/tracker/` 不变（SEO 不断链）。

---

## 十三、不做的事（YAGNI）

- **不做评级**（A/B/C 总评）——观察站的核心动作是呈现 + 解读，不是打分
- **不做雷达图 / sparkline**：评级删了之后雷达图无意义；时序图需要历史快照数据
- **不做自动化抓取**：解读是编辑产物
- **不做 RSS / Email**：v3 再说
- **不删现有 metrics 数据**：80+ 条全部按维度归类保留
- **不重命名路径**：保持 `/tracker/`

---

## 十四、实现 MVP 边界

一步到位（Luca 已确认）。MVP 包含：

1. 数据：`src/data/tracker.ts` 完全重写（6 维度数据 + 全部 metrics 归类）
2. 卡片墙首页 + Hero
3. 6 个维度详情页（动态路由 `[dim].astro`）
4. Methodology 页
5. EN 版（双字段全套 + EN 路由）
6. 导航改名
7. 首页"AI 仪表盘速览"模块
8. 维度详情页底部的关联区——若现有 `RelatedRail` / `entity-pages.ts` 工具支持，复用并加 `dimension` 类型；若不支持，MVP 用静态卡片列表渲染 `relatedLeverNumbers` / `relatedPolicyIds` / `relatedDebateIds` / `relatedPostSlugs`，反向引用（lever → dimension 等）放 v2

不在 MVP：
- sparkline、雷达图、评级
- 自动化数据抓取
- RSS / 邮件

---

## 十五、验收标准

- [ ] `npm run check` 全过（astro + eslint + prettier + graph）
- [ ] `npm run build && node scripts/i18n-check.mjs` 全过（EN 页面无中文残留）
- [ ] 6 维度卡片在首页正确展示数字 + 趋势 + 编辑解读片段
- [ ] 6 个详情页（zh + EN 各 6）正确渲染：核心数字 + 第三方锚 + 编辑解读 + 短板 + 完整数据表 + 关联
- [ ] Methodology 页（zh + EN）渲染完整方法论，明确说明"不打分"
- [ ] 80+ 条 metrics 全部归类，无遗漏
- [ ] 首页"AI 仪表盘速览"模块工作（不展示评级）
- [ ] 导航改名生效
- [ ] `src/version.ts` 更新版本号和日期

---

## 十六、待 Luca 审核的地方

代笔的解读和短板集中在 §六 和 §九。**Luca 审核 checklist**：

- [ ] **Hero 一句话综述**："6 个维度看新加坡 AI：投入强、治理强、基建强；人才自给率低、原创研究偏少是结构性短板。数字和编辑解读各自呈现，访客自己判断。"——同意吗？
- [ ] 6 个维度的 **judgment（编辑解读）** 措辞是否同意？是否抓得准？
- [ ] 6 个维度的 **shortcoming（关键短板）** 是否有遗漏的关键短板？
- [ ] 治理卡的 `judgment`（核心判断 ~120 字）是否抓得准？
- [ ] **6 个维度的 oneLiner（一句话问题）**：政府舍得花钱吗 / 人够不够、自给率多少 / 跑得起前沿模型吗 / 企业真在用吗 / 有真东西出来吗 / 规则上是不是话事人——措辞同意吗？
- [ ] **Methodology** 里"为什么不打分"的论述是否同意？"关于 sgai 编辑"段落（独立、不接受资助、欢迎挑战）措辞是否同意？

中文审完之后 EN 翻译我代笔再让 Luca 终审。
