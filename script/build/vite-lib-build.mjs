#!/usr/bin/env node
/**
 * 按格式依次执行 Vite 库构建（lib → esm → cjs → umd → umd-min）
 * Vite 8 不支持配置数组，通过 LIB_BUILD_TARGET 环境变量分次构建
 */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGETS = ['lib', 'esm', 'cjs', 'umd', 'umd-min'];

/** @param {string} packageDir 发布包目录绝对路径 */
export function runViteLibBuild(packageDir) {
  const cwd = resolve(packageDir);

  for (let i = 0; i < TARGETS.length; i += 1) {
    const target = TARGETS[i];
    console.log(`[vite-lib-build] ${target}...`);
    const result = spawnSync('pnpm', ['exec', 'vite', 'build'], {
      cwd,
      stdio: 'inherit',
      env: {
        ...process.env,
        LIB_BUILD_TARGET: target,
        LIB_EMPTY_OUT_DIR: i === 0 ? '1' : '0',
        NODE_ENV: 'production',
      },
    });
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
}

const isMain =
  process.argv[1] && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1]);

if (isMain) {
  runViteLibBuild(resolve(process.argv[2] || process.cwd()));
}
