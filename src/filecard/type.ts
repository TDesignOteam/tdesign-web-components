import { type UploadFile } from '../_common/js/upload/types';
import { StyledProps } from '../common';

export interface TdAttachmentItem extends UploadFile {
  key?: string;
  description?: string;
  extension?: string;
}

export interface TdFileCardProps extends StyledProps {
  item: TdAttachmentItem;
  removable?: boolean;
  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;
  onRemove?: (event: CustomEvent<TdAttachmentItem>) => void;
  disabled?: boolean;
  imageViewer?: boolean;
  cardType?: 'file' | 'image';
}
