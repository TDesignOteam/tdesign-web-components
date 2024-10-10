import { FormatResponseContext, ResponseType, SizeLimitObj } from '../_common/js/upload/types';
import { ButtonProps } from '../button';
import { PlainObject, StyledProps, TNode } from '../common';

export interface UploadProps extends TdUploadProps, StyledProps {}

export interface TdUploadProps<T extends UploadFile = UploadFile> {
  /**
   * 文件名过长时，需要省略中间的文本，保留首尾文本。示例：[10, 7]，表示首尾分别保留的文本长度
   */
  abridgeName?: Array<number>;
  /**
   * 接受上传的文件类型，[查看 W3C示例](https://www.w3schools.com/tags/att_input_accept.asp)，[查看 MDN 示例](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/file)
   * @default ''
   */
  accept?: string;
  /**
   * 上传接口。设接口响应数据为字段 `response`，那么 `response.error` 存在时会判断此次上传失败，并显示错误文本信息；`response.url` 会作为文件上传成功后的地址，并使用该地址显示图片或文件
   * @default ''
   */
  action?: string;
  /**
   * 是否在选择文件后自动发起请求上传文件
   * @default true
   */
  autoUpload?: boolean;
  /**
   * 如果是自动上传模式 `autoUpload=true`，表示单个文件上传之前的钩子函数，若函数返回值为 `false` 则表示不上传当前文件。<br/>如果是非自动上传模式 `autoUpload=false`，函数返回值为 `false` 时表示从上传文件中剔除当前文件
   */
  beforeUpload?: (file: UploadFile) => boolean | Promise<boolean>;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 已上传文件列表，同 `value`。TS 类型：`UploadFile`
   * @default []
   */
  files?: Array<T>;
  /**
   * 占位符
   * @default ''
   */
  placeholder?: string;
  /**
   * 用于格式化文件上传后的接口响应数据，`response` 便是接口响应的原始数据。`action` 存在时有效。<br/> 示例返回值：`{ error, url, status, files }` <br/> 此函数的返回值 `error` 会作为错误文本提醒，表示上传失败的原因，如果存在会判定为本次上传失败。<br/> 此函数的返回值 `url` 会作为单个文件上传成功后的链接。<br/> `files` 表示一个请求同时上传多个文件后的文件列表
   */
  formatResponse?: (response: any, context: FormatResponseContext) => ResponseType;
  /**
   * 图片文件大小限制，默认单位 KB。可选单位有：`'B' | 'KB' | 'MB' | 'GB'`。示例一：`1000`。示例二：`{ size: 2, unit: 'MB', message: '图片大小不超过 {sizeLimit} MB' }`
   */
  sizeLimit?: number | SizeLimitObj;
  /**
   * 是否显示上传进度
   * @default true
   */
  showUploadProgress?: boolean;
  /**
   * 是否显示图片的文件名称
   * @default true
   */
  showImageFileName?: boolean;
  /**
   * 透传选择按钮全部属性
   */
  triggerButtonProps?: ButtonProps;
  /**
   * 组件风格。custom 表示完全自定义风格；file 表示默认文件上传风格；file-input 表示输入框形式的文件上传；file-flow 表示文件批量上传；image 表示默认图片上传风格；image-flow 表示图片批量上传
   * @default file
   */
  theme?: 'custom' | 'file' | 'file-input' | 'file-flow' | 'image' | 'image-flow';
  /**
   * 组件下方文本提示，可以使用 `status` 定义文本
   */
  tips?: string; // TODO
  /**
   * 用于完全自定义文件列表界面内容(UI)，单文件和多文件均有效
   */
  fileListDisplay?: TNode<{ files: UploadFile[] }>;
  /**
   * 已上传文件列表发生变化时触发，`trigger` 表示触发本次的来源
   */
  onChange?: (value: Array<T>, context: UploadChangeContext) => void;
  /**
   * 上传失败后触发。`response` 指接口响应结果，`response.error` 会作为错误文本提醒。如果希望判定为上传失败，但接口响应数据不包含 `error` 字段，可以使用 `formatResponse` 格式化 `response` 数据结构。如果是多文件多请求上传场景，请到事件 `onOneFileFail` 中查看 `response`
   */
  onFail?: (options: UploadFailContext) => void;
  /**
   * 点击图片预览时触发，文件没有预览
   */
  onPreview?: (options: { file: UploadFile; index: number; e: MouseEvent }) => void;
  /**
   * 选择文件或图片之后，上传之前，触发该事件
   */
  onSelectChange?: (files: File[], context: UploadSelectChangeContext) => void;
  /**
   * 上传成功后触发。<br/>`context.currentFiles` 表示当次请求上传的文件（无论成功或失败），`context.fileList` 表示上传成功后的文件，`context.response` 表示上传请求的返回数据。<br/>`context.results` 表示单次选择全部文件上传成功后的响应结果，可以在这个字段存在时提醒用户上传成功或失败。<br />
   */
  onSuccess?: (context: SuccessContext) => void;
  /**
   * 文件上传校验结束事件，文件数量超出、文件大小超出限制、文件同名、`beforeAllFilesUpload` 返回值为假、`beforeUpload` 返回值为假等场景会触发。<br/>注意：如果设置允许上传同名文件，即 `allowUploadDuplicateFile=true`，则不会因为文件重名触发该事件。<br/>结合 `status` 和 `tips` 可以在组件中呈现不同类型的错误（或告警）提示
   */
  onValidate?: (context: { type: UploadValidateType; files: UploadFile[] }) => void;
}

