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

  async handleBatchRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<any> {
    const req = (await config.onRequest?.(params)) || {};

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...req.headers,
        },
        body: req.body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return config.onComplete?.(false, req, data);
    } catch (error) {
      config.onError?.(error);
      throw error;
    }
  }

  closeSSE() {
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
