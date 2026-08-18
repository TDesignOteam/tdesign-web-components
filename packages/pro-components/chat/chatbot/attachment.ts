import type { AttachmentItem, AttachmentType } from '../chat-engine';
import type { TdAttachmentItem } from '../filecard';

export type TdChatMessageAttachment = AttachmentItem &
  Pick<TdAttachmentItem, 'key' | 'status' | 'type' | 'description' | 'percent'>;

const attachmentTypeByMime = (mimeType?: string): AttachmentType | undefined => {
  const category = mimeType?.split('/')[0];
  if (category === 'image' || category === 'video' || category === 'audio') return category;
  if (mimeType === 'application/pdf') return 'pdf';
  return undefined;
};

const attachmentTypeByExtension = (extension?: string): AttachmentType => {
  const normalized = extension?.replace(/^\./, '').toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(normalized)) return 'image';
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(normalized)) return 'video';
  if (['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'].includes(normalized)) return 'audio';
  if (normalized === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(normalized)) return 'doc';
  if (['ppt', 'pptx'].includes(normalized)) return 'ppt';
  return 'txt';
};

const getExtension = (attachment: TdAttachmentItem) =>
  attachment.extension || attachment.name?.match(/\.([^.]+)$/)?.[1];

/**
 * 创建由 ChatEngine 自己持有的消息附件快照。
 * 上传过程对象（raw、response 等）只属于发送方，不能进入 Immer 消息状态。
 */
export const createChatMessageAttachment = (attachment: TdAttachmentItem): TdChatMessageAttachment => {
  const extension = getExtension(attachment);

  return {
    key: attachment.key,
    fileType: attachment.fileType || attachmentTypeByMime(attachment.type) || attachmentTypeByExtension(extension),
    name: attachment.name,
    size: attachment.size,
    url: attachment.url,
    extension,
    status: attachment.status,
    type: attachment.type,
    description: attachment.description,
    percent: attachment.percent,
  };
};

export const createChatMessageAttachments = (attachments?: TdAttachmentItem[]) =>
  attachments?.map(createChatMessageAttachment);
