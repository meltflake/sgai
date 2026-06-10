# 数据关联补全 Review Queue 工具 — 设计稿

> 日期：2026-05-07
> 状态：设计稿（讨论中，**未实施**）
> 作者：Claude（PM 视角，承接 [.claude/plans/sgai-md-clever-teacup.md](.claude/plans/sgai-md-clever-teacup.md) P0b）
> 关联 commit：`0e4278d`（P0a — graph.ts person reverse lookup + voices RelatedRail）

## Context — 为什么要这个工具

P0a 的工程修补让 voices/[id] 终于能看到 levers + timeline 关联。但跑完之后我们撞上了**真正的瓶颈**：

> **193 条辩论里 153 条 (79%) 的 `relatedPolicyIds` 是空 `[]`**
> 政策的 144 个 related 字段位绝大多数也是空。

这意味着：跨内容互链的**工程基础设施已经齐备**（[`src/utils/graph.ts`](src/utils/graph.ts) + [`src/components/data/RelatedRail.astro`](src/components/data/RelatedRail.astro) + 主要详情页接入），但**数据是空的**。RelatedRail 默认 `hideWhenEmpty=true`，所以即使每页都接，绝大多数都不渲染。

**站点"研究网络"质感能否起来，卡点不在工程，在数据填充**。手工填 153 条不可行（每条要查辩论 → 查相关政策 → 多次决策），但全自动也不可行（关联是判断，不是规则）。

需要一个**半自动 review queue 工具**：脚本生成候选关联（基于启发式），Luca 一键 confirm/reject，apply 写回 `src/data/*.ts`。

参考已有模式：[`scripts/voices/prospect-stubs.mjs`](scripts/voices/prospect-stubs.mjs)（人物档案补全的半自动 review queue）。

## 范围（P0b 第一阶段）

按"覆盖率瓶颈 × 关联强度"排优先级：

| 字段 | 实体 | 当前空值率 | 优先级 |
|---|---|---|---|
| `relatedPolicyIds` | debates | **153/193 (79%) 空** | **P1** |
| `relatedDebateIds` | policies | 大部分空 | **P1**（与上面对称） |
| `relatedLeverNumbers` | debates | 大部分空 | P2 |
| `relatedLeverNumbers` | policies | 大部分空 | P2 |
| `relatedTimelineYears` | debates / policies | 部分空 | P2 |
| `personIds` | debates | 已自动（`scripts/codemod-debates.ts`） | 不动 |
| `authorPersonIds` | policies | 部分填了 | P3（手工） |
| `championPersonIds` | levers | 部分填了 | P3（手工） |
| `relatedPostSlugs` | 各处 | 大部分空 | P3（数量少，手工写） |

**P0b v1 只做 P1**：`debates ↔ policies` 双向关联。把 153 条空 `relatedPolicyIds` 填上去。

P2 / P3 在 v1 跑通后再扩。

## 启发式：候选关联怎么生成

每条 debate（当前空 `relatedPolicyIds`）→ 算出候选 policies。基于 5 类信号：

| 信号 | 计算方式 | 权重 |
|---|---|---|
| **personIds 重叠** | `debate.personIds ∩ policy.authorPersonIds ≠ ∅` | **强** |
| **ministry 匹配** | debate 推断的 ministry == `policy.ministry` | **中** |
| **关键词命中** | policy 标题核心 token（去停用词后的实词，长度 ≥ 4）出现在 `debate.titleEn` / `debate.summaryEn` | **中** |
| **日期接近** | `debate.date` 在 `policy.date` 前后 90 天内 | **弱**（需配合其他信号） |
| **topic 命中** | `debate.topics` 命中 policy.titleEn 关键词 | **弱** |

**confidence 三档**：
- `high`：≥3 个信号命中（含至少 1 个强信号）
- `medium`：2 个信号命中
- `low`：仅 1 个信号或全弱信号

每个候选附**signals 数组**显示推断依据：`["person-overlap:josephine-teo", "ministry-match:MDDI", "kw:NAIS"]`。Luca 看到依据就能秒判。

**候选数量限制**：每条 debate 最多列出 confidence 最高的 5 个 policies，避免 review 疲劳。

## CLI 命令（仿 `prospect-stubs.mjs`）

