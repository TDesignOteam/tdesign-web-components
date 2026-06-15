import { resolve } from 'path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

import { getWorkspaceRoot } from './lib/get-root-path.mjs';
import tdocPlugin from './plugin-tdoc';
import addPartAttributePlugin from './vite-plugin-add-part.js';
import omiStyleImportPlugin from './vite-plugin-omi-style.js';
import { createAliasConfig, createSseProxy, omiOxcConfig } from './vite.shared';

export interface SiteViteOptions {
  /** 站点目录绝对路径，用于定位 monorepo 根目录 */
  siteDir: string;
  /** 开发服务器端口 */
  port: number;
  /** 各 mode 对应的 publicPath */
  publicPathMap: Record<string, string>;
}

/**
 * 创建文档站 Vite 配置（UI / Chat 站点共用）
 */
export function createSiteViteConfig({ siteDir, port, publicPathMap }: SiteViteOptions) {
  const ROOT = getWorkspaceRoot(siteDir);

  return ({ mode }: { mode: string }) =>
    defineConfig({
      base: publicPathMap[mode] || './',
      oxc: omiOxcConfig,
      resolve: {
        alias: createAliasConfig(ROOT),
      },
      server: {
        host: '0.0.0.0',
        port,
        open: '/',
        https: false,
        fs: {
          strict: false,
          allow: [resolve(ROOT, '.'), resolve(ROOT, 'node_modules')],
        },
        proxy: createSseProxy(),
      },
      build: {
        outDir: 'dist',
        rolldownOptions: {
          treeshake: false, // 防止非具名 export 被 tree-shaking
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
