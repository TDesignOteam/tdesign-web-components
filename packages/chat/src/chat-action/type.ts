import { StyledProps, TNode } from '@tdesign/web-components-shared/common';
import { type TooltipProps } from '@tdesign/web-components-ui/tooltip';

import { type ChatComment } from '../chat-engine';

export type TdChatActionsName = 'copy' | 'good' | 'bad' | 'replay' | 'share';

export type TdChatActionItem = {
  name: TdChatActionsName;
  render: TNode;
  ignoreWrapper?: boolean;
};

interface ChatActionProps {
  actionBar?: TdChatActionsName[] | boolean;
  handleAction?: (name: TdChatActionsName, data: any) => void;
  comment?: ChatComment;
  copyText?: string;
  tooltipProps?: TooltipProps;
}

export interface TdChatActionProps extends ChatActionProps, StyledProps {}
