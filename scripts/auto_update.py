#!/usr/bin/env python3
"""
sgai 数据自动更新 — 统一包装脚本（registry-driven）。

读取 scripts/refresh/registry.json，按 --schedule 过滤要跑的管线。
每条管线分两类：
  - python-builtin: hansard / videos（保留原 in-process scan-only 调用）
  - tsx: 新管线（voices / policies / ecosystem / github-stars / levers /
    legal-ai / talent / startups / tracker / benchmarking），通过
    `npx tsx <script>` 子进程执行；脚本在末尾 print 一行 JSON 报告，
    被本脚本捕获并汇入通知。

用法:
  python auto_update.py                              # 运行所有管线
  python auto_update.py --schedule=weekly            # 仅 schedule=weekly 的
  python auto_update.py --schedule=monthly
  python auto_update.py --only videos,policies       # 多个管线（逗号分隔）
  python auto_update.py --dry-run                    # 不发邮件、不写盘
  python auto_update.py --verbose                    # 详细输出

定期运行（推荐——一条 cron 心跳驱动所有 cadence）:
  python auto_update.py --due                        # 跑所有「已到期」的 schedule（按 state 里上次成功时间判断）
  python auto_update.py --status                     # 看每个 schedule 上次跑/是否到期/cron 是否装好
  python auto_update.py --install-cron               # 装一行 managed crontab（每天 08:00 跑 --due），幂等
  python auto_update.py --uninstall-cron             # 移除 managed crontab 块

为什么用 --due 而不是给每个 cadence 配一条精确 cron：纯 cron 在 Mac 睡眠时会
静默跳过那一分钟的触发（比如 1 号月度刷新——合盖了就永远不跑）。--due 把 cadence
逻辑搬进脚本，按「距上次成功是否超过间隔」判断，一条每日心跳就能自愈式驱动
weekly/monthly/quarterly/half-yearly，掉电/睡眠后下次开机补跑。
"""

import argparse
import json
import logging
import os
import re
import sys
import time
import traceback
from datetime import datetime, timedelta
from pathlib import Path

# ── 路径设置 ──────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent
DATA_DIR = SCRIPT_DIR / "data"
LOG_DIR = SCRIPT_DIR / "logs"
STATE_FILE = DATA_DIR / "last_scan_state.json"
REGISTRY_FILE = SCRIPT_DIR / "refresh" / "registry.json"
LOG_RETENTION_DAYS = 30
# Fallback gh credential for cron runs — see ensure_gh_token(). Lives outside
# the repo (never committed); create via `gh auth token > <file> && chmod 600`.
GH_TOKEN_FILE = Path.home() / ".config" / "sgai" / "gh-token"

# ── --due 调度间隔 ────────────────────────────────────────────────────────────
# Each schedule level maps to how often it should fire. --due reads the
# per-schedule last-success timestamp from state and runs any level whose
# elapsed time >= interval - GRACE. GRACE absorbs the gap between cron's
# 08:00 trigger and the previous run's slightly-different clock time so a
# weekly job that ran at 08:03 last Monday still fires at 08:00 this Monday.
SCHEDULE_INTERVALS = {
    "daily": timedelta(days=1),
    "weekly": timedelta(days=7),
    "monthly": timedelta(days=30),
    "quarterly": timedelta(days=91),
    "half-yearly": timedelta(days=182),
}
DUE_GRACE = timedelta(hours=12)

# ── managed crontab 标记 ──────────────────────────────────────────────────────
# install/uninstall edit only the lines between these two markers, so a
# re-install is idempotent and never clobbers the user's other cron entries.
CRON_BEGIN = "# >>> sgai auto_update (managed) >>>"
CRON_END = "# <<< sgai auto_update (managed) <<<"
DEFAULT_CRON_HOUR = 8


def load_registry() -> dict:
    """读取 scripts/refresh/registry.json。"""
    if not REGISTRY_FILE.exists():
        return {"pipelines": []}
    return json.loads(REGISTRY_FILE.read_text(encoding="utf-8"))

# 确保 scripts/ 在 sys.path 中，以便 import 子目录模块
sys.path.insert(0, str(SCRIPT_DIR))

# ── Hansard 配置 ──────────────────────────────────────────────────────────────
SPRS_API = "https://sprs.parl.gov.sg/search/getHansardTopic/"
# Per-prefix scan ranges. Tuned to actual SPRS publishing cadence:
#   oral-answer:    ~50/sitting; 80 covers ~1.5 sittings
#   written-answer: ~200/sitting; 300 covers ~1.5 sittings (was 50, missed 4× sittings)
#   budget:         only during Committee of Supply (Feb–Mar); 30 is generous
HANSARD_ORAL_RANGE = 80
HANSARD_WRITTEN_RANGE = 300
HANSARD_BUDGET_RANGE = 30
# Title-only keyword matching missed Q's whose title hides the AI angle
# (e.g. "Safeguards to Ensure Citizen Data Is Not Disclosed..." → about
# foreign-headquartered AI vendors). We now also scan the first
# CONTENT_SCAN_CHARS chars of the body. Bigger == catches more, but more
# false positives from substring "AI" inside other words (mitigated by
# word-boundary regex).
HANSARD_CONTENT_SCAN_CHARS = 3000

