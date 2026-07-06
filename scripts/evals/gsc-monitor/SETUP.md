# GSC Monitor 设置指南

> **✅ 状态：已实现（2026-07-06），等待凭据**
>
> Search Analytics API 客户端已内置（service-account JWT 自签,**零 npm 依赖**）。
> 只差你按下面步骤配一次凭据（约 15 分钟）。没有凭据时 eval 打印本指引并
> exit 0（skip 不 fail），weekly cron 已接回 `scripts/evals/run-all.ts`。

## 它做什么

每周拉 GSC Search Analytics 近 28 天数据（query + page 两个维度），跑三个检测器（阈值来自 2026-07 SEO 数据复盘）：

1. **striking-distance** — 排名 8–15、曝光 ≥50 的查询清单 + 周环比位次变化（"差一脚上首页"的词）
2. **ctr-anomaly** — 排名 ≤8、曝光 ≥200 但 CTR <1% 的页面（排名没问题、摘要不行,该改 title/description）
3. **zh-recovery** — `/zh/` 页面的曝光加权平均排名（2026-05-05 路由迁移后中文区从零重建,基线 ~28）

**退出语义**（issue-on-fail cron 用）：只有**周环比恶化**才 exit 1 开 issue——已跟踪的 striking 词掉 >5 位、全站 CTR 腰斩、`/zh/` 平均位次恶化 >5。清单长本身是机会不是故障。报告每次都写到 `reports/report-YYYYMMDD.md`。

## 一次性设置（约 15 分钟）

### 1. 准备 Google Cloud 项目

```bash
gcloud projects create sgai-gsc-monitor --name "sgai GSC monitor"
gcloud config set project sgai-gsc-monitor
gcloud services enable searchconsole.googleapis.com
```

### 2. 创建 service account

```bash
gcloud iam service-accounts create sgai-gsc-reader \
  --display-name "sgai GSC reader" \
  --description "Read-only access to Google Search Console for sgai.md"

# 下载 JSON key 到 ~/sgai-gsc.json
gcloud iam service-accounts keys create ~/sgai-gsc.json \
  --iam-account sgai-gsc-reader@sgai-gsc-monitor.iam.gserviceaccount.com

chmod 600 ~/sgai-gsc.json
```

### 3. 在 GSC 里把 service account 加为 user

打开 https://search.google.com/search-console → 选 sgai.md property → 左下 Settings → Users and permissions → Add user → 输入 service account email：

```
sgai-gsc-reader@sgai-gsc-monitor.iam.gserviceaccount.com
```

权限选 **Restricted**（只读够用，不需要 Owner）。

### 4. 配置环境变量

加到 `~/.zshrc`（或项目 `.env.local`）：

```bash
export GSC_SERVICE_ACCOUNT_JSON="$HOME/sgai-gsc.json"
export GSC_PROPERTY_URL="sc-domain:sgai.md"
```

`GSC_PROPERTY_URL` 取决于你在 GSC 注册的是 domain property 还是 URL prefix property：

- **Domain property**（推荐，覆盖所有子域）：`sc-domain:sgai.md`
- **URL prefix property**：`https://sgai.md/`（注意尾斜杠）

> 注：只实现了 service-account 路径。早期草稿提过的 `GSC_OAUTH_REFRESH_TOKEN`
> OAuth 流程**没有**实现（还需要 client_id/secret,配置反而更麻烦）。

### 5. 测试

```bash
npm run eval:gsc              # 或 npx tsx scripts/evals/gsc-monitor/check.ts
npm run eval:gsc -- --window=7 --no-snapshot   # 短窗口试跑,不动快照
```

第一次跑会写 `state/last-snapshot.json`（此时无环比,不会 fail）。第二次起会对比快照,报告位次变化。

### 6. cron

`scripts/evals/run-all.ts` 的 weekly STAGES 已包含 `gsc-monitor`,由 registry 的 evals entry（`mode: issue-on-fail`）调度——恶化时 `gh issue create --assignee @me` 自动开 issue。

## 已知限制

- **API 配额**：免费层 1200 queries/min,每次跑只发 2 个请求,够用
- **数据延迟**：GSC 数据滞后 2-3 天,窗口自动截到 3 天前保证数字定型（`dataState: 'final'`）
- **rowLimit 5000**：当前站点量级足够;曝光行数超过后需要翻页（`startRow`）
- **服务账号需在 GSC 显式授权**：报 `403 User does not have permission` 时检查第 3 步

## 删除凭据

```bash
gcloud iam service-accounts keys list --iam-account sgai-gsc-reader@sgai-gsc-monitor.iam.gserviceaccount.com
gcloud iam service-accounts keys delete <KEY_ID> --iam-account sgai-gsc-reader@sgai-gsc-monitor.iam.gserviceaccount.com
```

并在 GSC 删除该 user。
