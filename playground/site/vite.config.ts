import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'path';
import { dirname } from 'path';
import { defineConfig } from 'vite';

import { getWorkspaceRoot } from '../../script/lib/get-root-path.mjs';
import tdocPlugin from '../../script/plugin-tdoc';
import addPartAttributePlugin from './vite-plugin-add-part';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = getWorkspaceRoot(__dirname);

const publicPathMap = {
  preview: '/',
  production: '/webcomponents/',
};

// https://vitejs.dev/config/
export default ({ mode }) => {
  if (mode !== 'development' && fs.existsSync(resolve(ROOT, '_site/'))) {
    fs.rmdirSync(resolve(ROOT, '_site/'), { recursive: true });
  }
  return defineConfig({
    base: publicPathMap[mode] || './',
    esbuild: {
      jsxFactory: 'OmiComponent.h',
      jsxFragment: 'OmiComponent.f',
      jsxInject: `import { Component as OmiComponent  } from 'omi'`,
    },
    resolve: {
      alias: {
        '@': resolve(ROOT, 'packages/ui/src/'),
        '@site': resolve('./'),
        '@docs': resolve('./docs'),
        '@common': resolve(ROOT, 'common-utils/_common/'),
        // 包元数据（package.json 等）
        '@ui-pkg': resolve(ROOT, 'packages/ui'),
        '@chat-pkg': resolve(ROOT, 'packages/chat'),
        // AI Core packages (submodule)
        '@tdesign/ai-chat-engine': resolve(ROOT, 'common-utils/_ai-core/packages/chat-engine/index.ts'),
        '@tdesign/ai-shared': resolve(ROOT, 'common-utils/_ai-core/packages/shared/index.ts'),
        // Monorepo packages
        '@tdesign/web-components-ui': resolve(ROOT, 'packages/ui/src/'),
        '@tdesign/web-components-chat': resolve(ROOT, 'packages/chat/src/'),
        '@tdesign/web-components-shared': resolve(ROOT, 'packages/shared/src/'),
        // 兼容旧路径
        'tdesign-web-components-chat': resolve(ROOT, 'packages/chat/src/'),
        'tdesign-web-components': resolve(ROOT, 'packages/ui/src/'),
      },
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
      proxy: {
        '/api/sse': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/sse/, '/sse'),
          // 允许POST请求代理，显式转发原始请求体
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              // 处理POST请求体转发
              if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
              }
            });
          },
        },
      },
    },
    build: {
      outDir: resolve(ROOT, '_site'),
      rollupOptions: {
        treeshake: false, // 防止不是具名的export，会被tree-shaking
        input: {
          index: 'index.html',
        },
      },
    },
    plugins: [
      addPartAttributePlugin({
        include: /\.(js|jsx|ts|tsx)$/,
      }),
      tdocPlugin(),
    ],
    logLevel: 'error',
  });
};
