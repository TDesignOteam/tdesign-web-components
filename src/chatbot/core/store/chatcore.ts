/* eslint-disable import/export */
/* eslint-disable max-classes-per-file */
import { enablePatches, produceWithPatches } from 'immer';

import { SSEResponse } from '../../mock/sseService';

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'streaming' | 'sent' | 'error';
export type ContentType = 'text' | 'markdown' | 'image' | 'audio' | 'video';
export type AttachmentType = 'file' | 'image' | 'video' | 'audio';
export type MediaFormat = {
  image: 'jpg' | 'png' | 'webp';
  audio: 'mp3' | 'wav' | 'ogg';
  video: 'mp4' | 'mov' | 'avi';
};

// 基础类型
interface BaseContent<T extends ContentType> {
  type: T;
  status: MessageStatus;
}

interface BaseMediaItem<F = string> {
  url: string;
  format?: F;
  duration?: number;
  metadata?: Record<string, any>;
}

// 内容类型
export type TextContent = BaseContent<'text' | 'markdown'> & {
  content: string;
};

export type ImageContent = BaseContent<'image'> & {
  content: (BaseMediaItem<MediaFormat['image']> & {
    source?: string;
    alt?: string;
    resolution?: [number, number];
  })[];
};

export type AudioContent = BaseContent<'audio'> & {
  content: (BaseMediaItem<MediaFormat['audio']> & {
    source?: string;
    sampleRate?: number;
  })[];
};

export type VideoContent = BaseContent<'video'> & {
  content: (BaseMediaItem<MediaFormat['video']> & {
    source?: string;
    poster?: string;
    resolution?: [number, number];
  })[];
};

export type MessageContent = TextContent | ImageContent | AudioContent | VideoContent;

// 公共引用结构
export interface ReferenceItem {
  title: string;
  url?: string;
  detail?: string;
  source?: string;
  timestamp?: string;
}

interface PhaseContent<T = string> {
  status: MessageStatus;
  title?: string;
  content?: T;
}

// 搜索和思考
export type SearchResult = PhaseContent<ReferenceItem[]>;
export type ThinkingContent = PhaseContent<string> & {
  type?: 'text' | 'markdown';
};

// 附件系统
export interface Attachment {
  type: AttachmentType;
  name: string;
  url: string;
  isReference: boolean;
  metadata?: Record<string, any>;
}

// 消息主体
export interface Message extends ChunkParsedResult {
  id: string;
  role: MessageRole;
  status: MessageStatus;
  timestamp?: string;
  main?: MessageContent;
}

// 服务配置
export interface ChunkParsedResult {
  main?: MessageContent;
  search?: SearchResult;
  thinking?: ThinkingContent;
}

export interface RequestParams extends ModelParams {
  prompt: string;
}

export interface LLMConfig {
  endpoint: string;
  stream?: boolean;
  parseRequest?: (params: RequestParams) => RequestInit;
  parseResponse?: (chunk: any) => ChunkParsedResult;
}

// 消息相关状态
export interface MessageState {
  messageIds: string[];
  messages: Record<string, Message>;
}

// 模型服务相关状态
export interface ModelParams {
  model?: string;
  useThink?: boolean;
  useSearch?: boolean;
}

export interface ModelServiceState extends ModelParams {
  config: LLMConfig;
}

// 聚合根状态
export interface ChatState {
  messagesList: MessageState;
  modelService: ModelServiceState;
}

/**
 * 状态订阅者回调函数类型
 * @template T 状态类型
 * @param state 只读的最新状态
 * @param changes 发生变更的路径数组（只读）
 */
export type Subscriber<T> = (state: Readonly<T>, changes: readonly string[]) => void;

// 启用immer的patch支持，用于追踪状态变更路径
enablePatches();

/**
 * 响应式状态管理类，提供高效的状态管理和变更追踪功能
 * @template T 状态对象类型，必须为object类型
 */
export class ReactiveState<T extends object> {
  private currentState: T; // 当前状态（始终为冻结对象）

  private subscribers = new Set<{ handler: Subscriber<T>; paths?: string[] }>(); // 订阅者集合（包含路径过滤条件）

  private pendingChanges: string[] = []; // 待处理的变更路径（自动去重）

  private notificationScheduled = false; // 通知调度锁（防止重复调度）

