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
  packageName: 'tdesign-web-components',
  packageDir: __dirname,
  // 输入源码目录（相对于 packageDir）
  srcDir,
  input: resolve(srcDir, 'index.ts'),
  inputList: [
    `${srcDir}/**/*.ts`,
    `${srcDir}/**/*.tsx`,
    `!${srcDir}/**/node_modules/**`,
    `!${srcDir}/**/_example/**`,
    `!${srcDir}/**/*.d.ts`,
    `!${srcDir}/**/__tests__/**`,
    `!${srcDir}/**/_usage/**`,
    `!${srcDir}/**/mock/**`,
    `!${srcDir}/site/**`,
  ],
  umdGlobalName: 'TDesignUI',
  globals: { omi: 'omi', 'lodash-es': '_' },
});
