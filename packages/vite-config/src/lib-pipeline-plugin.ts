import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

import { cleanPublishArtifacts, LIB_BUILD_PATHS, runWorkspaceTsc } from './lib-pipeline-utils.mjs';
import { runPrepare } from './lib-prepare.mjs';
import { getWorkspaceRoot } from './get-root-path.mjs';
import type { LibViteOptions } from './lib.ts';

/**
 * 发布包构建流水线：依赖 tsc → 清理产物 → prepare → lib 多格式 JS + rolldown dts
 */
export function libBuildPipelinePlugin(
  options: LibViteOptions,
  { refreshCommonTypes }: { refreshCommonTypes?: boolean } = {},
): Plugin {
  const monorepoRoot = getWorkspaceRoot(options.packageDir);
  const pipeline = options.pipeline!;
  const refreshCommon = refreshCommonTypes ?? pipeline.refreshCommonTypes ?? true;

  return {
    name: 'lib-build-pipeline',
    apply: 'build',
    enforce: 'pre',
    buildStart() {
      if (pipeline.requireUiBuilt) {
        const uiLib = resolve(monorepoRoot, LIB_BUILD_PATHS.uiPublish, 'lib/index.d.ts');
        if (!existsSync(uiLib)) throw new Error('请先 pnpm run build:ui');
      }

      const tscFilters = [...pipeline.tscFilters];
      if (tscFilters.length) runWorkspaceTsc(monorepoRoot, tscFilters);

      cleanPublishArtifacts(options.packageDir);
      runPrepare(monorepoRoot, { refreshCommonTypes: refreshCommon });
    },
  };
}
