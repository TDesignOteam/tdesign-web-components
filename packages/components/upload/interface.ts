import { VNode } from 'omi';

import { TdUploadProps, UploadFile, UploadInstanceFunctions, UploadRemoveContext } from './type';

/** @deprecated 请从组件入口导入 UploadProps；此转发仅保留 interface.ts 深层导入兼容性。 */
export type { UploadProps } from './type';

export interface CommonDisplayFileProps {
  accept: string;
  files: TdUploadProps['files'];
  toUploadFiles: TdUploadProps['files'];
  displayFiles: TdUploadProps['files'];
  theme: TdUploadProps['theme'];
  abridgeName: TdUploadProps['abridgeName'];
  placeholder: TdUploadProps['placeholder'];
  classPrefix: string;
  tips?: TdUploadProps['tips'];
  // locale?: GlobalConfigProvider['upload'];
  sizeOverLimitMessage?: string;
  autoUpload?: boolean;
  disabled?: boolean;
  uploading?: boolean;
  tipsClasses?: string;
  errorClasses?: string[];
  placeholderClass?: string;
  showUploadProgress?: boolean;
  children?: VNode;
  fileListDisplay?: VNode<{ files: UploadFile[] }>;
  // imageViewerProps?: Record<string, any>;
  onRemove?: (p: UploadRemoveContext) => void;
}

export interface UploadRef extends UploadInstanceFunctions {
  upload: HTMLInputElement;
  uploading: boolean;
  cancelUpload: (context?: { file?: UploadFile; e?: MouseEvent }) => void;
}