  private pathSubscribers = new Map<string, Set<{ handler: Subscriber<T> }>>(); // 增加订阅者分组缓存

  /**
   * 初始化响应式状态
   * @param initialState 初始状态（会自动冻结）
   */
  constructor(initialState: T) {
    this.currentState = Object.freeze(initialState);
  }

  /**
   * 更新状态方法
   * @param updater 状态更新函数（使用immer的draft机制）
   * @param paths 可选的手动指定变更路径（自动模式会从immer patches中提取）
   */
  public setState(updater: (draft: T) => void, paths?: string[]): void {
    // 使用produceWithPatches来获取变更路径，生成新状态和变更记录
    const [nextState, patches] = produceWithPatches(this.currentState, updater);

    // 处理变更路径：优先使用手动指定路径，否则从patches中提取
    const changes =
      paths || patches.filter((p) => ['replace', 'add', 'remove'].includes(p.op)).map((p) => p.path.join('.'));

    if (changes.length > 0) {
      this.pendingChanges.push(...changes);
      this.currentState = Object.freeze(nextState) as T;
      this.scheduleNotification();
    }
  }

  /**
   * 获取当前状态
   * @param cloned 是否返回克隆副本（默认false）
   * @returns 当前状态的只读引用或克隆副本
   */
  public getState(cloned = false): Readonly<T> {
    return cloned ? structuredClone(this.currentState) : this.currentState;
  }

  /**
   * 订阅状态变更（支持路径过滤），订阅时维护路径索引
   * @param subscriber 订阅回调函数
   * @param paths 可选的要监听的属性路径数组
   * @returns 取消订阅的函数
   */
  public subscribe(subscriber: Subscriber<T>, paths?: string[]): () => void {
    const subscription = { handler: subscriber, paths };
    this.subscribers.add(subscription);
    // 维护路径索引
    paths?.forEach((path) => {
      if (!this.pathSubscribers.has(path)) {
        this.pathSubscribers.set(path, new Set());
      }
      this.pathSubscribers.get(path)?.add(subscription);
    });

    return () => {
      this.subscribers.delete(subscription);
      paths?.forEach((path) => {
        this.pathSubscribers.get(path)?.delete(subscription);
      });
    };
  }

  /**
   * 调度通知（使用微任务批量处理）
   */
  private scheduleNotification() {
    if (this.notificationScheduled) return;
    this.notificationScheduled = true;

    // 使用微任务进行批处理，确保在同一个事件循环内的多次更新只会触发一次通知
    queueMicrotask(() => {
      // 去重变更路径并重置待处理队列
      const changedPaths = [...new Set(this.pendingChanges)];
      this.pendingChanges = [];
      this.notificationScheduled = false;

      // 冻结状态和路径数组，防止订阅者意外修改
      const frozenState = Object.freeze(this.currentState);
      const frozenPaths = Object.freeze(changedPaths);

      // 安全通知所有订阅者
      this.subscribers.forEach(({ handler, paths }) => {
        try {
          // 如果没有设置监听路径，或变更路径中有匹配项，则触发回调
          if (
            !paths ||
            frozenPaths.some((p) =>
              paths.some((target) => {
                const targetParts = target.split('.');
                const pathParts = p.split('.');
                return targetParts.every((part, i) => pathParts[i] === part);
              }),
            )
          ) {
            handler(frozenState, frozenPaths);
          }
        } catch (error) {
          console.error('Subscriber error:', error);
        }
      });
    });
  }

  /**
   * 调试方法（开发时使用）
   * @param label 调试标签（默认'State'）
   * @returns 当前实例（支持链式调用）
   */
  public debug(label = 'State'): this {
    this.subscribe((state, paths) => {
      console.groupCollapsed(`%c${label} Update`, 'color: #4CAF50; font-weight: bold;');
      console.log('Changed Paths:', paths);
      console.log('New State:', state);
      console.groupEnd();
    });
    return this;
  }
}

// 专注消息生命周期管理
export class MessageStore extends ReactiveState<MessageState> {
  constructor(initialState?: Partial<MessageState>) {
    super({
      messageIds: [],
      messages: {},
      ...initialState,
    });
  }

  createMessage(message: Message) {
    const { id } = message;
    this.setState((draft) => {
      draft.messageIds.push(id);
      draft.messages[id] = {
        ...message,
        id,
      };
    });
  }

