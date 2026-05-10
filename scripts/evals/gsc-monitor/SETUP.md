# GSC Monitor 设置指南

> **📦 状态：PARKED（2026-05-10）**
>
> 这个 eval 暂未启用——配置成本（GCP 项目 + service account + IAM）跟"每周省 5 分钟"的收益不成正比。code stub 留着，cron 已撤下。
>
> 哪天觉得"每周开 GSC 烦"，再照下面步骤花 15 分钟配置。


GSC monitor 拉 Google Search Console 的 indexing / rich-results 错误，比对上一次快照，新增即开 GitHub issue。今天靠 Luca 人肉读 GSC 邮件——这块自动化能消除一类盲区（CLAUDE.md 已知盲区第 1 条）。

## 一次性设置（约 15 分钟）

### 1. 准备 Google Cloud 项目

如果还没有 GCP 项目，新建一个（免费层够用，不会触发计费）：

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

### 5. 装 googleapis SDK

```bash
npm install --save-dev googleapis
```

### 6. 把 stub 替换成真实实现

打开 [scripts/evals/gsc-monitor/check.ts](check.ts)，找到 `fetchGscIssues()` 函数（搜 "STUB"），把抛错那段换成：

```typescript
async function fetchGscIssues(property: string, since: string): Promise<GscIssue[]> {
  const { google } = await import('googleapis');
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GSC_SERVICE_ACCOUNT_JSON,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const webmasters = google.webmasters({ version: 'v3', auth });

  // Pull last-7-days search analytics by page+query (use this as a tracer
  // for indexing health — pages with sudden 0 impressions hint at indexing
  // drops). For richer indexing/rich-results errors, also poll
  // urlInspection per URL and aggregate.
  const resp = await webmasters.searchanalytics.query({
    siteUrl: property,
    requestBody: {
      startDate: since,
      endDate: new Date().toISOString().slice(0, 10),
      dimensions: ['page'],
      rowLimit: 5000,
    },
  });

  const rows = resp.data.rows ?? [];
  // TODO: cross-check rows with previous snapshot — pages that disappeared
  //       are likely deindexed → flag as 'IndexingDrop' issues.
  //       For now just return empty (wiring placeholder).
  void rows;
  return [];
}
```

### 7. 测试

```bash
npx tsx scripts/evals/gsc-monitor/check.ts
```

第一次跑会写 `state/last-snapshot.json`。第二次起会比对快照、报新增 / 已解决 issue。

### 8. 接进 cron

`scripts/refresh/registry.json` 已经有 entry（详见主 README），失败时 `gh issue create --assignee @me` 自动开 issue。

## 已知限制

- **API 配额**：免费层 1200 queries/min（够用）
- **时间精度**：GSC 数据延迟 ~2 天，weekly cron 拉的是 7 天前的快照
- **服务账号需在 GSC 显式授权**：第一次运行报 `403 User does not have permission` 时检查第 3 步

## 删除凭据

如果想撤销访问：

```bash
gcloud iam service-accounts keys list --iam-account sgai-gsc-reader@sgai-gsc-monitor.iam.gserviceaccount.com
gcloud iam service-accounts keys delete <KEY_ID> --iam-account sgai-gsc-reader@sgai-gsc-monitor.iam.gserviceaccount.com
```

并在 GSC 删除该 user。
