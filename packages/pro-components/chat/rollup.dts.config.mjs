import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { createDtsConfig } from '../../script/rollup.base.mjs';
import pkg from './package.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

export default createDtsConfig({
  pkg,
  packageName: '@tdesign/web-components-chat',
  packageDir: __dirname,
  input: 'index.ts',
});