  createMultiMessages(messages: Message[]) {
    for (const msg of messages) {
      this.setState((draft) => {
        draft.messageIds.push(msg.id);
        draft.messages[msg.id] = msg;
      });
    }
  }

  appendContent(messageId: string, chunk: ChunkParsedResult) {
    this.setState((draft) => {
      const message = draft.messages[messageId];
      if (!message) return;

      // 合并主内容（文本流式追加）
      if (chunk.main && (chunk.main.type === 'text' || chunk.main.type === 'markdown')) {
        message.main = this.mergeTextContent(message.main as TextContent, chunk.main);
      }

      // 合并思考过程（覆盖更新）
      if (chunk.thinking) {
        message.thinking = this.mergeThinking(message.thinking, chunk.thinking);
      }
    });
  }

  private mergeTextContent(current?: TextContent, incoming?: TextContent): TextContent {
    if (!current || current.type !== incoming?.type) return incoming || current;

    // 文本类型内容追加
    return {
      ...current,
      content: (current.content || '') + (incoming.content || ''),
    };
  }

  private mergeThinking(current?: ThinkingContent, incoming?: ThinkingContent): ThinkingContent {
    return {
      ...current,
      ...incoming,
      content: (current?.content || '') + (incoming?.content || ''),
    };
  }

  updateContent(messageId: string, msg: Partial<Message>) {
    console.log('====updateContent msg', msg?.main?.content);
    this.setState((draft) => {
      const message = draft.messages[messageId];
      draft.messages[messageId] = {
        ...message,
        ...msg,
      };
    });
  }

  setMessageStatus(messageId: string, status: Message['status']) {
    this.setState((draft) => {
      const message = draft.messages[messageId];
      if (message) {
        message.status = status;
      }
    });
  }

  clearHistory() {
    this.setState((draft) => {
      draft.messageIds = [];
      draft.messages = {};
    });
  }
}

// 专注模型状态和运行时管理
export class ModelStore extends ReactiveState<ModelServiceState> {
  constructor(initialState?: ModelServiceState) {
    super(
      initialState || {
        config: {
          endpoint: '',
        },
        useSearch: false,
        useThink: false,
        model: '',
      },
    );
  }

  setCurrentModel(modelName: string) {
    this.setState((draft) => {
      draft.model = modelName;
    });
  }

  setUseThink(use: boolean) {
    this.setState((draft) => {
      draft.useThink = use;
    });
  }

  setUseSearch(use: boolean) {
    this.setState((draft) => {
      draft.useSearch = use;
    });
  }
}

export class ChatEngine {
  constructor(private config: LLMConfig) {
    // 构造函数参数属性初始化
  }

  public createUserMessage(content: string, files?: File[]): Message {
    if (files && files.length > 0) {
      this.createAttachments(files);
    }

    return {
      id: this.generateID(),
      role: 'user',
      status: 'sent',
      timestamp: `${Date.now()}`,
      main: { type: 'text', status: 'sent', content },
    };
  }

  public createAssistantMessage(): Message {
    // 创建初始助手消息
    return {
      id: this.generateID(),
      role: 'assistant',
      status: 'pending',
      timestamp: `${Date.now()}`,
    };
  }

  private generateID() {
    return `msg_${Date.now()}_${Math.floor(Math.random() * 90000) + 10000}`;
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

  public async handleBatchResponse(params: RequestParams) {
    const response = await this.fetchLLMResponse(params);
    const parsed = this.parseChunk(response);
    console.log('===parsed', parsed);
    // this.messageStore.setMessageStatus(messageId, 'sent');
  }

  public async *handleStreamResponse(params: RequestParams) {
    // const llmResponse = await this.fetchLLMResponse(params);
    console.log('===handleStreamResponse content', params);
    const mockSSEResponse = new SSEResponse();
    const response = await mockSSEResponse.getResponse();
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      yield this.processStreamChunk(chunk);
    }
  }

  private processStreamChunk(chunk: string): ChunkParsedResult {
    const parsed = this.parseChunk(chunk);
    // console.log('===parsed content', parsed);
    // 处理搜索阶段
    if (parsed.search) {
      return {
        search: {
          status: 'streaming',
          content: parsed.search.content,
        },
      };
    }
    // 处理思考阶段
    if (parsed.thinking) {
      return {
        search: {
          status: 'sent',
        },
        thinking: {
          title: parsed.thinking?.title || '思考中...',
          status: 'streaming',
          content: parsed.thinking.content,
        },
      };
    }
    // 处理生成阶段
    if (parsed.main && (parsed.main.type === 'text' || parsed.main.type === 'markdown')) {
      return {
        thinking: {
          title: parsed?.thinking?.title || '思考完成',
          status: 'sent',
        },
        main: {
          status: 'streaming',
          content: parsed.main.content,
          type: parsed.main.type,
        },
      };
    }
  }

