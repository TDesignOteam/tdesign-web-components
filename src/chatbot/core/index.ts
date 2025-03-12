import ChatProcessor from './processor/textProcessor';
import { LLMService } from './server/llmService';
import { MessageStore } from './store/message';
import type { AttachmentContent, LLMConfig, Message, ModelServiceState, RequestParams, SSEChunkData } from './type';

export interface IChatEngine {
  sendMessage(prompt: string, attachments?: AttachmentContent[]): Promise<void>;
  abortChat(): void;
}

export default class ChatEngine implements IChatEngine {
  public readonly messageStore: MessageStore;

  private processor: ChatProcessor;

  private llmService: LLMService;

  private config: LLMConfig;

  constructor(initialModelState: ModelServiceState, initialMessages?: Message[]) {
    this.messageStore = new MessageStore(this.convertMessages(initialMessages));
    this.config = initialModelState.config;
    this.llmService = new LLMService();
    this.processor = new ChatProcessor();
  }

  public async sendMessage(prompt: string, attachments?: AttachmentContent[]) {
    const userMessage = this.processor.createUserMessage(prompt, attachments);
    const aiMessage = this.processor.createAssistantMessage();
    this.messageStore.createMultiMessages([userMessage, aiMessage]);

    const { id } = aiMessage;
    const params = {
      prompt,
      attachments,
      messageID: id,
    };
    try {
      if (this.config.stream) {
        // 处理sse流式响应模式
        this.setMessageStatus(id, 'streaming');
        await this.handleStreamRequest(params);
      } else {
        // 处理批量响应模式
        this.setMessageStatus(id, 'pending');
        await this.handleBatchRequest(params);
        this.setMessageStatus(id, 'complete');
      }
    } catch (error) {
      this.setMessageStatus(id, 'error');
      throw error;
    }
  }

  public abortChat() {
    this.llmService.closeSSE();
    this.config?.onAbort && this.config.onAbort();
  }

  private async handleBatchRequest(params: RequestParams) {
    const id = params.messageID;
    this.setMessageStatus(id, 'pending');
    const result = await this.llmService.handleBatchRequest(params, this.config);
    this.messageStore.appendContent(id, result);
    this.setMessageStatus(id, 'complete');
  }

  private async handleStreamRequest(params: RequestParams) {
    const id = params.messageID;
    this.setMessageStatus(id, 'streaming');

    await this.llmService.handleStreamRequest(params, {
      ...this.config,
      onMessage: (chunk: SSEChunkData) => {
        const parsed = this.config?.onMessage?.(chunk);
        const processed = this.processor.processStreamChunk(parsed);
        this.messageStore.appendContent(id, processed);
        return processed;
      },
      onError: (error) => {
        this.setMessageStatus(id, 'error');
        this.config.onError?.(error, params);
      },
      onComplete: (isAborted) => {
        this.setMessageStatus(id, isAborted ? 'stop' : 'complete');
        this.config.onComplete?.(isAborted, params);
      },
    });
  }

  private convertMessages(messages?: Message[]) {
    if (!messages) return { messageIds: [], messages: {} };

    return {
      messageIds: messages.map((msg) => msg.id),
      messages: messages.reduce(
        (acc, msg) => {
          acc[msg.id] = msg;
          return acc;
        },
        {} as Record<string, Message>,
      ),
    };
  }

  private setMessageStatus(messageId: string, status: Message['status']) {
    this.messageStore.setMessageStatus(messageId, status);
  }
}
