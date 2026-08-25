import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const globalVariableFiles = [
  '../chatbot/style/_var.less',
  '../chat-sender/style/_var.less',
  '../chat-action/style/_var.less',
  '../chat-message/style/_var.less',
  '../attachments/style/_var.less',
  '../chat-loading/style/_var.less',
];

const componentStyleEntries = [
  '../chatbot/style/index.js',
  '../chat-sender/style/index.js',
  '../chat-action/style/index.js',
  '../chat-message/style/index.js',
  '../attachments/style/index.js',
  '../chat-loading/style/index.js',
  '../filecard/style/index.js',
];

describe('global Chat variables', () => {
  test.each(globalVariableFiles)('%s declares defaults on the document root', (relativePath) => {
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');

    expect(source).toMatch(/:root\s*\{/);
    expect(source).not.toMatch(/:host\s*\{/);
  });

  test('the shared variable entry combines every distinct Chat variable group', () => {
    const source = readFileSync(fileURLToPath(new URL('../style/variables.less', import.meta.url)), 'utf8');

    expect(source).toContain('@import "../chatbot/style/_var.less";');
    expect(source).toContain('@import "../chat-sender/style/_var.less";');
    expect(source).toContain('@import "../attachments/style/_var.less";');
    expect(source).toContain('@import "../chat-loading/style/_var.less";');
  });

  test.each(componentStyleEntries)('%s registers the shared variables for on-demand imports', (relativePath) => {
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');

    expect(source).toContain("import '../../style/variables.js';");
  });
});
