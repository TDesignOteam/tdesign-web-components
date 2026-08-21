import { resolve } from 'path';

import { dts } from 'rolldown-plugin-dts';

/** 声明构建：只输出 .d.ts 到 ESM 发布目录。 */
export function createLibDtsPlugin(srcDir: string, sourcemap = true) {
  return dts({
    generator: 'tsc',
    tsconfig: resolve(srcDir, 'tsconfig.build.json'),
    cwd: srcDir,
    sourcemap,
    resolver: 'tsc',
    emitDtsOnly: true,
  });
}

/** ESM 构建时排除 Oxc 对已生成声明的处理 */
export const libDtsOxcConfig = {
  exclude: [/\.js$/, /\.d\.[cm]?ts$/],
};
