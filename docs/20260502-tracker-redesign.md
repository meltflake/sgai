# Tracker 改造方案：从"指标参考表"到"政策信号追踪器"

日期：2026-05-02
状态：**superseded**（被 `20260502-tracker-dashboard-design.md` 取代）

> 本文档保留作为历史记录。"信号雷达"方向在第二轮 brainstorm 中被替换为"评判仪表盘"——见 `docs/20260502-tracker-dashboard-design.md`。
关联：`src/data/tracker.ts`、`src/pages/tracker/index.astro`、`src/data/levers.ts`

## 一、问题诊断

当前 `/tracker/` 是一张静态的指标参考表（投资数字 / 人才数量 / 算力规模分类堆叠），三个致命弱点：

1. **没有时间维度**：所有数字是"截至 X 年的累计值"，看不出最近 3 个月发生了什么。
2. **没有判断**：每条只有名称 + 数值 + 来源，等同于政府统计公报。
3. **位置错配**：放在"Data"下其实更像 references 的兄弟（参考资料），而不是真正的"追踪器"——追踪应该追**变化**，不是追**状态**。

加上和 `levers.ts` / `policies.ts` / `timeline.ts` 数据有大量重叠（Microsoft S$5.5B、AWS S$12B、AISG 拨款……），存在感被稀释。

## 二、改造定位

> **追踪当下最值得盯的 5–10 个新加坡 AI 政策信号，每个有状态、有解读、有连接到 sgai 其他页面的根。**

不是"全景仪表盘"，是**编辑精选的雷达屏**。判断力 > 全面性。

与 `levers` 的职能划分：

| 页面     | 职能       | 节奏           |
| -------- | ---------- | -------------- |
| levers   | 稳态结构   | 季度级更新     |
| tracker  | 动态信号   | 周/月级更新    |
| timeline | 历史回溯   | 事件后归档     |
| policies | 文件清单   | 文件发布时更新 |

四者关系清晰互补，不再重叠。

## 三、数据结构

替换现有 `TrackerSection` / `TrackerRow`，新建 `Signal`：

```ts
// src/data/signals.ts
export type SignalStatus = 'breaking' | 'active' | 'in-progress' | 'watching' | 'resolved';
export type SignalPriority = 'core' | 'structural' | 'emerging';

export interface SignalEvent {
  date: string;        // YYYY-MM-DD
  note: string;
  noteEn?: string;
  sourceUrl?: string;
}

export interface Signal {
  id: string;          // kebab-case
  title: string;
  titleEn?: string;

  // 信号本身
  whatHappened: string;       // 一句话：发生了什么 / 在追什么
  whatHappenedEn?: string;
  asOf: string;               // 最近一次更新（YYYY-MM-DD）

  // 元数据
  leadAgency: string;         // 主导机构（MDDI / IMDA / MOM / NTUC ...）
  leadAgencyEn?: string;
  leverNumber?: 1 | 2 | 3 | 4 | 5 | 6;  // 关联 levers 哪个抓手
  status: SignalStatus;
  priority: SignalPriority;

  // 编辑判断（tracker 真正的价值）
  whyItMatters: string;       // 2–3 句：为什么这个信号重要
  whyItMattersEn?: string;
  whatToWatch: string;        // 接下来盯什么 / 还没解决的问题
  whatToWatchEn?: string;

  // 时间线
  events: SignalEvent[];

  // 连接到 sgai 的根
  relatedPolicyIds?: string[];
  relatedDebateIds?: string[];
  relatedLeverItemIds?: string[];
  relatedPostSlugs?: string[];
}

export const dataDate = '2026-05-02';
export const signals: Signal[] = [
  // ...
];
```

### 字段约束

- `whatHappened`、`whyItMatters`、`whatToWatch` **三段都不可为空**——这是信号区别于普通条目的核心。如果某条只有事实没有判断，它就该进 `timeline` 而不是 `tracker`。
- `events` 至少 1 条，按时间倒序。
- 有 CJK 的字段必须配套 `*En` 字段（遵循 `docs/i18n.md`）。
- `leverNumber` 可空，但建议尽量补——能复用 levers 的导航和上下文。

## 四、第一批信号（10 条种子）

| #   | Signal                                        | Status      | Lever     |
| --- | --------------------------------------------- | ----------- | --------- |
| 1   | NAIS 2.0 落地进度                             | active      | 治理      |
| 2   | NAIIP 行业落地节奏                            | in-progress | 应用      |
| 3   | AI Verify / GenAI Sandbox 采用率              | active      | 治理      |
| 4   | 三方就业委员会 + AI-Ready SG                  | in-progress | 人才      |
| 5   | MAS FEAT / Veritas 对金融业的执法姿态         | watching    | 治理      |
| 6   | Pair / AIBots / VICA 政府自用渗透率           | active      | 政府自用  |
| 7   | 数据中心电力配额（绿色电力 vs AI 算力张力）   | watching    | 基建      |
| 8   | 黄循财 2026 五一演讲后的政策跟进              | breaking    | 人才      |
| 9   | OpenAI / Anthropic / Google 区域布局          | active      | 外交      |
| 10  | National Multimodal LLM 计划进展              | in-progress | 基建      |

每个信号是**一个故事线**，不是一个数字。

## 五、页面布局