```bash
# 1. 列当前状态：哪些 domain × field 有多少空值
npx tsx scripts/data-relations/review.ts list

# 输出示例：
#   debates.relatedPolicyIds   153/193 empty (79%)   ← P1
#   policies.relatedDebateIds   31/36 empty (86%)   ← P1
#   debates.relatedLeverNumbers 178/193 empty       ← P2
#   ...

# 2. 生成 review queue（针对单个 domain × field）
npx tsx scripts/data-relations/review.ts queue \
  --domain=debates --field=relatedPolicyIds [--limit=20]

# 输出：scripts/data-relations/queue/debates-relatedPolicyIds-2026-05-07.json

# 3. 状态查询
npx tsx scripts/data-relations/review.ts status

# 输出：列所有 queue 文件、各自 reviewed/total 进度

# 4. 交互式 review
npx tsx scripts/data-relations/review.ts review <queue-file>

# CLI 交互（每条 entity 一屏）：
#   ──────────────────────────────────────────────────
#   [3/153] oral-answer-4117 (2026-04-08)
#   "Mandatory Government Security Vetting for CII Personnel"
#   Speakers: Gerald Giam, Josephine Teo
#
#   Candidates:
#   1. [HIGH]   csa-cybersecurity-act-amendments-2024
#      "CSA Cybersecurity Act Amendments 2024"
#      signals: ministry-match:MDDI, person-overlap:josephine-teo, kw:cybersecurity
#   2. [MED]    nais-2-0
#      signals: person-overlap:josephine-teo, kw:critical-infrastructure
#   3. [LOW]    moh-genai-deployment
#      signals: kw:vetting (1)
#
#   Action? [a]ll / [n]one / [s]kip / [1,3] indexes / [q]uit:

# 5. apply 写回（带 dry-run）
npx tsx scripts/data-relations/review.ts apply <queue-file> [--dry-run]

# - dry-run: 打印将要修改的 .ts 行号 + diff，不写文件
# - 真 apply: regex 替换 src/data/*.ts，跑 prettier，提示 npm run check
```

## queue JSON 格式

```jsonc
{
  "domain": "debates",
  "field": "relatedPolicyIds",
  "generated_at": "2026-05-07T10:00:00Z",
  "limit": 20,
  "stats": { "total": 20, "reviewed": 0, "accepted": 0, "skipped": 0 },
  "entries": [
    {
      "id": "oral-answer-4117",
      "title": "Mandatory Government Security Vetting...",
      "date": "2026-04-08",
      "speakers": ["gerald-giam-yean-song", "josephine-teo"],
      "current": [],
      "candidates": [
        {
          "policyId": "csa-cybersecurity-act-amendments-2024",
          "policyTitle": "CSA Cybersecurity Act Amendments 2024",
          "confidence": "high",
          "signals": [
            "ministry-match:MDDI",
            "person-overlap:josephine-teo",
            "kw:cybersecurity"
          ]
        }
      ],
      "decision": null,
      "reviewed_at": null
    }
  ]
}
```

review 后 `decision` 变成 `{ "accepted": ["...id..."], "rejected": ["...id..."] }`。

## apply：写回 .ts 文件

参考 [`scripts/codemod-debates.ts`](scripts/codemod-debates.ts) 的现成模式 —— **regex 替换字符串**，不用 ts-morph。

实现要点：

1. 加载 queue 中所有 `decision !== null && decision.accepted.length > 0` 的 entries
2. 对每条 entry：
   - 在 `src/data/<domain>.ts` 里 grep 出该 entry 的 record 块
   - 替换 `relatedPolicyIds: []` → `relatedPolicyIds: ['...', '...']`
   - 如果该字段已经有非空内容（罕见，但理论可能），合并去重，**保留原值**
3. 写回文件
4. 跑 `npx prettier --write src/data/<domain>.ts`
5. 提示用户跑 `npm run check && npm run build && npm run check:dist`

**双向写回**：apply `debates.relatedPolicyIds = ['nais-2-0']` 时，同步在 `policies.ts` 的 `nais-2-0` 记录里把这条 debate id 加到 `relatedDebateIds`。这样：
- 一次 review 双向填关联
- 减少 review 工作量一半
- 数据图谱保持对称

## 风险与控制

| 风险 | 缓解 |
|---|---|
| AI 启发式给的候选错误 | **必须 human-in-the-loop**（review queue 不直接 apply） |
| regex 替换破坏 .ts 格式 | apply 后强制跑 prettier；apply 默认 dry-run |
| 重复 apply 重复加 id | 写回前 `Set([...current, ...accepted])` 去重 |
| 数据填充影响 JSON-LD schema | apply 完跑 `npm run check:dist`（schema check） |
| RelatedRail 渲染太满 | RelatedRail 已有 `slice(0, 8)` 限制 + `+N more` 折叠 |
| Luca 改了 .ts 但 queue 文件没更新 | apply 时检查 `current` 是否已包含所有 `accepted`，是则 noop |
| review 中断 | queue JSON 是 stateful，下次 review 命令读取已 reviewed entries 跳过 |

