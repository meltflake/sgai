# sgai 数据更新脚本

## 概览

```
scripts/
  auto_update.py                  # 统一调度入口（registry-driven）
  auto_update_config.example.py   # 配置模板（复制为 auto_update_config.py）
  auto_update_config.py           # 可选（不入 git）— 仅环境变量覆盖
  requirements.txt                # Python 依赖（用于 /tmp/sgai-venv）
  refresh/                        # 新管线（全部 type=tsx，全部 auto-PR）
    registry.json                 # 管线注册表（schedule / script / args / mode）
    _shared/run-template.ts       # 复用 orchestrator
    github-stars.ts               # 月：刷 GitHub stars + bump version
    policies/                     # 月：smartnation/MDDI/IMDA/MAS/PDPC
    ecosystem/                    # 月：AISG/BT/tech.gov.sg
    levers/                       # 季：IMDA/tech.gov.sg/EDB
    startups/                     # 季：BT/AISG/EDB
    legal-ai/                     # 半年：sso.agc.gov.sg/MAS/PDPC
    talent/                       # 半年：AISG/IMDA/tech.gov.sg
    tracker/                      # 半年：IMDA/EDB/Stanford HAI
    benchmarking/                 # 半年：Stanford HAI/IMD（仅追踪新报告）
  lib/                            # 共享原语（test:lib 单元测试）
  videos/, voices/, hansard/      # 旧三条 Python 管线（保留，scan-email 模式）
  data/                           # 各管线状态文件 + 缓存
  logs/                           # auto_update 日志（30 天滚动）
```

---

## 三条数据管线

### 1. YouTube 视频发现 (`videos/`)

扫描 7 个 YouTube 频道（CNA、ST、govsg、Smart Nation、AI Singapore、WEF、Bloomberg），通过 RSS+HTML 获取最新视频，用 AI 关键词过滤。**2026-07-28 起全自动 auto-PR**——扫描、emit、四语字幕、开 PR 全链路由 `scripts/refresh/videos/run.ts` 编排，人只做 PR merge。

| 步骤 | 脚本 | 自动化 | 依赖 |
|------|------|--------|------|
| 全链路编排 | `refresh/videos/run.ts` | 全自动（daily cron） | python3, claude CLI, yt-dlp |
| 扫描频道 | `videos/01_scan_channels.py` | run.ts 调用（也可单跑） | requests, feedparser |
| emit + 字幕 | `refresh/videos/emit.ts` | run.ts 调用（也可 `--ids=` 单跑） | claude CLI, yt-dlp |

```bash
# 全流程（cron 跑的就是这条）
npx tsx scripts/refresh/videos/run.ts

# 只看会 emit 什么
npx tsx scripts/refresh/videos/run.ts --dry-run
```

候选持久化在 `videos/data/candidates.json`（merge-write，按 videoId 去重）；已 emit 的 id 记录在 `data/last_scan_state.json` 的 `domains.videos.video_ids`。

### 2. MDDI 演讲稿 (`voices/`)

扫描新加坡数码发展及新闻部（MDDI）网站 sitemap，通过 URL slug 关键词过滤出 AI 相关演讲稿。

| 步骤 | 脚本 | 自动化 | 依赖 |
|------|------|--------|------|
| 扫描 MDDI | `01_scan_mddi.py` | 可自动 | requests, beautifulsoup4 |

```bash
cd scripts
python voices/01_scan_mddi.py --exclude-existing
python voices/01_scan_mddi.py --year 2026 --skip-fetch  # 快速模式
```

输出: `data/mddi_speeches.json` -> 人工合并到 `src/data/voices.ts`

### 3. 国会辩论 (`hansard/`)

从新加坡国会辩论记录（Hansard）中发现和采集 AI 相关辩论。

| 步骤 | 脚本 | 自动化 | 依赖 |
|------|------|--------|------|
| 发现 ID | `01_discover_debates.py` | 半自动 | playwright |
| 获取全文 | `02_fetch_debates.py` | 可自动 | requests, beautifulsoup4 |
| AI 摘要 | `03_enrich_debates.py` | 需 API key | openai |
| AI 分析 | `04_analyze_patterns.py` | 需 API key | openai |
| 生成 TS | `05_generate_ts.py` | 可自动 | — |

