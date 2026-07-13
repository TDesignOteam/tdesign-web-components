/** @tdesign/vite-config 公共导出（lib + site + 工具） */
export * from './lib/index.ts';
export * from './site/index.ts';
export {
  createMonorepoAliasConfig,
  createLessPreprocessorOptions,
  createSseProxy,
  siteOxcConfig,
  libOxcConfig,
} from './shared.ts';
export { getWorkspaceRoot } from './get-root-path.ts';
