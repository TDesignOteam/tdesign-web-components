/* eslint-disable no-await-in-loop, max-classes-per-file */
import EventEmitter from '../utils/eventEmitter';
import { LoggerManager } from '../utils/logger';
import { ConnectionManager } from './connection-manager';
import { ConnectionError, TimeoutError, ValidationError } from './errors';
import {
  ConnectionInfo,
  DEFAULT_CONNECTION_STATS,
  DEFAULT_SSE_CONFIG,
  SSEClientConfig,
  SSEClientOptions,
  SSEConnectionState,
  StateChangeEvent,
} from './types';

/**
 * Enhanced SSE Client
 * 采用分层设计，分离了连接管理、状态管理、事件解析等职责
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

  private logger = LoggerManager.getLogger();

  private url: string;

  private connectionInfo: ConnectionInfo;

  constructor(url: string, options: SSEClientOptions = {}) {
    super();
    this.url = url;
    this.options = options;
    this.connectionId = this.generateConnectionId();
    this.logger = LoggerManager.getLogger();
    this.connectionManager = new ConnectionManager(this.connectionId);

    this.connectionInfo = {
      id: this.connectionId,
      url,
      state: this.state,
      createdAt: Date.now(),
      retryCount: 0,
      lastActivity: Date.now(),
      stats: { ...DEFAULT_CONNECTION_STATS },
    };

    this.setupInternalEventHandlers();
  }

  /**
   * 连接 SSE 服务
   */
  async connect(config: SSEClientConfig): Promise<void> {
    if (this.state === SSEConnectionState.CONNECTED || this.state === SSEConnectionState.CONNECTING) {
      return;
    }

    this.config = {
      ...DEFAULT_SSE_CONFIG,
      ...config,
      headers: {
        ...DEFAULT_SSE_CONFIG.headers,
        ...config.headers,
      },
    };

    this.setState(SSEConnectionState.CONNECTING);
    this.connectionManager.startConnection();

    try {
      await this.establishConnection();
      this.setState(SSEConnectionState.CONNECTED);
      this.connectionManager.onConnectionSuccess();
      this.startHeartbeat();
      await this.readStream();
    } catch (error) {
      this.handleConnectionError(error as Error);
    }
  }

  /**
   * 关闭连接
   */
  async abort(): Promise<void> {
    if (this.state === SSEConnectionState.DISCONNECTED || this.state === SSEConnectionState.CLOSING) {
      return;
    }

    this.setState(SSEConnectionState.CLOSING);

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
      this.setState(SSEConnectionState.CLOSED);
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
        this.emit('error', new TimeoutError(`Request timed out after ${this.config.timeout}ms`));
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
          this.setState(SSEConnectionState.DISCONNECTED);
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
        this.handleConnectionError(error as Error);
      } else {
        this.logger.debug(`Stream reading stopped for ${this.connectionId} (aborted)`);
      }
    }
  }

  /**
   * 简化的错误处理
   */
  private handleConnectionError(error: Error) {
    this.connectionInfo.error = error;
    this.connectionManager.handleConnectionError(error);
    this.setState(SSEConnectionState.ERROR);
    this.emit('error', error);
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
  private setState(newState: SSEConnectionState) {
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

  // private parseSSEData(chunk: string): void {
  //   this.eventBuffer += chunk;

  //   // 循环处理，直到缓冲区中再也找不到完整的行
  //   let newlineIndex;
  //   while ((newlineIndex = this.eventBuffer.indexOf('\n')) !== -1) {
  //     // 提取一行（包含 \r 如果有的话）
  //     const line = this.eventBuffer.slice(0, newlineIndex).replace(/\r$/, '');

  //     // 从缓冲区移除已处理的行和换行符
  //     this.eventBuffer = this.eventBuffer.slice(newlineIndex + 1);

  //     // 处理这一行
  //     this.processSSELine(line);
  //   }
  // }

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
   * 生成连接ID
   */
  private generateConnectionId(): string {
    return `sse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
