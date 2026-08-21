import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { createLibBuildConfig, type LibViteOptions } from '@tdesign/vite-config/lib';
import pkg from './package.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

/** 本发布包构建参数（差异项集中在此） */
const libOptions: LibViteOptions = {
  pkg,
  packageDir: __dirname,
  srcDir: resolve(__dirname, '../pro-components/chat'),
  // 发布包不包含源码，因此只发布可独立使用的 .d.ts，不生成无法解析的声明映射。
  declarationSourcemap: false,
  iifeGlobalName: 'TDesignWebComponentsChat',
  iifeExternals: ['@tdesign/web-components'],
  iifeGlobals: {
    '@tdesign/web-components': 'TDesignWebComponents',
  },
  pipeline: {
    // Chat 的公开附件类型间接依赖 common；独立构建时也必须刷新声明，避免 submodule 更新后复用旧缓存。
    refreshCommonTypes: true,
    requireUiBuilt: true,
  },
};

export default createLibBuildConfig(libOptions);
