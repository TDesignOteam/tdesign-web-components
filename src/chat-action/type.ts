import type { TdChatItemAction, TdChatItemActionName,TdChatItemProps } from '../chatbot/type';

export interface TdActionProps {
  actionBar?: TdChatItemActionName[] | boolean;
  onActions?: TdChatItemProps['onActions'];
  presetActions?: TdChatItemAction[];
  message?: any;
}
