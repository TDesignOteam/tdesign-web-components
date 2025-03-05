import { SSEChunkData } from './type';

export default class SSEClient {
  private controller: AbortController | null = null;

  private retries = 0;

  private reader: ReadableStreamDefaultReader | null = null;

  private config: RequestInit;

  constructor(
    private url: string,
    private handlers: {
      onMessage?: (data: any) => void;
      onError?: (error: Error) => void;
      onComplete?: () => void;
    },
    private options: {
      retryInterval?: number;
      maxRetries?: number;
    } = {},
  ) {
    // 构造函数参数属性初始化
  }

  async *connect(config: RequestInit) {
    try {
      this.controller = new AbortController();
      this.config = {
        method: config.method || 'POST',
        headers: {
          'Content-Type': 'text/event-stream',
          ...config.headers,
        },
        body: config.body,
        signal: this.controller.signal,
      };

      const response = await fetch(this.url, this.config);

      if (!response.ok || !response.body) {
        throw new Error(`SSE连接失败，状态码：${response.status}`);
      }

      this.reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      // 直接开始读取流数据并通过生成器返回
      yield* this.readStream();
    } catch (err) {
      this.handleError(err);
      this.reconnect();
    }
  }

  private async *readStream() {
    try {
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await this.reader!.read();
        if (done) {
          this.handlers.onComplete?.();
          return;
        }

        // 解析SSE格式数据（可能包含多个事件）
        for (const eventData of this.parseChunk(value)) {
          yield eventData;
        }
      }
    } catch (err) {
      this.handleError(err);
      this.reconnect();
    }
  }

  // private parseChunk(chunk: string) {
  //   // 清洗SSE格式数据
  //   const cleanedStr = chunk
  //     .replace(/^data:\s*/gm, '') // 处理多行data前缀
  //     .replace(/\n\n$/, '');

  //   try {
  //     return JSON.parse(cleanedStr);
  //   } catch {
  //     // 包含多层data:前缀的特殊情况处理
  //     const deepCleaned = cleanedStr.replace(/(\bdata:\s*)+/g, '');
  //     try {
  //       return JSON.parse(deepCleaned);
  //     } catch {
  //       console.warn('SSE数据解析失败，返回原始数据');
  //       return deepCleaned;
  //     }
  //   }
  // }

  private parseChunk(chunk: string): Array<SSEChunkData> {
    // 分割多个SSE事件（按两个换行符分割）
    return chunk
      .split('\n\n')
      .map((eventChunk) => {
        let eventType: string | undefined;
        const dataLines: string[] = [];

        // 解析每个事件块
        eventChunk.split('\n').forEach((line) => {
          if (line.startsWith('event:')) {
            eventType = line.replace(/^event:\s*/, '').trim();
          } else if (line.startsWith('data:')) {
            dataLines.push(line.replace(/^data:\s*/, '').trim());
          }
        });

        try {
          // 合并多行data内容并解析JSON
          const jsonData = dataLines.length > 0 ? JSON.parse(dataLines.join('\n')) : {};
          return {
            event: eventType || '',
            data: jsonData,
          };
        } catch (e) {
          console.warn('SSE数据解析失败，返回原始数据');
          return {
            event: eventType || '',
            data: dataLines.join('\n'),
          };
        }
      })
      .filter((result) => {
        // 过滤空数据（包括纯换行符的情况）
        if (typeof result.data === 'string') {
          return result.data.trim() !== '';
        }
        return Object.keys(result.data).length > 0;
      });
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
        this.connect(this.config);
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
