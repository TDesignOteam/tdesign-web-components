import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const packages = [
  {
    name: 'ui',
    sourceDir: 'packages/components',
    packageDir: 'packages/tdesign-web-components',
    imports: ['@tdesign/web-components', '@tdesign/web-components/button', '@tdesign/web-components/message'],
    iife: 'dist/web-components.min.js',
  },
  {
    name: 'chat',
    sourceDir: 'packages/pro-components/chat',
    packageDir: 'packages/tdesign-web-components-chat',
    imports: ['@tdesign/web-components-chat', '@tdesign/web-components-chat/chatbot', '@tdesign/web-components-chat/chat-engine'],
    iife: 'dist/web-components-chat.min.js',
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function packFiles(packageDir) {
  const [pack] = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--cache', '/private/tmp/npm-cache'], {
      cwd: resolve(repoRoot, packageDir),
      encoding: 'utf8',
    }),
  );
  return pack.files.map((file) => file.path);
}

function checkPackList({ name, packageDir, iife }) {
  const files = packFiles(packageDir);
  const forbidden = files.filter(
    (file) =>
      /^(cjs|lib|plugins|src|packages)\//.test(file) ||
      file.includes('node_modules/') ||
      file.includes('/packages/') ||
      file.includes('/shared/src/') ||
      file.includes('/shared/dist/') ||
      file.includes('packages/common'),
  );
  const required = ['esm/index.js', 'esm/index.d.ts', iife];

  assert(forbidden.length === 0, `[${name}] pack contains forbidden files:\n${forbidden.join('\n')}`);
  assert(required.every((file) => files.includes(file)), `[${name}] pack is missing ESM or IIFE output`);

  if (name === 'chat') {
    for (const ext of ['eot', 'svg', 'ttf', 'woff', 'woff2']) {
      assert(files.includes(`dist/assets/ch-icon.${ext}`), `[chat] missing CDN font asset: ${ext}`);
    }
  }

  console.log(`[check:pack] ${name} pack list ok (${files.length} files)`);
}

function checkResolvable({ name, packageDir, imports }) {
  const packageRoot = resolve(repoRoot, packageDir);
  const resolvedImports = JSON.parse(
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `const specifiers = ${JSON.stringify(imports)}; console.log(JSON.stringify(await Promise.all(specifiers.map(async (specifier) => [specifier, await import.meta.resolve(specifier)]))));`,
      ],
      { cwd: packageRoot, encoding: 'utf8' },
    ),
  );

  for (const [specifier, resolved] of resolvedImports) {
    const file = fileURLToPath(resolved);
    assert(existsSync(file), `[${name}] import target missing: ${specifier} -> ${file}`);
  }

  console.log(`[check:pack] ${name} ESM exports smoke ok`);
}

function checkComponentEntries({ name, sourceDir, packageDir }) {
  const sourceRoot = resolve(repoRoot, sourceDir);
  const esmRoot = resolve(repoRoot, packageDir, 'esm');
  const missing = readdirSync(sourceRoot).filter((entry) => {
    const entryDir = resolve(sourceRoot, entry);
    return (
      !entry.startsWith('_') &&
      statSync(entryDir).isDirectory() &&
      (existsSync(resolve(entryDir, 'index.ts')) || existsSync(resolve(entryDir, 'index.tsx'))) &&
      !existsSync(resolve(esmRoot, entry, 'index.js'))
    );
  });

  assert(missing.length === 0, `[${name}] missing ESM component entries:\n${missing.join('\n')}`);
  console.log(`[check:pack] ${name} ESM component entries ok`);
}

for (const pkg of packages) {
  checkPackList(pkg);
  checkResolvable(pkg);
  checkComponentEntries(pkg);
}
