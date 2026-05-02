# 生态地图 · 实体详情页设计

> 日期：2026-05-02
> 状态：规划中（待 Luca 审核）
> 涉及页面：`/ecosystem/`、`/en/ecosystem/`、新增 `/ecosystem/[id]/`、`/en/ecosystem/[id]/`

---

## 1. 目标

为 `/ecosystem/` 页面上每张卡片做一个 Wikipedia 风格的可点击详情页。

每个实体（共 9 类 ≈ 40 张卡片）回答 4 个问题：

1. **它是什么**（中立的百科式介绍）
2. **它和 AI 是什么关系**（在 AI 领域做什么、为什么重要）
3. **它和新加坡是什么关系**（在新加坡 AI 战略中的角色、与七条传导杠杆/政策/辩论的连接）
4. **它有什么关键成就**（时间线 + 里程碑 + 数字）

**非目标**（先不做，避免范围蔓延）：

- 不做用户编辑/众包（不是 wiki 平台）
- 不做实体之间的关系图谱可视化（v2 再说）
- 不做评论/讨论功能

---

## 2. 现状摸底

**页面结构**（`src/pages/ecosystem/index.astro` + `en/ecosystem/index.astro`）：

- 9 大类 × ~40 实体；每张卡片当前只有：名称、一句话描述、可选官网外链 ↗
- 卡片当前**不可点击进入详情**，外链直接跳第三方

**数据结构**（`src/data/ecosystem.ts` 的 `EcosystemEntity`）：

```ts
{
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  url?: string; // 官网
}
```

字段太薄，承载不了详情页。需要扩展。

**项目中可复用的模式**：

- `src/pages/policies/[id].astro`、`src/pages/people/[id].astro`、`src/pages/debates/[id].astro`：标准的 `getStaticPaths` 详情页范式
- `src/utils/entity-pages.ts`：`toSeoSlug()`（基于 limax）→ 现成的 slug 工具
- `src/utils/graph.ts` + `src/components/data/RelatedRail.astro`：跨实体关联展示
- `pickLocalized()` + `localizedHref()` + `getLangFromPath()`：i18n 双字段约定（见 `docs/i18n.md`）

---

## 3. URL & 路由设计

**方案 A（推荐）**：扁平结构

```
/ecosystem/sea-lion/
/ecosystem/imda/
/ecosystem/ai-verify-foundation/
/en/ecosystem/sea-lion/
```

- slug 用英文名 → `toSeoSlug()`
- 与 `/policies/[id]/`、`/people/[id]/` 一致
- 名称都足够独特（SEA-LION、MAS、AI Verify Foundation…），不会撞

**方案 B**（弃用）：嵌套分类

```
/ecosystem/core-technology/sea-lion/
```

- URL 更长，但用户其实是搜实体名，不是分类
- 跨分类移动实体时 URL 改变 → SEO 不友好
- 不采用

**Slug 生成规则**：

- 优先用 `nameEn`，否则 `name`
- 跑 `toSeoSlug()` 转 kebab-case（如 `SEA-LION` → `sea-lion`，`AI Verify Foundation` → `ai-verify-foundation`）
- 在 `entity-pages.ts` 增加 `ecosystemEntitySlug()` + `ecosystemPages[]`

---

## 4. 数据 Schema 扩展

向后兼容地扩展 `EcosystemEntity`。所有新字段都是 `optional`，老数据不动也能 build 通过。

