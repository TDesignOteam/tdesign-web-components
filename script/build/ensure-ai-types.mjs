/**
 * 确保 ai-chat-engine 类型产物存在（Chat tsc 引用 dist/index.d.mts）
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

import { getWorkspaceRoot } from '../../packages/vite-config/src/get-root-path.mjs';

export function ensureAiChatEngineTypes(startDir) {
  const monorepoRoot = getWorkspaceRoot(startDir);
  const aiTypes = resolve(
    monorepoRoot,
    'common-utils/_ai-core/packages/chat-engine/dist/index.d.mts',
  );
  if (existsSync(aiTypes)) return;

  const aiCoreRoot = resolve(monorepoRoot, 'common-utils/_ai-core');
  const aiEngineDir = resolve(aiCoreRoot, 'packages/chat-engine');
  const aiBin = resolve(aiCoreRoot, 'node_modules/.bin/tsdown');

  console.log('[build] 构建 @tdesign/ai-chat-engine 类型...');
  if (!existsSync(aiBin)) {
    execSync('pnpm install', { cwd: aiCoreRoot, stdio: 'inherit' });
  }
  execSync('pnpm exec tsdown', { cwd: aiEngineDir, stdio: 'inherit' });

  if (!existsSync(aiTypes)) {
    throw new Error('ai-chat-engine 类型产物仍缺失');
  }
}
