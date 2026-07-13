import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import fg from 'fast-glob';
import less from 'less';

import { createLessAliasPlugin } from './less-alias-plugin.ts';
import type { LibViteOptions } from './lib.ts';

/** 与 packages/components/style/index.js 一致：主题 + 全局公共样式 */
const UI_GLOBAL_STYLE_LESS = `@import '@common/style/web/theme/_index.less';
@import '@common/style/web/_global.less';
`;

/** UI 包：公共样式唯一编译源 */
const UI_STYLE_PKG = '@tdesign/web-components';

/** 编译公共 less 为 lib/style/index.css（文档中的「少量公共样式」） */
export async function emitGlobalStyleCss(monorepoRoot: string, outFile: string) {
  const result = await less.render(UI_GLOBAL_STYLE_LESS, {
    plugins: [createLessAliasPlugin(monorepoRoot)],
    javascriptEnabled: true,
  });

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, result.css, 'utf8');
}

/** Chat 包：与 UI 对齐 exports，但不重复编译；转发至 UI 公共样式（peer 依赖） */
export function emitChatStyleReexport(outFile: string) {
  const content = `/* 由 @tdesign/vite-config 自动生成，请勿手改 */
/* 公共 theme/global 样式唯一来源：${UI_STYLE_PKG} */
@import '${UI_STYLE_PKG}/lib/style/index.css';
`;

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, content, 'utf8');
}

/** 发布包 lib/style/index.css：UI 编译，Chat 转发（exports 契约与 UI 一致） */
export async function emitPublishStyleCss(
  { packageDir, pkg }: Pick<LibViteOptions, 'packageDir' | 'pkg'>,
  monorepoRoot: string,
) {
  const styleCss = resolve(packageDir, 'lib/style/index.css');
  const isChat = pkg.name.includes('chat');

  if (isChat) {
    emitChatStyleReexport(styleCss);
    console.log(`[lib-post-process] 已生成 Chat 样式转发 ${styleCss.replace(monorepoRoot, '')}`);
  } else {
    await emitGlobalStyleCss(monorepoRoot, styleCss);
    console.log(`[lib-post-process] 已生成 UI 公共样式 ${styleCss.replace(monorepoRoot, '')}`);
  }
}

/** 从源码 index.ts 生成带 export * 的 lib/index.d.ts（修复 rolldown dts 仅副作用 import 的问题） */
export function patchBarrelIndexDts({ packageDir, srcDir, pkg }: LibViteOptions) {
  const srcIndex = resolve(srcDir, 'index.ts');
  const libIndex = resolve(packageDir, 'lib/index.d.ts');

  if (!existsSync(srcIndex) || !existsSync(libIndex)) return;

  const src = readFileSync(srcIndex, 'utf8');
  const lines: string[] = [];

  for (const line of src.split('\n')) {
    const typeRe = /^export type \* from '\.\/([^']+)';/;
    const valueRe = /^export \* from '\.\/([^']+)';/;
    const extRe = /^export \* from '(@tdesign\/[^']+)';/;

    const typeMatch = line.match(typeRe);
    if (typeMatch) {
      lines.push(`export type * from './${typeMatch[1]}/index.js';`);
      continue;
    }

    const extMatch = line.match(extRe);
    if (extMatch) {
      lines.push(`export * from '${extMatch[1]}';`);
      continue;
    }

    const valueMatch = line.match(valueRe);
    if (valueMatch) {
      lines.push(`export * from './${valueMatch[1]}/index.js';`);
    }
  }

  if (lines.length === 0) return;

  const banner = `/**
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author || 'TDesign'}
 * @license ${pkg.license || 'MIT'}
 */
`;

  writeFileSync(libIndex, `${banner}${lines.join('\n')}\n`, 'utf8');
}

/** 根 package.json 使用 type=module 时，cjs/*.js 需要子 package 边界才能被 require 正确加载。 */
export function emitCjsPackageBoundary(packageDir: string) {
  const cjsDir = resolve(packageDir, 'cjs');
  if (!existsSync(cjsDir)) return;

  writeFileSync(resolve(cjsDir, 'package.json'), '{\n  "type": "commonjs"\n}\n', 'utf8');
}

/**
 * Rolldown / Oxc 会在 preserveModules 输出中保留 `//#region 原源码路径` 注释。
 * 这些注释对运行和 sourcemap 都没有价值，且会把 monorepo 内部路径暴露到发布包文本中。
 */
export function stripGeneratedSourceRegionComments(packageDir: string) {
  const files = fg.sync('{lib,esm,cjs}/**/*.{js,d.ts}', { cwd: packageDir, absolute: true });

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const next = content.replace(/^\/\/#(?:end)?region.*(?:\r?\n|$)/gm, '');

    if (next !== content) {
      writeFileSync(file, next, 'utf8');
    }
  }
}

/**
 * Chat 内联了 Cherry Markdown 的 icon font CSS，CSS 里使用固定的 ../assets/ch-icon.* 路径。
 * Vite 会产出 hash 文件名；发布包需额外补齐固定文件名，保证运行时字体 URL 可解析。
 */
export function emitCherryIconFontAssets(packageDir: string) {
  const assetDirs = fg.sync('{lib,esm,cjs,dist}/assets', { cwd: packageDir, absolute: true, onlyDirectories: true });

  for (const assetDir of assetDirs) {
    for (const ext of ['eot', 'woff2', 'woff', 'ttf', 'svg']) {
      const target = resolve(assetDir, `ch-icon.${ext}`);
      if (existsSync(target)) continue;

      const [source] = fg.sync(`ch-icon-*.${ext}`, { cwd: assetDir, absolute: true });
      if (source) {
        copyFileSync(source, target);
      }
    }
  }
}

/** 发布包构建收尾：公共 CSS（UI 编译 / Chat 转发）+ 全量入口 d.ts re-export。 */
export async function runLibPostProcess(options: LibViteOptions, monorepoRoot: string) {
  const { packageDir, srcDir, pkg } = options;
  const libDir = resolve(packageDir, 'lib');
  if (!existsSync(libDir)) return;

  await emitPublishStyleCss({ packageDir, pkg }, monorepoRoot);

  patchBarrelIndexDts({ ...options, packageDir, srcDir, pkg });
  emitCjsPackageBoundary(packageDir);
  stripGeneratedSourceRegionComments(packageDir);
  if (pkg.name.includes('chat')) {
    emitCherryIconFontAssets(packageDir);
  }

  const libIndex = resolve(libDir, 'index.d.ts');
  if (existsSync(libIndex) && readFileSync(libIndex, 'utf8').includes('export ')) {
    console.log(`[lib-post-process] 已修复 ${libIndex.replace(monorepoRoot, '')} re-export`);
  }

  // 与 CI 一致：校验 mock 未进入 chat 发布 lib（仅日志提示）
  if (pkg.name.includes('chat')) {
    const mockJs = fg.sync('**/mock/**/*.js', { cwd: libDir });
    if (mockJs.length) {
      console.warn(`[lib-post-process] 警告: chat lib 含 mock 文件 ${mockJs.length} 个`);
    }
  }
}
