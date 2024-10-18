import './index.css';
import './pages/layout/component-layout';

import sidebar from './sidebar.config';

function createComponentRoutes(config: any[] = []) {
  return config
    .map((item) => item?.children || [])
    .flat()
    .map((item) => {
      if (item.component) {
        return createComponentRoute(item.path, item.component);
      }
      return null;
    })
    .filter((item) => item);
}

export const routes = [
  {
    path: '/',
    redirect: '/webcomponents/getting-started',
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
