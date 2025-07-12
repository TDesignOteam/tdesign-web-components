import type { AIMessageContent, ChatRequestParams, ChatServiceConfig, SSEChunkData } from '../type';
import { ConnectionStateManager } from './connection-manager';
import { ConnectionError, ValidationError } from './errors';
import { EnhancedSSEClient } from './sse-client';
import { ConsoleLogger, Logger } from './types';

// 与原有接口保持兼容
export interface ILLMService {
  /**
   * 处理批量请求（非流式）
   */
  handleBatchRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<AIMessageContent>;

  /**
   * 处理流式请求
   */
  handleStreamRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<void>;
}

/**
 * Enhanced LLM Service with retry logic, error handling, and connection management
 * 保持与原有 LLMService 接口完全兼容
 */
export class LLMService implements ILLMService {
  private currentConnection?: {
    client: EnhancedSSEClient;
    stateManager: ConnectionStateManager;
    connectionId: string;
  };

  private isDestroyed = false;

  private logger: Logger;

  constructor(logger: Logger = new ConsoleLogger()) {
    this.logger = logger;
    this.logger.info('Enhanced LLM Service initialized');
  }

  /**
   * 处理批量请求（非流式）- 保持原有接口
   */
  async handleBatchRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<AIMessageContent> {
    this.validateService();
    this.validateBatchConfig(config);

    const requestConfig = await this.prepareRequest(params, config);

    try {
      this.logger.debug('Starting batch request:', { endpoint: config.endpoint });

      const response = await fetch(config.endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...requestConfig.headers,
        },
        body: requestConfig.body,
      });

      if (!response.ok) {
        throw new ConnectionError(`HTTP ${response.status}: ${response.statusText}`, response.status, {
          endpoint: config.endpoint,
          params,
        });
      }

      const data = await response.json();

      // 调用完成回调
      config.onComplete?.(false, requestConfig, data);