```
┌────────────────────────────────────────────────────┐
│ 📡 政策信号追踪器                                   │
│ 当下最值得盯的 N 个新加坡 AI 政策信号               │
│ 数据更新：YYYY-MM-DD                                │
└────────────────────────────────────────────────────┘

[筛选器]  状态: 全部 | breaking | active | watching
          抓手: 全部 | 1 基建 | 2 治理 | 3 人才 ...

┌─ 🔴 BREAKING ─────────────────────────────────────┐
│ 黄循财 2026 五一演讲——AI 转型的工人协议            │
│ 主导：PMO / NTUC · 抓手 3 · 更新 2026-05-01        │
│ 〔发生了什么〕 一句话                                │
│ 〔为什么重要〕 2–3 句编辑判断                        │
│ 〔接下来盯什么〕 三个待解的问题                      │
│ 〔时间线〕                                            │
│   2026-05-01 · 演讲全文 ↗                            │
│   2026-04-15 · NTUC 三方协议草案 ↗                   │
│ 〔关联〕 政策 X · 辩论 Y · 杠杆 3.2 · 文章 Z         │
└────────────────────────────────────────────────────┘

┌─ 🟢 ACTIVE ───────────────────────────────────────┐
│ NAIIP 行业落地节奏                                  │
│ ...                                                 │
└────────────────────────────────────────────────────┘
```

### 排序规则

按 `(status 优先级, priority 优先级, asOf 倒序)`：

1. status: `breaking` > `active` > `in-progress` > `watching` > `resolved`
2. priority: `core` > `structural` > `emerging`
3. asOf: 新的在前

### 状态图例

| Status        | 含义                                      | 颜色   |
| ------------- | ----------------------------------------- | ------ |
| `breaking`    | 最近 7 天内有重大事件                     | 红     |
| `active`      | 持续在动，定期有更新                      | 绿     |
| `in-progress` | 在推进但节奏慢，季度级更新                | 蓝     |
| `watching`    | 暂时无新事件，但仍值得盯                  | 灰     |
| `resolved`    | 信号已落地或失效，归档                    | 暗     |

## 六、迁移路径

### Step 1：保留现有数据

旧 `src/data/tracker.ts`（指标参考表）**不删**，重命名为 `src/data/metrics.ts`。
新建低调的 `/metrics/` 页面收纳，或并入 `/references/`。

### Step 2：建新数据

```
src/data/signals.ts        # 新数据文件，按上述 schema
```

先写 3 条种子（推荐选 #1 NAIS 2.0、#4 三方委员会、#8 五一演讲），跑通 schema 和页面后再补齐到 10 条。

### Step 3：改页面

```
src/pages/tracker/index.astro    # 重写为信号墙
src/pages/tracker/[id].astro     # 新增信号详情页（参考 levers/[id].astro）
```

### Step 4：i18n

EN 页面参考 `docs/i18n.md`：
- 用 `pickLocalized(signal, 'title', 'titleEn', lang)`
- 状态 / 优先级标签的 EN 版用字典
- 提交前 `npm run build && npm run check:i18n` 必须通过

### Step 5：导航与命名

- `src/navigation.ts` 中 tracker 的中文标题：`落地执行追踪器` → `政策信号追踪器` 或 `政策雷达`
- EN 版：`Tracker` → `Signal Tracker` 或 `Policy Radar`
- 路径保持 `/tracker/`（避免 SEO 断链），仅改显示名

### Step 6：交叉引用

- `RelatedRail` 组件加 `signal` 类型的支持
- `levers/[id].astro`、`policies/[id].astro`、`debates/[id].astro` 渲染相关 signal
- 反向：`signals/[id].astro` 渲染相关 lever / policy / debate / post

### Step 7：首页摘要

`src/pages/index.astro` 加一个"📡 最新信号"模块，只展示 `status='breaking'` 和 `priority='core'` 的前 3 条。
比现有"功能板块入口"动态化得多——首次访问的访客 30 秒内就能感受到 sgai 是活的。

## 七、未来扩展

不在本次范围，但 schema 已为以下能力预留：

- **RSS 订阅**：每条 signal 有 `asOf` 和 `events`，可生成"信号变化推送"
- **Email digest**：周报抽 status=breaking + active 的信号
- **Sparkline**：events 时间序列可视化每个信号的活跃度
- **Signal-level OG image**：programmatic SEO（参考 `docs/20260502-programmatic-seo-geo.md`）

## 八、为什么这个改造对 sgai 特别合适

1. **匹配观察站定位**：sgai 不是统计局，是观察者。"信号 + 解读"是观察者该做的。
2. **levers 稳态结构 + tracker 动态信号**：两个页面职能清晰，不再重叠。
3. **天然适合 RSS / 邮件订阅**：levers 做不到，signals 天然支持。
4. **倒逼编辑判断**：每条 signal 必写 `whyItMatters` 和 `whatToWatch`——这是 sgai 区别于政府公关稿和 ChatGPT 复读的核心护城河。
5. **首页可摘**：tracker 从"二级菜单的数据库"变成"首页 hero 下的脉搏"。

## 九、不做什么

- **不做"全景仪表盘"**：50+ 指标的 dashboard 不是 sgai 的方向，那是 Stanford AI Index 该做的事。
- **不做"自动化抓取"**：signal 是编辑产物，不是爬虫产物。每条都需要人写 `whyItMatters`。
- **不删 metrics 数据**：S$5.5B、AWS S$12B 等数字仍有参考价值，并入 `metrics.ts` 或 `references`。
- **不重命名路径**：保留 `/tracker/` 避免 SEO 断链，仅改显示名。

## 十、最小可发布版本（MVP）

1. `src/data/signals.ts` 写 3 条种子（#1 / #4 / #8）
2. 重写 `src/pages/tracker/index.astro` 成卡片式布局
3. 旧数据迁到 `src/data/metrics.ts`，做一个最简单的 `/metrics/` 页面
4. 导航改名
5. `npm run check && npm run build && npm run check:i18n` 全过

预计工作量：1–2 天。3 条种子写完之后，剩下 7 条可以按周补，每条信号有新事件就更新 `events` 和 `asOf`。
