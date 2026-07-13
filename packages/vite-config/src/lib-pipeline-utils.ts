import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

/** monorepo 库构建路径常量 */
export const LIB_BUILD_PATHS = {
  commonStyle: 'packages/common/style',
  commonTypesCache: 'packages/.cache/common-js-types',
  sharedDist: 'packages/shared/dist',
  uiPublish: 'packages/tdesign-web-components',
  chatPublish: 'packages/tdesign-web-components-chat',
};

export const PUBLISH_ARTIFACTS = ['lib', 'dist', 'esm', 'cjs'];

/** vite build 前执行 workspace 包的 tsc */
export function runWorkspaceTsc(monorepoRoot: string, filters: string[]) {
  for (const filter of filters) {
    const result = spawnSync('pnpm', ['--filter', filter, 'run', 'build'], {
      cwd: monorepoRoot,
      stdio: 'inherit',
      shell: false,
    });
    if (result.status !== 0) throw new Error(`${filter} tsc 失败 (exit ${result.status ?? 1})`);
  }
}

export function cleanPublishArtifacts(packageDir: string) {
  for (const name of PUBLISH_ARTIFACTS) {
    rmSync(resolve(packageDir, name), { recursive: true, force: true });
  }
}
