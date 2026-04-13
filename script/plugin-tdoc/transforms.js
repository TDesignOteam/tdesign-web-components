/* eslint-disable no-param-reassign */
import fs from 'fs';
import path from 'path';

import mdToWc from './md-to-wc.mjs';

let demoImports = {};
let demoCodesImports = {};

const ignoreReplaceDemoRegExp = /getting-started\.md/;

export default {
  before({ source, file }) {
    const resourceDir = path.dirname(file);
    const reg = file.match(/src\/(\w+-?\w+)\/(\w+-?\w+)\.md/);
    const fileName = reg && reg[1];
    const componentName = reg && reg[1];
    demoImports = {};
    demoCodesImports = {};

    // 统一换成 common 公共文档内容
    if (fileName && source.includes(':: BASE_DOC ::')) {
      const localeDocPath = path.resolve(resourceDir, `../_common/docs/web/api/${fileName}`);
      const defaultDocPath = path.resolve(resourceDir, `../_common/docs/web/api/${componentName}.md`);
      let baseDoc = '';
      if (fs.existsSync(localeDocPath)) {
        // 优先载入语言版本
        baseDoc = fs.readFileSync(localeDocPath, 'utf-8');
      } else if (fs.existsSync(defaultDocPath)) {
        // 回退中文默认版本
        baseDoc = fs.readFileSync(defaultDocPath, 'utf-8');
      } else {
        console.error(`未找到 ${defaultDocPath} 文件`);
      }
      source = source.replace(':: BASE_DOC ::', baseDoc);
    }
    // 替换成对应 demo 文件
    if (!ignoreReplaceDemoRegExp.test(file)) {
      source = source.replace(/\{\{\s+(.+)\s+\}\}/g, (demoStr, demoFileName) => {
        const jsxDemoPath = path.resolve(resourceDir, `./_example/${demoFileName}.jsx`);
        const tsxDemoPath = path.resolve(resourceDir, `./_example/${demoFileName}.tsx`);

        if (!fs.existsSync(jsxDemoPath) && !fs.existsSync(tsxDemoPath)) {
          console.log('\x1B[36m%s\x1B[0m', `${fileName} 组件需要实现 _example/${demoFileName}.jsx/tsx 示例!`);
          return '\n<h3>DEMO (🚧建设中）...</h3>';
        }

        return `\n::: demo _example/${demoFileName} ${fileName}\n:::\n`;
      });
    }

    source.replace(/:::\s*demo\s+([\\/.\w-]+)/g, (demoStr, relativeDemoPath) => {
      const demoPathOnlyLetters = relativeDemoPath.replace(/[^a-zA-Z\d]/g, '');
      const demoDefName = `Demo${demoPathOnlyLetters}`;
      const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;
      demoImports[demoDefName] = `import ${demoDefName} from './${relativeDemoPath}';`;
      demoCodesImports[demoCodeDefName] = `import ${demoCodeDefName} from './${relativeDemoPath}?raw';`;
    });
    return source;
  },
  render({ source, file, md }) {
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

    const sfc = mdToWc({
      md,
      file,
      source,
      demoDefsStr,
      demoCodesDefsStr,
      components,
    });
    return sfc;
  },
};
