import MarkdownIt from 'markdown-it';

import { TDChatInputProps } from '../chat-sender';
import type { StyledProps, TNode } from '../common';
import type { ChatServiceConfigSetter, ChatStatus, ContentType, MessageRole, RequestParams } from './core/type';
import type { ChatMessageType } from './core/type';

export type TDChatItemActionName =
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
export interface TDChatItemAction {
  name: TDChatItemActionName;
  render: TNode;
  // 满足条件才展示
  condition?: (message: ChatMessageType) => boolean;
}

export interface TDChatRenderConfig {
  /** slot命名规则 */
  slotName?: string;
}

export type TDChatCustomRenderConfig = Record<string, (props: any) => TDChatRenderConfig | undefined | null>;

export type TDChatContentProps = {
  [key in ContentType]?: key extends 'markdown'
    ? Omit<TDChatMarkdownContentProps, 'content' | 'role'>
    : key extends 'search'
    ? TDChatContentSearchProps
    : key extends 'thinking'
    ? TDChatContentThinkProps
    : key extends 'suggestion'
    ? TDChatContentSuggestionProps
    : any;
};
export interface TDChatItemProps {
  /**
   * 操作
   */
  actions?:
    | TDChatItemAction[]
    | ((preset: TDChatItemAction[], message: ChatMessageType) => TDChatItemAction[])
    | boolean;
  animation?: 'skeleton' | 'moving' | 'gradient' | 'circle';
  onActions?: Partial<Record<TDChatItemActionName, (data?: any, innerFunc?: Function) => void>>;
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
  message: ChatMessageType;
  /** 透传chat-content参数 */
  chatContentProps?: TDChatContentProps;
  /** 自定义消息体渲染配置 */
  customRenderConfig?: TDChatCustomRenderConfig;
}

export interface TDChatProps extends StyledProps {
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
  listProps?: TDChatListProps;
  /** 消息数据源 */
  autoSendPrompt?: string;
  messages: Array<ChatMessageType>;
  /** 角色消息配置 */
  messageProps?: TDChatMessageConfig;
  /** 输入框配置（透传至t-chat-input） */
  senderProps?: TDChatInputProps;
  /** 模型服务配置 */
  chatServiceConfig?: ChatServiceConfigSetter;
  // onMessagesChange?: (messages: ChatMessageType[]) => void;
}

export interface TDChatbotApi {
  /**
   * 发送用户消息
   * @param params - 请求参数
   */
  sendUserMessage: (params: RequestParams) => Promise<void>;

  /**
   * 发送系统消息
   * @param msg - 系统消息内容
   */
  sendSystemMessage: (msg: string) => void;

  /**
   * 中止当前聊天
   */
  abortChat: () => Promise<void>;

  /**
   * 添加提示信息到输入框
   * @param prompt - 提示文本
   */
  addPrompt: (prompt: string) => void;

  /**
   * 滚动到消息列表底部
   */
  scrollToBottom: () => void;

  /**
   * 获取当前消息列表
   */
  readonly chatMessageValue: ChatMessageType[];

  /**
   * 当前聊天状态
   */
  readonly chatStatus: ChatStatus;
}

export type TDChatMessageConfig = {
  [key in ModelRoleEnum]?: Omit<TDChatItemProps, 'message'>;
};

export interface TDChatListProps {
  /** 自动滚动底部 */
  autoScroll?: boolean;
  onScroll?: (e: Event) => void;
}

/** markdown插件预设 */
export type TDChatContentMDPresetPlugin = 'code' | 'link' | 'katex';

export interface TDChatContentMDPresetConfig {
  preset: TDChatContentMDPresetPlugin;
  /** 是否开启 */
  enabled?: boolean;
  /** 插件参数 */
  options?: any;
}

export type TDChatContentMDPluginConfig =
  /** 预设插件配置 */
  | TDChatContentMDPresetConfig
  /** markdownIt原生插件配置 */
  | MarkdownIt.PluginSimple
  | MarkdownIt.PluginWithParams
  | MarkdownIt.PluginWithOptions;

type TDChatContentSearchProps = {
  expandable?: boolean;
};

type TDChatContentThinkProps = {
  maxHeight?: number;
};

type TDChatContentSuggestionProps = {
  directSend?: boolean;
};

export interface TDChatMarkdownContentProps {
  content?: string;
  role?: string;
  options?: MarkdownIt.Options;
  pluginConfig?: Array<TDChatContentMDPluginConfig>;
}

export interface TDChatCodeProps {
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
export interface TDChatItemMeta {
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
