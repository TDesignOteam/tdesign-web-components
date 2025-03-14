import type { AIMessageContent, AIResponse, AttachmentItem, Message, UserMessage } from '../type';

export default class ChatTextProcessor {
  public createUserMessage(content: string, attachments?: AttachmentItem[]): Message {
    const messageContent: UserMessage['content'] = [
      {
        type: 'text',
        data: content,
      },
    ];

    if (attachments?.length) {
      messageContent.push({
        type: 'attachment',
        data: attachments,
      });
    }

    return {
      id: this.generateID(),
      role: 'user',
      status: 'complete',
      timestamp: `${Date.now()}`,
      content: messageContent,
    };
  }

  public createAssistantMessage(): Message {
    // 创建初始助手消息
    return {
      id: this.generateID(),
      role: 'assistant',
      status: 'pending',
      timestamp: `${Date.now()}`,
    };
  }

  private generateID() {
    return `msg_${Date.now()}_${Math.floor(Math.random() * 90000) + 10000}`;
  }

  processStreamChunk(parsed: AIMessageContent): AIResponse {
    // 处理搜索阶段
    if (parsed.search) {
      return {
        search: {
          status: 'streaming',
          content: parsed.search.content,
        },
      };
    }
    // 处理思考阶段
    if (parsed.thinking) {
      const { type = 'text', title = '思考中...', content } = parsed.thinking;
      return {
        search: {
          status: 'complete',
        },
        thinking: {
          type,
          title,
          status: 'streaming',
          content,
        },
      };
    }
    // 处理文字生成阶段
    if (parsed.main && (parsed.main.type === 'text' || parsed.main.type === 'markdown')) {
      console.log('====parsed', parsed);
      return {
        thinking: {
          status: 'complete',
        },
        main: {
          status: 'streaming',
          content: parsed.main.content,
          type: parsed.main.type,
        },
      };
    }
    // 处理图片生成阶段
    if (parsed.main && parsed.main.type === 'image') {
      return {
        main: {
          status: 'complete',
          content: parsed.main.content,
          type: parsed.main.type,
        },
      };
    }
  }
}
