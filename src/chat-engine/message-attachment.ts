import type { AttachmentItem } from './type';

type RequestAttachment = AttachmentItem & {
  raw?: unknown;
  response?: unknown;
  [key: PropertyKey]: unknown;
};

const uploadOnlyKeys = new Set<PropertyKey>(['raw', 'response']);

const createMessageAttachment = (attachment: RequestAttachment): AttachmentItem => {
  const snapshot = {};

  Reflect.ownKeys(attachment).forEach((key) => {
    if (uploadOnlyKeys.has(key)) return;
    const descriptor = Object.getOwnPropertyDescriptor(attachment, key);
    if (!descriptor || !('value' in descriptor)) return;
    Object.defineProperty(snapshot, key, descriptor);
  });

  return snapshot as AttachmentItem;
};

export const createMessageAttachments = (attachments?: AttachmentItem[]) =>
  attachments?.map((attachment) => createMessageAttachment(attachment as RequestAttachment));
