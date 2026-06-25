import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { createLibViteConfigFromEnv } from '@tdesign/vite-config/lib';
import pkg from './package.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default createLibViteConfigFromEnv({
  pkg,
  packageDir: __dirname,
  srcDir: resolve(__dirname, '../pro-components/chat'),
  bundleWorkspacePkgs: ['@tdesign/web-components-shared'],
  umdGlobalName: 'TDesignChat',
  umdGlobals: {
    omi: 'omi',
    'lodash-es': '_',
    '@tdesign/web-components': 'TDesignUI',
  },
  additionalExternal: [
    '@tdesign/web-components',
    '@tdesign/ai-chat-engine',
  ],
});
