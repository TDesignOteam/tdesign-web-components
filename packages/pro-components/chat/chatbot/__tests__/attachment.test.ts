import assert from 'node:assert/strict';
import test from 'node:test';

import type { TdAttachmentItem } from '../../filecard';
import { createChatMessageAttachments } from '../attachment';

test('creates owned message DTOs without reading upload-only objects', () => {
  const source = {
    name: 'report.pdf',
    size: 1024,
    status: 'success',
    type: 'application/pdf',
    url: 'https://example.com/report.pdf',
    description: '1KB',
  } as TdAttachmentItem;

  Object.defineProperties(source, {
    raw: {
      enumerable: true,
      get: () => {
        throw new Error('raw must stay outside the message store');
      },
    },
    response: {
      enumerable: true,
      get: () => {
        throw new Error('response must stay outside the message store');
      },
    },
  });

  const [messageAttachment] = createChatMessageAttachments([source]);

  assert.notEqual(messageAttachment, source);
  assert.deepEqual(messageAttachment, {
    key: undefined,
    fileType: 'pdf',
    name: 'report.pdf',
    size: 1024,
    url: 'https://example.com/report.pdf',
    extension: 'pdf',
    status: 'success',
    type: 'application/pdf',
    description: '1KB',
    percent: undefined,
  });
  assert.equal('raw' in messageAttachment, false);
  assert.equal('response' in messageAttachment, false);
});

test('creates a new snapshot on every send and infers common attachment types', () => {
  const source: TdAttachmentItem = {
    name: 'recording.mp3',
    size: 2048,
  };

  const first = createChatMessageAttachments([source]);
  const second = createChatMessageAttachments([source]);

  assert.notEqual(first, second);
  assert.notEqual(first?.[0], second?.[0]);
  assert.equal(first?.[0].fileType, 'audio');
  assert.equal(first?.[0].extension, 'mp3');
});
