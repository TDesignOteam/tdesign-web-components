import { UploadFile } from '../_common/js/upload/types';

export interface Attachment extends UploadFile {
  uid?: string;
  xhr?: XMLHttpRequest;
  description?: string;
}
export interface TdAttachmentsProps {
  items: Attachment[];
  class?: string;
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
  onRemove?: (event: CustomEvent<Attachment>) => void;
}
