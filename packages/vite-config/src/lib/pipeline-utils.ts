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

export function cleanPublishArtifacts(packageDir: string) {
  for (const name of ['dist', 'esm']) {
    rmSync(resolve(packageDir, name), { recursive: true, force: true });
  }
}
