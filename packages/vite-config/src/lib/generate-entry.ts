import { readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { Plugin } from 'vite';

import { getWorkspaceRoot } from '../shared/workspace.ts';

/** 扫描组件目录并生成 packages/components/index.ts barrel 导出 */
export function generateComponentsEntry(componentsDir: string) {
  const components = readdirSync(componentsDir).filter((name) => {
    if (['style', 'icon', 'node_modules'].includes(name) || name.startsWith('_')) return false;
    const componentPath = resolve(componentsDir, name);
    if (!statSync(componentPath).isDirectory()) return false;
    return existsSync(resolve(componentPath, 'index.ts')) || existsSync(resolve(componentPath, 'index.tsx'));
  });

  const code = components.reduce((pre, next) => `${pre}export * from './${next.replace(/\.ts/, '')}';\n`, '');
  writeFileSync(resolve(componentsDir, 'index.ts'), code, { encoding: 'utf8' });
}

/** Vite 插件：库构建前自动生成组件入口 */
export function generateEntryPlugin(componentsDir: string): Plugin {
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
  generateComponentsEntry(resolve(rootDir, 'packages/components'));
}
