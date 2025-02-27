export interface SSEConnectConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: BodyInit;
}

export default class SSEClient {
  private controller: AbortController | null = null;

  private retries = 0;

  private reader: ReadableStreamDefaultReader | null = null;

  constructor(
    private url: string,
    private handlers: {
      onMessage: (data: string) => void;
      onError?: (error: Error) => void;
      onComplete?: () => void;
    },
    private options: {
      headers?: Record<string, string>;
      retryInterval?: number;
      maxRetries?: number;
    } = {},
  ) {
    // 构造函数参数属性初始化
  }

  async connect(config: SSEConnectConfig) {
    try {
      this.controller = new AbortController();

      const response = await fetch(this.url, {
        method: config.method || 'GET',
        headers: {
          'Content-Type': 'text/event-stream',
          ...this.options.headers,
          ...config.headers,
        },
        body: config.body,
        signal: this.controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`SSE连接失败，状态码：${response.status}`);
      }

      this.reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

      // 开始读取流数据
      this.readStream();
    } catch (err) {
      this.handleError(err);
      this.reconnect();
    }
  }

  private async readStream() {
    try {
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await this.reader!.read();
        if (done) {
          this.handlers.onComplete?.();
          return;
        }

        // 解析SSE格式数据
        value.split('\n\n').forEach((chunk) => {
          const data = chunk.split('\n').find((line) => line.startsWith('data: '));
          if (data) {
            this.handlers.onMessage(data.replace('data: ', ''));
          }
        });
      }
    } catch (err) {
      this.handleError(err);
      this.reconnect();
    }
  }

  private handleError(error: unknown) {
    if (error instanceof Error) {
      this.handlers.onError?.(error);
    } else {
      this.handlers.onError?.(new Error('未知的SSE连接错误'));
    }
  }

  private reconnect() {
    if (this.retries < (this.options.maxRetries ?? 3)) {
      setTimeout(() => {
        this.retries += 1;
        this.connect({
          method: 'GET',
          headers: this.options.headers,
        });
      }, this.options.retryInterval ?? 1000);
    }
  }

  close() {
    this.reader?.cancel().catch(() => {});
    this.controller?.abort();
    this.reader = null;
    this.controller = null;
  }
}
