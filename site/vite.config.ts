import fs from 'node:fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import tdocPlugin from '../script/plugin-tdoc';
import addPartAttributePlugin from './vite-plugin-add-part';

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
      jsxFactory: 'OmiComponent.h',
      jsxFragment: 'OmiComponent.f',
      jsxInject: `import { Component as OmiComponent  } from 'omi'`,
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
      outDir: '../_site',
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
