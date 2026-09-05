/**
 * 将紧邻的 Markdown 图片和 :::caption 指令组合为带图片说明的语义化 figure。
 *
 * 写法：
 * ![替代文本](./文章-slug/example.webp)
 *
 * :::caption{size=80}
 * 图 1：图片说明
 * :::
 *
 * size 可选 70、80、100；省略时使用 100。
 */

function textOf(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}

function imageOfParagraph(node) {
  if (node.type !== 'element' || node.tagName !== 'p') return null;

  const meaningful = node.children.filter(
    (child) => child.type !== 'text' || child.value.trim() !== '',
  );
  return meaningful.length === 1 &&
    meaningful[0].type === 'element' &&
    meaningful[0].tagName === 'img'
    ? meaningful[0]
    : null;
}

function captionOfParagraph(node) {
  if (node.type !== 'element' || node.tagName !== 'p') return null;

  const source = textOf(node).trim();
  const match = /^:::caption(?:\{size=(70|80|100)\})?[ \t]*\n([\s\S]*?)\n:::$/.exec(source);
  if (!match) return null;

  // 指令的开始和结束标记都位于首尾文本节点中。只移除标记，保留
  // 链接、行内代码、强调等 Markdown 已解析出的子节点。
  const firstText = node.children.find((child) => child.type === 'text');
  if (firstText) {
    firstText.value = firstText.value.replace(/^:::caption(?:\{size=(70|80|100)\})?[ \t]*\n/, '');
  }

  const lastText = [...node.children].reverse().find((child) => child.type === 'text');
  if (lastText) lastText.value = lastText.value.replace(/\n:::\s*$/, '');

  return { size: match[1] ?? '100', children: node.children };
}

export function rehypeImageCaptions() {
  return (tree) => {
    const walk = (node) => {
      if (!node?.children) return;

      for (let i = 0; i < node.children.length - 1; i++) {
        const image = imageOfParagraph(node.children[i]);
        if (!image) continue;

        // Markdown 处理链可能会在相邻块之间保留纯换行文本节点。
        let captionIndex = i + 1;
        while (
          node.children[captionIndex]?.type === 'text' &&
          node.children[captionIndex].value.trim() === ''
        ) {
          captionIndex++;
        }
        const caption = captionOfParagraph(node.children[captionIndex]);
        if (!image || !caption) continue;

        node.children.splice(i, captionIndex - i + 1, {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['image-figure', `image-figure--${caption.size}`] },
          children: [
            image,
            {
              type: 'element',
              tagName: 'figcaption',
              properties: { className: ['image-caption'] },
              children: caption.children,
            },
          ],
        });
      }

      node.children.forEach(walk);
    };

    walk(tree);
    return tree;
  };
}
