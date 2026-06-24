import { existsSync, readFileSync, readdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { execSync } from 'node:child_process';

import { getWorkspaceRoot } from './get-root-path.mjs';

/** 计算 lib 内相对前缀，与 preserveModules 产物的 ../packages/... 路径对齐 */
function libRelativePrefix(filePath, outDir) {
  const depth = relative(outDir, dirname(filePath)).split(sep).filter(Boolean).length;
  return depth === 0 ? './' : `${'../'.repeat(depth)}`;
}

/**
 * 将 workspace 包名引用改为 lib 内相对路径（与 JS 的 lib/packages/... 一致）
 */
export function rewriteDeclarationImports(content, filePath, outDir) {
  const rel = libRelativePrefix(filePath, outDir);

  return content
    .replaceAll(
      /from ['"]@tdesign\/web-components-shared\/([^'"]+)['"]/g,
      `from '${rel}packages/shared/src/$1'`,
    )
    .replaceAll(
      /from ["']@tdesign\/web-components-shared["']/g,
      `from '${rel}packages/shared/src'`,
    )
    .replaceAll(
      /from ['"]@tdesign\/web-components\/([^'"]+)['"]/g,
      `from '${rel}packages/components/$1'`,
    )
    .replaceAll(
      /from ["']@tdesign\/web-components["']/g,
      `from '${rel}packages/components'`,
    )
    // 消费者无法解析 @common 源码路径，移除仅用于实现的 import 行
    .replace(/import .+ from ['"]@common\/[^'"]+['"];\n/g, '');
}

function walkDts(dir, callback) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      walkDts(fullPath, callback);
    } else if (entry.name.endsWith('.d.ts')) {
      callback(fullPath);
    }
  }
}

function rewriteOutDirDts(outDir) {
  walkDts(outDir, (filePath) => {
    const content = readFileSync(filePath, 'utf-8');
    const next = rewriteDeclarationImports(content, filePath, outDir);
    if (next !== content) {
      writeFileSync(filePath, next, 'utf-8');
    }
  });
}

/** 移除 tsc 误写入源码目录的 .d.ts（rootDir 约束失败时的兜底） */
function cleanupSourceDtsPollution(packageDir) {
  const root = getWorkspaceRoot(packageDir);
  const dirs = [
    resolve(root, 'packages/shared/src'),
    resolve(root, 'packages/components'),
    resolve(root, 'packages/pro-components/chat'),
  ];

  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    walkDts(dir, (filePath) => {
      const tsPath = filePath.replace(/\.d\.ts$/, '.ts');
      const tsxPath = filePath.replace(/\.d\.ts$/, '.tsx');
      if (existsSync(tsPath) || existsSync(tsxPath)) {
        unlinkSync(filePath);
      }
    });
  }
}

/** 移除旧方案残留的 lib/shared（现统一为 lib/packages/shared/src） */
function removeStaleSharedDts(outDir) {
  const stale = resolve(outDir, 'shared');
  if (existsSync(stale)) {
    rmSync(stale, { recursive: true, force: true });
  }
}

function runTsc(tsconfigPath, packageDir) {
  try {
    execSync(`pnpm exec tsc -p "${tsconfigPath}"`, {
      cwd: packageDir,
      stdio: 'pipe',
    });
  } catch (error) {
    // noEmitOnError 为 false 时，tsc 仍可能因示例文件等非发布代码返回非零退出码
    if (error?.status !== 2) throw error;
  }
}

/**
 * 使用 tsc 生成与 JS 目录结构一致的多文件类型声明
 * @param {object} options
 * @param {string} options.packageDir 发布包目录
 * @param {string} options.outDir 类型输出目录
 */
export function createEmitDtsPlugin({ packageDir, outDir }) {
  const mainTsconfig = resolve(packageDir, 'tsconfig.build.json');
  const sharedTsconfig = resolve(packageDir, 'tsconfig.shared-dts.json');
  const componentsTsconfig = resolve(packageDir, 'tsconfig.components-dts.json');

  return {
    name: 'tdesign:emit-dts',
    apply: 'build',
    closeBundle() {
      // 先 emit 依赖包类型，主包 tsc 通过 paths 指向 lib 内 .d.ts，避免污染源码目录
      if (existsSync(sharedTsconfig)) {
        runTsc(sharedTsconfig, packageDir);
      }
      if (existsSync(componentsTsconfig)) {
        runTsc(componentsTsconfig, packageDir);
      }
      runTsc(mainTsconfig, packageDir);
      cleanupSourceDtsPollution(packageDir);
      removeStaleSharedDts(outDir);
      rewriteOutDirDts(outDir);
    },
  };
}
