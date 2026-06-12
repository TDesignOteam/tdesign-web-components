import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import url from '@rollup/plugin-url';
import fg from 'fast-glob';
import { dirname, resolve } from 'path';
import atImport from 'postcss-import';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import { fileURLToPath } from 'url';

import { getWorkspaceRoot } from './lib/get-root-path.mjs';

const monorepoRoot = getWorkspaceRoot(dirname(fileURLToPath(import.meta.url)));

// 共享 banner 生成
const createBanner = (pkg) =>
  `/**\n * ${pkg.name} v${pkg.version}\n * (c) ${new Date().getFullYear()} ${pkg.author || 'TDesign'}\n * @license ${pkg.license || 'MIT'}\n */\n`;

// monorepo 路径别名
const commonDir = resolve(monorepoRoot, 'common-utils/_common');

const aliasPlugin = alias({
  entries: [
    // @tdesign 包别名
    { find: '@tdesign/web-components', replacement: resolve(monorepoRoot, 'packages/components') },
    { find: /^@tdesign\/web-components\/(.*)/, replacement: resolve(monorepoRoot, 'packages/components/$1') },
    { find: '@tdesign/web-components-shared', replacement: resolve(monorepoRoot, 'packages/shared/src') },
    { find: /^@tdesign\/web-components-shared\/(.*)/, replacement: resolve(monorepoRoot, 'packages/shared/src/$1') },
    { find: '@tdesign/ai-chat-engine', replacement: resolve(monorepoRoot, 'common-utils/_ai-core/packages/chat-engine') },
    { find: '@tdesign/ai-shared', replacement: resolve(monorepoRoot, 'common-utils/_ai-core/packages/shared') },
    // @common 别名（JS 和样式）
    { find: /^@common\/(js|style)\/(.*)/, replacement: `${commonDir}/$1/$2` },
  ],
});

// 简化的 Less 别名处理
const lessAliasPlugin = {
  install(less, pluginManager) {
    class AliasFM extends less.FileManager {
      supports(filename) {
        return filename.startsWith('@common/');
      }

      // eslint-disable-next-line func-names
      loadFile(filename, ...args) {
        const resolved = filename.replace(/^@common\//, `${resolve(monorepoRoot, 'common-utils/_common')}/`);
        return super.loadFile.call(this, resolved, ...args);
      }
    }
    pluginManager.addFileManager(new AliasFM());
  },
};

// workspace 包列表（这些包会被打包进产物，而非设为 external）
const workspacePkgs = ['@tdesign/web-components', '@tdesign/ai-chat-engine', '@tdesign/ai-shared'];

// 需要设为 external 的包
const alwaysExternal = [/tailwind-merge/];

// 检查是否为 workspace 包
const isWorkspacePkg = (id) => workspacePkgs.some((p) => id === p || id.startsWith(`${p}/`));

// 共享插件配置
const createPlugins = (pkg, packageDir) => [
  aliasPlugin,
  nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'] }),
  commonjs(),
  esbuild({
    include: /\.[jt]sx?$/,
    target: 'esnext',
    minify: false,
    jsxFactory: 'Component.h',
    jsxFragment: 'Component.f',
    loaders: { '.less': 'css', '.ts': 'ts', '.tsx': 'tsx' },
  }),
  json(),
  url(),
  replace({
    preventAssignment: true,
    values: {
      __VERSION__: JSON.stringify(pkg.version),
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  }),
  postcss({
    extract: resolve(packageDir, 'lib/style/[name].css'),
    minimize: true,
    sourceMap: true,
    extensions: ['.css', '.less'],
    plugins: [atImport()],
    use: [['less', { plugins: [lessAliasPlugin] }]],
  }),
];

/**
 * 创建 JS 构建配置
 */
export function createRollupConfig({ pkg, packageDir, srcDir: _srcDir }) {
  const srcDir = _srcDir || packageDir;
  const inputList = [
    `${srcDir}/**/*.ts`,
    `${srcDir}/**/*.tsx`,
    `!${srcDir}/**/node_modules/**`,
    `!${srcDir}/**/_example/**`,
    `!${srcDir}/**/__tests__/**`,
    `!${srcDir}/**/*.d.ts`,
  ];

  // 只将非 workspace 包设为 external
  const deps = Object.keys(pkg.dependencies || {});
  const peerDeps = Object.keys(pkg.peerDependencies || {});
  const external = [...new Set([...deps, ...peerDeps].filter((p) => !isWorkspacePkg(p))), ...alwaysExternal];

  return {
    input: fg.sync(inputList, { absolute: true }),
    external,
    plugins: createPlugins(pkg, packageDir),
    output: {
      banner: createBanner(pkg),
      dir: resolve(packageDir, 'lib/'),
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: srcDir,
    },
  };
}

/**
 * 创建 DTS 构建配置
 */
export function createDtsConfig({ pkg, packageDir, srcDir: _srcDir, input = 'index.ts' }) {
  const srcDir = _srcDir || packageDir;
  const deps = Object.keys(pkg.dependencies || {});
  const peerDeps = Object.keys(pkg.peerDependencies || {});
  // 只将非 workspace 包设为 external
  const allExternal = [...new Set([...deps, ...peerDeps].filter((p) => !isWorkspacePkg(p))), ...alwaysExternal];

  return {
    input: typeof input === 'string' ? resolve(srcDir, input) : input,
    external: [...allExternal, /^node_modules\//, /^cherry-markdown/, /^lodash-es/],
    plugins: [
      aliasPlugin,
      dts({ tsconfig: resolve(packageDir, 'tsconfig.json'), respectExternal: true }),
    ],
    output: {
      banner: createBanner(pkg),
      file: resolve(packageDir, 'lib/index.d.ts'),
      format: 'esm',
    },
  };
}

export default createRollupConfig;
