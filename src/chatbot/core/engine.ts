import SSEClient from './sseClient';
import type { Attachment, ChunkParsedResult, LLMConfig, Message, RequestParams, SSEChunkData } from './type';

export class ChatEngine {
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
      status: 'sent',
      timestamp: `${Date.now()}`,
      main: { type: 'text', status: 'sent', content },
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
    const parsed = this.config?.parseResponse?.(response);
    console.log('===parsed', parsed);
    return parsed;
    // this.messageStore.setMessageStatus(messageId, 'sent');
  }

  public async *handleStreamResponse(params: RequestParams) {
    const req = this.config?.parseRequest?.(params);
    console.log('=====req', { ...req }, this.config.endpoint);
    const sseClient = new SSEClient(this.config.endpoint, {
      // onMessage: (data) => {
      //   console.log('=====onMessage', data);
      //   return this.processStreamChunk(data);
      // },
      onError: (error) => {
        console.error('SSE连接错误:', error);
      },
      onComplete: () => {
        console.log('SSE连接关闭');
      },
    });

    // 直接通过生成器返回数据
    for await (const data of sseClient.connect(req)) {
      console.log('=====stream data', data);
      yield this.processStreamChunk(data);
    }
  }

  private processStreamChunk(chunk: SSEChunkData): ChunkParsedResult {
    const parsed = this.config?.parseResponse?.(chunk);
    console.log('===parsed content', parsed);
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
      return {
        search: {
          status: 'sent',
        },
        thinking: {
          title: parsed.thinking?.title || '思考中...',
          status: 'streaming',
          content: parsed.thinking.content,
        },
      };
    }
    // 处理生成阶段
    if (parsed.main && (parsed.main.type === 'text' || parsed.main.type === 'markdown')) {
      return {
        thinking: {
          title: parsed?.thinking?.title || '思考完成',
          status: 'sent',
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
    const req = this.config?.parseRequest?.(params);
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
