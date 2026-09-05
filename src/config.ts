/**
 * 站点全局配置：改这一处即可更新站名、简介、社交链接与 giscus 评论信息。
 */
export const SITE = {
  /** 站点名称 */
  title: 'Blog',
  /** 站点一句话简介 */
  description: '分享编程、计算机科学与人工智能的学习笔记与实践思考。',
  /** 部署域名，需与 astro.config.mjs 中的 site 保持一致 */
  url: 'https://www.quarkcode.cn',
  /** 页脚每行文字 */
  footerNote: '© {year} · Powered by Astro · RSS',
  social: {
    github: 'https://github.com/xbsheng',
    email: 'mailto:xxbsheng@gmail.com',
  },
  /**
   * giscus 评论配置（占位）：
   * 到 https://giscus.app 生成后，把 repo / repoId / category / categoryId 四个值填进来，
   * 填好前文章页会显示配置引导而不是评论框。
   */
  giscus: {
    repo: '',
    repoId: '',
    category: '',
    categoryId: '',
    mapping: 'pathname',
    reactionsEnabled: '1',
  },
};

export const NAV_ITEMS = [
  { text: '首页', href: '/' },
  { text: '归档', href: '/archive/' },
  { text: '标签', href: '/tags/' },
  { text: '关于', href: '/about/' },
];
