import {
  type AIMessage,
  type AIMessageContent,
  isAIMessage,
  isUserMessage,
  type Message,
  type MessageState,
  UserMessage,
} from '../type';
import ReactiveState from './reactiveState';

// 专注消息生命周期管理
export class MessageStore extends ReactiveState<MessageState> {
  constructor(initialState?: Partial<MessageState>) {
    super({
      messageIds: [],
      messages: [],
      ...initialState,
    });
  }

  createMessage(message: Message) {
    const { id } = message;
    this.setState((draft) => {
      draft.messageIds.push(id);
      draft.messages.push(message);
    });
  }

  createMultiMessages(messages: Message[]) {
    this.setState((draft) => {
      messages.forEach((msg) => {
        draft.messageIds.push(msg.id);
      });
      draft.messages.push(...messages);
    });
  }

  appendContent(messageId: string, processedContent: AIMessageContent) {
    this.setState((draft) => {
      const message = draft.messages.find((m) => m.id === messageId);
      if (!message || !isAIMessage(message)) return;

      message.status = 'streaming';
      // 总是操作最后一个内容块
      const lastContent = message.content[message.content.length - 1];

      if (lastContent?.type === processedContent.type) {
        // 合并到最后一个同类型内容块
        message.content[message.content.length - 1] = processedContent;
      } else {
        // 添加新内容块
        message.content.push(processedContent);
      }

      this.updateMessageStatusByContent(message);
    });
  }

  // 更新消息整体状态
  setMessageStatus(messageId: string, status: Message['status']) {
    this.setState((draft) => {
      const message = draft.messages.find((m) => m.id === messageId);
      if (message) {
        message.status = status;
        message.content.forEach((content) => {
          content.status = status;
        });
      }
    });
  }

  clearHistory() {
    this.setState((draft) => {
      draft.messageIds = [];
      draft.messages = [];
    });
  }

  // 删除指定消息
  removeMessage(messageId: string) {
    this.setState((draft) => {
      // 从ID列表删除
      const idIndex = draft.messageIds.indexOf(messageId);
      if (idIndex !== -1) {
        draft.messageIds.splice(idIndex, 1);
      }

      // 从消息列表删除
      draft.messages = draft.messages.filter((msg) => msg.id !== messageId);
    });
  }

  // 创建消息分支（用于保留历史版本）
  createMessageBranch(messageId: string) {
    const original = this.getState().messages.find((m) => m.id === messageId);
    if (!original) return;

    // 克隆消息并生成新ID
    const branchedMessage = {
      ...original,
      content: original.content.map((c) => ({ ...c })),
    };

    this.createMessage(branchedMessage);
  }

  get currentMessage(): Message {
    const { messages } = this.getState();
    return messages.at(-1);
  }

  get lastAIMessage(): AIMessage | undefined {
    const { messages } = this.getState();
    const aiMessages = messages.filter((msg) => isAIMessage(msg));
    return aiMessages.at(-1);
  }

  get lastUserMessage(): UserMessage | undefined {
    const { messages } = this.getState();
    const userMessages = messages.filter((msg) => isUserMessage(msg));
    return userMessages.at(-1);
  }

  // 更新消息整体状态
  private updateMessageStatusByContent(message: AIMessage) {
    // 优先处理错误状态
    if (message.content.some((c) => c.status === 'error')) {
      message.status = 'error';
      return;
    }

    // 检查是否全部完成
    const allComplete = message.content.every(
      (c) => c.status === 'complete' || c.status === 'stop', // 包含停止状态
    );

    message.status = allComplete ? 'complete' : 'streaming';
  }
}

// 订阅消息列表变化
// useEffect(() => {
//   return service.messageStore.subscribe(state => {
//     setMessages(state.messageIds.map(id => state.messages[id]));
//   }, ['messages']);
// }, []);
