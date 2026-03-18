import { TdAttachmentsProps } from '../attachments';
import { TNode } from '../common';
import { TdAttachmentItem } from '../filecard';
import { TdTextareaProps } from '../textarea';

export type TdChatSenderActionName = 'uploadImage' | 'uploadAttachment' | 'send';

export type UploadActionType = 'uploadImage' | 'uploadAttachment';

export interface TdChatSenderAction {
  /** 按钮唯一标识 */
  name: string;
  /** 渲染内容 */
  render: TNode;
}

export interface TdChatSenderParams {
  value: string;
  attachments?: TdAttachmentItem[];
}

export interface TdChatSenderContext {
  e?: Event | MouseEvent | KeyboardEvent | FocusEvent;
}

export interface TdChatSenderUploadProps {
  /** 接受的文件类型，如 'image/*' 或 '.jpg,.png' */
  accept?: string;
  /** 是否允许多选 */
  multiple?: boolean;
}

export interface TdChatSenderProps extends Pick<TdTextareaProps, 'autosize'> {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
  /**
   * 操作按钮配置
   * - TdChatSenderActionName[]: 预设按钮名称数组，如 ['uploadImage', 'send']
   * - TdChatSenderAction[]: 完整对象数组，自定义渲染
   * - Function: (preset: TdChatSenderAction[]) => TdChatSenderAction[]，基于预设修改
   * - TNode: 自定义渲染内容
   * - boolean: true 显示默认按钮，false 不显示
   * @default ['send']
   */
  actions?:
    | TdChatSenderActionName[]
    | TdChatSenderAction[]
    | ((preset: TdChatSenderAction[]) => TdChatSenderAction[])
    | TNode
    | boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 透传attachment参数 */
  attachmentsProps?: TdAttachmentsProps;
  /** 透传textarea参数 */
  textareaProps?: Partial<Omit<TdTextareaProps, 'value' | 'defaultValue' | 'placeholder' | 'disabled' | 'autosize'>>;
  /**
   * 透传上传输入框的HTML属性
   * @deprecated 请使用 imageUploadProps 和 fileUploadProps 替代，优先级低于 imageUploadProps 和 fileUploadProps
   */
  uploadProps?: TdChatSenderUploadProps;
  /** 图片上传配置，优先级高于 uploadProps */
  imageUploadProps?: TdChatSenderUploadProps;
  /** 文件上传配置，优先级高于 uploadProps */
  fileUploadProps?: TdChatSenderUploadProps;
  /**
   * 禁用发送按钮，支持布尔值或函数形式
   * @default false
   */
  sendBtnDisabled?: boolean | ((inputValue: string) => boolean);
  onSend?: (e: CustomEvent<{ value: string; attachments?: TdAttachmentItem[]; e: MouseEvent | KeyboardEvent }>) => void;
  onStop?: (e: CustomEvent<{ value: string; e: MouseEvent }>) => void;
  onChange?: (e: CustomEvent<{ value: string; e: Event }>) => void;
  onFocus?: (e: CustomEvent<{ value: string; e: FocusEvent }>) => void;
  onBlur?: (e: CustomEvent<{ value: string; e: FocusEvent }>) => void;
  onFileSelect?: (e: CustomEvent<{ files: FileList; name: UploadActionType }>) => void;
  onFileRemove?: (e: CustomEvent<TdAttachmentItem[]>) => void;
}

export interface TdChatSenderApi {
  /** 获取焦点 */
  focus: (opts?: FocusOptions) => void;
  /** 取消焦点 */
  blur: () => void;
  /** 触发图片选择 */
  selectImage: () => void;
  /** 触发文件选择 */
  selectFile: () => void;
}
