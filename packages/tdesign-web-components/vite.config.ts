import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { createLibViteConfigFromEnv } from '@tdesign/vite-config/lib';
import pkg from './package.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default createLibViteConfigFromEnv({
  pkg,
  packageDir: __dirname,
  srcDir: resolve(__dirname, '../components'),
  bundleWorkspacePkgs: ['@tdesign/web-components-shared'],
  generateEntry: true,
  umdGlobalName: 'TDesignUI',
  umdGlobals: { omi: 'omi', 'lodash-es': '_' },
});
