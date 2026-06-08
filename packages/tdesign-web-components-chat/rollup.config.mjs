import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { createRollupConfig } from '../../script/rollup.base.mjs';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 源码目录（@tdesign/pro-components-chat）
const srcDir = resolve(__dirname, '../pro-components/chat');

export default createRollupConfig({
  pkg,
  packageName: '@tdesign/web-components-chat',
  packageDir: __dirname,
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
  umdGlobalName: 'TDesignChat',
  globals: {
    omi: 'omi',
    'lodash-es': '_',
    '@tdesign/web-components': 'TDesignUI',
  },
  additionalExternal: [
    '@tdesign/web-components',
    '@tdesign/web-components/button',
    '@tdesign/web-components/textarea',
    '@tdesign/web-components/tooltip',
    '@tdesign/web-components/dropdown',
    '@tdesign/web-components/collapse',
    '@tdesign/web-components/image',
    '@tdesign/web-components/loading',
    '@tdesign/web-components/skeleton',
    '@tdesign/web-components/message',
    '@tdesign/ai-chat-engine',
    '@tdesign/ai-shared',
  ],
  skipCss: true,
});
