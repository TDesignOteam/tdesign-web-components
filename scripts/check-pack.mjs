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

  const declarationMaps = files.filter((file) => file.endsWith('.d.ts.map'));
  assert(
    declarationMaps.length === 0,
    `[${name}] pack must not publish declaration maps without their source files:\n${declarationMaps.join('\n')}`,
  );

  if (name === 'chat') {
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
    ['declaration map reference', /sourceMappingURL=.*\.d\.ts\.map/],
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
    for (const typeName of [
      'ButtonProps',
      'UploadProps',
      'UploadFile',
      'ImageProps',
      'WatermarkProps',
      'WatermarkText',
    ]) {
      assert(
        new RegExp(`(?:interface|type) ${typeName}\\b`).test(declarationSource),
        `[ui] declaration surface is missing ${typeName}`,
      );
    }

    const entryExports = {
      'alert/index.d.ts': ['AlertProps'],
      'back-top/index.d.ts': ['BackTopProps'],
      'badge/index.d.ts': ['BadgeProps'],
      'button/index.d.ts': ['ButtonProps'],
      'date-picker/index.d.ts': ['DateValue', 'DisableDate', 'DatePickerProps'],
      'image/index.d.ts': ['ImageProps'],
      'link/index.d.ts': ['LinkProps'],
      'upload/index.d.ts': ['UploadFile', 'UploadProps'],
      'watermark/index.d.ts': ['WatermarkProps'],
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

    const internalPropsByEntry = {
      'affix/index.d.ts': ['TdAffixProps'],
      'avatar/index.d.ts': ['TdAvatarProps', 'TdAvatarGroupProps'],
      'breadcrumb/index.d.ts': ['TdBreadcrumbProps', 'TdBreadcrumbItemProps'],
      'button/index.d.ts': ['TdButtonProps'],
      'card/index.d.ts': ['TdCardProps'],
      'checkbox/index.d.ts': ['TdCheckboxProps', 'TdCheckboxGroupProps'],
      'collapse/index.d.ts': ['TdCollapseProps', 'TdCollapsePanelProps'],
      'date-picker/index.d.ts': ['TdDatePickerProps', 'TdDateRangePickerProps'],
      'dialog/index.d.ts': ['TdDialogProps'],
      'divider/index.d.ts': ['TdDividerProps'],
      'grid/index.d.ts': ['TdColProps', 'TdRowProps'],
      'input/index.d.ts': ['TdInputProps', 'TdInputGroupProps'],
      'loading/index.d.ts': ['TdLoadingProps'],
      'menu/index.d.ts': ['TdMenuProps', 'TdMenuItemProps'],
      'message/index.d.ts': ['TdMessageProps'],
      'notification/index.d.ts': ['TdNotificationProps'],
      'popconfirm/index.d.ts': ['TdPopconfirmProps'],
      'popup/index.d.ts': ['TdPopupProps'],
      'progress/index.d.ts': ['TdProgressProps'],
      'radio/index.d.ts': ['TdRadioProps', 'TdRadioGroupProps'],
      'range-input/index.d.ts': ['TdRangeInputProps', 'TdRangeInputPopupProps'],
      'select/index.d.ts': ['TdSelectProps', 'TdOptionProps'],
      'select-input/index.d.ts': ['TdSelectInputProps'],
      'skeleton/index.d.ts': ['TdSkeletonProps'],
      'slider/index.d.ts': ['TdSliderProps'],
      'space/index.d.ts': ['TdSpaceProps'],
      'swiper/index.d.ts': ['TdSwiperProps'],
      'switch/index.d.ts': ['TdSwitchProps'],
      'tabs/index.d.ts': ['TdTabsProps', 'TdTabPanelProps'],
      'tag-input/index.d.ts': ['TdTagInputProps'],
      'textarea/index.d.ts': ['TdTextareaProps'],
      'tooltip/index.d.ts': ['TdTooltipProps'],
      'upload/index.d.ts': ['TdUploadProps'],
    };
    for (const [entry, typeNames] of Object.entries(internalPropsByEntry)) {
      const source = readFileSync(resolve(esmDir, entry), 'utf8');
      for (const typeName of typeNames) {
        assert(
          !new RegExp(`export\\s*\\{[^}]*\\b${typeName}\\b`, 's').test(source),
          `[ui] ${entry} must not expose internal ${typeName}`,
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

function checkRuntimeExports({ name, packageDir }) {
  if (name !== 'ui') return;

  const runtimeExports = {
    'esm/index.js': ['Button', 'MessagePlugin'],
    'esm/message/index.js': ['Message', 'MessagePlugin', 'message'],
  };

  for (const [entry, exportNames] of Object.entries(runtimeExports)) {
    const source = readFileSync(resolve(repoRoot, packageDir, entry), 'utf8');
    for (const exportName of exportNames) {
      assert(
        new RegExp(`export\\s*\\{[^}]*\\b${exportName}\\b`, 's').test(source),
        `[ui] ${entry} does not preserve runtime export ${exportName}`,
      );
    }
  }

  console.log('[check:pack] ui runtime exports preserved');
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
  checkRuntimeExports(pkg);
  checkResolvable(pkg);
  checkComponentEntries(pkg);
}
