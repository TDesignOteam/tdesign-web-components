import './index.css';
import './pages/test';
import './pages/layout/component-layout';

import { createSiteRootRedirects } from '@tdesign/vite-config/site-routes';

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

const SITE_PREFIX = '/pro-web-components';
const HOME = `${SITE_PREFIX}/getting-started`;

export const routes = [
  ...createSiteRootRedirects(SITE_PREFIX, HOME),
  ...createComponentRoutes(sidebar),
  {
    path: '/pro-web-components/test',
    render() {
      return <test-parent-component />;
    },
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
