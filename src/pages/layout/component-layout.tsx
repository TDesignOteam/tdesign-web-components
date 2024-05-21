import { VNode } from 'omi';
import '../components/navbar.tsx';
import sidebarConfig from '../../sidebar.config.ts';

import 'tdesign-site-components/lib/styles/style.css';
import 'tdesign-site-components/lib/styles/prism-theme.less';
import 'tdesign-site-components/lib/styles/prism-theme-dark.less';

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

export function ComponentLayout(props: { children?: VNode | VNode[] }) {
  const scroll = throttle(() => {
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
  }, 100);

  document.addEventListener('scroll', scroll);

  import('tdesign-site-components/lib/styles/style.css').then((r) => {
    const suspense = document.querySelector('router-view')?.shadowRoot?.querySelector('o-suspense')?.shadowRoot;
    if (!suspense?.querySelector('style[id="tdesign"]')) {
      const s = document.createElement('style');
      s.innerHTML = r.default;
      s.id = 'tdesign';
      document.querySelector('router-view')?.shadowRoot?.querySelector('o-suspense')?.shadowRoot?.appendChild(s);
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
