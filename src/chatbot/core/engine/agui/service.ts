import { ConnectionStateManager } from '../../enhanced-server/connection-manager';
import { EnhancedSSEClient } from '../../enhanced-server/sse-client';
import { ChatRequestParams, ChatServiceConfig } from '../../type';
import { EventSchemas, EventType } from './events';
import type { AGUIEventCallbacks,BaseEvent } from './types';

/**
 * AG-UI协议专用服务
 * 复用LLMService的通用功能，扩展AG-UI特定逻辑
 */
export class AGUIAgentServie {
  private sseClient: EnhancedSSEClient | null = null;

  private connectionManager: ConnectionStateManager;

  private eventHandlers: AGUIEventCallbacks;

  constructor(
    private config: ChatServiceConfig,
    eventHandlers: AGUIEventCallbacks,
  ) {
    const connectId = `sse_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    this.connectionManager = new ConnectionStateManager(connectId);
    this.eventHandlers = eventHandlers;
  }

  /**
   * 建立AG-UI协议连接
   */
  async connect(params: ChatRequestParams): Promise<void> {
    // 复用LLMService的连接管理核心
    this.sseClient = new EnhancedSSEClient(this.config.endpoint!, {
      retryConfig: {
        maxRetries: this.config.maxRetries ?? 3,
        baseDelay: this.config.retryInterval ?? 1000,
      },
      // logger: this.config.logger,
    });

    // 设置AG-UI特定事件处理器
    this.sseClient.on('message', (rawEvent) => this.handleRawEvent(rawEvent));
    this.sseClient.on('error', (error) => this.handleError(error));
    this.sseClient.on('stateChange', (state) => this.handleConnectionState(state));

    // 建立连接（复用核心连接逻辑）
    await this.sseClient.connect({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
      body: JSON.stringify({
        agentId: this.config.agui?.agentId,
        threadId: this.config.agui?.threadId,
        prompt: params.prompt,
      }),
    });
  }

  /**
   * 关闭连接（复用核心资源管理）
   */
  async disconnect(): Promise<void> {
    if (this.sseClient) {
      await this.sseClient.close();
      this.sseClient = null;
    }
  }

  /**
   * 处理原始事件（AG-UI协议扩展点）
   */
  private handleRawEvent(rawEvent: any): void {
    try {
      const parsed = EventSchemas.safeParse(rawEvent);
      if (!parsed.success) {
        this.config.logger?.warn('Invalid AG-UI event format', parsed.error);
        return;
      }

      // AG-UI协议特定事件分发
      this.dispatchAGUIEvent(parsed.data);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * AG-UI事件分发器
   */
  private dispatchAGUIEvent(event: BaseEvent): void {
    switch (event.type) {
      case EventType.TEXT_MESSAGE_START:
        this.eventHandlers.onTextMessageStart?.(event.messageId);
        break;
      case EventType.TEXT_MESSAGE_CONTENT:
        this.eventHandlers.onTextMessageContent?.(event.messageId, event.delta);
        break;
      case EventType.TOOL_CALL_START:
        this.eventHandlers.onToolCallStart?.(event.toolCallId, event.toolCallName, event.parentMessageId);
        break;
      // 其他15+事件类型处理...
      case EventType.STATE_SNAPSHOT:
        this.handleStateSnapshot(event.snapshot);
        break;
    }
  }

  /**
   * 处理状态快照（AG-UI特定逻辑）
   */
  private handleStateSnapshot(snapshot: any): void {
    try {
      this.eventHandlers.onStateSnapshot?.(snapshot);
      // 更新本地状态存储
      if (snapshot.messages) {
        this.config.messageStore?.setMessages(snapshot.messages, 'replace');
      }
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * 错误处理（复用核心错误处理）
   */
  private handleError(error: Error): void {
    this.config.logger?.error('AG-UI connection error', error);
    this.eventHandlers.onError?.(error);

    // 复用重试逻辑
    if (this.connectionManager.shouldRetry(error)) {
      this.connectionManager.scheduleRetry(() => this.reconnect());
    }
  }

  /**
   * 连接状态处理（复用核心状态管理）
   */
  private handleConnectionState(state: any): void {
    this.eventHandlers.onConnectionStateChange?.({
      connectionId: this.sseClient?.connectionId || '',
      from: state.from,
      to: state.to,
      timestamp: Date.now(),
    });
  }
}
