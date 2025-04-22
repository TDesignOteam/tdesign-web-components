
import type { TdChatItemAction, TdChatItemProps, TdChatItemActionName } from '../chatbot/type';

export interface TdActionProps {
  actionBar?: TdChatItemActionName[] | boolean;
  onActions?: TdChatItemProps['onActions'];
  presetActions?: TdChatItemAction[];
  
}
