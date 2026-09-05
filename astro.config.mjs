// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import expressiveCode from 'astro-expressive-code';
import pagefind from 'astro-pagefind';
import sitemap from '@astrojs/sitemap';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { unified } from '@astrojs/markdown-remark';
import { rehypeCallouts } from './src/plugins/remark-callouts.js';
import { rehypeImageCaptions } from './src/plugins/rehype-image-captions.js';
import { rehypeMermaid } from './src/plugins/rehype-mermaid.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.quarkcode.cn',
  output: 'static',
  adapter: vercel(),
  image: {
    // 对 src/ 内的 Markdown 图片生成响应式尺寸，并注入适配容器的基础样式。
    layout: 'constrained',
    responsiveStyles: true,
  },
  integrations: [expressiveCode(), sitemap(), pagefind()],
  markdown: {
    processor: unified({
      gfm: true,
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeCallouts,
        rehypeImageCaptions,
        [rehypeKatex, { throwOnError: false }],
        rehypeMermaid,
      ],
    }),
    shikiConfig: {
      wrap: true,
    },
  },
});
