// 当前 ai-core 仍是本地未发布依赖，入口直接暴露源码文件（`./index.ts`），还没有构建后的声明产物。
// 如果直接检查 chat 示例，tsc 会把 ai-core 内部源码也拉入当前项目一起检查，导致类型边界被依赖内部问题污染。
// 等 @tdesign/ai-chat-engine 在本地或 npm 包中提供 `dist/*.d.ts` 后，应删除这个仅用于类型检查的临时桥接声明。
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
