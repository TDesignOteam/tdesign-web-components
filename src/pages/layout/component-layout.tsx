import { VNode } from 'omi';
import '../components/navbar.tsx';
import sidebarConfig from '../../sidebar.config.ts';
// import { navbarItems, activeMenuItem } from '../../store.ts';
// import { CustomizeButton } from '../components/customize-button.tsx';
// import tdesignLogo from '@/assets/tdesign.svg?raw';
const routerList = JSON.parse(JSON.stringify(sidebarConfig).replace(/component:.+/g, ''));

export function ComponentLayout(props: { children?: VNode | VNode[] }) {
  // const router = [{ title: '按钮', name: 'button', path: '/#/components/button' }];
  document.addEventListener('scroll', () => {
    const { scrollTop } = document.documentElement;
    const t = document
      .querySelector('router-view')
      ?.shadowRoot?.querySelector('o-suspense')
      ?.shadowRoot?.querySelector('td-doc-tabs') as any;
    if (!t) {
      return;
    }
    if (scrollTop > 235) {
      Object.assign(t.style, { position: 'fixed', top: '65px' });
    } else {
      Object.assign(t.style, { position: 'absolute', top: '228px' });
    }
  });
  return (
    <>
      <td-doc-layout>
        <td-header framework="web-components" slot="header">
          <td-doc-search slot="search" docsearchInfo="搜索" />
        </td-header>
        <td-doc-aside title="Web Components" routerList={routerList}>
          <td-select value="0.0.1" options={[{ label: '0.0.1', value: '0.0.1' }]} slot="extra"></td-select>
        </td-doc-aside>
        <td-doc-content pageStatus="show">
          {props.children}
          <td-doc-footer slot="doc-footer"></td-doc-footer>
        </td-doc-content>
      </td-doc-layout>
      <td-theme-generator />
    </>
  );
}
