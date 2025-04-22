import _SearchContent from './content/search-content';
import _ThinkingContent from './content/thinking-content';
import _ChatItem from './chat-item';

export const ChatThinkingContent = _ThinkingContent;
export const ChatSearchContent = _SearchContent;
export const ChatMessage = _ChatItem;

export type { TDChatThinkContentProps } from './content/thinking-content';
export type { TDChatSearchContentProps } from './content/search-content';

export default ChatMessage;
