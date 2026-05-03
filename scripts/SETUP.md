# sgai 数据刷新基建 — 配置手册

第一次在新机器（或这台 Mac）上跑完整 auto-PR 数据刷新管线，按本文档照做。

## 0. 一键体检

跑这一行能告诉你哪步没配好：

```bash
cd /Users/lucawu/Library/CloudStorage/Dropbox/Github/sgai
bash scripts/doctor.sh
```

下面每一步都对应 doctor 的一个检查项。

---

## 1. Python venv（hansard / videos / voices 旧三条管线必需）

```bash
python3 -m venv /tmp/sgai-venv
/tmp/sgai-venv/bin/pip install -r scripts/requirements.txt
```

校验：

```bash
/tmp/sgai-venv/bin/python -c "import requests, feedparser, bs4; print('ok')"
```

应输出 `ok`。

> Mac 重启会清 `/tmp`，要重跑这两行。如果想持久，把 venv 放 `~/.venvs/sgai/` 或类似位置，并改 [scripts/README.md](README.md) 里的 crontab 路径。

---

## 2. Node 依赖

```bash
npm install
```

`tsx` 是新管线的主入口，已在 devDependencies。如果有 npm 警告 `Unknown project config "shamefully-hoist"`，无视。

校验：

```bash
npx tsx --test scripts/lib/__tests__/*.test.ts
```

应看到 `ℹ pass 57` / `ℹ fail 0`。

---

## 3. gh CLI（auto-PR 必需）

```bash
brew install gh   # 如未装
gh auth login     # 选 GitHub.com → HTTPS → 用浏览器登录
gh auth status    # 应输出 "Logged in to github.com as <你的账号>"
```

cron 沿用 keychain 凭据，一次配置长期有效。

---

## 4. Claude Code CLI（LLM 后端，无需 API key）

新管线（policies / ecosystem / talent / startups / tracker / benchmarking / levers / legal-ai）的 AI 摘要 + 翻译都通过本地 `claude` CLI 调用，**完全不需要 OpenAI API key**——直接用你 Claude Code 已登录的账号。

```bash
which claude       # 应输出 /usr/local/bin/claude 或 ~/.local/bin/claude
claude --version   # 应输出 "<版本> (Claude Code)"
```

