import { resolve } from 'path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

import { getWorkspaceRoot } from './get-root-path.ts';
import tdocPlugin from './plugins/tdoc/index.ts';
import addPartAttributePlugin from './plugins/add-part.ts';
import omiStyleImportPlugin from './plugins/omi-style.ts';
import {
  createLessPreprocessorOptions,
  createMonorepoAliasConfig,
  createSseProxy,
  siteOxcConfig,
  workspaceOptimizeDepsExclude,
} from './shared.ts';

export interface SiteViteOptions {
  /** 站点目录绝对路径，用于定位 monorepo 根目录 */
  siteDir: string;
  /** 开发服务器端口 */
  port: number;
  /** 预览服务器端口 */
  previewPort: number;
  /** 各 mode 对应的 publicPath */
  publicPathMap: Record<string, string>;
}

/**
 * 创建文档站 Vite 配置（UI / Chat 站点共用）
 */
export function createSiteViteConfig({ siteDir, port, previewPort, publicPathMap }: SiteViteOptions) {
  const ROOT = getWorkspaceRoot(siteDir);

  return ({ mode }: { mode: string }) =>
    defineConfig({
      base: publicPathMap[mode] || './',
      oxc: siteOxcConfig,
      resolve: {
        alias: createMonorepoAliasConfig(ROOT, siteDir),
      },
      css: {
        preprocessorOptions: createLessPreprocessorOptions(ROOT),
      },
      optimizeDeps: {
        exclude: workspaceOptimizeDepsExclude,
      },
      server: {
        host: '0.0.0.0',
        port,
        open: '/',
        fs: {
          strict: false,
          allow: [resolve(ROOT, '.'), resolve(ROOT, 'node_modules')],
        },
        proxy: createSseProxy(),
      },
      preview: {
        host: '127.0.0.1',
        port: previewPort,
        open: true,
      },
      build: {
        outDir: 'dist',
        rolldownOptions: {
          treeshake: false,
          input: {
            index: 'index.html',
          },
        },
      },
      plugins: [
        omiStyleImportPlugin(),
        addPartAttributePlugin({
          include: /\.(js|jsx|ts|tsx)$/,
        }) as Plugin,
        tdocPlugin() as Plugin,
      ],
      logLevel: 'error',
    });
}
