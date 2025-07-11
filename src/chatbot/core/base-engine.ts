import { BehaviorSubject, Observable } from 'rxjs';

import { MessageStore } from './store/message';
import { EnhancedLLMService } from './enhanced-server';
import type { AIMessageContent, ChatMessagesData, ChatMessageSetterMode, ChatRequestParams, ChatStatus } from './type';

/**
 * 统一的引擎接口（基于Observable）
 */
export interface IChatEngine {
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
 * 基于Observable的引擎基类
 */
export abstract class BaseEngine implements IChatEngine {
  public messageStore: MessageStore;

  protected llmService: EnhancedLLMService;

  protected status$ = new BehaviorSubject<ChatStatus>('idle');

  protected mergeStrategies: Map<string, (chunk: any, existing?: any) => any> = new Map();

  constructor() {
    // 初始化Observable版本的MessageStore
    this.messageStore = new MessageStore();
    this.llmService = new EnhancedLLMService();

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
  protected getLLMService(): EnhancedLLMService {
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
      // 这里需要触发更新，但Observable版本需要重新设计这部分
      // 建议直接使用MessageStore的方法来更新
    }
  }

  /**
   * 设置状态
   */
  protected setStatus(status: ChatStatus) {
    this.status$.next(status);
  }

  /**
   * 获取消息Observable - 直接从MessageStore获取
   */
  getMessages$(): Observable<ChatMessagesData[]> {
    return this.messageStore.getMessages$();
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
    this.messageStore.destroy();
    this.mergeStrategies.clear();
  }
}
