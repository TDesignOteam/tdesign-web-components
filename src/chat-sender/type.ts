import { TdAttachmentsProps } from '../attachments';
import { TNode } from '../common';
import { TdAttachmentItem } from '../filecard';
import { TdTextareaProps } from '../textarea';

export type TdChatSenderActionName = 'uploadImage' | 'uploadAttachment' | 'attachment' | 'send';

export type UploadActionType = 'uploadImage' | 'uploadAttachment';

export interface TdChatSenderUploadProps {
  /** 接受的文件类型，如 'image/*' 或 '.jpg,.png' */
  accept?: string;
  /** 是否允许多选 */
  multiple?: boolean;
}

export interface TdChatSenderParams {
  /** 输入内容 */
  value: string;
  /** 附件列表 */
  attachments?: TdAttachmentItem[];
}

export interface TdChatSenderProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
  /**
   * 操作按钮配置
   * - TdChatSenderActionName[]: 仅支持预设按钮名称数组，如 ['send']、['uploadImage', 'send']
   * - Function: (preset: Array<{ name: string; render: TNode }>) => Array<{ name: string; render: TNode }>，接收全部预设按钮后返回最终渲染项
   * - TNode: 完全自定义操作区内容
   * - boolean: true 等价于默认值 ['send']，false 表示不显示操作区
   * 预设按钮名称包括：uploadImage、uploadAttachment、attachment（uploadAttachment 的兼容别名，后续将废弃）、send
   * @default ['send']
   */
  actions?:
    | TdChatSenderActionName[]
    | ((preset: Array<{ name: string; render: TNode }>) => Array<{ name: string; render: TNode }>)
    | TNode
    | boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 透传attachment参数 */
  attachmentsProps?: TdAttachmentsProps;
  /**
   * 高度自动撑开，支持传入 true 或配置项 { minRows, maxRows }
   * - true: 启用自动撑高
   * - object: 配置最小/最大行数
   * @default { minRows: 2 }
   */
  autosize?: TdTextareaProps['autosize'];
  /** 透传textarea参数 */
  textareaProps?: Partial<Omit<TdTextareaProps, 'value' | 'defaultValue' | 'placeholder' | 'disabled' | 'autosize'>>;
  /**
   * 文件上传配置，仅作用于上传附件按钮和 selectFile
   * @deprecated 请使用 fileUploadProps 替代，优先级低于 fileUploadProps
   */
  uploadProps?: TdChatSenderUploadProps;
  /** 图片上传配置，仅作用于上传图片按钮和 selectImage，默认 accept: 'image/*' */
  imageUploadProps?: TdChatSenderUploadProps;
  /** 文件上传配置，仅作用于上传附件按钮和 selectFile，优先级高于 uploadProps */
  fileUploadProps?: TdChatSenderUploadProps;
  /**
   * 禁用发送按钮，支持布尔值或函数形式；输入为空时始终禁用
   * @default false
   */
  sendBtnDisabled?: boolean | ((inputValue: string) => boolean);
  /** 发送消息事件，参数包含 value（输入内容）、attachments（附件列表） */
  onSend?: (e: CustomEvent<TdChatSenderParams>) => void;
  /** 停止发送事件 */
  onStop?: (e: CustomEvent<string>) => void;
  /** 输入内容变化事件 */
  onChange?: (e: CustomEvent<string>) => void;
  /** 输入框聚焦事件 */
  onFocus?: (e: CustomEvent<string>) => void;
  /** 输入框失焦事件 */
  onBlur?: (e: CustomEvent<string>) => void;
  /** 文件选择事件 */
  onFileSelect?: (e: CustomEvent<TdAttachmentItem[]>) => void;
  /** 文件移除事件，参数为剩余的文件列表 */
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
