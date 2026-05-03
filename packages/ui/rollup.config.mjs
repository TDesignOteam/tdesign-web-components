import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { createRollupConfig } from '../../script/rollup.base.mjs';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createRollupConfig({
  pkg,
  packageName: 'tdesign-web-components-ui',
  packageDir: __dirname,
  input: 'src/index.ts',
  umdGlobalName: 'TDesignUI',
  globals: { omi: 'omi', 'lodash-es': '_' },
});
