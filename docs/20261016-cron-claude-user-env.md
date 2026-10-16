# 2026-10-16 cron 下 claude CLI 报“未登录”——15 天 LLM 管线静默失败

## 现象

- 2026-10-02 起，08:00 的每日 videos 管线每次 4 秒结束，日志只有一行 `[videos-refresh] starting`。
- 10-07 月度批次里 research-digest 到 shortlist 后中断；10-12 周批次 voices / reg-lookahead / evals 全部失败。
- github-stars（10-07）和 jobs-index 正常开 PR。#342 的 6 条视频是手工跑出来的。
- 10-02 到 10-08 的 issue 标题是 "no new data"，10-10 起（#339 合并后）才写 "1 failed" 并附错误。7 个 open issue 没人看。
- 07:50 的 doctor-cron 每天都报 OK。

## 根因

claude CLI 通过 `$USER` 定位 macOS keychain 里的凭证。cron 按 `man 5 crontab` 只设 SHELL、LOGNAME、HOME，不设 USER。复现：

```
env -i HOME=$HOME PATH=$PATH                 sh -c 'echo ping | claude -p'   # Not logged in
env -i HOME=$HOME PATH=$PATH LOGNAME=wulujia sh -c 'echo ping | claude -p'   # Not logged in
env -i HOME=$HOME PATH=$PATH USER=wulujia    sh -c 'echo ping | claude -p'   # Pong
```

keychain 条目 `Claude Code-credentials` 创建于 2026-10-01 11:36（SGT），即当天 08:00 成功运行之后。之前的凭证条目在没有 USER 的环境下也能读到，新条目不能。CLI 内部为什么改了查找方式不可考（2.1.283 从 09-26 起没变），能确定的是：USER 在，就能读。

doctor 没抓到，是因为它只检查 `claude --version`。这个命令在登录失效时同样退出 0。

## 修复

1. `scripts/auto_update.py` `ensure_user_env()`：USER 缺失时按 LOGNAME 或 `pwd.getpwuid` 补上，在 `ensure_gh_token()` 之前执行。
2. `scripts/lib/llm.ts` `claudeEnv()`：三处 claude 子进程都用它构造环境。4 条单元测试。
3. `scripts/doctor.sh`：补 USER，再用 `claude auth status` 读 `loggedIn`，false 记为失败项。
4. `scripts/SETUP.md` §4 写明这条约束。

验证：在 `env -i HOME LOGNAME SHELL PATH` 环境下跑 `ensureClaudeAuthed()` 通过；同环境下 doctor 10/10 通过；把 `CLAUDE_CONFIG_DIR` 指向空目录时 doctor 报 1 项失败。

## 教训

- “二进制在、版本能打印”不等于“能用”。预检要做真实调用或读真实状态。gh 在 07-07 已经踩过同一类坑（`gh auth status` 对比 `gh --version`）。
- 失败报告的标题要能和成功区分开。#339 之前“no new data”把失败和空结果混成一条，连续 7 天没人注意。
- 同一批管线里有的成功有的失败，先看失败的那组共用什么依赖。这次共用的是 LLM 预检。
