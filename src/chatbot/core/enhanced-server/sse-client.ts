/* eslint-disable no-await-in-loop, max-classes-per-file */
import EventEmitter from '../utils/eventEmitter';
import { ConnectionManager } from './connection-manager';
import { ConnectionError, ValidationError } from './errors';
import {
  ConnectionInfo,
  ConsoleLogger,
  DEFAULT_SSE_CONFIG,
  Logger,
  SSEClientConfig,
  SSEClientOptions,
  SSEConnectionState,
  StateChangeEvent,
} from './types';

/**
 * Enhanced SSE Client with comprehensive error handling, retry logic, and resource management
 */
export class EnhancedSSEClient extends EventEmitter {
  public readonly connectionId: string;

  private state = SSEConnectionState.DISCONNECTED;

  private controller?: AbortController;

  private reader?: ReadableStreamDefaultReader<string>;

  private connectionManager: ConnectionManager;

  private eventBuffer = '';

  private currentEvent: { event?: string; data?: string; id?: string } = {};

  private heartbeatTimer?: ReturnType<typeof setInterval>;

  private timeoutTimer?: ReturnType<typeof setTimeout>;

  private config: SSEClientConfig;

  private options: SSEClientOptions;

  private logger: Logger;

  private url: string;

  private connectionInfo: ConnectionInfo;

  constructor(url: string, options: SSEClientOptions = {}) {
    super();
    this.url = url;
    this.options = options;
    this.connectionId = this.generateConnectionId();
    this.logger = options.logger || new ConsoleLogger();
    this.connectionManager = new ConnectionManager(this.connectionId, options.retryConfig, this.logger);

    this.connectionInfo = {
      id: this.connectionId,
      url,
      state: this.state,
      createdAt: Date.now(),
      retryCount: 0,
    };

    this.setupInternalEventHandlers();
  }

  /**
   * 连接 SSE 服务
   */
  async connect(config: SSEClientConfig): Promise<void> {
    this.validateConfig(config);

    if (this.state === SSEConnectionState.CONNECTED || this.state === SSEConnectionState.CONNECTING) {
      throw new ValidationError(`无法连接，当前状态: ${this.state}`);
    }

    this.config = {
      ...DEFAULT_SSE_CONFIG,
      ...config,
      headers: {
        ...DEFAULT_SSE_CONFIG.headers,
        ...config.headers,
      },
      // 确保必需的属性有默认值
      timeout: config.timeout ?? DEFAULT_SSE_CONFIG.timeout ?? 30000,
      heartbeatInterval: config.heartbeatInterval ?? DEFAULT_SSE_CONFIG.heartbeatInterval ?? 10000,
    };
    await this.setState(SSEConnectionState.CONNECTING);
    this.connectionManager.startConnection();

    try {
      await this.establishConnection();
      await this.setState(SSEConnectionState.CONNECTED);
      this.connectionManager.onConnectionSuccess();
      this.startHeartbeat();
      await this.readStream();
    } catch (error) {
      await this.setState(SSEConnectionState.ERROR);
      await this.handleConnectionError(error as Error);
    }
  }

  /**
   * 关闭连接
   */
  async abort(): Promise<void> {
    if (this.state === SSEConnectionState.DISCONNECTED || this.state === SSEConnectionState.CLOSING) {
      return;
    }

    await this.setState(SSEConnectionState.CLOSING);

    try {
      this.stopHeartbeat();
      this.clearTimeouts();

      if (this.reader) {
        await this.reader.cancel();
        this.reader = undefined;
      }

      if (this.controller && !this.controller.signal.aborted) {
        this.controller.abort();
      }

      this.connectionManager.cleanup();
      this.resetParser();
      this.emit('complete', true);
    } finally {
      await this.setState(SSEConnectionState.CLOSED);
    }
  }

  /**
   * 获取连接状态
   */
  getStatus(): SSEConnectionState {
    return this.state;
  }

  /**
   * 获取连接信息
   */
  getInfo(): ConnectionInfo {
    return {
      ...this.connectionInfo,
      ...this.connectionManager.getConnectionInfo(),
    };
  }

