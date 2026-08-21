import './style/index.js';

import CherryStream from 'cherry-markdown/dist/cherry-markdown.stream.esm.js';

import _AttachmentContent from './content/attachment-content';
import type {
  TdChatContentMDOptions,
  TdChatContentMDPluginConfig,
  TdChatContentMDPresetConfig,
  TdChatContentMDPresetPlugin,
  TdChatMarkdownContentProps,
} from './content/markdown-content';
import _MarkdownContent from './content/markdown-content';
import _ReasoningContent from './content/reasoning-content';
import _SearchContent from './content/search-content';
import _SuggestionContent from './content/suggestion-content';
import _ThinkingContent from './content/thinking-content';
import _ChatItem from './chat-item';
import type {
  TdChatContentProps,
  TdChatMessageAction,
  TdChatMessageActionData,
  TdChatMessageActionDataMap,
  TdChatMessageActionHandlers,
  TdChatMessageActionName,
  TdChatMessageProps,
  TdChatMessageVariant,
} from './type';

export const ChatThinkingContent = _ThinkingContent;
export const ChatAttachmentContent = _AttachmentContent;
export const ChatSuggestionContent = _SuggestionContent;
export const ChatMarkdownContent = _MarkdownContent;
export const ChatSearchContent = _SearchContent;
export const ChatMessage = _ChatItem;
export const ChatReasoningContent = _ReasoningContent;
// 外部使用自定义逻辑时使用的CherryMarkdown类必须跟渲染时保持一致
export const TdMarkdownEngine = CherryStream;

export type { TdChatAttachmentContentProps } from './content/attachment-content';
export type { TdChatReasoningProps } from './content/reasoning-content';
export type { TdChatSearchContentProps } from './content/search-content';
export type { TdChatSuggestionContentProps } from './content/suggestion-content';
export type { TdChatThinkContentProps } from './content/thinking-content';
export type {
  TdChatContentMDOptions,
  TdChatContentMDPluginConfig,
  TdChatContentMDPresetConfig,
  TdChatContentMDPresetPlugin,
  TdChatContentProps,
  TdChatMarkdownContentProps,
  TdChatMessageAction,
  TdChatMessageActionData,
  TdChatMessageActionDataMap,
  TdChatMessageActionHandlers,
  TdChatMessageActionName,
  TdChatMessageProps,
  TdChatMessageVariant,
};

export default ChatMessage;
