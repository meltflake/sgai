# 数据刷新基建（Refresh Playbook）

sgai.md 每个页面的数据来源、更新频率、对应脚本与命令的统一索引。
**新加管线时，先读这份。要更新某个页面时，找到对应小节按命令执行。**

> 🔒 **覆盖由机器强制**：哪个 `src/data/*.ts` 归哪条管线，单一真相是 [`scripts/refresh/registry.json`](../scripts/refresh/registry.json)——每条 pipeline 的 `targets[]` + 顶层 `editorial[]`。`scripts/evals/coverage-audit/check.ts`（weekly evals + CI 硬门）断言每个数据文件都有归属、无 orphan、无 stale 路径。本文档的状态列是人读副本，**以 registry 为准**；改了管线产物记得同步 registry `targets`。

---

## 设计原则

1. **抓取 → 翻译 → 生成 TS 三段式**。每条管线必须有这三步，每步可独立重跑。
   - Step 1: 从外部源抓 raw → JSON 缓存到 `scripts/<domain>/data/raw/`
   - Step 2: 用 `scripts/lib/translate.ts` 出 zh/en 双字段 → `scripts/<domain>/data/translations/`
   - Step 3: emit 到 `src/data/<name>.ts`（合并 raw + translations）
2. **i18n 双字段强制**。每个 user-visible 字段都要有 `*En` 兄弟。`npm run build && node scripts/i18n-check.mjs` 必须通过。详见 [docs/i18n.md](i18n.md)。
3. **半自动 review queue 优先于全自动写入**。生成 prospect JSON 给人/agent 审核，避免 AI 把垃圾内容直接写进 user-facing 数据。
4. **状态持久化**。`scripts/data/last_scan_state.json` 记录上次扫描的最高 ID / 已处理 URL，避免重复抓。
5. **日志可追溯**。每次 scan 写日志到 `scripts/logs/`，30 天滚动清理。

---

## 共享原语（scripts/lib/）

> 任何新管线先用这里的现成工具，不要重复造轮子。所有模块带 `scripts/lib/__tests__/<name>.test.ts`，跑 `npm run test:lib` 验证。

| 模块 | 用途 | 状态 |
|---|---|---|
| `lib/translate.ts` | OpenAI 翻译，zh ↔ en，分批 + 并发 + 重试 + sha256 内容缓存。导出 `translateBatch / translateOne / translateRecords` | ✅ 已建 |
| `lib/state.ts` | `last_scan_state.json` 读写（兼容 legacy flat schema），`getDomainState/setDomainState` 类型安全访问 | ✅ 已建 |
| `lib/i18n-pair.ts` | 校验 `*En` 字段配对，支持多行字符串 / 数组值 / 注释豁免；CLI: `npx tsx scripts/lib/i18n-pair.ts <files>` | ✅ 已建 |
| `lib/auto-commit.ts` | 安全 git commit + push + `gh pr create`；导出 `autoCommit() / pushAndOpenPR() / buildPRBody()` | ✅ 已建 |
| `lib/github-stars.ts` | `parseGithubUrl / fetchRepoStats / findGithubBlocks / rewriteStarsLine` | ✅ 已建 |
| `lib/sprs-api.ts` | Hansard SPRS API connector（`fetchHansardTopic / scanIdRange / htmlToParagraphs / matchesAiKeywords`） | ✅ 已建 |
| `lib/gov-fetch.ts` | 通用 .gov.sg 页面抓取 + sitemap 解析（`govFetch / listSitemap`），含重试 / 超时 / sitemap-index 递归 | ✅ 已建 |
| `lib/ai-summarize.ts` | OpenAI 双语摘要 + 闭集分类 + confidence 自评，强制 sourceUrl，sha256 缓存 | ✅ 已建 |
| `lib/youtube-rss.ts` | YouTube channel RSS 扫描 | 已嵌在 `videos/01_scan_channels.py`，按需抽 |
| `lib/mddi-sitemap.ts` | MDDI 演讲 sitemap connector | 已嵌在 `voices/01_scan_mddi.py`，按需抽 |

