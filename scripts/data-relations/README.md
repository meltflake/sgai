# data-relations review queue

填补 `src/data/*.ts` 里跨实体关联的空字段。半自动 review queue：脚本基于启发式生成候选关联 → reviewer CLI 一键 confirm / reject → codemod 写回 .ts 文件（双向同步）。

设计文档：[../../docs/20260507-data-relations-review-queue-design.md](../../docs/20260507-data-relations-review-queue-design.md)。

## 为什么有这个工具

`src/components/data/RelatedRail.astro` 和 `src/utils/graph.ts` 早就构建了跨内容互链的工程基础设施，但**数据是空的**：

```
$ npx tsx scripts/data-relations/review.ts list
debates.relatedPolicyIds   153/153  (100%)  ← 全部空
policies.relatedDebateIds  35/36   (97%)
```

RelatedRail 默认 `hideWhenEmpty=true`，所以即使每个详情页都接了，绝大多数也只渲染空。**手工填 153 条不可行，全自动不可信**——这个工具是中间路径：启发式建议 + 人工把关。

## v1 范围

只覆盖 `debates ↔ policies` 双向关联（最大瓶颈）。未来可扩到 lever / timeline / postSlugs。

## 五个子命令

```bash
# 1. 看 baseline
npx tsx scripts/data-relations/review.ts list

# 2. 生成 review queue（含候选 + 信号说明）
npx tsx scripts/data-relations/review.ts queue \
  --domain=debates --field=relatedPolicyIds [--limit=20]

# 3. 看所有 queue 文件状态
npx tsx scripts/data-relations/review.ts status

# 4. 交互式 review
npx tsx scripts/data-relations/review.ts review <queue-file>

# 5. 写回 .ts（先 dry-run）
npx tsx scripts/data-relations/review.ts apply <queue-file> --dry-run
npx tsx scripts/data-relations/review.ts apply <queue-file>
```

## 启发式信号

| 信号 | 触发条件 | 权重 |
|---|---|---|
| `person-overlap` | `debate.personIds ∩ policy.authorPersonIds ≠ ∅` | strong |
| `ministry-match` | debate `id` 含 `cos-X-` 模式 OR personIds 推断的 ministry == `policy.ministry` | medium |
| `keyword` | policy 标题去停用词后的实词出现在 debate 标题/摘要 | medium |
| `date-proximity` | `\|debate.date − policy.date\| ≤ 90 天` | weak |
| `topic-hit` | policy 关键词出现在 debate.topics 数组 | weak |

**Confidence 三档**：
- `high` — 总权重 ≥4 且至少 1 个 strong 信号
- `medium` — 总权重 ≥2
- `low` — 仅 1 个或全 weak

每个候选附带 `signals` 数组解释推断依据，reviewer 可以秒判。

## Review CLI 交互

```
[5/153] cos-mddi-2026  (2026-03-02)
  "MDDI Committee of Supply 2026 — AI as Strategic Advantage"
  context: josephine-teo, sharael-taha, jessica-tan, henry-kwek

  Candidates:
    1. [HIGH  ] national-ai-strategy-20-nais-20
       "National AI Strategy 2.0 (NAIS 2.0)"
       signals: person-overlap:josephine-teo, ministry-match:id-derived:MDDI, keyword:national, topic-hit:national@"ai & national security"
    2. [MEDIUM] model-ai-governance-framework-for-agentic-ai
       ...
    ...

  Action [a]ll / [n]one / [s]kip / [1,3] indexes / [q]uit:
```

**输入**：
- `a` 接受全部候选
- `n` 拒绝全部（`decision.accepted = []`）
- `s` 跳过（不算 reviewed，下次 review 还会出现）
- `1`、`1,3`、`1 3 5` 接受指定索引
- `q` 退出（已 review 的进度保存到 queue JSON）

**进度持久化**：每次决策后立刻写回 queue JSON，中途断也不会丢。

## Apply 写回

`apply` 读取 queue JSON 中所有 `decision.accepted.length > 0` 的 entry：

