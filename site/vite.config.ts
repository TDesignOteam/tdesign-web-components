import fs from 'node:fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import tdocPlugin from '../script/plugin-tdoc';
import pwaConfig from './pwaConfig.js';

const publicPathMap = {
  preview: '/',
  intranet: '/webcomponents/',
  production: 'https://static.tdesign.tencent.com/webcomponents/',
};

// https://vitejs.dev/config/
export default ({ mode }) => {
  if (mode !== 'development' && fs.existsSync(resolve('../_site/'))) {
    fs.rmdirSync(resolve('../_site/'), { recursive: true });
  }
  return defineConfig({
    base: publicPathMap[mode] || './',
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'h.f',
      jsxInject: `import { h } from 'omi'`,
    },
    resolve: {
      alias: {
        '@': resolve('../'),
        '@site': resolve('./'),
        '@docs': resolve('./docs'),
        '@common': resolve('../src/_common/'),
        'tdesign-web-components': resolve('../src/'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 15000,
      open: '/',
      https: false,
      fs: {
        strict: false,
      },
    },
    build: {
      outDir: '../_site',
      rollupOptions: {
        treeshake: false, // 防止不是具名的export，会被tree-shaking
        input: {
          index: 'index.html',
        },
      },
    },
    plugins: [tdocPlugin(), VitePWA(pwaConfig)],
    logLevel: 'error',
  });
};
