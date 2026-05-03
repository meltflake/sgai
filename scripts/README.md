# sgai 数据更新脚本

## 概览

```
scripts/
  auto_update.py                  # 统一调度入口（registry-driven）
  auto_update_config.example.py   # 配置模板（复制为 auto_update_config.py）
  auto_update_config.py           # 真实配置（不入 git）— SMTP 凭据
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

扫描 7 个 YouTube 频道（CNA、ST、govsg、Smart Nation、AI Singapore、WEF、Bloomberg），通过 RSS feed 获取最新视频，用 AI 关键词过滤。

| 步骤 | 脚本 | 自动化 | 依赖 |
|------|------|--------|------|
| 扫描频道 | `01_scan_channels.py` | 可自动 | requests, feedparser |
| 人工审核 | `02_review_and_merge.py` | 需人工 | — |

```bash
# 手动运行
cd scripts
python videos/01_scan_channels.py --exclude-existing --days 14
python videos/02_review_and_merge.py  # 交互式审核
```

输出: `data/candidates.json` -> 人工审核后合并到 `src/data/videos.ts`

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

- 依次运行三条管线的**发现/扫描**步骤
- 汇总结果，有新内容时发送 Gmail 邮件通知
- 错误隔离：一条管线失败不影响其他管线
- 状态持久化：记录上次扫描的最高 Hansard ID，避免重复扫描
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

### 邮件内容示例

```
Subject: [AISG 数据更新] 2026-04-07: 3 新视频, 2 新演讲, 0 新辩论

YouTube 视频: 3 条新候选
  - [2026-04-05] CNA: Singapore's AI push...
  人工审核: cd scripts && python videos/02_review_and_merge.py

MDDI 演讲: 2 条新发现
  - [2026-04-01] Josephine Teo: Speech at...

国会辩论: 无新内容 (扫描范围: oral 4088..4137, written 21916..21965)

运行耗时: 45s | 错误: 0 个
```

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

### 2. 配置邮件

```bash
cd /path/to/sgai/scripts

# 复制配置模板
cp auto_update_config.example.py auto_update_config.py

# 编辑配置，填入 Gmail App Password
# Gmail App Password 获取方式:
#   1. 登录 Google 账号
#   2. 安全 → 两步验证（需先开启）
#   3. App passwords → 生成一个 16 位密码
vim auto_update_config.py
```

### 3. 测试

```bash
cd /path/to/sgai/scripts

# 先干跑确认脚本正常
python3 auto_update.py --dry-run

# 发一封测试邮件
python3 auto_update.py --only videos
```

### 4. 设置 crontab（4 个 schedule）

新管线（policies / ecosystem / github-stars / startups / talent / tracker / benchmarking / levers / legal-ai）会自动 push 分支 + open PR；本地 cron 跑完后 Luca 在 GitHub review/merge。crontab 推荐 4 行（替换路径）：

```cron
PROJECT=/Users/lucawu/Library/CloudStorage/Dropbox/Github/sgai
PYTHON=/tmp/sgai-venv/bin/python

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
- **睡眠**: Mac 处于睡眠状态时 cron 不会触发，下次醒来后的下一个周期会执行（对数据扫描来说可接受）

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
| `auto_update_config.py` | 否 | 真实配置（含 SMTP 密码） |
| `data/last_scan_state.json` | 否 | 扫描状态（自动生成） |
| `data/candidates.json` | 否 | YouTube 候选视频 |
| `data/mddi_speeches.json` | 否 | MDDI 演讲稿 |
| `logs/` | 否 | 运行日志（30 天自动清理） |
