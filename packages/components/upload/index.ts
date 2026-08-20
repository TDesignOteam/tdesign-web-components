import './style/index.js';

import type {
  SizeUnit,
  SizeUnitArray,
  SuccessContext,
  TdUploadProps,
  UploadChangeContext,
  UploadChangeTrigger,
  UploadFailContext,
  UploadFile,
  UploadInstanceFunctions,
  UploadProps,
  UploadRemoveContext,
  UploadSelectChangeContext,
  UploadValidateType,
} from './type';
import _Upload from './upload';

export type {
  SizeUnit,
  SizeUnitArray,
  SuccessContext,
  TdUploadProps,
  UploadChangeContext,
  UploadChangeTrigger,
  UploadFailContext,
  UploadFile,
  UploadInstanceFunctions,
  UploadProps,
  UploadRemoveContext,
  UploadSelectChangeContext,
  UploadValidateType,
};
export const Upload = _Upload;
export default Upload;
