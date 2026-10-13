# 视频字幕 ja/ko 翻译：支持单行数组

日期：2026-10-09

## 问题

2026-10-09 的 videos 刷新在 v120 失败，报错是 `No paragraphs block found in record v120`。

v120 的字幕只有一段：`[music] >> Woo!`。Prettier 把只有一段的数组折成一行，例如 `paragraphs: ['[音乐] >> 嗚！'],`。

`translate-transcripts-ja.ts` 和 `translate-transcripts-ko.ts` 用正则找字段。正则只认多行写法 `paragraphs: [\n ... \n],`，所以找不到单行数组。ja/ko 两步因此失败，记录只剩 zh + en。`eval:video-transcript` 是 CI 硬门，它挡住了 PR #342。当时的临时处理是把 v120 标成 `source: 'unavailable'`。

这和「空 autoDiscovered 单行陷阱」是同一类 bug：用正则改 TS 源码，默认 prettier 一定输出多行。

另外，`translate-transcripts-ja.ts` 的替换还在用 `'$1\n...'` 字符串。译文里出现 `$1` 或 `$&` 时，替换结果会出错（CLAUDE.md 第 9 条）。

## 改动

1. 新增 `scripts/lib/ts-record-fields.ts`。它按括号配对找字段的结束位置，跳过字符串里的括号。单行和多行写法都能找到。
2. ja、ko 两个脚本的 `paragraphs*` 和 `digest*` 注入都改用这个共享函数。原来两份各约 50 行的重复代码删掉了。新函数用字符串拼接，不再用 `replace` 的 `$1` 字符串。
3. `scripts/videos/vtt-parse.ts` 新增 `hasSpeech()`。去掉 `[Music]`、`[音乐]` 这类声音标签后，词数少于 5 个，就判为没有语音。
4. `fetch-transcripts.ts` 遇到没有语音的字幕轨，按「无字幕」处理，写 `source: 'unavailable'` 占位。

## 为什么把纯声音标签判为无字幕

v120 这种字幕翻成四种语言，页面上只显示「[音乐] 呜！」，读者得不到内容。按无字幕处理，页面显示「字幕不可用」，比显示噪音更诚实。这也省掉一轮翻译调用。

阈值是 5 个词。一个汉字算一个词，一串拉丁字母或数字算一个词。用现有 107 条有内容的字幕测试，没有一条被误判。

已有内容的记录不受影响：emit 本来就拒绝把有内容的记录降级成 unavailable。

## 验证

- `scripts/lib/__tests__/ts-record-fields.test.ts`：单行 `paragraphs` / `paragraphsEn` 夹具、字符串里的括号、已有字段替换、`$1` 原样保留、prettier 能解析输出。改动前失败，改动后通过。
- `scripts/refresh/videos/__tests__/vtt-has-speech.test.ts`：v120 的字幕判为无语音，短的真句子判为有语音。
- 回放测试：把 `video-transcripts.ts` 里现有的 214 条 ja/ko 轨重新注入一遍，prettier 之后和原文件逐字节相同。
