import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { createRollupConfig } from '../../script/rollup.base.mjs';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createRollupConfig({
  pkg,
  packageName: '@tdesign/web-components-chat',
  packageDir: __dirname,
  input: 'index.ts',
  inputList: [
    '**/*.ts',
    '**/*.tsx',
    '!node_modules/**',
    '!_example/**',
    '!*.d.ts',
    '!**/__tests__/**',
    '!_usage/**',
    '!mock/**',
  ],
  umdGlobalName: 'TDesignChat',
  globals: {
    omi: 'omi',
    'lodash-es': '_',
    '@tdesign/web-components-ui': 'TDesignUI',
  },
  additionalExternal: [
    '@tdesign/web-components-ui',
    '@tdesign/web-components-ui/button',
    '@tdesign/web-components-ui/textarea',
    '@tdesign/web-components-ui/tooltip',
    '@tdesign/web-components-ui/dropdown',
    '@tdesign/web-components-ui/collapse',
    '@tdesign/web-components-ui/image',
    '@tdesign/web-components-ui/loading',
    '@tdesign/web-components-ui/skeleton',
    '@tdesign/web-components-ui/message',
    '@tdesign/ai-chat-engine',
    '@tdesign/ai-shared',
  ],
  skipCss: true,
});
