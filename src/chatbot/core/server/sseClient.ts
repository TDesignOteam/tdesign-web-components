import { SSEChunkData } from '../type';

export default class SSEClient {
  private controller: AbortController | null = null;

  private retries = 0;

  private reader: ReadableStreamDefaultReader | null = null;

  private config: RequestInit;

  private buffer = '';

  private isClosed = false;

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

  async close() {
    if (this.isClosed) return;
    this.isClosed = true;
    // 先取消reader读取
    if (this.reader) {
      await this.reader.cancel().catch((err) => {
        this.handlers.onError?.(err);
      });
      this.reader = null;
    }

    // 最后中止控制器
    if (this.controller && !this.controller.signal.aborted) {
      this.controller.abort();
      this.controller = null;
    }
  }

  private async readStream() {
    try {
      while (!this.isClosed) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await this.reader!.read();
        if (done) {
          this.handlers.onComplete?.(this.isClosed);
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
    // 合并缓冲区和新数据
    const rawData = this.buffer + chunk;
    this.buffer = ''; // 清空缓冲区

    // 按SSE规范分割事件（两个换行符分隔）
    const events = rawData.split(/(?:\r?\n){2}/);

    // 如果最后一个事件块不完整，保留到缓冲区
    const lastEvent = events[events.length - 1];
    if (!lastEvent.endsWith('\n\n') && !lastEvent.includes('\n\ndata:')) {
      this.buffer = events.pop() || '';
    }

    return events.flatMap((eventChunk) => {
      let eventType: string | undefined;
      const results: SSEChunkData[] = [];
      let dataBuffer = '';

      // 逐行处理事件内容
      eventChunk.split('\n').forEach((line) => {
        line = line.trim();
        if (!line) return;

        if (line.startsWith('event:')) {
          eventType = line.replace(/^event:\s*/, '').trim();
        } else if (line.startsWith('data:')) {
          // 处理多行data内容
          dataBuffer += `${line.replace(/^data:\s*/, '')}\n`;
        }
      });

      // 处理累积的data内容
      if (dataBuffer) {
        try {
          const content = dataBuffer.trim();
          results.push({
            event: eventType || '',
            data: content ? JSON.parse(content) : {},
          });
        } catch (e) {
          results.push({
            event: eventType || '',
            data: dataBuffer.trim(),
          });
        }
      }

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
