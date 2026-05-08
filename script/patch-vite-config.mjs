#!/usr/bin/env node
/**
 * Patch tdesign-vue-next chat site's vite.config.ts
 * to use current repo's web-components source code
 * instead of the npm package.
 *
 * Usage: node patch-vite-config.mjs <vite-config-path> <webc-root>
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const viteConfigPath = process.argv[2];
const webcRoot = process.argv[3];

if (!viteConfigPath || !webcRoot) {
  console.error('Usage: node patch-vite-config.mjs <vite-config-path> <webc-root>');
  process.exit(1);
}

const WEBC_SRC = resolve(webcRoot, 'packages/ui/src');
const SHARED_SRC = resolve(webcRoot, 'packages/shared/src');
const CHAT_SRC = resolve(webcRoot, 'packages/chat/src');
const AI_ENGINE_SRC = resolve(webcRoot, 'common-utils/_ai-core/packages/chat-engine');
const AI_SHARED_SRC = resolve(webcRoot, 'common-utils/_ai-core/packages/shared');
const COMMON_SRC = resolve(webcRoot, 'common-utils/_common');

let config = readFileSync(viteConfigPath, 'utf8');

// 1. Add path import if not present
const pathImport = "import { resolve } from 'path';";
if (!config.includes(pathImport)) {
  config = config.replace(
    /import \{ defineConfig/,
    `${pathImport}\nimport { defineConfig`
  );
}

// 2. Add aliases for @tdesign/web-components and internal packages
const aliasEntries = `
        // === Patched: point to current repo web-components source ===
        '@tdesign/web-components-ui': resolve('${WEBC_SRC}'),
        '@tdesign/web-components-shared': resolve('${SHARED_SRC}'),
        '@tdesign/web-components-chat': resolve('${CHAT_SRC}'),
        '@tdesign/ai-chat-engine': resolve('${AI_ENGINE_SRC}'),
        '@tdesign/ai-shared': resolve('${AI_SHARED_SRC}'),
        '@common': resolve('${COMMON_SRC}'),
        // === End patch ===`;

config = config.replace(
  /resolve:\s*\{/,
  `resolve: {${aliasEntries}`
);

// 3. Add esbuild config for Omi JSX support
const esbuildConfig = `
    esbuild: {
      jsxFactory: 'Component.h',
      jsxFragment: 'Component.f',
    },`;

if (!config.includes('esbuild:')) {
  config = config.replace(
    /plugins:/,
    `${esbuildConfig}\n    plugins:`
  );
}

// 4. Add optimizeDeps.exclude for patched packages
const excludeEntries = [
  '@tdesign/web-components-ui',
  '@tdesign/web-components-chat',
  '@tdesign/ai-chat-engine',
  '@tdesign/ai-shared',
];

for (const pkg of excludeEntries) {
  if (!config.includes(`'${pkg}'`)) {
    config = config.replace(
      /exclude:\s*\[/,
      `exclude: [\n        '${pkg}',`
    );
  }
}

writeFileSync(viteConfigPath, config);
console.log('=== Patched vite.config.ts ===');
console.log(config);
