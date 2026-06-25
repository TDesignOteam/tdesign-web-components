import autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import { generateEntryPlugin } from './generate-entry.mjs';
import { getWorkspaceRoot } from './get-root-path.mjs';
import omiStyleImportPlugin from './plugins/omi-style.js';
import {
  collectLibInputs,
  createBanner,
  createLessPreprocessorOptions,
  createLibExternal,
  createMonorepoAliasConfig,
  defaultBundleWorkspacePkgs,
  libOxcConfig,
} from './shared.ts';

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
  /** 构建前自动生成 packages/components/index.ts */
  generateEntry?: boolean;
}

/**
 * 创建组件库 Vite 构建配置（与文档站共用 Rolldown + Oxc + 样式插件）
 */
export function createLibViteConfig({
  pkg,
  packageDir,
  srcDir,
  bundleWorkspacePkgs = defaultBundleWorkspacePkgs,
  generateEntry = false,
}: LibViteOptions) {
  const monorepoRoot = getWorkspaceRoot(packageDir);
  const outDir = resolve(packageDir, 'lib');
  const input = collectLibInputs(srcDir);

  const plugins = [
    ...(generateEntry
      ? [generateEntryPlugin(resolve(monorepoRoot, 'packages/components'))]
      : []),
    omiStyleImportPlugin(),
  ];

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
      // 库构建仅处理组件 Less，不走文档站 Tailwind（避免空 content 警告与无效 CSS 处理）
      postcss: {
        plugins: [autoprefixer()],
      },
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
    plugins,
    logLevel: 'warn',
  });
}
