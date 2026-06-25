/**
 * 将源码包 dist 中的 .d.ts 同步到发布包 lib，并内联 shared / common 类型路径
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

import { emitCommonLibDts } from './emit-common-dts.mjs';
import { getWorkspaceRoot } from '../../packages/vite-config/src/get-root-path.mjs';

const PACKAGE_DTS_MAP = {
  ui: {
    srcDist: 'packages/components/dist',
    destLib: 'packages/tdesign-web-components/lib',
  },
  chat: {
    srcDist: 'packages/pro-components/chat/dist',
    destLib: 'packages/tdesign-web-components-chat/lib',
  },
};

/** 与 Vite preserveModules 内联路径对齐的类型目录 */
const BUNDLED_TYPE_SOURCES = [
  {
    srcDist: 'packages/shared/dist',
    destLibSubpath: 'packages/shared/src',
  },
];

/** 包名 / alias → lib 内相对根目录 */
const PKG_LIB_ROOT = {
  '@tdesign/web-components-shared': 'packages/shared/src',
  '@tdesign/common-js': 'packages/common/js',
  '@common/js': 'packages/common/js',
};

const PKG_IMPORT_RE =
  /(?<=(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,]*\s+from\s+|))['"](@(?:tdesign\/(?:web-components-shared|common-js)|common\/js)(?:\/[^'"]*)?)['"]|import\(['"](@(?:tdesign\/(?:web-components-shared|common-js)|common\/js)(?:\/[^'"]*)?)['"]\)/g;

function walkDts(srcDir, callback) {
  if (!existsSync(srcDir)) return;
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    const fullPath = resolve(srcDir, entry.name);
    if (entry.isDirectory()) {
      walkDts(fullPath, callback);
    } else if (entry.name.endsWith('.d.ts') || entry.name.endsWith('.d.ts.map')) {
      callback(fullPath);
    }
  }
}

function copyDistTree(srcDir, destDir) {
  walkDts(srcDir, (filePath) => {
    const rel = filePath.slice(srcDir.length + 1);
    const destPath = resolve(destDir, rel);
    mkdirSync(dirname(destPath), { recursive: true });
    cpSync(filePath, destPath);
  });
}

/**
 * 将 workspace 包名 / @common alias 转为 lib 内相对路径
 * @param {string} pkgImport 如 @common/js/upload/types
 */
function toBundledRelativeImport(pkgImport, fromDtsFile, destLibRoot) {
  let libRoot;
  let subPath;

  const commonJsAlias = pkgImport.match(/^@common\/js\/(.*)$/);
  if (commonJsAlias) {
    libRoot = PKG_LIB_ROOT['@common/js'];
    subPath = commonJsAlias[1];
  } else {
    const match = pkgImport.match(/^@tdesign\/(web-components-shared|common-js)(\/(.*))?$/);
    if (!match) return pkgImport;
    libRoot = PKG_LIB_ROOT[`@tdesign/${match[1]}`];
    subPath = match[3] || 'index';
  }

  if (!libRoot) return pkgImport;

  const targetBase = resolve(destLibRoot, libRoot, subPath);
  let rel = relative(dirname(fromDtsFile), targetBase).replace(/\\/g, '/');
  if (!rel.startsWith('.')) {
    rel = `./${rel}`;
  }
  return rel;
}

function rewriteDtsFile(filePath, destLibRoot) {
  const content = readFileSync(filePath, 'utf8');
  const rewritten = content.replace(PKG_IMPORT_RE, (full, fromImport, inlineImport) => {
    const pkgImport = fromImport || inlineImport;
    const rel = toBundledRelativeImport(pkgImport, filePath, destLibRoot);
    if (full.startsWith('import(')) {
      return `import('${rel}')`;
    }
    const quote = full.includes("'") ? "'" : '"';
    return `${quote}${rel}${quote}`;
  });

  if (rewritten !== content) {
    writeFileSync(filePath, rewritten);
  }
}

function rewriteAllLibDts(destLibRoot) {
  walkDts(destLibRoot, (filePath) => {
    if (filePath.endsWith('.d.ts')) {
      rewriteDtsFile(filePath, destLibRoot);
    }
  });
}

/** @param {string} monorepoRoot @param {'ui'|'chat'} pkg */
export function syncLibDts(monorepoRoot, pkg) {
  const mapping = PACKAGE_DTS_MAP[pkg];
  if (!mapping) {
    throw new Error(`未知 sync 目标: ${pkg}`);
  }

  const srcDir = resolve(monorepoRoot, mapping.srcDist);
  const destDir = resolve(monorepoRoot, mapping.destLib);

  if (!existsSync(srcDir)) {
    throw new Error(`类型产物目录不存在: ${mapping.srcDist}，请先执行 tsc -b`);
  }

  // 1. 同步组件源码包类型
  copyDistTree(srcDir, destDir);

  // 2. 从 common 源码 emit 声明到 lib（与 Vite JS 目录一致，不单独 build common-js）
  emitCommonLibDts(monorepoRoot, mapping.destLib);

  // 3. 同步内联 shared 类型
  for (const { srcDist, destLibSubpath } of BUNDLED_TYPE_SOURCES) {
    const bundledSrc = resolve(monorepoRoot, srcDist);
    const bundledDest = resolve(destDir, destLibSubpath);
    if (!existsSync(bundledSrc)) {
      throw new Error(`内联类型源不存在: ${srcDist}，请先执行对应 tsc -b`);
    }
    copyDistTree(bundledSrc, bundledDest);
  }

  // 4. 将包名 / alias import 改写为 lib 内相对路径
  rewriteAllLibDts(destDir);
}
