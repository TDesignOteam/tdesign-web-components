import { UploadFile } from '../_common/js/upload/types';

export interface Attachment extends UploadFile {
  uid?: string;
  xhr?: XMLHttpRequest;
  description?: string;
}
export interface TdFileCardProps {
  item: Attachment;
  onRemove?: (event: CustomEvent<Attachment>) => void;
  disabled?: boolean;
  class?: string;
}
