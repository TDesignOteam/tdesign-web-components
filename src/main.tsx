import { Router } from 'omi-router';
import { routes } from './routes';
import 'tdesign-site-components';
import './tailwind/index';

import 'tdesign-site-components/lib/styles/style.css';
import 'tdesign-site-components/lib/styles/prism-theme.less';
import 'tdesign-site-components/lib/styles/prism-theme-dark.less';

const router = new Router({
  routes,
  renderTo: '#app',
  hash: false,
});

router.afterEach(() => {
  window.refreshDark();
});