  /**
   * 建立连接
   */
  private async establishConnection(): Promise<void> {
    this.controller = new AbortController();

    // 设置超时
    if (this.config.timeout && this.config.timeout > 0) {
      this.timeoutTimer = setTimeout(() => {
        if (!this.controller?.signal.aborted) {
          this.controller?.abort();
        }
      }, this.config.timeout);
    }

    const response = await fetch(this.url, {
      ...this.config,
      signal: this.controller.signal,
      headers: {
        ...this.config.headers,
        Accept: 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });

    this.clearTimeouts();

    if (!response.ok) {
      throw new ConnectionError(`HTTP ${response.status}: ${response.statusText}`, response.status, {
        url: this.url,
        headers: response.headers,
      });
    }

    // 验证响应
    if (this.config.validateResponse && !this.config.validateResponse(response)) {
      throw new ValidationError('响应验证失败', {
        contentType: response.headers.get('content-type'),
        status: response.status,
      });
    }

    if (!response.body) {
      throw new ConnectionError('响应体为空');
    }

    this.reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  }

  /**
   * 读取流数据
   */
  private async readStream(): Promise<void> {
    try {
      while (this.state === SSEConnectionState.CONNECTED && this.reader) {
        const { done, value } = await this.reader.read();

        if (done) {
          this.logger.info(`Connection ${this.connectionId} stream ended normally`);
          this.emit('end'); // 发出流结束事件
          this.emit('complete', false);
          await this.setState(SSEConnectionState.DISCONNECTED);

          // 流正常结束，不需要重连
          // 只有在真正的连接错误时才会重连
          return;
        }

        // 更新活动时间
        this.connectionInfo.lastActivity = Date.now();

        // 直接解析SSE数据
        this.parseSSEData(value);
      }
    } catch (error) {
      if (!this.controller?.signal.aborted) {
        this.logger.error(`Stream reading error for ${this.connectionId}:`, error);
        await this.handleConnectionError(error as Error);
      } else {
        this.logger.debug(`Stream reading stopped for ${this.connectionId} (aborted)`);
      }
    }
  }

  /**
   * 处理连接错误
   */
  private async handleConnectionError(error: Error): Promise<void> {
    this.connectionInfo.error = error;

    // 先emit当前错误
    this.emit('error', error);

    try {
      const finalError = await this.connectionManager.handleConnectionError(
        error,
        () => this.reconnect(),
        (finalErr) => {
          // 最终错误回调：确保在异步上下文中也能正确传递错误
          this.logger.info(`Final error callback triggered for ${this.connectionId}:`, finalErr.message);
          this.emit('error', finalErr);
          this.setState(SSEConnectionState.ERROR).catch((setStateError) => {
            this.logger.error('Failed to set error state:', setStateError);
          });
        },
      );

      if (finalError) {
        // 同步返回的最终错误也要处理
        this.emit('error', finalError);
        await this.setState(SSEConnectionState.ERROR);
      }
      // 如果返回 null，表示正在重试，不需要额外处理
    } catch (retryError) {
      // 重试过程中发生新错误
      this.emit('error', retryError);
      await this.setState(SSEConnectionState.ERROR);
    }
  }

  /**
   * 重新连接
   */
  private async reconnect(): Promise<void> {
    this.logger.warn(`Reconnecting ${this.connectionId} due to connection error...`);

    // 清理当前连接
    await this.cleanup(false);

    // 重置解析器
    this.resetParser();

    // 重新建立连接
    await this.setState(SSEConnectionState.RECONNECTING);
    await this.establishConnection();
    await this.setState(SSEConnectionState.CONNECTED);
    this.startHeartbeat();
    await this.readStream();
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    if (!this.options.enableHeartbeat || !this.config.heartbeatInterval || this.config.heartbeatInterval <= 0) {
      return;
    }

    this.heartbeatTimer = setInterval(() => {
      if (this.state === SSEConnectionState.CONNECTED) {
        this.emit('heartbeat', {
          connectionId: this.connectionId,
          timestamp: Date.now(),
        });
      }
    }, this.config.heartbeatInterval);

    this.logger.debug(`Heartbeat started for ${this.connectionId}`);
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
      this.logger.debug(`Heartbeat stopped for ${this.connectionId}`);
    }
  }

