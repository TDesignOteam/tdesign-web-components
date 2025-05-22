import { StyledProps } from '../common';
import { TdAttachmentItem } from '../filecard';

export interface TdAttachmentsProps extends StyledProps {
  items: TdAttachmentItem[];
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
  onRemove?: (event: CustomEvent<TdAttachmentItem>) => void;
  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;
  imageViewer?: Boolean;
  removable?: Boolean;
}
