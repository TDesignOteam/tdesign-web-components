import { resolve } from 'path';

/**
 * Less @common/* 路径别名插件（Vite / Rollup 共用）
 */
export function createLessAliasPlugin(monorepoRoot) {
  const commonDir = resolve(monorepoRoot, 'common-utils/_common');

  return {
    install(less, pluginManager) {
      class AliasFM extends less.FileManager {
        supports(filename) {
          return filename.startsWith('@common/');
        }

        // eslint-disable-next-line func-names
        loadFile(filename, ...args) {
          const resolved = filename.replace(/^@common\//, `${commonDir}/`);
          return super.loadFile.call(this, resolved, ...args);
        }
      }
      pluginManager.addFileManager(new AliasFM());
    },
  };
}
