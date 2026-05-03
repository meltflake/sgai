# YouTube 视频采集脚本

从 YouTube 频道定期采集新加坡 AI 相关视频。

## 依赖安装

```bash
pip install requests feedparser
```

## 使用流程

### 1. 扫描频道发现新视频

```bash
# 扫描所有频道
python 01_scan_channels.py

# 只看最近 7 天
python 01_scan_channels.py --days 7

# 只扫描某个频道
python 01_scan_channels.py --channel CNA

# 排除 videos.ts 中已有的视频
python 01_scan_channels.py --exclude-existing

# 组合使用
python 01_scan_channels.py --days 30 --exclude-existing
```

输出: `data/candidates.json`

### 2. 审核并生成代码（双语 emit）

> ⚠️ 旧的 `02_review_and_merge.py` **已退役**（2026-05-03）。它输出单语种 snippet，违反 sgai 的 i18n 双字段硬规则，必须人工补 `*En`、人工写 ID、人工跑 prettier、人工开 PR。新脚本一行命令搞定全套。

```bash
# 入指定的若干条（按 candidates.json 里的 videoId）
npx tsx scripts/refresh/videos/emit.ts --ids=cRSlrDbcygw,dn1syFajWw0

# 入 candidates.json 里的全部
npx tsx scripts/refresh/videos/emit.ts --all

# Dry-run：生成预览但不写 videos.ts
npx tsx scripts/refresh/videos/emit.ts --ids=... --dry-run

# 写入但不 commit / 不 push
npx tsx scripts/refresh/videos/emit.ts --ids=... --no-commit
npx tsx scripts/refresh/videos/emit.ts --ids=... --no-push
```

新脚本会自动：

1. 从 candidates.json 按 `--ids` 筛选
2. 调用本地 `claude` CLI 生成 **中英双字段**（title/titleEn、summary/summaryEn、topic/topicEn、speakerTitle/speakerTitleEn），带 sha256 缓存
3. 标准化已知 speaker（Lawrence Wong → 总理 / AI Singapore → academic / CNA → industry 等，见 `SPEAKER_REGISTRY`）
4. 用 `yt-dlp` 抓 duration
5. 从现有 `videos.ts` 读最大 `vNNN` ID 自动分配下一个
6. splice 进 `videos.ts` 数组顶部
7. 跑 `prettier --write` + `findUnpairedFields()` 源码级 i18n 校验
8. 自动开新分支 commit + push + `gh pr create`

要新增/修改 known speaker 标准化规则，编辑 `scripts/refresh/videos/emit.ts` 的 `SPEAKER_REGISTRY`。

### 4. 抓取字幕、翻译并生成 transcript 数据

详情页 `/videos/[id]/` 会读取 `src/data/video-transcripts.ts`。该文件由脚本生成，原始 VTT / JSON 缓存在 `scripts/videos/data/transcripts/`（已 gitignore）。

```bash
# 抓取全部视频字幕，并用已有翻译缓存重建 src/data/video-transcripts.ts
npm run fetch:video-transcripts

# 只抓前 5 条，方便测试
npm run fetch:video-transcripts -- --limit=5

# 只抓指定视频
npm run fetch:video-transcripts -- --ids=v053,v054

# 强制重新抓取已有缓存
npm run fetch:video-transcripts -- --force

# 只根据缓存重建 src/data/video-transcripts.ts，不重新访问 YouTube
npm run fetch:video-transcripts -- --emit-only
```

抓到的 YouTube 字幕通常是英文。中文站点不能直接渲染英文 transcript，必须再跑翻译：

```bash
# 需要 OPENAI_API_KEY；默认模型可用 OPENAI_TRANSLATION_MODEL 覆盖
npm run translate:video-transcripts

# 测试前几条或指定条目
npm run translate:video-transcripts -- --limit=3
npm run translate:video-transcripts -- --ids=v053,v054

# 强制重翻已有缓存
npm run translate:video-transcripts -- --force

# 检查所有有英文字幕的记录都有中文默认 transcript
npm run check:video-transcripts
```

脚本依赖本机 `yt-dlp`，优先抓 `en` 字幕，再尝试 `zh-Hans` / `zh-Hant` / `zh`。不是每条 YouTube 视频都有可抓字幕；没有字幕的记录会保留在缓存 JSON，但不会写入页面数据。

输出数据遵守项目 i18n 约定：`paragraphs` 是默认中文 transcript，`paragraphsEn` 是英文 transcript。新增语言时继续按 `paragraphsJa`、`paragraphsKo` 这类兄弟字段扩展。

## 监控的频道

| 频道 | 类型 | 说明 |
|------|------|------|
| CNA | 本地媒体 | AI 政策新闻、部长采访 |
| The Straits Times | 本地媒体 | 深度采访、专题报道 |
| govsg | 政府官方 | 国会辩论、官方发布 |
| IMDA Singapore | 政府机构 | AI 治理、行业活动 |
| Smart Nation Singapore | 政府机构 | Smart Nation 相关 |
| AI Singapore | 研究机构 | AISG 官方活动 |
| MCI Singapore | 政府机构 | 通讯及新闻部 |
| World Economic Forum | 国际组织 | 新加坡相关发言（二次过滤） |
| Bloomberg Television | 国际媒体 | 新加坡相关报道（二次过滤） |

### 添加新频道

编辑 `01_scan_channels.py` 中的 `CHANNELS` 字典，添加频道 ID。

获取频道 ID: 访问频道页面 → 查看页面源代码 → 搜索 `channelId`。

## 定期更新建议

每周自动跑（cron）：

```bash
python3 scripts/auto_update.py --only=videos
```

入口流程：扫描 → 写 `candidates.json` → 开 GitHub issue 通知 Luca。Luca review 后手动跑：

```bash
npx tsx scripts/refresh/videos/emit.ts --ids=<挑选的 videoIds>
```

emit 会自动开 PR，merge 即上线。

RSS feed 每频道最多返回 15 条最新视频，适合周更频率。

### 频道相关性策略

- **纯 SG 政府/机构频道**（govsg / SmartNation / AISG）：豁免 SG 关键词二次过滤，所有 AI 关键词命中条目都进 candidates。
- **本地媒体**（CNA / ST）：会发全球 AI 新闻（如 Iran 战争、香港机器人 Sophia），命中 AI 关键词但与新加坡 AI 战略无关。所以 CNA / ST **必须**走 SG 关键词二次过滤。
- **国际频道**（WEF / Bloomberg）：同样必须走 SG 二次过滤。

`LOCAL_CHANNELS` 在 `01_scan_channels.py` 控制谁豁免 SG 过滤。新加纯 SG 政府/研究机构频道时记得把 channel key 加进 `LOCAL_CHANNELS`。
