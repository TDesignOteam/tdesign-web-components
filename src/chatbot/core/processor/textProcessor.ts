import type { Attachment, ChunkParsedResult, Message } from '../type';

export default class ChatTextProcessor {
  public createUserMessage(content: string, files?: Attachment[]): Message {
    if (files && files.length > 0) {
      this.createAttachments(files);
    }

    return {
      id: this.generateID(),
      role: 'user',
      status: 'complete',
      timestamp: `${Date.now()}`,
      main: { type: 'text', status: 'complete', content },
    };
  }

  public createAssistantMessage(): Message {
    // 创建初始助手消息
    return {
      id: this.generateID(),
      role: 'assistant',
      status: 'pending',
      timestamp: `${Date.now()}`,
    };
  }

  private generateID() {
    return `msg_${Date.now()}_${Math.floor(Math.random() * 90000) + 10000}`;
  }

  private createAttachments(files: Attachment[]) {
    return files.map((file) => ({
      ...file,
    }));
  }

  processStreamChunk(parsed: ChunkParsedResult): ChunkParsedResult {
    // 处理搜索阶段
    if (parsed.search) {
      return {
        search: {
          status: 'streaming',
          content: parsed.search.content,
        },
      };
    }
    // 处理思考阶段
    if (parsed.thinking) {
      const { type = 'text', title = '思考中...', content } = parsed.thinking;
      return {
        search: {
          status: 'complete',
        },
        thinking: {
          type,
          title,
          status: 'streaming',
          content,
        },
      };
    }
    // 处理生成阶段
    if (parsed.main && (parsed.main.type === 'text' || parsed.main.type === 'markdown')) {
      return {
        thinking: {
          title: parsed?.thinking?.title || '思考完成',
          status: 'complete',
        },
        main: {
          status: 'streaming',
          content: parsed.main.content,
          type: parsed.main.type,
        },
      };
    }
  }
}
