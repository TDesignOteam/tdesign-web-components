import type { TNode } from '@tdesign/web-components-shared/common';

import type { TdChatActionsName } from '../chat-action';
import type {
  AIMessageContent,
  ChatMessageRole,
  ChatMessagesData,
  ChatMessageStatus,
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
export interface TdChatMessageAction {
  name: TdChatMessageActionName;
  render: TNode;
}

declare global {
  /** 业务自定义内容配置的全局声明合并扩展点。 */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface -- 供业务通过全局声明合并扩展
  interface TdChatContentPropsOverrides {}
}

export type TdChatContentProps = {
  markdown?: Omit<TdChatMarkdownContentProps, 'content'>;
  search?: TdChatContentSearchProps;
  thinking?: TdChatContentThinkProps;
  reasoning?: TdChatContentThinkProps;
  suggestion?: TdChatContentSuggestionProps;
  attachments?: Omit<TdChatAttachmentContentProps, 'content'>;
} & TdChatContentPropsOverrides;

export interface TdChatMessageProps {
  /**
   * 操作
   * @default ['replay', 'copy', 'good', 'bad', 'share']
   */
  actions?:
    | Array<TdChatMessageActionName | TdChatMessageAction>
    // | ((preset: TdChatMessageAction[], message: ChatMessagesData) => TdChatMessageAction[])
    | boolean;
  /**
   * 消息加载动画
   * @default skeleton
   */
  animation?: ChatLoadingAnimationType;
  /** 操作按钮回调 */
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
