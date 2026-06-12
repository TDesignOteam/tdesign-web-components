import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

import { getWorkspaceRoot } from '../../../script/lib/get-root-path.mjs';
import tdocPlugin from '../../../script/plugin-tdoc';
import { createAliasConfig, createSseProxy, omiEsbuildConfig } from '../../../script/vite.shared';
import addPartAttributePlugin from './vite-plugin-add-part';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = getWorkspaceRoot(__dirname);

const publicPathMap = {
  preview: '/',
  production: '/web-components/',
};

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    base: publicPathMap[mode] || './',
    esbuild: omiEsbuildConfig,
    resolve: {
      alias: createAliasConfig(ROOT),
    },
    server: {
      host: '0.0.0.0',
      port: 15000,
      open: '/',
      https: false,
      fs: {
        strict: false,
        allow: [resolve(ROOT, '.'), resolve(ROOT, 'node_modules')],
      },
      proxy: createSseProxy(),
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        treeshake: false, // 防止不是具名的 export，会被 tree-shaking
        input: {
          index: 'index.html',
        },
      },
    },
    plugins: [
      addPartAttributePlugin({
        include: /\.(js|jsx|ts|tsx)$/,
      }) as Plugin,
      tdocPlugin() as Plugin,
    ],
    logLevel: 'error',
  });
