import type {
  AIMessage,
  AttachmentItem,
  ImageContent,
  Message,
  SearchContent,
  TextContent,
  ThinkingContent,
  UserMessage,
} from '../type';

export default class MessageProcessor {
  private lastContentMap = new Map<string, number>(); // 记录最后出现的内容类型索引

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

  // public processStreamChunk(message: AIMessage, chunk: any): AIMessageContent {
  //   const existingIndex = this.lastContentMap.get(chunk.type) ?? -1;
  //   let processed: AIMessageContent;

  //   switch (chunk.type) {
  //     case 'text':
  //     case 'markdown':
  //       processed = this.processTextContent(message, chunk, existingIndex);
  //       break;
  //     case 'thinking':
  //       processed = this.processThinkingContent(message, chunk, existingIndex);
  //       break;
  //     case 'image':
  //       processed = this.processImageContent(message, chunk, existingIndex);
  //       break;
  //     case 'search':
  //       processed = this.processSearchContent(message, chunk, existingIndex);
  //       break;
  //     default:
  //       throw new Error(`Unsupported chunk type: ${chunk.type}`);
  //   }

  //   this.lastContentMap.set(chunk.type, existingIndex >= 0 ? existingIndex : message.content.length);
  //   return processed;
  // }

  // 处理文本类内容（text/markdown）
  private processTextContent(message: AIMessage, chunk: TextContent | MarkdownContent, existingIndex: number) {
    if (existingIndex >= 0) {
      const existing = message.content[existingIndex] as TextContent | MarkdownContent;
      existing.data += chunk.data;
    } else {
      message.content.push({
        type: chunk.type,
        data: chunk.data,
        status: 'streaming',
      });
    }
  }

  // 处理思考过程内容
  private processThinkingContent(message: AIMessage, chunk: ThinkingContent, existingIndex: number) {
    if (existingIndex >= 0) {
      const existing = message.content[existingIndex] as ThinkingContent;
      existing.data = {
        ...existing.data,
        ...chunk.data,
        text: (existing.data?.text || '') + (chunk.data?.text || ''),
      };
    } else {
      message.content.push({
        type: 'thinking',
        data: {
          text: chunk.data?.text || '',
          title: chunk.data?.title || '',
        },
        status: 'streaming',
      });
    }
  }

  // 处理图片内容
  private processImageContent(message: AIMessage, chunk: ImageContent, existingIndex: number) {
    if (existingIndex >= 0) {
      const existing = message.content[existingIndex] as ImageContent;
      existing.data = {
        ...existing.data,
        ...chunk.data,
      };
    } else {
      message.content.push({
        type: 'image',
        data: chunk.data,
        status: 'streaming',
      });
    }
  }

  // 处理搜索内容
  private processSearchContent(message: AIMessage, chunk: SearchContent, existingIndex: number) {
    if (existingIndex >= 0) {
      const existing = message.content[existingIndex] as SearchContent;
      const newRefs = chunk.data.filter(
        (newItem) => !existing.data.some((existingItem) => existingItem.url === newItem.url),
      );
      existing.data.push(...newRefs);
    } else {
      message.content.push({
        type: 'search',
        data: chunk.data,
        status: 'streaming',
      });
    }
  }

  private generateID() {
    return `msg_${Date.now()}_${Math.floor(Math.random() * 90000) + 10000}`;
  }
}
