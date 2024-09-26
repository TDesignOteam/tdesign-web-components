import 'tdesign-site-components';
import 'tdesign-theme-generator';
import 'tdesign-site-components/lib/styles/style.css';
import './tailwind/index.ts';
import 'tdesign-web-components/style/index.js';
import 'tdesign-icons-view';

import { Router } from 'omi-router';

import { routes } from './routes';

import '@common/style/web/docs.less';

const router = new Router({
  routes,
  renderTo: '#app',
  hash: false,
});

router.afterEach(() => {
  // window.refreshDark();
});
