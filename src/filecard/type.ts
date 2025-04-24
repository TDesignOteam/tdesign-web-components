import { type UploadFile } from '../_common/js/upload/types';

export interface TdAttachmentItemProps extends UploadFile {
  description?: string;
  extension?: string;
}

export interface TdFileCardProps {
  item: TdAttachmentItemProps;
  onRemove?: (event: CustomEvent<TdAttachmentItemProps>) => void;
  disabled?: boolean;
}
