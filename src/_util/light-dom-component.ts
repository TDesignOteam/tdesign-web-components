import { Component } from 'omi';

type Module = { default: string };
type CSSItem = Module | string | CSSStyleSheet;

/**
 * Light DOM 组件基类
 * 继承自 omi 的 Component，但强制使用 Light DOM 渲染
 * 并提供样式作用域功能
 */
export class LightDOMComponent<State = any> extends Component<State> {
  static styleMode: 'styleTag' | 'none' = 'styleTag';

  createRenderRoot(): LightDOMComponent {
    // 对于 Light DOM，我们不需要清理内容
    // 让 omi 的 diff 算法来处理更新，避免失焦问题
    return this;
  }

  applyStyles() {
    const constructor = this.constructor as typeof LightDOMComponent;

    if (constructor.styleMode === 'none') {
      return;
    }

    const { css } = constructor;
    if (!css) return;

    // 为Light DOM模式创建scoped样式
    const componentTag = this.tagName.toLowerCase();
    const scopedCSS = this.createScopedCSS(css, componentTag);

    if (constructor.styleMode === 'styleTag') {
      this.injectStyleTag(scopedCSS, componentTag);
    }
  }

  private createScopedCSS(css: CSSItem | CSSItem[], componentTag: string): string {
    let cssString = '';

    if (typeof css === 'string') {
      cssString = css;
    } else if (Array.isArray(css)) {
      cssString = (css as (Module | string)[])
        .map((item) => {
          if (typeof item === 'string') {
            return item;
          } if (item.default && typeof item.default === 'string') {
            return item.default;
          }
          return '';
        })
        .join('\n');
    } else if ((css as Module).default && typeof (css as Module).default === 'string') {
      cssString = (css as Module).default;
    }

    // 为CSS添加组件作用域
    return this.scopeCSSRules(cssString, componentTag);
  }

  private scopeCSSRules(css: string, componentTag: string): string {
    return css.replace(/([^{}]+)\{/g, (match, selector) => {
      const trimmedSelector = selector.trim();
      if (trimmedSelector.startsWith('@') || trimmedSelector.startsWith(':root')) {
        return match;
      }

      const scopedSelectors = trimmedSelector
        .split(',')
        .map((s) => {
          const cleanSelector = s.trim();
          if (cleanSelector.startsWith(':host')) {
            return cleanSelector.replace(':host', componentTag);
          }
          return `${componentTag} ${cleanSelector}`;
        })
        .join(', ');

      return `${scopedSelectors} {`;
    });
  }

  private injectStyleTag(css: string, componentTag: string) {
    const styleId = `${componentTag}-styles`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }

  // Light DOM 特有的slot替代方案
  protected renderSlot(slotName?: string, fallback?: any): any {
    if (!slotName) {
      // 默认slot - 渲染所有children
      return (this.props as any).children || fallback || [];
    }

    // 命名slot - 查找具有slot属性的children
    const slotChildren = this.getSlotChildren(slotName);
    return slotChildren.length > 0 ? slotChildren : fallback || [];
  }

  private getSlotChildren(slotName: string): any[] {
    const { children } = (this.props as any);
    if (!children) return [];

    const childArray = Array.isArray(children) ? children : [children];
    return childArray.filter((child: any) => child && typeof child === 'object' && child.attributes && child.attributes.slot === slotName);
  }

  // 重写 applyAdoptedStyleSheets 方法，禁用 Shadow DOM 样式
  applyAdoptedStyleSheets() {
    // Light DOM 组件不使用 adoptedStyleSheets
    this.applyStyles();
  }
}
