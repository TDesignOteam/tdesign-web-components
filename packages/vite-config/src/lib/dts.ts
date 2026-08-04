import { resolve } from 'path';

import { dts } from 'rolldown-plugin-dts';

/** ESM 构建：Rolldown 直出 .d.ts 到发布目录（与 .js 同目录） */
export function createLibDtsPlugin(srcDir: string) {
  return dts({
    tsconfig: resolve(srcDir, 'tsconfig.build.json'),
    cwd: srcDir,
    sourcemap: true,
    resolver: 'tsc',
  });
}

/** ESM 构建时排除 Oxc 对已生成声明的处理 */
export const libDtsOxcConfig = {
  exclude: [/\.js$/, /\.d\.[cm]?ts$/],
};
