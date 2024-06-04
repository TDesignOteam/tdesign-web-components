import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsPath = path.resolve(__dirname, '../src');

const components = fs.readdirSync(componentsPath).filter((name) => {
  const componentPath = path.resolve(componentsPath, name);
  if (fs.statSync(componentPath).isDirectory()) {
    return true;
  }
  return false;
});

const code = components.reduce((pre, next) => `${pre}export * from './${next}';\n`, '');

fs.writeFileSync(path.resolve(componentsPath, 'index.ts'), code, {
  encoding: 'utf-8',
});

console.log(code);
