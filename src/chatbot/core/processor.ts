import type { Attachment, ChunkParsedResult, LLMConfig, Message, RequestParams } from './type';

export default class ChatProcessor {
  constructor(private config: LLMConfig) {
    // 构造函数参数属性初始化
  }

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

  public async handleBatchResponse(params: RequestParams): Promise<ChunkParsedResult> {
    const response = await this.fetchLLMResponse(params);
    const parsed = this.config?.onMessage?.(response);
    return parsed;
    // this.messageStore.setMessageStatus(messageId, 'complete');
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

  private async fetchLLMResponse(params: RequestParams) {
    const req = this.config?.onRequest?.(params);
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...req?.headers,
      },
      body: JSON.stringify(req?.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
