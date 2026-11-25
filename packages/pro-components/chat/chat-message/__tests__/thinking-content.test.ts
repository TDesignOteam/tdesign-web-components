import { describe, expect, test, vi } from 'vitest';

import ThinkingContent, { renderThinking } from '../content/thinking-content';

vi.mock('@tdesign/web-components', () => ({}));
vi.mock('../auto-scroll', () => ({}));
vi.mock('../../chat-loading', () => ({}));
vi.mock('tdesign-icons-web-components/esm/components/check-circle', () => ({}));
vi.mock('tdesign-icons-web-components/esm/components/close-circle', () => ({}));
vi.mock('@tdesign/web-components-shared/_util/classname', () => ({ getClassPrefix: () => 't' }));
vi.mock('@tdesign/web-components-shared/_util/lightDom', () => ({ convertToLightDomNode: (node: unknown) => node }));
vi.mock('../style/chat-item.less', () => ({ default: '' }));
vi.mock('omi', () => ({
  Component: class {
    props = {};

    fire = vi.fn();

    static h(nodeName: string, attributes: Record<string, unknown>, ...children: unknown[]) {
      return { nodeName, attributes: attributes || {}, children: children.flat(Infinity).filter(Boolean) };
    }
  },
  signal: (value: unknown) => ({ value }),
  tag: () => (component: unknown) => component,
}));

type RenderNode = {
  nodeName: string;
  attributes: Record<string, unknown>;
  children: (RenderNode | string)[];
};

function findNode(node: RenderNode, predicate: (child: RenderNode) => boolean): RenderNode | undefined {
  if (predicate(node)) return node;
  for (const child of node.children) {
    if (typeof child === 'string') continue;
    const found = findNode(child, predicate);
    if (found) return found;
  }
}

describe('ChatThinkingContent', () => {
  test.each([
    ['pending', 't-chat-loading'],
    ['streaming', 't-chat-loading'],
    ['complete', 't-icon-check-circle'],
    ['error', 't-icon-close-circle'],
    ['stop', undefined],
  ] as const)('keeps the %s status fallback inside the icon slot', (status, iconName) => {
    const node = renderThinking({ status, content: { title: 'Thinking' }, animation: 'moving' }) as RenderNode;
    const icon = findNode(node, (child) => child.nodeName === 'slot' && child.attributes.name === 'icon');

    expect(icon).toBeDefined();
    if (iconName) {
      expect(icon.children).toHaveLength(1);
      expect((icon.children[0] as RenderNode).nodeName).toBe(iconName);
      if (iconName === 't-chat-loading') expect((icon.children[0] as RenderNode).attributes.animation).toBe('moving');
    } else {
      expect(icon.children).toHaveLength(0);
    }
    const header = findNode(node, (child) => child.attributes.slot === 'header');
    expect(header.children).toContain(icon);
    expect(header.children).toContain(status === 'stop' ? '思考已终止' : 'Thinking');
  });

  test('preserves the content slot and default paragraphs', () => {
    const node = renderThinking({ content: { text: 'First\n\nSecond' } }) as RenderNode;
    const content = findNode(node, (child) => child.nodeName === 'slot' && child.attributes.name === 'content');
    const inner = content.children[0] as RenderNode;

    expect(inner.children.map((child: RenderNode) => child.children)).toEqual([['First'], ['Second']]);
  });

  test('keeps controlled collapsed state and the original change handler', () => {
    const component = new ThinkingContent();
    component.props = { collapsed: false };
    component.onCollapsedChange(new CustomEvent('change', { detail: [] }));

    const node = component.render(component.props) as RenderNode;
    expect(component.fire).toHaveBeenCalledWith('collapsedChange', true);
    expect(node.attributes.value).toEqual([1]);
    expect(node.attributes.onChange).toBe(component.onCollapsedChange);

    component.props = { collapsed: true };
    expect((component.render(component.props) as RenderNode).attributes.value).toEqual([]);
  });

  test('keeps uncontrolled collapse and expand events', () => {
    const component = new ThinkingContent();
    component.props = { defaultCollapsed: false };
    component.ready();

    component.onCollapsedChange(new CustomEvent('change', { detail: [] }));
    expect(component.computedCollapsed).toBe(true);
    component.onCollapsedChange(new CustomEvent('change', { detail: [1] }));
    expect(component.computedCollapsed).toBe(false);
    expect(component.fire).toHaveBeenNthCalledWith(1, 'collapsedChange', true);
    expect(component.fire).toHaveBeenNthCalledWith(2, 'collapsedChange', false);
  });
});
