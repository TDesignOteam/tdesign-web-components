import { SSEResponse } from '../mock/sseService';
import { MessageStore } from './store/message';
import { ModelStore } from './store/model';
import type { ContentData, LLMConfig } from './type';

export class ChatEngine {
  constructor(
    private messageStore: MessageStore,
    private modelStore: ModelStore,
    private config: LLMConfig[],
  ) {
    // 构造函数参数属性初始化
  }

  public async processMessage(params: { messageId: string; content: string; files?: File[] }) {
    const config = this.config.find((m) => m.name === this.modelStore.getState().currentModel);
    if (!config) {
      this.modelStore.setError(`Model ${this.modelStore.getState().currentModel} not found`);
      return;
    }

    try {
      this.modelStore.setIsLoading(true);
      const assistantMessageId = this.createAssistantMessage();

      if (config.stream) {
        // 处理sse流式响应模式
        const mockSSEResponse = new SSEResponse(`这是一段模拟的流式字符串数据。`);
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

  private async handleBatchResponse(messageId: string, content: string, config: LLMConfig) {
    const response = await this.fetchLLMResponse(content, config);
    const parsed = this.parseChunk(response);
    const currentContent = this.messageStore.getState().messages[messageId];
    this.messageStore.updateMessageContent(messageId, {
      ...currentContent,
      main: parsed.main,
      thinking: parsed.thinking,
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
    if (parsed.thinking) {
      this.messageStore.updateMessageContent(messageId, {
        ...currentContent,
        thinking: {
          status: 'streaming',
          ...parsed.thinkingStep,
        },
      });
    }

    if (parsed.main) {
      this.messageStore.updateMessageContent(messageId, {
        ...currentContent,
        main: {
          ...currentContent.main,
          status: 'streaming',
          content: `${currentContent?.main?.content || ''}${parsed.main}`,
          type: 'text',
        },
        thinking: {
          ...currentContent.thinking,
          status: 'sent',
        },
      });
    }

    // this.messageStore.setMessageStatus(messageId, 'streaming');
  }

  private handleError(messageId: string, error: unknown) {
    this.messageStore.setMessageStatus(messageId, 'error');
    // this.messageStore.setMessagePhase(messageId, 'complete');
    this.modelStore.setError(error instanceof Error ? error.message : 'Unknown error');
  }

  private parseChunk(data: any) {
    try {
      if (typeof data === 'string') {
        return {
          main: data,
        };
      }
      // if (data === '。') {
      //   return {
      //     isComplete: true,
      //   };
      // }
      return data;
    } catch (err) {
      console.error('Failed to parse chunk:', data);
      return {};
    }
  }

  private mergeContent(current: ContentData, update: ContentData): ContentData {
    // if (current.type === 'text' && update.type === 'text') {
    return { ...current, text: (current.text || '') + (update?.text || update || '') };
    // }
    // return update;
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