---

## Per-Page 索引（25+ 页面）

### 高优先级动态（每周/每月）

#### `/debates` + `/debates/[id]` + transcript

- **数据**: `src/data/debates.ts`（150 条），`src/data/debate-transcripts.ts`（14 MB）
- **来源**: SPRS Hansard API
- **现状**: ✅ 完整 pipeline
- **更新命令**:

```bash
# 扫描发现新辩论 → 生成邮件
cd scripts && python3 auto_update.py --only hansard

# 抓单条 transcript（已知 debateId）
npx tsx scripts/hansard/fetch-debate-transcripts.ts --ids=<id>

# 翻译 transcript（注：旧 hansard 脚本仍调 OpenAI；新管线均改用本地 claude CLI）
npx tsx scripts/hansard/translate-debate-transcripts.ts --ids=<id>

# 摘要 / 政策模式分析（写到 debates.ts）
# Step 3-4 用 Claude 直接做即可（无需 OpenAI）：
#   读 raw transcript → 出中英摘要 → 手动编辑 debates.ts
```

- **频率**: 周级（国会休会期间静默）

#### `/videos` + `/videos/[id]` + transcript

- **数据**: `src/data/videos.ts`，`src/data/video-transcripts.ts`
- **来源**: 7 个 YouTube 频道 RSS+HTML（CNA / ST / govsg / Smart Nation / AISG / WEF / Bloomberg）
- **现状**: ✅ **全自动 auto-PR**（2026-07-28 起；此前是 scan-only + 人工 emit，两次丢视频后按审计 P1 改造）
- **更新命令**:

```bash
# 全链路（daily cron 跑的就是这条）：扫描 → 过滤 → emit → 四语字幕 → commit → PR
npx tsx scripts/refresh/videos/run.ts               # 全流程
npx tsx scripts/refresh/videos/run.ts --dry-run     # 只看会 emit 什么
npx tsx scripts/refresh/videos/run.ts --limit=2 --no-push   # 小批量本地验证

# 手动指定视频（绕过扫描，直接 emit 已知 videoId）
npx tsx scripts/refresh/videos/emit.ts --ids=<videoId1,videoId2>

# 单独抓字幕（需 yt-dlp）—— 自动 chain en→zh→ja→ko，单条命令到四语对齐
npx tsx scripts/videos/fetch-transcripts.ts --ids=<id>

# 校验四语对齐（CI 强制门）
npm run eval:video-transcript -- --base=origin/main          # PR diff 模式
npm run eval:video-transcript -- --include-historical        # 全量审计
```

- **机制要点**：
  - 扫描落盘 `scripts/videos/data/candidates.json` 走 **merge-write**（按 videoId 并集、剔除已入库），RSS 窗口只有 15 条也不丢候选
  - `state.domains.videos.video_ids` 记录「已 emit 过」的 id——PR 未合并期间不重复 emit；**PR 被拒的视频永久不回来**（人说过的 no 就是 no），要重发就从 state 里删掉该 id
  - emit 失败 → state 不更新 → 次日自动重试；字幕翻译失败 → PR 上 `eval:video-transcript` 红灯挡合并
- **频率**: 日级（cron auto-PR）

#### `/speeches/[id]` + `/voices` + `/voices/[id]`

- **数据**: `src/data/voices.ts`（含 `mddiSpeeches`，数组名保留但已收 MDDI+MAS+PMO+MOH+MOE 五源，靠可选 `ministry` 字段区分），`src/data/speech-transcripts.ts`（1.2 MB），`src/data/people.ts`（91 KB）
- **来源**: MDDI 新闻室 + MAS `/news/speeches/` + PMO 新闻室 + MOH 新闻室 + MOE `/news/speeches/`（2026-08 扩源）+ 政府官网 + LinkedIn + AISG/IMDA 名单
- **现状**: ✅ 五部委演讲 weekly 自动扫描（MAS/PMO 只收 ≥2026-01-01，拒绝决策缓存在 `scripts/refresh/voices/data/rejected-ids.json`）；people 仍靠 prospect-stubs 半自动
- **更新命令**:

```bash
# 五部委演讲扫描（MDDI + MAS + PMO + MOH + MOE，weekly cron 同款入口）
npx tsx scripts/refresh/voices/run.ts --dry-run          # 预览候选
npx tsx scripts/refresh/voices/run.ts --limit=3          # 全流程 + auto-PR
# 新源接入时的一次性回填闸排空（fetch 日期→写 pre-floor 拒绝缓存，无 LLM）
npx tsx scripts/refresh/voices/seed-date-floor.ts --source=pmo

# 旧版 Python 管线（仅 MDDI，已被上面 tsx 管线取代，留档）
cd scripts && python3 voices/01_scan_mddi.py --exclude-existing
python3 voices/02_fetch_speeches.py
python3 voices/03_generate_ts.py

# people 三无补全（review queue）
npx tsx scripts/voices/prospect-stubs.mjs list
npx tsx scripts/voices/prospect-stubs.mjs queue --top 10
# 编辑 scripts/voices/data/prospects/<id>.json，status: ready
npx tsx scripts/voices/prospect-stubs.mjs apply <id>  # 出 TS 片段，粘到 people.ts
```

- **频率**: 月级

#### `/policies` + `/policies/[id]`

- **数据**: `src/data/policies.ts`（80 KB / 5 categories / ~36 条）
- **来源**: smartnation / MDDI / IMDA / AI Verify / MAS / PDPC / CSA / MOH / NRF / MOF（sitemap + listing 双扫；CSA 2026-08-03 加入，AI 安全监管层）
- **现状**: ✅ 完整 auto-PR pipeline
- **更新命令**:

```bash
npx tsx scripts/refresh/policies/run.ts --dry-run --limit=5     # 仅扫描，不入盘
npx tsx scripts/refresh/policies/run.ts --limit=5               # 全流程，自动开 PR
npx tsx scripts/refresh/policies/run.ts --only-domain=imda.gov.sg
npx tsx scripts/refresh/policies/run.ts --no-push              # 仅 commit 不开 PR
```

- **失败回退**: emit 后跑 `i18n-pair.ts` 校验，缺 `*En` 字段自动 rollback；任意一步失败邮件标红
- **频率**: 月级（cron monthly）
- **置信度**: AI 摘要返回 high/medium/low；low 标 `_pendingReview`，不上首页

#### `/ecosystem` + `/ecosystem/[id]`

- **数据**: `src/data/ecosystem.ts`（272 KB / 10 categories / 几百实体）
- **来源**: aisingapore.org RSS、businesstimes.com.sg tech RSS、tech.gov.sg sitemap、channelnewsasia.com RSS、news.nus.edu.sg sitemap（2026-08-03 扩源；`scripts/refresh/ecosystem/sources.ts` 可扩展）
- **现状**: ✅ auto-PR pipeline 已建；schema 已加 `_pendingReview` 字段，自动 emit 的条目 default 标 pending。e27 / govinsider / straitstimes 已于 2026-05-03 因 Cloudflare JS challenge / JS-rendered 无真实 RSS 而弃用（2026-07-04 复测 e27 带浏览器 UA 仍 403，结论不变），换用上面三个已验证可用源
- **更新命令**:

```bash
npx tsx scripts/refresh/ecosystem/run.ts --dry-run --limit=5
npx tsx scripts/refresh/ecosystem/run.ts --limit=5
```

- **审核流**: PR 里 `_pendingReview: true` 改为 false 即上线（或删除字段）。listing 页过滤 pending；详情页保留并显示 "Pending review" 角标（待 UI 实现）
- **TODO**: 加更多源（Crunchbase API、AISG companies 名单、Singapore Statutes Online 公司注册等）
- **频率**: 月级