  /**
   * 清理超时定时器
   */
  private clearTimeouts(): void {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = undefined;
    }
  }

  /**
   * 设置连接状态
   */
  private async setState(newState: SSEConnectionState): Promise<void> {
    const oldState = this.state;
    this.state = newState;
    this.connectionInfo.state = newState;

    const stateChangeEvent: StateChangeEvent = {
      connectionId: this.connectionId,
      from: oldState,
      to: newState,
      timestamp: Date.now(),
    };

    this.emit('stateChange', stateChangeEvent);
    this.logger.debug(`Connection ${this.connectionId} state: ${oldState} -> ${newState}`);
  }

  /**
   * 清理资源
   */
  private async cleanup(emitComplete = true): Promise<void> {
    this.stopHeartbeat();
    this.clearTimeouts();

    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (e) {
        this.logger.warn('Reader cleanup error:', e);
      }
      this.reader = undefined;
    }

    if (this.controller && !this.controller.signal.aborted) {
      this.controller.abort();
      this.controller = undefined;
    }

    if (emitComplete) {
      this.emit('complete', true);
    }
  }

  /**
   * 解析SSE数据
   */
  private parseSSEData(chunk: string): void {
    this.eventBuffer += chunk;
    const lines = this.eventBuffer.split(/\r?\n/);

    // 保留最后一行（可能不完整）
    this.eventBuffer = lines.pop() || '';

    for (const line of lines) {
      this.processSSELine(line);
    }
  }

  /**
   * 处理SSE行数据
   */
  private processSSELine(line: string): void {
    if (line === '') {
      // 空行表示事件结束
      this.emitCurrentEvent();
      return;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === 0) {
      // 注释行，忽略
      return;
    }

    let field: string;
    let value: string;

    if (colonIndex === -1) {
      field = line.trim();
      value = '';
    } else {
      field = line.slice(0, colonIndex).trim();
      value = line.slice(colonIndex + 1).replace(/^ /, ''); // 移除开头空格
    }

    // 处理SSE字段
    switch (field) {
      case 'event':
        this.currentEvent.event = value;
        break;
      case 'data':
        if (this.currentEvent.data === undefined) {
          this.currentEvent.data = value;
        } else {
          this.currentEvent.data += `\n${value}`;
        }
        break;
      case 'id':
        this.currentEvent.id = value;
        break;
      default:
        // 忽略其他字段
        break;
    }
  }

  /**
   * 发送当前事件
   */
  private emitCurrentEvent(): void {
    if (this.currentEvent.data !== undefined) {
      try {
        // 尝试解析JSON，失败则保持原始字符串
        let data: any;
        try {
          data = JSON.parse(this.currentEvent.data);
        } catch {
          data = this.currentEvent.data;
        }

        this.emit('message', {
          event: this.currentEvent.event || '',
          data,
        });
      } catch (error) {
        this.logger.error('Error emitting event:', error);
      }
    }

    // 清理当前事件
    this.currentEvent = {};
  }

  /**
   * 重置解析器状态
   */
  private resetParser(): void {
    this.eventBuffer = '';
    this.currentEvent = {};
  }

  /**
   * 设置内部事件处理器
   */
  private setupInternalEventHandlers(): void {
    this.on('error', (error) => {
      this.logger.error(`SSE Client ${this.connectionId} error:`, error);
    });

    this.on('complete', (isAborted) => {
      this.logger.info(`SSE Client ${this.connectionId} completed, aborted: ${isAborted}`);
    });
  }

  /**
   * 验证配置
   */
  private validateConfig(config: SSEClientConfig): void {
    if (!config) {
      throw new ValidationError('SSE 配置不能为空');
    }

    if (config.timeout && config.timeout < 0) {
      throw new ValidationError('超时时间不能为负数');
    }

    if (config.heartbeatInterval && config.heartbeatInterval < 1000) {
      throw new ValidationError('心跳间隔不能小于1000ms');
    }
  }

  /**
   * 生成连接ID
   */
  private generateConnectionId(): string {
    return `sse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
