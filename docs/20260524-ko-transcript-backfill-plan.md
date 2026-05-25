# Ko Transcript Backfill Plan

> 2026-05-24 · 解决韩文页面全文 transcript 回落英文的问题

## 问题

韩文详情页（speech / video / debate）的全文段落显示英文，因为三个 transcript 文件没有 `paragraphsKo`：

| 文件 | 记录数 | zh 段落数 | Ko 已完成 | 剩余 |
|------|--------|----------|----------|------|
| speech-transcripts.ts | 11（有 zh 的） | ~734 | **11/11 ✅** | 0 |
| video-transcripts.ts | 62 | ~1812 | **15/62** | 47 |
| debate-transcripts.ts | 153 | ~24196 | **0/153** | 153 |

## 上一次失败的原因

用 `backfill-ko-arrays.ts` 把所有 record 的段落堆成一个大 batch，`translateBatch` 的 120 秒超时反复 fallback（30→15→8→4→2），卡死在长段落上。后台跑了几小时，进程反复挂掉，没有自动恢复机制，也没有中间写入——全部翻完才写文件，所以进程一死所有工作白费。

## 方案：逐条 record 翻译 + 逐条写入 + 超时加大

### 核心改动

1. **用 `SGAI_LLM_TIMEOUT_MS=300000` 环境变量把超时从 120s 加到 300s**
   - `scripts/lib/llm.ts:50` 已支持 `process.env.SGAI_LLM_TIMEOUT_MS`
   - 长段落（500+ 字）在 120s 内经常翻不完，300s 足够

2. **用已有的专用翻译脚本，不用通用 backfill**
   - video: `scripts/videos/translate-transcripts-ko.ts` — 已存在，逐条 record 翻译 + 逐条写入
   - debate: `scripts/hansard/translate-debate-transcripts.ts` — 已存在（zh→en 方向），复制一个 ko 版本
   - speech: 已完成，不需要再跑

3. **每条 record 翻完立即写入文件**（已有脚本都这么做）
   - 进程挂了不丢工作——已写入的 record 下次跑自动跳过
   - sha256 缓存也在——段落级别的翻译缓存不丢

### 执行命令

```bash
# Video transcripts (47 remaining, ~1200 paragraphs)
# 已有缓存 367 条，大部分会命中
SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/videos/translate-transcripts-ko.ts

# Debate transcripts (153 records, ~24196 paragraphs)
# 需要先创建 ko 版翻译脚本（从现有 translate-debate-transcripts.ts 复制改方向）
SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/hansard/translate-debate-transcripts-ko.ts
```

### 需要新建的文件

**`scripts/hansard/translate-debate-transcripts-ko.ts`**

从 `scripts/hansard/translate-debate-transcripts.ts`（已有的 en→zh 翻译脚本）复制，改动点：
- direction: `'zh→ko'`
- cacheDir: `scripts/hansard/data/translate-cache-ko/`
- 输出字段: `paragraphsKo`
- 注入位置: `paragraphsEn` 块之后
- 逐条 record 翻译 + 写入（现有脚本已是这个模式）

### 预估时间（300s 超时）

| 文件 | 段落 | 缓存命中 | 实际要翻 | 预估 |
|------|------|---------|---------|------|
| video-transcripts | ~1200 剩余 | ~300 已缓存 | ~900 | 30-60 min |
| debate-transcripts | ~24196 | 0 | ~24196 | 4-8 hours |

debate-transcripts 是大头。24000 段落按 batch size 15、每 batch 2 分钟算 ≈ 3200 batch ÷ 2 并发 ≈ ~53 小时。但实际上：
- 辩论段落比视频短（每段 2-5 句 vs 视频的 10-20 句）
- batch size 15 不会超时（段落短）
- 预计 4-8 小时

### 可靠性保证

1. **逐条写入**：每条 record 翻完立即 `writeFileSync` 回 .ts 文件
2. **sha256 缓存**：段落级缓存，重启不重翻
3. **幂等**：已有 `paragraphsKo` 的 record 自动跳过
4. **超时兜底**：300s timeout + batch fallback + 4 次重试
5. **CI 不阻塞**：type 定义和 getter 已在 PR 里修好，翻译是渐进增量

### 验证

```bash
# 翻译完成后验证
npm run check                    # CI 全套
npm run fix:prettier             # 格式化
grep -c 'paragraphsKo:' src/data/video-transcripts.ts    # 应 = 62
grep -c 'paragraphsKo:' src/data/debate-transcripts.ts   # 应 = 153
```
