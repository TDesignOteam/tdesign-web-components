import autoprefixer from 'autoprefixer';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { build, type Plugin, type UserConfig } from 'vite';

import { createLibDtsPlugin, libDtsOxcConfig } from './lib-dts.ts';
import { generateEntryPlugin } from './generate-entry.ts';
import { getWorkspaceRoot } from './get-root-path.ts';
import { cleanPublishArtifacts, LIB_BUILD_PATHS } from './lib-pipeline-utils.ts';
import { runLibPostProcess } from './lib-post-process.ts';
import { createComponentStylePlugin } from './component-plugins.ts';
import { runPrepare } from './prepare.ts';
import {
  collectLibInputs,
  createBanner,
  createIifeExternal,
  createIifeGlobals,
  createLessPreprocessorOptions,
  createLibExternal,
  createMonorepoAliasConfig,
  createPreserveModuleFileName,
  libOxcConfig,
} from './shared.ts';

export interface LibViteOptions {
  pkg: {
    name: string;
    version: string;
    author?: string;
    license?: string;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
  packageDir: string;
  srcDir: string;
  generateEntry?: boolean;
  iifeGlobalName: string;
  iifeExternals?: string[];
  iifeGlobals?: Record<string, string>;
  pipeline: {
    refreshCommonTypes?: boolean;
    requireUiBuilt?: boolean;
  };
}

const MULTI_FORMAT_NOOP_ID = '\0lib-multi-format:noop';
const IIFE_PROCESS_SHIM = 'var process=globalThis.process||{env:{NODE_ENV:"production"}};\n';

function createSharedPlugins(monorepoRoot: string, generateEntry: boolean) {
  return [
    ...(generateEntry ? [generateEntryPlugin(resolve(monorepoRoot, 'packages/components'))] : []),
    createComponentStylePlugin(),
  ];
}

function createSharedUserConfig(
  options: LibViteOptions,
  monorepoRoot: string,
): Pick<UserConfig, 'root' | 'oxc' | 'resolve' | 'define' | 'css' | 'logLevel'> {
  return {
    root: options.packageDir,
    oxc: libOxcConfig,
    resolve: { alias: createMonorepoAliasConfig(monorepoRoot) },
    define: {
      __VERSION__: JSON.stringify(options.pkg.version),
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    css: {
      postcss: { plugins: [autoprefixer()] },
      preprocessorOptions: createLessPreprocessorOptions(monorepoRoot),
    },
    logLevel: 'warn',
  };
}

function createEsmConfig(options: LibViteOptions): UserConfig {
  const monorepoRoot = getWorkspaceRoot(options.packageDir);

  return {
    ...createSharedUserConfig(options, monorepoRoot),
    oxc: { ...libOxcConfig, ...libDtsOxcConfig },
    build: {
      outDir: resolve(options.packageDir, 'esm'),
      // 发布目录已由构建流水线统一清理，嵌套 Vite 构建不再各自处理目录。
      emptyOutDir: false,
      sourcemap: true,
      minify: false,
      cssCodeSplit: true,
      rolldownOptions: {
        input: collectLibInputs(options.srcDir),
        external: createLibExternal(options.pkg),
        output: {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: options.srcDir,
          banner: createBanner(options.pkg),
          entryFileNames: createPreserveModuleFileName(options.srcDir, monorepoRoot),
          chunkFileNames: '_chunks/dep-[hash].js',
        },
      },
    },
    plugins: [...createSharedPlugins(monorepoRoot, options.generateEntry ?? false), createLibDtsPlugin(options.srcDir)],
  };
}

function createIifeConfig(options: LibViteOptions): UserConfig {
  const monorepoRoot = getWorkspaceRoot(options.packageDir);
  const fileName = `${options.pkg.name.split('/').at(-1)}.min.js`;

  return {
    ...createSharedUserConfig(options, monorepoRoot),
    build: {
      outDir: resolve(options.packageDir, 'dist'),
      emptyOutDir: false,
      sourcemap: true,
      minify: 'oxc',
      cssCodeSplit: false,
      lib: {
        entry: resolve(options.srcDir, 'browser.ts'),
        name: options.iifeGlobalName,
        formats: ['iife'],
        fileName: () => fileName,
      },
      rolldownOptions: {
        external: createIifeExternal(options.iifeExternals),
        output: {
          banner: `${createBanner(options.pkg)}${IIFE_PROCESS_SHIM}`,
          globals: createIifeGlobals(options.iifeGlobals),
        },
      },
    },
    plugins: [createComponentStylePlugin()],
  };
}

function createEsmIifeBuildPlugin(options: LibViteOptions): Plugin {
  let dispatched = false;
  const monorepoRoot = getWorkspaceRoot(options.packageDir);

  function prepareBuild() {
    if (options.pipeline.requireUiBuilt) {
      const uiEsm = resolve(monorepoRoot, LIB_BUILD_PATHS.uiPublish, 'esm/index.d.ts');
      if (!existsSync(uiEsm)) throw new Error('请先 pnpm run build:ui');
    }

    cleanPublishArtifacts(options.packageDir);
    runPrepare(monorepoRoot, { refreshCommonTypes: options.pipeline.refreshCommonTypes ?? true });
  }

  return {
    name: 'lib-esm-iife-build',
    apply: 'build',
    enforce: 'pre',
    config() {
      // Vite 仅接受一个配置；实际的 ESM/IIFE 构建在 buildStart 中顺序执行。
      return { build: { write: false, emptyOutDir: false, rolldownOptions: { input: MULTI_FORMAT_NOOP_ID } } };
    },
    resolveId(id) {
      return id === MULTI_FORMAT_NOOP_ID ? MULTI_FORMAT_NOOP_ID : undefined;
    },
    load(id) {
      return id === MULTI_FORMAT_NOOP_ID ? 'export default {}' : undefined;
    },
    async buildStart() {
      if (dispatched) return;
      dispatched = true;

      prepareBuild();

      console.log('[lib-esm-iife-build] esm...');
      await build({ configFile: false, ...createEsmConfig(options) });

      console.log('[lib-esm-iife-build] iife...');
      await build({ configFile: false, ...createIifeConfig(options) });

      await runLibPostProcess(options, getWorkspaceRoot(options.packageDir));
    },
  };
}

export function createLibBuildConfig(options: LibViteOptions): UserConfig {
  return {
    root: options.packageDir,
    plugins: [createEsmIifeBuildPlugin(options)],
  };
}
