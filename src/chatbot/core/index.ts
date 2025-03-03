// chat-service.ts
import { MessageStore } from './store/message';
import { ModelStore } from './store/model';
import { ChatEngine } from './engine';
import type { LLMConfig, Message } from './type';

export default class ChatService {
  public readonly messageStore: MessageStore;

  public readonly modelStore: ModelStore;

  private engine: ChatEngine;

  constructor(config: LLMConfig, initialMessages?: Message[]) {
    this.messageStore = new MessageStore(this.convertMessages(initialMessages));
    this.modelStore = new ModelStore({
      currentModel: config.name || '未知',
      config,
    });
    this.engine = new ChatEngine(this.messageStore, this.modelStore);
  }

  public async sendMessage(input: string, files?: File[]) {
    const messageId = this.messageStore.createMessage(this.createUserMessage(input, files));
    await this.engine.processMessage({
      messageId,
      content: input,
      files,
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

  private createUserMessage(content: string, files?: File[]): Omit<Message, 'id'> {
    if (files && files.length > 0) {
      this.createAttachments(files);
    }

    return {
      role: 'user',
      status: 'sent',
      timestamp: `${Date.now()}`,
      main: { type: 'text', status: 'sent', content },
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
}

// export function createMockChatService() {
//   const service = new ChatService([
//     {
//       name: 'mock',
//       endpoint: 'mock://api',
//       stream: false,
//     },
//   ]);

//   service.engine = new MockEngine({
//     getState: () => service.getState(),
//     models: [],
//   });

//   return service;
// }

// // @ts-ignore
// window.mockChatService = createMockChatService();
