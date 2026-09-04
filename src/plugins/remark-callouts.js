/**
 * GitHub 风格提示框：把 `> [!NOTE]` 等 blockquote 转换为带图标与标题的 div 结构。
 * 支持 NOTE / TIP / IMPORTANT / WARNING / CAUTION。
 */
const CALLOUT_TYPES = {
  NOTE: { label: '注', icon: 'info' },
  TIP: { label: '提示', icon: 'lightbulb' },
  IMPORTANT: { label: '重要', icon: 'message' },
  WARNING: { label: '注意', icon: 'triangle' },
  CAUTION: { label: '警告', icon: 'octagon' },
};

/** 统一的 24px 描边图标（lucide 风格，stroke 由 CSS 控制颜色） */
const ICON_PATHS = {
  info: [
    { tagName: 'circle', properties: { cx: 12, cy: 12, r: 10 } },
    { tagName: 'path', properties: { d: 'M12 16v-4' } },
    { tagName: 'path', properties: { d: 'M12 8h.01' } },
  ],
  lightbulb: [
    { tagName: 'path', properties: { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' } },
    { tagName: 'path', properties: { d: 'M9 18h6' } },
    { tagName: 'path', properties: { d: 'M10 22h4' } },
  ],
  message: [
    { tagName: 'path', properties: { d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' } },
    { tagName: 'path', properties: { d: 'M12 8v4' } },
    { tagName: 'path', properties: { d: 'M12 16h.01' } },
  ],
  triangle: [
    { tagName: 'path', properties: { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' } },
    { tagName: 'path', properties: { d: 'M12 9v4' } },
    { tagName: 'path', properties: { d: 'M12 17h.01' } },
  ],
  octagon: [
    { tagName: 'path', properties: { d: 'M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z' } },
    { tagName: 'path', properties: { d: 'M12 8v4' } },
    { tagName: 'path', properties: { d: 'M12 16h.01' } },
  ],
};

function iconNode(name) {
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      className: ['callout-icon'],
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': 'true',
    },
    children: ICON_PATHS[name].map((p) => ({ type: 'element', tagName: p.tagName, properties: p.properties, children: [] })),
  };
}

/** 收集 hast 节点内的纯文本 */
function textOf(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}

function tryConvert(bq) {
  if (bq.type !== 'element' || bq.tagName !== 'blockquote') return null;
  const firstPara = bq.children.find((c) => c.type === 'element' && c.tagName === 'p');
  if (!firstPara) return null;
  const firstText = firstPara.children.find((c) => c.type === 'text');
  if (!firstText) return null;
  const match = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:\n|$)/.exec(firstText.value);
  if (!match) return null;

  const meta = CALLOUT_TYPES[match[1]];
  firstText.value = firstText.value.replace(match[0], '');
  if (firstText.value.trim() === '') {
    firstPara.children = firstPara.children.filter((c) => c !== firstText);
    // 标记独占一行时首段可能为空，直接移除
    if (firstPara.children.length === 0 || textOf(firstPara).trim() === '') {
      bq.children = bq.children.filter((c) => c !== firstPara);
    }
  }

  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['callout', `callout--${match[1].toLowerCase()}`] },
    children: [
      {
        type: 'element',
        tagName: 'p',
        properties: { className: ['callout-title'] },
        children: [iconNode(meta.icon), { type: 'text', value: meta.label }],
      },
      ...bq.children,
    ],
  };
}

export function rehypeCallouts() {
  return (tree) => {
    const walk = (node) => {
      if (!node || !node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const converted = tryConvert(node.children[i]);
        if (converted) node.children[i] = converted;
      }
      node.children.forEach(walk);
    };
    walk(tree);
    return tree;
  };
}
