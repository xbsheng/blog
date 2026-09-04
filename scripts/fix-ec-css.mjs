/**
 * 修复 astro-expressive-code 0.44 与 Astro 7 之间的 CSS 哈希错位：
 * 页面渲染阶段固化的样式链接哈希可能落后于最终产物文件名，
 * 导致 HTML 引用一个不存在的 ec.*.css（代码块样式全部丢失）。
 * 本脚本在构建后检查所有 HTML 引用，把不存在的 EC CSS 引用重写为实际产物。
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const astroDir = join(distDir, '_astro');

let cssFiles;
try {
  cssFiles = readdirSync(astroDir).filter((f) => /^ec\.[a-z0-9]+\.css$/.test(f));
} catch {
  console.log('[fix-ec-css] 未找到 dist/_astro，跳过');
  process.exit(0);
}

if (cssFiles.length === 0) {
  console.log('[fix-ec-css] 无 EC CSS 产物，跳过');
  process.exit(0);
}

let fixed = 0;
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
    } else if (entry.name.endsWith('.html')) {
      const src = readFileSync(p, 'utf8');
      const next = src.replace(/ec\.[a-z0-9]+\.css/g, (name) => {
        if (existsSync(join(astroDir, name))) return name;
        fixed++;
        return cssFiles[0];
      });
      if (next !== src) writeFileSync(p, next);
    }
  }
};
walk(distDir);

console.log(
  fixed > 0
    ? `[fix-ec-css] 修正了 ${fixed} 处 EC CSS 引用 → ${cssFiles[0]}`
    : '[fix-ec-css] EC CSS 引用一致，无需修正',
);
