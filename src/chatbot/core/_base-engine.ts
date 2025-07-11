import { BehaviorSubject, Observable } from 'rxjs';

import { MessageStore } from './store/message';
import LLMService from './enhanced-server';
import type { AIMessageContent, ChatMessagesData, ChatMessageSetterMode, ChatRequestParams, ChatStatus } from './type';

/**
 * 统一的引擎接口
 */
export interface IUnifiedEngine {
  init(config?: any, messages?: ChatMessagesData[]): void;
  sendUserMessage(params: ChatRequestParams): Promise<void>;
  regenerateAIMessage(keepVersion?: boolean): Promise<void>;
  abortChat(): Promise<void>;
  setMessages(messages: ChatMessagesData[], mode?: ChatMessageSetterMode): void;
  clearMessages(): void;
  registerMergeStrategy<T extends AIMessageContent>(type: T['type'], handler: (chunk: T, existing?: T) => T): void;

  // Observable 接口
  getMessages$(): Observable<ChatMessagesData[]>;
  getStatus$(): Observable<ChatStatus>;

  // 属性访问
  get messages(): ChatMessagesData[];
  get status(): ChatStatus;
  get messageStore(): MessageStore;

  // 销毁
  destroy(): void;
}

/**
 * 引擎基类 - 提供通用功能实现
 */
export abstract class BaseEngine implements IUnifiedEngine {
  public messageStore: MessageStore;

  protected llmService: LLMService;

  protected status$ = new BehaviorSubject<ChatStatus>('idle');

  protected mergeStrategies: Map<string, (chunk: any, existing?: any) => any> = new Map();

  constructor() {
    // 初始化MessageStore和LLMService
    this.messageStore = new MessageStore();
    this.llmService = new LLMService();

    // 初始化通用合并策略
    this.initDefaultMergeStrategies();
  }

  /**
   * 初始化默认合并策略
   */
  private initDefaultMergeStrategies() {
    // 默认策略：直接替换
    // 子类可以通过 registerMergeStrategy 注册自定义策略
  }

  /**
   * 初始化引擎 - 子类需要实现具体逻辑
   */
  abstract init(config?: any, messages?: ChatMessagesData[]): void;

  /**
   * 发送用户消息 - 子类需要实现具体逻辑
   */
  abstract sendUserMessage(params: ChatRequestParams): Promise<void>;

  /**
   * 重新生成AI回复 - 子类需要实现具体逻辑
   */
  abstract regenerateAIMessage(keepVersion?: boolean): Promise<void>;

  /**
   * 中止聊天 - 子类需要实现具体逻辑
   */
  abstract abortChat(): Promise<void>;

  /**
   * 设置消息
   */
  setMessages(messages: ChatMessagesData[], mode: ChatMessageSetterMode = 'replace') {
    this.messageStore.setMessages(messages, mode);
  }

  /**
   * 清空消息
   */
  clearMessages() {
    this.messageStore.clearHistory();
  }

  /**
   * 注册合并策略
   */
  registerMergeStrategy<T extends AIMessageContent>(type: T['type'], handler: (chunk: T, existing?: T) => T): void {
    this.mergeStrategies.set(type, handler);
  }

  /**
   * 应用合并策略
   */
  protected applyMergeStrategy<T extends AIMessageContent>(chunk: T, existing?: T): T {
    const strategy = this.mergeStrategies.get(chunk.type);
    if (strategy) {
      return strategy(chunk, existing);
    }
    // 默认策略：替换
    return chunk;
  }

  /**
   * 获取LLM服务实例
   */
  protected getLLMService(): LLMService {
    return this.llmService;
  }

  /**
   * 关闭SSE连接
   */
  protected closeSSE(): void {
    this.llmService.closeSSE();
  }

  /**
   * 添加消息到存储
   */
  protected addMessage(message: ChatMessagesData) {
    this.messageStore.createMessage(message);
  }

  /**
   * 更新消息
   */
  protected updateMessage(messageId: string, updater: (message: ChatMessagesData) => void) {
    const message = this.messageStore.getMessageByID(messageId);
    if (message) {
      updater(message);
      // MessageStore的响应式特性会自动处理更新通知
    }
  }

  /**
   * 设置状态
   */
  protected setStatus(status: ChatStatus) {
    this.status$.next(status);
  }

  /**
   * 获取消息Observable
   */
  getMessages$(): Observable<ChatMessagesData[]> {
    // 从MessageStore获取响应式消息流
    return new Observable<ChatMessagesData[]>((subscriber) => {
      // 立即发送当前消息
      subscriber.next(this.messageStore.messages);

      // 订阅MessageStore的变化
      const unsubscribe = this.messageStore.subscribe((state) => {
        subscriber.next(state.messages);
      });

      // 清理函数
      return () => {
        unsubscribe();
      };
    });
  }

  /**
   * 获取状态Observable
   */
  getStatus$(): Observable<ChatStatus> {
    return this.status$.asObservable();
  }

  /**
   * 获取当前消息
   */
  get messages(): ChatMessagesData[] {
    return this.messageStore.messages;
  }

  /**
   * 获取当前状态
   */
  get status(): ChatStatus {
    return this.status$.value;
  }

  /**
   * 销毁引擎
   */
  destroy() {
    this.status$.complete();
    this.mergeStrategies.clear();
    // MessageStore有自己的销毁机制，如果需要的话
  }
}
