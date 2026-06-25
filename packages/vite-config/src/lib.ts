import autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import type { UserConfig } from 'vite';

import { generateEntryPlugin } from './generate-entry.mjs';
import { getWorkspaceRoot } from './get-root-path.mjs';
import omiStyleImportPlugin from './plugins/omi-style.js';
import {
  collectLibInputs,
  createBanner,
  createLessPreprocessorOptions,
  createLibExternal,
  createMonorepoAliasConfig,
  createUmdExternal,
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
  /** 额外 external（如 Chat 的 UI / ai） */
  additionalExternal?: string[];
  /** 构建前自动生成 packages/components/index.ts */
  generateEntry?: boolean;
  /** UMD 全局变量名 */
  umdGlobalName?: string;
  /** UMD external 对应的全局名 */
  umdGlobals?: Record<string, string>;
}

type LibBuildTarget = 'lib' | 'esm' | 'cjs' | 'umd' | 'umd-min';

const PRESERVE_MODULE_TARGETS: LibBuildTarget[] = ['lib', 'esm', 'cjs'];

function createSharedPlugins(
  monorepoRoot: string,
  generateEntry: boolean,
  componentsDir: string,
) {
  return [
    ...(generateEntry ? [generateEntryPlugin(componentsDir)] : []),
    omiStyleImportPlugin(),
  ];
}

function createSharedUserConfig(
  options: LibViteOptions,
  monorepoRoot: string,
): Pick<UserConfig, 'root' | 'oxc' | 'resolve' | 'define' | 'css' | 'logLevel'> {
  const { pkg, packageDir } = options;

  return {
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
      postcss: {
        plugins: [autoprefixer()],
      },
      preprocessorOptions: createLessPreprocessorOptions(monorepoRoot),
    },
    logLevel: 'warn',
  };
}

function createPreserveModulesConfig(
  options: LibViteOptions,
  target: 'lib' | 'esm' | 'cjs',
  emptyOutDir: boolean,
): UserConfig {
  const {
    pkg,
    packageDir,
    srcDir,
    bundleWorkspacePkgs = defaultBundleWorkspacePkgs,
    additionalExternal = [],
    generateEntry = false,
  } = options;
  const monorepoRoot = getWorkspaceRoot(packageDir);
  const outDir = resolve(packageDir, target === 'lib' ? 'lib' : target);
  const input = collectLibInputs(srcDir);
  const format = target === 'cjs' ? 'cjs' : 'es';

  return {
    ...createSharedUserConfig(options, monorepoRoot),
    build: {
      outDir,
      emptyOutDir,
      sourcemap: true,
      minify: false,
      cssCodeSplit: true,
      rolldownOptions: {
        input,
        external: createLibExternal(pkg, bundleWorkspacePkgs, additionalExternal),
        treeshake: false,
        output: {
          format,
          preserveModules: true,
          preserveModulesRoot: srcDir,
          banner: createBanner(pkg),
          entryFileNames: '[name].js',
          chunkFileNames: '_chunks/dep-[hash].js',
          ...(target === 'cjs' ? { exports: 'named' as const } : {}),
        },
      },
    },
    plugins: createSharedPlugins(
      monorepoRoot,
      generateEntry,
      resolve(monorepoRoot, 'packages/components'),
    ),
  };
}

function createUmdConfig(
  options: LibViteOptions,
  target: 'umd' | 'umd-min',
  emptyOutDir: boolean,
): UserConfig {
  const {
    pkg,
    packageDir,
    srcDir,
    additionalExternal = [],
    umdGlobalName = 'TDesign',
    umdGlobals = { omi: 'omi', 'lodash-es': '_' },
  } = options;
  const monorepoRoot = getWorkspaceRoot(packageDir);
  const outDir = resolve(packageDir, 'dist');
  const fileName = target === 'umd-min' ? `${pkg.name}.min.js` : `${pkg.name}.js`;

  return {
    ...createSharedUserConfig(options, monorepoRoot),
    build: {
      outDir,
      emptyOutDir,
      sourcemap: true,
      minify: target === 'umd-min',
      cssCodeSplit: false,
      rolldownOptions: {
        input: resolve(srcDir, 'index.ts'),
        external: createUmdExternal(pkg, additionalExternal),
        treeshake: false,
        output: {
          format: 'umd',
          name: umdGlobalName,
          globals: umdGlobals,
          banner: createBanner(pkg),
          dir: outDir,
          entryFileNames: fileName,
          inlineDynamicImports: true,
          exports: 'named',
        },
      },
    },
    plugins: [omiStyleImportPlugin()],
  };
}

/**
 * 创建组件库单格式 Vite 构建配置
 * @param target lib | esm | cjs | umd | umd-min
 */
export function createLibViteConfigForTarget(
  options: LibViteOptions,
  target: LibBuildTarget,
  { emptyOutDir = false }: { emptyOutDir?: boolean } = {},
): UserConfig {
  if (PRESERVE_MODULE_TARGETS.includes(target)) {
    return createPreserveModulesConfig(options, target as 'lib' | 'esm' | 'cjs', emptyOutDir);
  }
  return createUmdConfig(options, target as 'umd' | 'umd-min', emptyOutDir);
}

/**
 * 创建组件库多格式 Vite 构建配置（Vite 8 需分次构建，见 script/build/vite-lib-build.mjs）
 */
export function createLibViteConfigs(options: LibViteOptions): UserConfig[] {
  return (['lib', 'esm', 'cjs', 'umd', 'umd-min'] as LibBuildTarget[]).map((target, index) =>
    createLibViteConfigForTarget(options, target, { emptyOutDir: index === 0 }),
  );
}

/** 从环境变量 LIB_BUILD_TARGET 解析当前构建格式，默认 lib */
export function createLibViteConfigFromEnv(options: LibViteOptions): UserConfig {
  const target = (process.env.LIB_BUILD_TARGET as LibBuildTarget | undefined) || 'lib';
  const emptyOutDir = process.env.LIB_EMPTY_OUT_DIR === '1';
  return createLibViteConfigForTarget(options, target, { emptyOutDir });
}

/** @deprecated 请使用 createLibViteConfigFromEnv */
export function createLibViteConfig(options: LibViteOptions) {
  return createLibViteConfigFromEnv(options);
}
