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
import { rehypeMermaid } from './src/plugins/rehype-mermaid.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.quarkcode.cn',
  output: 'static',
  adapter: vercel(),
  integrations: [expressiveCode(), sitemap(), pagefind()],
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
