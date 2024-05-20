import 'omi-suspense';
import './index.css';
import { Router } from 'omi-router';
import { Component } from 'omi';
import { SiteLayout } from './pages/layout/site-layout';
import { pending } from './pages/components/pending';
import { fallback } from './pages/components/fallback';
import { ComponentLayout } from './pages/layout/component-layout';
import './pages/components/appear';
// import Button from './components/button/README.md';

export const routes = [
  createRoute('/', () => import('./pages/home')),
  createRoute('/results/success', () => import('./pages/results/success')),
  createRoute('/results/fail', () => import('./pages/results/fail')),
  createRoute('/results/browser-not-support', () => import('./pages/results/browser-not-support')),
  createRoute('/results/forbidden', () => import('./pages/results/forbidden')),
  createRoute('/results/network-error', () => import('./pages/results/network-error')),
  createRoute('/results/server-error', () => import('./pages/results/server-error')),
  createRoute('/results/system-maintenance', () => import('./pages/results/system-maintenance')),
  createRoute('/results/not-found', () => import('./pages/results/not-found')),
  createComponentRoute('/components/button', () => import('./components/button/README.md')),
  createRoute('/icons', () => import('./pages/icons')),
  createRoute('*', () => import('./pages/results/not-found')),
  {
    path: '/before-enter/test',
    beforeEnter: () =>
      // reject the navigation
      false,
  },
];

function createRoute(path: string, componentImport: () => Promise<unknown>) {
  return {
    path,
    render(router: Router) {
      return (
        <SiteLayout current={router.currentRoute?.path}>
          <o-suspense
            minLoadingTime={400}
            imports={[componentImport()]}
            customRender={(results: { [x: string]: Function }[]) => (
              <o-appear
                class="opacity-0 translate-y-4"
                onReady={() => {
                  window.refreshDark();
                  window.scrollTo(0, 0);
                }}
              >
                {results[0][Object.keys(results[0])[0]](router.params)}
              </o-appear>
            )}
            fallback={fallback}
            beforePending={async (suspense: Component) => {
              suspense.shadowRoot?.firstElementChild?.classList.add('opacity-0', 'translate-y-4');
              return new Promise((resolve) => {
                setTimeout(resolve, 300);
              });
            }}
            pending={pending}
            onLoaded={() => {
              window.refreshDark();
            }}
          ></o-suspense>
        </SiteLayout>
      );
    },
  };
}

function createComponentRoute(path: string, componentImport: () => Promise<unknown>) {
  return {
    path,
    render(router: Router) {
      return (
        <ComponentLayout>
          <o-suspense
            minLoadingTime={400}
            imports={[componentImport()]}
            customRender={(results: { [x: string]: Function }[]) => {
              const Component = results[0].default;
              return <Component router={router} />;
            }}
            fallback={fallback}
            beforePending={async (suspense: Component) => {
              suspense.shadowRoot?.firstElementChild?.classList.add('opacity-0', 'translate-y-4');
              return new Promise((resolve) => {
                setTimeout(resolve, 300);
              });
            }}
            pending={pending}
            onLoaded={() => {
              window.refreshDark();
            }}
          ></o-suspense>
        </ComponentLayout>
      );
    },
  };
}
