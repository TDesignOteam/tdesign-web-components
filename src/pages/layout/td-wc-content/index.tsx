import type { VNode } from 'omi';
import { bind, Component, tag } from 'omi';
import siteStyles from 'tdesign-site-components/lib/styles/style.css?raw';

import { fallback } from '../../components/fallback.tsx';
import { pending } from '../../components/pending';
import { getShadowSelector } from '../../utils.ts';
import fixedTitle from './fixedTitle.ts';
import styles from './style.less?inline';

const FIXED_HEADER_TOP = 228;

function anchorHighlight() {
  const selectors = ['div[name="DEMO"]', 'div[name="API"]', 'div[name="DESIGN"]', 'div[name="DOC"]'];

  function getLinkTopList(anchorList: HTMLAnchorElement[]) {
    const linkList = anchorList.map((anchor) => {
      const [, id] = decodeURIComponent(anchor.href).split('#');
      return document.getElementById(id);
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
    const linkTopList = getLinkTopList(anchorList);
    highlightAnchor(anchorList, linkTopList);
  });
}

@tag('td-wc-content')
export class tdWcContent extends Component<{ componentImport: () => Promise<any> }> {
  component: VNode = null as any;

  pageStatus: string = 'show';

  static css = [siteStyles, styles];

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
    e.preventDefault();
    e.stopPropagation();
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

  install(): void {
    this.props
      ?.componentImport?.()
      .then((c) => {
        this.component = c.default();
        this.update();

        window.dispatchEvent?.(new Event('component-loaded'));

        this.handleAnchorScroll();
        document.addEventListener('scroll', this.changeTocAndTitleHeight);
      })
      .catch(() => {
        this.component = fallback;
        this.update();
      });
  }

  uninstall(): void {
    document.removeEventListener('scroll', this.changeTocAndTitleHeight);
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