```ts
export interface EcosystemEntity {
  // ── identity（已有）──
  name: string;
  nameEn?: string;
  description: string; // 卡片上的一句话
  descriptionEn?: string;
  url?: string; // 官网

  // ── 详情页：身份标签 ──
  id?: string; // kebab-case slug；有此字段才生成详情页
  entityType?:
    | 'agency' // 政府/法定机构（IMDA、PDPC、MAS）
    | 'institute' // 研究院/实验室（A*STAR、AISG）
    | 'university' // 高校（NUS、NTU）
    | 'platform' // 平台/框架（AI Verify、SEA-LION）
    | 'product' // 产品/工具（TagUI、PeekingDuck）
    | 'program' // 项目/计划（AIAP、100E、PhD Fellowship）
    | 'partner' // 产业伙伴（Google DeepMind、AWS）
    | 'initiative'; // 国际倡议（GPAI、Bletchley）
  status?: 'active' | 'archived' | 'planned';

  // ── 详情页：结构化事实 ──
  founded?: string; // "2017" / "2024-03" / "2024 Q1"
  headquarters?: string;
  headquartersEn?: string;
  parentOrg?: string; // 隶属（如 SEA-LION 的 parent = AI Singapore）
  parentOrgEn?: string;
  parentEntityId?: string; // 若 parent 也在 ecosystem 里，可链过去
  ministry?: string; // 主管部委
  ministryEn?: string;
  scale?: string; // 规模指标（"500+ 校友"、"$9B 投资承诺"）
  scaleEn?: string;
  leaders?: Array<{
    name: string;
    title?: string;
    titleEn?: string;
    personId?: string; // 若已在 people.ts，链过去
  }>;

  // ── 详情页：长文段 ──
  summary?: string; // 详情页顶部 lede（1-2 段）
  summaryEn?: string;
  whatItIs?: string; // §1 是什么（markdown，2-5 段）
  whatItIsEn?: string;
  aiRelevance?: string; // §2 与 AI 的关系
  aiRelevanceEn?: string;
  singaporeRelevance?: string; // §3 与新加坡的关系
  singaporeRelevanceEn?: string;

  // ── 详情页：里程碑 ──
  milestones?: Array<{
    date: string; // "2024-03" / "2025"
    title: string;
    titleEn?: string;
    description?: string;
    descriptionEn?: string;
    sourceUrl?: string;
  }>;

  // ── 详情页：可选模块（按 entityType 出现）──
  products?: Array<{
    name: string;
    nameEn?: string;
    description?: string;
    descriptionEn?: string;
    url?: string;
    entityId?: string; // 若已是独立 ecosystem 实体（如 AISG → SEA-LION）
  }>;
  partners?: Array<{
    name: string;
    nameEn?: string;
    note?: string;
    noteEn?: string;
    entityId?: string;
  }>;

  // ── 跨实体关联 ──
  relatedLeverNumbers?: number[]; // 七条传导杠杆 1-6
  relatedPolicyIds?: string[];
  relatedDebateIds?: string[];
  relatedEntityIds?: string[]; // 同 ecosystem 其他实体
  championPersonIds?: string[]; // 关键人物（people.ts）

  // ── 来源 & 元信息 ──
  sources?: Array<{
    label: string;
    labelEn?: string;
    url: string;
    date?: string;
  }>;
  furtherReading?: Array<{
    label: string;
    labelEn?: string;
    url: string;
  }>;
  updated?: string; // YYYY-MM-DD，信息核对日期
}
```

**关键设计原则**：

- **`id` 是 detail page 的开关**——有 id 就生成详情页，没有就只在卡片上展示。允许分批补充。
- **所有 CJK 文案字段都配对 `*En`**（项目硬约束，`check:i18n` 会扫）
- **跨实体 ID 引用**（`personId` / `entityId` / `relatedPolicyIds`）都是软引用——目标若不存在，渲染时跳过即可，不抛错

---

## 5. 详情页版式

**布局参考**：`src/pages/policies/[id].astro` 的单栏长文版式（`max-w-3xl`、`prose-lg`），但加结构化的章节分块。

