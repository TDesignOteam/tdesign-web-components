import Cherry from 'cherry-markdown/dist/cherry-markdown.core';

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
// 外部使用自定义逻辑时使用的CherryMarkdown类必须跟渲染时保持一致
export const TdMarkdownEngine = Cherry;

export type { TdChatThinkContentProps } from './content/thinking-content';
export type { TdChatSearchContentProps } from './content/search-content';
export type { TdChatSuggestionContentProps } from './content/suggestion-content';
export type * from './content/markdown-content';

export default ChatMessage;
