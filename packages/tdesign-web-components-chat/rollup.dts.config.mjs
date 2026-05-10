import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { createDtsConfig } from '../../script/rollup.base.mjs';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = resolve(__dirname, '../pro-components/chat');

export default createDtsConfig({
  pkg,
  packageName: '@tdesign/web-components-chat',
  packageDir: __dirname,
  srcDir,
  input: resolve(srcDir, 'index.ts'),
});
