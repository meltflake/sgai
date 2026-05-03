# CLAUDE.md — sgai 项目指南

## 项目概述

新加坡 AI 观察 (https://github.com/meltflake/sgai) — 深度观察新加坡 AI 生态与战略的中文网站。
仓库于 2026-05 从 `aisg` 重命名为 `sgai`（避开 AI Singapore 缩写撞名）。同时从 meltflake-site 子站"毕业"，作为独立站点部署，线上地址 `https://sgai.md/`（DNS/Cloudflare 配置另行处理）。
基于 Astro 5.0 + Tailwind CSS 的静态站点，部署于 Netlify。

## 技术栈

- **框架**: Astro 5.0 (静态站点生成)
- **样式**: Tailwind CSS
- **语言**: TypeScript + Astro
- **内容**: Markdown 博客文章 (`src/data/post/*.md`)，TypeScript 数据文件 (`src/data/*.ts`)
- **部署**: Netlify (自动部署 main 分支)

## CI 管线

```bash
npm run check  # = check:astro && check:eslint && check:prettier && check:graph
```

四项检查全部通过才能合并。修复命令：

```bash
npm run fix           # 一键修复 eslint + prettier
npm run fix:eslint    # 仅修复 eslint
npm run fix:prettier  # 仅修复 prettier (prettier -w .)
```

**提交前必须运行 `npm run check` 确认通过。**

i18n 残留检查（构建产物层）：

```bash
npm run build && npm run check:i18n
# = node scripts/i18n-check.mjs，扫 dist/en/*.html 中的中文残留
```

凡是动了 EN 页面、共享组件、数据双字段的 PR，必须本地跑通 `check:i18n`。

## 编码规范与常见陷阱

### 1. Astro 文件中的注释语法

在 `.astro` 文件的 JSX 表达式（如 `.map()` 回调、三元表达式）内部，**禁止使用 HTML 注释**：

❌ 错误 — HTML 注释在 JSX 表达式内会导致解析错误：

    {items.map((item) => (
      <!-- 这是注释 -->
      <div>{item.name}</div>
    ))}

✅ 正确 — 使用 JSX 注释语法：

    {items.map((item) => (
      {/* 这是注释 */}
      <div>{item.name}</div>
    ))}

> Astro 模板顶层可以用 HTML 注释 `<!-- -->`，但 JSX 表达式内部必须用 `{/* */}`。
> Prettier 解析 Astro 文件时会因此报 SyntaxError。

### 2. 不规则空白字符

数据文件（尤其是从外部来源复制的内容，如国会辩论记录）可能包含不规则空白字符：

- `\u00A0` (NBSP)、`\u3000` (全角空格)、`\u2003` (Em Space)、`\u200B` (零宽空格) 等

ESLint `no-irregular-whitespace` 规则会报错。**粘贴外部文本后，注意检查并替换为普通空格。**

### 3. 类型标注

禁止使用 `as any`（ESLint `@typescript-eslint/no-explicit-any`）。使用具体类型：

```typescript
// ❌ (c as any).relatedTopics as string[]
// ✅ (c as { relatedTopics: string[] }).relatedTopics
```

### 4. Prettier 格式化

项目使用 Prettier 统一格式。如果修改了多个文件，提交前运行：

```bash
npx prettier --write src/
```

### 5. i18n 双字段约定（关键 — 最高优先级）

> **🔴 顶层硬规则：sgai 是 zh + en 双语站点。任何 `src/data/*.ts` 的数据更新——无论是 agent 自动 PR、手动编辑、批量 codemod、回填，还是粘贴翻译——必须中英文同步写入。不允许只更新单语种。**
>
> - ✅ 加新条目：`title` 和 `titleEn`、`description` 和 `descriptionEn` 必须同时给值，同一次 commit。
> - ✅ 改老条目：改了 `title` 必须连带改 `titleEn`，反之亦然。同一次 commit。
> - ❌ 禁止「先 commit 中文版，下一个 PR 补英文」这种分两步的操作。EN 页面会立刻渲染断裂。
> - 不会写英文？用 [scripts/lib/translate.ts](scripts/lib/translate.ts) 的 `translateRecords(records, ['title','description'], { direction: 'zh→en' })` 一行调出来。Claude haiku，零 API key，已带 sha256 缓存。
> - 真要「这个字段我现在没法翻译」时，**必须**在该字段所在行上面注释 `// i18n-allow-unpaired` 显式豁免，否则 [scripts/lib/i18n-pair.ts](scripts/lib/i18n-pair.ts) 会 fail。

完整规范见 [`docs/i18n.md`](docs/i18n.md)。其他常踩点：

- 数据接口：用户可见的中文字段都要加 `*En` 兄弟字段（`title` / `titleEn`、`description` / `descriptionEn` ...）。含 CJK 的 `label` / `ministry` / `scale` 等也要 `*En`。
- EN 页面渲染：**永远不要**直接 `{record.title}`。用 `pickLocalized(record, 'title', 'titleEn', lang)` 或 `record.titleEn || record.title`。
- 内部链接：用 `localizedHref(path, lang)`，不要硬编码 `/en/` 前缀也不要直接给裸路径。
- 共享组件（zh + EN 都用的）：组件顶部 `getLangFromPath(new URL(Astro.url).pathname)` 推断 lang，所有展示文案、链接、字段都按 lang 走。
- SocialChannel：含 CJK 的 `label` 必须配对 `labelEn`。
- 提交前必跑：`npx tsx scripts/lib/i18n-pair.ts <动过的文件>`（emit 时已自动跑，但手工编辑也要跑）+ `npm run build && node scripts/i18n-check.mjs`。前者扫源码，后者扫 `dist/en/**/*.html` 中文残留。
- 自动管线已强制：`scripts/lib/auto-discovered-emit.ts` 和各 `emit.ts` 在 emit 后跑 `findUnpairedFields` baseline-vs-after diff，新引入 unpaired 自动 rollback；不会"偷偷"放出单语种数据。
- 未来扩展到 ja / ko 等语言时，本规则升级为"有几个语言就更新几个，所有目标语种同 commit 同步"。当前 (2026-05) 范围是 zh + en。

### 6. sourceUrl 真实性约定（关键 — 最高优先级）

> **🔴 顶层硬规则：任何写入 `src/data/*.ts` 的 `sourceUrl` / `url` 字段必须 HTTP 可达（2xx/3xx，或 401/403/429 这类反爬但页面真实存在）。404/410/5xx/DNS 失败一律禁止入库。**
>
> 触发场景：所有"靠 LLM 补脑"的内容流程——voices prospect、人工编辑、粘贴翻译、agent 批量回填等。和 hansard / videos 这类先有 API ground-truth 再 emit 的管线不同，这类流程对 URL 幻觉零防御。
>
> - ❌ 禁止凭训练记忆/格式推断构造 URL。LLM 会在 URL 模式正确（如 `fintechfestival.sg/speakers/spkr<NUMBER>-<slug>`）时填一个看似合理但**从未存在**的 ID。这种幻觉肉眼几乎无法识别，必须靠 HTTP 校验兜底。
> - ✅ 加 / 改 sourceUrl：必须先 `curl -I` 或 fetch 验证 200/3xx，再写入。
> - ✅ 不确定？用 [scripts/lib/gov-fetch.ts](scripts/lib/gov-fetch.ts) 的 fetch helper 真去抓一遍。
> - ✅ schema 允许 sourceUrl 可选时（如 `SignatureWork` / `SpeakingEntry` / `ExternalRole`），找不到可信源就**留空**比写假的好；`NotableQuote.sourceUrl` 是 required，找不到就整条删。
> - ✅ 真的"页面被反爬挡了但内容确实存在"：在 prospect JSON 的 `notes` 字段写明白验证依据（如"archive.org 快照确认"），并通过 `--skip-url-check` 显式豁免。
>
> 强制点：`scripts/voices/prospect-stubs.mjs apply` 在 print TS 片段前会 HEAD-check 所有 sourceUrl，4xx/5xx（除 401/403/429）blocks apply 退码 2。新加的"靠 LLM 补脑"型管线**必须**复用同样的 `validateUrls()` 检查。

历史踩点：[c574e54](https://github.com/meltflake/sgai/commit/c574e54)（2026-05-03 voices backfill）写入 2 条编造 URL（`spkr4563-prof-mohan-kankanhalli`、`asianaviation.com/astar-sia-siaec-...`），加 2 条 weforum 反爬伪 404。当时无 URL 校验，靠用户事后报错才发现。本规则即此次事故的事后加固。

## 项目结构

```
src/
├── components/widgets/   # Astro 组件
├── content/config.ts     # 内容集合配置 (博客文章 schema)
├── data/
│   ├── post/             # Markdown 博客文章
│   ├── stats.ts          # 首页统计数据和功能板块
│   ├── debates.ts        # 国会辩论数据
│   ├── policies.ts       # 政策文件数据
│   ├── timeline.ts       # 时间线数据
│   └── ...               # 其他数据文件
├── navigation.ts         # 导航菜单配置
├── version.ts            # 版本号和更新日期
├── pages/                # 页面路由
└── layouts/              # 布局组件
```

## 发布流程

1. 修改内容 / 代码
2. 运行 `npm run check` 确认通过
3. 更新 `src/version.ts` 中的版本号和日期
4. 提交并推送到 main 分支，Netlify 自动部署

## 内容管理

### 添加博客文章

在 `src/data/post/` 下创建 `.md` 文件，frontmatter 格式：

```yaml
---
publishDate: 2026-03-20
title: '文章标题'
excerpt: '摘要文字'
category: '观点'
tags:
  - 标签1
  - 标签2
author: '新加坡 AI 观察'
---
```

### 更新导航

- 头部/底部导航：`src/navigation.ts`
- 首页功能板块：`src/data/stats.ts`

## 国会辩论数据更新（Hansard Pipeline）

### SPRS API 使用要点

**API 端点**：`POST https://sprs.parl.gov.sg/search/getHansardTopic/?id={report_id}`

**响应格式是字典，不是列表**：

```typescript
// ✅ 正确解析
const data = resp.json(); // { resultHTML: {...}, resultData: null }
const rh = data.resultHTML; // { title, sittingDate, content, reportType, ... }
const title = rh.title;
const date = rh.sittingDate; // 格式 "12-2-2026" (DD-M-YYYY)

// ❌ 错误 — 不要把响应当列表处理
// data[0].title  ← 会返回 undefined，误判为"empty"
```

**调用外部 API 前，先用一个已知有效的 ID 验证响应结构**，不要假设格式。

### Report ID 范围与规律

- `oral-answer-XXXX`：4000+ 区间（2026 年数据约 4023–4088）
- `written-answer-XXXXX`：21000+ 区间（注意是五位数！不要去扫 5000 区间）
- `budget-XXXX`：2800+ 区间
- `cos-{ministry}-{year}`：如 `cos-moh-2026`（HTTP 400 表示不存在）
- Hansard 发布有延迟，一般 sitting 后数周才上线；written answers 通常比 oral 更晚发布

### 更新流程

1. 从已知最高 ID 开始向上扫描（检查 `debates.ts` 中现有 `sourceUrl` 获取最高 ID）
2. 先用 1 个已知 ID 验证 API 响应结构
3. 批量扫描新 ID，提取 AI 相关条目（关键词：artificial intelligence, AI, deepfake, data centre, machine learning 等）
4. 对 AI 相关条目生成中英文摘要、分析数据，写入 `debates.ts`
5. 同步更新 `DEBATE_STATS`（total、byYear、byType、byTopic、topSpeakers）
6. 同步更新 debates 页面的"数据更新"日期、首页辩论数量、README 中的数字

### 现有脚本与工具

**Python Pipeline**（`scripts/hansard/`）— 完整的 5 步数据管线：

| 脚本                     | 功能                         | 依赖           | 备注                                  |
| ------------------------ | ---------------------------- | -------------- | ------------------------------------- |
| `01_discover_debates.py` | 通过 PAIR Search 发现报告 ID | Playwright     | 使用 `search.pair.gov.sg` 语义搜索    |
| `02_fetch_debates.py`    | 从 SPRS API 获取辩论全文     | requests       | 可直接用 API 替代（见上文 API 要点）  |
| `03_enrich_debates.py`   | AI 生成中文摘要              | OpenAI API key | **需 API key**，Claude 可直接完成此步 |
| `04_analyze_patterns.py` | AI 分析政策模式              | OpenAI API key | **需 API key**，Claude 可直接完成此步 |
| `05_generate_ts.py`      | 生成 `debates.ts`            | 无             | 从 JSON 生成 TypeScript 数据文件      |

**Python 虚拟环境**：`/tmp/hansard-venv`（如不存在需重建）

```bash
python3 -m venv /tmp/hansard-venv
source /tmp/hansard-venv/bin/activate
pip install requests playwright beautifulsoup4
```

**实际操作方式**：步骤 1-2 可通过直接调用 SPRS API 替代脚本，步骤 3-4 由 Claude 直接完成（无需 OpenAI API），步骤 5 可手动编辑 `debates.ts`。即：可以完全跳过 Python 脚本，直接用 API + Claude 完成全流程。

### 快速 API 扫描脚本模板

下面是经过验证的 Python 扫描脚本，可直接复用：

```python
import requests

def scan_ids(prefix, start, end):
    """扫描 SPRS 报告 ID 并返回有数据的条目"""
    results = []
    for i in range(start, end):
        rid = f'{prefix}-{i}'
        resp = requests.post(
            'https://sprs.parl.gov.sg/search/getHansardTopic/',
            params={'id': rid},
            headers={'Content-Type': 'application/json'},
            json={}, timeout=10)
        if resp.status_code == 200:
            rh = resp.json().get('resultHTML')
            if rh and rh.get('title'):
                results.append({
                    'id': rid,
                    'date': rh['sittingDate'],
                    'title': rh['title'],
                    'content': rh.get('content', ''),
                })
    return results

# 用法：scan_ids('oral-answer', 4088, 4120)
```

## Voices 三无人物补全 Pipeline

`src/data/people.ts` 里有大量"三无"人物（无国会发言、无政策、无视频）。靠继续加指标解决不了——根因是缺内容。我们对 `Person` 增加了 4 个可选字段：

- `signatureWork` — 主导/owned 项目（3–5 条上限）
- `notableQuotes` — 公开 pull-quote（带 sourceUrl + date）
- `speakingRecord` — 近期演讲记录
- `externalRoles` — 跨机构身份（board / WG chair / 国际理事会）

字段任一非空时，voice profile 页（zh + EN）自动展示对应分区，靠 [`src/components/widgets/PersonContributions.astro`](src/components/widgets/PersonContributions.astro) 渲染。每条都要 `*En` 兄弟字段，否则 EN 页面回退到 zh 内容。

### 工具：`scripts/voices/prospect-stubs.mjs`

半自动 review-queue 工具（不直接爬，只做脚手架）。

```bash
# 1. 列出当前所有"三无但有真实角色"的人物
npx tsx scripts/voices/prospect-stubs.mjs list [--limit 25]

# 2. 为指定人物或 top N 生成 prospect JSON 文件
npx tsx scripts/voices/prospect-stubs.mjs queue luke-ong leslie-teo
npx tsx scripts/voices/prospect-stubs.mjs queue --top 10

# 3. 查看 review queue 状态
npx tsx scripts/voices/prospect-stubs.mjs status

# 4. apply（把已 ready 的 prospect 转成 TS 片段，stdout 输出，手动粘贴到 people.ts）
npx tsx scripts/voices/prospect-stubs.mjs apply luke-ong

# 5. sync-from-people（反向同步：从 people.ts 把 live 字段倒灌回 prospect JSON，
# 当你直接在 people.ts 编辑而绕过 JSON 时用）
npx tsx scripts/voices/prospect-stubs.mjs sync-from-people [<id>...] [--dry-run]
```

文件生成在 `scripts/voices/data/prospects/<id>.json`，状态 `pending → ready → applied`。每个 prospect 文件包含：

- 人物基础信息 + currentSummary
- 预生成的 `searchQueries`（含 `site:` 限定的白名单源）
- `whitelistedSources` 列表（aisingapore.org / imda.gov.sg / govinsider.asia / e27.co / channelnewsasia / scai.gov.sg / sicw.gov.sg / 各大学等）
- 待填充的 `signatureWork[]` / `notableQuotes[]` / `speakingRecord[]` / `externalRoles[]`
- `notes` 字段记录 reviewer 备注

### 标准操作流程

1. `prospect-stubs.mjs list` 看 backlog
2. `prospect-stubs.mjs queue --top N` 批量生成 review 文件
3. 把 prospect 文件交给 Claude（或自己），跑文件里的 `searchQueries`，把结果按 schema 填进去（每人 5–10 分钟）
4. 设 `status: "ready"`
5. `prospect-stubs.mjs apply <id>` 取 TS 片段 → 粘到 `src/data/people.ts` 对应 record
6. 设 `status: "applied"`、记录 `appliedAt`
7. 每季度跑一次，让活跃人物档案保持新鲜

**入选门槛**：`signatureWork` 只收公开 attribution 明确的 owned 项目（AISG/IMDA 等官方把人列为 lead/co-lead）。学术 CV 大部分跟"新加坡 AI 战略/生态"无关，不要无脑搬。

### 已知 friction（待改进）

- `apply` CLI 一次只处理一个人，5 人小批可以，19 人批量时 19 次 `apply` + 19 次粘贴会很乏味——下次可以加一个 `apply --all` 模式直接改 people.ts（找每个 person record 的 channels 数组结尾作为 anchor 插入）。**对策**：批量场景下可以反过来用 `sync-from-people` —— 先在 people.ts 直接写，再倒灌回 JSON，省掉 paste 环节。
- 每个 prospect JSON 都重复存 ~20 行 `whitelistedSources`，纯粹冗余。可以让脚本只在文件顶部留一个引用，或者干脆删掉这字段（白名单已经体现在 `searchQueries` 的 `site:` 限定里）。
- 没有 `validate` 命令检查 `*En` 兄弟字段是否齐全——目前漏写英文版本会导致 EN 页面回退到中文。

## 数据刷新基建（Refresh Pipelines）

**新加 / 更新某个页面数据前，先读 [`docs/refresh-playbook.md`](docs/refresh-playbook.md)**——里面是每个页面（25+）的数据来源、当前 pipeline 状态、更新命令的完整索引。

设计原则统一：每条管线都是 **抓取 → 翻译 → 生成 TS** 三段式，state 持久化在 `scripts/data/last_scan_state.json`，由 `scripts/auto_update.py`（cron 入口）调度。i18n 双字段（`*En` 兄弟字段）强制，`npm run build && node scripts/i18n-check.mjs` 是 PR 准入门槛。

### 已建管线（registry-driven）

调度入口：`python3 scripts/auto_update.py --schedule=<weekly|monthly|quarterly|half-yearly>`，由 `scripts/refresh/registry.json` 决定每个 schedule 跑哪些管线。所有新管线（type=tsx）流程统一：scan → AI 摘要 → emit → auto-commit → push → `gh pr create` → 邮件附 PR 链接。

| 域               | 命令入口                                                                        | 频率       | 模式                                                       |
| ---------------- | ------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------- |
| Hansard 国会辩论 | `python3 scripts/auto_update.py --only=hansard`                                 | 周         | scan-email                                                 |
| YouTube 视频     | scan: `python3 scripts/auto_update.py --only=videos`<br/>emit: `npx tsx scripts/refresh/videos/emit.ts --ids=<videoIds>` | 周         | scan-email + 手动 emit auto-PR                             |
| MDDI 演讲        | `python3 scripts/auto_update.py --only=voices`                                  | 周         | scan-email                                                 |
| Voices 三无人物  | `npx tsx scripts/voices/prospect-stubs.mjs {list,queue,apply,sync-from-people}` | 季（手动） | 半自动 review queue                                        |
| **GitHub stars** | `npx tsx scripts/refresh/github-stars.ts [--bump-version]`                      | 月         | **auto-PR**                                                |
| **Policies**     | `npx tsx scripts/refresh/policies/run.ts --limit=5`                             | 月         | **auto-PR**                                                |
| **Ecosystem**    | `npx tsx scripts/refresh/ecosystem/run.ts --limit=5`                            | 月         | **auto-PR**（条目带 `_pendingReview: true`，listing 隐藏） |
| **Levers**       | `npx tsx scripts/refresh/levers/run.ts --limit=3`                               | 季         | **auto-PR**（入 lever 1 "Auto-discovered" 子组待移位）     |
| **Startups**     | `npx tsx scripts/refresh/startups/run.ts --limit=3`                             | 季         | **auto-PR**（入 `autoDiscovered[]`）                       |
| **Legal-AI**     | `npx tsx scripts/refresh/legal-ai/run.ts --limit=3`                             | 半年       | **auto-PR**（入 "Auto-discovered" section 待移位）         |
| **Talent**       | `npx tsx scripts/refresh/talent/run.ts --limit=3`                               | 半年       | **auto-PR**（入 `autoDiscovered[]`）                       |
| **Tracker**      | `npx tsx scripts/refresh/tracker/run.ts --limit=3`                              | 半年       | **auto-PR**（入 `autoDiscovered[]`）                       |
| **Benchmarking** | `npx tsx scripts/refresh/benchmarking/run.ts --limit=3`                         | 半年       | **auto-PR**（仅追踪新报告，数字仍需手工提取）              |

详见 [docs/refresh-playbook.md](docs/refresh-playbook.md) per-page 命令清单。

### 共享原语 `scripts/lib/`（全部已建，57 单元测试覆盖）

`npm run test:lib` 跑测试。新管线**强制**用这些原语，不要自己重新写 OpenAI/git/fetch 调用。

- `lib/translate.ts` — OpenAI zh↔en 翻译，sha256 缓存
- `lib/state.ts` — last_scan_state.json R/W（兼容 legacy schema）
- `lib/i18n-pair.ts` — `*En` 配对校验，CLI: `npm run i18n-pair <files>`
- `lib/auto-commit.ts` — `autoCommit() / pushAndOpenPR() / buildPRBody()`，安全 git + `gh pr create`
- `lib/github-stars.ts` — GitHub repo 元数据
- `lib/sprs-api.ts` — Hansard SPRS connector
- `lib/gov-fetch.ts` — 通用 .gov.sg HTML + sitemap 抓取
- `lib/ai-summarize.ts` — 双语 AI 摘要 + 闭集分类 + confidence
- `lib/auto-discovered-emit.ts` — 通用 `autoDiscovered[]` 数组追加器（schema 复杂的数据文件用，比如 talent / startups / benchmarking / tracker）
- `_shared/run-template.ts` — scan + AI 摘要 + auto-discovered 追加 + auto-PR 的复用 orchestrator，新加同模式管线只需 ~30 行配置

### auto-PR 流程（Luca 视角）

1. cron 跑到 → 管线 scan + AI 摘要 → emit 写 .ts → 自动 commit 到 `data-refresh/<domain>/<date>` 分支
2. 自动 push + `gh pr create`，PR 描述含 diff stat / 新条目清单 / confidence 分布 / 失败源
3. 收到邮件：`[sgai] data-refresh: <domain> +N entries — review PR #123`，正文带 PR 链接
4. 在 GitHub UI 上 Approve & Merge → Cloudflare 自动重新构建上线
5. \_pendingReview 条目：合并前在 PR 改 `_pendingReview: true → false`（或删字段），listing 立刻显示

### gh CLI / claude CLI 准备（无需 OpenAI / SMTP）

详细一步步看 [scripts/SETUP.md](scripts/SETUP.md)，跑 `bash scripts/doctor.sh` 体检。

```bash
gh auth login                                    # PR 创建 + Issue 通知（@assignee）
which claude && claude --version                 # AI 摘要 + 翻译走本地 claude CLI
echo 'export GITHUB_TOKEN=ghp_xxx' >> ~/.zshrc   # 可选，github-stars 5000 req/h
```

**通知零配置**：所有 PR 自动 `--assignee @me`；scan-only 旧管线（hansard/videos/voices）有新内容时调 `gh issue create --assignee @me`。GitHub 原生送邮件 + web 通知。

### 添加新管线的 6 步流程

1. `mkdir -p scripts/refresh/<domain>/data/{raw,summaries}`
2. 复制 `scripts/refresh/policies/` 全套（sources.ts + scan/enrich/emit/run.ts）改字段
3. 在 `scripts/refresh/registry.json` 加一行（type/schedule/script/args/mode）
4. dry-run：`npx tsx scripts/refresh/<domain>/run.ts --dry-run --limit=2`
5. e2e：去掉 `--dry-run` 跑一次，验证 PR 自动开
6. PR 前必跑：`npm run check && npm run build && node scripts/i18n-check.mjs`

CLI 必须支持：`--dry-run / --limit=N / --no-commit / --no-push`

## 部署

独立部署在 Cloudflare Pages，绑定 `sgai.md`。push main 分支后 Cloudflare 自动构建（`npm run build` → `dist/`）。

CI gating 由 `.github/workflows/actions.yaml` 跑 build matrix + `npm run check`，与 Cloudflare 部署相互独立。
