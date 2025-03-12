import { Attachment } from '../filecard';

export interface TdAttachmentsProps {
  items: Attachment[];
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
  onRemove?: (event: CustomEvent<Attachment>) => void;
}
