import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { createRollupConfig } from '../../script/rollup.base.mjs';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 源码目录（@tdesign/components）
const srcDir = resolve(__dirname, '../components');

export default createRollupConfig({
  pkg,
  packageName: '@tdesign/web-components',
  packageDir: __dirname,
  srcDir,
  dtsEntry: resolve(srcDir, 'index.ts'),
});
