#!/usr/bin/env python3
"""
sgai 数据自动更新 — 统一包装脚本（registry-driven）。

读取 scripts/refresh/registry.json，按 --schedule 过滤要跑的管线。
每条管线分两类：
  - python-builtin: hansard / videos / voices（旧三条，保留原 in-process 调用）
  - tsx: 新管线（policies / ecosystem / github-stars / levers / legal-ai），
    通过 `npx tsx <script>` 子进程执行；脚本在末尾 print 一行 JSON 报告，
    被本脚本捕获并汇入邮件。

用法:
  python auto_update.py                              # 运行所有管线
  python auto_update.py --schedule=weekly            # 仅 schedule=weekly 的
  python auto_update.py --schedule=monthly
  python auto_update.py --only videos,policies       # 多个管线（逗号分隔）
  python auto_update.py --dry-run                    # 不发邮件、不写盘
  python auto_update.py --verbose                    # 详细输出
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

# Keyword classification has moved to scripts/hansard/classify.py — a graded
# 3-tier model (STRONG / INFRA / WEAK) that cuts false-positives from generic
# trade / telecom / privacy debates and catches AI mentions hidden in the body
# of debates whose title gives no hint. Imported lazily inside scan helpers
# below; tests live alongside in scripts/hansard/test_classify.py.
sys.path.insert(0, str(SCRIPT_DIR / "hansard"))

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
        "videos": {"video_ids": []},
        "voices": {"urls": []},
        "hansard": {"max_oral_id": 4117, "max_written_id": 22056, "max_budget_id": 2937},
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
def run_voices(logger) -> dict:
    import importlib

    mod = importlib.import_module("voices.01_scan_mddi")
    speeches = mod.scan_mddi(exclude_existing=True)
    logger.info(f"MDDI 扫描完成: {len(speeches)} 条演讲")
    return {
        "count": len(speeches),
        "items": [
            {"date": s["date"], "title": s["title"], "speaker": s["speaker"]}
            for s in speeches[:10]
        ],
    }


# ── 管线 3: 国会辩论 (轻量 API 扫描) ─────────────────────────────────────────
def matches_ai_keywords(title: str, content: str = "") -> bool:  # noqa: ARG001
    """Backwards-compat shim — superseded by classify().

    Kept so any external caller importing this name keeps working. New
    scan code should call classify() directly to get bucket + signal labels.
    """
    from classify import matches_ai_keywords as _impl

    return _impl(title, content)


def _strip_html(html: str) -> str:
    """Cheap HTML→text for keyword matching only (no parser dependency)."""
    text = re.sub(r"<[^>]+>", " ", html)
    text = text.replace("&nbsp;", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def scan_hansard_range(prefix: str, start: int, end: int, logger) -> list[dict]:
    """扫描 SPRS API 指定 ID 范围，返回有效条目（title + content + bucket）。

    Each result carries the graded `bucket` (STRONG / INFRA+ / INFRA / WEAK+ / NO)
    plus the signal labels that fired, so downstream reporting can show
    reviewers *why* an entry was promoted instead of a yes/no flag.
    """
    import requests
    from classify import classify, is_ai_related

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
            bucket, strong, infra, weak = classify(
                title, content_text[:HANSARD_CONTENT_SCAN_CHARS]
            )
            results.append(
                {
                    "id": rid,
                    "title": title,
                    "date": date_raw,
                    "ai_related": is_ai_related(bucket),
                    "bucket": bucket,
                    "signals": {
                        "strong": strong,
                        "infra": infra,
                        "weak": weak,
                    },
                }
            )
            logger.debug(f"  {rid}: [{bucket}] {title[:60]}")
            time.sleep(0.3)
        except Exception as e:
            logger.debug(f"  {rid}: error — {e}")
    return results


def run_hansard(state: dict, logger) -> dict:
    max_oral = state["hansard"]["max_oral_id"]
    max_written = state["hansard"]["max_written_id"]
    max_budget = state["hansard"].get("max_budget_id", 2937)  # default seeded from prior emit

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

    # Per-bucket counts so the email separates "definite hits" (STRONG)
    # from "needs reviewer eyes" (INFRA+ / WEAK+) from "noise" (INFRA / NO).
    bucket_counts: dict[str, int] = {}
    for r in all_results:
        bucket_counts[r["bucket"]] = bucket_counts.get(r["bucket"], 0) + 1

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

    logger.info(
        f"Hansard 扫描完成: {len(all_results)} 条新记录, "
        f"{len(ai_results)} 条 AI 相关 (buckets: {bucket_counts})"
    )

    return {
        "count": len(ai_results),
        "total_scanned": len(all_results),
        "scan_range": (
            f"oral {max_oral + 1}..{max_oral + HANSARD_ORAL_RANGE}, "
            f"written {max_written + 1}..{max_written + HANSARD_WRITTEN_RANGE}, "
            f"budget {max_budget + 1}..{max_budget + HANSARD_BUDGET_RANGE}"
        ),
        "items": [
            {
                "id": r["id"],
                "title": r["title"],
                "date": r["date"],
                "bucket": r["bucket"],
                "signals": r["signals"],
            }
            for r in ai_results[:15]
        ],
        "bucket_counts": bucket_counts,
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

    if "voices" in results:
        r = results["voices"]
        lines.append(f"<h3>MDDI 演讲: {r.get('count', 0)} 条新发现</h3>")
        if r.get("items"):
            lines.append("<ul>")
            for s in r["items"]:
                speaker = s.get("speaker") or "?"
                lines.append(f"  <li>[{s.get('date','?')}] {speaker}: {s.get('title','?')}</li>")
            lines.append("</ul>")
        elif not r.get("error"):
            lines.append("<p>无新内容</p>")

    if "hansard" in results:
        r = results["hansard"]
        total = r.get("total_scanned", 0)
        bucket_counts = r.get("bucket_counts", {})
        bucket_summary = ", ".join(
            f"{b}: {c}"
            for b, c in sorted(bucket_counts.items(), key=lambda x: x[0])
            if c > 0
        )
        lines.append(
            f"<h3>国会辩论: {r.get('count', 0)} 条 AI 相关 (共扫描 {total} 条)"
            + (f" — buckets: {bucket_summary}" if bucket_summary else "")
            + "</h3>"
        )
        if r.get("items"):
            # Group by bucket so reviewers process STRONG first, INFRA+/WEAK+ next.
            by_bucket: dict[str, list[dict]] = {}
            for d in r["items"]:
                by_bucket.setdefault(d.get("bucket", "?"), []).append(d)
            for bucket in ("STRONG", "INFRA+", "WEAK+", "INFRA", "NO"):
                items = by_bucket.get(bucket, [])
                if not items:
                    continue
                lines.append(f"<p><strong>[{bucket}] {len(items)} 条</strong></p><ul>")
                for d in items:
                    sig = d.get("signals", {})
                    sig_parts = []
                    if sig.get("strong"):
                        sig_parts.append("S=" + ",".join(sig["strong"][:3]))
                    if sig.get("infra"):
                        sig_parts.append("I=" + ",".join(sig["infra"][:3]))
                    if sig.get("weak"):
                        sig_parts.append("W=" + ",".join(sig["weak"][:3]))
                    sig_label = f" <small>({' | '.join(sig_parts)})</small>" if sig_parts else ""
                    lines.append(
                        f"  <li>[{d.get('date','?')}] {d.get('id','?')}: "
                        f"{d.get('title','?')}{sig_label}</li>"
                    )
                lines.append("</ul>")
        elif not r.get("error"):
            lines.append(f"<p>无新内容 (扫描范围: {r.get('scan_range','N/A')})</p>")

    # New tsx pipelines block (no items detail; PR link is the action).
    for pid, r in results.items():
        if pid in ("videos", "voices", "hansard"):
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


def notify_via_github_issue(title: str, body: str, logger, labels: list[str] | None = None) -> bool:
    """通过 `gh issue create` 开 GitHub Issue 通知（assigned to @me）。

    取代旧的 SMTP 邮件路径——cron-running user 的 GitHub 通知（邮件 / web）会自动收到。
    `gh` CLI 必须 `gh auth login` 已认证。
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
def run_tsx_pipeline(pipeline: dict, logger) -> dict:
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
        return {"count": 0, "items": [], "error": f"exit {proc.returncode}: {proc.stderr[:300]}"}

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
        return {"count": 0, "items": [], "error": "no JSON report from pipeline"}

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


