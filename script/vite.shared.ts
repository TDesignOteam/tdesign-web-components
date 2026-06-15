import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'path';

import { getWorkspaceRoot } from './lib/get-root-path.mjs';

// 共享的路径别名配置
export function createAliasConfig(root: string): Record<string, string> {
  const commonDir = resolve(root, 'common-utils/_common');
  return {
    '@': resolve(root, 'packages/components/'),
    '@site': resolve('./'),
    '@docs': resolve('./docs'),
    '@common': commonDir,
    // 包元数据（package.json 等）
    '@ui-pkg': resolve(root, 'packages/components'),
    '@chat-pkg': resolve(root, 'packages/pro-components/chat'),
    // AI Core packages (submodule)
    '@tdesign/ai-chat-engine': resolve(root, 'common-utils/_ai-core/packages/chat-engine/index.ts'),
    '@tdesign/ai-shared': resolve(root, 'common-utils/_ai-core/packages/shared/index.ts'),
    // Monorepo packages
    '@tdesign/web-components': resolve(root, 'packages/components/'),
    '@tdesign/web-components-chat': resolve(root, 'packages/pro-components/chat/'),
    '@tdesign/web-components-shared': resolve(root, 'packages/shared/src/'),
  };
}

// 共享的 Omi JSX 配置（Vite 8 使用 Oxc，esbuild 选项会自动转换）
export const omiOxcConfig = {
  jsx: {
    runtime: 'classic' as const,
    pragma: 'OmiComponent.h',
    pragmaFrag: 'OmiComponent.f',
  },
  jsxInject: `import { Component as OmiComponent } from 'omi'`,
};

/** @deprecated 请使用 omiOxcConfig，保留别名以兼容旧引用 */
export const omiEsbuildConfig = omiOxcConfig;

// 创建 SSE 代理配置
export function createSseProxy(): Record<string, unknown> {
  return {
    '/api/sse': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api\/sse/, '/sse'),
      configure: (proxy: { on: (event: string, handler: (...args: unknown[]) => void) => void }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        proxy.on('proxyReq', ((proxyReq: any, req: any) => {
          // 处理 POST 请求体转发
          // Vite 代理中间件会自动解析请求体，但 TypeScript 类型定义中没有包含 body 属性
          if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', String(Buffer.byteLength(bodyData)));
            proxyReq.write(bodyData);
          }
        }) as (...args: unknown[]) => void);
      },
    },
  };
}

// 获取 monorepo 根目录
export function getMonorepoRoot(): string {
  return getWorkspaceRoot(dirname(fileURLToPath(import.meta.url)));
}
