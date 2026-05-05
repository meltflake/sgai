# sgai.md 全球化路由迁移规划

> 日期：2026-05-05
> 状态：讨论稿，不执行
> 背景：sgai.md 刚建立，长期目标是全球化研究站。当前路由是中文根路径 `/` + 英文 `/en/`，需要讨论是否迁移为英文根路径 `/` + 中文 `/zh/`，并为未来更多语言预留结构。

## 1. 目标

把 sgai.md 从“中文默认 + 英文 `/en/`”调整为“英文全球默认 + 中文 `/zh/`”，为后续 `ja / ko / id / fr` 等语言扩展打干净基础。

核心目标：

- `/` 作为全球入口，使用英文。
- `/zh/` 作为中文版本入口。
- `/en/...` 作为历史英文路径，301 到无前缀英文路径。
- 不做语言选择首页，避免浪费首页 SEO 权重。
- 移除浏览器语言强跳，改成“路径优先 + 用户选择优先”。
- 保留中文作为一等语言，不降级，只是从 root 迁移到 `/zh/`。

## 2. 核心判断

如果 sgai.md 的长期定位是全球化研究站，英文 root 更合理。

理由：

- 新加坡 AI 的一手资料、政策文件、机构页面和国际读者语境主要是英文。
- 英文 root 更符合全球搜索、媒体引用、机构传播和 LLM 抓取习惯。
- 站点刚建立，现在迁移成本最低；越晚迁移，外链、索引、引用、Pagefind 和 `llms-full.txt` 都会更难处理。
- 中文仍然重要，但应该变成一个明确 locale：`/zh/`。

不建议保留浏览器语言自动强跳，因为浏览器语言只是环境信号，不等于用户意图。访问路径应该是最高优先级。

## 3. 目标路由

| 内容 | 当前 | 目标 |
| --- | --- | --- |
| 英文首页 | `/en/` | `/` |
| 中文首页 | `/` | `/zh/` |
| 英文政策库 | `/en/policies/` | `/policies/` |
| 中文政策库 | `/policies/` | `/zh/policies/` |
| 英文文章 | `/en/<slug>/` | `/<slug>/` |
| 中文文章 | `/<slug>/` | `/zh/<slug>/` |
| 英文 RSS | `/en/rss.xml` | `/rss.xml` |
| 中文 RSS | `/rss.xml` | `/zh/rss.xml` |
| 英文 LLM index | `/llms.txt` | `/llms.txt` |
| 中文 LLM index | 无单独版本 | 可选 `/zh/llms.txt` |

## 4. 架构原则

> **修订（2026-05-05）**：原方案建议"双常量"（`ROUTE_DEFAULT_LOCALE` + `CONTENT_BASE_LOCALE`）。经核对代码，这是过度设计——i18n core 已经把"路由前缀"（`localizedHref`）和"字段读取"（`pickLocalized`）解耦了。
>
> 真正卡住的是数据契约不统一：[policies.ts](../src/data/policies.ts) 是"裸字段中文 + `*En` 兄弟"，但 [debates.ts](../src/data/debates.ts) 反过来（`title` 英 / `zhTitle` 中），[people.ts](../src/data/people.ts) 又是中英并存（`name` / `zhName`）。
>
> 修订后的最小动作：
>
> 1. 先把 debates / people 字段重命名向 policies 看齐（`zhTitle` → `title`、`title` → `titleEn`），跑 codemod + i18n-pair 验证。
> 2. 然后把 [src/i18n/index.ts](../src/i18n/index.ts) 的 `DEFAULT_LOCALE` 从 `'zh'` 翻为 `'en'`，单测 + 全站构建跑通。
>
> 不需要新增常量。i18n core 注释里的多语言扩展工作流（`siblingSuffix` / `FALLBACK_CHAINS`）已经支持 N 语言。

新的读取逻辑应该是：

- `getLangFromPath('/zh/policies/') -> 'zh'`
- `getLangFromPath('/policies/') -> 'en'`
- `localizedHref('/policies/', 'en') -> '/policies/'`
- `localizedHref('/policies/', 'zh') -> '/zh/policies/'`
- `pickLocalized(record, 'title', 'zh') -> record.title`
- `pickLocalized(record, 'title', 'en') -> record.titleEn || fallback`

## 5. 实施范围

### 5.1 i18n Core

涉及：

