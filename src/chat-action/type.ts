import { StyledProps, TNode } from '../common';

export type TdChatActionsName = 'copy' | 'good' | 'bad' | 'replay' | 'share';

export type TdChatActionItem = {
  name: TdChatActionsName;
  render: TNode;
};

interface ChatActionProps {
  actionBar?: TdChatActionsName[] | boolean;
  onActions?: Partial<Record<TdChatActionsName, (event: MouseEvent) => void>>;
}

export interface TdChatActionProps extends ChatActionProps, StyledProps {}
