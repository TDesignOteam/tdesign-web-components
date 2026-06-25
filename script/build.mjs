#!/usr/bin/env node
/**
 * monorepo 构建辅助 CLI（与 Vite 配置解耦）
 *
 * 用法:
 *   node script/build.mjs cleanup-dts       # 清理误写入源码目录的 .d.ts
 *   node script/build.mjs sync-dts ui|chat  # 同步源码包 dist 类型到发布包 lib
 *   node script/build.mjs ensure-ai-types   # 确保 ai-chat-engine dist 类型存在
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const command = process.argv[2];

async function main() {
  switch (command) {
    case 'ensure-ai-types': {
      const { ensureAiChatEngineTypes } = await import('./build/ensure-ai-types.mjs');
      ensureAiChatEngineTypes(resolve(__dirname, '..'));
      break;
    }
    case 'cleanup-dts': {
      const { cleanupGeneratedSourceDts } = await import('./build/cleanup-source-dts.mjs');
      const count = cleanupGeneratedSourceDts(__dirname);
      if (count > 0) {
        console.log(`[build] 已删除 ${count} 个误生成的源码 .d.ts`);
      }
      break;
    }
    case 'sync-dts': {
      const pkg = process.argv[3];
      const { syncLibDts } = await import('./build/sync-lib-dts.mjs');
      syncLibDts(resolve(__dirname, '..'), pkg);
      break;
    }
    default:
      console.error('用法: node script/build.mjs <cleanup-dts|sync-dts|ensure-ai-types> [ui|chat]');
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
