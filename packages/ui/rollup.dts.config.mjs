import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { createDtsConfig } from '../../script/rollup.base.mjs';
import pkg from './package.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

export default createDtsConfig({
  pkg,
  packageName: '@tdesign/web-components-ui',
  packageDir: __dirname,
});