## 不做（v1 scope-out）

- ❌ **全自动 apply**——必须 review，不接受"信任 AI 直接写"
- ❌ **LLM-based 候选生成**——当前启发式信号清晰、可解释、可追溯。LLM 引入幻觉风险（参考 CLAUDE.md 里 voices backfill 那次"LLM 幻觉 URL"事故）。如果将来要加 LLM，作为**附加信号**（不是主信号），且必须落到 `signals` 数组让 Luca 看到。
- ❌ **person-level 字段**（personIds / authorPersonIds 等）——现有人名匹配已较好，再做 ROI 低
- ❌ **relatedPostSlugs**——只 4 篇博客，手工写更快
- ❌ **加入 cron 自动管线**（`scripts/refresh/registry.json`）——v1 是事件驱动（Luca 想填时手动跑），不是定时
- ❌ **跨实体新关联类型**（e.g. lever ↔ benchmarking）——v1 只做已存在的 schema 字段

## 实施估算（如果 Luca 批准）

| 阶段 | 工时 |
|---|---|
| 启发式 + 候选生成 | 2 小时 |
| CLI scaffold（list/queue/status/review/apply 五个子命令） | 2 小时 |
| 交互式 review CLI（terminal UI） | 1.5 小时 |
| regex 写回 + 双向同步 + prettier | 2.5 小时 |
| dogfood：跑一次 P1（debates ↔ policies） | 1 小时 |
| 文档（scripts/data-relations/README.md） | 1 小时 |

**总计 ~10 小时工程**。

跑通之后 Luca 实际 review 153 条预计 1-2 小时（每条平均 30 秒决策，high confidence 候选基本秒过）。

## 后续路径

如果 Luca 批准这份设计：

1. **第一步**：写一份独立实现 plan（按现有模式：`docs/superpowers/specs/2026-05-XX-data-relations-review-queue-design.md`）
2. **第二步**：实施 v1 = P1（debates ↔ policies）
3. **第三步**：dogfood + 跑一遍 153 条 debates 的 review
4. **第四步**：观察站点效果（voices/policies/debates 详情页是否出现更多关联渲染）
5. **第五步**（如果 v1 有效）：扩展到 P2（levers / timeline 关联字段）

## v1 落地后的预期效果

填完 P1 之后（debates ↔ policies），假设 50% 的空字段被填上（保守估计——有些 debate 确实没对应 policy）：

- **流量**：每个详情页底部多一个"国会辩论"section（或"主导政策"section） → 用户深度浏览率提升
- **Google 收录**：1000+ 内链增加 → 长尾搜索词排名上升
- **LLM 引用**：结构化关系图谱完整度从 21% → 50%+ → LLM 引用整站而非孤页的概率提升

这是 [.claude/plans/sgai-md-clever-teacup.md](.claude/plans/sgai-md-clever-teacup.md) 里"三指标同时打中"的 P0 真正落地路径。

## 关键文件参考（实施时）

- 现有 codemod 模板：[scripts/codemod-debates.ts](scripts/codemod-debates.ts)
- 已有 review queue 模板：[scripts/voices/prospect-stubs.mjs](scripts/voices/prospect-stubs.mjs)
- 数据目标：[src/data/debates.ts](src/data/debates.ts) + [src/data/policies.ts](src/data/policies.ts)
- 渲染消费方（验证用）：[src/components/data/RelatedRail.astro](src/components/data/RelatedRail.astro) + [src/utils/graph.ts](src/utils/graph.ts)
- i18n 双字段约定：[CLAUDE.md](CLAUDE.md) §i18n 双字段约定
- URL 真实性约定：[CLAUDE.md](CLAUDE.md) §sourceUrl 真实性（**本工具不涉及 sourceUrl**——只填实体 id 引用，无 URL 幻觉风险）

## 等 Luca 决策

三个选项：

1. **批准设计 → 写实现 plan → 执行**（PM 推荐）
2. **修改设计**（哪条启发式不对？哪个 scope 要调整？）
3. **暂缓**（先跑 P1/P2/P3 别的方向：可视化 / CSV+Cite / 首页 CTA）
