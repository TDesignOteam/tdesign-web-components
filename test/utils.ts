import { fixture, html as litHtml } from '@open-wc/testing';

export * from 'vitest';
export { fixture, html } from '@open-wc/testing';

// 渲染一个 webc 组件
export async function render(htmlString: string): Promise<HTMLElement> {
  const strings = Object.assign([htmlString], { raw: [htmlString] });
  return fixture<HTMLElement>(litHtml(strings));
}

// 检查元素是否包含指定的 css 类
export function hasClassName(el: Element | null, className: string): boolean {
  return el?.classList.contains(className) || false;
}
