import { StyledProps } from '@tdesign/web-components-shared/common';

import { TdAttachmentItem } from '../filecard';

export interface TdAttachmentsProps extends StyledProps {
  /** 附件列表 */
  items: TdAttachmentItem[];
  /**
   * 超出容器时的布局方式
   * @default wrap
   */
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
  /** 移除附件时触发 */
  onRemove?: (event: CustomEvent<TdAttachmentItem>) => void;
  /** 点击附件时触发 */
  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;
  /**
   * 是否启用图片预览
   * @default true
   */
  imageViewer?: boolean;
  /**
   * 是否显示删除按钮
   * @default true
   */
  removable?: boolean;
}
