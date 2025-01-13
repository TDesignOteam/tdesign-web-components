import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import url from '@rollup/plugin-url';
import { resolve } from 'path';
import analyzer from 'rollup-plugin-analyzer';
import esbuild from 'rollup-plugin-esbuild';
import ignoreImport from 'rollup-plugin-ignore-import';
import multiInput from 'rollup-plugin-multi-input';
import postcss from 'rollup-plugin-postcss';
import staticImport from 'rollup-plugin-static-import';
import styles from 'rollup-plugin-styles';
import { terser } from 'rollup-plugin-terser';

import pkg from '../package.json';

const name = 'TDesign Web Components';
const externalDeps = Object.keys(pkg.dependencies || {});
const externalPeerDeps = Object.keys(pkg.peerDependencies || {});
const buildPlugins = ['vite-plugin-less-compiler'];

const banner = `/**
 * ${name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */
`;

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
  plugins: [multiInput()].concat(getPlugins()),
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
  plugins: [multiInput()].concat(getPlugins({ ignoreLess: true })),
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
  }).concat(analyzer({ limit: 5, summaryOnly: true })),
  output: {
    name: 'TDesign',
    banner,
    format: 'umd',
    exports: 'named',
    globals: { omi: 'omi', lodash: '_' },
    sourcemap: true,
    file: `dist/${name}.js`,
  },
};

const umdMinConfig = {
  input,
  external: externalPeerDeps,
  plugins: getPlugins({
    isProd: true,
    env: 'production',
  }),
  output: {
    name: 'TDesign',
    banner,
    format: 'umd',
    exports: 'named',
    globals: { omi: 'omi', lodash: '_' },
    sourcemap: true,
    file: `dist/${name}.min.js`,
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
