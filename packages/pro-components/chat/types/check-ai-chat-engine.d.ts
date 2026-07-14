// Temporary type-check bridge for the local, unpublished ai-core dependency.
// The linked package currently exports source files (`./index.ts`) instead of built declarations,
// so checking chat examples would pull ai-core internals into this repo's tsc program.
// Remove this file once @tdesign/ai-chat-engine exposes built `dist/*.d.ts` types locally or on npm.
import type {
  AIMessage,
  AIMessageContent,
  AttachmentContent,
  ChatMessagesData,
  ImageContent,
  MarkdownContent,
  SearchContent,
  SuggestionContent,
  TextContent,
  ThinkingContent,
  UserMessage,
  UserMessageContent,
} from '@tdesign/ai-chat-engine/type';

declare module '@tdesign/ai-chat-engine' {
  export * from '@tdesign/ai-chat-engine/type';

  export function findTargetElement(event: MouseEvent, selector: string | string[]): HTMLElement | null;
  export function getMessageContentForCopy(message?: ChatMessagesData): string;
  export function isAIMessage(message?: ChatMessagesData): message is AIMessage;
  export function isUserMessage(message?: ChatMessagesData): message is UserMessage;
  export function isTextContent(content: AIMessageContent): content is TextContent;
  export function isMarkdownContent(content: AIMessageContent): content is MarkdownContent;
  export function isThinkingContent(content: AIMessageContent): content is ThinkingContent;
  export function isImageContent(content: AIMessageContent): content is ImageContent;
  export function isSearchContent(content: AIMessageContent): content is SearchContent;
  export function isSuggestionContent(content: AIMessageContent): content is SuggestionContent;
  export function isAttachmentContent(content: UserMessageContent): content is AttachmentContent;

  export default class ChatEngine {
    constructor(...args: any[]);
    [key: string]: any;
  }
}
