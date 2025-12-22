import '../button';

import { hasClassName, render } from '@test/utils';
import { expect, vi } from 'vitest';

describe('Button Component', () => {
  it('should be rendered', async () => {
    const el = await render('<t-button>click me</t-button>');
    expect(el).toBeDefined();
    expect(el.tagName.toLowerCase()).toBe('t-button');
    expect(el.textContent).toBe('click me');
  });

  it('props.disabled works fine', async () => {
    // default
    const el1 = await render('<t-button>Text</t-button>');
    const shadowRoot1 = el1.shadowRoot;
    const btn1 = shadowRoot1?.querySelector('button');
    expect(hasClassName(btn1, 't-is-disabled')).toBe(false);

    // disabled = true
    const el2 = await render('<t-button disabled>Text</t-button>');
    const shadowRoot2 = el2.shadowRoot;
    const btn2 = shadowRoot2?.querySelector('button');
    expect(hasClassName(btn2, 't-is-disabled')).toBe(true);
  });

  it('disabled button should not trigger', async () => {
    const clickHandler = vi.fn();
    const el = await render('<t-button disabled>Text</t-button>');
    el.addEventListener('click', clickHandler);
    const btn = el.shadowRoot?.querySelector('button');
    btn?.click();
    expect(clickHandler).not.toHaveBeenCalled();
  });

  ['default', 'primary', 'danger', 'warning', 'success'].forEach((theme) => {
    it(`theme="${theme} works fine`, async () => {
      const el = await render(`<t-button theme="${theme}">Theme</t-button>`);
      const btn = el.shadowRoot?.querySelector('button');
      expect(hasClassName(btn, `t-button--theme-${theme}`)).toBe(true);
    });
  });

  ['base', 'outline', 'dashed', 'text'].forEach((variant) => {
    it(`variant="${variant} works fine`, async () => {
      const el = await render(`<t-button variant="${variant}">variant</t-button>`);
      const btn = el.shadowRoot?.querySelector('button');
      expect(hasClassName(btn, `t-button--variant-${variant}`)).toBe(true);
    });
  });

  it('props.icon works fine', async () => {
    const el = await render('<t-button>with icon</t-button>');
    const iconE = document.createElement('span');
    iconE.className = 'test-icon';
    iconE.textContent = '🎄';
    (el as any).icon = iconE;
    expect(el.shadowRoot?.querySelector('slot[name="icon"]')).toBeDefined();
  });

  it('props.suffix works fine', async () => {
    const el = await render('<t-button>with icon</t-button>');
    const btn = el.shadowRoot?.querySelector('button');
    // button 子元素顺序
    const children = Array.from(btn?.children || []);
    const childClasses = children.map((child) => child.className);
    // 验证顺序: icon slot, text, suffix
    const textIndex = childClasses.findIndex((child) => child.includes('button__text'));
    expect(textIndex).toBeGreaterThan(-1);
  });

  it('props.block works fine', async () => {
    const el = await render('<t-button block>block</t-button>');
    const btn = el.shadowRoot?.querySelector('button');
    expect(hasClassName(btn, 't-size-full-width')).toBe(true);
  });

  it('props.loading works fine', async () => {
    const el = await render('<t-button loading>loaidng</t-button>');
    const iconSlot = el.shadowRoot?.querySelector('slot[name="icon"]');
    expect(iconSlot).toBeDefined();
    const btn = el.shadowRoot?.querySelector('button');
    expect(hasClassName(btn, 't-is-loading'));
  });
});