def main():
    parser = argparse.ArgumentParser(description="sgai 数据自动更新 (registry-driven)")
    parser.add_argument("--dry-run", action="store_true", help="运行但不发邮件")
    parser.add_argument("--only", help="只运行指定管线（逗号分隔；如 videos,policies）")
    parser.add_argument(
        "--schedule",
        choices=["weekly", "monthly", "quarterly", "half-yearly", "all"],
        default="all",
        help="仅运行匹配此 schedule 的管线",
    )
    parser.add_argument("--verbose", action="store_true", help="详细输出")
    args = parser.parse_args()

    # 切换工作目录到脚本所在位置
    os.chdir(SCRIPT_DIR)

    logger = setup_logging(args.verbose)
    logger.info("=" * 50)
    logger.info("AISG 数据自动更新开始")
    logger.info("=" * 50)

    state = load_state()
    results = {}
    errors = []
    start_time = time.time()

    # ── 从 registry 决定要跑哪些管线 ──
    registry = load_registry()
    only_set = None
    if args.only:
        only_set = {s.strip() for s in args.only.split(",") if s.strip()}

    selected = []
    for entry in registry.get("pipelines", []):
        if only_set is not None and entry["id"] not in only_set:
            continue
        if args.schedule != "all" and entry.get("schedule") != args.schedule:
            continue
        selected.append(entry)

    logger.info(f"已选 {len(selected)} 条管线: {[e['id'] for e in selected]}")

    # ── 运行各管线 ──
    for entry in selected:
        pid = entry["id"]
        ptype = entry.get("type")
        try:
            if ptype == "python-builtin":
                if pid == "videos":
                    results["videos"] = run_videos(logger)
                elif pid == "voices":
                    results["voices"] = run_voices(logger)
                elif pid == "hansard":
                    hansard_result = run_hansard(state, logger)
                    results["hansard"] = hansard_result
                    state["hansard"]["max_oral_id"] = hansard_result["new_max_oral"]
                    state["hansard"]["max_written_id"] = hansard_result["new_max_written"]
                    state["hansard"]["max_budget_id"] = hansard_result["new_max_budget"]
                else:
                    raise RuntimeError(f"unknown python-builtin pipeline id: {pid}")
            elif ptype == "tsx":
                results[pid] = run_tsx_pipeline(entry, logger)
            else:
                raise RuntimeError(f"unknown pipeline type: {ptype}")
        except Exception as e:
            logger.error(f"管线 [{pid}] 失败: {e}")
            logger.debug(traceback.format_exc())
            errors.append(f"{pid}: {e}")
            results[pid] = {"count": 0, "items": [], "error": str(e)}

    elapsed = time.time() - start_time

    # ── 判断是否有新内容 ──
    total_new = sum(r.get("count", 0) for r in results.values())
    logger.info(f"扫描完成: 共 {total_new} 条新内容, 耗时 {elapsed:.0f}s")

    # ── 通知（GitHub Issue 取代 SMTP）──
    # 新管线（type=tsx, mode=auto-pr）已经各自开了 PR + assign @me，不需重复通知。
    # 这里只为 scan-only 旧管线（hansard / videos / voices）和失败开 issue。
    try:
        from auto_update_config import NOTIFY_IF_NO_NEW
    except ImportError:
        NOTIFY_IF_NO_NEW = False

    # hansard moved to type=tsx + mode=auto-pr (scripts/refresh/hansard/run.ts).
    # It now opens its own PRs via lib/auto-commit, so it does NOT need a
    # scan-only Issue notification — the cron user gets a GitHub PR
    # notification directly.
    scan_only_pids = {"videos", "voices"}
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

    # ── 保存状态 ──
    save_state(state)

    # ── 清理日志 ──
    cleanup_old_logs(logger)

    logger.info("自动更新完成")


if __name__ == "__main__":
    main()
