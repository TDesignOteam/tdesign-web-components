import { TdAttachmentsProps } from '../attachments';
import { TNode } from '../common';
import { TdAttachmentItem } from '../filecard';
import { TdTextareaProps } from '../textarea';

export type TdChatSenderActionName = 'uploadImage' | 'uploadAttachment' | 'send';

export type UploadActionType = 'uploadImage' | 'uploadAttachment';

export interface TdChatSenderAction {
  name: string;
  render: TNode;
}

export interface TdChatSenderParams {
  value: string;
  attachments?: TdAttachmentItem[];
}

export interface TdChatSenderContext {
  e?: Event | MouseEvent | KeyboardEvent | FocusEvent;
}

export interface TdChatSenderProps extends Pick<TdTextareaProps, 'autosize'> {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
  /**
   * 操作按钮配置
   * - TdChatSenderActionName[]: 简单数组形式，如 ['uploadImage', 'uploadAttachment']
   * - TdChatSenderAction[]: 自定义操作按钮列表（完整对象）
   * - Function: (preset: TdChatSenderAction[]) => TdChatSenderAction[]
   * - boolean: `true` 显示默认操作按钮，`false` 不显示操作按钮
   * @default false
   */
  actions?:
    | TdChatSenderActionName[]
    | TdChatSenderAction[]
    | ((preset: TdChatSenderAction[]) => TdChatSenderAction[])
    | boolean;
  /**
   * 右侧区域内容，优先级高于 actions
   * - string: 文本内容
   * - TNode: 自定义渲染节点
   * - Slot: 使用 `slot="suffix"` 完全自定义 HTML 结构
   */
  suffix?: TNode;
  /** 是否加载中 */
  loading?: boolean;
  /** 透传attachment参数 */
  attachmentsProps?: TdAttachmentsProps;
  /** 透传textarea参数 */
  textareaProps?: Partial<Omit<TdTextareaProps, 'value' | 'defaultValue' | 'placeholder' | 'disabled' | 'autosize'>>;
  /** 透传上传输入框的HTML属性 */
  uploadProps?: Omit<JSX.HTMLAttributes, 'onChange' | 'ref' | 'type' | 'hidden'>;
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
}