---

### 中优先级半动态（季度/半年）

#### `/tracker` + `/tracker/[dim]` + `/tracker/methodology`

- **数据**: `src/data/tracker.ts`（53 KB / 6 dimensions：investment / talent / compute / adoption / research / governance）
- **来源**: Stanford AI Index、IMD WCY、Tortoise GAII、政府发布数（年度）
- **现状**: ✅ auto-PR pipeline（已建，half-yearly）；`scripts/refresh/tracker/run.ts` 仅追踪新数据点，落库数字仍需人工提取
- **更新命令**: `npx tsx scripts/refresh/tracker/run.ts --dry-run --limit=3`
- **频率**: 半年/年

#### `/benchmarking` + `/benchmarking/[region]`

- **数据**: `src/data/benchmarking.ts`（58 KB / 23 regions）
- **来源**: 同 tracker
- **现状**: ✅ auto-PR pipeline（已建，half-yearly）；`scripts/refresh/benchmarking/run.ts` 仅追踪新年度报告，数字仍需人工提取
- **更新命令**: `npx tsx scripts/refresh/benchmarking/run.ts --dry-run --limit=3`
- **频率**: 年级

#### `/levers` + `/levers/[id]`

- **数据**: `src/data/levers.ts`（72 KB / 6 抓手）
- **来源**: imda.gov.sg、tech.gov.sg、edb.gov.sg sitemap
- **现状**: ✅ auto-PR pipeline；新条目自动加进 lever 1 的 "Auto-discovered (pending review)" 子组，PR 中由 Luca 移到正确抓手
- **更新命令**:

```bash
npx tsx scripts/refresh/levers/run.ts --dry-run --limit=3
npx tsx scripts/refresh/levers/run.ts --limit=3
```

- **频率**: 季度（cron quarterly）

#### `/timeline`

- **数据**: `src/data/timeline.ts`（15 KB / 13 顶级条目）
- **来源**: 大事年表（半事件半编辑）
- **现状**: ❌ 无 pipeline
- **建议**: 每次新增重大事件时手动追加，或在 hansard/policies 管线里检测里程碑触发追加
- **频率**: 季度

#### `/talent`

- **数据**: `src/data/talent.ts`（41 KB / 8 programmes + expandable profiles）
- **来源**: AISG / SkillsFuture / IMDA 公布数字
- **现状**: ✅ auto-PR pipeline（已建，half-yearly）；新条目入 `autoDiscovered[]` 待人工 promote
- **更新命令**: `npx tsx scripts/refresh/talent/run.ts --dry-run --limit=3`
- **频率**: 半年

#### `/startups`

- **数据**: `src/data/startups.ts`（13 KB / unicorns, exits, investors）
- **来源**: Crunchbase / e27 / 自研
- **现状**: ✅ auto-PR pipeline（已建，quarterly）；新条目入 `autoDiscovered[]` 待人工 promote
- **更新命令**: `npx tsx scripts/refresh/startups/run.ts --dry-run --limit=3`
- **i18n 注意**: `Unicorn.name` 没有 zh/en 区分（多英文原名）；`startups.ts` 是 i18n 双字段覆盖率最低的文件之一
- **频率**: 季度

#### `/community-opensource` + `/opensource`

- **数据**: `community-opensource.ts`（5.9 KB），`opensource.ts`（6.6 KB），都有 `stars` 字段
- **来源**: GitHub API（直接读 .ts 里的 url 字段）
- **现状**: ✅ auto-PR pipeline
- **更新命令**:

```bash
npx tsx scripts/refresh/github-stars.ts --dry-run               # 看 diff
npx tsx scripts/refresh/github-stars.ts                         # 写盘 + 自动开 PR
npx tsx scripts/refresh/github-stars.ts --bump-version          # 同时 bump src/version.ts
npx tsx scripts/refresh/github-stars.ts --no-push                # 仅 commit
GITHUB_TOKEN=ghp_xxx npx tsx scripts/refresh/github-stars.ts    # 提升 rate limit
```

