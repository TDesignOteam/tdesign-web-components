import { StyledProps } from '@tdesign/web-components-shared/common';

import { TdAttachmentItem } from '../filecard';

export interface TdAttachmentsProps extends StyledProps {
  items: TdAttachmentItem[];
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
  onRemove?: (event: CustomEvent<TdAttachmentItem>) => void;
  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;
  imageViewer?: boolean;
  removable?: boolean;
}
