import { TdChatActionsName } from '../chat-action';
import { type TdChatLoadingProps } from '../chat-loading';
import { type TdChatMarkdownContentProps } from '../chat-message';
import { type TdChatSenderProps } from '../chat-sender';
import type { StyledProps, TNode } from '../common';
import type {
  AIMessageContent,
  ChatRequestParams,
  ChatServiceConfigSetter,
  ChatStatus,
  ContentType,
} from './core/type';
import type { ChatMessagesData } from './core/type';

export type TdChatItemActionName = TdChatActionsName | 'searchResult' | 'searchItem' | 'suggestion';
export interface TdChatItemAction {
  name: TdChatItemActionName;
  render: TNode;
}

export type TdChatContentProps = {
  markdown?: Omit<TdChatMarkdownContentProps, 'content' | 'role'>;
  search?: TdChatContentSearchProps;
  thinking?: TdChatContentThinkProps;
  suggestion?: TdChatContentSuggestionProps;
  [key: string]: any; // 处理其他ContentType情况
} & Partial<Record<Exclude<ContentType, 'markdown' | 'search' | 'thinking' | 'suggestion'>, any>>;

export interface TdChatItemProps {
  /**
   * 操作
   */
  actions?:
    | TdChatItemActionName[]
    // | ((preset: TdChatItemAction[], message: ChatMessagesData) => TdChatItemAction[])
    | boolean;
  animation?: 'skeleton' | 'moving' | 'gradient' | 'circle';
  handleActions?: Partial<Record<TdChatItemActionName, (data?: any) => void>>;
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
  // role?: ModelRoleEnum; // 统一用message里的role
  /**
   * 消息样式，是否有边框，背景色等
   */
  variant?: Variant;
  /** 气泡方向 */
  placement?: 'left' | 'right';
  /** 消息体 */
  message: ChatMessagesData;
  /** 透传chat-content参数 */
  chatContentProps?: TdChatContentProps;
}

export interface TdChatProps extends StyledProps {
  children?: TNode;
  injectCSS?: {
    ChatSender?: string;
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
  defaultMessages: Array<ChatMessagesData>;
  /** 角色消息配置 */
  messageProps?: TdChatMessageConfig | ((msg: ChatMessagesData) => TdChatMessageConfigItem);
  /** 输入框配置（透传至t-chat-sender） */
  senderProps?: TdChatSenderProps;
  /** 模型服务配置 */
  chatServiceConfig?: ChatServiceConfigSetter;
  /** 消息内容更新回调 */
  onMessageChange?: (e: CustomEvent<ChatMessagesData[]>) => void;
}

export interface TdChatbotApi {
  /**
   * 发送用户消息
   * @param params - 请求参数
   */
  sendUserMessage: (params: ChatRequestParams) => Promise<void>;

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
  readonly chatMessageValue: ChatMessagesData[];

  /**
   * 当前聊天状态
   */
  readonly chatStatus: ChatStatus;
  /**
   * 重新发送消息
   * * @param keepVersion - 是否保留之前版本（默认false)
   */
  regenerate: (keepVersion?: boolean) => Promise<void>;
  /**
   * 注册自定义消息内容合并策略
   */
  registerMergeStrategy: <T extends AIMessageContent>(
    type: T['type'], // 使用类型中定义的type字段作为参数类型
    handler: (chunk: T, existing?: T) => T,
  ) => void;
  /**
   * 触发选择文件
   */
  selectFile: () => void;
}

export type TdChatMessageConfigItem = Omit<TdChatItemProps, 'message'>;

export type TdChatMessageConfig = {
  [key in ModelRoleEnum]?: TdChatMessageConfigItem;
};

export type ScrollPosition = 'top' | 'bottom';

export interface TdChatListProps {
  children?: TNode;
  /** 自动滚动底部 */
  autoScroll?: boolean;
  /** 初始滚动条停留的位置 */
  defaultScrollPosition?: ScrollPosition;
  onScroll?: (e: Event) => void;
}

export interface TdChatListApi {
  /** 滚动到底部 */
  scrollToBottom: (opts?: ScrollOptions) => void;
}

type TdChatContentSearchProps = {
  useCollapse?: boolean;
  collapsed?: boolean;
};

type TdChatContentThinkProps = {
  maxHeight?: number;
  animation?: TdChatLoadingProps['animation'];
  collapsed?: boolean;
  layout?: 'block' | 'border';
};

type TdChatContentSuggestionProps = {
  directSend?: boolean;
};

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
