/**
 * 深入 open shadow DOM 查找第一个 <input>（Pagefind 组件的搜索框在多层 shadow root 内）。
 */
export function deepQueryInput(root: ParentNode): HTMLInputElement | null {
  const direct = root.querySelector<HTMLInputElement>('input');
  if (direct) return direct;
  for (const el of root.querySelectorAll<HTMLElement>('*')) {
    if (el.shadowRoot) {
      const found = deepQueryInput(el.shadowRoot);
      if (found) return found;
    }
  }
  return null;
}
