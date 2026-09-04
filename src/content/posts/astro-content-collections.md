---
title: Astro 内容集合实战：这个博客是怎么搭起来的
description: 从零搭一个「代码、图表、公式、搜索」都能打的静态博客：内容集合、Expressive Code、Mermaid、KaTeX、Pagefind 与双主题的完整方案。
pubDate: 2026-08-20
updatedDate: 2026-09-05
tags: [Astro, 前端工程化]
---

市面上静态博客框架很多，我最后选了 Astro，理由只有一个：
**默认输出零 JavaScript 的静态 HTML，需要交互的地方再按需水合**。
对以阅读为主的博客来说，这是最克制的架构。这篇文章记录搭建本站的完整思路，
包括几个网上资料较少的整合点：Mermaid 图表构建期预处理、双主题代码高亮联动、
以及无后端的全文搜索。

## 内容集合：让 Markdown 有类型

Astro 的 Content Layer API 用 `glob` loader 把 `src/content/posts/` 下的
Markdown 文件变成一个可查询的集合，frontmatter 用 zod 校验——字段写错直接在构建期报错，
而不是上线后布局悄悄崩掉。

```ts title="src/content.config.ts"
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

之后在页面里就是标准的查询流程，阅读时长这类派生数据在渲染时即时计算：

```astro title="src/pages/posts/[id].astro" ins={2}
---
const { Content, headings } = await render(post);
---

<Content />
```

> [!NOTE]
> `render()` 返回的 `headings` 自带层级和锚点 slug，本站的侧边目录就是用它生成的，
> 不需要再引入 rehype-slug。

## 代码块：Expressive Code

代码块是这个博客的主角，我用了 `astro-expressive-code`（底层是 Shiki），
它带来了三个关键能力：

1. **One Dark 主题**：代码块固定使用 One Dark，在明暗两种页面主题下都以深色卡片呈现——
   浅色页面上的深色代码卡对比清晰，代码的可读性永远在线；
2. **标记行**：`ins={}` / `del={}` / `mark={}` 直接写在代码块围栏里，讲 diff 时是刚需；
3. **标题栏与复制按钮**：`title="foo.ts"` 显示文件名，右上角一键复制。

```js title="astro.config.mjs" ins={4}
export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ['one-dark-pro'],
    }),
  ],
});
```

只配一个主题时，EC 会直接把它应用到所有代码块，不需要任何选择器联动。
如果你更希望代码块跟随页面主题换肤，改配 `themes: [浅色, 深色]` 加
`themeCssSelector`（把生成的选择器绑定到 `<html data-theme>` 上）即可。

## Mermaid：让图表像代码一样进版本库

架构图、流程图、时序图用 Mermaid 写，图表源码就在 Markdown 里，git 可追溯，
改起来和改代码一样。整合思路是一个十几行的 rehype 插件：把
` ```mermaid ` 代码块在构建期替换成 `<div class="mermaid">`，
客户端脚本再按当前主题调用 mermaid 渲染：

```ts title="src/plugins/rehype-mermaid.js" ins={8-11, 13-19}
function textOf(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}

export function rehypeMermaid() {
  return (tree) => {
    const walk = (node) => {
      if (!node || !node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'element' && child.tagName === 'pre') {
          const code = child.children.find((c) => c.type === 'element' && c.tagName === 'code');
          const cls = code?.properties?.className;
          if (Array.isArray(cls) && cls.includes('language-mermaid')) {
            const source = textOf(code).replace(/\n$/, '');
            node.children[i] = {
              type: 'element',
              tagName: 'div',
              properties: { className: ['mermaid'] },
              children: [{ type: 'text', value: source }],
            };
          }
          continue;
        }
        walk(child);
      }
    };
    walk(tree);
    return tree;
  };
}
```

两个坑值得记下来：

> [!IMPORTANT]
> Mermaid 代码块会先由自定义 rehype 插件转换为图表容器，随后才进入 Expressive Code 的处理流程，
> 因此不需要额外的语言排除配置。

> [!TIP]
> 客户端渲染时监听主题切换事件，用 `mermaid.render()` 对每个图表重新出图。
> mermaid 的 `initialize` 换主题不生效是已知行为，重建渲染器才是可靠做法。## 公式：remark-math + KaTeX

写 AI 内容离不开公式。接入只需要两行管线配置：

```js title="astro.config.mjs"
markdown: {
  remarkPlugins: [remarkMath],
  rehypePlugins: [[rehypeKatex, { throwOnError: false }]],
}
```

行内公式像 $\mathcal{O}(n \log n)$ 这样嵌进句子，块级公式独立成段：

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

`throwOnError: false` 值得加上：写错 LaTeX 时构建不至于失败，
页面会把原始公式显示出来，比一个神秘的白屏好排查得多。

## 搜索：Pagefind，无后端的全文检索

Pagefind 的方案很聪明：构建完成后扫描 `dist/` 里的静态 HTML，
生成按块切分的分词索引，搜索时按需分片加载——索引不进首屏，几百篇文章也不拖慢页面。

```json title="package.json" ins={4}
{
  "scripts": {
    "build": "astro build",
    "preview": "astro build && astro-pagefind && astro preview"
  }
}
```

配合 `astro-pagefind` 集成，开发环境会自动 mock 一个搜索界面，`pnpm dev` 阶段也能调试搜索页布局。

## 双主题：三个不闪烁的细节

深浅双主题要做得体面，关键是三件事：

1. **首帧前同步**：一段内联脚本在 HTML 解析阶段就读取 `localStorage` 和 `prefers-color-scheme`，
   把 `data-theme` 写到 `<html>` 上——绝不能等 JS 加载完再切；
2. **系统跟随 + 手动覆盖**：默认跟随系统，用户手动切换后写入 localStorage，优先级高于系统；
3. **切换的仪式感**：用 View Transitions API 从按钮位置做圆形揭示动画，
   `prefers-reduced-motion` 用户自动降级为直接切换。

```ts title="theme-toggle.ts" ins={2-3}
const stored = localStorage.getItem('theme');
const theme = stored ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.dataset.theme = theme;
```

> [!CAUTION]
> 内联主题脚本必须放在 `<head>` 里、所有 CSS 之前，并且用 `is:inline`
> 阻止 Astro 对它做打包处理，否则会有一个包在生产构建里延迟加载，造成首帧闪白。

## 小结

| 需求           | 方案                        | 成本             |
| -------------- | --------------------------- | ---------------- |
| 类型安全的内容 | Content Layer + zod         | 零运行时         |
| 代码高亮       | astro-expressive-code       | 按需             |
| 图表           | rehype-mermaid + 客户端渲染 | 仅含图文章页加载 |
| 公式           | remark-math + KaTeX         | 仅 CSS + 字体    |
| 搜索           | Pagefind                    | 构建期索引       |

最终整个站点的 JS 负载：文章页除图表外接近零，图篇文章按需多加载 mermaid 的分包。
这就是我理想中博客该有的样子——**内容的复杂度留给内容自己，站点本身越轻越好。**
