import type { TdChatItemAction, TdChatItemActionName,TdChatItemProps } from '../chatbot/type';

export interface TdActionProps {
  actionBar?: TDChatItemActionName[] | boolean;
  onActions?: TDChatItemProps['onActions'];
  presetActions?: TDChatItemAction[];
  message?: any;
}
