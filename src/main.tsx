import { Router } from 'omi-router';
import { routes } from './routes';
import 'tdesign-site-components';
import './tailwind/index';

const router = new Router({
  routes,
  renderTo: '#app',
});

router.afterEach(() => {
  window.refreshDark();
});