- **频率**: 月级（cron monthly）

---

### 低优先级近静态（年级或编辑）

| 路由 | 数据文件 | 来源 | 备注 |
|---|---|---|---|
| `/` | 无独立数据 | 派生 | 从 debates / levers / policies 等聚合，无需单独 pipeline |
| `/about` | 静态 + `version.ts` | 编辑 | — |
| `/challenges` | 静态 Astro | 编辑 | — |
| `/evolution` | 静态 Astro | 编辑 | — |
| `/legal-ai` | `legal-ai.ts` | sso.agc.gov.sg / MAS / PDPC sitemap → AI 分类 → auto-PR | ✅ 已建（half-yearly），新条目入 "Auto-discovered" section 待 Luca 移位 |
| `/references` | `references.ts` | 自研 | 看到好文章手工加 |
| `/fieldnotes` | `fieldnotes.ts` | 自研 | 类似博客 |

---

### `/updates` + 月报（Newsletter）

`/updates` 本身无数据文件——它从 `src/data/updates.ts`（编辑性 site/fix/longform）+ `src/utils/derived-updates.ts`（每条 record 的 `addedAt` 派生）合并而来，加 record 就自动出现，无需单独 pipeline。

月报是这条 feed 的月度切片，**两个产物一份数据**：邮件正文（Buttondown）+ 站内长文（`src/data/post/monthly-YYYY-MM.md`，有永久 URL、SEO、llms.txt 条目）。每月初手工跑一次：

```bash
# 1. 生成 zh 长文（默认写 src/data/post/monthly-YYYY-MM.md）
npx tsx scripts/refresh/newsletter/generate-monthly.ts --month=2026-08 --emit-post
#    可选：--out=<path> 换输出路径、--publish-date=YYYY-MM-DD 换发布日、--topics=a,b 覆盖 topicIds
#    不加 --emit-post 就是老行为：邮件正文打到 stdout（--lang=zh|en）

# 2. 手写「## 本月主线」那段（模板留了占位符 2–3 句）

# 3. 四语：en / ja / ko 真翻译，zh-tw 确定性 OpenCC 派生
npx tsx scripts/refresh/post-translations/translate-post.ts --src=src/data/post/monthly-2026-08.md --target=en
npx tsx scripts/refresh/post-translations/translate-post.ts --src=src/data/post/monthly-2026-08.md --target=ja
npx tsx scripts/refresh/post-translations/translate-post.ts --src=src/data/post/monthly-2026-08.md --target=ko
npx tsx scripts/hansard/derive-zh-tw-posts.ts monthly-2026-08

# 4. 校验后开 PR
npm run check:post-i18n
```

要点：

- `translate-post.ts` 偶发 JSON 解析失败（长文含「」时），**原样重跑即可**，不要去改中文原文。
- 正文由纯函数 `scripts/refresh/newsletter/build-monthly-post.ts` 的 `buildMonthlyPost()` 组装（无 `src/data` 依赖，单测在 `__tests__/build-monthly-post.test.ts`）。
- `topicIds` 从当月 policy / debate / video 三类 record 的 topic 映射取并集；并集为空时回落 `['national-strategy']`，保证 `npm run check:graph` 的 post coverage 门通过。frontmatter 里必须是**单行内联数组**（verify-graph 用 `/^topicIds: \[(.*)\]$/m` 匹配）。
- **不要只提交 zh 原文**——`check:post-i18n` 要求 en/ja/ko/zh-tw 四个镜像同 PR 齐全。
- Buttondown 邮件正文 = 站内长文链接 + 那行统计（`本月站内更新 N 条：…`），不要把全文粘进邮件——邮件负责导流，长文负责留存。
- 订阅表单组件 `src/components/common/NewsletterSignup.astro` 已挂在页脚和 `/updates`，但 `BUTTONDOWN_FORM_ID` 为空时整个组件不渲染；建号后填一行即可上线。

