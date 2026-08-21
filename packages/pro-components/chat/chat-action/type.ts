import { type TooltipProps } from '@tdesign/web-components/tooltip';
import { StyledProps, TNode } from '@tdesign/web-components-shared/common';

import { type ChatComment } from '../chat-engine';

export type TdChatActionsName = 'copy' | 'good' | 'bad' | 'replay' | 'share';

export type TdChatActionItem<TName extends string = TdChatActionsName> = {
  name: TName;
  render: TNode;
  ignoreWrapper?: boolean;
};

export type TdChatActionData = {
  event?: MouseEvent;
  active?: boolean;
  [key: string]: unknown;
};

interface ChatActionProps {
  /**
   * 操作按钮及排列顺序
   * @default true
   */
  actionBar?: Array<TdChatActionsName | TdChatActionItem<string>> | boolean;
  /** 操作按钮点击回调 */
  handleAction?: (name: TdChatActionsName, data: TdChatActionData) => void;
  /**
   * 当前点赞点踩状态
   * @default ''
   */
  comment?: ChatComment;
  /**
   * 复制按钮使用的文本
   * @default ''
   */
  copyText?: string;
  /**
   * 透传 Tooltip 属性
   * @default {}
   */
  tooltipProps?: TooltipProps;
}

export interface TdChatActionProps extends ChatActionProps, StyledProps {}
