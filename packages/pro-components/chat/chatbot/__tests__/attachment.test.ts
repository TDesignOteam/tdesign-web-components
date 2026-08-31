import { expect, test } from 'vitest';

import type { AttachmentItem } from '../../chat-engine';
import type { TdAttachmentItem } from '../../filecard';
import { createChatMessageAttachments, createChatRequestParams } from '../attachment';

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

  expect(Object.is(messageAttachment, source)).toBe(false);
  expect(messageAttachment).toEqual({
    key: undefined,
    fileType: 'pdf',
    name: 'report.pdf',
    size: 1024,
    url: 'https://example.com/report.pdf',
    isReference: undefined,
    width: undefined,
    height: undefined,
    extension: 'pdf',
    metadata: undefined,
    status: 'success',
    type: 'application/pdf',
    description: '1KB',
    percent: undefined,
  });
  expect('raw' in messageAttachment).toBe(false);
  expect('response' in messageAttachment).toBe(false);
});

test('creates a new snapshot on every send and infers common attachment types', () => {
  const source: TdAttachmentItem = {
    name: 'recording.mp3',
    size: 2048,
  };

  const first = createChatMessageAttachments([source]);
  const second = createChatMessageAttachments([source]);

  expect(first).not.toBe(second);
  expect(first?.[0]).not.toBe(second?.[0]);
  expect(first?.[0].fileType).toBe('audio');
  expect(first?.[0].extension).toBe('mp3');
});

test('isolates public request attachments and preserves chat protocol fields', () => {
  const metadata = { source: 'knowledge-base' };
  const source: AttachmentItem<typeof metadata> = {
    fileType: 'image',
    name: 'diagram.png',
    url: 'https://example.com/diagram.png',
    isReference: true,
    width: 640,
    height: 480,
    extension: 'png',
    metadata,
  };

  const request = { prompt: 'summarize', attachments: [source] };
  const ownedRequest = createChatRequestParams(request);

  expect(ownedRequest).not.toBe(request);
  expect(ownedRequest.attachments).not.toBe(request.attachments);
  expect(ownedRequest.attachments?.[0]).not.toBe(source);
  expect(ownedRequest.attachments?.[0]).toEqual(source);
});
