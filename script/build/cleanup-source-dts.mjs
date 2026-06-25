/**
 * 清理 tsc 误写入源码目录、且未被 git 跟踪的 .d.ts
 */
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

import { getWorkspaceRoot } from '../../packages/vite-config/src/get-root-path.mjs';

const SOURCE_DTS_DIRS = [
  'packages/components',
  'packages/shared/src',
  'packages/pro-components/chat',
  'common-utils/_common',
  'common-utils/_ai-core/packages',
];

function walkDtsFiles(dir, callback) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      walkDtsFiles(fullPath, callback);
    } else if (entry.name.endsWith('.d.ts')) {
      callback(fullPath);
    }
  }
}

function isGitTracked(filePath, cwd) {
  try {
    execSync(`git ls-files --error-unmatch "${filePath}"`, { cwd, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/** @param {string} startDir workspace 内任意目录 */
export function cleanupGeneratedSourceDts(startDir) {
  const monorepoRoot = getWorkspaceRoot(startDir);
  let removed = 0;

  for (const rel of SOURCE_DTS_DIRS) {
    const dir = resolve(monorepoRoot, rel);
    walkDtsFiles(dir, (filePath) => {
      if (isGitTracked(filePath, monorepoRoot)) return;
      rmSync(filePath, { force: true });
      removed += 1;
    });
  }

  return removed;
}
