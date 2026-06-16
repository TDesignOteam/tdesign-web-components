import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { createLibViteConfig } from '../../script/vite.lib.config';
import pkg from './package.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default createLibViteConfig({
  pkg,
  packageDir: __dirname,
  srcDir: resolve(__dirname, '../components'),
  bundleWorkspacePkgs: [],
});