export interface SuccessContext {
  e?: ProgressEvent;
  file?: UploadFile;
  fileList?: UploadFile[];
  currentFiles?: UploadFile[];
  response?: any;
  results?: SuccessContext[];
  XMLHttpRequest?: XMLHttpRequest;
}

/** 组件实例方法 */
export interface UploadInstanceFunctions {
  /**
   * 组件实例方法，打开文件选择器
   */
  triggerUpload: () => void;
  /**
   * 设置上传中文件的上传进度
   */
  uploadFilePercent: (params: { file: UploadFile; percent: number }) => void;
  /**
   * 组件实例方法，默认上传未成功上传过的所有文件。带参数时，表示上传指定文件
   */
  uploadFiles: (files?: UploadFile[]) => void;
}

export interface UploadFile extends PlainObject {
  /**
   * 上一次变更的时间
   */
  lastModified?: number;
  /**
   * 文件名称
   * @default ''
   */
  name?: string;
  /**
   * 下载进度
   */
  percent?: number;
  /**
   * 原始文件对象
   */
  raw?: File;
  /**
   * 上传接口返回的数据。`response.error` 存在时会判断此次上传失败，并显示错误文本信息；`response.url` 会作为文件上传成功后的地址，并使用该地址显示图片
   */
  response?: { [key: string]: any };
  /**
   * 文件大小
   */
  size?: number;
  /**
   * 文件上传状态：上传成功，上传失败，上传中，等待上传
   * @default ''
   */
  status?: 'success' | 'fail' | 'progress' | 'waiting';
  /**
   * 文件类型
   * @default ''
   */
  type?: string;
  /**
   * 上传时间
   * @default ''
   */
  uploadTime?: string;
  /**
   * 文件上传成功后的下载/访问地址
   * @default ''
   */
  url?: string;
}

export interface UploadSelectChangeContext {
  currentSelectedFiles: UploadFile[];
}

export interface UploadChangeContext {
  e?: MouseEvent | ProgressEvent;
  response?: any;
  trigger: UploadChangeTrigger;
  index?: number;
  file?: UploadFile;
  files?: UploadFile[];
}

export type UploadChangeTrigger =
  | 'add'
  | 'remove'
  | 'abort'
  | 'progress-success'
  | 'progress'
  | 'progress-fail'
  | 'default';

export type SizeUnitArray = ['B', 'KB', 'MB', 'GB'];

export type SizeUnit = SizeUnitArray[number];

export interface UploadFailContext {
  e?: ProgressEvent;
  failedFiles: UploadFile[];
  currentFiles: UploadFile[];
  response?: any;
  file: UploadFile;
  XMLHttpRequest?: XMLHttpRequest;
}

export type UploadValidateType =
  | 'FILE_OVER_SIZE_LIMIT'
  | 'FILES_OVER_LENGTH_LIMIT'
  | 'FILTER_FILE_SAME_NAME'
  | 'BEFORE_ALL_FILES_UPLOAD'
  | 'CUSTOM_BEFORE_UPLOAD';

export interface UploadRemoveContext {
  index?: number;
  file?: UploadFile;
  e: MouseEvent;
}
