import _MarkdownContent from './content/markdown-content';
import _SearchContent from './content/search-content';
import _SuggestionContent from './content/suggestion-content';
import _ThinkingContent from './content/thinking-content';
import _ChatItem from './chat-item';

export const ChatThinkingContent = _ThinkingContent;
export const ChatSuggestionContent = _SuggestionContent;
export const ChatMarkdownContent = _MarkdownContent;
export const ChatSearchContent = _SearchContent;
export const ChatMessage = _ChatItem;

export type { TDChatThinkContentProps } from './content/thinking-content';
export type { TDChatSearchContentProps } from './content/search-content';
export type { TDChatSuggestionContentProps } from './content/suggestion-content';
export type { TDChatMarkdownContentProps } from './content/markdown-content';

export default ChatMessage;
