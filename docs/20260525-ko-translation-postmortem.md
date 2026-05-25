# Postmortem: Korean Translation Session (2026-05-23 ~ 2026-05-25)

## 概述

为 sgai 韩文页面补全 Ko 翻译。原计划几小时，实际耗时 ~48 小时。
根因不是翻译量大，而是**工具选错 + 三个 bug 叠加 + 没有自动恢复机制**。

## 时间线

| 时间 | 事件 | 问题 |
|------|------|------|
| 05-23 14:00 | 用 `backfill-ko-arrays.ts` 翻数据字段数组 | ✅ 462 字段，正常 |
| 05-23 15:00 | 用同一工具翻 transcript 全文 | ❌ 超时死循环 |
| 05-23 15:00~20:00 | 反复重启 backfill 工具 | ❌ 每次卡死，无中间写入 |
| 05-23 20:00 | 切换到专用 translate 脚本 | ✅ 开始推进 |
| 05-23 21:00 | 发现 `$1` backreference bug | ❌ 文件损坏，build 失败 |
| 05-24 01:00~12:00 | 修 bug + 反复清理 + 重启 | 进程反复死掉无人发现 |
| 05-24 12:00 | 添加自动监控 + commit | ✅ 开始稳定推进 |
| 05-24 18:00 | 发现 `alreadyDone` regex bug | ❌ 脚本跳过未翻 record |
| 05-24 22:00 | 修 regex bug + 并行 cache warm | ✅ 加速完成 |
| 05-25 01:30 | 153/153 debate 完成 | ✅ |

## 三个关键 Bug

### Bug 1: String.replace() $1 backreference（严重）

```typescript
// ❌ 韩文翻译含 "$1,500" → replace 把 $1 当 regex 引用 → 文件损坏
recordBody.replace(enRe, `$1\n${formatted}`)

// ✅ 用 arrow function 避免 backreference 解析
recordBody.replace(enRe, (m) => `${m}\n${formatted}`)
```

**影响**：video-transcripts.ts 反复出现 orphan Korean lines 和 unterminated strings，build 持续失败。清理了 3 次（70 + 33 + 75 orphan lines）。

### Bug 2: alreadyDone regex 跨 record 匹配（严重）

```typescript
// ❌ [\s\S]*? 跨越 record 边界，匹配到其他 record 的 paragraphsKo
new RegExp(`'${id}'[\\s\\S]*?paragraphsKo:\\s*\\[`).test(source)

// ✅ 先提取单条 record，在 record 内部检查
const recordMatch = recordRe.exec(source);
const alreadyDone = recordMatch != null && /paragraphsKo:\s*\[/.test(recordMatch[0]);
```

**影响**：脚本报 "153/153 already present" 但实际只有 131 条。22 条长辩论被静默跳过。

### Bug 3: backfill-ko-arrays.ts 设计缺陷（高）

把所有 record 的段落堆成一个 batch，120 秒超时反复 fallback（30→15→8→4→2→1），无中间写入，进程一死全部白费。

**影响**：浪费了 ~5 小时在反复重试上。

## 流程问题

### 1. 进程死了不知道

后台翻译进程挂了后，没有自动检测和重启。用户多次问"又死了？"才发现。Monitor 有 30 分钟硬超时，超时后没重启 → 空窗期。

**改进**：Monitor 加了自动重启逻辑（检测 procs=0 时 spawn 新进程）。

### 2. 用错工具

`backfill-ko-arrays.ts` 是为短数组（keyPoints 3-5 条）设计的。拿它翻 24000 段 transcript 全文，注定失败。

**改进**：应该一开始就用 `translate-transcripts-ko.ts` 这种逐 record + 立即写入的专用脚本。

### 3. 没有提前评估工作量

开始翻译前没算过段落总量和预估时间。"全跑"后才发现 debate 有 24000 段。

**改进**：翻译前先 dry-run 统计段落数，给出时间预估。

## 代码修复清单

| 修复 | 文件 | 状态 |
|------|------|------|
| `$1` backreference → arrow function | `translate-transcripts-ko.ts`, `translate-debate-transcripts-ko.ts` | ✅ |
| `alreadyDone` regex 限定 record 范围 | `translate-debate-transcripts-ko.ts` | ✅ |
| video getter 签名 `'zh'\|'en'\|'ja'` → `string` | `video-transcripts.ts` | ✅ |
| video getter ja 分支误用 `paragraphsKo` → `paragraphsJa` | `video-transcripts.ts` | ✅ |
| translate 脚本模板覆盖 getter fix | `translate-transcripts-ko.ts` | ✅ |
| `findUnpairedFields` 支持数组字段 | `i18n-pair.ts` | ✅ |
| DEFAULT_LOCALES `['en']` → `['en','ja','ko']` | `i18n-pair.ts` | ✅ |
| CI gate 从 1 文件扩到全部 | `package.json` | ✅ |
| derived-updates 加 Ko 模板 | `derived-updates.ts` | ✅ |

## 未修复 / 待改进

| 项目 | 建议 |
|------|------|
| `backfill-ko-arrays.ts` 无中间写入 | 改为逐 record 翻译 + 写入，或标记为 deprecated，引导用专用脚本 |
| Monitor 30 分钟超时 | 这是平台限制，无法改。workaround: 自动重启逻辑写在 monitor 脚本里 |
| 翻译前无 dry-run 预估 | 加一个 `--estimate` flag 统计段落数和预估时间 |
| 重复 paragraphsEn 注入 | cos-mom-2026 出现了重复的 paragraphsEn，说明注入逻辑在某些 edge case 会重复写入 |