```
┌────────────────────────────────────────────────────┐
│ Breadcrumb: 生态地图 › 核心技术 › SEA-LION         │
│                                                    │
│ 🧠  核心技术 · 平台                                 │
│ # SEA-LION                                         │
│ Southeast Asian Languages In One Network           │
│                                                    │
│ [Active] [Founded 2023] [AI Singapore] [Open Source]│
│                                                    │
│ ┌──────────────── Quick facts ─────────────────┐  │
│ │ 类型      平台 / 大语言模型                   │  │
│ │ 成立      2023                                │  │
│ │ 隶属      AI Singapore (→ link)               │  │
│ │ 主管      MCI / IMDA                          │  │
│ │ 规模      支持 11 种东南亚语言                │  │
│ │ 状态      Active · 持续训练新版本             │  │
│ │ 官网      sea-lion.ai ↗                       │  │
│ │ 信息更新  2026-05-02                          │  │
│ └───────────────────────────────────────────────┘  │
│                                                    │
│ > （summary：1-2 段 lede，加左边框引用样式）       │
│                                                    │
│ ## 是什么                                          │
│ （whatItIs：百科风介绍，3-5 段）                   │
│                                                    │
│ ## 与 AI 的关系                                    │
│ （aiRelevance：技术定位、为什么重要、和全球 LLM   │
│  生态的差异）                                      │
│                                                    │
│ ## 与新加坡的关系                                  │
│ （singaporeRelevance：在七条杠杆中的位置、         │
│  服务的国家战略目标、与本地机构的连接）            │
│                                                    │
│ ## 关键里程碑                                      │
│ （milestones：竖向时间线，每条带日期+标题+短描述） │
│                                                    │
│ ## 产品矩阵 / 子项目          ← 仅当有 products    │
│ ## 关键人物                  ← 仅当有 leaders/champion│
│ ## 合作伙伴                  ← 仅当有 partners    │
│                                                    │
│ ## 关联资源                                        │
│ - 关联政策（→ /policies/...）                      │
│ - 关联国会辩论（→ /debates/...）                   │
│ - 关联传导杠杆（→ /levers/...）                    │
│ - 同类其他实体（同 category 的 cards 横排）        │
│                                                    │
│ ## 延伸阅读                                        │
│ - furtherReading 的外部链接列表                    │
│                                                    │
│ ## 数据来源                                        │
│ - sources（带日期）                                │
│                                                    │
│ ← 返回生态地图                                     │
└────────────────────────────────────────────────────┘
```

**Stub 状态**（实体只有基本信息、长文段未补充）：

参考 `src/pages/people/[id].astro` 的 stub 处理：

- 顶部加一条 callout：「📝 此实体档案待补充。下方根据现有数据自动汇总卡片信息与外部链接。」
- 隐藏空章节（不渲染 `## 是什么` 标题如果 `whatItIs` 缺失）
- 这样可以让所有有 `id` 的实体都先有页，逐步丰富

---

## 6. 首页卡片交互改动

**现状问题**：当前卡片标题是外链 ↗，整张卡片不可点击。要改成「卡片整体进详情，外链图标作为副入口」。

**改动方案**：

- 卡片整体 wrap 成 `<a href="/ecosystem/{id}/">`（仅当有 `id`）
- 标题不再是外链；改为详情页内链
- 在卡片右上角放一个小的 ↗ 外链按钮（独立链接，跳官网，加 `e.stopPropagation()` 等价的语义——用嵌套链接的兼容写法：把外链放在 card link 之外的绝对定位层）
- 卡片底部加 "了解详情 →" 视觉提示（仅当有 `id`）
- 没有 `id` 的实体：卡片保持现状（只是外链卡片，不可进详情）

**避免的坑**：HTML 不允许 `<a>` 嵌套 `<a>`。两种合法写法：

1. 卡片用 `<a>` 包裹，外链放在 `<a>` 外层 + `position: absolute` 定位到卡片右上角
2. 卡片用 `<div onclick>` + `<a>` 标题（损失语义/SEO，不推荐）

**采用方案 1**。

---

## 7. 分批执行策略

**Phase 0 — Schema & 1 个样板**（先做、给 Luca 审核版式）

1. 扩展 `EcosystemEntity` 接口（新增字段全 optional）
2. 在 `entity-pages.ts` 加 `ecosystemEntitySlug()` + `ecosystemPages[]`
3. 创建 `src/pages/ecosystem/[id].astro` + `src/pages/en/ecosystem/[id].astro`
4. 选 **SEA-LION** 作为样板（信息最完整、有公开资料），把所有字段写满
5. 修改 `index.astro` 的卡片交互（仅 SEA-LION 的卡片可点击进入）
6. `npm run check && npm run build && npm run check:i18n` 通过
7. → **暂停，让 Luca 审核版式与字段密度**

**Phase 1 — 高优先级 8-10 个**（架构验证后批量复制 SEA-LION 模式）

候选清单（按 Luca 站点的核心叙事排序）：

- AI Singapore（应当从 stats / 七大支柱抽离出独立实体，目前居然不在卡片里 —— 这是个**待确认的空缺**）
- A\*STAR
- IMDA
- AI Verify Foundation
- MAS
- NUS
- NTU
- Synapxe
- Google DeepMind（产业伙伴里最受关注）

**Phase 2 — 中优先级 ~15 个**（治理 / 产品 / 合作）