AI_TITLE_KEYWORDS = [
    r"\bartificial intelligence\b",
    r"\bAI\b",
    r"\bdeepfake",
    r"\bdata centre",
    r"\bmachine learning\b",
    r"\bGPT\b",
    r"\bgenerative\b",
    r"\bLLM\b",
    r"\bsmart nation\b",
    r"\bdigital economy\b",
    r"\bcompute\b",
    r"\brobotic",
    r"\bautonomous\b",
    r"\bcybersecurity\b",
    r"\bdata protect",
    # Added: foreign-vendor / data-sovereignty signals — title may not
    # contain "AI" but body cites AI platforms / extraterritorial reach.
    r"\bcritical information infrastructure\b",
    r"\bdata sovereignty\b",
    r"\bdata residency\b",
    r"\bCLOUD Act\b",
    r"\bagentic\b",
]

# ── 日志 ──────────────────────────────────────────────────────────────────────
def setup_logging(verbose: bool = False):
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log_file = LOG_DIR / f"auto_update_{datetime.now().strftime('%Y-%m-%d')}.log"
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[
            logging.FileHandler(log_file, encoding="utf-8"),
            logging.StreamHandler(),
        ],
    )
    return logging.getLogger("auto_update")


# ── 状态管理 ──────────────────────────────────────────────────────────────────
def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    # 默认初始状态（基于 debates.ts 中的最高 ID）
    return {
        "last_run": None,
        # Per-schedule last-success timestamp, consumed by --due. Empty on a
        # fresh state means "everything is due" → first --due run does a full sweep.
        "schedule_runs": {},
        "domains": {
            "videos": {"video_ids": []},
            "voices": {"urls": []},
            "hansard": {"max_oral_id": 4117, "max_written_id": 22056, "max_budget_id": 2937},
        },
    }


def save_state(state: dict):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    state["last_run"] = datetime.now().isoformat()
    STATE_FILE.write_text(
        json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8"
    )


# ── 管线 1: YouTube 视频 ─────────────────────────────────────────────────────
def run_videos(logger) -> dict:
    import importlib

    mod = importlib.import_module("videos.01_scan_channels")
    candidates = mod.scan_channels(exclude_existing=True, days=14)
    logger.info(f"YouTube 扫描完成: {len(candidates)} 条候选")
    return {
        "count": len(candidates),
        "items": [
            {"date": v["date"], "title": v["title"], "channel": v["channel"]}
            for v in candidates[:10]
        ],
    }


# ── 管线 2: MDDI 演讲 ────────────────────────────────────────────────────────
# Removed: voices is now type=tsx + mode=auto-pr (scripts/refresh/voices/run.ts).
# The tsx pipeline handles scan + fetch + translate + emit + commit + PR end-to-end
# and is dispatched by run_tsx_pipeline() below.


# ── 管线 3: 国会辩论 (轻量 API 扫描) ─────────────────────────────────────────
def matches_ai_keywords(title: str, content: str = "") -> bool:
    """Match against title plus first HANSARD_CONTENT_SCAN_CHARS of content."""
    blob = title + " " + (content[:HANSARD_CONTENT_SCAN_CHARS] if content else "")
    return any(re.search(p, blob, re.IGNORECASE) for p in AI_TITLE_KEYWORDS)


