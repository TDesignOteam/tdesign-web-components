import assert from 'node:assert/strict';
import test from 'node:test';

import { createMessageAttachments } from '../message-attachment.ts';
import type { AttachmentItem } from '../type.ts';

test('creates message-owned attachments without reading upload-only fields', () => {
  const source = {
    fileType: 'txt',
    name: 'report.txt',
    customField: 'preserved',
  } as AttachmentItem & { customField: string };

  Object.defineProperties(source, {
    raw: {
      enumerable: true,
      get: () => {
        throw new Error('raw must not be read');
      },
    },
    response: {
      enumerable: true,
      get: () => {
        throw new Error('response must not be read');
      },
    },
  });

  const input = [source];
  const output = createMessageAttachments(input);
  const messageAttachment = output?.[0] as AttachmentItem & { customField: string };

  assert.notEqual(output, input);
  assert.notEqual(messageAttachment, source);
  assert.equal(messageAttachment.name, 'report.txt');
  assert.equal(messageAttachment.customField, 'preserved');
  assert.equal('raw' in messageAttachment, false);
  assert.equal('response' in messageAttachment, false);

  Object.freeze(messageAttachment);
  source.name = 'updated.txt';
  assert.equal(source.name, 'updated.txt');
  assert.equal(Object.isFrozen(source), false);
});

test('preserves undefined and empty attachment inputs', () => {
  assert.equal(createMessageAttachments(undefined), undefined);
  assert.deepEqual(createMessageAttachments([]), []);
});
