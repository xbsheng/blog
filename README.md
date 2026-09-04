# XBS 的技术博客

个人技术博客：分享编程、计算机科学与人工智能相关内容。基于 [Astro](https://astro.build) 静态构建，pnpm 管理依赖。

## 功能

- 📝 内容集合（Content Collections）管理 Markdown 文章，frontmatter 带类型校验
- 🎨 深浅双主题：跟随系统 + 手动切换（View Transitions 圆形揭示动画），无首屏闪烁
- 💻 代码块：Expressive Code（Shiki）双主题语法高亮、行高亮（`ins`/`del`/`mark`）、文件标题、一键复制
- 📊 Mermaid 图表：` ```mermaid ` 代码块自动渲染，跟随主题重绘
- 🧮 KaTeX 数学公式：行内 `$...$` 与块级 `$$...$$`
- 🔍 Pagefind 全文搜索（构建期索引，无后端）
- 📡 RSS 订阅 + Sitemap
- 💬 giscus 评论（基于 GitHub Discussions，需配置）
- 🏷️ 标签系统、归档、目录（TOC）、阅读时长

## 常用命令

| 命令 | 说明 |
| ---- | ---- |
| `pnpm dev` | 本地开发（自动显示草稿文章） |
| `pnpm build` | 构建到 `dist/`（自动过滤草稿、生成搜索索引） |
| `pnpm preview` | 本地预览构建产物 |

## 如何写文章

在 `src/content/posts/` 新建一个 `.md` 文件：

```md
---
title: 文章标题
description: 一句话摘要（列表与 SEO 使用）
pubDate: 2026-09-03
updatedDate: 2026-09-03   # 可选
tags: [标签A, 标签B]
draft: true               # 可选：草稿只在 dev 可见
---

正文……
```

文件名（去掉扩展名）即文章 URL：`hello-world.md` → `/posts/hello-world/`。

## 上线前必须改的配置

| 内容 | 位置 |
| ---- | ---- |
| 站名、作者、简介、社交链接 | `src/config.ts` |
| giscus 评论（到 [giscus.app](https://giscus.app) 生成） | `src/config.ts` 的 `giscus` 字段 |
| 正式域名（RSS / sitemap 依赖） | `astro.config.mjs` 的 `site` 与 `src/config.ts` 的 `url` |
| 关于页 | `src/pages/about.astro` |

## 技术栈

Astro 7 · astro-expressive-code · mermaid · KaTeX · Pagefind · @astrojs/rss · @astrojs/sitemap · astro-pagefind
