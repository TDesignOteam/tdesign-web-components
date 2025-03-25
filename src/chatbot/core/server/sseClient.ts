import { SSEChunkData } from '../type';

export default class SSEClient {
  private controller: AbortController | null = null;

  private retries = 0;

  private reader: ReadableStreamDefaultReader | null = null;

  private config: RequestInit;

  constructor(
    private url: string,
    private handlers: {
      onMessage?: (data: any) => void;
      onError?: (error: Error | Response) => void;
      onComplete?: (isAborted: boolean) => void;
    },
    private options: {
      retryInterval?: number;
      maxRetries?: number;
    } = {},
  ) {
    // 构造函数参数属性初始化
  }

  async connect(config: RequestInit) {
    try {
      this.controller = new AbortController();
      const { method, headers, body, ...rest } = config || {};
      this.config = {
        ...rest,
        method: method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body,
        signal: this.controller.signal,
      };

      console.log('====this.config', this.config);
      const response = await fetch(this.url, this.config);

      if (!response.ok || !response.body) {
        this.handleError(response);
        return;
      }

      this.reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      // 直接开始读取流数据
      await this.readStream();
    } catch (err) {
      this.handleError(err);
    }
  }

  close() {
    this.reader?.cancel().catch(() => {});
    this.controller?.abort();
    this.reader = null;
    this.controller = null;
  }

  private async readStream() {
    try {
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await this.reader!.read();
        if (done) {
          const isAborted = this.reader === null;
          this.handlers.onComplete?.(isAborted);
          return;
        }

        // 解析SSE格式数据（可能包含多个事件）
        for (const eventData of this.parseChunk(value)) {
          this.handlers.onMessage?.(eventData);
          // yield eventData;
        }
      }
    } catch (err) {
      this.handleError(err);
      // this.reconnect();
    }
  }

  private parseChunk(chunk: string): Array<SSEChunkData> {
    // 分割多个SSE事件（按两个换行符分割）
    return chunk.split(/(?:\r?\n){2,}/).flatMap((eventChunk) => {
      let eventType: string | undefined;
      const results: SSEChunkData[] = [];

      console.log('====eventChunk', eventChunk);
      // 解析每个事件块
      eventChunk.split('\n').forEach((line) => {
        if (line.startsWith('event:')) {
          eventType = line.replace(/^event:\s*/, '').trim();
        } else if (line.startsWith('data:')) {
          const dataContent = line.replace(/^data:\s*/, '').trim();
          try {
            results.push({
              event: eventType || '',
              data: dataContent ? JSON.parse(dataContent) : {},
            });
          } catch (e) {
            results.push({
              event: eventType || '',
              data: dataContent,
            });
          }
        }
      });

      return results;
    });
  }

  private handleError(error: unknown) {
    if (error instanceof Error || error instanceof Response) {
      this.handlers.onError?.(error);
    } else {
      this.handlers.onError?.(new Error('未知的SSE连接错误'));
    }
  }

  private reconnect() {
    if (this.retries < (this.options.maxRetries ?? 3)) {
      setTimeout(() => {
        this.retries += 1;
        this.connect(this.config);
      }, this.options.retryInterval ?? 1000);
    }
  }
}
