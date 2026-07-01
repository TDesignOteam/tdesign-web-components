import autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import { build, type Plugin, type UserConfig } from 'vite';

import { libBuildPipelinePlugin } from './lib-pipeline-plugin.ts';
import { createLibDtsPlugin, libDtsOxcConfig } from './lib-dts.ts';
import { generateEntryPlugin } from './generate-entry.mjs';
import { getWorkspaceRoot } from './get-root-path.mjs';
import { runLibPostProcess } from './lib-post-process.mjs';
import omiStyleImportPlugin from './plugins/omi-style.js';
import {
  collectLibInputs,
  createBanner,
  createLessPreprocessorOptions,
  createLibExternal,
  createMonorepoAliasConfig,
  createUmdExternal,
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
  /** 额外 external（如 Chat 的 UI / ai） */
  additionalExternal?: string[];
  /** 构建前自动生成 packages/components/index.ts */
  generateEntry?: boolean;
  /** UMD 全局变量名 */
  umdGlobalName?: string;
  /** UMD external 对应的全局名 */
  umdGlobals?: Record<string, string>;
  /** 发布包构建流水线（prepare + dts 后处理） */
  pipeline?: {
    /** vite build 前执行的 workspace tsc（仅依赖包，不含源码包） */
    tscFilters: string[];
    /** 是否刷新 common 类型缓存，chat 默认 false */
    refreshCommonTypes?: boolean;
    /** chat 构建前检查 UI 已构建 */
    requireUiBuilt?: boolean;
  };
}

type LibBuildTarget = 'lib' | 'esm' | 'cjs' | 'umd' | 'umd-min';

export type { LibBuildTarget };

const LIB_BUILD_TARGETS: LibBuildTarget[] = ['lib', 'esm', 'cjs', 'umd', 'umd-min'];
const PRESERVE_MODULE_TARGETS: LibBuildTarget[] = ['lib', 'esm', 'cjs'];

/** 占位入口，避免外层 vite build 写出多余产物 */
const MULTI_FORMAT_NOOP_ID = '\0lib-multi-format:noop';

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
    additionalExternal = [],
    generateEntry = false,
  } = options;
  const monorepoRoot = getWorkspaceRoot(packageDir);
  const outDir = resolve(packageDir, target === 'lib' ? 'lib' : target);
  const input = collectLibInputs(srcDir);
  const format = target === 'cjs' ? 'cjs' : 'es';
  const emitDts = target === 'lib';

  return {
    ...createSharedUserConfig(options, monorepoRoot),
    ...(emitDts
      ? {
          oxc: {
            ...libOxcConfig,
            ...libDtsOxcConfig,
          },
        }
      : {}),
    build: {
      outDir,
      emptyOutDir,
      sourcemap: true,
      minify: false,
      cssCodeSplit: true,
      rolldownOptions: {
        input,
        external: createLibExternal(pkg, additionalExternal),
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
    plugins: [
      ...createSharedPlugins(
        monorepoRoot,
        generateEntry,
        resolve(monorepoRoot, 'packages/components'),
      ),
      ...(emitDts ? [createLibDtsPlugin(srcDir)] : []),
    ],
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
 * 在单次 `vite build` 内顺序产出 lib / esm / cjs / umd / umd-min
 * （Vite 8 不支持配置数组，由插件内多次调用 build()）
 */
export function libMultiFormatPlugin(options: LibViteOptions): Plugin {
  let dispatched = false;

  return {
    name: 'lib-multi-format',
    apply: 'build',
    enforce: 'pre',
    config() {
      return {
        build: {
          write: false,
          emptyOutDir: false,
          rolldownOptions: { input: MULTI_FORMAT_NOOP_ID },
        },
      };
    },
    resolveId(id) {
      if (id === MULTI_FORMAT_NOOP_ID) return MULTI_FORMAT_NOOP_ID;
    },
    load(id) {
      if (id === MULTI_FORMAT_NOOP_ID) return 'export default {}';
    },
    async buildStart() {
      if (dispatched) return;
      dispatched = true;

      for (let i = 0; i < LIB_BUILD_TARGETS.length; i += 1) {
        const target = LIB_BUILD_TARGETS[i];
        console.log(`[lib-multi-format] ${target}...`);
        await build({
          configFile: false,
          ...createLibViteConfigForTarget(options, target, { emptyOutDir: i === 0 }),
        });
      }

      await runLibPostProcess(options, getWorkspaceRoot(options.packageDir));
    },
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

export function createLibViteConfigs(options: LibViteOptions): UserConfig[] {
  return LIB_BUILD_TARGETS.map((target, index) =>
    createLibViteConfigForTarget(options, target, { emptyOutDir: index === 0 }),
  );
}

/**
 * 调试单格式：LIB_BUILD_TARGET=umd LIB_EMPTY_OUT_DIR=1 vite build
 * @deprecated 推荐在 vite.config 内显式配置 plugins
 */
export function createLibViteConfigFromEnv(options: LibViteOptions): UserConfig {
  const singleTarget = getLibBuildTargetFromEnv();
  if (singleTarget) {
    return createLibViteConfigForTarget(options, singleTarget, {
      emptyOutDir: process.env.LIB_EMPTY_OUT_DIR === '1',
    });
  }

  return {
    root: options.packageDir,
    plugins: [
      ...(options.pipeline ? [libBuildPipelinePlugin(options)] : []),
      libMultiFormatPlugin(options),
    ],
  };
}

/** 从环境变量读取单格式调试目标 */
export function getLibBuildTargetFromEnv(): LibBuildTarget | undefined {
  return process.env.LIB_BUILD_TARGET as LibBuildTarget | undefined;
}

/** @deprecated 请使用 createLibViteConfigFromEnv */
export function createLibViteConfig(options: LibViteOptions) {
  return createLibViteConfigFromEnv(options);
}
