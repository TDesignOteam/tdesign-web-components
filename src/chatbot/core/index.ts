import { LLMService } from './server/llmService';
import { MessageStore } from './store/message';
import MessageProcessor from './processor';
import type {
  AIContentChunkUpdate,
  AIMessageContent,
  ChatMessagesData,
  ChatMessageSetterMode,
  ChatRequestParams,
  ChatServiceConfig,
  ChatServiceConfigSetter,
  SSEChunkData,
  SystemMessage,
} from './type';
import { isAIMessage } from './utils';

export interface IChatEngine {
  sendUserMessage(requestParams: ChatRequestParams): Promise<void>;
  abortChat(): Promise<void>;
}

export default class ChatEngine implements IChatEngine {
  public messageStore: MessageStore;

  private processor: MessageProcessor;

  private llmService: LLMService;

  private config: ChatServiceConfig;

  private lastRequestParams: ChatRequestParams | undefined;

  private stopReceive = false;

  constructor() {
    this.llmService = new LLMService();
    this.processor = new MessageProcessor();
    this.messageStore = new MessageStore();
  }

  public init(configSetter: ChatServiceConfigSetter, initialMessages?: ChatMessagesData[]) {
    this.messageStore.initialize(this.convertMessages(initialMessages));
    this.config = typeof configSetter === 'function' ? configSetter() : configSetter || {};
  }

  public async sendUserMessage(requestParams: ChatRequestParams) {
    const { prompt, attachments } = requestParams;
    const userMessage = this.processor.createUserMessage(prompt, attachments);
    const aiMessage = this.processor.createAssistantMessage();
    this.messageStore.createMultiMessages([userMessage, aiMessage]);
    const params = {
      prompt,
      attachments,
      messageID: aiMessage.id,
    };
    this.sendRequest(params);
  }

  public async sendSystemMessage(msg: string) {
    this.messageStore.createMessage({
      role: 'system',
      content: [
        {
          type: 'text',
          data: msg,
        },
      ],
    } as SystemMessage);
  }

  public async abortChat() {
    this.stopReceive = true;
    if (this.config?.onAbort) {
      await this.config.onAbort();
    }
    this.llmService.closeSSE();
  }

  public registerMergeStrategy<T extends AIMessageContent>(
    type: T['type'], // 使用类型中定义的type字段作为参数类型
    handler: (chunk: T, existing?: T) => T,
  ) {
    this.processor.registerHandler(type, handler);
  }

  public setMessages(messages: ChatMessagesData[], mode: ChatMessageSetterMode = 'replace') {
    this.messageStore.setMessages(messages, mode);
  }

  // 用户触发重新生成 -> 检查最后一条AI消息 ->
  // -> keepVersion=false: 删除旧消息 -> 创建新消息 -> 重新请求
  // -> keepVersion=true: 保留旧消息 -> 创建分支消息 -> 重新请求
  public async regenerateAIMessage(keepVersion: boolean = false) {
    const { lastAIMessage, lastUserMessage } = this.messageStore;
    if (!lastAIMessage) return;

    if (!this.lastRequestParams) {
      // 应对历史消息也有重新生成的情况
      const { content, id } = lastUserMessage;
      this.lastRequestParams = {
        prompt: content.filter((c) => c.type === 'text')[0].data,
        attachments: content.filter((c) => c.type === 'attachment')?.[0]?.data,
        messageID: id,
      };
    }
    if (!keepVersion) {
      // 删除最后一条AI消息
      this.messageStore.removeMessage(lastAIMessage.id);
    } else {
      // todo: 保留历史版本，创建新分支
      this.messageStore.createMessageBranch(lastAIMessage.id);
    }

    // 创建新的AI消息
    const newAIMessage = this.processor.createAssistantMessage();
    this.messageStore.createMessage(newAIMessage);

    // 重新发起请求
    const params = {
      ...this.lastRequestParams,
      messageID: newAIMessage.id,
    };

    await this.sendRequest(params);
  }

  private async sendRequest(params: ChatRequestParams) {
    const { messageID: id } = params;
    try {
      if (this.config.stream) {
        // 处理sse流式响应模式
        this.setMessageStatus(id, 'streaming');
        this.stopReceive = false;
        await this.handleStreamRequest(params);
      } else {
        // 处理批量响应模式
        this.setMessageStatus(id, 'pending');
        await this.handleBatchRequest(params);
        this.setMessageStatus(id, 'complete');
      }
      this.lastRequestParams = params;
    } catch (error) {
      this.setMessageStatus(id, 'error');
      throw error;
    }
  }

  private async handleBatchRequest(params: ChatRequestParams) {
    const id = params.messageID;
    this.setMessageStatus(id, 'pending');
    const result = await this.llmService.handleBatchRequest(params, this.config);
    this.messageStore.appendContent(id, result);
    this.setMessageStatus(id, 'complete');
  }

  private async handleStreamRequest(params: ChatRequestParams) {
    const id = params.messageID;
    this.setMessageStatus(id, 'pending');
    await this.llmService.handleStreamRequest(params, {
      ...this.config,
      onMessage: (chunk: SSEChunkData) => {
        if (this.stopReceive) return null;
        const parsed = this.config?.onMessage?.(chunk, this.messageStore.getMessageByID(id));
        if (Array.isArray(parsed)) {
          // 整体替换message中的content
          this.messageStore.replaceContent(id, parsed);
        } else if (parsed) {
          this.processContentUpdate(id, parsed);
        }
        return parsed;
      },
      onError: (error) => {
        this.setMessageStatus(id, 'error');
        this.config.onError?.(error);
      },
      onComplete: (isAborted) => {
        // 所有消息内容块都失败才算消息体失败
        const allContentFailed = this.messageStore.messages.every((content) => content.status === 'error');
        // eslint-disable-next-line no-nested-ternary
        this.setMessageStatus(id, isAborted ? 'stop' : allContentFailed ? 'error' : 'complete');
        this.config.onComplete?.(isAborted, params);
      },
    });
  }

  private convertMessages(messages?: ChatMessagesData[]) {
    if (!messages) return { messageIds: [], messages: [] };

    return {
      messageIds: messages.map((msg) => msg.id),
      messages,
    };
  }

  private setMessageStatus(messageId: string, status: ChatMessagesData['status']) {
    this.messageStore.setMessageStatus(messageId, status);
  }

  // 处理内容更新逻辑
  private processContentUpdate(messageId: string, rawChunk: AIContentChunkUpdate) {
    const message = this.messageStore.getState().messages.find((m) => m.id === messageId);
    if (!message || !isAIMessage(message)) return;

    //  // 只需要处理最后一个内容快
    //  const lastContent = message.content.at(-1);
    //  const processed = this.processor.processContentUpdate(lastContent, rawChunk);
    //  this.messageStore.appendContent(messageId, processed);

    let targetIndex;
    // 作为新的内容块追加
    if (rawChunk?.strategy === 'append') {
      targetIndex = -1;
    } else {
      // 合并/替换到现有同类型内容中
      targetIndex = message.content.findLastIndex((content) => content.type === rawChunk.type);
    }

    const processed = this.processor.processContentUpdate(
      targetIndex !== -1 ? message.content[targetIndex] : undefined,
      rawChunk,
    );

    this.messageStore.appendContent(messageId, processed, targetIndex);
  }
}

export * from './utils';
