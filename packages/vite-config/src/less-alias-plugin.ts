import { resolve } from 'node:path';
import type less from 'less';

/**
 * Less @common/* 路径别名插件（Vite / Rolldown 共用）。
 * 用于 monorepo 内部 dev/build：组件样式 @import '@common/...' 时解析到 packages/common。
 */
export function createLessAliasPlugin(monorepoRoot: string): Less.Plugin {
  const commonDir = resolve(monorepoRoot, 'packages/common');

  return {
    install(lessInstance: typeof less, pluginManager: Less.PluginManager) {
      class AliasFileManager extends lessInstance.FileManager {
        supports(filename: string) {
          return filename.startsWith('@common/');
        }

        loadFile(filename: string, ...args: unknown[]) {
          const resolved = filename.replace(/^@common\//, `${commonDir}/`);
          return super.loadFile.call(this, resolved, ...args);
        }
      }
      pluginManager.addFileManager(new AliasFileManager());
    },
  };
}
