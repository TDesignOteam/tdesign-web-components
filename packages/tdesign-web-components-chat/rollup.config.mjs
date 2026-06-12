import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { createDtsConfig, createPostcssConfig,createRollupConfig, createSharedPlugins } from '../../script/rollup.base.mjs';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = resolve(__dirname, '../pro-components/chat');
const dtsInput = resolve(srcDir, 'index.ts');

// JS 构建配置
const jsConfig = createRollupConfig({
  pkg,
  packageName: '@tdesign/web-components-chat',
  packageDir: __dirname,
  srcDir,
});

// DTS 构建配置
const dtsConfig = createDtsConfig({
  pkg,
  packageName: '@tdesign/web-components-chat',
  packageDir: __dirname,
  srcDir,
  input: dtsInput,
});

// 为 JS 配置添加 postcss 插件
jsConfig.plugins = [...createSharedPlugins(pkg), createPostcssConfig(__dirname)];

export default [jsConfig, dtsConfig];