  private parseChunk(data: any): ChunkParsedResult {
    return this.config?.parseResponse?.(data);
  }

  private async fetchLLMResponse(params: RequestParams) {
    const req = this.config?.parseRequest?.(params);
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...req?.headers,
      },
      body: req?.body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export class ChatService {
  public readonly messageStore: MessageStore;

  public readonly modelStore: ModelStore;

  private engine: ChatEngine;

  private config: LLMConfig;

  constructor(initialModelState: ModelServiceState, initialMessages?: Message[]) {
    this.messageStore = new MessageStore(this.convertMessages(initialMessages));
    this.modelStore = new ModelStore(initialModelState);
    this.config = initialModelState.config;
    this.engine = new ChatEngine(this.config);
  }

  public async sendMessage(input: string, attachments?: File[]) {
    const userMessage = this.engine.createUserMessage(input, attachments);
    const aiMessage = this.engine.createAssistantMessage();
    this.messageStore.createMultiMessages([userMessage, aiMessage]);

    if (this.config.stream) {
      // 处理sse流式响应模式
      const stream = this.engine.handleStreamResponse({
        prompt: input,
      });
      for await (const chunk of stream) {
        this.messageStore.appendContent(aiMessage.id, chunk);
      }
    } else {
      // 处理批量响应模式
      await this.engine.handleBatchResponse({
        prompt: input,
      });
    }
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
}

export interface SSEConnectConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: BodyInit;
}

export class SSEClient {
  private controller: AbortController | null = null;

  private retries = 0;

  private reader: ReadableStreamDefaultReader | null = null;

  constructor(
    private url: string,
    private handlers: {
      onMessage: (data: string) => void;
      onError?: (error: Error) => void;
      onComplete?: () => void;
    },
    private options: {
      headers?: Record<string, string>;
      retryInterval?: number;
      maxRetries?: number;
    } = {},
  ) {
    // 构造函数参数属性初始化
  }

  async connect(config: SSEConnectConfig) {
    try {
      this.controller = new AbortController();

      const response = await fetch(this.url, {
        method: config.method || 'GET',
        headers: {
          'Content-Type': 'text/event-stream',
          ...this.options.headers,
          ...config.headers,
        },
        body: config.body,
        signal: this.controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`SSE连接失败，状态码：${response.status}`);
      }

      this.reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

      // 开始读取流数据
      this.readStream();
    } catch (err) {
      this.handleError(err);
      this.reconnect();
    }
  }

  private async readStream() {
    try {
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await this.reader!.read();
        if (done) {
          this.handlers.onComplete?.();
          return;
        }

        // 解析SSE格式数据
        value.split('\n\n').forEach((chunk) => {
          const data = chunk.split('\n').find((line) => line.startsWith('data: '));
          if (data) {
            this.handlers.onMessage(data.replace('data: ', ''));
          }
        });
      }
    } catch (err) {
      this.handleError(err);
      this.reconnect();
    }
  }

  private handleError(error: unknown) {
    if (error instanceof Error) {
      this.handlers.onError?.(error);
    } else {
      this.handlers.onError?.(new Error('未知的SSE连接错误'));
    }
  }

  private reconnect() {
    if (this.retries < (this.options.maxRetries ?? 3)) {
      setTimeout(() => {
        this.retries += 1;
        this.connect({
          method: 'GET',
          headers: this.options.headers,
        });
      }, this.options.retryInterval ?? 1000);
    }
  }

  close() {
    this.reader?.cancel().catch(() => {});
    this.controller?.abort();
    this.reader = null;
    this.controller = null;
  }
}

// 多模态支持扩展
// 在Processor中增强多模态处理
// processMultimodalContent(content: any) {
//   // 处理图片、音频、视频等多媒体内容
// }

// // 添加上下文管理
// private contextManager = new ContextManager();

// public setContext(context: any) {
//   this.contextManager.set(context);
// }
