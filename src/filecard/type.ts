import { type UploadFile } from '../_common/js/upload/types';

export interface Attachment extends UploadFile {
  description?: string;
}

export interface TdFileCardProps {
  item: Attachment;
  onRemove?: (event: CustomEvent<Attachment>) => void;
  disabled?: boolean;
  class?: string;
}
