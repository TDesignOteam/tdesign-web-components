/* eslint-disable no-param-reassign */
import fs from 'node:fs';
import path from 'node:path';

import mdToWc from './md-to-wc.ts';

let demoImports: Record<string, string> = {};
let demoCodesImports: Record<string, string> = {};

const ignoreReplaceDemoRegExp = /getting-started\.md/;

export default {
  before({ source, file }: { source: string; file: string }) {
    const resourceDir = path.dirname(file);
    const reg = file.match(/src\/(\w+-?\w+)\/(\w+-?\w+)\.md/);
    const name = reg && reg[1];
    demoImports = {};
    demoCodesImports = {};

    if (!ignoreReplaceDemoRegExp.test(file)) {
      source = source.replace(/\{\{\s+(.+)\s+\}\}/g, (_demoStr, demoFileName) => {
        const jsxDemoPath = path.resolve(resourceDir, `./_example/${demoFileName}.jsx`);
        const tsxDemoPath = path.resolve(resourceDir, `./_example/${demoFileName}.tsx`);

        if (!fs.existsSync(jsxDemoPath) && !fs.existsSync(tsxDemoPath)) {
          console.log('\x1B[36m%s\x1B[0m', `${name} 组件需要实现 _example/${demoFileName}.jsx/tsx 示例!`);
          return '\n<h3>DEMO (🚧建设中）...</h3>';
        }

        return `\n::: demo _example/${demoFileName} ${name}\n:::\n`;
      });
    }

    source.replace(/:::\s*demo\s+([\\/.\w-]+)/g, (_demoStr, relativeDemoPath) => {
      const demoPathOnlyLetters = relativeDemoPath.replace(/[^a-zA-Z\d]/g, '');
      const demoDefName = `Demo${demoPathOnlyLetters}`;
      const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;
      demoImports[demoDefName] = `import ${demoDefName} from './${relativeDemoPath}';`;
      demoCodesImports[demoCodeDefName] = `import ${demoCodeDefName} from './${relativeDemoPath}?raw';`;
      return '';
    });
    return source;
  },
  render({ source, file, md }: { source: string; file: string; md: any }) {
    const demoDefsStr = Object.keys(demoImports)
      .map((key) => demoImports[key])
      .join('\n');
    const demoCodesDefsStr = Object.keys(demoCodesImports)
      .map((key) => demoCodesImports[key])
      .join('\n');

    const components = Object.keys(demoImports)
      .map(
        (key) => `
      let ${key}Component = null;
      if(${key}.toString().startsWith('class')){
        define('t-${key.toLocaleLowerCase()}', ${key});
        ${key}Component = <t-${key.toLocaleLowerCase()} />;
      } else {
        ${key}Component = <${key} />;
      };
      `,
      )
      .join('\n');

    return mdToWc({
      md,
      file,
      source,
      demoDefsStr,
      demoCodesDefsStr,
      components,
    });
  },
};
