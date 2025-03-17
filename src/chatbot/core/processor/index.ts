import type { AIMessage, AttachmentItem, Message, UserMessage } from '../type';
import {
  type AIMessageContent,
  type ImageContent,
  type MarkdownContent,
  type SearchContent,
  type TextContent,
  type ThinkingContent,
} from '../type';

export default class MessageProcessor {
  private contentHandlers: Map<string, (chunk: any, existing?: any) => any> = new Map();

  constructor() {
    this.registerCoreHandlers();
  }

  public createUserMessage(content: string, attachments?: AttachmentItem[]): Message {
    const messageContent: UserMessage['content'] = [
      {
        type: 'text',
        data: content,
      },
    ];

    if (attachments?.length) {
      messageContent.push({
        type: 'attachment',
        data: attachments,
      });
    }

    return {
      id: this.generateID(),
      role: 'user',
      status: 'complete',
      timestamp: `${Date.now()}`,
      content: messageContent,
    };
  }

  public createAssistantMessage(): AIMessage {
    // 创建初始助手消息
    return {
      id: this.generateID(),
      role: 'assistant',
      status: 'pending',
      timestamp: `${Date.now()}`,
      content: [],
    };
  }

  // 通用处理器注册方法
  public registerHandler<T extends AIMessageContent>(type: string, handler: (chunk: T, existing?: T) => T) {
    this.contentHandlers.set(type, handler);
  }

  // 处理内容更新
  public processContentUpdate(lastContent: AIMessageContent | undefined, newChunk: AIMessageContent) {
    const handler = this.contentHandlers.get(newChunk.type);
    // 如果有注册的处理器且类型匹配
    if (handler && lastContent?.type === newChunk.type) {
      return handler(newChunk, lastContent);
    }
    // 没有处理器时的默认合并逻辑
    return {
      ...(lastContent || {}),
      ...newChunk,
      status: 'streaming',
    };
  }

  private generateID() {
    return `msg_${Date.now()}_${Math.floor(Math.random() * 90000) + 10000}`;
  }

  // 注册核心内容处理器
  private registerCoreHandlers() {
    this.registerTextHandlers();
    this.registerThinkingHandler();
    this.registerImageHandler();
    this.registerSearchHandler();
  }

  // 通用处理器工厂
  private createContentHandler<T extends AIMessageContent>(
    mergeData: (existing: T['data'], incoming: T['data']) => T['data'],
    options?: { initData?: (chunk: T) => T['data'] },
  ): (chunk: T, existing?: T) => T {
    return (chunk: T, existing?: T): T => {
      if (existing?.type === chunk.type) {
        return {
          ...existing,
          data: mergeData(existing.data, chunk.data),
          status: 'streaming',
        };
      }
      return {
        ...chunk,
        data: options?.initData ? options.initData(chunk) : chunk.data,
        status: 'streaming',
      };
    };
  }

  // 文本类处理器（text/markdown）
  private registerTextHandlers() {
    // 创建类型安全的处理器
    const createTextHandler = <T extends TextContent | MarkdownContent>() =>
      this.createContentHandler<T>((existing: string, incoming: string) => existing + incoming);

    this.registerHandler<TextContent>('text', createTextHandler<TextContent>());
    this.registerHandler<MarkdownContent>('markdown', createTextHandler<MarkdownContent>());
  }

  // 思考过程处理器
  private registerThinkingHandler() {
    this.registerHandler<ThinkingContent>(
      'thinking',
      this.createContentHandler(
        (existing, incoming) => ({
          ...existing,
          ...incoming,
          text: (existing?.text || '') + (incoming?.text || ''),
        }),
        {
          initData: (chunk) => ({
            text: chunk.data?.text || '',
            title: chunk.data?.title || '',
          }),
        },
      ),
    );
  }

  // 图片处理器
  private registerImageHandler() {
    this.registerHandler<ImageContent>(
      'image',
      this.createContentHandler((existing, incoming) => ({ ...existing, ...incoming })),
    );
  }

  // 搜索处理器
  private registerSearchHandler() {
    this.registerHandler<SearchContent>(
      'search',
      this.createContentHandler((existing, incoming) => [
        ...existing,
        ...incoming.filter((newItem) => !existing.some((existingItem) => existingItem.url === newItem.url)),
      ]),
    );
  }
}
