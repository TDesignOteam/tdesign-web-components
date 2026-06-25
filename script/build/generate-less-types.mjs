#!/usr/bin/env node
/**
 * 为 components tsc 生成 @common/style/*.less 与组件内 .less 的模块声明
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import fg from 'fast-glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(__dirname, '../..');
const componentsDir = resolve(monorepoRoot, 'packages/components');
const chatDir = resolve(monorepoRoot, 'packages/pro-components/chat');
const outFile = resolve(componentsDir, 'types/generated-less.d.ts');
const chatOutFile = resolve(chatDir, 'types/generated-less.d.ts');

const commonLess = fg.sync('web/components/**/_index.less', {
  cwd: resolve(monorepoRoot, 'packages/common/style'),
  absolute: false,
});

const componentLess = fg.sync('**/*.{less}', {
  cwd: componentsDir,
  absolute: false,
  ignore: ['dist/**', 'node_modules/**', 'types/**'],
});

const chatLess = fg.sync('**/*.less', {
  cwd: chatDir,
  absolute: false,
  ignore: ['dist/**', 'node_modules/**', 'types/**'],
});

function buildLessDeclarations(baseDir, lessFiles) {
  const lines = [
    '// 由 script/build/generate-less-types.mjs 自动生成，请勿手改',
    "declare module '*.less' { const classes: string; export default classes; }",
  ];

  for (const file of commonLess) {
    const withoutExt = file.replace(/\.less$/, '');
    lines.push(
      `declare module '@common/style/${withoutExt}' { const classes: string; export default classes; }`,
    );
  }

  for (const file of lessFiles) {
    const rel = `./${relative(baseDir, resolve(baseDir, file)).replace(/\.less$/, '')}`;
    lines.push(`declare module '${rel}.less' { const classes: string; export default classes; }`);
  }

  return lines;
}

const componentLines = buildLessDeclarations(componentsDir, componentLess);
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${componentLines.join('\n')}\n`);

const chatLines = buildLessDeclarations(chatDir, chatLess);
mkdirSync(dirname(chatOutFile), { recursive: true });
writeFileSync(chatOutFile, `${chatLines.join('\n')}\n`);

console.log(
  `[generate-less-types] 写入 components ${componentLines.length - 2} 条、chat ${chatLines.length - 1} 条 less 模块声明`,
);