1. **同侧**：例如 `debates` queue → 把 accepted policy ids 写到 `src/data/debates.ts` 对应 record 的 `relatedPolicyIds`
2. **对侧（双向同步）**：每条 accepted policy 的 record 在 `src/data/policies.ts` 也加上该 debate id 到 `relatedDebateIds`
3. **去重**：与已有值合并，使用 `Set`
4. **prettier**：写回后自动跑 `prettier --write` 保持格式
5. **提示后续 CI**：`npm run check && npm run build && npm run check:dist`

`--dry-run` 只打印计划修改的 record + before/after 长度，不写文件。

## queue JSON 格式

```jsonc
{
  "domain": "debates",
  "field": "relatedPolicyIds",
  "generatedAt": "2026-05-07T02:34:48.206Z",
  "limit": 20,
  "stats": { "total": 5, "reviewed": 0, "accepted": 0, "skipped": 0 },
  "entries": [
    {
      "id": "cos-mddi-2026",
      "title": "MDDI Committee of Supply 2026 — AI as Strategic Advantage",
      "date": "2026-03-02",
      "contextPersonIds": ["josephine-teo", ...],
      "current": [],
      "candidates": [
        {
          "targetId": "national-ai-strategy-20-nais-20",
          "targetTitle": "National AI Strategy 2.0 (NAIS 2.0)",
          "confidence": "high",
          "signals": [
            { "type": "person-overlap", "detail": "josephine-teo", "weight": "strong" },
            { "type": "ministry-match", "detail": "id-derived:MDDI", "weight": "medium" },
            ...
          ]
        }
      ],
      "decision": { "accepted": ["national-ai-strategy-20-nais-20"], "rejected": [...] },
      "reviewedAt": "2026-05-07T02:40:00.000Z"
    }
  ]
}
```

## Tests

```bash
npx tsx --test scripts/data-relations/__tests__/*.test.ts
```

29 unit tests 覆盖：
- 5 类启发式信号
- Confidence 评分
- 候选排序 / 去重
- regex 写回（findRecordBlock / readArrayField / writeArrayField）
- 双向 applyAcceptedToRecord

## v1 已知局限（v2 改进点）

| 问题 | 现状 | v2 思路 |
|---|---|---|
| `josephine-teo` person-overlap 在 MDDI 辩论里太普遍 | strong signal 拉高 confidence 但不一定相关 | 加 frequency penalty：某 person 出现在 N+ 条 debates 时降权 |
| "national" / "model" / "framework" 高频词噪音 | 命中很多无关 policies | 扩展 stop-words；或者只对 ≥6 字符的 token 计 keyword 信号 |
| ministry 推断漏掉 oral-answer 类 | 只有 `cos-X-` 模式 + personIds → affiliations 兜底 | 解析 debate.transcript 头部的 "Minister X replied" 模式 |
| 候选数固定上限 5 | 大型 debate 候选可能被截断 | `--top` flag 让 reviewer 指定 |
| 写回不跑 i18n-pair 校验 | apply 不动 i18n 字段，但理论应跑一次 | apply 后自动跑 `npm run i18n-pair` |
| LLM 增强 | 当前不用（避免幻觉） | 作为附加信号（不是主信号），落到 `signals` 数组让 reviewer 看见 |

## 不做（明确 scope-out）

- ❌ 全自动 apply（必须 human-in-the-loop）
- ❌ LLM-based 候选生成（v1 用确定性启发式）
- ❌ 加入 `scripts/refresh/registry.json` cron 管线（事件驱动，不定时）
- ❌ person-level 字段（`personIds` / `authorPersonIds` / `championPersonIds`）—— 现有 codemod 已较好
- ❌ `relatedPostSlugs`（4 篇博客手工写更快）

## 下一步

跑一次完整 review：

```bash
npx tsx scripts/data-relations/review.ts queue --domain=debates --field=relatedPolicyIds
npx tsx scripts/data-relations/review.ts review scripts/data-relations/queue/debates-relatedPolicyIds-<date>.json
npx tsx scripts/data-relations/review.ts apply scripts/data-relations/queue/debates-relatedPolicyIds-<date>.json --dry-run
npx tsx scripts/data-relations/review.ts apply scripts/data-relations/queue/debates-relatedPolicyIds-<date>.json
npm run check && npm run build && npm run check:dist
```

预计 reviewer 时间：每条 30 秒 × 153 条 ≈ 1-1.5 小时。high confidence 候选基本秒过；low / medium 需要短判断。

完成后再跑反向（policies → debates）。
