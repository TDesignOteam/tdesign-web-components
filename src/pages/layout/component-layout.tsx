import { Component, VNode, tag } from 'omi';
import '../components/navbar.tsx';
import styles from 'tdesign-site-components/lib/styles/style.css?raw';

import sidebarConfig from '../../sidebar.config.ts';

function throttle(func: Function, delay: number) {
  let lastCall = 0;

  return (...args: any[]) => {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      // @ts-ignore
      return func.apply(this, args);
    }
  };
}

const routerList = JSON.parse(JSON.stringify(sidebarConfig).replace(/component:.+/g, ''));
@tag('component-layout')
export class ComponentLayout extends Component<{ children?: VNode | VNode[] }> {
  asideRef: any = null;

  scroll = throttle(() => {
    const { scrollTop } = document.documentElement;
    const t = document
      .querySelector('router-view')
      ?.shadowRoot?.querySelector('component-layout')
      ?.shadowRoot?.querySelector('td-suspense')
      ?.shadowRoot?.querySelector('td-doc-tabs') as any;
    if (!t) {
      return;
    }
    if (scrollTop > 235) {
      Object.assign(t.style, { position: 'fixed', top: '65px' });
    } else {
      Object.assign(t.style, { position: 'absolute', top: '228px' });
    }
  }, 100);

  componentLoaded = () => {
    document.addEventListener('scroll', this.scroll);
  };

  asideChange = ({ detail }: { detail: string }) => {
    if (window.location.pathname === detail) return;
    window.location.pathname = detail;
  };

  static css = styles;

  ready(): void {
    window.addEventListener('component-loaded', this.componentLoaded);
    this.asideRef?.addEventListener?.('change', this.asideChange);
  }

  uninstall(): void {
    window.removeEventListener('component-loaded', this.componentLoaded);
    document.removeEventListener('scroll', this.scroll);
    this.asideRef?.removeEventListener?.('change', this.asideChange);
  }

  render() {
    return (
      <>
        <td-doc-layout>
          <td-header framework="web-components" slot="header">
            <td-doc-search slot="search" docsearchInfo="搜索" />
          </td-header>
          <td-doc-aside ref={(e: any) => (this.asideRef = e)} title="Web Components" routerList={routerList}>
            <td-select value="0.0.1" options={[{ label: '0.0.1', value: '0.0.1' }]} slot="extra"></td-select>
          </td-doc-aside>
          <td-doc-content pageStatus="show">
            {this.props.children}
            <td-doc-footer slot="doc-footer"></td-doc-footer>
          </td-doc-content>
        </td-doc-layout>
        <td-theme-generator />
      </>
    );
  }
}
