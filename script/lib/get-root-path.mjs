import { dirname, resolve } from 'path';
import { existsSync } from 'fs';

/**
 * 获取 workspace 根目录
 * 从当前目录向上查找 pnpm-workspace.yaml（monorepo 根目录的唯一标志）
 *
 * @param {string} startDir - 起始目录
 * @returns {string} - workspace 根目录绝对路径
 */
export function getWorkspaceRoot(startDir) {
  let currentDir = startDir;

  while (currentDir !== dirname(currentDir)) {
    if (existsSync(resolve(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }

  throw new Error(`无法找到 workspace 根目录（pnpm-workspace.yaml），起始位置: ${startDir}`);
}
