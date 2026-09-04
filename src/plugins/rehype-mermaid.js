/**
 * 把 ```mermaid 代码块转换为 <div class="mermaid">，由客户端脚本按主题渲染。
 * expressive-code 已通过 excludeLanguages 跳过 mermaid，因此这里拿到的是原始 pre>code。
 */
function textOf(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}

export function rehypeMermaid() {
  return (tree) => {
    const walk = (node) => {
      if (!node || !node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'element' && child.tagName === 'pre') {
          const code = child.children.find((c) => c.type === 'element' && c.tagName === 'code');
          const cls = code?.properties?.className;
          if (Array.isArray(cls) && cls.includes('language-mermaid')) {
            const source = textOf(code).replace(/\n$/, '');
            node.children[i] = {
              type: 'element',
              tagName: 'div',
              properties: { className: ['mermaid'] },
              children: [{ type: 'text', value: source }],
            };
          }
          continue;
        }
        walk(child);
      }
    };
    walk(tree);
    return tree;
  };
}