---

## 添加新管线的 6 步流程

1. **建目录**: `mkdir -p scripts/refresh/<domain>/data/{raw,summaries}`
2. **写 sources.ts**: 列出 sitemap / 列表页 URL + URL 过滤 regex（看 `policies/sources.ts` 模板）
3. **写 scan/enrich/emit/run.ts**: 复制 `policies/` 模板改字段
   - `scan.ts`: 调 `lib/gov-fetch.ts` 的 `listSitemap`，按 sources.ts 过滤
   - `enrich.ts`: 调 `lib/ai-summarize.ts` 出双语摘要 + 分类 + 置信度
   - `emit.ts`: AST surgery 插入到 `src/data/<file>.ts`，emit 后必跑 `lib/i18n-pair.ts` 校验
   - `run.ts`: orchestrator + 调 `lib/auto-commit.ts` 的 `autoCommit + pushAndOpenPR`
4. **注册**: 在 `scripts/refresh/registry.json` 添加一行（type: tsx, schedule, script, args, mode）
5. **dry-run 验证**: `npx tsx scripts/refresh/<domain>/run.ts --dry-run --limit=2`
6. **必跑校验**:
   - `npm run check`（含 `npm run test:lib`，57 单元测试）
   - 真实跑一次 `--limit=1` e2e，确认 PR 自动开
   - 邮件正文目检：subject 含 PR count、body 含 PR 链接

每条管线必须支持三个标准 flag：`--dry-run`、`--limit=N`、`--no-commit`、`--no-push`。

---

## 翻译统一入口

```ts
import { translateRecords } from 'scripts/lib/translate';

// 给整个 records 数组批量补 *En 字段（已有非空的会跳过）
const filled = await translateRecords(records, ['title', 'description'], {
  direction: 'zh→en',
  cacheDir: 'scripts/refresh/<domain>/data/translations',
});
```

AI 摘要 + 翻译走本地 `claude` CLI（无需 API key）。可选环境变量：`SGAI_CLAUDE_MODEL=haiku|sonnet|opus`（默认 haiku，便宜）、`SGAI_TRANSLATION_CONCURRENCY=2`。缓存 sha256(direction + 原文)，重跑零成本。

---

## 验证清单（每次 PR 前）

- [ ] `npm run check`（含 lint + graph + 57 lib unit tests + 现有 transcripts 检查）
- [ ] `npm run build && node scripts/i18n-check.mjs`（dist/en 中文残留）
- [ ] `npm run check:video-transcripts`（如果动了 videos）
- [ ] `npm run check:debate-transcripts`（如果动了 debates）
- [ ] auto-PR 管线则不需要手动 bump `src/version.ts`，github-stars.ts `--bump-version` 自动；其他管线 PR 合并时 Luca 决定是否手动 bump
- [ ] 数据来源在 PR 描述里（auto-PR 模式自动生成 buildPRBody）

---

## 调度 / 部署

详见 [scripts/README.md](../scripts/README.md)。Cron 总入口：

```bash
0 8 * * 1         python3 scripts/auto_update.py --schedule=weekly
0 8 1 * *         python3 scripts/auto_update.py --schedule=monthly
0 8 1 1,4,7,10 *  python3 scripts/auto_update.py --schedule=quarterly
0 8 1 1,7 *       python3 scripts/auto_update.py --schedule=half-yearly
```

`gh` CLI 必须 `gh auth login` 已认证（用于 PR 创建 + Issue 通知）；`claude` CLI 必须已登录（cron 沿用 macOS keychain）。**无需 SMTP / Gmail App Password**——所有通知走 GitHub（PR @assignee + scan-only 管线开 Issue）。详见 [scripts/SETUP.md](../scripts/SETUP.md)。
