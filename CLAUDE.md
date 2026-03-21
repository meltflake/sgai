# CLAUDE.md — aisg 项目指南

## 项目概述

SG AI 观察 (https://github.com/meltflake/aisg) — 深度观察新加坡 AI 生态与战略的中文网站。
基于 Astro 5.0 + Tailwind CSS 的静态站点，部署于 Netlify。

## 技术栈

- **框架**: Astro 5.0 (静态站点生成)
- **样式**: Tailwind CSS
- **语言**: TypeScript + Astro
- **内容**: Markdown 博客文章 (`src/data/post/*.md`)，TypeScript 数据文件 (`src/data/*.ts`)
- **部署**: Netlify (自动部署 main 分支)

## CI 管线

```bash
npm run check  # = check:astro && check:eslint && check:prettier
```

三项检查全部通过才能合并。修复命令：

```bash
npm run fix           # 一键修复 eslint + prettier
npm run fix:eslint    # 仅修复 eslint
npm run fix:prettier  # 仅修复 prettier (prettier -w .)
```

**提交前必须运行 `npm run check` 确认通过。**

## 编码规范与常见陷阱

### 1. Astro 文件中的注释语法

在 `.astro` 文件的 JSX 表达式（如 `.map()` 回调、三元表达式）内部，**禁止使用 HTML 注释**：

❌ 错误 — HTML 注释在 JSX 表达式内会导致解析错误：

    {items.map((item) => (
      <!-- 这是注释 -->
      <div>{item.name}</div>
    ))}

✅ 正确 — 使用 JSX 注释语法：

    {items.map((item) => (
      {/* 这是注释 */}
      <div>{item.name}</div>
    ))}

> Astro 模板顶层可以用 HTML 注释 `<!-- -->`，但 JSX 表达式内部必须用 `{/* */}`。
> Prettier 解析 Astro 文件时会因此报 SyntaxError。

### 2. 不规则空白字符

数据文件（尤其是从外部来源复制的内容，如国会辩论记录）可能包含不规则空白字符：

- `\u00A0` (NBSP)、`\u3000` (全角空格)、`\u2003` (Em Space)、`\u200B` (零宽空格) 等

ESLint `no-irregular-whitespace` 规则会报错。**粘贴外部文本后，注意检查并替换为普通空格。**

### 3. 类型标注

禁止使用 `as any`（ESLint `@typescript-eslint/no-explicit-any`）。使用具体类型：

```typescript
// ❌ (c as any).relatedTopics as string[]
// ✅ (c as { relatedTopics: string[] }).relatedTopics
```

### 4. Prettier 格式化

项目使用 Prettier 统一格式。如果修改了多个文件，提交前运行：

```bash
npx prettier --write src/
```

## 项目结构

```
src/
├── components/widgets/   # Astro 组件
├── content/config.ts     # 内容集合配置 (博客文章 schema)
├── data/
│   ├── post/             # Markdown 博客文章
│   ├── stats.ts          # 首页统计数据和功能板块
│   ├── debates.ts        # 国会辩论数据
│   ├── policies.ts       # 政策文件数据
│   ├── timeline.ts       # 时间线数据
│   └── ...               # 其他数据文件
├── navigation.ts         # 导航菜单配置
├── version.ts            # 版本号和更新日期
├── pages/                # 页面路由
└── layouts/              # 布局组件
```

## 发布流程

1. 修改内容 / 代码
2. 运行 `npm run check` 确认通过
3. 更新 `src/version.ts` 中的版本号和日期
4. 提交并推送到 main 分支，Netlify 自动部署

## 内容管理

### 添加博客文章

在 `src/data/post/` 下创建 `.md` 文件，frontmatter 格式：

```yaml
---
publishDate: 2026-03-20
title: '文章标题'
excerpt: '摘要文字'
category: '深度分析'
tags:
  - 标签1
  - 标签2
author: 'SG AI 观察'
---
```

### 更新导航

- 头部/底部导航：`src/navigation.ts`
- 首页功能板块：`src/data/stats.ts`
