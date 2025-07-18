import _MarkdownContent from './content/cherry-markdown-content';
import _SearchContent from './content/search-content';
import _SuggestionContent from './content/suggestion-content';
import _ThinkingContent from './content/thinking-content';
import _ChatItem from './chat-item';

export const ChatThinkingContent = _ThinkingContent;
export const ChatSuggestionContent = _SuggestionContent;
export const ChatMarkdownContent = _MarkdownContent;
export const ChatSearchContent = _SearchContent;
export const ChatMessage = _ChatItem;

export type { TdChatThinkContentProps } from './content/thinking-content';
export type { TdChatSearchContentProps } from './content/search-content';
export type { TdChatSuggestionContentProps } from './content/suggestion-content';
export type * from './content/cherry-markdown-content';

export default ChatMessage;
