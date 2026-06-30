import fg from 'fast-glob';
import { resolve } from 'path';

import { createLessAliasPlugin } from './less-alias-plugin.mjs';

// ---------------------------------------------------------------------------
// Monorepo 路径
// ---------------------------------------------------------------------------

/**
 * 创建 monorepo 路径别名
 * @param root workspace 根目录
 * @param siteDir 文档站目录；传入时追加 @site / @docs 等站点专用别名
 */
export function createMonorepoAliasConfig(root: string, siteDir?: string): Record<string, string> {
  const commonDir = resolve(root, 'packages/common');
  const aliases: Record<string, string> = {
    '@common': commonDir,
    '@tdesign/web-components': resolve(root, 'packages/components'),
    '@tdesign/web-components-chat': resolve(root, 'packages/pro-components/chat'),
    '@tdesign/web-components-shared': resolve(root, 'packages/shared/src'),
  };

  if (siteDir) {
    Object.assign(aliases, {
      '@': resolve(root, 'packages/components/'),
      '@site': resolve(siteDir),
      '@docs': resolve(siteDir, 'docs'),
      '@ui-pkg': resolve(root, 'packages/components'),
      '@chat-pkg': resolve(root, 'packages/pro-components/chat'),
      '@tdesign/web-components': resolve(root, 'packages/components/'),
      '@tdesign/web-components-chat': resolve(root, 'packages/pro-components/chat/'),
      '@tdesign/web-components-shared': resolve(root, 'packages/shared/src/'),
    });
  }

  return aliases;
}

// ---------------------------------------------------------------------------
// Oxc / JSX
// ---------------------------------------------------------------------------

/** 文档站 Omi JSX（配合 add-part-attribute 插件使用 OmiComponent） */
export const siteOxcConfig = {
  jsx: {
    runtime: 'classic' as const,
    pragma: 'OmiComponent.h',
    pragmaFrag: 'OmiComponent.f',
  },
  jsxInject: `import { Component as OmiComponent } from 'omi'`,
};

/** 库构建 Omi JSX（与 tsconfig jsxFactory 一致） */
export const libOxcConfig = {
  jsx: {
    runtime: 'classic' as const,
    pragma: 'Component.h',
    pragmaFrag: 'Component.f',
  },
};

// ---------------------------------------------------------------------------
// 样式（文档站 + 库构建共用）
// ---------------------------------------------------------------------------

/** Less 预处理器配置（支持 @common 别名） */
export function createLessPreprocessorOptions(monorepoRoot: string) {
  return {
    less: {
      plugins: [createLessAliasPlugin(monorepoRoot)],
    },
  };
}

// ---------------------------------------------------------------------------
// 文档站
// ---------------------------------------------------------------------------

/** 文档站预构建排除：workspace 包走源码 alias */
export const workspaceOptimizeDepsExclude = [
  '@tdesign/web-components',
  '@tdesign/web-components-chat',
  '@tdesign/web-components-shared',
  '@tdesign/ai-chat-engine',
];

/** 创建 SSE 代理配置 */
export function createSseProxy(): Record<string, unknown> {
  return {
    '/api/sse': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api\/sse/, '/sse'),
      configure: (proxy: { on: (event: string, handler: (...args: unknown[]) => void) => void }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        proxy.on('proxyReq', ((proxyReq: any, req: any) => {
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

// ---------------------------------------------------------------------------
// 库构建
// ---------------------------------------------------------------------------

const alwaysExternal = [/tailwind-merge/];

/** 产物 banner */
export function createBanner(pkg: { name: string; version: string; author?: string; license?: string }) {
  return `/**\n * ${pkg.name} v${pkg.version}\n * (c) ${new Date().getFullYear()} ${pkg.author || 'TDesign'}\n * @license ${pkg.license || 'MIT'}\n */\n`;
}

/** 库构建 external 判断（preserveModules：esm/cjs/lib） */
export function createLibExternal(
  pkg: { dependencies?: Record<string, string>; peerDependencies?: Record<string, string> },
  additionalExternal: string[] = [],
) {
  const deps = Object.keys(pkg.dependencies || {});
  const peerDeps = Object.keys(pkg.peerDependencies || {});
  const externalPkgs = new Set([...deps, ...peerDeps, ...additionalExternal]);

  return (id: string) => {
    if (alwaysExternal.some((re) => re.test(id))) return true;
    return [...externalPkgs].some((dep) => id === dep || id.startsWith(`${dep}/`));
  };
}

/** UMD 构建 external（dependencies + peer + 额外声明） */
export function createUmdExternal(
  pkg: {
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  },
  additionalExternal: string[] = [],
) {
  const deps = Object.keys(pkg.dependencies || {});
  const peerDeps = Object.keys(pkg.peerDependencies || {});
  const externalPkgs = [...new Set([...deps, ...peerDeps, ...additionalExternal])];

  return (id: string) => externalPkgs.some((dep) => id === dep || id.startsWith(`${dep}/`));
}

/** 收集库构建入口（preserveModules 多入口） */
export function collectLibInputs(srcDir: string) {
  const inputList = [
    `${srcDir}/**/*.ts`,
    `${srcDir}/**/*.tsx`,
    `!${srcDir}/**/node_modules/**`,
    `!${srcDir}/**/_example/**`,
    `!${srcDir}/**/mock/**`,
    `!${srcDir}/**/__tests__/**`,
    `!${srcDir}/**/*.d.ts`,
  ];
  return fg.sync(inputList, { absolute: true });
}