自动更新脚本使用**轻量 API 扫描**替代 Step 1（避免 Playwright 依赖），从已知最高 ID 向上递增扫描 SPRS API。

```bash
# 手动完整流程
cd scripts/hansard
python 01_discover_debates.py      # 需要 Playwright
python 02_fetch_debates.py
# Step 3-4 可用 Claude 替代 OpenAI
python 05_generate_ts.py
```

---

## 统一调度脚本 (`auto_update.py`)

### 功能

- 依次运行注册表里的 9+ 条管线（registry-driven）
- auto-PR 管线：自动 push + `gh pr create --assignee @me`
- scan-only 管线：有新内容或出错时调 `gh issue create --assignee @me`
- 错误隔离：一条管线失败不影响其他管线
- 状态持久化：`scripts/data/last_scan_state.json`
- 日志管理：自动清理 30 天前的日志

### 用法

```bash
cd scripts

# 完整运行并发邮件
python auto_update.py

# 干跑模式（不发邮件）
python auto_update.py --dry-run

# 只运行某条管线
python auto_update.py --only videos
python auto_update.py --only voices
python auto_update.py --only hansard

# 详细输出
python auto_update.py --verbose --dry-run
```

### 通知示例

auto-PR 管线（policies / ecosystem / 等）：

> GitHub PR `[data-refresh] policies: +3 entries` opened by you, assigned to @wulujia
> （触发 GitHub 邮件 + web 通知）

scan-only 管线（hansard / videos / voices）有新内容时：

> GitHub Issue `[sgai] data-refresh 2026-04-07: videos +3, voices +2`
> assigned to @wulujia, labelled `data-refresh,scan-result`

无 SMTP / Gmail App Password 配置。`gh auth login` 一次即可。

---

## 新设备安装指南

### 1. 安装 Python 依赖（venv 推荐）

```bash
# 创建专用 venv（避免污染系统 Python；默认路径 /tmp/sgai-venv）
python3 -m venv /tmp/sgai-venv
/tmp/sgai-venv/bin/pip install -r scripts/requirements.txt

# 跑 Python 管线时用 venv 路径
/tmp/sgai-venv/bin/python scripts/auto_update.py --schedule=weekly

# crontab 也用 venv 完整路径（见下文 step 4）
```

如果需要运行 `hansard/01_discover_debates.py`（非必须；轻量 SPRS API 已替代）：

```bash
/tmp/sgai-venv/bin/pip install playwright
/tmp/sgai-venv/bin/python -m playwright install chromium
```

### 2. 配置通知（GitHub，无需 SMTP）

通知走 GitHub PR `--assignee @me` 和 `gh issue create --assignee @me`。`gh auth login` 一次即可：

```bash
gh auth login    # 选 GitHub.com → HTTPS → 浏览器登录
gh auth status   # 应输出 "Logged in to github.com as <你的账号>"
```

`auto_update_config.py` 现在只用作可选环境变量覆盖（默认配置可直接跑）：

```bash
cp scripts/auto_update_config.example.py scripts/auto_update_config.py
# 仅在你想覆盖默认 LLM 模型 / 并发等时编辑
```

### 3. 测试

```bash
cd /path/to/sgai/scripts

# 先干跑确认脚本正常
python3 auto_update.py --dry-run

# 发一封测试邮件
python3 auto_update.py --only videos
```

### 4. 设置定时（推荐：一条心跳 + --due 自愈）

新管线（policies / ecosystem / github-stars / startups / talent / tracker / benchmarking / levers / legal-ai）会自动 push 分支 + open PR；本地 cron 跑完后 Luca 在 GitHub review/merge。

**推荐做法——脚本自管理 crontab。** 用「要跑 cron 的那个解释器」（即装了 `requests`/`feedparser`/`bs4` 的 venv）跑一次：

```bash
# 用带依赖的 venv 解释器跑，cron 会沿用同一个解释器
~/.venvs/sgai/bin/python scripts/auto_update.py --install-cron
```

它会写入**一行**幂等的 managed crontab（每天 08:00 跑 `--due`），并把当前 PATH 烤进去，`npx`/`gh`/`node` 在 cron 下可解析。装好后：

