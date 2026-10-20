# 2026-10-21 定时任务从 cron 迁到 launchd

## 现象

- 10-16 的修复（补 `USER`）合并后，10-17、10-18 的 videos 管线仍报 Claude CLI「Not logged in」。10-18 07:50 的 doctor 也报同样的错。
- 10-19、10-20 没有任何运行记录。同期机器上所有 cron 任务都没跑（07:05 流量日报、01:00 仓库同步）。

## 根因

1. **cron 不在登录会话里。** 用 cron 跑一次探针：keychain 搜索列表只有 System.keychain，读 `Claude Code-credentials` 返回 44（找不到）。Claude CLI 从 10-01 起把登录存在登录 keychain（该条目创建于 10-01）。之前凭证在文件里，cron 读得到。10-16 补的 `USER` 是必要条件，不是充分条件：我在自己的终端里用 `env -i` 复现时，进程仍在登录会话内，所以误判为已修复。
2. **cron 不补跑睡眠期间错过的任务。** 10-19 凌晨电池耗尽（06:11 电量 2%），之后机器累计睡眠约 9.5 小时，覆盖了两天的 08:00。

## 修复

- `scripts/auto_update.py --install-cron` 改为安装两个 LaunchAgent：`com.sgai.doctor`（07:50）和 `com.sgai.auto-update`（08:00 跑 `--due`），并删除旧的 sgai crontab 行（其他 cron 任务不动）。LaunchAgent 在登录会话内运行，能读登录 keychain；睡眠时错过的 `StartCalendarInterval` 会在唤醒后补跑。
- 不设 `RunAtLoad`：安装或登录时加载代理不应从当前检出的分支启动一次运行。关机错过的一天由下一次 `--due` 补上（weekly 等不会丢）。
- `--status` 和 `doctor.sh` 检查两个 LaunchAgent 是否已加载。
- 测试：`scripts/test_auto_update_launchd.py`（plist 内容、只删 sgai 的 cron 行）。

## 验证

- 用 launchd 临时代理运行探针：`loggedIn: true`，keychain 读取返回 0。
- 通过 `launchctl kickstart` 运行 doctor：11 项全部通过，含「claude CLI logged in」。
- 迁移前后 crontab 对比：只少了 doctor 行和 managed 块。

## 教训

- 复现「定时任务环境」要用真的调度器跑一次，不能用自己终端里的 `env -i` 模拟：会话、keychain、TCC 权限都不一样。
- 迁移中我用 `crontab <文件>` 恢复备份时没有生效，crontab 空了约 5 分钟。改用 `crontab -` 从 stdin 写入后恢复，与备份逐字一致。改 crontab 前后都要 diff。
