import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import url from '@rollup/plugin-url';
import { resolve } from 'path';
import atImport from 'postcss-import';
import analyzer from 'rollup-plugin-analyzer';
import esbuild from 'rollup-plugin-esbuild';
import ignoreImport from 'rollup-plugin-ignore-import';
import multiInput from 'rollup-plugin-multi-input';
import postcss from 'rollup-plugin-postcss';
import staticImport from 'rollup-plugin-static-import';
import styles from 'rollup-plugin-styles';
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

import pkg from '../package.json';

const name = 'TDesign Web Components';
const externalDeps = Object.keys(pkg.dependencies || {});
const externalPeerDeps = Object.keys(pkg.peerDependencies || {});
const buildPlugins = ['vite-plugin-less-compiler'];

// 分析模式配置
const isAnalyze = process.env.ANALYZE === 'true';
const analyzeMode = process.env.ANALYZE_MODE || 'all'; // 'all', 'umd', 'lib', 'esm'

const banner = `/**
 * ${name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */
`;

// 获取分析插件
const getAnalyzePlugins = (buildType = 'umd') => {
  if (!isAnalyze && buildType !== 'umd') return [];
  
  const plugins = [];
  
  // 基础分析器 - 控制台输出
  plugins.push(
    analyzer({
      limit: 10,
      summaryOnly: false,
      hideDeps: false,
      showExports: true,
    })
  );
  
  // 可视化分析器 - 生成 HTML 报告
  if (isAnalyze || buildType === 'umd') {
    plugins.push(
      visualizer({
        filename: `dist/stats-${buildType}.html`,
        title: `${name} Bundle Analysis - ${buildType.toUpperCase()}`,
        template: 'treemap', // treemap, sunburst, network
        open: buildType === 'umd' && isAnalyze,
        gzipSize: true,
        brotliSize: true,
        projectRoot: resolve(__dirname, '..'),
      })
    );
    
    // 生成多种格式的报告
    if (buildType === 'umd') {
      plugins.push(
        visualizer({
          filename: `dist/stats-${buildType}-sunburst.html`,
          title: `${name} Bundle Analysis - ${buildType.toUpperCase()} (Sunburst)`,
          template: 'sunburst',
          open: false,
          gzipSize: true,
          brotliSize: true,
          projectRoot: resolve(__dirname, '..'),
        }),
        visualizer({
          filename: `dist/stats-${buildType}-network.html`,
          title: `${name} Bundle Analysis - ${buildType.toUpperCase()} (Network)`,
          template: 'network',
          open: false,
          gzipSize: true,
          brotliSize: true,
          projectRoot: resolve(__dirname, '..'),
        })
      );
    }
  }
  
  return plugins;
};

const input = 'src/index-lib.ts';
const inputList = [
  'src/**/*.ts',
  'src/**/*.jsx',
  'src/**/*.tsx',
  '!src/**/_example',
  '!src/**/*.d.ts',
  '!src/**/__tests__',
  '!src/**/_usage',
];

const getPlugins = ({ env, isProd = false, ignoreLess = false } = {}) => {
  const plugins = [
    nodeResolve(),
    commonjs(),
    esbuild({
      include: /\.[jt]sx?$/,
      target: 'esnext',
      minify: false,
      loader: 'tsx',
      jsxFactory: 'Component.h',
      jsxFragment: 'Component.f',
      tsconfig: resolve(__dirname, '../tsconfig.build.json'),
      loaders: {
        '.less': 'css',
      },
    }),
    babel({
      babelHelpers: 'runtime',
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
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

  // css
  if (!ignoreLess) {
    plugins.push(
      postcss({
        extract: false,
        minimize: isProd,
        sourceMap: !isProd,
        inject: false,
        extensions: ['.sass', '.scss', '.css', '.less'],
        plugins: [atImport()],
      }),
    );
  } else {
    plugins.push(
      staticImport({
        include: ['src/**/style/index.js', 'src/_common/style/web/**/*.less', 'src/**/style/*.less'],
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
          /* eslint-disable */
          ascii_only: true,
          /* eslint-enable */
        },
      }),
    );
  }

  return plugins;
};

const cssConfig = {
  input: ['src/style/index.js'],
  plugins: [multiInput(), styles({ mode: 'extract' })],
  output: {
    banner,
    dir: 'lib/',
    sourcemap: true,
    assetFileNames: '[name].css',
  },
};

const umdCssConfig = {
  input: ['src/style/index.js'],
  plugins: [multiInput(), styles({ mode: 'extract' })],
  output: {
    banner,
    dir: 'dist/',
    sourcemap: true,
    assetFileNames: 'tdesign.css',
  },
};

// 按需加载组件
const libConfig = {
  input: inputList.concat('!src/index-lib.ts'),
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput()]
    .concat(getPlugins())
    .concat(isAnalyze && (analyzeMode === 'all' || analyzeMode === 'lib') ? getAnalyzePlugins('lib') : []),
  output: {
    banner,
    dir: 'lib/',
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

// 按需加载组件 带原始 less 文件，可定制主题
const esmConfig = {
  input: inputList.concat('!src/index-lib.ts'),
  // treeshake: false,
  // preserveModules: true,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput()]
    .concat(getPlugins({ ignoreLess: true }))
    .concat(isAnalyze && (analyzeMode === 'all' || analyzeMode === 'esm') ? getAnalyzePlugins('esm') : []),
  output: {
    banner,
    dir: 'esm/',
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

// commonjs 导出规范
const cjsConfig = {
  input: inputList,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput()].concat(getPlugins()),
  output: {
    banner,
    dir: 'cjs/',
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
    chunkFileNames: '_chunks/dep-[hash].js',
  },
};

const umdConfig = {
  input,
  external: externalPeerDeps,
  plugins: getPlugins({
    env: 'development',
  }).concat(getAnalyzePlugins('umd')),
  output: {
    name: 'TDesign',
    banner,
    format: 'umd',
    exports: 'named',
    globals: { omi: 'omi', lodash: '_' },
    sourcemap: true,
    file: `dist/${name}.js`,
    // 禁止代码分割，内联所有动态导入
    inlineDynamicImports: true,
  },
};

const umdMinConfig = {
  input,
  external: externalPeerDeps,
  plugins: getPlugins({
    isProd: true,
    env: 'production',
  }).concat(isAnalyze && (analyzeMode === 'all' || analyzeMode === 'umd') ? getAnalyzePlugins('umd-min') : []),
  output: {
    name: 'TDesign',
    banner,
    format: 'umd',
    exports: 'named',
    globals: { omi: 'omi', lodash: '_' },
    sourcemap: true,
    file: `dist/${name}.min.js`,
    // 禁止代码分割，内联所有动态导入
    inlineDynamicImports: true,
  },
};

const pluginConfig = buildPlugins.map((plugin) => ({
  input: `plugins/${plugin}.ts`,
  external: ['less', 'fs'],
  plugins: [
    nodeResolve(),
    commonjs(),
    esbuild({
      include: /\.[jt]s$/,
      target: 'esnext',
      minify: false,
      loader: 'ts',
      tsconfig: resolve(__dirname, '../tsconfig.build.json'),
    }),
  ],
  output: {
    banner,
    format: 'esm',
    sourcemap: false,
    file: `plugins/${plugin}.js`,
  },
}));

export default [cssConfig, umdCssConfig, libConfig, cjsConfig, umdConfig, umdMinConfig, esmConfig, ...pluginConfig];
