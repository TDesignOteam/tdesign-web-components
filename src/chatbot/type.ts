import MarkdownIt from 'markdown-it';

import { TdChatInputProps } from '../chat-input';
import type { StyledProps, TNode } from '../common';
import type { ChatServiceConfigSetter, ContentType, MessageRole } from './core/type';
import type { ChatMessage } from './core/type';

export type TdChatItemActionName =
  | 'copy'
  | 'good'
  | 'goodActived'
  | 'bad'
  | 'badActived'
  | 'replay'
  | 'share'
  | 'searchResult'
  | 'searchItem'
  | 'suggestion';
export interface TdChatItemAction {
  name: TdChatItemActionName;
  render: TNode;
  // 满足条件才展示
  condition?: (message: ChatMessage) => boolean;
}

export interface TdChatRenderConfig {
  /** slot命名规则 */
  slotName?: string;
}

export type TdChatCustomRenderConfig = Record<string, (props: any) => TdChatRenderConfig | undefined | null>;

export interface TdChatItemProps {
  /**
   * 操作
   */
  actions?: TdChatItemAction[] | ((preset: TdChatItemAction[], message: ChatMessage) => TdChatItemAction[]) | boolean;
  onActions?: Partial<Record<TdChatItemActionName, (data?: any, innerFunc?: Function) => void>>;
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
  /** 气泡方向 */
  placement?: 'left' | 'right';
  /** 消息体 */
  message: ChatMessage;
  /** 透传chat-content参数 */
  chatContentProps?: {
    [key in ContentType]?: key extends 'markdown'
      ? Omit<TdChatContentMDProps, 'content' | 'role'>
      : key extends 'search'
      ? TdChatContentSearchProps
      : key extends 'thinking'
      ? TdChatContentThinkProps
      : any;
  };
  /** 自定义消息体渲染配置 */
  customRenderConfig?: TdChatCustomRenderConfig;
}

export interface TdChatProps extends StyledProps {
  children?: TNode;
  injectCSS?: {
    chatInput?: string;
    chatList?: string;
    chatItem?: string;
  };
  /** 布局模式 */
  layout?: 'single' | 'both';
  /** 倒序渲染 */
  reverse?: boolean;
  /** 消息列表配置（透传至t-chat-list） */
  listProps?: TdChatListProps;
  /** 消息数据源 */
  autoSendPrompt?: string;
  messages: Array<ChatMessage>;
  /** 角色消息配置 */
  messageProps?: TdChatMessageConfig;
  /** 输入框配置（透传至t-chat-input） */
  senderProps?: TdChatInputProps;
  /** 模型服务配置 */
  chatServiceConfig?: ChatServiceConfigSetter;
  onMessagesChange?: (messages: ChatMessage[]) => void;
}

export type TdChatMessageConfig = {
  [key in ModelRoleEnum]?: Omit<TdChatItemProps, 'message'>;
};

export interface TdChatListProps {
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

export interface TdChatContentSearchProps {
  expandable?: boolean;
}

export interface TdChatContentThinkProps {
  height?: number;
}

export interface TdChatContentMDProps {
  content?: string;
  role?: string;
  options?: MarkdownIt.Options;
  pluginConfig?: Array<TdChatContentMDPluginConfig>;
}

export interface TdChatCodeProps {
  lang: string;
  code: string;
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
export type ModelRoleEnum = 'assistant' | 'user' | 'system';

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

export type * from './core/type';
