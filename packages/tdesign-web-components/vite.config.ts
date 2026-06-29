import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {
  createLibViteConfigForTarget,
  getLibBuildTargetFromEnv,
  libBuildPipelinePlugin,
  libMultiFormatPlugin,
  type LibViteOptions,
} from '@tdesign/vite-config/lib';
import pkg from './package.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** 本发布包构建参数（差异项集中在此） */
const libOptions: LibViteOptions = {
  pkg,
  packageDir: __dirname,
  srcDir: resolve(__dirname, '../components'),
  generateEntry: true,
  umdGlobalName: 'TDesignUI',
  umdGlobals: {
    omi: 'omi',
    'lodash-es': '_',
  },
  pipeline: {
    tscFilters: [],
  },
};

const debugTarget = getLibBuildTargetFromEnv();

export default debugTarget
  ? createLibViteConfigForTarget(libOptions, debugTarget, {
      emptyOutDir: process.env.LIB_EMPTY_OUT_DIR === '1',
    })
  : {
      root: libOptions.packageDir,
      plugins: [libBuildPipelinePlugin(libOptions), libMultiFormatPlugin(libOptions)],
    };
