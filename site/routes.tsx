import './index.css';
import './pages/layout/component-layout';

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

export const routes = [
  {
    path: '/',
    redirect: '/components/button',
  },
  ...createComponentRoutes(sidebar),
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
