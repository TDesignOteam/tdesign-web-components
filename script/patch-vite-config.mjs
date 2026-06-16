#!/usr/bin/env node
/**
 * 为外部项目（如 tdesign-vue-next chat site）补丁 vite.config，
 * 使其通过 alias 使用本仓库 web-components 源码。
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

const WEBC_SRC = resolve(webcRoot, 'packages/components');
const SHARED_SRC = resolve(webcRoot, 'packages/shared/src');
const CHAT_SRC = resolve(webcRoot, 'packages/pro-components/chat');
const AI_ENGINE_SRC = resolve(webcRoot, 'common-utils/_ai-core/packages/chat-engine');
const AI_SHARED_SRC = resolve(webcRoot, 'common-utils/_ai-core/packages/shared');
const COMMON_SRC = resolve(webcRoot, 'common-utils/_common');

let config = readFileSync(viteConfigPath, 'utf8');

// 1. 补充 path import
const pathImport = "import { resolve } from 'path';";
if (!config.includes(pathImport)) {
  config = config.replace(/import \{ defineConfig/, `${pathImport}\nimport { defineConfig`);
}

// 2. alias 指向 monorepo 源码
const aliasEntries = `
        // === Patched: point to current repo web-components source ===
        '@tdesign/web-components': resolve('${WEBC_SRC}'),
        '@tdesign/web-components-shared': resolve('${SHARED_SRC}'),
        '@tdesign/web-components-chat': resolve('${CHAT_SRC}'),
        '@tdesign/ai-chat-engine': resolve('${AI_ENGINE_SRC}'),
        '@tdesign/ai-shared': resolve('${AI_SHARED_SRC}'),
        '@common': resolve('${COMMON_SRC}'),
        // === End patch ===`;

config = config.replace(/resolve:\s*\{/, `resolve: {${aliasEntries}`);

// 3. Vite 8 使用 Oxc 处理 Omi JSX（兼容仍写 esbuild 的旧配置）
const oxcConfig = `
    oxc: {
      jsx: {
        runtime: 'classic',
        pragma: 'Component.h',
        pragmaFrag: 'Component.f',
      },
      jsxInject: "import { Component } from 'omi'",
    },`;

if (!config.includes('oxc:') && !config.includes('esbuild:')) {
  config = config.replace(/plugins:/, `${oxcConfig}\n    plugins:`);
} else if (config.includes('esbuild:') && !config.includes('oxc:')) {
  config = config.replace(
    /esbuild:\s*\{[^}]*\},?/s,
    `oxc: {
      jsx: {
        runtime: 'classic',
        pragma: 'Component.h',
        pragmaFrag: 'Component.f',
      },
      jsxInject: "import { Component } from 'omi'",
    },`,
  );
}

// 4. workspace 包不走 dep 预构建
const excludeEntries = [
  '@tdesign/web-components',
  '@tdesign/web-components-chat',
  '@tdesign/web-components-shared',
  '@tdesign/ai-chat-engine',
  '@tdesign/ai-shared',
];

for (const pkg of excludeEntries) {
  if (!config.includes(`'${pkg}'`)) {
    if (config.includes('optimizeDeps:')) {
      config = config.replace(/exclude:\s*\[/, `exclude: [\n        '${pkg}',`);
    } else {
      config = config.replace(
        /plugins:/,
        `optimizeDeps: {\n      exclude: [\n        '${pkg}',\n      ],\n    },\n    plugins:`,
      );
      break;
    }
  }
}

writeFileSync(viteConfigPath, config);
console.log('=== Patched vite.config.ts ===');
console.log(config);
