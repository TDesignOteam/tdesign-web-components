import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import fg from 'fast-glob';
import { dirname, resolve } from 'path';
import atImport from 'postcss-import';
import analyzer from 'rollup-plugin-analyzer';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import styles from 'rollup-plugin-styles';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from 'url';

import { getWorkspaceRoot } from './lib/get-root-path.mjs';

const monorepoRoot = getWorkspaceRoot(dirname(fileURLToPath(import.meta.url)));

// monorepo 路径别名（模块级，createRollupConfig 和 createDtsConfig 共享）
const aliasPlugin = alias({
  entries: [
    { find: /^@common\/(.*)/, replacement: resolve(monorepoRoot, 'common-utils/_common/$1') },
    {
      find: /^@tdesign\/web-components-shared\/(.*)/,
      replacement: resolve(monorepoRoot, 'packages/shared/src/$1'),
    },
    {
      find: '@tdesign/web-components-shared',
      replacement: resolve(monorepoRoot, 'packages/shared/src/index.ts'),
    },
    { find: /^@tdesign\/web-components-ui\/(.*)/, replacement: resolve(monorepoRoot, 'packages/components/$1') },
    { find: '@tdesign/web-components-ui', replacement: resolve(monorepoRoot, 'packages/components/index.ts') },
    { find: /^@tdesign\/web-components-chat\/(.*)/, replacement: resolve(monorepoRoot, 'packages/pro-components/chat/$1') },
    { find: '@tdesign/web-components-chat', replacement: resolve(monorepoRoot, 'packages/pro-components/chat/index.ts') },
    {
      find: /^@tdesign\/ai-chat-engine\/(.*)/,
      replacement: resolve(monorepoRoot, 'common-utils/_ai-core/packages/chat-engine/$1'),
    },
    {
      find: '@tdesign/ai-chat-engine',
      replacement: resolve(monorepoRoot, 'common-utils/_ai-core/packages/chat-engine/index.ts'),
    },
    {
      find: /^@tdesign\/ai-shared\/(.*)/,
      replacement: resolve(monorepoRoot, 'common-utils/_ai-core/packages/shared/$1'),
    },
    {
      find: '@tdesign/ai-shared',
      replacement: resolve(monorepoRoot, 'common-utils/_ai-core/packages/shared/index.ts'),
    },
  ],
});

// 分析模式配置
const isAnalyze = process.env.ANALYZE === 'true';
const analyzeMode = process.env.ANALYZE_MODE || 'all';

/**
 * 创建 Rollup 配置工厂函数
 * @param {Object} options
 * @param {Object} options.pkg - package.json 内容
 * @param {string} options.packageName - 包显示名称
 * @param {string} options.packageDir - 包目录绝对路径
 * @param {string} [options.input] - UMD 入口文件
 * @param {string[]} [options.inputList] - 按需加载入口文件列表
 * @param {string} [options.umdGlobalName] - UMD 全局变量名
 * @param {Object} [options.globals] - UMD external globals
 * @param {string[]} [options.additionalExternal] - 额外的 external 依赖
 * @param {boolean} [options.skipCss] - 是否跳过 CSS 构建
 * @returns {Object[]} Rollup 配置数组
 */
