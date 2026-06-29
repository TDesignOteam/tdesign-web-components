import { resolve } from 'path';

import { dts } from 'rolldown-plugin-dts';

/** lib 构建：rolldown 直出 .d.ts 到 publish/lib（与 .js 同目录） */
export function createLibDtsPlugin(srcDir: string) {
  return dts({
    tsconfig: resolve(srcDir, 'tsconfig.build.json'),
    cwd: srcDir,
    sourcemap: true,
    resolver: 'tsc',
  });
}

/** lib 构建时排除 Oxc 对已生成声明的处理 */
export const libDtsOxcConfig = {
  exclude: [/\.js$/, /\.d\.[cm]?ts$/],
};
