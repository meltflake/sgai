#!/usr/bin/env bash
# scripts/doctor-cron.sh
# ─────────────────────────────────────────────────────────────────────────
# Cron wrapper for doctor.sh: daily pre-flight BEFORE the 08:00 pipeline
# window, so an expired gh token (or broken venv/CLI) surfaces as an
# alert instead of a silent night of stranded emits.
#
# Why this exists: gh-token expiry is silent. It stranded pipeline output
# on 2026-07-07, 2026-08-16→21 and 2026-08-24 — the emits succeeded, the
# push/PR step 401'd, and dirty working trees piled up masquerading as
# pipeline bugs (see memory: dirty tree → suspect gh auth first).
#
# Alert channels, in order:
#   1. macOS notification via osascript — works even when gh is the
#      broken part (the common case; an alert that needs gh to report
#      "gh is broken" would be useless).
#   2. gh issue (best-effort, only when gh still works — e.g. venv rot).
#   3. Always: full report appended to scripts/logs/doctor.log.
#
# Crontab (before the 08:00 daily pipeline entry):
#   50 7 * * * /bin/bash /Users/wulujia/Github/sgai/scripts/doctor-cron.sh >> /Users/wulujia/Github/sgai/scripts/logs/cron.log 2>&1

set -u

PROJECT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT"
LOG_DIR="$PROJECT/scripts/logs"
mkdir -p "$LOG_DIR"
STAMP="$(date '+%Y-%m-%d %H:%M:%S')"

report="$(bash scripts/doctor.sh 2>&1)"
status=$?

{
  echo "── doctor-cron $STAMP (exit $status) ──"
  echo "$report"
} >> "$LOG_DIR/doctor.log"

if [ "$status" -eq 0 ]; then
  echo "[doctor-cron] $STAMP OK"
  exit 0
fi

# Distill the failed lines for the alert body.
fails="$(printf '%s\n' "$report" | grep -E '✗' | sed 's/\x1b\[[0-9;]*m//g' | head -5)"
echo "[doctor-cron] $STAMP FAILED:"
printf '%s\n' "$fails"

# 1. macOS notification (survives a dead gh).
/usr/bin/osascript -e "display notification \"$(printf '%s' "$fails" | head -1 | cut -c1-120 | sed 's/"/\\"/g')\" with title \"sgai doctor 预检失败\" subtitle \"跑 bash scripts/doctor.sh 看详情\"" 2>/dev/null || true

# 2. GitHub issue (best-effort; skipped silently when gh itself is down).
if gh auth status >/dev/null 2>&1; then
  today="$(date '+%Y-%m-%d')"
  if ! gh issue list --state open --search "doctor-cron in:title" --json title -q '.[].title' 2>/dev/null | grep -q "doctor-cron"; then
    gh issue create \
      --title "[doctor-cron] pre-flight failed $today" \
      --assignee @me \
      --body "$(printf 'doctor.sh 预检失败（cron 07:50 触发）。失败项：\n\n```\n%s\n```\n\n完整报告见本机 scripts/logs/doctor.log。修复对照 scripts/SETUP.md。' "$fails")" \
      2>/dev/null || true
  fi
fi

exit 1
