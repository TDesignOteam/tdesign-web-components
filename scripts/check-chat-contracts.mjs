import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import ts from 'typescript';

const repoRoot = resolve(import.meta.dirname, '..');
const chatRoot = resolve(repoRoot, 'packages/pro-components/chat');
const tsconfigPath = resolve(chatRoot, 'tsconfig.check.json');
const tsconfig = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
if (tsconfig.error) throw new Error(ts.formatDiagnostic(tsconfig.error, ts.createCompilerHost({})));
const parsedConfig = ts.parseJsonConfigFileContent(tsconfig.config, ts.sys, chatRoot);
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const checker = program.getTypeChecker();

const contracts = [
  ['chatbot', 'TdChatProps', 'chat.tsx'],
  ['chat-message', 'TdChatMessageProps', 'chat-item.tsx'],
  ['chat-sender', 'TdChatSenderProps', 'chat-sender.tsx'],
  ['attachments', 'TdAttachmentsProps', 'attachments.tsx'],
  ['filecard', 'TdFileCardProps', 'filecard.tsx'],
  ['chat-action', 'TdChatActionProps', 'action.tsx'],
  ['chat-loading', 'TdChatLoadingProps', 'loading.tsx'],
];

const contentContracts = [
  ['markdown-content.tsx', 'TdChatMarkdownContentProps'],
  ['search-content.tsx', 'TdChatSearchContentProps'],
  ['suggestion-content.tsx', 'TdChatSuggestionContentProps'],
  ['attachment-content.tsx', 'TdChatAttachmentContentProps'],
  ['thinking-content.tsx', 'TdChatThinkContentProps'],
  ['reasoning-content.tsx', 'TdChatReasoningProps'],
];

const errors = [];

function parse(path) {
  return ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function propertyName(member) {
  if (!member.name) return undefined;
  if (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) return member.name.text;
  return undefined;
}

function publicInterfaceProps(typePath, interfaceName) {
  const source = parse(typePath);
  const declarations = new Map(
    source.statements.filter((node) => ts.isInterfaceDeclaration(node)).map((node) => [node.name.text, node]),
  );
  const props = new Set();
  const visited = new Set();
  const collect = (name) => {
    if (visited.has(name)) return;
    visited.add(name);
    const declaration = declarations.get(name);
    if (!declaration) return;
    for (const heritage of declaration.heritageClauses ?? []) {
      for (const type of heritage.types) {
        if (ts.isIdentifier(type.expression)) collect(type.expression.text);
      }
    }
    for (const member of declaration.members) {
      if (ts.getJSDocTags(member).some((tag) => tag.tagName.text === 'internal')) continue;
      const name = propertyName(member);
      if (name && name !== 'children') props.add(name);
    }
  };
  collect(interfaceName);
  if (!visited.has(interfaceName)) throw new Error(`Missing interface ${interfaceName}: ${typePath}`);
  return [...props];
}

function runtimeProps(componentPath) {
  const source = parse(componentPath);
  let props = [];
  source.forEachChild((node) => {
    if (!ts.isClassDeclaration(node)) return;
    const declaration = node.members.find(
      (member) =>
        ts.isPropertyDeclaration(member) &&
        member.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword) &&
        propertyName(member) === 'propTypes',
    );
    if (declaration?.initializer && ts.isObjectLiteralExpression(declaration.initializer)) {
      props = declaration.initializer.properties.map(propertyName).filter(Boolean);
    }
  });
  return props;
}

function resolvedPublicTypeProps(typePath, typeName) {
  const source = program.getSourceFile(typePath);
  if (!source) throw new Error(`Missing program source: ${typePath}`);
  const declaration = source.statements.find(
    (node) => (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text === typeName,
  );
  if (!declaration) throw new Error(`Missing public type ${typeName}: ${typePath}`);
  const symbol = checker.getSymbolAtLocation(declaration.name);
  const type = checker.getDeclaredTypeOfSymbol(symbol);
  return checker
    .getPropertiesOfType(type)
    .filter(
      (property) =>
        !property.declarations?.some((member) =>
          ts.getJSDocTags(member).some((tag) => tag.tagName.text === 'internal'),
        ),
    )
    .map((property) => property.name)
    .filter((name) => name !== 'children');
}

function runtimePropValidators(componentPath) {
  const source = parse(componentPath);
  const validators = new Map();
  source.forEachChild((node) => {
    if (!ts.isClassDeclaration(node)) return;
    const declaration = node.members.find(
      (member) =>
        ts.isPropertyDeclaration(member) &&
        member.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword) &&
        propertyName(member) === 'propTypes',
    );
    if (!declaration?.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) return;
    for (const property of declaration.initializer.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      validators.set(propertyName(property), property.initializer.getText(source).replace(/\s+/g, ' '));
    }
  });
  return validators;
}

