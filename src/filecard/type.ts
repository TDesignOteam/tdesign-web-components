import { type UploadFile } from '../_common/js/upload/types';

export interface TdAttachmentItem extends UploadFile {
  description?: string;
  extension?: string;
}

export interface TdFileCardProps {
  item: TdAttachmentItem;
  onRemove?: (event: CustomEvent<TdAttachmentItem>) => void;
  disabled?: boolean;
  imageViewer?: boolean;
}
