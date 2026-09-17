# 2026-09-17：自动刷新算完了数据，却开不出 PR

## 现象

9 月 17 日 08:00 的 cron 跑了 2 小时 07 分，issue #313 标题是「no new data」。但工作区里躺着 5 条已经写好的视频记录（v099–v103），四语字段齐全。数据是算出来了，只是没能提交。

## 根因一：被 gitignore 的产物还留在索引里

`public/skill/README.md`、`SKILL.md`、`url-map.json` 三个文件在 `.gitignore` 第 85 行里，但从来没从 git 索引里移出去。每次 `prebuild` 跑 `publish-skill.mjs` 都会重写它们。

9 月 7 日 PR #298 往 `policies.ts` 加了 ESR 和 DC-CFA2 两条政策，`url-map.json` 的 `validIds` 随之变化，但索引里那份还是旧的。此后本地只要构建过一次，这个文件就会被重写成新内容，工作区从此一直是脏的。9 月 10 / 12 / 14 的自动 PR 还开得出来，说明那几天没在本地构建过；到 17 日这一跑就撞上了。

`autoCommit()` 有一道安全检查，工作区出现预期之外的改动就拒绝提交：

```
❌ Error: Refusing to auto-commit: working tree has unexpected dirty paths.
  public/skill/url-map.json
```

数据写完了，卡在最后一步。

修法：`git rm --cached` 这三个文件。CI 的 `prebuild` 会重新生成，线上不受影响。

## 根因二：错误信息被截断，看不出真正的原因

`scripts/lib/llm.ts` 在 `claude` CLI 非零退出时，把 stdout 截到 200 字符当作错误详情。CLI 的结果 JSON 前面是一长串 usage 和 session 字段，200 字符正好切在真正的 `result` 之前。于是所有失败长得一模一样：

```
callLlm: claude exited 1: {"duration_api_ms":0,"stop_reason":"stop_sequence","session_id":"…
```

改成先从结果 JSON 里取 `result` / `error` 字段，同一个调用立刻变成：

```
callLlm: claude exited 1: Not logged in · Please run /login
```

这次的 `Not logged in` 是排查环境自身的问题（宿主注入的 `ANTHROPIC_BASE_URL` 和 `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` 被子进程继承，而那套凭据不属于 CLI）。cron 环境没有这些变量，不受影响。但截断本身是真问题，它把任何一类 CLI 失败都伪装成同一条噪音。

## 根因三：120 秒超时

cron 日志里有 4 次 `callLlm: timeout after 120000ms`，导致两条候选视频当天没写进数据文件。`getDefaultTimeout()` 默认 120 秒，15 段的批量翻译不够用。CLAUDE.md 规则 #9 已经写明 transcript 翻译要 `SGAI_LLM_TIMEOUT_MS=300000`，但那只是命令行上的约定，videos 的 emit 走的是 `scripts/lib/translate.ts`，没带这个值。

修法：`translate.ts` 里的 `callLlmJson` 调用直接给 `timeoutMs: 300000`（仍可用 `SGAI_LLM_TIMEOUT_MS` 覆盖）。所有走 `translateRecords` / `translateParagraphs` 的管线一起受益，cron 不用改。

## 审稿时又抓到的

合并前审了一遍 PR，机器翻译的日文和韩文标题有三类问题：

- v100 的日韩标题把“计划三年内投 3.5 亿美元、员工翻倍”写成了已经完成
- v099–v102 的日韩标题是带句号的完整句子，站上其他记录都是名词短语式标题
- 日文里混了中文量词和用词：“200 門以上”“AI 課程”“学徒プログラム”，改成“200 以上”“AI 講座”“見習いプログラム”

这类问题 `check:i18n-completeness` 看不出来，它只查字段有没有。

## 本次落地

- v099–v103 五条视频，四语齐全，`addedAt: 2026-09-17`
- v099 的日文段落用 `scripts/videos/translate-transcripts-ja.ts` 单独补上
- 本地 main 落后 origin/main 一个提交（#312），先同步再解冲突：两边都往数组头部插记录，保留双方，新的在前
- `npm run check`、`npm run build`、`npm run check:dist`、`eval:addedAt`、`eval:video-transcript` 全绿