for (const [folder, interfaceName, componentFile] of contracts) {
  const typePath = resolve(chatRoot, folder, 'type.ts');
  const componentPath = resolve(chatRoot, folder, componentFile);
  const defaultReadmePath = resolve(chatRoot, folder, 'README.md');
  const readmePath = existsSync(defaultReadmePath) ? defaultReadmePath : resolve(chatRoot, folder, `${folder}.md`);
  const typeProps = publicInterfaceProps(typePath, interfaceName);
  const componentProps = runtimeProps(componentPath);
  const readme = readFileSync(readmePath, 'utf8');

  for (const name of typeProps) {
    if (!componentProps.includes(name)) errors.push(`${folder}: type prop "${name}" is missing from runtime propTypes`);
    const eventName = /^on[A-Z]/.test(name) ? `${name[2].toLowerCase()}${name.slice(3)}` : undefined;
    if (!new RegExp(`\\b${name}\\b`).test(readme) && (!eventName || !new RegExp(`\\b${eventName}\\b`).test(readme))) {
      errors.push(`${folder}: type prop "${name}" is missing from README`);
    }
  }
  for (const name of componentProps) {
    if (!typeProps.includes(name) && !(folder === 'chat-sender' && name === 'suffix')) {
      errors.push(`${folder}: runtime prop "${name}" is missing from public type`);
    }
  }
}

const contentReadme = readFileSync(resolve(chatRoot, 'chat-message/content/README.md'), 'utf8');
for (const [componentFile, typeName] of contentContracts) {
  const componentPath = resolve(chatRoot, 'chat-message/content', componentFile);
  const typeProps = resolvedPublicTypeProps(componentPath, typeName);
  const componentProps = runtimeProps(componentPath);
  for (const name of typeProps) {
    if (!componentProps.includes(name)) {
      errors.push(`chat-message/content/${componentFile}: type prop "${name}" is missing from runtime propTypes`);
    }
    if (!new RegExp(`\\b${name}\\b`).test(contentReadme)) {
      errors.push(`chat-message/content/${componentFile}: type prop "${name}" is missing from README`);
    }
  }
  for (const name of componentProps) {
    if (!typeProps.includes(name)) {
      errors.push(`chat-message/content/${componentFile}: runtime prop "${name}" is missing from public type`);
    }
  }
}

const validatorContracts = [
  ['chat-action/action.tsx', 'actionBar', '[Array, Boolean]'],
  ['chat-action/action.tsx', 'handleAction', 'Function'],
  ['chat-message/chat-item.tsx', 'actions', '[Array, Boolean]'],
  ['chat-message/content/search-content.tsx', 'handleSearchItemClick', 'Function'],
  ['chat-message/content/search-content.tsx', 'handleSearchResultClick', 'Function'],
  ['chat-message/content/suggestion-content.tsx', 'content', 'Array'],
  ['chat-message/content/suggestion-content.tsx', 'handlePromptClick', 'Function'],
  ['chat-message/content/attachment-content.tsx', 'content', 'Array'],
];
for (const [relativePath, prop, expected] of validatorContracts) {
  const componentPath = resolve(chatRoot, relativePath);
  const actual = runtimePropValidators(componentPath).get(prop);
  if (actual !== expected)
    errors.push(`${relativePath}: runtime validator for "${prop}" is ${actual}, expected ${expected}`);
}

const forbiddenDocs = new Map([
  ['chatbot', ['clearHistory', 'scrollToBottom', 'chat_submit']],
  ['chat-message', ['TdChatSenderAction', 'textareaProps', 'onSend']],
  ['chat-action', ['goodActived', 'badActived', 'onActions', 'presetActions']],
]);
for (const [folder, names] of forbiddenDocs) {
  const readme = readFileSync(resolve(chatRoot, folder, 'README.md'), 'utf8');
  for (const name of names) {
    if (new RegExp(`\\b${name}\\b`).test(readme)) errors.push(`${folder}: README contains stale API "${name}"`);
  }
}

const uploadType = readFileSync(resolve(repoRoot, 'packages/components/upload/type.ts'), 'utf8');
if (!/interface UploadFile extends CommonUploadFile, PlainObject/.test(uploadType)) {
  errors.push('upload: public UploadFile must derive from the common submodule type');
}
const filecardType = readFileSync(resolve(chatRoot, 'filecard/type.ts'), 'utf8');
if (!/from '@common\/js\/upload\/types'/.test(filecardType)) {
  errors.push('filecard: TdAttachmentItem must derive from the common submodule UploadFile type');
}

const messageType = readFileSync(resolve(chatRoot, 'chat-message/type.ts'), 'utf8');
if (!/Array<TdChatActionsName \| TdChatMessageAction>/.test(messageType)) {
  errors.push('chat-message: actions must only accept preset TdChatActionsName strings or custom items');
}
if (!/handleActions\?: TdChatMessageActionHandlers/.test(messageType)) {
  errors.push('chat-message: handleActions must use the action-specific handler map');
}

for (const panel of ['RangePanel.tsx', 'SinglePanel.tsx']) {
  const panelSource = readFileSync(resolve(repoRoot, 'packages/components/date-picker/panel', panel), 'utf8');
  if (/export type \{ DatePickerTableCell \}/.test(panelSource)) {
    errors.push(`date-picker/${panel}: internal DatePickerTableCell must not be re-exported`);
  }
}

if (errors.length) {
  throw new Error(`Chat contract check failed:\n- ${errors.join('\n- ')}`);
}

console.log(
  `[check:chat-contracts] ${contracts.length} primary and ${contentContracts.length} content component contracts aligned`,
);
