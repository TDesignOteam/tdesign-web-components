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

        loadFile(
          filename: string,
          currentDirectory: string,
          options: Less.LoadFileOptions,
          environment: Less.Environment,
        ) {
          const resolved = filename.replace(/^@common\//, `${commonDir}/`);
          return super.loadFile(resolved, currentDirectory, options, environment);
        }
      }
      pluginManager.addFileManager(new AliasFileManager());
    },
  };
}
