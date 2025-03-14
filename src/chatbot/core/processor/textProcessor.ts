import type { AIMessage, AttachmentItem, Message, UserMessage } from '../type';

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

  public createAssistantMessage(): AIMessage {
    // 创建初始助手消息
    return {
      id: this.generateID(),
      role: 'assistant',
      status: 'pending',
      timestamp: `${Date.now()}`,
      content: [],
    };
  }

  private generateID() {
    return `msg_${Date.now()}_${Math.floor(Math.random() * 90000) + 10000}`;
  }
}
