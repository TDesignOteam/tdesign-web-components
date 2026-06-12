import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { createRollupConfig, createDtsConfig } from '../../script/rollup.base.mjs';
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

export default [jsConfig, dtsConfig];
