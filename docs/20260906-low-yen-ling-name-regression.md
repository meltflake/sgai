# 2026-09-06 修正 Low Yen Ling 译名回归：一次全局替换改错了 57 处

## 事故

2026-09-05 的 PR #265 里，我根据 parliament.gov.sg 确认 Jasmin Lau 的官方中文名是「刘洁敏」，随后对四个数据文件跑了一次全局 `sed s/刘燕玲/刘洁敏/g`。

前提是错的。**「刘燕玲」本身就是另一位议员 Low Yen Ling 的官方中文名**（蔡厝港议员、贸工部高级政务部长），并不是 Jasmin Lau 的误写。仓库里 66 处「刘燕玲」，只有极少数确实指 Jasmin Lau，其余都是 Low Yen Ling——全局替换把她改成了别人。

当时做过一次抽查：`grep -v "jasmin\|Lau"` 看剩下的上下文，看到的都是「高级政务部长刘燕玲」，两人当时都是高级政务部长，所以没看出问题。**抽查用的判据（职衔）恰好无法区分这两个人。**

## 判定方式

不再靠上下文猜。每条 record 都带 `paragraphsEn` / `*En` 字段，是逐字 Hansard 英文，属于权威证据：

- record 的英文里只出现 `Low Yen Ling` → 该 record 内所有中日韩轨用「刘燕玲」
- 只出现 `Jasmin Lau` → 用「刘洁敏」
- 两个都出现或都不出现 → 不动，人工看

23 条 record 命中，13 条判 Low Yen Ling、10 条判 Jasmin Lau，无歧义。

## 修复

- `debate-transcripts.ts`：56 处恢复为「刘燕玲」（cos-mti-2026 11 处、budget-2361 13 处、budget-2610 8 处等，均为贸工部 COS 与预算辩论）。
- `speech-transcripts.ts`：1 处恢复。英文原文写明 `Senior Minister of State Low Yen Ling has advocated strongly for Small and Medium Enterprises`。
- `debates.ts`、`voices.ts` 未改：其中的「刘洁敏」都有英文原名佐证，确属 Jasmin Lau。

## 教训

跨记录的全局 `sed` 替换人名是危险操作。同名字段在不同 record 里可能指不同的人，**判据必须逐条取自该 record 自己的权威文本**，不能靠一次全局抽查。下次改人名一律走「每条 record 用它自己的英文原文判定」这条路。
