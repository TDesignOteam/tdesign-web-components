import { TdAttachmentItem } from '../filecard';

export interface TdAttachmentsProps {
  items: TdAttachmentItem[];
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
  onRemove?: (event: CustomEvent<TdAttachmentItem>) => void;
  imageViewer?: Boolean;
}
