import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import tdocPlugin from './script/plugin-tdoc';
import pwaConfig from './pwaConfig';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'h.f',
    jsxInject: `import { h } from 'omi'`,
  },
  resolve: {
    alias: {
      // "omi": resolve("./src/omi/index.ts"),
      '@': resolve('./src/'),
      '@common': resolve('./src/_common/'),
      'tdesign-web-components': resolve('./src/'),
    },
  },
  plugins: [tdocPlugin(), VitePWA(pwaConfig)],
});