如果没装：[Claude Code 安装指南](https://docs.claude.com/en/docs/claude-code/quickstart)。装完后跑一次 `claude` 互动登录即可，cron 沿用 keychain 凭据。

可选环境变量：

```bash
export GITHUB_TOKEN=ghp_...                    # 可选，github-stars 5000 req/h
export SGAI_CLAUDE_MODEL=haiku                 # 默认 haiku（便宜）。换 sonnet 提升质量
export SGAI_TRANSLATION_CONCURRENCY=2          # 默认 2，避免 rate limit
```

> **cron 不读 `.zshrc`**。如果在 crontab 里要覆盖默认模型 / 并发，写在 crontab 顶部 export，或在 [scripts/auto_update_config.py](auto_update_config.example.py) 里 `os.environ.setdefault('SGAI_CLAUDE_MODEL', 'haiku')`。

---

## 5. SMTP（邮件通知）

```bash
cp scripts/auto_update_config.example.py scripts/auto_update_config.py
vim scripts/auto_update_config.py
```

填进去：

- `SMTP_USER` — 你的 Gmail
- `SMTP_PASSWORD` — Gmail App Password（**不是登录密码**，从 Google Account → Security → 2-Step Verification → App passwords 生成 16 位）
- `EMAIL_TO` — 收件人

`auto_update_config.py` 已在 `.gitignore`，不会进 git。

校验（发一封测试邮件）：

```bash
/tmp/sgai-venv/bin/python scripts/auto_update.py --schedule=weekly --dry-run
# DRY RUN 不会真发，但会打印 subject 和 body。
```

去掉 `--dry-run` 真发一封：

```bash
/tmp/sgai-venv/bin/python scripts/auto_update.py --only=github-stars --schedule=monthly
```

收件箱应看到 `[sgai] data-refresh ...` 邮件。

---

## 6. crontab（4 个 schedule）

```bash
crontab -e
```

粘贴：

```cron
PROJECT=/Users/lucawu/Library/CloudStorage/Dropbox/Github/sgai
PYTHON=/tmp/sgai-venv/bin/python
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin

# 周一 08:00 — hansard / videos / voices（旧三条）
0 8 * * 1         cd $PROJECT && $PYTHON scripts/auto_update.py --schedule=weekly      >> scripts/logs/cron.log 2>&1
# 每月 1 号 08:00 — github-stars / policies / ecosystem
0 8 1 * *         cd $PROJECT && $PYTHON scripts/auto_update.py --schedule=monthly     >> scripts/logs/cron.log 2>&1
# Q1/Q2/Q3/Q4 第一天 08:00 — levers / startups
0 8 1 1,4,7,10 *  cd $PROJECT && $PYTHON scripts/auto_update.py --schedule=quarterly   >> scripts/logs/cron.log 2>&1
# 1 月 / 7 月 1 号 08:00 — legal-ai / talent / tracker / benchmarking
0 8 1 1,7 *       cd $PROJECT && $PYTHON scripts/auto_update.py --schedule=half-yearly >> scripts/logs/cron.log 2>&1
```

`claude` CLI 沿用 macOS keychain 登录凭据，cron 自动继承，不需要在 crontab 里写 API key。

> macOS Ventura+：System Settings → Privacy & Security → Full Disk Access 把 `/usr/sbin/cron` 加进去，否则 cron 读不到 Dropbox 路径。

校验：

```bash
crontab -l                                    # 确认条目已保存
tail -f scripts/logs/cron.log                 # 等下次触发后看日志
```

---

## 7. 手动跑一次（验证全链路）

跑一条最便宜的 GitHub stars 刷新（无 OpenAI 调用）：

```bash
cd /Users/lucawu/Library/CloudStorage/Dropbox/Github/sgai
npx tsx scripts/refresh/github-stars.ts --dry-run
```

应看到每个 repo 的 stars 是否变化。如果没变化，`--no-commit` 不会做任何事；有变化时去掉 `--dry-run` 跑：

```bash
npx tsx scripts/refresh/github-stars.ts --bump-version
```

会自动：

1. 改 `src/data/community-opensource.ts` 和 `opensource.ts`
2. 切到分支 `data-refresh/github-stars/<date>`
3. commit + push + `gh pr create`
4. 输出 PR URL

去 GitHub 上 review + merge → Cloudflare 自动重新部署。

---

## 8. 跑一条带 AI 摘要的（policies）

需要 `claude` CLI 已登录（doctor 检查通过即可）。先 dry-run 看候选：

```bash
npx tsx scripts/refresh/policies/run.ts --dry-run --limit=2
```

确认候选 URL 看起来合理后，真实跑（也可以先 `--no-push` 只本地 commit 不开 PR）：

```bash
npx tsx scripts/refresh/policies/run.ts --limit=2 --no-push
git diff src/data/policies.ts | head -80      # 检查 AI 摘要质量
git checkout main && git branch -D data-refresh/policies/$(date +%Y-%m-%d)
                                              # 不满意就丢掉分支
```

满意后正式跑：

```bash
npx tsx scripts/refresh/policies/run.ts --limit=2
```

---

## 9. 故障排查

| 现象 | 原因 / 修法 |
|---|---|
| `ModuleNotFoundError: requests` | venv 没建或没装；回到 §1 |
| `gh: command not found` | `brew install gh` |
| `gh pr create failed: not authenticated` | `gh auth login` |
| `Claude CLI not available` | `which claude` 检查；缺则装 Claude Code 并 `claude` 登录一次 |
| `callLlm: timeout after 120000ms` | 慢网络。设 `SGAI_LLM_TIMEOUT_MS=240000` 翻倍 |
| `callLlm: claude exited 1` | `claude` 未登录或 token 失效。跑一次 `claude` 互动重新登录 |
| `git push failed` | 不在 GitHub origin / 没 push 权限 / 分支冲突 |
| 邮件没收到 | `auto_update_config.py` SMTP 配置错；先 `--dry-run` 看 subject 拼出来对不对 |
| ecosystem dry-run 0 候选 | 那个 RSS 当前没新帖（正常）。换个 `--only-domain=...` 试 |
| Mac 睡眠时 cron 漏跑 | 接受现状；下次唤醒后下个周期会跑 |
| AI 写错政策摘要 | 看 confidence 字段；`_pendingReview: true` 的不会渲染 |

---

## 10. 想加新管线？

看 [docs/refresh-playbook.md](../docs/refresh-playbook.md) 里"添加新管线的 6 步流程"。短答：复制 `scripts/refresh/policies/` 全套或写一个 `_shared/run-template.ts` 配置（30 行），在 `registry.json` 加一行就行。
