/**
 * Enhanced server types for SSE client and LLM service
 */

// 连接状态枚举
export enum SSEConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  CLOSING = 'closing',
  CLOSED = 'closed',
  ERROR = 'error',
}

// SSE 客户端配置
export interface SSEClientConfig extends Omit<RequestInit, 'signal'> {
  timeout?: number;
  heartbeatInterval?: number;
  validateResponse?: (response: Response) => boolean;
}

// SSE 客户端选项
export interface SSEClientOptions {
  enableHeartbeat?: boolean;
}

// 事件接口
export interface SSEEvent {
  event?: string;
  data?: any;
  id?: string;
  retry?: number;
  timestamp?: number;
}

// 连接信息
export interface ConnectionInfo {
  id: string;
  retryCount: number;
  lastActivity: number;
  state?: SSEConnectionState; // 可选状态
  url?: string; // 可选URL
  createdAt?: number; // 可选创建时间
  error?: Error; // 可选错误信息
  stats: ConnectionStats; // 添加必需的统计信息属性
}

// 简化的连接状态信息
export interface ConnectionStatus {
  id: string;
  state: SSEConnectionState;
  retryCount: number;
  error?: Error;
  lastActivity?: number;
}

// 简化的连接统计
export interface ConnectionStats {
  retryCount: number;
  lastError?: Error;
  connectionTime?: number;
  totalReconnects: number;
}

// 状态变化事件
export interface StateChangeEvent {
  connectionId: string;
  from: SSEConnectionState;
  to: SSEConnectionState;
  timestamp: number;
}

// 心跳事件
export interface HeartbeatEvent {
  connectionId: string;
  timestamp: number;
}

// 默认配置
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 2,
  retryableErrors: (error: Error) => {
    // 检查错误是否有 isRetryable 属性（来自 SSEError）
    if ('isRetryable' in error && typeof error.isRetryable === 'boolean') {
      return error.isRetryable;
    }
    // 网络错误通常可以重试
    return error.name === 'TypeError' || error.name === 'NetworkError' || error.name === 'AbortError';
  },
};

export const DEFAULT_SSE_CONFIG: SSEClientConfig = {
  timeout: 0,
  heartbeatInterval: 10000,
  method: 'POST',
  headers: {
    Accept: 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
  validateResponse: (response: Response) => {
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.includes('text/event-stream') ?? false);
  },
};

// 默认连接统计
export const DEFAULT_CONNECTION_STATS: ConnectionStats = {
  retryCount: 0,
  totalReconnects: 0,
};
