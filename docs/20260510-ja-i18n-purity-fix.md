# 2026-05-10 — 日文版 i18n 纯度根因修复 + Layer D/E 加固

## 背景

用户审计发现：日文版（`/ja/*`）页面里**大量保留中文 / 英文元素和内容**。例如 ja 视频详情页显示 "Speaker"、"Key Takeaways"、"In Brief" 等英文 chrome；ja ecosystem 页面显示 "Read more →" / "Visit X website"；ja Evolution / About / Timeline 页面整段英文 chrome（pageTitle / subtitle）。

### 现状评估

跑了一遍 Layer D（`scripts/i18n-check.mjs --lang ja`）—— 报告 0 残留。但视觉检查 ja 页面发现成百上千个英文残留。**eval 与现实严重脱节**。

进一步源码扫描发现：

- **35 个 `.astro` 模板文件、518 处 `lang === 'zh' ? '中' : 'EN'` / `isZh ? '中' : 'EN'` 二元三元**——ja 静默落到 EN 分支
- **3 个 `COPY` 字典（EvolutionPage / TimelinePage / AboutPage）只有 zh + en，缺 `ja:` key**——ja 整页 chrome 显示英文
- **`pickLocalized` 4 参数 shape B 实现 bug**：ja 永远拿 `enKey`，**完全不查 `*Ja` 字段**——50 处调用全部受影响。这是单点 root cause：所有数据 pipeline 已经认真填好的 `titleJa` / `descriptionJa` 都被这个函数静默丢掉，ja 用户看不到。
- **video transcripts / digest 没有 ja 翻译**：`getVideoDigest` 也只有 `digestEn || digest` fallback，没 ja
- Evolution 数据缺 `itemsJa`、Timeline 共享 `TAG_EN` map（ja tag 显示英文）

### 现有 eval 漏在哪

`scripts/i18n-check.mjs` 的 ja config 只检查 CJK 残留（简体专用字 tier 1）；**完全没有检查 ja 页面里的英文残留**。`Layer D` 委托它，所以也看不见。结果：上述 518 处 EN-on-JA 渲染对所有 eval 都是隐形的。

`scripts/lib/i18n-pair.ts` Layer A 在数据层只检查 `*Ja` 字段是否非空，不检查内容真的是日文（且检查靠的同一套 tier-1 简体专用字符 set，盲区相同）。

## 修复

### 1. 根因修：`pickLocalized` shape B（[src/i18n/index.ts:127-160](../src/i18n/index.ts:127)）

修复前 ja 走 `[ja, en, zh]` chain 时，`ja` 这一环没有 key 名给定，`if/else if` 全 miss，直接落到 enKey。

修复后：未给 jaKey 时，从 `zhKey` 自动推算 `${zhKey}${siblingSuffix('ja')}` = `${zhKey}Ja`。50 处 `pickLocalized(insight, 'title', 'titleEn', lang)` 类调用现在 ja 优先查 `insight.titleJa`，再 fallback。一行修复，受益面 50 处调用 + 上千条数据 record 的 ja 字段终于"上线"。

### 2. 根因修：Layer D 加 EN-residue 检测（[scripts/i18n-check.mjs](../scripts/i18n-check.mjs)）

ja config 增加 `enSentence` 句子级扫描：

- 拆 visible text 按句末标点
- 每句 ≥ 4 个英文 token AND 0 个 hiragana/katakana → flag 为 EN 残留
- allow-list：品牌名 / 政策 / 产品名（Smart Nation / AI Singapore / SEA-LION / NAIS 2.0 / GovTech / OpenAI / Anthropic / SkillsFuture 等）
- `data-i18n-allow-cjk` marker 同时也跳过 EN scan（语义统一为"允许任何外语 source 的块"）
- 新增 `data-i18n-allow-en="<reason>"` marker，专门用于 verbatim 英文段（视频字幕、政策原文）

### 3. 新加 Layer E：源码层 i18n 硬编码扫描（[scripts/evals/source-i18n-hardcode/check.ts](../scripts/evals/source-i18n-hardcode/check.ts)）

Layer A–D 看数据 + 构建产物，看不见 source template 的硬编码反模式。Layer E 直接扫源码：

- 抓四类反模式：`lang === 'zh' ?` / `lang === 'en' ?` / `isZh ?` / `isEn ?` 三元，且同行无 ja 分支
- 同文件 `COPY[lang] ?? COPY.en` 但 `COPY` 字典缺 `ja:` key → `copy-no-ja` 类
- 局部豁免：`// i18n-allow-hardcode <理由>` 写在被 flag 行紧上方
- baseline.json 存 grandfather 列表（本次 PR 落地时为 506 条；初次 snapshot 为 518，本次同步消化 12 处）；CI 任何"新增"即 hard-fail
- backlog 消化后 `--baseline` 重新 snapshot；baseline 只许变小，不许变大

CI gate 加到 `.github/workflows/actions.yaml` 的 `check` job：每个 PR 跑 `npm run eval:source-i18n`。

### 4. 修源头数据 + 高曝光页面