PDPC、SEA-HELM、SEA-Guard、TagUI、PeekingDuck、SGNLP、AIAP、LADP、LearnAI、PhD Fellowship、Microsoft Research Asia、AWS、NVIDIA、SMU、SUTD

**Phase 3 — 低优先级 + 历史归档** (~10 个)

100E（已归档）、Aquarium、Speech Lab、Synergos、AI4I、NAISC、AMP、Sony Research、Alibaba Cloud、Bletchley/Seoul、OECD AI Policy Observatory、GPAI、ACE-AI

每一批做完都跑 `npm run check && npm run check:i18n`。

---

## 8. 跨实体关联（图谱接入）

`src/utils/graph.ts` 目前不识别 ecosystem 实体。两个层次：

**最小可行**（Phase 0 不做，Phase 1 加）：

- 在 `graph.ts` 加 `getEcosystemEntityById(id)` lookup
- 详情页里通过 `relatedPolicyIds` / `relatedDebateIds` 直接 lookup 渲染（已有 `getPolicyById` 等 helper）
- 不重写 `getRelated()`，避免动 RelatedRail 现有调用方

**完整集成**（v2，可选）：

- 把 ecosystem 加进 `EntityKind` union
- `RelatedRail` 自动渲染 ecosystem 关联
- 反向：在 `/policies/[id]/` 详情页底部展示「相关生态实体」
- → 这一步对叙事价值很大，但和当前任务解耦，建议单独做

---

## 9. 版本号 & 文档同步

按项目惯例（`CLAUDE.md`）：

- 每批合并后更新 `src/version.ts`
- README / `docs/` 不必每次同步，但 Phase 0 完成后在 `docs/` 加一份样板字段示例

---

## 10. Luca 已确认的决策（2026-05-02）

1. ✅ **AI Singapore 本体单列**为独立实体；SEA-LION / TagUI / AIAP 等通过 `parentEntityId` 指向它
2. ✅ **样板选 SEA-LION**
3. ✅ **详情页头部加"在七大支柱中的位置"导航**（支柱徽章 + 同支柱其他实体的小链）
4. ✅ **写作语气**：主体百科 + 在「与新加坡的关系」段允许带 sgai 观点
5. ✅ **EN 翻译节奏**：所有中文内容写完后批量翻译（不每批同步）
6. **导航菜单入口**：先不加（待内容铺开后再说）
7. **延伸阅读 vs 数据来源**：分开（sources 带日期；furtherReading 给读者继续探索）

> 注：因为采用「批量翻译」节奏，Phase 0 的 SEA-LION 样板**也只写中文**，EN 版本走 fallback（用中文渲染 + i18n-check 暂时跳过新增的 ecosystem 详情页路由）。等所有中文写完后统一翻译。

---

## 11. 风险 & 对冲

| 风险                                      | 对冲                                                              |
| ----------------------------------------- | ----------------------------------------------------------------- |
| 一次性写 40 个实体内容量太大              | 分 4 批；Phase 0 只做 1 个样板验证版式                            |
| Schema 后期改动导致已写内容返工           | Phase 0 后让 Luca 审版式再批量；新字段全 optional 减少破坏性改动  |
| 卡片交互改动可能在移动端有可点击区域问题  | 改完后用 preview 工具在移动尺寸下验证                             |
| 跨实体关联里软引用挂了不报错容易漏        | 在 build script 里加一个 lint：所有 `*Id` 引用必须能 lookup 到    |
| EN 残留触发 `check:i18n` 失败             | 每批合并前必跑 `npm run build && npm run check:i18n`              |

---

## 12. 验收标准（Phase 0）

- [ ] `EcosystemEntity` 接口扩展完成、所有新字段 optional、向后兼容
- [ ] `ecosystem.ts` 中 SEA-LION 一项填满所有字段
- [ ] `/ecosystem/sea-lion/` 与 `/en/ecosystem/sea-lion/` 渲染正常，所有章节有内容
- [ ] `/ecosystem/` 首页 SEA-LION 卡片整体可点击进详情，右上角外链 ↗ 仍跳官网
- [ ] 其他卡片保持原状不报错
- [ ] `npm run check` 通过
- [ ] `npm run build && node scripts/i18n-check.mjs` 通过
- [ ] Luca 在浏览器里看一眼 SEA-LION 详情页，认可版式与字段密度

---

> 等 Luca 审核 → 确认开放问题 → 开 Phase 0。
