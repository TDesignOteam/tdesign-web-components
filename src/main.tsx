import { Router } from 'omi-router';
import { routes } from './routes';

import 'tdesign-site-components';
import 'tdesign-site-components/lib/styles/style.css';
import 'tdesign-site-components/lib/styles/prism-theme.less';
import 'tdesign-site-components/lib/styles/prism-theme-dark.less';

import './tailwind/index';

const router = new Router({
  routes,
  renderTo: '#app',
});

router.afterEach(() => {
  window.refreshDark();
});
