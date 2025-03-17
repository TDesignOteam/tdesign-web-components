import MarkdownIt from 'markdown-it';

import type { TdAttachmentsProps } from '../attachments';
import type { StyledProps, TNode } from '../common';
import type { Attachment } from '../filecard';
import type { TdTextareaProps } from '../textarea';
import type { ChatStatus, MessageRole, MessageStatus, ModelServiceState } from './core/type';
import type { Message } from './core/type';

export interface TdChatItemAction {
  name: string;
  render: TNode;
  // 消息满足状态时才展示，默认消息完成时才展示
  status?: MessageStatus[];
}

export interface TdChatItemProps {
  /**
   * 操作
   */
  actions?: TdChatItemAction[] | ((preset: TdChatItemAction[]) => TdChatItemAction[]) | boolean;
  /**
   * 作者
   */
  name?: string | TNode;
  /**
   * 头像
   */
  avatar?: string | TNode;
  /**
   * 时间
   */
  datetime?: string | TNode;
  /**
   * 消息类型
   */
  role?: MessageRole;
  /**
   * 消息样式，是否有边框，背景色等
   */
  variant?: Variant;
  // 消息索引
  itemIndex?: Number;
  /** 气泡方向 */
  placement?: 'left' | 'right';
  /** 消息体 */
  message: Message;
  /** 透传chat-content参数 */
  chatContentProps?: Omit<TdChatContentProps, 'content' | 'role'>;
}

interface ChatProps {
  /**
   * 布局
   */
  layout?: Layout;
  /**
   * 倒序渲染
   */
  reverse?: boolean;
  /**
   * 数据
   */
  data?: Array<TdChatItemProps>;
  /**
   * 接口请求中
   */
  textLoading?: boolean;
  /** 清空历史按钮，值为 true 显示默认操作按钮，值为 false 不显示任何内容，值类型为 Function 表示自定义 */
  clearHistory?: boolean | TNode;
  /** 点赞差评复制重新生成按钮集合，值为true显示默认操作按钮 */
  actions?: boolean | TNode;
  // 流式数据加载中
  isStreamLoad?: boolean;
  modelConfig: ModelServiceState;
  attachmentProps?: {
    onFileSelected?: (files: File[]) => Promise<Attachment[]>;
    onFileRemove?: (file: Attachment) => void;
  };
  onClear?: (context: { e: MouseEvent }) => void;
}

export interface TdChatProps extends ChatProps, StyledProps {}

export interface TdChatListProps {
  /**
   * 数据
   */
  data?: Array<TdChatItemProps['message']>;
  /**
   * 流式消息加载中
   */
  textLoading?: boolean;
  /** 自动滚动底部 */
  autoScroll?: boolean;
  /** 滚动底部按钮 */
  scrollToBottom?: boolean;
  onScroll?: (e: Event) => void;
}

/** markdown插件预设 */
export type TdChatContentMDPresetPlugin = 'code' | 'link' | 'katex';

export interface TdChatContentMDPresetConfig {
  preset: TdChatContentMDPresetPlugin;
  /** 是否开启 */
  enabled?: boolean;
  /** 插件参数 */
  options?: any;
}

export type TdChatContentMDPluginConfig =
  /** 预设插件配置 */
  | TdChatContentMDPresetConfig
  /** markdownIt原生插件配置 */
  | MarkdownIt.PluginSimple
  | MarkdownIt.PluginWithParams
  | MarkdownIt.PluginWithOptions;

export interface TdChatContentMDProps {
  options?: MarkdownIt.Options;
  pluginConfig?: Array<TdChatContentMDPluginConfig>;
}

export interface TdChatContentProps {
  content?: string;
  role?: string;
  markdownProps?: TdChatContentMDProps;
}

export interface TdChatCodeProps {
  lang: string;
  code: string;
}

export interface TdChatInputAction {
  name: string;
  render: TNode;
  disabled?: boolean;
}

export interface TdChatInputSend {
  value: string;
  attachments?: Attachment[];
}

export interface TdChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  value: string | number;
  defaultValue: string | number;
  actions?: TdChatItemAction[] | ((preset: TdChatItemAction[]) => TdChatItemAction[]) | boolean;
  /** 附件项 */
  attachments?: Attachment[];
  /** 生成状态 */
  status?: ChatStatus;
  /** 生成时是否允许停止 */
  allowStop?: boolean;
  /** 透传attachment参数 */
  attachmentsProps?: Partial<Omit<TdAttachmentsProps, 'items' | 'onRemove'>>;
  /** 透传textarea参数 */
  textareaProps?: Partial<Omit<TdTextareaProps, 'value' | 'defaultValue' | 'placeholder' | 'disabled'>>;
  /** 透传input-file参数 */
  uploadProps?: Omit<JSX.HTMLAttributes, 'onChange' | 'ref' | 'type' | 'hidden'>;
  onSend?: (e: CustomEvent<TdChatInputSend>) => void;
  onStop?: (value: string, context: { e: MouseEvent }) => void;
  onChange?: (value: string, context: { e: InputEvent | MouseEvent | KeyboardEvent }) => void;
  onBlur?: (value: string, context: { e: FocusEvent }) => void;
  onFocus?: (value: string, context: { e: FocusEvent }) => void;
}
export interface MetaData {
  /**
   * 角色头像
   * @description 可选参数，如果不传则使用默认头像
   */
  avatar?: string;
  /**
   * 名称
   * @description 可选参数，如果不传则使用默认名称
   */
  name?: string;
  /**
   * 附加数据
   * @description 可选参数，如果不传则使用默认名称
   */
  [key: string]: any;
}
export interface TdChatItemMeta {
  avatar?: string;
  name?: string;
  role?: string;
  datetime?: string;
}
export type ModelRoleEnum = 'assistant' | 'user' | 'error' | 'model-change' | 'system';

export type Variant = 'base' | 'text' | 'outline';
export type Layout = 'single' | 'both';
export interface FetchSSEOptions {
  success?: (res: SSEEvent) => void; // 流式数据解析成功回调
  fail?: () => void; // 流式请求失败回调
  complete?: (isOk: Boolean, msg?: String, requestid?: String) => void; // 流式请求完成回调
}
export interface SSEEvent {
  type: string | null;
  data: string | null;
}
export interface BackBottomParams {
  behavior?: 'auto' | 'smooth';
}
