import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

import fg from 'fast-glob';

import { LIB_BUILD_PATHS } from '../lib/pipeline-utils.ts';

/** 生成 components / chat 的 less 模块声明 */
export function generateLessTypes(monorepoRoot: string) {
  const componentsDir = resolve(monorepoRoot, 'packages/components');
  const chatDir = resolve(monorepoRoot, 'packages/pro-components/chat');
  const commonLess = fg.sync('web/components/**/_index.less', {
    cwd: resolve(monorepoRoot, LIB_BUILD_PATHS.commonStyle),
  });

  function writeDeclarations(baseDir: string, lessFiles: string[], outFile: string) {
    const lines = [
      '// 由 @tdesign/vite-config 自动生成，请勿手改',
      "declare module '*.less' { const classes: string; export default classes; }",
    ];
    for (const file of commonLess) {
      const key = file.replace(/\.less$/, '');
      lines.push(`declare module '@common/style/${key}' { const classes: string; export default classes; }`);
    }
    for (const file of lessFiles) {
      const rel = `./${relative(baseDir, resolve(baseDir, file)).replace(/\.less$/, '')}`;
      lines.push(`declare module '${rel}.less' { const classes: string; export default classes; }`);
    }
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, `${lines.join('\n')}\n`);
    return lines.length - 2;
  }

  const n1 = writeDeclarations(
    componentsDir,
    fg.sync('**/*.less', { cwd: componentsDir, ignore: ['dist/**', 'node_modules/**', 'types/**'] }),
    resolve(componentsDir, 'types/generated-less.d.ts'),
  );
  const n2 = writeDeclarations(
    chatDir,
    fg.sync('**/*.less', { cwd: chatDir, ignore: ['dist/**', 'node_modules/**', 'types/**'] }),
    resolve(chatDir, 'types/generated-less.d.ts'),
  );
  console.log(`[lib-build] less 声明: components ${n1} 条、chat ${n2} 条`);
}

/** 编译 common 类型到 .cache */
export function emitCommonTypesCache(monorepoRoot: string) {
  execSync('tsc -p tsconfig.common-dts.json', { cwd: monorepoRoot, stdio: 'inherit' });
}

function ensureCommonTypesCache(monorepoRoot: string) {
  if (!existsSync(resolve(monorepoRoot, LIB_BUILD_PATHS.commonTypesCache))) {
    emitCommonTypesCache(monorepoRoot);
  }
}

/** less 声明 + common 类型缓存 */
export function runPrepare(monorepoRoot: string, { refreshCommonTypes = true }: { refreshCommonTypes?: boolean } = {}) {
  generateLessTypes(monorepoRoot);
  if (refreshCommonTypes) emitCommonTypesCache(monorepoRoot);
  else ensureCommonTypesCache(monorepoRoot);
}
