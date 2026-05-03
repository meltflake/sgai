#!/usr/bin/env bash
# scripts/doctor.sh
# ─────────────────────────────────────────────────────────────────────────
# Pre-flight check for the sgai data-refresh infrastructure. Tells you
# which step in scripts/SETUP.md still needs attention.
#
# Usage:
#   bash scripts/doctor.sh
#
# Exits non-zero if any required step is missing.

set -u

PROJECT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT"

ok=0
fail=0

print_ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; ok=$((ok+1)); }
print_fail() { printf "  \033[31m✗\033[0m %s\n" "$1"; fail=$((fail+1)); }
print_warn() { printf "  \033[33m!\033[0m %s\n" "$1"; }

echo
echo "sgai doctor — checking $PROJECT"
echo

# 1. Python venv
echo "1. Python venv (/tmp/sgai-venv)"
if [ -x /tmp/sgai-venv/bin/python ]; then
  if /tmp/sgai-venv/bin/python -c "import requests, feedparser, bs4" 2>/dev/null; then
    print_ok "venv exists, all 3 deps importable"
  else
    print_fail "venv exists but missing deps — run: /tmp/sgai-venv/bin/pip install -r scripts/requirements.txt"
  fi
else
  print_fail "venv missing — run: python3 -m venv /tmp/sgai-venv && /tmp/sgai-venv/bin/pip install -r scripts/requirements.txt"
fi

# 2. Node deps
echo
echo "2. Node deps (tsx + lint test)"
if [ -d node_modules/tsx ]; then
  print_ok "node_modules/tsx present"
else
  print_fail "node_modules missing — run: npm install"
fi

# 3. gh CLI
echo
echo "3. gh CLI (auto-PR)"
if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    user=$(gh api user --jq .login 2>/dev/null || echo "?")
    print_ok "gh authenticated as $user"
  else
    print_fail "gh not logged in — run: gh auth login"
  fi
else
  print_fail "gh missing — run: brew install gh"
fi

# 4. Claude Code CLI (LLM backend) + GITHUB_TOKEN
echo
echo "4. Claude Code CLI (LLM backend) / GITHUB_TOKEN"
if command -v claude >/dev/null 2>&1; then
  cv=$(claude --version 2>/dev/null | head -1)
  print_ok "claude CLI present: $cv"
else
  print_fail "claude CLI missing — https://docs.claude.com/en/docs/claude-code/quickstart"
fi
if [ -n "${GITHUB_TOKEN:-}" ]; then
  print_ok "GITHUB_TOKEN present (${GITHUB_TOKEN:0:6}...) — github-stars 5000 req/h"
else
  print_warn "GITHUB_TOKEN unset — github-stars limited to 60 req/h (still works)"
fi

# 5. GitHub notification scope (PR assignee / Issue create)
echo
echo "5. GitHub notification (PR @assignee + Issue fallback)"
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  scopes=$(gh auth status 2>&1 | grep -i "Token scopes" | head -1)
  if echo "$scopes" | grep -qE "repo|write"; then
    print_ok "gh token scopes look sufficient: $(echo "$scopes" | sed 's/^[[:space:]]*//')"
  else
    print_warn "gh token scopes unknown — gh issue create may fail. If so, run: gh auth refresh -s repo"
  fi
else
  print_warn "gh not authenticated (already flagged in §3)"
fi
if [ -f scripts/auto_update_config.py ]; then
  print_ok "scripts/auto_update_config.py exists (optional overrides)"
else
  print_warn "scripts/auto_update_config.py absent — defaults are fine; copy example only if you want to override"
fi

# 6. crontab
echo
echo "6. crontab"
if crontab -l 2>/dev/null | grep -q sgai; then
  count=$(crontab -l 2>/dev/null | grep -c "auto_update.py")
  print_ok "crontab has $count sgai entry/entries"
else
  print_warn "no sgai cron entry yet — see scripts/SETUP.md §6"
fi

# 7. Pipeline reachability (cheap dry-runs)
echo
echo "7. Pipeline reachability (quick dry-runs)"
if npx tsx scripts/refresh/github-stars.ts --dry-run --no-commit 2>&1 | grep -q "scanned [0-9]\+ repos"; then
  print_ok "github-stars dry-run reaches GitHub API"
else
  print_warn "github-stars dry-run failed (network? rate limit?)"
fi

# Summary
echo
echo "─────────────────────────────────────────"
echo "$ok ok · $fail failed"
if [ "$fail" -gt 0 ]; then
  echo "Open scripts/SETUP.md and fix the failed items."
  exit 1
fi
echo "All set. Try a real run:"
echo "  npx tsx scripts/refresh/github-stars.ts --dry-run"
