#!/usr/bin/env node

/**
 * rss1102/chore/link-submodule
 *
 * Link build output to submodule node_modules for dev testing.
 *
 * Creates a complete package structure (with package.json + lib/ symlinks)
 * so that TS/webpack/vite can properly resolve tdesign-web-components imports.
 *
 * Commands:
 *   pnpm run dev:link
 *   pnpm run dev:link react
 *   pnpm run dev:link vue
 *   pnpm run dev:link --unlink
 *   pnpm run dev:link --check
 */

import { existsSync, mkdirSync, readdirSync, readlinkSync, symlinkSync, unlinkSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { argv } from 'process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Source packages whose lib/ output will be linked
const SOURCE_PACKAGES = {
  chat: { path: 'packages/chat', required: true },
  ui: { path: 'packages/ui', required: true },
  shared: { path: 'packages/shared', required: false },
};

// Target submodules to receive symlinks
const TARGETS = {
  react: {
    name: '_tdesign-react',
    nmDir: (root) => join(root, 'playground/_tdesign-react/node_modules/tdesign-web-components'),
  },
  vue: {
    name: '_tdesign-vue-next',
    nmDir: (root) => join(root, 'playground/_tdesign-vue-next/node_modules/tdesign-web-components'),
  },
};

// Package.json template for the fake package
function createPackageJson() {
  return JSON.stringify({
    name: 'tdesign-web-components',
    version: '0.0.0-dev',
    private: true,
    description: 'dev-link: local build output for testing in submodules',
    main: 'lib/index.js',
    module: 'lib/index.js',
    types: 'lib/index.d.ts',
    sideEffects: ['*.css', '*.less'],
    exports: {
      '.': './lib/index.js',
      './lib/*': './lib/*',
      './style/*': './lib/style/*',
    },
  }, null, 2);
}

// CLI args
const args = argv.slice(2);
const isUnlink = args.includes('--unlink');
const isCheck = args.includes('--check');
const targetName = args.find((a) => !a.startsWith('--'));

const COLORS = { info: '\x1b[36m', success: '\x1b[32m', warn: '\x1b[33m', error: '\x1b[31m', reset: '\x1b[0m' };

function log(msg, type = 'info') {
  console.log(`${COLORS[type]}[dev-link]${COLORS.reset} ${msg}`);
}

/** Check if a source package has been built; returns libDir | false | null */
function checkSourceBuilt(pkgName, pkgInfo) {
  const libDir = join(ROOT, pkgInfo.path, 'lib');
  if (!existsSync(libDir)) {
    if (pkgInfo.required) {
      log(`  ${pkgName} not built. Run "pnpm run build:${pkgName}" first`, 'error');
      return false;
    }
    return null;
  }
  return libDir;
}

/** Remove existing links from target directory (handles single symlink or dir of symlinks) */
function cleanTarget(targetDir) {
  if (!existsSync(targetDir)) return;

  // Single symlink case
  try {
    readlinkSync(targetDir);
    unlinkSync(targetDir);
    return;
  } catch {
    // Directory with individual symlinks - remove each symlink entry
  }

  const entries = readdirSync(targetDir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(targetDir, entry.name);
    try {
      readlinkSync(entryPath);
      unlinkSync(entryPath);
    } catch {
      // Not a symlink, skip
    }
  }
}

/**
 * Create merged symlinks for one target.
 * Each source package's lib/ contents are individually symlinked into targetDir.
 */
function createLinks(targetKey) {
  const target = TARGETS[targetKey];
  if (!target) {
    log(`Unknown target: ${targetKey}`, 'error');
    return false;
  }

  const targetDir = target.nmDir(ROOT);

  // Validate sources are built
  const validSources = [];
  for (const [name, info] of Object.entries(SOURCE_PACKAGES)) {
    const result = checkSourceBuilt(name, info);
    if (result === false) return false;
    if (result) validSources.push({ name, libDir: result });
  }

  if (validSources.length === 0) {
    log('No built sources to link', 'warn');
    return false;
  }

  // Clean and recreate target
  cleanTarget(targetDir);
  mkdirSync(targetDir, { recursive: true });

  // Write package.json so TS/webpack can resolve the package
  writeFileSync(join(targetDir, 'package.json'), createPackageJson());

  let count = 0;

  for (const { name, libDir } of validSources) {
    const entries = readdirSync(libDir, { withFileTypes: true });

    for (const entry of entries) {
      // Skip hidden files and rollup internals
      if (entry.name.startsWith('.') || entry.name === '_virtual') continue;

      const srcPath = join(libDir, entry.name);
      const dstPath = join(targetDir, entry.name);

      // Don't overwrite (another package may have linked this name)
      if (existsSync(dstPath)) continue;

      symlinkSync(relative(targetDir, srcPath), dstPath, entry.isDirectory() ? 'junction' : 'file');
      count += 1;
    }

    log(`  + ${name}/lib/*`);
  }

  log(`Linked ${count} items -> ${target.name}`, 'success');
  return true;
}

/** Remove all symlinks from one target */
function removeLinks(targetKey) {
  const target = TARGETS[targetKey];
  if (!target) return;

  const targetDir = target.nmDir(ROOT);
  if (!existsSync(targetDir)) {
    log(`${target.name}: nothing to unlink`, 'warn');
    return;
  }

  let removed = 0;
  const entries = readdirSync(targetDir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(targetDir, entry.name);
    try {
      readlinkSync(entryPath);
      unlinkSync(entryPath);
      removed += 1;
    } catch {
      // Not a symlink, skip
    }
  }
  log(`Unlinked ${removed} items from ${target.name}`, 'warn');
}

/** Display current link status for all targets */
function checkStatus() {
  log('=== Link Status ===\n');

  for (const [key, target] of Object.entries(TARGETS)) {
    const targetDir = target.nmDir(ROOT);

    console.log(`\n${key.padEnd(8)} (${target.name}):`);
    console.log('-'.repeat(40));

    if (!existsSync(targetDir)) {
      log('  NOT LINKED', 'warn');
      continue;
    }

    // Single symlink case
    try {
      log(`  -> ${readlinkSync(targetDir)}`, 'info');
      continue;
    } catch {
      // Directory of individual symlinks
    }

    let linkedCount = 0;
    let regularCount = 0;

    const entries = readdirSync(targetDir, { withFileTypes: true });
    for (const entry of entries) {
      try {
        log(`  OK ${entry.name} -> ${readlinkSync(join(targetDir, entry.name)).substring(0, 45)}`, 'info');
        linkedCount += 1;
      } catch {
        regularCount += 1;
      }
    }

    log(
      `  Total: ${linkedCount} linked${regularCount ? `, ${regularCount} regular` : ''}`,
      linkedCount > 0 ? 'success' : 'warn',
    );
  }
}

// Entry point
(function main() {
  const targets = targetName ? [targetName] : Object.keys(TARGETS);

  if (isCheck) {
    checkStatus();
    return;
  }

  if (isUnlink) {
    log('=== Unlink Submodules ===\n');
    targets.forEach(removeLinks);
    return;
  }

  log('=== Link Submodules ===\n');

  const allSuccess = targets.every(createLinks);

  if (allSuccess) {
    log('\nDone! Rebuild & relink: "pnpm run build:chat && pnpm run dev:link"', 'success');
  }
})();
