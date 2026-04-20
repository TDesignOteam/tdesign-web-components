import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import url from '@rollup/plugin-url';
import { dirname, resolve } from 'path';
import atImport from 'postcss-import';
import analyzer from 'rollup-plugin-analyzer';
import esbuild from 'rollup-plugin-esbuild';
import ignoreImport from 'rollup-plugin-ignore-import';
import multiInput from 'rollup-plugin-multi-input';
import postcss from 'rollup-plugin-postcss';
import staticImportModule from 'rollup-plugin-static-import';
import styles from 'rollup-plugin-styles';
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from 'url';

const __rollupFilename = fileURLToPath(import.meta.url);
const __rollupDirname = dirname(__rollupFilename);
const monorepoRoot = resolve(__rollupDirname, '..');

const staticImport = staticImportModule.default || staticImportModule;

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
  input = 'src/index.ts',
  inputList = [
    'src/**/*.ts',
    'src/**/*.jsx',
    'src/**/*.tsx',
    '!src/**/_example/**',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/_usage/**',
    '!src/**/mock/**',
  ],
  umdGlobalName = 'TDesign',
  globals = { omi: 'omi', lodash: '_' },
  additionalExternal = [],
  skipCss = false,
}) {
  const externalDeps = Object.keys(pkg.dependencies || {});
  const externalPeerDeps = Object.keys(pkg.peerDependencies || {});

  const banner = `/**
 * ${packageName} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */
`;

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

  const getPlugins = ({ env, isProd = false, ignoreLess = false } = {}) => {
    const plugins = [
      alias({
        entries: [
          { find: /^@common\/(.*)/, replacement: resolve(monorepoRoot, 'packages/_common/$1') },
          {
            find: /^@tdesign\/web-components-shared\/(.*)/,
            replacement: resolve(monorepoRoot, 'packages/shared/src/$1'),
          },
          {
            find: '@tdesign/web-components-shared',
            replacement: resolve(monorepoRoot, 'packages/shared/src/index.ts'),
          },
          { find: /^@tdesign\/web-components-ui\/(.*)/, replacement: resolve(monorepoRoot, 'packages/ui/src/$1') },
          { find: '@tdesign/web-components-ui', replacement: resolve(monorepoRoot, 'packages/ui/src/index.ts') },
          { find: /^@tdesign\/web-components-chat\/(.*)/, replacement: resolve(monorepoRoot, 'packages/chat/src/$1') },
          { find: '@tdesign/web-components-chat', replacement: resolve(monorepoRoot, 'packages/chat/src/index.ts') },
          {
            find: /^@tdesign\/ai-chat-engine\/(.*)/,
            replacement: resolve(monorepoRoot, 'packages/_ai-core/packages/chat-engine/$1'),
          },
          {
            find: '@tdesign/ai-chat-engine',
            replacement: resolve(monorepoRoot, 'packages/_ai-core/packages/chat-engine/index.ts'),
          },
          {
            find: /^@tdesign\/ai-shared\/(.*)/,
            replacement: resolve(monorepoRoot, 'packages/_ai-core/packages/shared/$1'),
          },
          {
            find: '@tdesign/ai-shared',
            replacement: resolve(monorepoRoot, 'packages/_ai-core/packages/shared/index.ts'),
          },
        ],
      }),
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

    // Less 别名插件：将 @common/ 解析为 packages/_common/
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
            const resolved = filename.replace(/^@common\//, `${resolve(monorepoRoot, 'packages/_common')}/`);
            return super.loadFile(resolved, currentDirectory, options, environment);
          }
        }
        pluginManager.addFileManager(new AliasFileManager());
      },
    };

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
      plugins.push(
        staticImport({
          include: ['src/**/style/index.js', 'src/**/style/*.less'],
        }),
        ignoreImport({
          include: ['src/*/style/*'],
          body: 'import "./style/index.js";',
        }),
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
    input: [resolve(packageDir, 'src/style/index.js')],
    plugins: [
      alias({
        entries: [{ find: /^@common\/(.*)/, replacement: resolve(monorepoRoot, 'packages/_common/$1') }],
      }),
      multiInput(),
      styles({ mode: 'extract' }),
    ],
    output: {
      banner,
      dir: resolve(packageDir, 'lib/'),
      sourcemap: true,
      assetFileNames: '[name].css',
    },
  };

  // 将 inputList 中的相对路径解析为绝对路径（包括 `!` 前缀的负向 pattern）
  // 避免 fast-glob 因正负 pattern 路径形式不一致（绝对 vs 相对）而无法正确排除文件
  const resolveInputList = (list) =>
    list.map((p) => (p.startsWith('!') ? `!${resolve(packageDir, p.slice(1))}` : resolve(packageDir, p)));

  // 按需加载组件 (lib)
  const libConfig = {
    input: resolveInputList(inputList),
    external: allExternal,
    plugins: [multiInput()]
      .concat(getPlugins())
      .concat(isAnalyze && (analyzeMode === 'all' || analyzeMode === 'lib') ? getAnalyzePlugins('lib') : []),
    output: {
      banner,
      dir: resolve(packageDir, 'lib/'),
      format: 'esm',
      sourcemap: true,
      chunkFileNames: '_chunks/dep-[hash].js',
    },
  };

  // ESM 配置（带原始 less）
  const esmConfig = {
    input: resolveInputList(inputList),
    external: allExternal,
    plugins: [multiInput()]
      .concat(getPlugins({ ignoreLess: true }))
      .concat(isAnalyze && (analyzeMode === 'all' || analyzeMode === 'esm') ? getAnalyzePlugins('esm') : []),
    output: {
      banner,
      dir: resolve(packageDir, 'esm/'),
      format: 'esm',
      sourcemap: true,
      chunkFileNames: '_chunks/dep-[hash].js',
    },
  };

  // CJS 配置
  const cjsConfig = {
    input: resolveInputList(inputList),
    external: allExternal,
    plugins: [multiInput()].concat(getPlugins()),
    output: {
      banner,
      dir: resolve(packageDir, 'cjs/'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      chunkFileNames: '_chunks/dep-[hash].js',
    },
  };

  const umdExternal = [...externalPeerDeps, ...additionalExternal];

  // UMD 配置
  const umdConfig = {
    input: resolve(packageDir, input),
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
    input: resolve(packageDir, input),
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

export default createRollupConfig;
