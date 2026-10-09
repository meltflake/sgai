# 2026-10-09：videos 管线连续失败一周，issue 却写「no new data」

## 现象

10 月 2 日到 8 日，每天 08:00 的 cron 都开了 issue（#333–#338），标题都是「no new data」。实际上 videos 管线每天启动 4 秒就退出，卡在 `ensureClaudeAuthed()` 的登录检查。这一周没有扫描新视频。

## 根因一：issue 正文丢了错误的第一行

`extract_failure_signal()` 只保留 stderr 的最后 10 行。Node 抛错时先打印 `Error: <原因>`，再打印 5 行提示和 7 行调用栈。最后 10 行正好从提示的中间开始，`Error:` 那一行被切掉。issue 里只剩「请重新登录」的提示，看不到真正的原因（401、超时还是网络错误）。

修法：stderr 里有 `Error:` 开头的行时，从最后一个这样的行开始保留，调用栈只留前 2 帧。

## 根因二：标题不区分「失败」和「没有新数据」

`compose_email()` 只按新增条数写标题。管线失败时条数是 0，所以标题写「no new data」。正文里有失败信息，但只看标题的人会以为一切正常。

修法：有错误时，标题加上「N failed」。

## 没有查清的部分

本次登录失败的原因没有查清。手动跑登录检查时能通过，模拟 cron 的环境变量再跑一次也能通过。下次失败时，issue 会带上 `Error:` 那一行，再按那一行定位。

## 验证

`cd scripts && python3 -m unittest test_auto_update_signal`：新增 3 个测试，全部 10 个测试通过。其中一个测试用 #338 的 stderr 结构复现了丢行。
