# 2026-09-06 辩论中文翻译的人名幻觉：补上 glossary 注入

## 现象

9 月 5 日合并的 motion-3008 / motion-3010（[#279](https://github.com/meltflake/sgai/pull/279)）中文轨里，发言人名字被大面积音译错：

| 真人 | 译文里出现过的写法 | 官方中文名 |
| --- | --- | --- |
| Jamus Jerome Lim | 林俊杰、林占祥、林占中、林占梅、林志明、詹姆斯·杰罗姆·林 | 林志蔚 |
| Kenneth Tiong Boon Kiat | 张国贤、陈炳辉、刘庆威 | 张文杰 |
| Edward Chia Bing Hui | 谢家辉、谢伟达 | 谢秉辉 |
| Pritam Singh | 普里塔姆·辛格、普里坦·辛格 | 毕丹星 |
| Jeffrey Siow | 萧世杰 | 萧振祥 |
| Tan See Leng | 谭思亮 | 陈诗龙 |

日韩轨从中文派生，同样受影响。

## 根因

仓库里本来就有防这个的机制：[scripts/lib/translate.ts](scripts/lib/translate.ts) 的 `buildGlossaryHint()` 会把 [glossary.json](scripts/evals/translation/glossary.json) 里的人名对照注入提示词，注释写明就是为了防音译幻觉（#184 抓到 Gan Kim Yong 被写成甘金勇）。

但**辩论中文翻译走的是自己的 OpenAI 实现**（`translate-debate-transcripts.ts`），从头到尾没接这套机制。它的系统提示只说 "Preserve names"，没有名单可依，模型就自由发挥了。日韩脚本接了机制，但 glossary 只有 25 个人，覆盖不到这场辩论的发言人。

## 改动

- `glossary.json` 的 `people` 从 25 条扩到 115 条，来源是 parliament.gov.sg 的 107 名现任议员官方页（HTML 内嵌官方中文名，剥离「医生/博士/女士」等敬称）。
- 补 Hansard 实际使用的简称别名（Kenneth Tiong、Jamus Lim、James Lim、Edward Chia、Louis Chua、Andre Low、Gerald Giam、Patrick Tay、Eileen Chong）。**只收双词以上**——单姓氏别名会误伤，比如加了 `Lim` 之后 Sylvia Lim 会变成林志蔚。
- 新增 90 人的 `ja` / `ko` 形式一律填英文原名，跟随仓库既有惯例（`Pritam Singh議員` / `Pritam Singh 의원님`），这也顺带保证韩文轨不混入汉字。
- `translate-debate-transcripts.ts` 接上 `buildGlossaryHint(paragraphs, 'zh')`，并把系统提示改成「名单里有就用官方中文名，没有就保留拉丁原文，禁止自造音译」。
- `buildGlossaryHint()` 对同一条目多别名命中做去重。
- 三个 `→ko` 方向的提示加上「禁止输出汉字」：`비(非)미국` 这种韩语里合法的汉字注音会被 `check:i18n` 判 fail，这次又复现了一处。

## 重跑与验证

两条动议的中文轨带 glossary 重跑（约 16 分钟），日韩各重跑约 2 小时 15 分。

- 31 位发言人全部落到官方中文名，残留音译写法为 0。
- 日韩轨人名为拉丁原名，中文名泄漏 0，韩文轨汉字 0。
- 段数配平：3008 为 zh/ja/ko 各 1084，3010 各 407。
- 其余 207 条记录逐条比对 main，四个段落数组差异 0。
- `npm run check`、`check:debate-transcripts`（209 条）、`i18n-pair`、`npm run build && check:dist` 全过；`test:lib` 437 项全过。

日文基线快照更新两行：motion-3008 页新增 8 处拉丁人名串（发言人列表与「議長：Edward Chia Bing Hui議員」这类），同时 updates 页减少 1 处。
