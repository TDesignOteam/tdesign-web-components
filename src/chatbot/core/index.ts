// chat-service.ts
import { MessageStore } from './store/message';
import { ModelStore } from './store/model';
import { ChatEngine } from './engine';
import type { Attachment, LLMConfig, Message, ModelParams, ModelServiceState } from './type';

export default class ChatService {
  public readonly messageStore: MessageStore;

  public readonly modelStore: ModelStore;

  private engine: ChatEngine;

  private config: LLMConfig;

  constructor(initialModelState: ModelServiceState, initialMessages?: Message[]) {
    this.messageStore = new MessageStore(this.convertMessages(initialMessages));
    this.modelStore = new ModelStore(initialModelState);
    this.config = initialModelState.config;
    this.engine = new ChatEngine({
      ...this.config,
      onComplete: (params) => {
        this.setMessageStatus(params.messageID, 'complete');
        this.config.onComplete?.(params);
      },
      onError: (params, error) => {
        this.setMessageStatus(params.messageID, 'error');
        this.config.onError?.(params, error);
      },
    });
  }

  public async sendMessage(prompt: string, attachments?: Attachment[]) {
    const userMessage = this.engine.createUserMessage(prompt, attachments);
    const aiMessage = this.engine.createAssistantMessage();
    this.messageStore.createMultiMessages([userMessage, aiMessage]);
    const { id } = aiMessage;
    if (this.config.stream) {
      // 处理sse流式响应模式
      this.setMessageStatus(id, 'streaming');
      const stream = this.engine.handleStreamResponse({
        prompt,
        messageID: id,
      });
      for await (const chunk of stream) {
        this.messageStore.appendContent(id, chunk);
      }
    } else {
      // 处理批量响应模式
      this.setMessageStatus(id, 'pending');
      await this.engine.handleBatchResponse({
        prompt,
        messageID: id,
      });
      this.setMessageStatus(id, 'complete');
    }
  }

  public async abortChat() {
    this.engine.abort();
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
