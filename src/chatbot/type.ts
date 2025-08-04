import { TdChatActionsName } from '../chat-action';
import { type TdChatLoadingProps } from '../chat-loading';
import { type TdChatMarkdownContentProps } from '../chat-message';
import { type TdChatSenderProps } from '../chat-sender';
import type { StyledProps, TNode } from '../common';
import type {
  AIMessageContent,
  ChatContentType,
  ChatMessagesData,
  ChatMessageSetterMode,
  ChatRequestParams,
  ChatServiceConfigSetter,
  ChatStatus,
} from './core/type';

export type TdChatMessageActionName = TdChatActionsName | 'searchResult' | 'searchItem' | 'suggestion';
export interface TdChatMessageAction {
  name: TdChatMessageActionName;
  render: TNode;
}

export type TdChatContentProps = {
  markdown?: Omit<TdChatMarkdownContentProps, 'content'>;
  search?: TdChatContentSearchProps;
  thinking?: TdChatContentThinkProps;
  suggestion?: TdChatContentSuggestionProps;
  [key: string]: any; // 处理其他ContentType情况
} & Partial<Record<Exclude<ChatContentType, 'markdown' | 'search' | 'thinking' | 'suggestion'>, any>>;

export interface TdChatMessageProps {
  /**
   * 操作
   */
  actions?:
    | TdChatMessageActionName[]
    // | ((preset: TdChatMessageAction[], message: ChatMessagesData) => TdChatMessageAction[])
    | boolean;
  animation?: 'skeleton' | 'moving' | 'gradient' | 'circle';
  handleActions?: Partial<Record<TdChatMessageActionName, (data?: any) => void>>;
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
  /** 消息引擎初始化完成回调 */
  onChatReady?: (e: CustomEvent) => void;
  /** 消息发送完回调 */
  onChatAfterSend?: (e: CustomEvent<ChatRequestParams>) => void;
}

export interface TdChatListScrollToOptions {
  behavior?: 'auto' | 'smooth';
  to?: 'top' | 'bottom';
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
   * 批量设置消息
   * @param messages 要设置的消息数组
   * @param mode 模式：
   * - replace: 完全替换当前消息（默认）
   * - prepend: 将消息添加到现有消息前面
   * - append: 将消息追加到现有消息后面
   */
  setMessages: (messages: ChatMessagesData[], mode: ChatMessageSetterMode) => void;

  /**
   * 清空消息列表
   */
  clearMessages: () => void;

  /**
   * 中止当前聊天
   */
  abortChat: () => Promise<void>;

  /**
   * 添加提示信息到输入框
   * @param prompt - 提示文本
   * @param autoFocus - 是否自动聚焦到输入框
   */
  addPrompt: (prompt: string, autoFocus?: boolean) => void;

  /**
   * 受控滚动
   */
  scrollList: (opt?: TdChatListScrollToOptions) => void;

  /**
   * 获取当前消息列表
   */
  readonly chatMessageValue: ChatMessagesData[];

  /**
   * 当前聊天状态
   */
  readonly chatStatus: ChatStatus;

  /**
   * 当前输入框状态
   */
  readonly senderLoading: boolean;

  /**
   * ChatEngine是否就绪
   */
  readonly isChatEngineReady: boolean;

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

export type TdChatMessageConfigItem = Omit<TdChatMessageProps, 'message'>;

export type TdChatMessageConfig = {
  [key in ModelRoleEnum]?: TdChatMessageConfigItem;
};

export type ScrollPosition = 'top' | 'bottom';

export interface TdChatListProps {
  children?: TNode;
  /** 自动滚动底部 */
  autoScroll?: boolean;
  /** 初始滚动条停留的位置 */
  defaultScrollTo?: ScrollPosition;
  onScroll?: (e: CustomEvent<{ scrollTop: number }>) => void;
}

export interface TdChatListApi {
  /** 滚动到 */
  scrollList: (opt?: TdChatListScrollToOptions) => void;
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
