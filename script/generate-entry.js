import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getWorkspaceRoot } from './lib/get-root-path.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = getWorkspaceRoot(__dirname);

const componentsPath = path.resolve(rootDir, 'packages/components');

const components = fs.readdirSync(componentsPath).filter((name) => {
  if (['style', 'icon', 'node_modules'].includes(name) || name.startsWith('_')) return false;
  const componentPath = path.resolve(componentsPath, name);
  if (!fs.statSync(componentPath).isDirectory()) return false;
  // 仅导出有入口文件的组件目录
  return (
    fs.existsSync(path.resolve(componentPath, 'index.ts')) ||
    fs.existsSync(path.resolve(componentPath, 'index.tsx'))
  );
});

const code = components.reduce((pre, next) => `${pre}export * from './${next.replace(/\.ts/, '')}';\n`, '');

fs.writeFileSync(path.resolve(componentsPath, 'index.ts'), code, {
  encoding: 'utf-8',
});
