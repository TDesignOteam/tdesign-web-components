import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
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
    imports: [
      '@tdesign/web-components-chat',
      '@tdesign/web-components-chat/chatbot',
      '@tdesign/web-components-chat/chat-engine',
    ],
    iife: 'dist/web-components-chat.min.js',
  },
];

const uiPackage = JSON.parse(readFileSync(resolve(repoRoot, 'packages/tdesign-web-components/package.json'), 'utf8'));
const chatPackage = JSON.parse(
  readFileSync(resolve(repoRoot, 'packages/tdesign-web-components-chat/package.json'), 'utf8'),
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function checkReleaseVersions() {
  assert(uiPackage.version === chatPackage.version, 'UI and Chat package versions must match');
  assert(
    chatPackage.peerDependencies?.['@tdesign/web-components'] === `^${uiPackage.version}`,
    'Chat peer dependency must match the current UI package version',
  );
  console.log(`[check:pack] release versions aligned (${uiPackage.version})`);
}

function packFiles(packageDir) {
  const [pack] = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--cache', resolve(tmpdir(), 'npm-cache')], {
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
      /(^|\/)\.cache(\/|$)/.test(file) ||
      file.includes('node_modules/') ||
      file.includes('/packages/') ||
      file.includes('/shared/src/') ||
      file.includes('/shared/dist/') ||
      file.includes('packages/common'),
  );
  const required = ['esm/index.js', 'esm/index.d.ts', iife];

  assert(forbidden.length === 0, `[${name}] pack contains forbidden files:\n${forbidden.join('\n')}`);
  assert(
    required.every((file) => files.includes(file)),
    `[${name}] pack is missing ESM or IIFE output`,
  );

  if (name === 'chat') {
    const declarationMaps = files.filter((file) => file.endsWith('.d.ts.map'));
    assert(
      declarationMaps.length === 0,
      `[chat] pack must not publish declaration maps without their source files:\n${declarationMaps.join('\n')}`,
    );
    for (const ext of ['eot', 'svg', 'ttf', 'woff', 'woff2']) {
      assert(files.includes(`dist/assets/ch-icon.${ext}`), `[chat] missing CDN font asset: ${ext}`);
    }
    const esmIndex = readFileSync(resolve(repoRoot, packageDir, 'esm/index.js'), 'utf8');
    assert(/\bChatAttachmentContent\b/.test(esmIndex), '[chat] root ESM export is missing ChatAttachmentContent');
  }

  console.log(`[check:pack] ${name} pack list ok (${files.length} files)`);
}

function collectDeclarationFiles(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) return collectDeclarationFiles(path);
    return entry.name.endsWith('.d.ts') ? [path] : [];
  });
}

function checkDeclarationReferences({ name, packageDir }) {
  const esmDir = resolve(repoRoot, packageDir, 'esm');
  const declarationFiles = collectDeclarationFiles(esmDir);
  const forbiddenPatterns = [
    ['common type cache', /\.cache\/common-js-types/],
    ['common source path', /packages\/common/],
    ['shared source path', /shared\/(?:src|dist)\//],
    ['workspace absolute path', /(?:\/Users\/|\/home\/runner\/work\/|[A-Za-z]:\\)/],
  ];
  const violations = [];

  for (const file of declarationFiles) {
    const source = readFileSync(file, 'utf8');
    for (const [label, pattern] of forbiddenPatterns) {
      if (pattern.test(source)) violations.push(`${file}: ${label}`);
    }
  }

  assert(violations.length === 0, `[${name}] declarations expose internal paths:\n${violations.join('\n')}`);
  const declarationSource = declarationFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
  if (name === 'ui') {
    const publicTypeSources = {
      'alert/type.ts': ['TdAlertProps'],
      'back-top/type.ts': ['BackTopShapeEnum', 'TdBackTopProps'],
      'badge/type.ts': ['TdBadgeProps'],
      'image/type.ts': ['ImageSrcset', 'TdImageProps'],
      'link/type.ts': ['TdLinkProps'],
      'watermark/type.ts': ['TdWatermarkProps', 'WatermarkImage', 'WatermarkText'],
    };
    for (const [relativeSource, expectedNames] of Object.entries(publicTypeSources)) {
      const source = readFileSync(resolve(repoRoot, 'packages/components', relativeSource), 'utf8');
      const actualNames = [...source.matchAll(/^export\s+(?:interface|type|enum|const|class)\s+([A-Za-z0-9_]+)/gm)].map(
        ([, typeName]) => typeName,
      );
      assert(
        actualNames.length === expectedNames.length &&
          expectedNames.every((typeName) => actualNames.includes(typeName)),
        `[ui] ${relativeSource} public type allowlist changed: ${actualNames.join(', ')}`,
      );
    }

    for (const typeName of [
      'TdButtonProps',
      'ButtonProps',
      'TdUploadProps',
      'UploadFile',
      'TdImageProps',
      'TdWatermarkProps',
      'WatermarkText',
    ]) {
      assert(
        new RegExp(`(?:interface|type) ${typeName}\\b`).test(declarationSource),
        `[ui] declaration surface is missing ${typeName}`,
      );
    }

    const entryExports = {
      'alert/index.d.ts': ['AlertProps', 'TdAlertProps'],
      'back-top/index.d.ts': ['BackTopProps', 'BackTopShapeEnum', 'TdBackTopProps'],
      'badge/index.d.ts': ['BadgeProps', 'TdBadgeProps'],
      'button/index.d.ts': ['ButtonProps', 'TdButtonProps'],
      'date-picker/index.d.ts': ['DateValue', 'DisableDate', 'TdDatePickerProps'],
      'image/index.d.ts': ['ImageProps', 'ImageSrcset', 'TdImageProps'],
      'link/index.d.ts': ['LinkProps', 'TdLinkProps'],
      'upload/index.d.ts': ['UploadFile', 'TdUploadProps'],
      'watermark/index.d.ts': ['WatermarkProps', 'WatermarkText', 'WatermarkImage', 'TdWatermarkProps'],
    };
    for (const [entry, typeNames] of Object.entries(entryExports)) {
      const source = readFileSync(resolve(esmDir, entry), 'utf8');
      for (const typeName of typeNames) {
        assert(
          new RegExp(`export\\s*\\{[^}]*\\b${typeName}\\b`, 's').test(source),
          `[ui] ${entry} does not export ${typeName}`,
        );
      }
    }
  }
  if (name === 'chat') {
    for (const typeName of [
      'TdChatProps',
      'TdChatbotApi',
      'TdChatMessageProps',
      'TdChatAttachmentContentProps',
      'TdChatSenderProps',
      'TdAttachmentItem',
    ]) {
      assert(
        new RegExp(`(?:interface|type) ${typeName}\\b`).test(declarationSource),
        `[chat] declaration surface is missing ${typeName}`,
      );
    }
  }
  console.log(`[check:pack] ${name} declaration references ok (${declarationFiles.length} files)`);
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

checkReleaseVersions();

for (const pkg of packages) {
  checkPackList(pkg);
  checkDeclarationReferences(pkg);
  checkResolvable(pkg);
  checkComponentEntries(pkg);
}
