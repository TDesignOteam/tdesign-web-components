import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getWorkspaceRoot } from './get-root-path.mjs';

/**
 * 扫描组件目录并生成 packages/components/index.ts barrel 导出
 * @param {string} componentsDir
 */
export function generateComponentsEntry(componentsDir) {
  const components = fs.readdirSync(componentsDir).filter((name) => {
    if (['style', 'icon', 'node_modules'].includes(name) || name.startsWith('_')) return false;
    const componentPath = path.resolve(componentsDir, name);
    if (!fs.statSync(componentPath).isDirectory()) return false;
    return (
      fs.existsSync(path.resolve(componentPath, 'index.ts')) ||
      fs.existsSync(path.resolve(componentPath, 'index.tsx'))
    );
  });

  const code = components.reduce((pre, next) => `${pre}export * from './${next.replace(/\.ts/, '')}';\n`, '');

  fs.writeFileSync(path.resolve(componentsDir, 'index.ts'), code, {
    encoding: 'utf-8',
  });
}

/**
 * Vite 插件：库构建前自动生成组件入口
 * @param {string} componentsDir
 */
export function generateEntryPlugin(componentsDir) {
  return {
    name: 'tdesign:generate-entry',
    buildStart() {
      generateComponentsEntry(componentsDir);
    },
  };
}

/** 从当前工作目录定位 monorepo 并生成组件入口 */
export function runGenerateEntryFromCwd() {
  const rootDir = getWorkspaceRoot(process.cwd());
  generateComponentsEntry(path.resolve(rootDir, 'packages/components'));
}

// 直接 node 执行时作为 CLI 入口
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runGenerateEntryFromCwd();
}
