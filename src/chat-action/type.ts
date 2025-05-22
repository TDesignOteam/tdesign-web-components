import { type ChatComment } from '../chatbot';
import { StyledProps, TNode } from '../common';
import { type TooltipProps } from '../tooltip';

export type TdChatActionsName = 'copy' | 'good' | 'bad' | 'replay' | 'share';

export type TdChatActionItem = {
  name: TdChatActionsName;
  render: TNode;
};

interface ChatActionProps {
  actionBar?: TdChatActionsName[] | boolean;
  handleAction?: (name: TdChatActionsName, data: any) => void;
  comment?: ChatComment;
  copyText?: string;
  tooltipProps?: TooltipProps;
}

export interface TdChatActionProps extends ChatActionProps, StyledProps {}