      return data;
    } catch (error) {
      this.logger.error('Batch request failed:', error);
      config.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * 处理流式请求 - 保持原有接口
   */
  async handleStreamRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<void> {
    this.validateService();
    this.validateStreamConfig(config);

    // 如果有现有连接，先关闭它
    if (this.currentConnection) {
      await this.closeCurrentConnection();
    }

    const requestConfig = await this.prepareRequest(params, config);
    const connectionId = this.generateConnectionId();

    try {
      // 创建新的连接和状态管理器
      const stateManager = new ConnectionStateManager(connectionId, this.logger);

      const client = new EnhancedSSEClient(config.endpoint!, {
        retryConfig: {
          maxRetries: config.maxRetries ?? 3,
          baseDelay: config.retryInterval ?? 1000,
          maxDelay: 30000,
          backoffFactor: 2,
          retryableErrors: this.isRetryableError,
        },
        logger: this.logger,
        enableHeartbeat: true,
      });

      // 记录当前连接
      this.currentConnection = { client, stateManager, connectionId };

      // 设置事件监听器
      this.setupClientEventHandlers(client, stateManager, config, requestConfig);

      // 开始连接
      await client.connect({
        ...requestConfig,
        timeout: (config as any).timeout ?? 30000,
        heartbeatInterval: 10000,
        validateResponse: (response) => {
          const contentType = response.headers.get('content-type');
          return response.ok && (contentType?.includes('text/event-stream') ?? false);
        },
      });
    } catch (error) {
      // 清理失败的连接
      this.currentConnection = undefined;
      this.logger.error(`Stream request failed for ${connectionId}:`, error);
      throw error;
    }
  }

  /**
   * 关闭 SSE 连接 - 保持原有接口
   */
  closeSSE(): void {
    this.logger.info('Closing SSE connection');
    if (this.currentConnection) {
      this.closeCurrentConnection();
    }
  }

  /**
   * 获取连接统计
   */
  getStats() {
    return this.currentConnection?.stateManager.getStats() ?? null;
  }

  /**
   * 获取当前连接信息
   */
  getCurrentConnection(): { id: string; status: string; info: any } | null {
    if (!this.currentConnection) return null;

    return {
      id: this.currentConnection.connectionId,
      status: this.currentConnection.client.getStatus(),
      info: this.currentConnection.client.getInfo(),
    };
  }

  /**
   * 销毁服务
   */
  async destroy(): Promise<void> {
    this.isDestroyed = true;

    // 关闭当前连接
    if (this.currentConnection) {
      await this.closeCurrentConnection();
    }

    this.logger.info('Enhanced LLM Service destroyed');
  }

  /**
   * 设置客户端事件处理器
   */
  private setupClientEventHandlers(
    client: EnhancedSSEClient,
    stateManager: ConnectionStateManager,
    config: ChatServiceConfig,
    requestConfig: RequestInit,
  ): void {
    // 消息处理
    client.on('message', (data: SSEChunkData) => {
      try {
        if (!this.isDestroyed) {
          config.onMessage?.(data);
        }
      } catch (error) {
        this.logger.error(`Message handler error for ${stateManager}:`, error);
      }
    });

    // 错误处理
    client.on('error', (error: Error) => {
      stateManager.updateState(client.getStatus(), error);

      // 确保所有错误都通过 config.onError 传递
      if (!this.isDestroyed && config.onError) {
        try {
          this.logger.debug(`Calling config.onError for ${stateManager}:`, error.message);
          config.onError(error);
        } catch (handlerError) {
          this.logger.error(`Error handler failed for ${stateManager}:`, handlerError);
        }
      } else {
        // 如果没有错误处理器，至少记录错误
        this.logger.error(`Unhandled error for ${stateManager}:`, error);
      }
    });

    // === 连接层事件处理（技术层面）===

    // 心跳检测
    client.on('heartbeat', (event: { connectionId: string; timestamp: number }) => {
      try {
        if (!this.isDestroyed && config.connection?.onHeartbeat) {
          config.connection.onHeartbeat(event);
        }
      } catch (error) {
        this.logger.error(`Connection heartbeat handler error:`, error);
      }
    });

    // 连接状态变化
    client.on('stateChange', (event: { connectionId: string; from: string; to: string; timestamp: number }) => {
      try {
        if (!this.isDestroyed && config.connection?.onConnectionStateChange) {
          config.connection.onConnectionStateChange(event);
        }
      } catch (error) {
        this.logger.error(`Connection state change handler error:`, error);
      }
    });

    // 连接建立成功
    client.on('connected', () => {
      stateManager.updateState(client.getStatus());
      stateManager.resetRetryCount();

      try {
        if (!this.isDestroyed && config.connection?.onConnectionEstablished) {
          config.connection.onConnectionEstablished(client.connectionId);
        }
      } catch (error) {
        this.logger.error(`Connection established handler error:`, error);
      }
    });

    // 连接断开
    client.on('disconnected', () => {
      stateManager.updateState(client.getStatus());

      try {
        if (!this.isDestroyed && config.connection?.onConnectionLost) {
          config.connection.onConnectionLost(client.connectionId);
        }
      } catch (error) {
        this.logger.error(`Connection lost handler error:`, error);
      }
    });

    // === 业务层事件处理 ===

    // 流数据接收完成 -> 触发业务层的对话完成
    client.on('end', () => {
      this.logger.info(`Stream completed normally for connection ${stateManager}`);

      // 这是业务层面的对话完成，不是连接层面的事件
      config.onComplete?.(false, requestConfig, null);
    });
  }

  /**
   * 关闭当前连接
   */
  private async closeCurrentConnection(): Promise<void> {
    if (this.currentConnection) {
      try {
        await this.currentConnection.client.abort();
        this.currentConnection.stateManager.cleanup();
      } catch (error) {
        this.logger.error('Error closing connection:', error);
      } finally {
        this.currentConnection = undefined;
      }
    }
  }

  /**
   * 准备请求配置
   */
  private async prepareRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<RequestInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
    };

    // 允许config通过onRequest回调自定义请求配置
    if (config.onRequest) {
      const customConfig = await config.onRequest(params);
      return {
        method: 'POST',
        headers: {
          ...headers,
          ...customConfig.headers,
        },
        body: JSON.stringify(params),
        ...customConfig,
      };
    }

    return {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    };
  }

  /**
   * 判断错误是否可重试
   */
  private isRetryableError = (error: Error): boolean => {
    // 检查错误是否有 isRetryable 属性
    if ('isRetryable' in error && typeof error.isRetryable === 'boolean') {
      return error.isRetryable;
    }

    // 网络错误通常可以重试
    if (error.name === 'TypeError' || error.name === 'NetworkError') {
      return true;
    }

    // 超时错误可以重试
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return true;
    }

    // 连接被重置可以重试
    if (error.message.includes('connection reset') || error.message.includes('ECONNRESET')) {
      return true;
    }

    // 其他错误不重试
    return false;
  };

  /**
   * 验证服务状态
   */
  private validateService(): void {
    if (this.isDestroyed) {
      throw new ValidationError('LLM Service has been destroyed');
    }
  }

  /**
   * 验证批量请求配置
   */
  private validateBatchConfig(config: ChatServiceConfig): void {
    if (!config.endpoint) {
      throw new ValidationError('Endpoint is required for batch requests');
    }
  }

  /**
   * 验证流式请求配置
   */
  private validateStreamConfig(config: ChatServiceConfig): void {
    if (!config.endpoint) {
      throw new ValidationError('Endpoint is required for stream requests');
    }
    if (!config.onMessage) {
      throw new ValidationError('onMessage callback is required for stream requests');
    }
  }

  /**
   * 生成连接ID
   */
  private generateConnectionId(): string {
    return `sse_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}
