import docStyles from '@common/style/web/docs.less?inline';
import type { VNode } from 'omi';
import { bind, Component, tag } from 'omi';
import prismCss from 'tdesign-site-components/lib/styles/prism-theme.less?inline';
import prismCssDark from 'tdesign-site-components/lib/styles/prism-theme-dark.less?inline';
import siteStyles from 'tdesign-site-components/lib/styles/style.css?raw';

import { fallback } from '../../components/fallback.tsx';
import { pending } from '../../components/pending.tsx';
import { getShadowSelector } from '../../utils.ts';
import fixedTitle from './fixedTitle.ts';
import styles from './style.less?inline';

const FIXED_HEADER_TOP = 228;

function anchorHighlight() {
  const selectors = ['div[name="DEMO"]', 'div[name="API"]', 'div[name="DESIGN"]', 'div[name="DOC"]'];

  function getLinkTopList(anchorList: HTMLAnchorElement[], wrapper: any) {
    const linkList = anchorList.map((anchor) => {
      const [, id] = decodeURIComponent(anchor.href).split('#');
      return wrapper.querySelector(`#${id}`);
    });
    return linkList.map((link) => {
      if (!link) return 0;
      const { top } = link.getBoundingClientRect();
      return top + document.documentElement.scrollTop;
    });
  }

  function highlightAnchor(anchorList: HTMLAnchorElement[], linkTopList: number[]) {
    const { scrollTop } = document.documentElement;

    for (let i = 0; i < linkTopList.length; i++) {
      if (scrollTop <= linkTopList[i]) {
        if (anchorList[i].classList.contains('active')) break;
        anchorList.forEach((anchor) => anchor.classList.remove('active'));
        anchorList[i].classList.add('active');
        break;
      }
    }
  }

  selectors.forEach((item) => {
    const wrapper = getShadowSelector(['router-view', 'td-wc-content', item]);
    if (!wrapper) return;

    const anchorList = (Array.from(wrapper.querySelectorAll('.tdesign-toc_list_item_a')) || []) as HTMLAnchorElement[];
    const linkTopList = getLinkTopList(anchorList, wrapper);
    highlightAnchor(anchorList, linkTopList);
  });
}

@tag('td-wc-content')
export class tdWcContent extends Component<{ componentImport: () => Promise<any> }> {
  component: VNode = null as any;

  pageStatus: string = 'show';

  static css = [siteStyles, docStyles, prismCss, prismCssDark, styles];

  changeTocAndTitleHeight() {
    const { scrollTop } = document.documentElement;
    const wrapper = getShadowSelector(['router-view', 'td-wc-content']);
    // 固定右侧目录
    const tocContainer = wrapper?.shadowRoot?.querySelector('.tdesign-toc_container') as HTMLElement;
    if (!tocContainer) return;
    if (scrollTop > FIXED_HEADER_TOP) {
      Object.assign(tocContainer.style, { position: 'fixed', top: '152px' });
    } else {
      Object.assign(tocContainer.style, { position: 'absolute', top: '316px' });
    }

    anchorHighlight();

    fixedTitle(wrapper?.querySelector('td-doc-header'), wrapper?.shadowRoot?.querySelector('td-doc-tabs'));
  }

  // 优化锚点滚动体验
  @bind
  proxyTitleAnchor(e: MouseEvent) {
    const { target } = e as MouseEvent & { target: HTMLAnchorElement };
    if (target?.tagName !== 'A') return;
    const href = decodeURIComponent(target?.href);
    if (!href.includes('#')) return;

    const [, id = ''] = href.split('#');
    if (target.classList.contains('tdesign-header-anchor') || target.classList.contains('tdesign-toc_list_item_a')) {
      const idTarget = getShadowSelector(['router-view', 'td-wc-content', `#${id}`]);
      if (!idTarget) return;
      const { top } = idTarget.getBoundingClientRect();
      const offsetTop = top + document.documentElement.scrollTop;

      requestAnimationFrame(() => window.scrollTo({ top: offsetTop - 120, left: 0 }));
    }
  }

  // 加载后跳转到锚点定位处
  handleAnchorScroll() {
    const href = decodeURIComponent(location.href);
    if (!href.includes('#')) return;

    const [, id = ''] = href.split('#');
    const idTarget = getShadowSelector(['router-view', 'td-wc-content', `#${id}`]);
    if (!idTarget) return;

    // 需要等待容器完全加载出来
    setTimeout(() => {
      const { top } = idTarget.getBoundingClientRect();
      const offsetTop = top + document.documentElement.scrollTop;

      requestAnimationFrame(() => window.scrollTo({ top: offsetTop - 120, left: 0 }));
    }, 20);
  }

