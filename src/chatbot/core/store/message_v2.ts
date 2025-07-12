import { BehaviorSubject, distinctUntilChanged, map, Observable, shareReplay } from 'rxjs';

import type {
  AIMessage,
  AIMessageContent,
  ChatMessagesData,
  ChatMessageSetterMode,
  ChatMessageStatus,
  ChatMessageStore,
  UserMessage,
} from '../type';
import { isAIMessage, isUserMessage } from '../utils';

/**
 * 基于RxJS Observable的消息存储类
 * 提供响应式消息管理和强大的组合性
 */
export class MessageStore {
  // 使用BehaviorSubject作为核心状态存储
  private state$ = new BehaviorSubject<ChatMessageStore>({
    messageIds: [],
    messages: [],
  });

  // 缓存的Observable流，避免重复创建
  private messages$: Observable<ChatMessagesData[]>;

  private messageIds$: Observable<string[]>;

  private lastMessage$: Observable<ChatMessagesData | undefined>;

  private lastAIMessage$: Observable<AIMessage | undefined>;

  private lastUserMessage$: Observable<UserMessage | undefined>;

  constructor(initialState?: Partial<ChatMessageStore>) {
    if (initialState) {
      this.initialize(initialState);
    }

    // 预创建常用的Observable流，使用shareReplay避免重复计算
    this.messages$ = this.state$.pipe(
      map((state) => state.messages),
      distinctUntilChanged((prev, curr) => prev.length === curr.length && prev.every((msg, i) => msg === curr[i])),
      shareReplay(1),
    );

    this.messageIds$ = this.state$.pipe(
      map((state) => state.messageIds),
      distinctUntilChanged((prev, curr) => prev.length === curr.length && prev.every((id, i) => id === curr[i])),
      shareReplay(1),
    );

    this.lastMessage$ = this.messages$.pipe(
      map((messages) => messages[messages.length - 1]),
      distinctUntilChanged(),
      shareReplay(1),
    );

    this.lastAIMessage$ = this.messages$.pipe(
      map((messages) => {
        const aiMessages = messages.filter((msg) => isAIMessage(msg));
        return aiMessages[aiMessages.length - 1];
      }),
      distinctUntilChanged(),
      shareReplay(1),
    );

    this.lastUserMessage$ = this.messages$.pipe(
      map((messages) => {
        const userMessages = messages.filter((msg) => isUserMessage(msg));
        return userMessages[userMessages.length - 1];
      }),
      distinctUntilChanged(),
      shareReplay(1),
    );
  }

  /**
   * 初始化状态
   */
  initialize(initialState: Partial<ChatMessageStore>) {
    const newState = {
      messageIds: [],
      messages: [],
      ...initialState,
    };
    this.state$.next(newState);
  }

  /**
   * 获取所有消息的Observable流
   */
  getMessages$(): Observable<ChatMessagesData[]> {
    return this.messages$;
  }

  /**
   * 获取消息ID列表的Observable流
   */
  getMessageIds$(): Observable<string[]> {
    return this.messageIds$;
  }

  /**
   * 获取最后一条消息的Observable流
   */
  getLastMessage$(): Observable<ChatMessagesData | undefined> {
    return this.lastMessage$;
  }

  /**
   * 获取最后一条AI消息的Observable流
   */
  getLastAIMessage$(): Observable<AIMessage | undefined> {
    return this.lastAIMessage$;
  }

  /**
   * 获取最后一条用户消息的Observable流
   */
  getLastUserMessage$(): Observable<UserMessage | undefined> {
    return this.lastUserMessage$;
  }

  /**
   * 通用的状态更新方法
   */
  private updateState(updater: (state: ChatMessageStore) => ChatMessageStore) {
    const currentState = this.state$.value;
    const newState = updater(currentState);
    this.state$.next(newState);
  }

  /**
   * 创建新消息
   */
  createMessage(message: ChatMessagesData) {
    this.updateState((state) => ({
      ...state,
      messageIds: [...state.messageIds, message.id],
      messages: [...state.messages, message],
    }));
  }

  /**
   * 批量创建消息
   */
  createMultiMessages(messages: ChatMessagesData[]) {
    this.updateState((state) => ({
      ...state,
      messageIds: [...state.messageIds, ...messages.map((msg) => msg.id)],
      messages: [...state.messages, ...messages],
    }));
  }

  /**
   * 设置消息列表
   */
  setMessages(messages: ChatMessagesData[], mode: ChatMessageSetterMode = 'replace') {
    this.updateState((state) => {
      switch (mode) {
        case 'replace':
          return {
            messageIds: messages.map((msg) => msg.id),
            messages: [...messages],
          };
        case 'prepend':
          return {
            messageIds: [...messages.map((msg) => msg.id), ...state.messageIds],
            messages: [...messages, ...state.messages],
          };
        case 'append':
        default:
          return {
            messageIds: [...state.messageIds, ...messages.map((msg) => msg.id)],
            messages: [...state.messages, ...messages],
          };
      }
    });
  }

