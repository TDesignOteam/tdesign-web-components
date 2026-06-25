import { resolve } from 'path';

/**
 * Less @common/* 路径别名插件（Vite / Rollup 共用）
 *
 * 用于 monorepo 内部 dev/build：组件样式 @import '@common/...' 时解析到 packages/common。
 */
export function createLessAliasPlugin(monorepoRoot) {
  const commonDir = resolve(monorepoRoot, 'packages/common');

  return {
    install(less, pluginManager) {
      class AliasFM extends less.FileManager {
        supports(filename) {
          return filename.startsWith('@common/');
        }

        loadFile(filename, ...args) {
          const resolved = filename.replace(/^@common\//, `${commonDir}/`);
          return super.loadFile.call(this, resolved, ...args);
        }
      }
      pluginManager.addFileManager(new AliasFM());
    },
  };
}
