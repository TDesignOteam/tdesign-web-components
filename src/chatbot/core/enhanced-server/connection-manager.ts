/* eslint-disable max-classes-per-file */
import { ConnectionError } from './errors';
import {
  ConnectionInfo,
  ConnectionStats,
  ConsoleLogger,
  DEFAULT_CONNECTION_STATS,
  DEFAULT_RETRY_CONFIG,
  Logger,
  RetryConfig,
  SSEConnectionState,
} from './types';

/**
 * 连接管理器 - 处理重试逻辑和资源清理
 */
export class ConnectionManager {
  private retryCount = 0;

  private reconnectTimer?: ReturnType<typeof setTimeout>;

  private connectionStartTime = 0;

  private config: RetryConfig;

  private logger: Logger;

  constructor(
    private connectionId: string,
    retryConfig: Partial<RetryConfig> = {},
    logger: Logger = new ConsoleLogger(),
  ) {
    this.config = {
      ...DEFAULT_RETRY_CONFIG,
      ...retryConfig,
    };
    this.logger = logger;
  }

  /**
   * 处理连接错误并决定是否重试
   * @param error 发生的错误
   * @param reconnectCallback 重连回调
   * @param onFinalError 最终错误回调，当所有重试都失败时调用
   * @returns 如果错误不可重试或达到最大重试次数，返回最终错误；否则返回 null 表示将继续重试
   */
  async handleConnectionError(
    error: Error,
    reconnectCallback: () => Promise<void>,
    onFinalError?: (finalError: Error) => void,
  ): Promise<Error | null> {
    this.logger.error(`Connection ${this.connectionId} error:`, error);

    if (!this.shouldRetry(error)) {
      this.logger.info(`Error is not retryable: ${error.message}`);
      this.cleanup();
      if (onFinalError) {
        onFinalError(error);
        return null;
      }
      return error;
    }

    if (this.retryCount >= this.config.maxRetries) {
      const finalError = new ConnectionError(`连接失败，已达到最大重试次数 (${this.config.maxRetries})`, undefined, {
        originalError: error,
        retryCount: this.retryCount,
      });
      this.cleanup();
      if (onFinalError) {
        onFinalError(finalError);
        return null;
      }
      return finalError;
    }

    const delay = this.calculateBackoffDelay();
    this.logger.warn(
      `Connection ${this.connectionId} failed, retrying in ${delay}ms (attempt ${this.retryCount + 1}/${
        this.config.maxRetries
      })`,
    );

    this.scheduleReconnect(delay, reconnectCallback, onFinalError);
    return null; // 表示将继续重试
  }

  /**
   * 开始连接计时
   */
  startConnection(): void {
    this.connectionStartTime = Date.now();
    this.logger.debug(`Connection ${this.connectionId} started`);
  }

  /**
   * 连接成功，重置重试计数
   */
  onConnectionSuccess(): void {
    const duration = Date.now() - this.connectionStartTime;
    this.logger.info(`Connection ${this.connectionId} established in ${duration}ms`);
    this.retryCount = 0;
  }

  /**
   * 获取连接信息
   */
  getConnectionInfo(): Partial<ConnectionInfo> {
    return {
      retryCount: this.retryCount,
      lastActivity: Date.now(),
    };
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    this.retryCount = 0;
    this.logger.debug(`Connection manager ${this.connectionId} cleaned up`);
  }

  /**
   * 判断错误是否可重试
   */
  private shouldRetry(error: Error): boolean {
    try {
      return this.config.retryableErrors(error);
    } catch (e) {
      this.logger.warn('Error in retryableErrors function:', e);
      return false;
    }
  }

  /**
   * 计算退避延迟时间
   */
  private calculateBackoffDelay(): number {
    let delay = this.config.baseDelay * this.config.backoffFactor ** this.retryCount;
    delay = Math.min(delay, this.config.maxDelay);

    return Math.floor(delay);
  }

  /**
   * 调度重连
   */
  private scheduleReconnect(
    delay: number,
    reconnectCallback: () => Promise<void>,
    onFinalError?: (finalError: Error) => void,
  ): void {
    this.reconnectTimer = setTimeout(async () => {
      try {
        this.retryCount += 1;
        await reconnectCallback();
        this.onConnectionSuccess();
      } catch (retryError) {
        const finalError = await this.handleConnectionError(retryError, reconnectCallback, onFinalError);
        if (finalError && onFinalError) {
          // 通过回调传递最终错误，而不是抛出
          onFinalError(finalError);
        }
      }
    }, delay);
  }
}

/**
 * 管理单个连接的统计信息
 */
export class ConnectionStateManager {
  private stats: ConnectionStats;

  constructor(
    private connectionId: string,
    private logger: Logger = new ConsoleLogger(),
  ) {
    this.stats = { ...DEFAULT_CONNECTION_STATS };
  }

  /**
   * 更新连接状态
   */
  updateState(state: SSEConnectionState, error?: Error): void {
    if (error) {
      this.stats.lastError = error;
    }

    if (state === SSEConnectionState.RECONNECTING) {
      this.stats.totalReconnects += 1;
    }

    this.logger.debug(`Connection ${this.connectionId} state updated to ${state}`);
  }

  /**
   * 增加重试计数
   */
  incrementRetryCount(): void {
    this.stats.retryCount += 1;
  }

  /**
   * 重置重试计数
   */
  resetRetryCount(): void {
    this.stats.retryCount = 0;
  }

  /**
   * 记录连接时间
   */
  recordConnectionTime(duration: number): void {
    this.stats.connectionTime = duration;
  }

  /**
   * 获取连接统计
   */
  getStats(): ConnectionStats {
    return { ...this.stats };
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.stats = { ...DEFAULT_CONNECTION_STATS };
    this.logger.debug(`Connection state manager ${this.connectionId} cleaned up`);
  }
}
