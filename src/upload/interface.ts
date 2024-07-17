import { SignalValue, VNode } from 'omi';

import { StyledProps } from '../common';
import { TdUploadProps, UploadFile, UploadInstanceFunctions, UploadRemoveContext } from './type';

export interface CommonDisplayFileProps {
  accept: string;
  files: SignalValue<TdUploadProps['files']>;
  toUploadFiles: SignalValue<TdUploadProps['files']>;
  displayFiles: SignalValue<TdUploadProps['files']>;
  theme: TdUploadProps['theme'];
  abridgeName: TdUploadProps['abridgeName'];
  placeholder: TdUploadProps['placeholder'];
  classPrefix: string;
  tips?: TdUploadProps['tips'];
  // locale?: GlobalConfigProvider['upload'];
  sizeOverLimitMessage?: SignalValue<string>;
  autoUpload?: boolean;
  disabled?: boolean;
  uploading?: SignalValue<boolean>;
  tipsClasses?: string;
  errorClasses?: string[];
  placeholderClass?: string;
  showUploadProgress?: boolean;
  children?: VNode;
  // fileListDisplay?: TdUploadProps['fileListDisplay'];
  // imageViewerProps?: Record<string, any>;
  onRemove?: (p: UploadRemoveContext) => void;
}

export interface UploadProps<T extends UploadFile = UploadFile> extends TdUploadProps<T>, StyledProps {}

export interface UploadRef extends UploadInstanceFunctions {
  upload: HTMLInputElement;
  uploading: boolean;
  cancelUpload: (context?: { file?: UploadFile; e?: MouseEvent }) => void;
}
