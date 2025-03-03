import { SSEResponse } from '../mock/sseService';
import { MessageStore } from './store/message';
import { ModelStore } from './store/model';
import type { ChunkParserResult,LLMConfig } from './type';

export class ChatEngine {
  private config: LLMConfig;

  constructor(
    private messageStore: MessageStore,
    private modelStore: ModelStore,
  ) {
    // 构造函数参数属性初始化
  }

  public async processMessage(params: { messageId: string; content: string; files?: File[] }) {
    const { config, currentModel } = this.modelStore.getState();
    if (!config || !currentModel) {
      this.modelStore.setError(`Model config not found`);
      return;
    }
    this.config = config;
    try {
      this.modelStore.setIsLoading(true);
      const assistantMessageId = this.createAssistantMessage();
      if (config.stream) {
        // 处理sse流式响应模式
        const mockSSEResponse = new SSEResponse();
        const mockResponse = await mockSSEResponse.getResponse();
        await this.handleSSEResponse(mockResponse, assistantMessageId);
        // await this.handleStreamResponse(assistantMessageId, params.content, config);
      } else {
        // 处理批量响应模式
        await this.handleBatchResponse(assistantMessageId, params.content, config);
      }
    } catch (err) {
      this.handleError(params.messageId, err);
    } finally {
      this.modelStore.setIsLoading(false);
    }
  }

  private createAssistantMessage(): string {
    // 创建初始助手消息
    return this.messageStore.createMessage({
      role: 'assistant',
      status: 'streaming',
      timestamp: `${Date.now()}`,
      thinking: {
        title: '思考中...',
        type: 'text',
        content: '好的，现在开始分析，，，',
        status: 'pending',
      },
    });
  }

  private async handleBatchResponse(messageId: string, content: string, config?: LLMConfig) {
    const response = await this.fetchLLMResponse(content, {
      ...this.config,
      ...config,
    });
    const parsed = this.parseChunk(response);
    console.log('===parsed', parsed);
    this.messageStore.updateMessage(messageId, {
      // main: parsed.main,
      // thinking: parsed.thinking,
      role: 'assistant',
      status: 'sent',
    });
    this.messageStore.setMessageStatus(messageId, 'sent');
  }

  private async handleStreamResponse(messageId: string, content: string, config: LLMConfig) {
    const response = await this.fetchLLMResponse(content, config);
    await this.handleSSEResponse(response, messageId);
    // this.messageStore.setMessagePhase(messageId, 'complete');
    // this.messageStore.setMessageStatus(messageId, 'sent');
  }

  private processStreamChunk(chunk: string, messageId: string) {
    const parsed = this.parseChunk(chunk);
    const currentContent = this.messageStore.getState().messages[messageId];
    if (!currentContent) return;
    const { search, thinking, main } = currentContent;
    // 处理搜索阶段
    if (parsed.search) {
      this.messageStore.updateMessage(messageId, {
        search: {
          ...search,
          status: 'streaming',
          content: parsed.search.content,
        },
      });
      return;
    }

    if (parsed.thinking) {
      this.messageStore.updateMessage(messageId, {
        search: {
          ...search,
          status: 'sent',
        },
        thinking: {
          ...thinking,
          status: 'streaming',
          content: `${thinking?.content || ''}${parsed.thinking.content}`,
          // type: parsed.thinking.type,
        },
      });
      return;
    }

    if (parsed.main && (parsed.main.type === 'text' || parsed.main.type === 'markdown')) {
      this.messageStore.updateMessage(messageId, {
        thinking: {
          ...thinking,
          status: 'sent',
        },
        main: {
          status: 'streaming',
          content: `${main?.content || ''}${parsed.main.content}`,
          type: parsed.main.type,
        },
      });
      return;
    }

    // this.messageStore.setMessageStatus(messageId, 'streaming');
  }

  private handleError(messageId: string, error: unknown) {
    this.messageStore.setMessageStatus(messageId, 'error');
    // this.messageStore.setMessagePhase(messageId, 'complete');
    this.modelStore.setError(error instanceof Error ? error.message : 'Unknown error');
  }

  private parseChunk(data: any): ChunkParserResult {
    return this.config?.parser?.parse(data);
  }

  private async handleSSEResponse(response: Response, messageId: string) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    const readStream = async () => {
      const { done, value } = await reader.read();

      if (done) return;

      const chunk = decoder.decode(value);
      this.processStreamChunk(chunk, messageId);
      await readStream(); // 递归调用
    };
    await readStream();
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
