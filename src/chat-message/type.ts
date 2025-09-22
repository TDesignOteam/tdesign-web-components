import type { TdChatActionsName } from '../chat-action';
import type {
  AIMessageContent,
  ChatContentType,
  ChatMessageRole,
  ChatMessagesData,
  ChatMessageStatus,
  UserMessageContent,
} from '../chat-engine/type';
import type { ChatLoadingAnimationType, TdChatLoadingProps } from '../chat-loading';
import type { TNode } from '../common';
import type { TdChatMarkdownContentProps } from './content/markdown-content';

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

export type TdChatMessageVariant = 'base' | 'text' | 'outline';

export type TdChatMessageActionName = TdChatActionsName | 'searchResult' | 'searchItem' | 'suggestion';
export interface TdChatMessageAction {
  name: TdChatMessageActionName;
  render: TNode;
}

export type TdChatContentProps = {
  markdown?: Omit<TdChatMarkdownContentProps, 'content'>;
  search?: TdChatContentSearchProps;
  thinking?: TdChatContentThinkProps;
  reasoning?: TdChatContentThinkProps;
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
  animation?: ChatLoadingAnimationType;
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
  role?: ChatMessageRole;
  /**
   * 消息内容
   */
  content?: AIMessageContent[] | UserMessageContent[];
  /**
   * 消息状态
   */
  status?: ChatMessageStatus;
  /**
   * 消息ID
   */
  id?: string;
  /**
   * 消息样式，是否有边框，背景色等
   */
  variant?: TdChatMessageVariant;
  /** 气泡方向 */
  placement?: 'left' | 'right';
  /** 消息体 (兼容旧版本，优先级低于直接传入的 role/content/status) */
  message?: ChatMessagesData;
  /** 透传chat-content参数 */
  chatContentProps?: TdChatContentProps;
}
