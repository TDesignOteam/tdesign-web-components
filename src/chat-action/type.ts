
import type { TDChatItemAction, TDChatItemProps, TDChatItemActionName } from '../chatbot/type';

export interface TdActionProps {
  actionBar?: TDChatItemActionName[] | boolean;
  onActions?: TDChatItemProps['onActions'];
  presetActions?: TDChatItemAction[];
  
}
