import {
  type AIMessage,
  type AIMessageContent,
  type ImageContent,
  isAIMessage,
  MarkdownContent,
  type Message,
  type MessageState,
  type SearchContent,
  type TextContent,
  type ThinkingContent,
} from '../type';
import ReactiveState from './reactiveState';

// 专注消息生命周期管理
export class MessageStore extends ReactiveState<MessageState> {
  constructor(initialState?: Partial<MessageState>) {
    super({
      messageIds: [],
      messages: [],
      ...initialState,
    });
  }

  createMessage(message: Message) {
    const { id } = message;
    this.setState((draft) => {
      draft.messageIds.push(id);
      draft.messages.push(message);
    });
  }

  createMultiMessages(messages: Message[]) {
    this.setState((draft) => {
      messages.forEach((msg) => {
        draft.messageIds.push(msg.id);
      });
      draft.messages.push(...messages);
    });
  }

  appendContent(messageId: string, chunk: AIMessageContent) {
    this.setState((draft) => {
      const message = draft.messages.find((m) => m.id === messageId);
      if (!message || !isAIMessage(message)) return;

      message.status = 'streaming';
      const lastContentIndex = message.content.findIndex((c) => c.type === chunk.type);

      // 根据内容类型分发处理
      switch (chunk.type) {
        case 'text':
        case 'markdown':
          this.handleTextContent(message, chunk, lastContentIndex);
          break;
        case 'thinking':
          this.handleThinkingContent(message, chunk, lastContentIndex);
          break;
        case 'image':
          this.handleImageContent(message, chunk, lastContentIndex);
          break;
        case 'search':
          this.handleSearchContent(message, chunk, lastContentIndex);
          break;
      }

      this.updateMessageStatus(message);
    });
  }

  // 处理文本类内容（text/markdown）
  private handleTextContent(message: AIMessage, chunk: TextContent | MarkdownContent, existingIndex: number) {
    if (existingIndex >= 0) {
      const existing = message.content[existingIndex] as TextContent | MarkdownContent;
      existing.data += chunk.data;
    } else {
      message.content.push({
        type: chunk.type,
        data: chunk.data,
        status: 'streaming',
      });
    }
  }

  // 处理思考过程内容
  private handleThinkingContent(message: AIMessage, chunk: ThinkingContent, existingIndex: number) {
    if (existingIndex >= 0) {
      const existing = message.content[existingIndex] as ThinkingContent;
      existing.data = {
        ...existing.data,
        ...chunk.data,
        text: (existing.data?.text || '') + (chunk.data?.text || ''),
      };
    } else {
      message.content.push({
        type: 'thinking',
        data: {
          text: chunk.data?.text || '',
          title: chunk.data?.title || '',
        },
        status: 'streaming',
      });
    }
  }

  // 处理图片内容
  private handleImageContent(message: AIMessage, chunk: ImageContent, existingIndex: number) {
    if (existingIndex >= 0) {
      const existing = message.content[existingIndex] as ImageContent;
      existing.data = {
        ...existing.data,
        ...chunk.data,
      };
    } else {
      message.content.push({
        type: 'image',
        data: chunk.data,
        status: 'streaming',
      });
    }
  }

  // 处理搜索内容
  private handleSearchContent(message: AIMessage, chunk: SearchContent, existingIndex: number) {
    if (existingIndex >= 0) {
      const existing = message.content[existingIndex] as SearchContent;
      const newRefs = chunk.data.filter(
        (newItem) => !existing.data.some((existingItem) => existingItem.url === newItem.url),
      );
      existing.data.push(...newRefs);
    } else {
      message.content.push({
        type: 'search',
        data: chunk.data,
        status: 'streaming',
      });
    }
  }

  // 更新消息整体状态
  private updateMessageStatus(message: AIMessage) {
    // 优先处理错误状态
    if (message.content.some((c) => c.status === 'error')) {
      message.status = 'error';
      return;
    }

    // 检查是否全部完成
    const allComplete = message.content.every(
      (c) => c.status === 'complete' || c.status === 'stop', // 包含停止状态
    );

    message.status = allComplete ? 'complete' : 'streaming';
  }

  setMessageStatus(messageId: string, status: Message['status']) {
    this.setState((draft) => {
      const message = draft.messages[messageId];
      if (message) {
        message.status = status;
      }
    });
  }

  clearHistory() {
    this.setState((draft) => {
      draft.messageIds = [];
      draft.messages = [];
    });
  }

  get currentMessage(): Message {
    const { messages } = this.getState();
    return messages.at(-1);
  }
}

// 订阅消息列表变化
// useEffect(() => {
//   return service.messageStore.subscribe(state => {
//     setMessages(state.messageIds.map(id => state.messages[id]));
//   }, ['messages']);
// }, []);