- **EvolutionPage**：`COPY` 加 `ja:` key；5 个 Phase 全部加 `titleJa` / `eventJa` / `descriptionJa` / `itemsJa`
- **TimelinePage**：`COPY` 加 `ja:`；新增 `TAG_JA` map（11 个 tag 全部翻译）；`tagText` 改为三语函数
- **AboutPage**：`COPY` 加 `ja:` 完整正文（约 25 段）
- **DebatesIndex.astro**（最高单点收益）：7 个 helper 函数（`debateTitle` / `debateSummary` / `debateSignal` / `debateQuote` / `debateKeyPoints` / `debateGovStance` / `debateOppStance`）原本是 `isEn ? *En : *zh` 二元，ja 走 isEn=true 拿英文。改为 `isJa ? *Ja || *En || zh : isEn ? *En : zh` 三元链。这一处影响 dist/ja/debates/index.html（之前 845 个 EN-residue hits）+ 所有 debates listing 区块。配套数据 debates.ts 已有齐全的 `summaryJa` / `policySignalJa` / `notableQuoteJa` / `keyPointsJa` / `governmentStanceJa` / `oppositionStanceJa`（582 个 *Ja 字段），现在终于上线。

- **voices/[id].astro**：`displayName` / `displayTitle` / `categoryLabels` 改用 `pickLocalized` + `t(lang, ...)`；3 个 stat label（`国会发言` / `主导政策` / `视频观点`）改用 dict key
- **video [id].astro**：`isZh ? '演讲者' : 'Speaker'` 等 6 处 chrome label 改 `t(lang, 'speaker')` 等；digest section / transcript section 加 `data-i18n-allow-en` marker（ja 翻译管线未上前先容忍）
- **video-transcripts.ts**：`VideoTranscript` 加 `digestJa?` 字段；`getVideoDigest` 三语 fallback `digestJa || digestEn || digest`
- **ecosystem/index.astro**：subtitle / readMore / visit / footnote 的 4 处 `lang === 'zh' ?` 三元改 `t()`
- **i18n/index.ts**：`zh / en / ja` 三个 dict 各加 11 个新 key（`videoSummary` / `videoFullTranscript` / `videoReadableTranscript` / `videoCaptionLanguage` / `videoFetched` / `ecosystemReadMore` / `ecosystemVisitWebsite` / `ecosystemSubtitle` / `ecosystemSourceFootnote` 等）

### 5. CI gate

`.github/workflows/actions.yaml` 的 `check` job 加：

```yaml
- name: Source i18n hardcode scan (no new findings beyond baseline)
  run: npm run eval:source-i18n
```

`scripts/evals/run-all.ts` 加 Layer E 到 STAGES（weekly cron 也跑）。`scripts/evals/README.md` 文档化 Layer E 设计 + 用法。

## 剩余 backlog

Layer E 的 baseline.json 列出当前 518 个 grandfathered hardcode，按文件分布：

| 文件                                      | hits |
| ----------------------------------------- | ---- |
| `pages/[lang]/ecosystem/[id].astro`       | 59   |
| `pages/[lang]/voices/index.astro`         | 27   |
| `pages/[lang]/startups/index.astro`       | 27   |
| `pages/[lang]/opensource/index.astro`     | 27   |
| `pages/[lang]/startups/[id].astro`        | 24   |
| `pages/[lang]/levers/[id].astro`          | 20   |
| `pages/[lang]/benchmarking/index.astro`   | 20   |
| `pages/[lang]/talent/[id].astro`          | 19   |
| `pages/[lang]/legal-ai/index.astro`       | 19   |
| `pages/[lang]/voices/[id].astro`          | 17   |
| `components/benchmarking/CaseProfile.astro`（部分行已三语） | 多个 |
| 其他 24 个文件                             | 240+ |

每个文件未来一两个 PR 内消化。修复套路：

- record-field 类（如 `isZh ? person.name : person.nameEn || person.name`）→ `pickLocalized(person, 'name', lang)`
- inline 文案类（如 `isZh ? '了解详情 →' : 'Read more →'`）→ 加 dict key + `t(lang, 'key')`
- 修完跑 `npm run eval:source-i18n -- --baseline` 重新 snapshot

### 已知 follow-up

- **video digest ja 翻译管线**：本次只标 `data-i18n-allow-en` 容忍，未来在 `scripts/refresh/video-digests/translate-ja.ts` 加翻译管线（用 `translateBatch` direction='zh→ja' 或 'en→ja'）；`digestJa` 写入后撤掉 marker
- **video transcript ja 翻译**：同理，可选；transcript 是 verbatim source（视频原本就英文），与其翻译不如保留
- **Layer A 也加 ja 内容真实性检查**：现有 SIMPLIFIED_ONLY tier 1 set 是有限集，对 `教育` / `开发者` 等简繁通用字盲。可加 tier 2：含 hiragana/katakana 占比检测，对纯 kanji 长串警告。但要小心日文确实有纯 kanji label。

## 影响

- **ja 用户体验**：50 处 `pickLocalized` 调用立即修复，所有数据 pipeline 已经填好的 `*Ja` 字段终于上线渲染
- **ja chrome 文案**：Evolution / Timeline / About / video chrome label / ecosystem index 等高曝光路径完整日文化
- **eval 真实性**：Layer D 现在能 catch EN-on-JA 残留（之前 0 报告，加 EN scan 后会报数千 true positive）
- **未来防御**：Layer E baseline 模式保证 PR 不能再引入新硬编码；518 backlog 逐步消化
- **CI**：PR `check` job 强制跑 Layer E

## 版本

`src/version.ts`：`0.15.1` → `0.16.0`（minor：新增 Layer E + i18n core bug fix）。