- `src/i18n/index.ts`
- `src/components/common/CommonMeta.astro`
- `src/components/common/LanguageToggle.astro`
- `src/components/common/LangBanner.astro`
- `src/components/common/SearchModal.astro`
- `src/components/common/Breadcrumb.astro`

需要调整：

- 新增 `ROUTE_DEFAULT_LOCALE` 与 `CONTENT_BASE_LOCALE`。
- `getLangFromPath()` 改为无前缀路径识别为 `en`。
- `localePrefix('en')` 返回空字符串。
- `localePrefix('zh')` 返回 `/zh`。
- `localizedHref()` 改为支持英文 root。
- `unprefixed()` 需要改名或重写，因为“去掉语言前缀”不再等于“中文默认路径”。
- `CommonMeta.astro` 的 hreflang 改为英文 root + 中文 `/zh/`。
- `LanguageToggle` 从 `/foo/` 切到 `/zh/foo/`，从 `/zh/foo/` 切回 `/foo/`。
- `LangBanner` 不再自动跳转，只做轻提示。

### 5.2 Pages

需要重排页面文件：

- 当前 `src/pages/en/**` 迁到无前缀 root。
- 当前中文 `src/pages/**` 迁到 `src/pages/zh/**`。
- 共享组件保持不变，继续通过 `lang` prop 渲染不同语言。
- 所有 hardcoded `/en/` 链接要改成 `localizedHref()` 或新的语言路径工具。

注意：很多页面仍然有手写 `/en/...`，不能只依赖全局 helper。

### 5.3 Blog

涉及：

- `src/utils/blog.ts`
- `src/pages/[...blog]/**`
- `src/pages/en/blog/[...page].astro`
- `src/data/post/*.md`
- `src/data/post/en/*.md`

目标：

- 英文文章输出到 `/<slug>/`。
- 中文文章输出到 `/zh/<slug>/`。
- 英文 blog list 输出到 `/blog/`。
- 中文 blog list 输出到 `/zh/blog/`。
- 分类和标签需要重新评估是否继续 index。建议保留但 noindex，避免薄页污染。

### 5.4 RSS

目标：

- `/rss.xml` 输出英文 feed。
- `/zh/rss.xml` 输出中文 feed。
- 旧 `/en/rss.xml` 301 到 `/rss.xml`。

### 5.5 Redirects

`public/_redirects` 增加：

```txt
/en/*  /:splat  301
/en/   /        301
```

保留：

```txt
/sitemap.xml  /sitemap-index.xml  301
```

> **修订（2026-05-05）**：明确"不做"老中文 root → `/zh/` 的批量 301。原因：旧中文 `/policies/` 迁移后会变英文路径，301 到 `/zh/policies/` 会和"英文新 root"互相抢占同一 URL。最干净的解法是：
>
> - 不做 301，让 hreflang + Search Console 提交新 sitemap 自然替换索引；
> - LangBanner 在中文用户访问英文 root 时显示"中文版可用"提示，不自动跳转；
> - 老中文 URL 短期内仍能命中英文新版（语义切换），可接受。

站点刚建立，外链和搜索沉淀有限，这次切换的代价最小。

### 5.6 Canonical / Hreflang

目标：

- 英文页面 canonical：`https://sgai.md/...`
- 中文页面 canonical：`https://sgai.md/zh/...`
- `hreflang="en"` 指向英文 root URL。
- `hreflang="zh-CN"` 指向 `/zh/...`。
- `hreflang="x-default"` 指向英文 root URL。

### 5.7 Sitemap / Robots / LLM

目标：

- sitemap 不再出现 `/en/` canonical。
- **新增**：sitemap 输出 `<xhtml:link rel="alternate" hreflang="...">` alternates，让搜索引擎把 `/foo/` 和 `/zh/foo/` 当成互译版本。配置点 [astro.config.ts](../astro.config.ts) 的 `@astrojs/sitemap`：

  ```ts
  sitemap({
    i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-CN' } },
  });
  ```

- `robots.txt` sitemap 地址不变。
- `/llms.txt` 以英文 root 为主。
- `/llms-full.txt` 列出英文 canonical 页面，并说明中文镜像路径。
- 可选新增 `/zh/llms.txt`，供中文 LLM / 搜索场景使用。

### 5.8 Pagefind

目标：

