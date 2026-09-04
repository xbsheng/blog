// @ts-check
import { defineEcConfig } from 'astro-expressive-code';

/**
 * Expressive Code 独立配置：
 * 使用 <Code> 组件的页面（如首页 hero）要求配置可序列化地放在这个文件里，
 * astro.config.mjs 中的 expressiveCode() 会自动读取它。
 *
 * 注意：修改本文件后需要删除 node_modules/.astro 再构建——
 * Astro 内容层会复用其中缓存的渲染结果，旧主题色不会自动刷新。
 */
export default defineEcConfig({
  // 代码块固定使用 One Dark：明暗两种页面主题下都以深色卡片呈现
  themes: ['one-dark-pro'],
  styleOverrides: {
    borderRadius: '10px',
    borderWidth: '1px',
    borderColor: '#21252b',
    uiFontFamily: 'var(--font-sans)',
    uiFontSize: '0.75rem',
    uiFontWeight: '500',
    codeFontFamily: "'JetBrains Mono Variable', ui-monospace, Menlo, Consolas, monospace",
    codeFontSize: '0.875rem',
    codeLineHeight: '1.7',
  },
});
