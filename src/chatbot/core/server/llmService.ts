import type { AIResponse, LLMConfig, RequestParams, SSEChunkData } from '../type';
import SSEClient from './sseClient';

export interface ILLMService {
  /**
   * 处理批量请求（非流式）
   */
  handleBatchRequest(params: RequestParams, config: LLMConfig): Promise<AIResponse>;

  /**
   * 处理流式请求
   */
  handleStreamRequest(params: RequestParams, config: LLMConfig): Promise<void>;
}

// 默认的LLM服务实现（基于Fetch API和SSE）
export class LLMService implements ILLMService {
  private sseClient: SSEClient;

  async handleBatchRequest(params: RequestParams, config: LLMConfig): Promise<any> {
    const req = config.onRequest?.(params) || {};

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...req.headers,
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return config.onComplete?.(false, params, data);
    } catch (error) {
      config.onError?.(error as Error, params);
      throw error;
    }
  }

  closeSSE() {
    this.sseClient?.close();
  }

  async handleStreamRequest(params: RequestParams, config: LLMConfig) {
    const req = config.onRequest?.(params) || {};
    this.sseClient = new SSEClient(config.endpoint, {
      onMessage: (msg: SSEChunkData) => {
        config.onMessage?.(msg);
      },
      onError: (error) => {
        config.onError?.(error, params);
      },
      onComplete: (isAborted) => {
        config.onComplete?.(isAborted, params);
      },
    });

    await this.sseClient.connect(req);
  }
}