```bash
python scripts/auto_update.py --status          # 看每个 schedule 上次跑/是否到期/cron 装没装
python scripts/auto_update.py --uninstall-cron  # 撤销
crontab -l                                       # 确认 managed 块已写入
```

**为什么是一条心跳而不是 4 行精确 cron**：纯 cron 在 Mac 睡眠/合盖时会**静默跳过**那一分钟的触发（1 号月度刷新合盖了就永远不跑）。`--due` 把 cadence 逻辑搬进脚本，按「距上次成功是否超过间隔」判断，每天一跳就能自愈式驱动 weekly/monthly/quarterly/half-yearly——掉电/睡眠后下次开机自动补跑过期的那几档。`--cron-hour=9` 可改触发小时。

**手动 4 行（旧法，仍可用）**——若你更想要精确 calendar 触发、且 Mac 长期开机：

```cron
PROJECT=/Users/lucawu/Library/CloudStorage/Dropbox/Github/sgai
PYTHON=~/.venvs/sgai/bin/python

# 周一 08:00 — 旧三条 Python 管线（hansard / videos / voices）
0 8 * * 1         cd $PROJECT && $PYTHON scripts/auto_update.py --schedule=weekly      >> scripts/logs/cron.log 2>&1
# 每月 1 号 08:00 — github-stars / policies / ecosystem
0 8 1 * *         cd $PROJECT && $PYTHON scripts/auto_update.py --schedule=monthly     >> scripts/logs/cron.log 2>&1
# Q1/Q2/Q3/Q4 第一天 08:00 — levers / startups
0 8 1 1,4,7,10 *  cd $PROJECT && $PYTHON scripts/auto_update.py --schedule=quarterly   >> scripts/logs/cron.log 2>&1
# 1 月 / 7 月 1 号 08:00 — legal-ai / talent / tracker / benchmarking
0 8 1 1,7 *       cd $PROJECT && $PYTHON scripts/auto_update.py --schedule=half-yearly >> scripts/logs/cron.log 2>&1
```

cron 不读 `.zshrc`。AI 摘要走本地 `claude` CLI（macOS keychain 凭据 cron 自动继承），不需要任何 API key。如果想覆盖默认模型 / 并发，把 `SGAI_CLAUDE_MODEL=haiku` 等写在 crontab 顶部或 `auto_update_config.py` 末尾。

### 4b. 准备 gh CLI + claude CLI

新管线开 PR 需要 `gh auth login` 已认证（cron 沿用 keychain）。AI 摘要 / 翻译需要 `claude` CLI 已登录。验证：

```bash
gh auth status
claude --version
bash scripts/doctor.sh   # 一次过所有检查
```

### 5. 验证 crontab

```bash
# 确认 cron 条目已保存
crontab -l

# 查看日志（下次运行后）
tail -f /path/to/sgai/scripts/logs/cron.log
cat /path/to/sgai/scripts/logs/auto_update_$(date +%Y-%m-%d).log
```

### macOS 注意事项

- **PATH**: crontab 中必须使用 Python 的**完整路径**（cron 的 PATH 只有 `/usr/bin:/bin`）
- **磁盘访问**: macOS Ventura+ 可能需要在 系统设置 > 隐私与安全 > 完全磁盘访问 中添加 `/usr/sbin/cron`
- **睡眠**: Mac 睡眠时 cron 不触发那一分钟。用推荐的 `--install-cron` + `--due`（§4）后这不成问题——脚本按上次成功时间判断到期，下次开机自动补跑过期的档；只有手动 4 行精确 cron 才会丢触发。

### Linux 服务器注意事项

```bash
# 确保 cron 服务运行
sudo systemctl status cron

# 如果没有 cron
sudo apt install cron
sudo systemctl enable cron
```

---

## 文件说明

| 文件 | 入 git | 说明 |
|------|--------|------|
| `auto_update.py` | 是 | 统一调度脚本 |
| `auto_update_config.example.py` | 是 | 配置模板 |
| `auto_update_config.py` | 否 | 可选环境变量覆盖（无 SMTP，所有通知走 GitHub） |
| `data/last_scan_state.json` | 否 | 扫描状态（自动生成） |
| `data/candidates.json` | 否 | YouTube 候选视频 |
| `data/mddi_speeches.json` | 否 | MDDI 演讲稿 |
| `logs/` | 否 | 运行日志（30 天自动清理） |
