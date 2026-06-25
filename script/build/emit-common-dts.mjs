/**
 * 从 tdesign-common/js 源码生成类型缓存（供 tsc Project References 消费，不修改子模块）
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const COMMON_SRC_REL = 'packages/tdesign-common/js';
/** 类型缓存在主仓，不写入 submodule */
const COMMON_TYPES_CACHE_REL = 'packages/.cache/common-js-types';

/** @param {string} monorepoRoot @param {string} outDirRel 相对 monorepoRoot 的输出目录 */
function emitCommonDtsTo(monorepoRoot, outDirRel) {
  const commonSrc = resolve(monorepoRoot, COMMON_SRC_REL);
  const outDir = resolve(monorepoRoot, outDirRel);
  const tempDir = mkdtempSync(resolve(tmpdir(), 'common-dts-'));
  const tsconfigPath = resolve(tempDir, 'tsconfig.json');

  const typeRoots = [resolve(monorepoRoot, 'node_modules/@types')];

  writeFileSync(
    tsconfigPath,
    JSON.stringify(
      {
        extends: resolve(monorepoRoot, 'tsconfig.base.json'),
        compilerOptions: {
          declaration: true,
          declarationMap: true,
          emitDeclarationOnly: true,
          rootDir: commonSrc,
          outDir,
          module: 'ESNext',
          moduleResolution: 'node',
          skipLibCheck: true,
          noEmit: false,
          noEmitOnError: false,
          types: ['node'],
          typeRoots,
        },
        include: [`${commonSrc}/**/*.ts`],
        exclude: ['**/node_modules/**', '**/dist/**'],
      },
      null,
      2,
    ),
  );

  try {
    execSync(`tsc -p "${tsconfigPath}"`, { cwd: monorepoRoot, stdio: 'inherit' });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

/** 构建前：生成 common 类型缓存，供 shared / components 的 tsc 引用 */
export function emitCommonTypesCache(monorepoRoot) {
  emitCommonDtsTo(monorepoRoot, COMMON_TYPES_CACHE_REL);
}

/** sync-dts：将 common 声明写入发布包 lib（与 Vite JS 目录对齐） */
export function emitCommonLibDts(monorepoRoot, destLibRel) {
  emitCommonDtsTo(monorepoRoot, `${destLibRel}/packages/tdesign-common/js`);
}

/** @param {string} monorepoRoot */
export function ensureCommonTypesCache(monorepoRoot) {
  const cacheDir = resolve(monorepoRoot, COMMON_TYPES_CACHE_REL);
  if (!existsSync(cacheDir)) {
    emitCommonTypesCache(monorepoRoot);
  }
}

export { COMMON_TYPES_CACHE_REL };
