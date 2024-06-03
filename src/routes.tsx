import 'omi-suspense';
import './index.css';
import './pages/layout/component-layout';

import { Component, tag, VNode } from 'omi';
import styles from 'tdesign-site-components/lib/styles/style.css?raw';

import { pending } from './pages/components/pending';
import sidebar from './sidebar.config';

function createComponentRoutes(config: any[] = []) {
  const routes: any[] = [];
  config.forEach((item) => {
    if (item.children) {
      item.children.forEach((c: any) => {
        routes.push(createComponentRoute(c.path, c.component));
      });
    }
  });
  return routes;
}

@tag('td-suspense')
export class tdSuspense extends Component<{ componentImport: () => Promise<any> }> {
  component: VNode = null as any;

  static css = styles;

  install(): void {
    this.props?.componentImport?.().then((c) => {
      this.component = c.default();
      this.update();
      window.dispatchEvent?.(new Event('component-loaded'));
      window.refreshDark();
    });
  }

  render() {
    const { component } = this;
    return component ? component : pending;
  }
}

export const routes = [
  {
    path: '/',
    redirect: '/components/button',
  },
  ...createComponentRoutes(sidebar),
  createComponentRoute('/icons', () => import('./pages/icons')),
  {
    path: '/before-enter/test',
    beforeEnter: () =>
      // reject the navigation
      false,
  },
];

function createComponentRoute(path: string, componentImport: () => Promise<unknown>) {
  return {
    path,
    render() {
      return (
        <component-layout>
          <td-wc-content componentImport={componentImport}></td-wc-content>
        </component-layout>
      );
    },
  };
}
