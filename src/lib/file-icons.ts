/**
 * vscode-icons 官方图标（内置于 ./file-icons/，来源：
 * https://github.com/vscode-icons/vscode-icons/tree/master/icons）。
 * 映射顺序：精确文件名 → 配置文件 → 扩展名 → 默认文档图标。
 */
import typescript from './file-icons/file_type_typescript.svg?raw';
import javascript from './file-icons/file_type_js.svg?raw';
import astro from './file-icons/file_type_astro.svg?raw';
import astroconfig from './file-icons/file_type_astroconfig.svg?raw';
import python from './file-icons/file_type_python.svg?raw';
import json from './file-icons/file_type_json.svg?raw';
import npm from './file-icons/file_type_npm.svg?raw';
import markdown from './file-icons/file_type_markdown.svg?raw';
import xml from './file-icons/file_type_xml.svg?raw';
import html from './file-icons/file_type_html.svg?raw';
import css from './file-icons/file_type_css.svg?raw';
import yaml from './file-icons/file_type_yaml.svg?raw';
import shell from './file-icons/file_type_shell.svg?raw';
import config from './file-icons/file_type_config.svg?raw';
import defaultFile from './file-icons/default_file.svg?raw';

const wrap = (svg: string) =>
  // 去掉官方 SVG 自带的 <title>（避免污染无障碍命名，文件名本身就是名称）
  `<span class="ec-file-icon" aria-hidden="true">${svg.replace(/<title>[\s\S]*?<\/title>/, '')}</span>`;

const BY_FILENAME: Record<string, string> = {
  'package.json': npm,
  'package-lock.json': npm,
};

const BY_EXT: Record<string, string> = {
  ts: typescript,
  tsx: typescript,
  js: javascript,
  mjs: javascript,
  cjs: javascript,
  astro: astro,
  py: python,
  json: json,
  md: markdown,
  markdown: markdown,
  xml: xml,
  html: html,
  htm: html,
  css: css,
  yaml: yaml,
  yml: yaml,
  sh: shell,
  bash: shell,
  zsh: shell,
};

export function fileIconSvg(filename: string): string {
  const base = filename.split('/').pop() ?? filename;
  const lower = base.toLowerCase();

  if (BY_FILENAME[lower]) return wrap(BY_FILENAME[lower]);

  // 通用配置文件：astro.config.* 用 Astro 专属图标，其余 *.config.* 用通用配置图标
  if (/\.config\./.test(lower)) {
    return wrap(lower.startsWith('astro.') ? astroconfig : config);
  }

  const ext = lower.includes('.') ? lower.slice(lower.lastIndexOf('.') + 1) : '';
  return wrap(BY_EXT[ext] ?? defaultFile);
}
