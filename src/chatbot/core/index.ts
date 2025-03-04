// chat-service.ts
import { MessageStore } from './store/message';
// import { ModelStore } from './store/model';
import { ChatEngine } from './engine';
import type { LLMConfig, Message } from './type';

export default class ChatService {
  public readonly messageStore: MessageStore;

  // public readonly modelStore: ModelStore;

  private engine: ChatEngine;

  private config: LLMConfig;

  constructor(config: LLMConfig, initialMessages?: Message[]) {
    this.messageStore = new MessageStore(this.convertMessages(initialMessages));
    // this.modelStore = new ModelStore(config);
    this.config = config;
    this.engine = new ChatEngine(config);
  }

  public async sendMessage(input: string, attachments?: File[]) {
    const userMessage = this.engine.createUserMessage(input, attachments);
    const aiMessage = this.engine.createAssistantMessage();
    this.messageStore.createMultiMessages([userMessage, aiMessage]);

    if (this.config.stream) {
      // 处理sse流式响应模式
      const stream = this.engine.handleStreamResponse(input);
      for await (const chunk of stream) {
        this.messageStore.appendContent(aiMessage.id, chunk);
      }
    } else {
      // 处理批量响应模式
      await this.engine.handleBatchResponse(input);
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
}
