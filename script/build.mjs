#!/usr/bin/env node
/**
 * monorepo 构建辅助 CLI（与 Vite 配置解耦）
 *
 * 用法:
 *   node script/build.mjs emit-common-types     # 从 common 源码生成 .types-cache
 *   node script/build.mjs sync-dts ui|chat        # 同步源码包 dist 类型到发布包 lib
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const command = process.argv[2];

async function main() {
  const monorepoRoot = resolve(__dirname, '..');

  switch (command) {
    case 'emit-common-types': {
      const { emitCommonTypesCache } = await import('./build/emit-common-dts.mjs');
      emitCommonTypesCache(monorepoRoot);
      break;
    }
    case 'sync-dts': {
      const pkg = process.argv[3];
      const { syncLibDts } = await import('./build/sync-lib-dts.mjs');
      syncLibDts(monorepoRoot, pkg);
      break;
    }
    default:
      console.error('用法: node script/build.mjs <emit-common-types|sync-dts> [ui|chat]');
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
