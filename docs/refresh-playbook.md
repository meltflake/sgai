# 数据刷新基建（Refresh Playbook）

sgai.md 每个页面的数据来源、更新频率、对应脚本与命令的统一索引。
**新加管线时，先读这份。要更新某个页面时，找到对应小节按命令执行。**

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

- **数据**: `src/data/videos.ts`（54 条），`src/data/video-transcripts.ts`（1.4 MB）
- **来源**: 7 个 YouTube 频道 RSS（CNA / ST / govsg / Smart Nation / AISG / WEF / Bloomberg）
- **现状**: ✅ 完整 pipeline，但 step 2 是人工 review
- **更新命令**:

```bash
# 扫描候选
cd scripts && python3 videos/01_scan_channels.py --exclude-existing --days 14

# 人工审核（交互）
python3 videos/02_review_and_merge.py

# 抓字幕（需 yt-dlp）
npx tsx scripts/videos/fetch-transcripts.ts --ids=<id>

# 翻译字幕
npx tsx scripts/videos/translate-transcripts.ts --ids=<id>
```

- **频率**: 周级

#### `/speeches/[id]` + `/voices` + `/voices/[id]`

- **数据**: `src/data/voices.ts`（含 `mddiSpeeches`），`src/data/speech-transcripts.ts`（1.2 MB），`src/data/people.ts`（91 KB）
- **来源**: MDDI 新闻室 + 政府官网 + LinkedIn + AISG/IMDA 名单
- **现状**: ⚠️ MDDI 演讲扫描完成；people 仍靠 prospect-stubs 半自动
- **更新命令**:

```bash
# MDDI 演讲扫描
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
- **来源**: smartnation / MDDI / IMDA / AI Verify / MAS / PDPC / MOH / NRF / MOF（sitemap + listing 双扫）
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
- **来源**: e27 RSS、tech.gov.sg sitemap（MVP — `scripts/refresh/ecosystem/sources.ts` 可扩展）
- **现状**: ✅ auto-PR pipeline 已建；e27 RSS 实测返回 0 条（feed 解析或 UA 检测问题，待优化）；schema 已加 `_pendingReview` 字段，自动 emit 的条目 default 标 pending
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
- **现状**: ❌ 无 pipeline
- **建议**: 半自动——脚本下载报告 PDF → 抽数 → 人工审核
- **频率**: 半年/年

#### `/benchmarking` + `/benchmarking/[region]`

- **数据**: `src/data/benchmarking.ts`（58 KB / 23 regions）
- **来源**: 同 tracker
- **现状**: ❌ 无 pipeline
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

- **数据**: `src/data/talent.ts`（8.6 KB / 8 programmes + stats）
- **来源**: AISG / SkillsFuture / IMDA 公布数字
- **现状**: ❌ 无 pipeline
- **频率**: 半年

#### `/startups`

- **数据**: `src/data/startups.ts`（13 KB / unicorns, exits, investors）
- **来源**: Crunchbase / e27 / 自研
- **现状**: ❌ 无 pipeline
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

`gh` CLI 必须 `gh auth status` 已认证；`claude` CLI 必须 `claude --version` 能跑且已登录（cron 沿用 macOS keychain）。SMTP 凭据在 `auto_update_config.py`。详见 [scripts/SETUP.md](../scripts/SETUP.md)。
