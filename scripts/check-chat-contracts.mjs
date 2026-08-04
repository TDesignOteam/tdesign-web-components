import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import ts from 'typescript';

const repoRoot = resolve(import.meta.dirname, '..');
const chatRoot = resolve(repoRoot, 'packages/pro-components/chat');

const contracts = [
  ['chatbot', 'TdChatProps', 'chat.tsx'],
  ['chat-message', 'TdChatMessageProps', 'chat-item.tsx'],
  ['chat-sender', 'TdChatSenderProps', 'chat-sender.tsx'],
  ['attachments', 'TdAttachmentsProps', 'attachments.tsx'],
  ['filecard', 'TdFileCardProps', 'filecard.tsx'],
  ['chat-action', 'ChatActionProps', 'action.tsx'],
  ['chat-loading', 'ChatLoadingProps', 'loading.tsx'],
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
  const declaration = source.statements.find(
    (node) => ts.isInterfaceDeclaration(node) && node.name.text === interfaceName,
  );
  if (!declaration) throw new Error(`Missing interface ${interfaceName}: ${typePath}`);

  return declaration.members
    .filter((member) => !ts.getJSDocTags(member).some((tag) => tag.tagName.text === 'internal'))
    .map(propertyName)
    .filter((name) => name && name !== 'children');
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

for (const [folder, interfaceName, componentFile] of contracts) {
  const typePath = resolve(chatRoot, folder, 'type.ts');
  const componentPath = resolve(chatRoot, folder, componentFile);
  const readmePath = resolve(chatRoot, folder, 'README.md');
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

if (errors.length) {
  throw new Error(`Chat contract check failed:\n- ${errors.join('\n- ')}`);
}

console.log(`[check:chat-contracts] ${contracts.length} component contracts aligned`);
