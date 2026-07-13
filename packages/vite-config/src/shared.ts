import fg from 'fast-glob';
import { relative, resolve } from 'path';

import { createLessAliasPlugin } from './less-alias-plugin.ts';

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

const alwaysExternal = [/^tailwind-merge(\/.*)?$/];

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

/**
 * preserveModules 文件名策略。
 *
 * UI / Chat 仍需发布 lib / esm / cjs 分文件产物；workspace shared/common 会作为包内
 * 实现被吸进发布包，但不能泄露 packages/shared/src、packages/shared/dist、packages/common
 * 这类 monorepo 路径。这里统一收敛到 _internal/*，表达“包内私有实现，非 public API”。
 */
export function createPreserveModuleFileName(srcDir: string, monorepoRoot: string) {
  const normalizePath = (path: string) => path.replace(/\\/g, '/');
  const stripExtension = (path: string) => normalizePath(path).replace(/\.[^.]+$/, '');
  const normalizedRoot = normalizePath(monorepoRoot);
  const normalizedSrcDir = normalizePath(srcDir);

  return (chunkInfo: { facadeModuleId?: string | null; name: string }) => {
    const facadeModuleId = chunkInfo.facadeModuleId ? normalizePath(chunkInfo.facadeModuleId) : undefined;
    let name = normalizePath(chunkInfo.name);

    if (facadeModuleId?.startsWith(`${normalizedSrcDir}/`)) {
      name = stripExtension(relative(normalizedSrcDir, facadeModuleId));
    } else if (facadeModuleId?.startsWith(`${normalizedRoot}/packages/shared/src/`)) {
      name = `_internal/shared/${stripExtension(relative(`${normalizedRoot}/packages/shared/src`, facadeModuleId))}`;
    } else if (facadeModuleId?.startsWith(`${normalizedRoot}/packages/shared/dist/`)) {
      name = `_internal/shared/${stripExtension(relative(`${normalizedRoot}/packages/shared/dist`, facadeModuleId))}`;
    } else if (facadeModuleId?.startsWith(`${normalizedRoot}/packages/common/`)) {
      name = `_internal/common/${stripExtension(relative(`${normalizedRoot}/packages/common`, facadeModuleId))}`;
    } else {
      name = name
        .replace(/^packages\/shared\/src\//, '_internal/shared/')
        .replace(/^packages\/shared\/dist\//, '_internal/shared/')
        .replace(/^shared\/src\//, '_internal/shared/')
        .replace(/^shared\/dist\//, '_internal/shared/')
        .replace(/^packages\/common\//, '_internal/common/')
        .replace(/^node_modules\/\.pnpm\/[^/]+\/node_modules\//, '');
    }

    return `${name}.js`;
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

/** UMD external 全局名：已知包使用显式配置，其余 subpath 采用稳定兜底命名，避免构建器猜测警告。 */
export function createUmdGlobals(globals: Record<string, string> = {}) {
  return (id: string) => {
    if (globals[id]) return globals[id];

    if (id.startsWith('@tdesign/web-components/') && globals['@tdesign/web-components']) {
      return globals['@tdesign/web-components'];
    }

    if (id.startsWith('lodash-es/') && globals['lodash-es']) {
      return globals['lodash-es'];
    }

    return id.replace(/^@/, '_').replace(/[^\w$]/g, '_');
  };
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
