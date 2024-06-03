import { defineConfig } from 'vite';
import { resolve } from 'path';
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
      'tdesign-web-components': resolve('./src/components/'),
    },
  },
  plugins: [tdocPlugin(), VitePWA(pwaConfig)],
});
