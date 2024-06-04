import 'tdesign-site-components';
import 'tdesign-theme-generator';
import './tailwind/index';
import 'tdesign-site-components/lib/styles/style.css';

import { Router } from 'omi-router';

import { routes } from './routes';

import '@common/style/web/docs.less';
import 'tdesign-site-components/lib/styles/prism-theme.less';
import 'tdesign-site-components/lib/styles/prism-theme-dark.less';

const router = new Router({
  routes,
  renderTo: '#app',
  hash: false,
});

router.afterEach(() => {
  // window.refreshDark();
});
