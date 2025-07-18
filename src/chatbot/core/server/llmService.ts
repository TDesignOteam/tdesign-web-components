import type { AIMessageContent, ChatRequestParams, ChatServiceConfig, SSEChunkData } from '../type';
import SSEClient from './sseClient';

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

// 默认的LLM服务实现（基于Fetch API和SSE）
export class LLMService implements ILLMService {
  private sseClient: SSEClient;

  private fetchAbortController: AbortController | null = null; // 用于批量请求的AbortController

  async handleBatchRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<any> {
    // 如果上一个请求正在进行中，先中止它，防止同时发起多个请求
    if (this.fetchAbortController) {
      this.fetchAbortController.abort();
    }

    // 为当前请求创建新的AbortController实例
    this.fetchAbortController = new AbortController();

    const req = (await config.onRequest?.(params)) || {};

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...req.headers,
        },
        body: req.body,
        signal: this.fetchAbortController.signal, // 添加AbortSignal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return config.onComplete?.(false, req, data);
    } catch (error) {
      // 检查错误是否是由于中止操作引起的
      if (error.name !== 'AbortError') {
        config.onError?.(error);
        throw error;
      }
    } finally {
      this.fetchAbortController = null;
    }
  }

  /**
   * 中止当前正在进行的批量请求
   */
  closeFetch() {
    if (this.fetchAbortController) {
      this.fetchAbortController.abort();
    }
  }

  closeSSE() {
    // 终止当前SSE请求
    this.sseClient?.close();
  }

  async handleStreamRequest(params: ChatRequestParams, config: ChatServiceConfig) {
    const req = (await config.onRequest?.(params)) || {};
    this.sseClient = new SSEClient(config.endpoint, {
      onMessage: (msg: SSEChunkData) => {
        config.onMessage?.(msg);
      },
      onError: (error) => {
        config.onError?.(error);
      },
      onComplete: (isAborted) => {
        config.onComplete?.(isAborted, req);
      },
    });

    await this.sseClient.connect(req);
  }
}
