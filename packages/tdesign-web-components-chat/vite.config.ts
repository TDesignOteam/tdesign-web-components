import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {
  createLibBuildConfig,
  type LibViteOptions,
} from '@tdesign/vite-config/lib';
import pkg from './package.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** 本发布包构建参数（差异项集中在此） */
const libOptions: LibViteOptions = {
  pkg,
  packageDir: __dirname,
  srcDir: resolve(__dirname, '../pro-components/chat'),
  iifeGlobalName: 'TDesignWebComponentsChat',
  iifeExternals: ['@tdesign/web-components'],
  iifeGlobals: {
    '@tdesign/web-components': 'TDesignWebComponents',
  },
  pipeline: {
    refreshCommonTypes: false,
    requireUiBuilt: true,
  },
};

export default createLibBuildConfig(libOptions);