  /**
   * 追加内容到指定消息
   */
  appendContent(messageId: string, processedContent: AIMessageContent, targetIndex: number = -1) {
    this.updateState((state) => {
      const messageIndex = state.messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return state;

      const message = state.messages[messageIndex];
      if (!isAIMessage(message)) return state;

      const updatedMessage = { ...message };
      if (targetIndex >= 0 && targetIndex < message.content.length) {
        updatedMessage.content = [...message.content];
        updatedMessage.content[targetIndex] = processedContent;
      } else {
        updatedMessage.content = [...message.content, processedContent];
      }

      this.updateMessageStatusByContent(updatedMessage);

      const newMessages = [...state.messages];
      newMessages[messageIndex] = updatedMessage;

      return {
        ...state,
        messages: newMessages,
      };
    });
  }

  /**
   * 替换消息内容
   */
  replaceContent(messageId: string, processedContent: AIMessageContent[]) {
    this.updateState((state) => {
      const messageIndex = state.messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return state;

      const message = state.messages[messageIndex];
      if (!isAIMessage(message)) return state;

      const updatedMessage = { ...message, content: processedContent };
      const newMessages = [...state.messages];
      newMessages[messageIndex] = updatedMessage;

      return {
        ...state,
        messages: newMessages,
      };
    });
  }

  /**
   * 设置消息状态
   */
  setMessageStatus(messageId: string, status: ChatMessagesData['status']) {
    this.updateState((state) => {
      const messageIndex = state.messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return state;

      const message = state.messages[messageIndex];
      const updatedMessage = { ...message, status };

      if (isAIMessage(updatedMessage) && updatedMessage.content.length > 0) {
        updatedMessage.content = [...updatedMessage.content];
        const lastContentIndex = updatedMessage.content.length - 1;
        updatedMessage.content[lastContentIndex] = {
          ...updatedMessage.content[lastContentIndex],
          status,
        };
      }

      const newMessages = [...state.messages];
      newMessages[messageIndex] = updatedMessage;

      return {
        ...state,
        messages: newMessages,
      };
    });
  }

  /**
   * 设置消息扩展属性
   */
  setMessageExt(messageId: string, attr = {}) {
    this.updateState((state) => {
      const messageIndex = state.messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return state;

      const message = state.messages[messageIndex];
      const updatedMessage = {
        ...message,
        ext: { ...message.ext, ...attr },
      };

      const newMessages = [...state.messages];
      newMessages[messageIndex] = updatedMessage;

      return {
        ...state,
        messages: newMessages,
      };
    });
  }

  /**
   * 清空历史消息
   */
  clearHistory() {
    this.updateState(() => ({
      messageIds: [],
      messages: [],
    }));
  }

  /**
   * 删除指定消息
   */
  removeMessage(messageId: string) {
    this.updateState((state) => ({
      messageIds: state.messageIds.filter((id) => id !== messageId),
      messages: state.messages.filter((msg) => msg.id !== messageId),
    }));
  }

  /**
   * 创建消息分支
   */
  createMessageBranch(messageId: string) {
    const currentState = this.state$.value;
    const original = currentState.messages.find((m) => m.id === messageId);
    if (!original) return;

    // 克隆消息并生成新ID
    const branchedMessage = {
      ...original,
      content: original.content.map((c) => ({ ...c })),
    };

    this.createMessage(branchedMessage);
  }

  // Getter方法，同步获取当前值
  get messages(): ChatMessagesData[] {
    return this.state$.value.messages;
  }

  get messageIds(): string[] {
    return this.state$.value.messageIds;
  }

  getMessageByID(id: string): ChatMessagesData | undefined {
    return this.state$.value.messages.find((m) => m.id === id);
  }

  get currentMessage(): ChatMessagesData | undefined {
    const { messages } = this.state$.value;
    return messages[messages.length - 1];
  }

  get lastAIMessage(): AIMessage | undefined {
    const { messages } = this.state$.value;
    const aiMessages = messages.filter((msg) => isAIMessage(msg));
    return aiMessages[aiMessages.length - 1];
  }

  get lastUserMessage(): UserMessage | undefined {
    const { messages } = this.state$.value;
    const userMessages = messages.filter((msg) => isUserMessage(msg));
    return userMessages[userMessages.length - 1];
  }

  /**
   * 兼容性方法：订阅所有变化（类似原ReactiveState的subscribe）
   */
  subscribe(subscriber: (state: ChatMessageStore) => void): () => void {
    const subscription = this.state$.subscribe(subscriber);
    return () => subscription.unsubscribe();
  }

  /**
   * 销毁方法
   */
  destroy() {
    this.state$.complete();
  }

  // 私有辅助方法
  private resolvedStatus(content: AIMessageContent, status: ChatMessageStatus): ChatMessageStatus {
    return typeof content.status === 'function' ? content.status(status) : content.status;
  }

  private updateMessageStatusByContent(message: AIMessage) {
    // 优先处理错误状态
    if (message.content.some((c) => c.status === 'error')) {
      message.status = 'error';
      message.content.forEach((content) => {
        content.status = this.resolvedStatus(content, 'streaming') ? 'stop' : content.status;
      });
      return;
    }

    // 非最后一个内容块如果不是error|stop, 则设为content.status｜complete
    message.content.slice(0, -1).forEach((content) => {
      if (content.status !== 'error' && content.status !== 'stop') {
        content.status = this.resolvedStatus(content, 'complete');
      }
    });

    // 检查是否全部完成
    const allComplete = message.content.every((c) => c.status === 'complete' || c.status === 'stop');

    message.status = allComplete ? 'complete' : 'streaming';
  }
}
