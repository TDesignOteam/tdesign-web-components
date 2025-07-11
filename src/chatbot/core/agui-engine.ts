import { AbstractAgent, HttpAgent } from '@ag-ui/client';
import { BaseEvent } from '@ag-ui/core';
import { Subject } from 'rxjs';

import type { TdAguiServiceConfig } from '../type';
import { TDesignAGUIAdapter } from './agui-adapter';
import { BaseEngine } from './base-engine';
import type {
  AIContentChunkUpdate,
  AIMessage,
  AIMessageContent,
  ChatMessagesData,
  ChatRequestParams,
  UserMessage,
} from './type';

/**
 * 基于AG-UI的聊天引擎
 */
export class AGUIEngine extends BaseEngine {
  private agent: AbstractAgent;

  private adapter = new TDesignAGUIAdapter();

  private destroy$ = new Subject<void>();

  private currentRunSubscription?: any;

  constructor(private config: TdAguiServiceConfig) {
    super();
  }

  /**
   * 初始化引擎
   * 只有在配置发生变化时才重新创建agent
   */
  init(config?: TdAguiServiceConfig, messages: ChatMessagesData[] = []) {
    // 只有当传入新配置且配置确实发生变化时，才重新创建agent
    if (config && this.isConfigChanged(config)) {
      this.config = config;
      this.agent = new HttpAgent({
        url: config.url,
        agentId: config.agentId,
        headers: config.headers || {},
        initialState: config.initialState || {},
      });
    }

    this.setMessages(messages);
  }

  /**
   * 检查配置是否发生变化
   * 避免不必要的agent重新创建
   */
  private isConfigChanged(newConfig: TdAguiServiceConfig): boolean {
    return (
      this.config.url !== newConfig.url ||
      this.config.agentId !== newConfig.agentId ||
      JSON.stringify(this.config.headers) !== JSON.stringify(newConfig.headers) ||
      JSON.stringify(this.config.initialState) !== JSON.stringify(newConfig.initialState)
    );
  }

  /**
   * 发送用户消息
   */
  async sendUserMessage(params: ChatRequestParams): Promise<void> {
    // 添加用户消息
    const userMessage = this.adapter.createUserMessage(params);
    this.addMessage(userMessage);

    // 创建AI响应消息
    const aiMessage = this.adapter.createAIMessage();
    this.addMessage(aiMessage);

    // 设置状态为处理中
    this.setStatus('pending');

    try {
      // 转换为AG-UI请求格式
      const aguiInput = this.adapter.adaptRequestToAGUI(params, this.messages);

      // 开始AG-UI对话
      await this.agent.runAgent(aguiInput, {
        onRunStartedEvent: () => {
          this.setStatus('streaming');
        },

        onTextMessageContentEvent: (params) => {
          this.handleAGUIEvent(params.event, aiMessage.id);
        },

        onToolCallStartEvent: (params) => {
          this.handleAGUIEvent(params.event, aiMessage.id);
        },

        onToolCallResultEvent: (params) => {
          this.handleAGUIEvent(params.event, aiMessage.id);
        },

        onRunFinishedEvent: () => {
          this.finalizeAIMessage(aiMessage.id);
          this.setStatus('complete');
        },

        onRunErrorEvent: (params) => {
          this.handleError(params.event, aiMessage.id);
        },
      });
    } catch (error) {
      this.handleError(error, aiMessage.id);
    }
  }

  /**
   * 处理AG-UI事件
   */
  private handleAGUIEvent(event: BaseEvent, messageId: string) {
    const aiMessage = this.messages.find((m) => m.id === messageId) as AIMessage;
    if (!aiMessage) return;

    const contentUpdate = this.adapter.adaptAGUIEventToTDesign(event);
    if (contentUpdate) {
      this.updateAIMessageContent(aiMessage, contentUpdate);
    }
  }

  /**
   * 更新AI消息内容
   */
  private updateAIMessageContent(aiMessage: AIMessage, update: AIContentChunkUpdate) {
    if (!aiMessage.content) aiMessage.content = [];

    if (update.strategy === 'append') {
      // 添加新的内容块 - 使用MessageStore的appendContent方法
      this.messageStore.appendContent(aiMessage.id, update as AIMessageContent);
    } else {
      // 合并到现有内容块
      const existingContent = aiMessage.content.find((c) => c.type === update.type && c.id === update.id);
      if (existingContent) {
        if (update.type === 'text' || update.type === 'markdown') {
          existingContent.data += update.data;
        } else if (update.type === 'thinking' && existingContent.type === 'thinking') {
          if (update.data.text) {
            existingContent.data.text = (existingContent.data.text || '') + update.data.text;
          }
          if (update.data.title) {
            existingContent.data.title = update.data.title;
          }
        }
        // 使用MessageStore的replaceContent方法来更新
        this.messageStore.replaceContent(aiMessage.id, aiMessage.content);
      } else {
        // 新内容，使用appendContent
        this.messageStore.appendContent(aiMessage.id, update as AIMessageContent);
      }
    }
  }

  /**
   * 完成AI消息
   */
  private finalizeAIMessage(messageId: string) {
    this.messageStore.setMessageStatus(messageId, 'complete');
  }

  /**
   * 处理错误
   */
  private handleError(error: any, messageId: string) {
    // 设置消息状态为错误
    this.messageStore.setMessageStatus(messageId, 'error');

    // 添加错误内容
    this.messageStore.appendContent(messageId, {
      type: 'text',
      data: '抱歉，处理您的请求时出现了错误。',
      status: 'error',
    } as AIMessageContent);

    this.setStatus('error');
  }

  /**
   * 中止当前对话
   */
  async abortChat(): Promise<void> {
    if (this.currentRunSubscription) {
      this.currentRunSubscription.unsubscribe();
      this.currentRunSubscription = null;
    }
    this.agent.abortRun();
    this.setStatus('stop');
  }

  /**
   * 重新生成AI回复
   */
  async regenerateAIMessage(keepVersion = false): Promise<void> {
    // 找到最后一个用户消息，重新发送
    const lastUserMessage = [...this.messages].reverse().find((m) => m.role === 'user') as UserMessage;

    if (lastUserMessage) {
      if (!keepVersion) {
        // 删除最后一个AI回复（向后兼容的findLastIndex实现）
        let lastAIIndex = -1;
        for (let i = this.messages.length - 1; i >= 0; i--) {
          if (this.messages[i].role === 'assistant') {
            lastAIIndex = i;
            break;
          }
        }
        if (lastAIIndex !== -1) {
          const lastAIMessage = this.messages[lastAIIndex];
          this.messageStore.removeMessage(lastAIMessage.id);
        }
      }

      // 重新发送
      const textContent = lastUserMessage.content.find((c) => c.type === 'text');
      const attachmentContent = lastUserMessage.content.find((c) => c.type === 'attachment');

      await this.sendUserMessage({
        prompt: textContent?.data || '',
        attachments: attachmentContent?.data || [],
        messageID: lastUserMessage.id,
      });
    }
  }

  /**
   * 销毁引擎
   */
  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.abortChat();
    super.destroy();
  }
}
