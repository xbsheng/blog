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
    expressiveCode(),
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