  private styleObserver: MutationObserver | null = null;

  install(): void {
    // 注入 TDesign 组件的全局样式到当前 Shadow DOM
    this.injectTDesignStyles();

    // 设置样式监听器
    this.setupStyleObserver();

    this.props
      ?.componentImport?.()
      .then((c) => {
        this.component = c.default();
        this.update();

        // 组件加载后立即尝试注入样式
        this.injectTDesignStyles();

        window.dispatchEvent?.(new Event('component-loaded'));

        this.handleAnchorScroll();
        document.addEventListener('scroll', this.changeTocAndTitleHeight);
      })
      .catch((error) => {
        console.error(error);
        this.component = fallback;
        this.update();
      });
  }

  private injectedStylesCount = 0;

  private setupStyleObserver(): void {
    // 检查是否为 TDesign 组件样式
    const isTDesignStyle = (element: Element): boolean => element.tagName === 'STYLE' && element.id.endsWith('-styles');

    // 检查节点列表中是否有 TDesign 样式变化
    const hasStyleChanges = (nodeList: NodeList): boolean => Array.from(nodeList).some((node) => node.nodeType === Node.ELEMENT_NODE && isTDesignStyle(node as Element));

    // 监听 document.head 中样式标签的变化
    this.styleObserver = new MutationObserver((mutations) => {
      const shouldUpdate = mutations.some(
        (mutation) => hasStyleChanges(mutation.addedNodes) || hasStyleChanges(mutation.removedNodes),
      );

      if (shouldUpdate) {
        console.log('td-wc-content: 检测到样式变化，重新注入');
        this.injectTDesignStyles();
      }
    });

    // 开始监听 document.head 的变化
    this.styleObserver.observe(document.head, {
      childList: true,
      subtree: false,
    });
  }

  private injectTDesignStyles(): void {
    if (!this.shadowRoot) return;

    // 从 document.head 中查找所有组件样式（由 LightDOMComponent 注入的）
    const componentStyles = document.querySelectorAll('style[id$="-styles"]');
    // const globalStyles = document.querySelectorAll('style[id^="tdesign-global-style-"]');

    const totalStyles = componentStyles.length;

    if (totalStyles === 0) {
      console.log('td-wc-content: 未找到任何TDesign样式，跳过注入');
      return;
    }

    if (totalStyles === this.injectedStylesCount) {
      console.log('td-wc-content: 样式已是最新，跳过注入');
      return;
    }

    // 注入组件样式
    componentStyles.forEach((sourceStyle: HTMLStyleElement) => {
      const styleId = `shadow-${sourceStyle.id}`;
      let existingStyle = this.shadowRoot.querySelector(`#${styleId}`) as HTMLStyleElement;
      const newContent = sourceStyle.textContent || '';

      if (!existingStyle) {
        existingStyle = document.createElement('style');
        existingStyle.id = styleId;
        existingStyle.textContent = newContent;
        this.shadowRoot.appendChild(existingStyle);
        console.log(`td-wc-content: 新增组件样式 ${sourceStyle.id}，长度:`, newContent.length);
      } else if (existingStyle.textContent !== newContent) {
        existingStyle.textContent = newContent;
        console.log(`td-wc-content: 更新组件样式 ${sourceStyle.id}，长度:`, newContent.length);
      }
    });

    this.injectedStylesCount = totalStyles;
    console.log(`td-wc-content: 样式注入完成，共注入 ${this.injectedStylesCount} 个样式`);
  }

  uninstall(): void {
    document.removeEventListener('scroll', this.changeTocAndTitleHeight);

    // 清理样式观察器
    if (this.styleObserver) {
      this.styleObserver.disconnect();
      this.styleObserver = null;
    }
  }

  render() {
    const { component } = this;
    return (
      <div class={`TDesign-doc-content ${this.pageStatus}`}>
        <slot name="doc-header"></slot>

        <div class="TDesign-doc-body" onClick={this.proxyTitleAnchor}>
          <div class="TDesign-doc-body__inner">{component ? component : pending}</div>
        </div>

        <td-doc-footer slot="doc-footer"></td-doc-footer>

        <td-backtop></td-backtop>
      </div>
    );
  }
}
