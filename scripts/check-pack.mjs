import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const packages = [
  {
    name: 'ui',
    packageDir: 'packages/tdesign-web-components',
    imports: [
      '@tdesign/web-components',
      '@tdesign/web-components/button',
      '@tdesign/web-components/message',
      '@tdesign/web-components/avatar',
    ],
    requires: [
      '@tdesign/web-components',
      '@tdesign/web-components/button',
      '@tdesign/web-components/message',
      '@tdesign/web-components/avatar',
    ],
  },
  {
    name: 'chat',
    packageDir: 'packages/tdesign-web-components-chat',
    imports: [
      '@tdesign/web-components-chat',
      '@tdesign/web-components-chat/chatbot',
      '@tdesign/web-components-chat/chat-engine',
      '@tdesign/web-components-chat/chat-message',
    ],
    requires: [
      '@tdesign/web-components-chat',
      '@tdesign/web-components-chat/chatbot',
      '@tdesign/web-components-chat/chat-engine',
      '@tdesign/web-components-chat/chat-message',
    ],
  },
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function packFiles(packageDir) {
  const cwd = resolve(repoRoot, packageDir);
  const [pack] = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--cache', '/private/tmp/npm-cache'], {
      cwd,
      encoding: 'utf8',
    }),
  );

  return pack.files.map((file) => file.path);
}

function checkPackList({ name, packageDir }) {
  const files = packFiles(packageDir);
  const badFiles = files.filter(
    (file) =>
      file.includes('node_modules/') ||
      file.startsWith('packages/') ||
      file.startsWith('plugins/') ||
      file.startsWith('src/') ||
      file.includes('/packages/') ||
      file.includes('/shared/src/') ||
      file.includes('/shared/dist/') ||
      file.includes('packages/common'),
  );

  assert(badFiles.length === 0, `[${name}] pack contains internal workspace paths:\n${badFiles.join('\n')}`);

  const topLevel = [...new Set(files.map((file) => file.split('/')[0]))].sort();
  const expectedTopLevel = ['CHANGELOG.md', 'LICENSE', 'README.md', 'cjs', 'dist', 'esm', 'lib', 'package.json'];
  assert(
    JSON.stringify(topLevel) === JSON.stringify(expectedTopLevel),
    `[${name}] unexpected top-level pack entries: ${topLevel.join(', ')}`,
  );

  if (name === 'chat') {
    for (const format of ['cjs', 'esm', 'lib', 'dist']) {
      for (const ext of ['eot', 'svg', 'ttf', 'woff', 'woff2']) {
        const font = `${format}/assets/ch-icon.${ext}`;
        assert(files.includes(font), `[chat] missing Cherry icon font asset: ${font}`);
      }
    }
  }

  console.log(`[check:pack] ${name} pack list ok (${files.length} files)`);
}

function checkResolvable({ name, packageDir, imports, requires }) {
  const packageRoot = resolve(repoRoot, packageDir);
  const requireFromPackage = createRequire(resolve(packageRoot, 'package.json'));
  const resolvedImports = JSON.parse(
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
          const specifiers = ${JSON.stringify(imports)};
          const resolved = [];
          for (const specifier of specifiers) {
            resolved.push([specifier, await import.meta.resolve(specifier)]);
          }
          console.log(JSON.stringify(resolved));
        `,
      ],
      { cwd: packageRoot, encoding: 'utf8' },
    ),
  );

  for (const [specifier, resolved] of resolvedImports) {
    assert(resolved.startsWith('file:'), `[${name}] import did not resolve to file URL: ${specifier} -> ${resolved}`);
    const file = fileURLToPath(resolved);
    assert(existsSync(file), `[${name}] import target missing: ${specifier} -> ${file}`);
  }

  for (const specifier of requires) {
    const file = requireFromPackage.resolve(specifier);
    assert(existsSync(file), `[${name}] require target missing: ${specifier} -> ${file}`);
  }

  console.log(`[check:pack] ${name} exports smoke ok`);
}

for (const pkg of packages) {
  checkPackList(pkg);
  checkResolvable(pkg);
}
