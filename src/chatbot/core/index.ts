// chat-service.ts
import { MessageStore } from './store/message';
import { ModelStore } from './store/model';
import ChatProcessor from './processor';
import SSEClient from './sseClient';
import type {
  Attachment,
  LLMConfig,
  Message,
  ModelParams,
  ModelServiceState,
  RequestParams,
  SSEChunkData,
} from './type';

export default class ChatEngine {
  public readonly messageStore: MessageStore;

  public readonly modelStore: ModelStore;

  private processor: ChatProcessor;

  private config: LLMConfig;

  private sseClient: SSEClient;

  constructor(initialModelState: ModelServiceState, initialMessages?: Message[]) {
    this.messageStore = new MessageStore(this.convertMessages(initialMessages));
    this.modelStore = new ModelStore(initialModelState);
    this.config = initialModelState.config;
    this.processor = new ChatProcessor(this.config);
  }

  public async sendMessage(prompt: string, attachments?: Attachment[]) {
    const userMessage = this.processor.createUserMessage(prompt, attachments);
    const aiMessage = this.processor.createAssistantMessage();
    this.messageStore.createMultiMessages([userMessage, aiMessage]);
    const { id } = aiMessage;
    if (this.config.stream) {
      // 处理sse流式响应模式
      this.setMessageStatus(id, 'streaming');
      await this.handleStreamResponse({
        prompt,
        messageID: id,
      });
    } else {
      // 处理批量响应模式
      this.setMessageStatus(id, 'pending');
      await this.processor.handleBatchResponse({
        prompt,
        messageID: id,
      });
      this.setMessageStatus(id, 'complete');
    }
  }

  public abortChat() {
    this.sseClient.close();
  }

  public async updateModel(params: ModelParams) {
    if (params?.model) {
      this.modelStore.setCurrentModel(params.model);
    }
    if ('useSearch' in params) {
      this.modelStore.setUseSearch(params.useSearch);
    }
    if ('useThink' in params) {
      this.modelStore.setUseThink(params.useThink);
    }
  }

  public async handleStreamResponse(params: RequestParams) {
    const req = this.config?.onRequest?.(params);
    this.sseClient = new SSEClient(this.config.endpoint, {
      onMessage: (msg: SSEChunkData) => {
        const parsed = this.config?.onMessage?.(msg);
        const processed = this.processor.processStreamChunk(parsed);
        this.messageStore.appendContent(params.messageID, processed);
      },
      onError: (error) => {
        this.setMessageStatus(params.messageID, 'error');
        this.config.onError?.(error, params);
      },
      onComplete: () => {
        this.setMessageStatus(params.messageID, 'complete');
        this.config.onComplete?.(params);
      },
    });

    await this.sseClient.connect(req);
  }

  public abort() {
    this.sseClient?.close();
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
    this.messageStore.setModelStatus(status);
    this.messageStore.setMessageStatus(messageId, status);
  }
}