export function createRollupConfig({
  pkg,
  packageName,
  packageDir,
  srcDir: _srcDir,
  input = 'index.ts',
  inputList: _inputList,
  umdGlobalName = 'TDesign',
  globals = { omi: 'omi', lodash: '_' },
  additionalExternal = [],
  skipCss = false,
}) {
  // 源码目录，默认等于 packageDir（源码与产物同目录时）
  const srcDir = _srcDir || packageDir;

  // 默认 inputList，允许外部覆盖
  const inputList = _inputList || [
    `${srcDir}/**/*.ts`,
    `${srcDir}/**/*.jsx`,
    `${srcDir}/**/*.tsx`,
    `!${srcDir}/**/node_modules/**`,
    `!${srcDir}/**/_example/**`,
    `!${srcDir}/**/*.d.ts`,
    `!${srcDir}/**/__tests__/**`,
    `!${srcDir}/**/_usage/**`,
    `!${srcDir}/**/mock/**`,
    `!${srcDir}/site/**`,
  ];
  const externalDeps = Object.keys(pkg.dependencies || {});
  const externalPeerDeps = Object.keys(pkg.peerDependencies || {});

  const banner = `/**
 * ${packageName} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */
`;

  // 使用 fast-glob 解析 inputList
  const resolvedInput = fg.sync(inputList, { absolute: true });

  // 获取分析插件
  const getAnalyzePlugins = (buildType = 'umd') => {
    if (!isAnalyze && buildType !== 'umd') return [];

    const plugins = [];

    plugins.push(
      analyzer({
        limit: 10,
        summaryOnly: false,
        hideDeps: false,
        showExports: true,
      }),
    );

    if (isAnalyze || buildType === 'umd') {
      plugins.push(
        visualizer({
          filename: resolve(packageDir, `dist/stats-${buildType}.html`),
          title: `${packageName} Bundle Analysis - ${buildType.toUpperCase()}`,
          template: 'treemap',
          open: buildType === 'umd' && isAnalyze,
          gzipSize: true,
          brotliSize: true,
          projectRoot: packageDir,
        }),
      );
    }

    return plugins;
  };

  // Less 别名插件：将 @common/ 解析为 common-utils/_common/
  const lessAliasPlugin = {
    install(less, pluginManager) {
      class AliasFileManager extends less.FileManager {
        supportsSync() {
          return false;
        }

        supports(filename) {
          return filename.startsWith('@common/');
        }

        loadFile(filename, currentDirectory, options, environment) {
          const resolved = filename.replace(/^@common\//, `${resolve(monorepoRoot, 'common-utils/_common')}/`);
          return super.loadFile(resolved, currentDirectory, options, environment);
        }
      }
      pluginManager.addFileManager(new AliasFileManager());
    },
  };

  const getPlugins = ({ env, isProd = false, ignoreLess = false } = {}) => {
    const plugins = [
      aliasPlugin,
      nodeResolve({
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
      }),
      commonjs(),
      esbuild({
        include: /\.[jt]sx?$/,
        target: 'esnext',
        minify: false,
        loader: 'tsx',
        jsxFactory: 'Component.h',
        jsxFragment: 'Component.f',
        tsconfig: resolve(packageDir, 'tsconfig.json'),
        loaders: {
          '.less': 'css',
        },
      }),
      json(),
      url(),
      replace({
        preventAssignment: true,
        values: {
          __VERSION__: JSON.stringify(pkg.version),
        },
      }),
    ];

    if (!ignoreLess) {
      plugins.push(
        postcss({
          extract: false,
          minimize: isProd,
          sourceMap: !isProd,
          inject: false,
          extensions: ['.sass', '.scss', '.css', '.less'],
          plugins: [atImport()],
          use: [
            [
              'less',
              {
                javascriptEnabled: true,
                plugins: [lessAliasPlugin],
              },
            ],
          ],
        }),
      );
    } else {
      // ESM 构建：提取 less 为独立 CSS 文件
      plugins.push(
        styles({
          mode: 'extract',
          extensions: ['.less', '.css'],
          use: ['less', 'css-loader'],
          less: {
            javascriptEnabled: true,
            plugins: [lessAliasPlugin],
          },
          url: {
            inline: true,
          },
        }),
      );
    }

    if (env) {
      plugins.push(
        replace({
          preventAssignment: true,
          values: {
            'process.env.NODE_ENV': JSON.stringify(env),
          },
        }),
      );
    }

    if (isProd) {
      plugins.push(
        terser({
          output: {
            ascii_only: true,
          },
        }),
      );
    }

    return plugins;
  };

  const allExternal = [...externalDeps, ...externalPeerDeps, ...additionalExternal];

  // CSS 配置
  const cssConfig = {
    input: resolve(srcDir, 'style/index.js'),
    plugins: [aliasPlugin, styles({ mode: 'extract' })],
    output: {
      banner,
      dir: resolve(packageDir, 'lib/'),
      sourcemap: true,
      assetFileNames: '[name].css',
    },
  };

  // 按需加载组件 (lib) — 使用 preserveModules 替代 rollup-plugin-multi-input
  const libConfig = {
    input: resolvedInput,
    external: allExternal,
    plugins: getPlugins().concat(
      isAnalyze && (analyzeMode === 'all' || analyzeMode === 'lib') ? getAnalyzePlugins('lib') : [],
    ),
    output: {
      banner,
      dir: resolve(packageDir, 'lib/'),
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: srcDir,
      chunkFileNames: '_chunks/dep-[hash].js',
    },
  };

  // ESM 配置（带原始 less）
  const esmConfig = {
    input: resolvedInput,
    external: allExternal,
    plugins: getPlugins({ ignoreLess: true }).concat(
      isAnalyze && (analyzeMode === 'all' || analyzeMode === 'esm') ? getAnalyzePlugins('esm') : [],
    ),
    output: {
      banner,
      dir: resolve(packageDir, 'esm/'),
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: srcDir,
      chunkFileNames: '_chunks/dep-[hash].js',
    },
  };

  // CJS 配置
  const cjsConfig = {
    input: resolvedInput,
    external: allExternal,
    plugins: getPlugins(),
    output: {
      banner,
      dir: resolve(packageDir, 'cjs/'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: srcDir,
      chunkFileNames: '_chunks/dep-[hash].js',
    },
  };

  const umdExternal = [...externalPeerDeps, ...additionalExternal];

  // UMD 配置（input 在外部已解析为绝对路径）
  const umdInput = typeof input === 'string' && !input.startsWith('/') ? resolve(srcDir, input) : input;

  const umdConfig = {
    input: umdInput,
    external: umdExternal,
    plugins: getPlugins({
      env: 'development',
    }).concat(getAnalyzePlugins('umd')),
    output: {
      name: umdGlobalName,
      banner,
      format: 'umd',
      exports: 'named',
      globals,
      sourcemap: true,
      file: resolve(packageDir, `dist/${packageName}.js`),
      inlineDynamicImports: true,
    },
  };

  // UMD 压缩版
  const umdMinConfig = {
    input: umdInput,
    external: umdExternal,
    plugins: getPlugins({
      isProd: true,
      env: 'production',
    }).concat(isAnalyze && (analyzeMode === 'all' || analyzeMode === 'umd') ? getAnalyzePlugins('umd-min') : []),
    output: {
      name: umdGlobalName,
      banner,
      format: 'umd',
      exports: 'named',
      globals,
      sourcemap: true,
      file: resolve(packageDir, `dist/${packageName}.min.js`),
      inlineDynamicImports: true,
    },
  };

  const configs = [libConfig, esmConfig, cjsConfig, umdConfig, umdMinConfig];

  // 只有当 src/style/index.js 存在时才添加 CSS 配置
  if (!skipCss) {
    configs.unshift(cssConfig);
  }

  return configs;
}

/**
 * 创建 .d.ts 类型声明构建配置（独立步骤，替代 tsc + generate-declarations）
 *
 * 使用 rollup-plugin-dts 从源码直接生成与 Rollup 输出结构匹配的 .d.ts 文件。
 * 必须作为独立命令运行（不能与其他 config 合并），因为插件需要独占 Rollup 实例。
 */
export function createDtsConfig({ pkg, packageName, packageDir, srcDir: _srcDir, input = 'index.ts', additionalExternal = [] }) {
  const srcDir = _srcDir || packageDir;
  const banner = `/**
 * ${packageName} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */
`;

  // 所有依赖 + peerDependencies 均视为外部（dts 只生成本包的类型声明）
  const externalDeps = Object.keys(pkg.dependencies || {});
  const externalPeerDeps = Object.keys(pkg.peerDependencies || {});
  const allExternal = [...externalDeps, ...externalPeerDeps, ...additionalExternal];

  const dtsInput = typeof input === 'string' && !input.startsWith('/') ? resolve(srcDir, input) : input;

  return {
    input: dtsInput,
    external: [...allExternal, /^node_modules\//, /^cherry-markdown/, /^lodash-es/, /^@types/],
    plugins: [
      aliasPlugin,
      {
        // 忽略 node_modules 中无法解析的类型引用（如 cherry-markdown 的 broken .d.ts）
        resolveId(source) {
          // 跳过无法解析的 node_modules 内部类型路径
          if (source.includes('node_modules') && source.includes('../')) {
            return false; // 标记为外部，不报错
          }
          return null; // 继续正常解析
        },
      },
      dts({
        tsconfig: resolve(packageDir, 'tsconfig.json'),
        respectExternal: true,
        compilerOptions: {
          // 不设 rootDir，允许 tsc 解析 paths alias 指向的外部源码
          // preserveModulesRoot 控制输出路径结构，与 Rollup JS 输出保持一致
        },
      }),
    ],
    output: {
      banner,
      dir: resolve(packageDir, 'lib/'),
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: srcDir,
    },
  };
}

export default createRollupConfig;
