# sgai 数据自动更新 — 可选配置
# 复制为 auto_update_config.py（已在 .gitignore，不入仓库）
#
# 通知现在走 GitHub（PR @assignee + scan-only 管线开 Issue），
# 不再需要 SMTP / Gmail App Password。`gh auth login` 一次即可。
#
# 这个文件只放可选环境覆盖。无配置文件也能正常跑。

# ── 通知策略 ─────────────────────────────────────────────────────────────────
# True = 即使没有新 scan-only 内容（hansard/videos/voices）也开一条 Issue 报告。
# 默认 False — 只在有新内容或出错时通知。auto-PR 管线总是会开 PR，不受此影响。
NOTIFY_IF_NO_NEW = False

# ── 可选 LLM / API 覆盖 ──────────────────────────────────────────────────────
# 默认走本地 claude CLI haiku 模型，如需调整：
# import os
# os.environ.setdefault("SGAI_CLAUDE_MODEL", "haiku")     # haiku / sonnet / opus
# os.environ.setdefault("SGAI_TRANSLATION_CONCURRENCY", "2")
# os.environ.setdefault("GITHUB_TOKEN", "ghp_...")        # 可选，github-stars 提速
