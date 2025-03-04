import { SSEResponse } from '../mock/sseService';
import type { ChunkParserResult, LLMConfig, Message } from './type';

export class ChatEngine {
  constructor(private config: LLMConfig) {
    // 构造函数参数属性初始化
  }

  public createUserMessage(content: string, files?: File[]): Message {
    if (files && files.length > 0) {
      this.createAttachments(files);
    }

    return {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 90000) + 10000}`,
      role: 'user',
      status: 'sent',
      timestamp: `${Date.now()}`,
      main: { type: 'text', status: 'sent', content },
    };
  }

  public createAssistantMessage(): Message {
    // 创建初始助手消息
    return {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 90000) + 10000}`,
      role: 'assistant',
      status: 'pending',
      timestamp: `${Date.now()}`,
      // thinking: {
      //   status: 'pending',
      // },
    };
  }

  private createAttachments(files: File[]) {
    return files.map((file) => ({
      type: 'file',
      name: file.name,
      url: URL.createObjectURL(file),
      metadata: {
        type: file.type,
        size: file.size,
      },
    }));
  }

  public async handleBatchResponse(content: string, config?: LLMConfig) {
    const response = await this.fetchLLMResponse(content, {
      ...this.config,
      ...config,
    });
    const parsed = this.parseChunk(response);
    console.log('===parsed', parsed);
    // this.messageStore.setMessageStatus(messageId, 'sent');
  }

  public async *handleStreamResponse(content: string) {
    console.log('===handleStreamResponse content', content);
    const mockSSEResponse = new SSEResponse();
    const response = await mockSSEResponse.getResponse();
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      yield this.processStreamChunk(chunk);
    }
  }

  private processStreamChunk(chunk: string): ChunkParserResult {
    const parsed = this.parseChunk(chunk);
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
          title: '思考中...',
          status: 'streaming',
          content: parsed.thinking.content,
        },
      };
    }
    // 处理生成阶段
    if (parsed.main && (parsed.main.type === 'text' || parsed.main.type === 'markdown')) {
      return {
        thinking: {
          title: '思考完成',
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

  private parseChunk(data: any): ChunkParserResult {
    return this.config?.parser?.parse(data);
  }

  private async fetchLLMResponse(content: string, config: LLMConfig) {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify({
        message: content,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