- 搜索识别 `/zh/` 为中文，其余无前缀为英文。
- 搜索 UI 根据当前路径语言渲染 placeholder。
- 如果 Pagefind index 太大，后续结合索引瘦身一起处理。

## 6. Language UX

新规则：

- 路径优先：访问 `/zh/...` 永远中文；访问 `/...` 永远英文。
- 用户主动点击语言切换后，才写入 `localStorage.sgai_lang`。
- 浏览器语言只用于轻提示，不自动改 URL。
- 如果用户浏览器是中文但访问英文 root，可显示“中文版可用”提示。
- 如果用户浏览器是英文但访问 `/zh/`，可显示“English version available”提示。
- 关闭提示后记录偏好，不再打扰。

不要做：

- 不要进入页面后静默 `location.replace()`。
- 不要因为 `navigator.language` 写入长期语言偏好。
- 不要在 `/` 做语言选择页。

## 7. 风险

### 7.1 旧中文无前缀 URL 被英文接管

这是最大风险。

例如当前 `/policies/` 是中文，迁移后会变成英文。旧中文用户可能短期困惑。

缓解方式：

- 站点刚建立，外链和搜索沉淀还少，尽早迁移。
- 中文入口明显放在 header。
- 首页 / about / docs 说明中文版本路径为 `/zh/`。
- Search Console 提交新 sitemap。

### 7.2 数据字段 fallback 错误

如果 `pickLocalized()` 改错，英文 root 可能显示中文字段。

缓解方式：

- 拆分 `ROUTE_DEFAULT_LOCALE` 和 `CONTENT_BASE_LOCALE`。
- 扩展 i18n-check，同时检查 root 英文页。
- 抽查政策、辩论、人物、视频、创业、对标详情页。

### 7.3 硬编码 `/en/` 残留

当前 `rg "/en/" src` 命中 **129 处**（Explore audit 2026-05-05），重灾区：

- `src/components/common/LanguageToggle.astro:55-61`（切换逻辑硬绑 `/en/`）
- `src/components/common/LangBanner.astro:73-77`（路径变换硬编码）
- 各页面手写 `/en/foo/` 链接

缓解方式：

- 用 `rg "/en/" src` 全量清理，预算估 1-2 个工作日。
- 共享组件统一走 `localizedHref()`。
- 页面 wrapper 中的 breadcrumbs 也要处理。
- LangBanner 自动跳转逻辑（`location.replace`）顺手移除，改成轻提示。

### 7.4 构建页数和索引体积继续膨胀

迁移本身不解决 Pagefind 大、低质量页面多的问题。

缓解方式：

- 与产品 / SEO 改进计划中的“索引瘦身”阶段并行规划，但分 PR 执行。

## 8. 验收清单

必须通过：

```bash
npm run check
npm run build
npm run check:i18n -- --lang en
npm run check:i18n -- --lang zh
```

手动检查：

- `/` 显示英文首页。
- `/zh/` 显示中文首页。
- `/policies/` 显示英文政策库。
- `/zh/policies/` 显示中文政策库。
- `/en/policies/` 301 到 `/policies/`。
- `/rss.xml` 是英文 feed。
- `/zh/rss.xml` 是中文 feed。
- 英文页面没有中文残留。
- 中文页面内部链接都带 `/zh/`，不会误跳英文。
- Language toggle 在首页、博客、政策详情、辩论详情、视频详情都能正确互跳。
- Sitemap 不再出现 `/en/` canonical。
- `llms.txt` 指向英文 root，并列出中文镜像说明。

## 9. 建议执行顺序

1. 新增路由 / 内容语言概念拆分，不迁页面。
2. 改 language helper 和 metadata / hreflang。
3. 迁首页、about、blog list 这类低风险页面。
4. 迁实体详情页：policies、debates、voices、videos、levers、legal-ai、startups、benchmarking。
5. 迁 RSS、llms、sitemap 相关输出。
6. 清理 `/en/` hardcoded links。
7. 加 redirects。
8. 全量构建和 i18n 检查。
9. 更新 `docs/i18n.md`、`CHANGELOG.md`、`src/version.ts`。

## 10. 暂不做

- 不新增第三语言。
- 不把数据裸字段从中文改成英文。
- 不重写内容 schema。
- 不同时做首页产品改版。
- 不同时清理人物 stub 和 Pagefind 噪音页。

