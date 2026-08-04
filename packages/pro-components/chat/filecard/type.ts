import type { UploadFile } from '@common/js/upload/types';
import { StyledProps } from '@tdesign/web-components-shared/common';

import { AttachmentType } from '../chat-engine';

export interface TdAttachmentItem extends UploadFile {
  /** 附件唯一标识 */
  key?: string;
  /** 聊天消息中的附件类型 */
  fileType?: AttachmentType;
  /** 文件描述 */
  description?: string;
  /** 文件扩展名 */
  extension?: string;
}

export interface TdFileCardProps extends StyledProps {
  /** 附件数据 */
  item: TdAttachmentItem;
  /**
   * 是否显示删除按钮
   * @default true
   */
  removable?: boolean;
  /** 点击附件时触发 */
  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;
  /** 移除附件时触发 */
  onRemove?: (event: CustomEvent<TdAttachmentItem>) => void;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否启用图片预览
   * @default true
   */
  imageViewer?: boolean;
  /**
   * 卡片展示类型
   * @default file
   */
  cardType?: 'file' | 'image';
}
