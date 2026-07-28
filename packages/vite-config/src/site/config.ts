import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

import { createComponentSitePlugins } from '../plugins/component.ts';
import { getWorkspaceRoot } from '../shared/workspace.ts';
import tdocPlugin from './tdoc/index.ts';
import {
  createLessPreprocessorOptions,
  createMonorepoAliasConfig,
  createSseProxy,
  siteOxcConfig,
  workspaceOptimizeDepsExclude,
} from '../shared/index.ts';

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
        dedupe: ['omi'],
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
          // 文档站通过 workspace alias 读取源码；其余路径仍由 Vite 默认严格限制。
          allow: [ROOT],
        },
        proxy: createSseProxy(),
      },
      preview: {
        host: '127.0.0.1',
        port: previewPort,
        open: true,
      },
      plugins: [...createComponentSitePlugins(), tdocPlugin() as Plugin],
      logLevel: 'error',
    });
}
