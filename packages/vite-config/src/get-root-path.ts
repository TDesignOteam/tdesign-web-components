import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * 获取 workspace 根目录。
 * 从当前目录向上查找 pnpm-workspace.yaml（monorepo 根目录的唯一标志）。
 */
export function getWorkspaceRoot(startDir: string) {
  let currentDir = startDir;

  while (currentDir !== dirname(currentDir)) {
    if (existsSync(resolve(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }

  throw new Error(`无法找到 workspace 根目录（pnpm-workspace.yaml），起始位置: ${startDir}`);
}
