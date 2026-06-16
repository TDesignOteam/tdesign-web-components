import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { getWorkspaceRoot } from './lib/get-root-path.mjs';
import omiStyleImportPlugin from './vite-plugin-omi-style.js';
import {
  collectLibInputs,
  createBanner,
  createLessPreprocessorOptions,
  createLibExternal,
  createMonorepoAliasConfig,
  defaultBundleWorkspacePkgs,
  libOxcConfig,
} from './vite.shared';

export interface LibViteOptions {
  /** 包 package.json 内容 */
  pkg: {
    name: string;
    version: string;
    author?: string;
    license?: string;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
  /** 发布包目录（含 package.json） */
  packageDir: string;
  /** 源码根目录 */
  srcDir: string;
  /** 内联打包的 workspace 包名 */
  bundleWorkspacePkgs?: string[];
}

/**
 * 创建组件库 Vite 构建配置（与文档站共用 Rolldown + Oxc + 样式插件）
 */
export function createLibViteConfig({
  pkg,
  packageDir,
  srcDir,
  bundleWorkspacePkgs = defaultBundleWorkspacePkgs,
}: LibViteOptions) {
  const monorepoRoot = getWorkspaceRoot(packageDir);
  const outDir = resolve(packageDir, 'lib');
  const input = collectLibInputs(srcDir);

  return defineConfig({
    root: packageDir,
    oxc: libOxcConfig,
    resolve: {
      alias: createMonorepoAliasConfig(monorepoRoot),
    },
    define: {
      __VERSION__: JSON.stringify(pkg.version),
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    css: {
      preprocessorOptions: createLessPreprocessorOptions(monorepoRoot),
    },
    build: {
      outDir,
      emptyOutDir: true,
      sourcemap: true,
      minify: false,
      cssCodeSplit: true,
      rolldownOptions: {
        input,
        external: createLibExternal(pkg, bundleWorkspacePkgs),
        treeshake: false,
        output: {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: srcDir,
          banner: createBanner(pkg),
          entryFileNames: '[name].js',
        },
      },
    },
    plugins: [
      omiStyleImportPlugin(),
      dts({
        tsconfigPath: resolve(packageDir, 'tsconfig.json'),
        entryRoot: srcDir,
        outDir,
        rollupTypes: true,
        bundledPackages: bundleWorkspacePkgs,
        insertTypesEntry: true,
        copyDtsFiles: false,
        logLevel: 'warn',
      }),
    ],
    logLevel: 'warn',
  });
}
