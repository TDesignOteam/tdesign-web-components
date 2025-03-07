/* eslint-disable max-classes-per-file */
import type { ChunkParsedResult, ContentType } from '../type';

// 定义内容处理器接口
interface ContentProcessor {
  process(content: any): any;
  validate?(content: any): boolean;
}

// 多模态类型定义
const ContentTypes = {
  TEXT: 'text',
  MARKDOWN: 'markdown',
  IMAGE: 'image',
  FILE: 'file',
  CUSTOM: 'custom',
} as const;

// 基础处理器实现
class BaseProcessor implements ContentProcessor {
  process(content: any) {
    return content;
  }
}

// 文本处理器
class TextProcessor extends BaseProcessor {
  process(content: string) {
    return content.replace(/\n/g, '<br>');
  }
}

// Markdown处理器
class MarkdownProcessor extends BaseProcessor {
  process(content: string) {
    // 添加Markdown解析逻辑
    return marked.parse(content);
  }
}

// 图片处理器
class ImageProcessor extends BaseProcessor {
  process(content: { url: string; alt?: string }) {
    return {
      url: this.validateUrl(content.url),
      alt: content.alt || 'Generated image',
    };
  }

  private validateUrl(url: string) {
    if (!url.startsWith('https://')) {
      throw new Error('Invalid image URL');
    }
    return url;
  }
}

// 文件处理器
class FileProcessor extends BaseProcessor {
  process(content: { name: string; content: string; type: string }) {
    return {
      ...content,
      downloadUrl: this.generateDownloadUrl(content),
    };
  }

  private generateDownloadUrl(file: { content: string; type: string }) {
    const blob = new Blob([file.content], { type: file.type });
    return URL.createObjectURL(blob);
  }
}

export default class ChatProcessor {
  private processors: Map<ContentType, ContentProcessor>;

  private customProcessors: Map<string, ContentProcessor>;

  constructor() {
    this.processors = new Map();
    this.customProcessors = new Map();

    // 注册默认处理器
    this.registerProcessor(ContentTypes.TEXT, new TextProcessor());
    this.registerProcessor(ContentTypes.MARKDOWN, new MarkdownProcessor());
    this.registerProcessor(ContentTypes.IMAGE, new ImageProcessor());
    this.registerProcessor(ContentTypes.FILE, new FileProcessor());
  }

  // 注册自定义处理器
  public registerProcessor(type: ContentType | string, processor: ContentProcessor) {
    if (typeof type === 'string' && !(type in ContentTypes)) {
      this.customProcessors.set(type, processor);
    } else {
      this.processors.set(type as ContentType, processor);
    }
  }

  // 扩展的多模态处理方法
  private processContent(contentType: ContentType | string, content: any) {
    const processor = this.getProcessor(contentType);
    return processor.process(content);
  }

  private getProcessor(type: ContentType | string): ContentProcessor {
    const processor =
      this.processors.get(type as ContentType) ||
      this.customProcessors.get(type) ||
      this.processors.get(ContentTypes.TEXT)!;
    return processor;
  }

  processStreamChunk(parsed: ChunkParsedResult): ChunkParsedResult {
    // 统一处理多模态内容
    if (parsed.main) {
      parsed.main.content = this.processContent(parsed.main.type || ContentTypes.TEXT, parsed.main.content);
    }
    return parsed;
  }
}

// export interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   status: 'pending' | 'streaming' | 'complete';
//   timestamp: string;
//   main?: {
//     type: ContentType | string;
//     status: 'streaming' | 'complete';
//     content: any;
//     metadata?: Record<string, any>;
//   };
//   search?: {
//     status: 'streaming' | 'complete';
//     content?: string;
//   };
//   thinking?: {
//     type?: ContentType | string;
//     title?: string;
//     status: 'streaming' | 'complete';
//     content?: any;
//   };
//   attachments?: Array<{
//     type: ContentType | string;
//     content: any;
//     metadata?: Record<string, any>;
//   }>;
// }

// 创建处理器实例
// const processor = new ChatProcessor();

// // 处理图片消息
// processor.processStreamChunk({
//   main: {
//     type: 'image',
//     content: { url: 'https://example.com/image.jpg' }
//   }
// });

// // 处理文件下载
// processor.processStreamChunk({
//   main: {
//     type: 'file',
//     content: {
//       name: 'report.pdf',
//       type: 'application/pdf',
//       content: '...PDF内容...'
//     }
//   }
// });

// // 注册自定义处理器
// processor.registerProcessor('chart', {
//   process(content) {
//     // 处理自定义图表类型
//     return renderChart(content);
//   }
// });
