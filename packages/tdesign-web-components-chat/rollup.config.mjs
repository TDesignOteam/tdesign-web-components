import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { createRollupConfig } from '../../script/rollup.base.mjs';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createRollupConfig({
  pkg,
  packageName: '@tdesign/web-components-chat',
  packageDir: __dirname,
  srcDir: resolve(__dirname, '../pro-components/chat'),
  dtsEntry: resolve(__dirname, '../pro-components/chat/index.ts'),
});
