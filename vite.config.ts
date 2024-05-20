import { defineConfig } from 'vite';
import { resolve } from 'path';
import tdocPlugin from './script/plugin-tdoc';

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
  plugins: [tdocPlugin()],
});
