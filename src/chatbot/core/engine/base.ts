import type { MessageStore } from '../store/message';
import type {
  ChatMessagesData,
  ChatMessageSetterMode,
  ChatRequestParams,
  ChatServiceConfig,
  ChatStatus,
} from '../type';

export interface IChatEngine {
  init(config: ChatServiceConfig): void;
  sendUserMessage(params: ChatRequestParams): Promise<void>;
  regenerateAIMessage(keepVersion?: boolean): Promise<void>;
  abortChat(): Promise<void>;
  setMessages(messages: ChatMessagesData[], mode?: ChatMessageSetterMode): void;

  // 状态访问
  get messageStore(): MessageStore;
  get status(): ChatStatus;
}

// export abstract class BaseEngine implements IChatEngine {
//   protected messageStore: MessageStore;
//   protected sseClient: ssecli | null = null;
//   protected config: ChatServiceConfig = {};

//   constructor() {
//     this.messageStore = new MessageStore();
//   }

//   init(config: ChatServiceConfig): void {
//     this.config = config;
//     this.messageStore.initialize();
//   }

//   abstract sendUserMessage(params: ChatRequestParams): Promise<void>;
//   abstract regenerateAIMessage(keepVersion?: boolean): Promise<void>;

//   async abortChat(): Promise<void> {
//     this.sseClient?.close();
//   }

//   setMessages(messages: ChatMessagesData[], mode: ChatMessageSetterMode = 'replace'): void {
//     this.messageStore.setMessages(messages, mode);
//   }

//   get messageStore(): MessageStore {
//     return this.messageStore;
//   }

//   get status(): ChatStatus {
//     return this.messageStore.getState().status || 'idle';
//   }

//   // 公共工具方法
//   protected createUserMessage(prompt: string, attachments?: any[]): UserMessage {
//     return {
//       id: `msg_${Date.now()}`,
//       role: 'user',
//       content: [
//         { type: 'text', data: prompt },
//         ...(attachments || []).map((att) => ({ type: 'attachment', data: att })),
//       ],
//     };
//   }
// }
