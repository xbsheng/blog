import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 格式化日期为 YYYY-MM-DD */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 估算阅读时长：中文按字数 / 350 字每分钟，英文按词数 / 220 词每分钟。
 * 代码块与行内代码只按一半权重计入。
 */
export function readingTime(text: string): { minutes: number; words: number } {
  const withoutCode = text
    .replace(/```[\s\S]*?```/g, (m) => m.slice(Math.floor(m.length / 2)))
    .replace(/`[^`]*`/g, (m) => m.slice(Math.floor(m.length / 2)));
  const cjk = (withoutCode.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) ?? []).length;
  const latin = (
    withoutCode.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, ' ').match(/[a-zA-Z][a-zA-Z0-9'-]*/g) ?? []
  ).length;
  const words = cjk + latin;
  const minutes = Math.max(1, Math.round(cjk / 350 + latin / 220));
  return { minutes, words };
}

export function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** 开发环境显示草稿，生产环境过滤掉 */
export function published(posts: Post[]): Post[] {
  if (import.meta.env.DEV) return posts;
  return posts.filter((p) => !p.data.draft);
}

export function getAllTags(posts: Post[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const post of published(posts)) {
    for (const tag of post.data.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh')));
}

/** 按年份分组（列表已按日期倒序） */
export function groupByYear(posts: Post[]): [string, Post[]][] {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const year = String(post.data.pubDate.getFullYear());
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(post);
  }
  return [...groups.entries()];
}
