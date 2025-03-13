import {
  type AIMessageContent,
  isAIMessage,
  type Message,
  type MessageState,
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
      if (!message) return;
      if (!isAIMessage(message)) return;

      message.status = 'streaming';
      const { content } = message;
      const { type, detail } = chunk;
      const { type: cType, detail: cDetail } = content.at(-1);
      if (type !== cType) return;

      if (type === 'text' || type === 'markdown') {
        content.at(-1).detail = cDetail + detail;
      }

      // 合并主内容（文本流式追加）
      // if (content.type === 'text' || type === 'markdown') {
      //   message.main = this.mergeTextContent(message.main as TextContent, chunk.main);
      // }

      // // 图片内容
      // if (chunk.main && chunk.main.type === 'image') {
      //   message.main = {
      //     ...message.main,
      //     ...(chunk.main.content as ImageContent),
      //   };
      // }

      // // 合并思考过程（覆盖更新）
      // if (chunk.thinking) {
      //   message.thinking = this.mergeThinking(message.thinking, chunk.thinking);
      // }

      // 合并搜索结果（增量更新）
      // if (chunk.search) {
      //   message.search = this.mergeSearchResults(message.search, chunk.search);
      // }
    });
  }

  private mergeTextContent(current?: TextContent, incoming?: TextContent): TextContent {
    if (!current || current.type !== incoming?.type) return incoming || current;

    // 文本类型内容追加
    return {
      ...current,
      content: (current.content || '') + (incoming.content || ''),
    };
  }

  private mergeThinking(current?: ThinkingContent, incoming?: ThinkingContent): ThinkingContent {
    return {
      ...current,
      ...incoming,
      content: (current?.content || '') + (incoming?.content || ''),
    };
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
