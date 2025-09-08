import _MarkdownContent from './content/markdown-content';
import _ReasoningContent from './content/reasoning-content';
import _SearchContent from './content/search-content';
import _SuggestionContent from './content/suggestion-content';
import _ThinkingContent from './content/thinking-content';
import _ChatItem from './chat-item';

export const ChatThinkingContent = _ThinkingContent;
export const ChatSuggestionContent = _SuggestionContent;
export const ChatMarkdownContent = _MarkdownContent;
export const ChatSearchContent = _SearchContent;
export const ChatMessage = _ChatItem;
export const ChatReasoningContent = _ReasoningContent;

export type { TdChatThinkContentProps } from './content/thinking-content';
export type { TdChatSearchContentProps } from './content/search-content';
export type { TdChatSuggestionContentProps } from './content/suggestion-content';
export type { TdChatReasoningProps } from './content/reasoning-content';
export type * from './content/markdown-content';

export default ChatMessage;
