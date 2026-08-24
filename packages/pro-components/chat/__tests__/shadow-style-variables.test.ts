import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const componentVariableFiles = [
  '../chatbot/style/_var.less',
  '../chat-sender/style/_var.less',
  '../chat-action/style/_var.less',
  '../chat-message/style/_var.less',
];

describe('chat Shadow DOM variables', () => {
  test.each(componentVariableFiles)('%s declares component defaults on the host', (relativePath) => {
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');

    expect(source).toMatch(/:host\s*\{/);
    expect(source).not.toMatch(/:root\s*\{/);
  });

  test('chat sender includes its variables in its own Shadow DOM stylesheet', () => {
    const source = readFileSync(
      fileURLToPath(new URL('../chat-sender/style/chat-sender.less', import.meta.url)),
      'utf8',
    );

    expect(source).toMatch(/^@import\s+["']\.\/import\.less["'];/m);
  });
});
