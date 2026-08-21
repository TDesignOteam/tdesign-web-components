import type { TNode } from '@tdesign/web-components-shared/common';

import type { TdChatActionData, TdChatActionItem, TdChatActionsName } from '../chat-action';
import type {
  AIMessageContent,
  ChatMessageRole,
  ChatMessagesData,
  ChatMessageStatus,
  ReferenceItem,
  SearchContent,
  SuggestionItem,
  UserMessageContent,
} from '../chat-engine';
import type { ChatLoadingAnimationType, TdChatLoadingProps } from '../chat-loading';
import type { TdChatAttachmentContentProps } from './content/attachment-content';
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

export type TdChatMessageActionName = TdChatActionsName | 'searchResult' | 'searchItem' | 'suggestion' | 'codeCopy';
/** 消息操作栏中的自定义插槽项；内容事件名称不作为预设按钮名称使用。 */
export type TdChatMessageAction = TdChatActionItem<string>;

type TdChatMessageActionBaseData = TdChatActionData & {
  message?: ChatMessagesData;
};

export type TdChatMessageActionDataMap = {
  [K in TdChatActionsName]: TdChatMessageActionBaseData;
} & {
  searchResult: TdChatMessageActionBaseData & { event: MouseEvent; content: SearchContent['data'] };
  searchItem: TdChatMessageActionBaseData & { event: MouseEvent; content: ReferenceItem };
  suggestion: TdChatMessageActionBaseData & { event: MouseEvent; content: SuggestionItem };
  codeCopy: TdChatMessageActionBaseData & { code: string; lang?: string };
};

export type TdChatMessageActionData = TdChatMessageActionDataMap[TdChatMessageActionName];

export type TdChatMessageActionHandlers = {
  [K in TdChatMessageActionName]?: (data: TdChatMessageActionDataMap[K]) => void;
};

export type TdChatContentProps = {
  markdown?: Omit<TdChatMarkdownContentProps, 'content'>;
  search?: TdChatContentSearchProps;
  thinking?: TdChatContentThinkProps;
  reasoning?: TdChatContentThinkProps;
  suggestion?: TdChatContentSuggestionProps;
  attachments?: Omit<TdChatAttachmentContentProps, 'content'>;
};

export interface TdChatMessageProps {
  /**
   * 操作
   * @default ['replay', 'copy', 'good', 'bad', 'share']
   */
  actions?:
    | Array<TdChatActionsName | TdChatMessageAction>
    // | ((preset: TdChatMessageAction[], message: ChatMessagesData) => TdChatMessageAction[])
    | boolean;
  /**
   * 消息加载动画
   * @default skeleton
   */
  animation?: ChatLoadingAnimationType;
  /** 操作按钮回调 */
  handleActions?: TdChatMessageActionHandlers;
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
   * @default text
   */
  variant?: TdChatMessageVariant;
  /**
   * 气泡方向
   * @default left
   */
  placement?: 'left' | 'right';
  /** 消息体 (兼容旧版本，优先级低于直接传入的 role/content/status) */
  message?: ChatMessagesData;
  /** 透传chat-content参数 */
  chatContentProps?: TdChatContentProps;
}