def _strip_html(html: str) -> str:
    """Cheap HTML→text for keyword matching only (no parser dependency)."""
    text = re.sub(r"<[^>]+>", " ", html)
    text = text.replace("&nbsp;", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def scan_hansard_range(prefix: str, start: int, end: int, logger) -> list[dict]:
    """扫描 SPRS API 指定 ID 范围，返回有效条目（title + content 双扫）"""
    import requests

    results = []
    for i in range(start + 1, end + 1):
        rid = f"{prefix}-{i}"
        try:
            resp = requests.post(
                SPRS_API,
                params={"id": rid},
                headers={"Content-Type": "application/json"},
                json={},
                timeout=10,
            )
            if resp.status_code != 200:
                continue
            rh = resp.json().get("resultHTML")
            if not rh or not rh.get("title"):
                continue
            title = rh["title"]
            content_text = _strip_html(rh.get("content", ""))
            date_raw = rh.get("sittingDate", "")
            results.append(
                {
                    "id": rid,
                    "title": title,
                    "date": date_raw,
                    "ai_related": matches_ai_keywords(title, content_text),
                }
            )
            logger.debug(f"  {rid}: {title[:60]}")
            time.sleep(0.3)
        except Exception as e:
            logger.debug(f"  {rid}: error — {e}")
    return results


def run_hansard(state: dict, logger) -> dict:
    hansard_state = state.setdefault("domains", {}).setdefault(
        "hansard",
        {"max_oral_id": 4117, "max_written_id": 22056, "max_budget_id": 2937},
    )
    max_oral = hansard_state["max_oral_id"]
    max_written = hansard_state["max_written_id"]
    max_budget = hansard_state.get("max_budget_id", 2937)  # default seeded from prior emit

    logger.info(f"Hansard 扫描: oral-answer-{max_oral + 1}..{max_oral + HANSARD_ORAL_RANGE}")
    oral_results = scan_hansard_range("oral-answer", max_oral, max_oral + HANSARD_ORAL_RANGE, logger)

    logger.info(f"Hansard 扫描: written-answer-{max_written + 1}..{max_written + HANSARD_WRITTEN_RANGE}")
    written_results = scan_hansard_range(
        "written-answer", max_written, max_written + HANSARD_WRITTEN_RANGE, logger
    )

    logger.info(f"Hansard 扫描: budget-{max_budget + 1}..{max_budget + HANSARD_BUDGET_RANGE}")
    budget_results = scan_hansard_range("budget", max_budget, max_budget + HANSARD_BUDGET_RANGE, logger)

    all_results = oral_results + written_results + budget_results
    ai_results = [r for r in all_results if r["ai_related"]]

    # 更新最高 ID
    def _update_max(results, current):
        m = current
        for r in results:
            try:
                m = max(m, int(r["id"].split("-")[-1]))
            except ValueError:
                pass  # cos-{ministry}-{year} ids — skip numeric bump
        return m

    new_max_oral = _update_max(oral_results, max_oral)
    new_max_written = _update_max(written_results, max_written)
    new_max_budget = _update_max(budget_results, max_budget)

    logger.info(f"Hansard 扫描完成: {len(all_results)} 条新记录, {len(ai_results)} 条 AI 相关")

    return {
        "count": len(ai_results),
        "total_scanned": len(all_results),
        "scan_range": (
            f"oral {max_oral + 1}..{max_oral + HANSARD_ORAL_RANGE}, "
            f"written {max_written + 1}..{max_written + HANSARD_WRITTEN_RANGE}, "
            f"budget {max_budget + 1}..{max_budget + HANSARD_BUDGET_RANGE}"
        ),
        "items": [
            {"id": r["id"], "title": r["title"], "date": r["date"]}
            for r in ai_results[:10]
        ],
        "new_max_oral": new_max_oral,
        "new_max_written": new_max_written,
        "new_max_budget": new_max_budget,
    }


# ── 邮件 ──────────────────────────────────────────────────────────────────────
def compose_email(results: dict, errors: list[str], elapsed: float) -> tuple[str, str]:
    """生成邮件标题和 HTML 正文"""
    date_str = datetime.now().strftime("%Y-%m-%d")

    # Subject: include any opened PRs first (the actionable bit), then counts.
    pr_results = [(pid, r) for pid, r in results.items() if r.get("pr_url")]
    counts = []
    for pid, r in results.items():
        c = r.get("count", 0) or 0
        if c > 0:
            counts.append(f"{pid} +{c}")
    summary = ", ".join(counts) if counts else "no new data"
    if pr_results:
        subject = f"[sgai] data-refresh {date_str}: {summary} — review {len(pr_results)} PR(s)"
    else:
        subject = f"[sgai] data-refresh {date_str}: {summary}"

    lines = [f"<h2>sgai data-refresh — {date_str}</h2>"]

    # PR-aware section first (actionable).
    if pr_results:
        lines.append("<h3>📬 PRs awaiting review</h3><ul>")
        for pid, r in pr_results:
            url = r.get("pr_url")
            branch = r.get("branch", "?")
            lines.append(
                f"  <li><strong>{pid}</strong> +{r.get('count', 0)} · branch <code>{branch}</code> · "
                f"<a href='{url}'>{url}</a></li>"
            )
        lines.append("</ul>")

    # Per-pipeline blocks.
    if "videos" in results:
        r = results["videos"]
        lines.append(f"<h3>YouTube 视频: {r.get('count', 0)} 条新候选</h3>")
        if r.get("items"):
            lines.append("<ul>")
            for v in r["items"]:
                lines.append(f"  <li>[{v.get('date','?')}] {v.get('channel','?')}: {v.get('title','?')}</li>")
            lines.append("</ul>")
            lines.append("<p>人工审核: <code>cd scripts && python videos/02_review_and_merge.py</code></p>")
        elif not r.get("error"):
            lines.append("<p>无新内容</p>")

    # voices is now a tsx auto-pr pipeline (scripts/refresh/voices/run.ts) —
    # its result is rendered by the generic tsx block at the bottom, not here.

    if "hansard" in results:
        r = results["hansard"]
        total = r.get("total_scanned", 0)
        lines.append(f"<h3>国会辩论: {r.get('count', 0)} 条 AI 相关 (共扫描 {total} 条)</h3>")
        if r.get("items"):
            lines.append("<ul>")
            for d in r["items"]:
                lines.append(f"  <li>[{d.get('date','?')}] {d.get('id','?')}: {d.get('title','?')}</li>")
            lines.append("</ul>")
        elif not r.get("error"):
            lines.append(f"<p>无新内容 (扫描范围: {r.get('scan_range','N/A')})</p>")

    # New tsx pipelines block (no items detail; PR link is the action).
    for pid, r in results.items():
        if pid in ("videos", "hansard"):
            continue
        c = r.get("count", 0) or 0
        f = r.get("failures", 0) or 0
        err = r.get("error")
        if err:
            lines.append(f"<h3>[{pid}] ⚠ failed</h3><p style='color:red'>{err}</p>")
        elif r.get("pr_url"):
            lines.append(f"<h3>[{pid}] {c} new entries · PR opened · {f} failures</h3>")
        else:
            lines.append(f"<h3>[{pid}] {c} new entries · {f} failures</h3>")

    if errors:
        lines.append("<h3>错误</h3><ul>")
        for e in errors:
            lines.append(f"  <li style='color:red'>{e}</li>")
        lines.append("</ul>")

    lines.append(f"<hr><p>运行耗时: {elapsed:.0f}s | 错误: {len(errors)} 个</p>")
    return subject, "\n".join(lines)


def ensure_gh_token(logger) -> None:
    """Inject GH_TOKEN from GH_TOKEN_FILE when the environment doesn't have one.

    `gh auth login` stores its token in the macOS keychain, which is
    unavailable to cron during locked-screen / no-login-session windows —
    every `gh` call then fails with 401 and notifications are silently lost
    (audit 2026-07-07 #16: the 07-07 videos scan found 3 candidates but the
    issue never opened). Reading the token from a chmod-600 file removes the
    keychain dependency entirely.

    Setting os.environ here covers every child process: `gh issue create`
    (this script), `gh pr create` (scripts/lib/auto-commit.ts via tsx
    pipelines), and `git push` (credential helper is `gh auth git-credential`,
    which also honours GH_TOKEN).

    Create the file with:  gh auth token > ~/.config/sgai/gh-token
                           chmod 600 ~/.config/sgai/gh-token
    (or put a fine-grained PAT with repo+issues permissions in it — see
    scripts/SETUP.md §3.)
    """
    if os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN"):
        return
    try:
        token = GH_TOKEN_FILE.read_text(encoding="utf-8").strip()
    except OSError:
        logger.warning(
            f"⚠ GH_TOKEN 未设置且 {GH_TOKEN_FILE} 不存在——锁屏/无登录会话时段 "
            f"gh 会 401，通知会静默丢失。修复: gh auth token > {GH_TOKEN_FILE} "
            f"&& chmod 600 {GH_TOKEN_FILE}（详见 scripts/SETUP.md §3）"
        )
        return
    if not token:
        logger.warning(f"⚠ {GH_TOKEN_FILE} 为空，跳过 GH_TOKEN 注入。")
        return
    os.environ["GH_TOKEN"] = token
    logger.info(f"GH_TOKEN 已从 {GH_TOKEN_FILE} 注入（gh/git 不再依赖 keychain）")


def notify_via_github_issue(title: str, body: str, logger, labels: list[str] | None = None) -> bool:
    """通过 `gh issue create` 开 GitHub Issue 通知（assigned to @me）。

    取代旧的 SMTP 邮件路径——cron-running user 的 GitHub 通知（邮件 / web）会自动收到。
    `gh` CLI 需已认证：环境有 GH_TOKEN（cron 路径，见 ensure_gh_token），
    或 `gh auth login` keychain 凭据（交互式路径）。
    """
    import subprocess

    args = ["gh", "issue", "create", "--title", title, "--body", body, "--assignee", "@me"]
    for label in labels or []:
        args.extend(["--label", label])

    try:
        result = subprocess.run(
            args, cwd=PROJECT_ROOT, capture_output=True, text=True, encoding="utf-8"
        )
    except FileNotFoundError:
        logger.error("`gh` CLI 未安装；无法发通知。`brew install gh && gh auth login`")
        return False

    if result.returncode != 0:
        logger.error(f"gh issue create 失败: {result.stderr.strip()[:300]}")
        return False
    url = result.stdout.strip().splitlines()[-1] if result.stdout.strip() else ""
    if url:
        logger.info(f"已开 GitHub issue: {url}")
    return True


def html_to_markdown(html: str) -> str:
    """非常 lightweight 的 HTML → Markdown 转换，仅覆盖 compose_email 用到的标签。"""
    import re as _re

    s = html
    s = _re.sub(r"<h2>(.*?)</h2>", r"## \1\n", s)
    s = _re.sub(r"<h3>(.*?)</h3>", r"### \1\n", s)
    s = _re.sub(r"<p[^>]*>(.*?)</p>", r"\1\n", s)
    s = _re.sub(r"<ul>", "", s)
    s = _re.sub(r"</ul>", "\n", s)
    s = _re.sub(r"<li>(.*?)</li>", r"- \1", s)
    s = _re.sub(r"<a href=['\"]([^'\"]+)['\"]>([^<]+)</a>", r"[\2](\1)", s)
    s = _re.sub(r"<strong>(.*?)</strong>", r"**\1**", s)
    s = _re.sub(r"<code>(.*?)</code>", r"`\1`", s)
    s = _re.sub(r"<hr>", "---", s)
    s = _re.sub(r"<[^>]+>", "", s)
    s = _re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


# ── 日志清理 ──────────────────────────────────────────────────────────────────
def cleanup_old_logs(logger):
    cutoff = datetime.now() - timedelta(days=LOG_RETENTION_DAYS)
    count = 0
    for f in LOG_DIR.glob("auto_update_*.log"):
        try:
            date_str = f.stem.replace("auto_update_", "")
            file_date = datetime.strptime(date_str, "%Y-%m-%d")
            if file_date < cutoff:
                f.unlink()
                count += 1
        except (ValueError, OSError):
            pass
    if count:
        logger.info(f"清理了 {count} 个过期日志文件")


# ── 主流程 ────────────────────────────────────────────────────────────────────
def run_tsx_pipeline(pipeline: dict, logger, dry_run: bool = False) -> dict:
    """运行一条 type=tsx 管线（subprocess npx tsx <script>）。

    新管线在 stdout 末尾 print 一行 JSON 报告（{domain, added/changed, pr_url, ...}）。
    本函数捕获最后一个有效 JSON 行，转成 results 字典。其他 stdout 直接转发到日志。
    """
    import subprocess

    script = pipeline.get("script")
    extra_args = pipeline.get("args", []) or []
    if not script:
        return {"count": 0, "items": [], "error": "registry entry missing script"}

    cmd = ["npx", "tsx", script, *extra_args]
    # Propagate --dry-run into the tsx subprocess. Without this, a top-level
    # --dry-run only suppressed this script's own email/issue (see main below)
    # while the tsx pipeline still ran scan→emit→commit→push→PR — which opened
    # an accidental PR on 2026-06-28. Every tsx run.ts honours --dry-run
    # (CLAUDE.md "添加新管线" requires --dry-run / --limit / --no-commit / --no-push).
    if dry_run and "--dry-run" not in cmd:
        cmd.append("--dry-run")
    logger.info(f"  [{pipeline['id']}] $ {' '.join(cmd)}")
    proc = subprocess.run(
        cmd,
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if proc.stdout:
        for line in proc.stdout.splitlines():
            logger.info(f"    | {line}")
    if proc.stderr:
        for line in proc.stderr.splitlines():
            logger.debug(f"    | err: {line}")
    if proc.returncode != 0:
        # npm warn 噪音会挤掉 300 字符预算里的真实错误（2026-07-12 issue #134
        # 的 evals 错误全被 "npm warn Unknown project config" 淹没）——先滤掉。
        stderr_signal = "\n".join(
            line for line in proc.stderr.splitlines() if line.strip() and not line.startswith("npm warn")
        )
        if not stderr_signal:
            # evals 这类管线把失败细节打在 stdout（[FAIL] 行）而非 stderr——
            # 滤完 npm warn 后 stderr 为空时（2026-07-13 issue #138 显示
            # "exit 1: " 空错误），回落到 stdout 的信号行。
            stdout_lines = [line for line in proc.stdout.splitlines() if line.strip()]
            fail_lines = [line for line in stdout_lines if "FAIL" in line or "Error" in line or "error" in line]
            stderr_signal = "\n".join((fail_lines or stdout_lines)[-5:])
        return {"count": 0, "items": [], "error": f"exit {proc.returncode}: {stderr_signal[:300]}"}

    # Find last JSON line in stdout
    last_json = None
    for line in proc.stdout.splitlines():
        s = line.strip()
        if s.startswith("{") and s.endswith("}"):
            try:
                last_json = json.loads(s)
            except json.JSONDecodeError:
                continue
    if not last_json:
        # 干净退出 (exit 0) 但没打 JSON report = 零结果早退（候选全被质量闸门
        # 丢弃等）。这不是失败——真崩溃会以非零 exit code 走上面的分支。
        # 2026-07-06/07-12 两轮跑批把 5 条健康管线误报成 "⚠ failed"，与真失败
        # 无法区分，此处放行。（run-template.ts 现在所有路径都打 JSON，
        # 自有 run.ts 的旧管线零结果路径仍可能不打——同样适用本契约。）
        return {"count": 0, "items": [], "note": "zero-result exit (no JSON report)"}

    count = last_json.get("added", last_json.get("changed", 0)) or 0
    items = []
    if last_json.get("pr_url"):
        items.append({
            "title": f"PR opened",
            "url": last_json.get("pr_url"),
            "branch": last_json.get("branch"),
        })
    return {
        "count": count,
        "items": items,
        "pr_url": last_json.get("pr_url"),
        "branch": last_json.get("branch"),
        "failures": last_json.get("failures", 0),
    }


# ── --due 调度判定 ────────────────────────────────────────────────────────────
def registry_schedules(registry: dict) -> set[str]:
    """Schedules that at least one registry pipeline actually uses."""
    return {e.get("schedule") for e in registry.get("pipelines", []) if e.get("schedule")}


def compute_due_schedules(registry: dict, state: dict, now: datetime | None = None) -> set[str]:
    """Schedules whose elapsed-since-last-success >= interval - grace.

    A schedule that has never run (no entry in state.schedule_runs) is always due.
    """
    now = now or datetime.now()
    runs = state.get("schedule_runs", {})
    due = set()
    for sched in registry_schedules(registry):
        interval = SCHEDULE_INTERVALS.get(sched)
        if interval is None:
            continue  # unknown schedule label — leave it to explicit --schedule
        last = runs.get(sched)
        if not last:
            due.add(sched)
            continue
        try:
            last_dt = datetime.fromisoformat(last)
        except ValueError:
            due.add(sched)
            continue
        if now - last_dt >= interval - DUE_GRACE:
            due.add(sched)
    return due


def record_schedule_runs(state: dict, schedules: set[str]):
    """Stamp the given schedule levels as having just succeeded (for --due math)."""
    if not schedules:
        return
    runs = state.setdefault("schedule_runs", {})
    stamp = datetime.now().isoformat()
    for s in schedules:
        runs[s] = stamp


# ── checkout 卫生 ─────────────────────────────────────────────────────────────
def _git_current_branch() -> str:
    """当前 checkout 的分支名（detached/失败返回 ''）。"""
    import subprocess

    r = subprocess.run(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
    )
    return r.stdout.strip() if r.returncode == 0 else ""


def _restore_checkout(branch: str, logger):
    """把 checkout 恢复到 `branch`（管线跑完停在自己的 data-refresh 分支上）。

    不恢复的话：(1) 串行跑批时下一条管线从上一条的分支切分支——PR 互相夹带
    （2026-07-12 全量跑实测，5 个 PR 堆叠）；(2) 整轮跑完 checkout 留在最后
    一个管线分支，第二天 cron 从错误分支跑（audit 2026-07-07 #16 同款）。
    恢复失败只 warning 不抛——脏工作树等场景下宁可留现场也别毁掉数据。
    """
    import subprocess

    current = _git_current_branch()
    if not branch or not current or current == branch:
        return
    r = subprocess.run(
        ["git", "checkout", branch],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
    )
    if r.returncode == 0:
        logger.info(f"  checkout 已从 {current} 恢复到 {branch}")
    else:
        logger.warning(f"⚠ checkout 无法从 {current} 恢复到 {branch}: {r.stderr.strip()[:200]}")


# ── 管线选择 + 运行（normal / --schedule / --due 共用）─────────────────────────
def select_pipelines(registry: dict, schedules: set[str] | None, only_set: set[str] | None) -> list[dict]:
    """Filter registry entries by schedule set (None = all) and an optional id allowlist."""
    selected = []
    for entry in registry.get("pipelines", []):
        if only_set is not None and entry["id"] not in only_set:
            continue
        if schedules is not None and entry.get("schedule") not in schedules:
            continue
        selected.append(entry)
    return selected


def run_pipelines(selected: list[dict], state: dict, logger, dry_run: bool) -> tuple[dict, list[str]]:
    """Run the selected pipelines, returning (results, errors)."""
    results: dict = {}
    errors: list[str] = []
    start_branch = _git_current_branch()
    if start_branch and start_branch != "main":
        logger.warning(f"⚠ checkout 起点是 {start_branch}（不是 main）——管线读到的数据可能不是线上真相")
    for entry in selected:
        pid = entry["id"]
        ptype = entry.get("type")
        try:
            if ptype == "python-builtin":
                if pid == "videos":
                    results["videos"] = run_videos(logger)
                elif pid == "hansard":
                    hansard_result = run_hansard(state, logger)
                    results["hansard"] = hansard_result
                    state["domains"]["hansard"]["max_oral_id"] = hansard_result["new_max_oral"]
                    state["domains"]["hansard"]["max_written_id"] = hansard_result["new_max_written"]
                    state["domains"]["hansard"]["max_budget_id"] = hansard_result["new_max_budget"]
                else:
                    raise RuntimeError(f"unknown python-builtin pipeline id: {pid}")
            elif ptype == "tsx":
                results[pid] = run_tsx_pipeline(entry, logger, dry_run=dry_run)
            else:
                raise RuntimeError(f"unknown pipeline type: {ptype}")
        except Exception as e:
            logger.error(f"管线 [{pid}] 失败: {e}")
            logger.debug(traceback.format_exc())
            errors.append(f"{pid}: {e}")
            results[pid] = {"count": 0, "items": [], "error": str(e)}
        # run_tsx_pipeline reports a non-zero child exit inside its result dict
        # instead of raising, so it never reached `errors` — a failing
        # issue-on-fail pipeline (e.g. evals-monthly on 2026-07-01) was logged
        # as "无错误" and the GitHub issue was silently skipped. Surface it.
        result_error = results.get(pid, {}).get("error") if isinstance(results.get(pid), dict) else None
        if result_error and f"{pid}: {result_error}" not in errors:
            errors.append(f"{pid}: {result_error}")
        # 管线的 autoCommit 停在自己的 data-refresh 分支上——立刻恢复，
        # 让下一条管线（和明天的 cron）从跑批起点分支开始。
        _restore_checkout(start_branch, logger)
    return results, errors


# ── managed crontab 自管理 ────────────────────────────────────────────────────
def _read_crontab() -> str:
    """Current user crontab text ('' if none / not yet created)."""
    import subprocess

    r = subprocess.run(["crontab", "-l"], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else ""


def _write_crontab(content: str):
    import subprocess

    body = content.rstrip("\n") + "\n" if content.strip() else ""
    r = subprocess.run(["crontab", "-"], input=body, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"crontab write failed: {r.stderr.strip()}")


def _strip_managed_block(content: str) -> str:
    """Drop everything between CRON_BEGIN/CRON_END (inclusive), keep the rest."""
    out, skip = [], False
    for ln in content.splitlines():
        if ln.strip() == CRON_BEGIN:
            skip = True
            continue
        if ln.strip() == CRON_END:
            skip = False
            continue
        if not skip:
            out.append(ln)
    return "\n".join(out).strip("\n")


def build_managed_block(hour: int = DEFAULT_CRON_HOUR) -> str:
    """One daily heartbeat that calls --due. PATH is baked in so npx/gh/node
    resolve under cron's minimal environment."""
    py = sys.executable
    path = os.environ.get("PATH", "/usr/local/bin:/usr/bin:/bin")
    return "\n".join(
        [
            CRON_BEGIN,
            f"PATH={path}",
            "# Daily heartbeat — --due runs whichever schedule level is overdue.",
            "# Self-heals after sleep/downtime; do not add per-cadence cron lines.",
            f"{0} {hour} * * *  cd {PROJECT_ROOT} && {py} scripts/auto_update.py --due "
            f">> {LOG_DIR / 'cron.log'} 2>&1",
            CRON_END,
        ]
    )


def _probe_builtin_deps() -> list[str]:
    """Which deps the hansard/videos builtin scans need but the current
    interpreter (= the one cron will use) can't import."""
    import importlib.util

    missing = []
    for mod in ("requests", "feedparser", "bs4"):
        if importlib.util.find_spec(mod) is None:
            missing.append(mod)
    return missing


def cmd_install_cron(logger, hour: int = DEFAULT_CRON_HOUR):
    base = _strip_managed_block(_read_crontab())
    block = build_managed_block(hour)
    new = f"{base}\n\n{block}" if base.strip() else block
    _write_crontab(new)
    logger.info(f"✅ 已安装 managed crontab 块（每天 {hour:02d}:00 跑 --due），用解释器: {sys.executable}")
    for line in block.splitlines():
        logger.info(f"    {line}")
    logger.info(
        "⚠ macOS: 项目在 Dropbox/CloudStorage 下时，需到「系统设置 → 隐私与安全性 → "
        "完全磁盘访问」给 /usr/sbin/cron 授权，否则 cron 读不到项目文件。"
    )
    missing = _probe_builtin_deps()
    if missing:
        logger.warning(
            f"⚠ 当前解释器缺 {', '.join(missing)}——cron 跑 hansard/videos 时会失败。"
            f"\n    请改用带依赖的 venv 重装：<venv>/bin/python scripts/auto_update.py --install-cron"
            f"\n    （建议 venv 放 ~/.venvs/sgai/ 而非 /tmp——/tmp 重启会清空）"
        )


def cmd_uninstall_cron(logger):
    existing = _read_crontab()
    if CRON_BEGIN not in existing:
        logger.info("没有 managed crontab 块，无需卸载。")
        return
    _write_crontab(_strip_managed_block(existing))
    logger.info("🧹 已移除 managed crontab 块。")


def cmd_status(registry: dict, state: dict, logger):
    now = datetime.now()
    runs = state.get("schedule_runs", {})
    due = compute_due_schedules(registry, state, now)
    print(f"last full run : {state.get('last_run') or '(never)'}")
    print(f"{'schedule':<14}{'last success':<22}{'interval':<10}{'due now?'}")
    print("-" * 54)
    for sched in sorted(registry_schedules(registry)):
        last = runs.get(sched) or "(never)"
        if last != "(never)":
            last = last[:19].replace("T", " ")
        iv = SCHEDULE_INTERVALS.get(sched)
        iv_s = f"{iv.days}d" if iv else "?"
        print(f"{sched:<14}{last:<22}{iv_s:<10}{'YES' if sched in due else 'no'}")
    print("-" * 54)
    installed = CRON_BEGIN in _read_crontab()
    print(f"managed crontab: {'installed' if installed else 'NOT installed (run --install-cron)'}")
    token_ok = bool(os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")) or (
        GH_TOKEN_FILE.exists() and GH_TOKEN_FILE.read_text(encoding="utf-8").strip() != ""
    )
    print(
        f"gh token (cron): {'OK' if token_ok else f'MISSING — gh auth token > {GH_TOKEN_FILE} && chmod 600 {GH_TOKEN_FILE}'}"
    )
    if due:
        print(f"\n→ `--due` would now run: {', '.join(sorted(due))}")
    else:
        print("\n→ nothing due right now.")


def main():
    parser = argparse.ArgumentParser(description="sgai 数据自动更新 (registry-driven)")
    parser.add_argument("--dry-run", action="store_true", help="不发邮件、不写盘、不开 PR（透传 --dry-run 给 tsx 子管线）")
    parser.add_argument("--only", help="只运行指定管线（逗号分隔；如 videos,policies）")
    parser.add_argument(
        "--schedule",
        choices=["daily", "weekly", "monthly", "quarterly", "half-yearly", "all"],
        default="all",
        help="仅运行匹配此 schedule 的管线",
    )
    parser.add_argument("--verbose", action="store_true", help="详细输出")
    parser.add_argument(
        "--due",
        action="store_true",
        help="跑所有「已到期」的 schedule（按 state 里上次成功时间判断）——cron 心跳用这个",
    )
    parser.add_argument("--status", action="store_true", help="打印每个 schedule 的到期状态 + cron 安装情况后退出")
    parser.add_argument("--install-cron", action="store_true", help="安装 managed crontab（每天 08:00 跑 --due），幂等")
    parser.add_argument("--uninstall-cron", action="store_true", help="移除 managed crontab 块")
    parser.add_argument(
        "--cron-hour", type=int, default=DEFAULT_CRON_HOUR, help=f"--install-cron 的触发小时（默认 {DEFAULT_CRON_HOUR}）"
    )
    args = parser.parse_args()

    # 切换工作目录到脚本所在位置
    os.chdir(SCRIPT_DIR)

    logger = setup_logging(args.verbose)

    # cron 无 keychain 会话时 gh 会 401——启动即注入 GH_TOKEN，覆盖本进程和
    # 全部子进程（gh issue create / gh pr create / git push）。
    ensure_gh_token(logger)

    # ── 管理类子命令（不跑管线，处理完即退出）──
    registry = load_registry()
    if args.status:
        cmd_status(registry, load_state(), logger)
        return
    if args.install_cron:
        cmd_install_cron(logger, hour=args.cron_hour)
        return
    if args.uninstall_cron:
        cmd_uninstall_cron(logger)
        return

    logger.info("=" * 50)
    logger.info("AISG 数据自动更新开始")
    logger.info("=" * 50)

    state = load_state()
    start_time = time.time()

    only_set = None
    if args.only:
        only_set = {s.strip() for s in args.only.split(",") if s.strip()}

    # ── 决定本次驱动哪些 schedule ──
    #   --due       → state 里到期的那些（cron 心跳路径）
    #   --schedule  → 指定那一个
    #   都没给       → 全部（None = 不按 schedule 过滤）
    if args.due:
        driven = compute_due_schedules(registry, state)
        if not driven:
            logger.info("✅ 没有到期的 schedule，本次 --due 无事可做。")
            return
        logger.info(f"--due 到期 schedule: {sorted(driven)}")
        schedules: set[str] | None = driven
    elif args.schedule != "all":
        schedules = {args.schedule}
    else:
        schedules = None

    selected = select_pipelines(registry, schedules, only_set)
    logger.info(f"已选 {len(selected)} 条管线: {[e['id'] for e in selected]}")

    # ── 运行各管线 ──
    results, errors = run_pipelines(selected, state, logger, dry_run=args.dry_run)

    elapsed = time.time() - start_time

    # ── 判断是否有新内容 ──
    total_new = sum(r.get("count", 0) for r in results.values())
    logger.info(f"扫描完成: 共 {total_new} 条新内容, 耗时 {elapsed:.0f}s")

    # ── 通知（GitHub Issue 取代 SMTP）──
    # 新管线（type=tsx, mode=auto-pr）已经各自开了 PR + assign @me，不需重复通知。
    # 这里只为 scan-only 旧管线（hansard / videos）和失败开 issue。
    # auto_update_config.py is optional + gitignored. Accept either NOTIFY_IF_NO_NEW
    # (current name) or the legacy SEND_IF_NO_NEW so an old local config still works.
    try:
        import auto_update_config as _cfg

        NOTIFY_IF_NO_NEW = getattr(_cfg, "NOTIFY_IF_NO_NEW", getattr(_cfg, "SEND_IF_NO_NEW", False))
    except ImportError:
        NOTIFY_IF_NO_NEW = False

    scan_only_pids = {"hansard", "videos"}
    scan_only_results = {pid: r for pid, r in results.items() if pid in scan_only_pids}
    scan_only_total = sum(r.get("count", 0) or 0 for r in scan_only_results.values())
    should_notify = scan_only_total > 0 or NOTIFY_IF_NO_NEW or errors

    if args.dry_run:
        subject, body = compose_email(results, errors, elapsed)
        logger.info(f"[DRY RUN] Issue 标题: {subject}")
        logger.info("[DRY RUN] 跳过开 Issue")
    elif should_notify:
        subject, body = compose_email(results, errors, elapsed)
        labels = ["data-refresh", "scan-result"] if not errors else ["data-refresh", "failure"]
        notify_via_github_issue(subject, html_to_markdown(body), logger, labels=labels)
    else:
        logger.info("无新 scan-only 内容、无错误，跳过 GitHub Issue（auto-PR 管线已各自 assign @me）")

    # ── 记录 schedule 成功时间（供 --due 判定）──
    # 只在「按 schedule 驱动」或「全量跑」时记账；--only 是临时手动跑，不污染 cadence。
    if not args.dry_run and not only_set:
        recorded = schedules if schedules is not None else registry_schedules(registry)
        record_schedule_runs(state, recorded)

    # ── 保存状态 ──
    save_state(state)

    # ── 清理日志 ──
    cleanup_old_logs(logger)

    logger.info("自动更新完成")


if __name__ == "__main__":
    main()
