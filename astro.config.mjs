// @ts-check
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import pagefind from 'astro-pagefind';
import sitemap from '@astrojs/sitemap';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { unified } from '@astrojs/markdown-remark';
import { rehypeCallouts } from './src/plugins/remark-callouts.js';
import { rehypeMermaid } from './src/plugins/rehype-mermaid.js';

// https://astro.build/config
export default defineConfig({
  // TODO: 部署时替换为你的正式域名（RSS / sitemap 依赖此配置）
  site: 'https://blog.example.com',
  // EC 的外部样式链接与最终产物哈希错位（EC 0.44 未适配 Astro 7），
  // 全量内联 CSS 绕过链接哈希问题
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    expressiveCode({
      // 双主题：与站点 data-theme 联动
      themes: ['vitesse-light', 'vitesse-dark'],
      themeCssSelector: (theme) =>
        theme.name.endsWith('-dark') ? '[data-theme="dark"]' : '[data-theme="light"]',
      // mermaid 代码块交给自定义图表渲染管线处理
      excludeLanguages: ['mermaid'],
      styleOverrides: {
        borderRadius: '10px',
        borderWidth: '1px',
        borderColor: 'var(--border-ec, var(--border))',
        uiFontFamily: 'var(--font-sans)',
        codeFontFamily: "'JetBrains Mono Variable', ui-monospace, Menlo, Consolas, monospace",
        codeFontSize: '0.875rem',
        codeLineHeight: '1.7',
        frames: {
          editorActiveTabIndicatorTopColor: 'transparent',
          editorActiveTabIndicatorBottomColor: 'transparent',
          editorTabBorderRadius: '0px',
        },
      },
    }),
    sitemap(),
    pagefind(),
  ],
  markdown: {
    processor: unified({
      gfm: true,
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeCallouts, [rehypeKatex, { throwOnError: false }], rehypeMermaid],
    }),
    shikiConfig: {
      wrap: true,
    },
  },
});
