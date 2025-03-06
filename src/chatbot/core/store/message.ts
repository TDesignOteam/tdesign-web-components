import type { ChunkParsedResult, Message, MessageState, ModelStatus, TextContent, ThinkingContent } from '../type';
import ReactiveState from './reactiveState';

// 专注消息生命周期管理
export class MessageStore extends ReactiveState<MessageState> {
  constructor(initialState?: Partial<MessageState>) {
    super({
      messageIds: [],
      messages: {},
      ...initialState,
      modelStatus: 'idle',
    });
  }

  createMessage(message: Message) {
    const { id } = message;
    this.setState((draft) => {
      draft.messageIds.push(id);
      draft.messages[id] = {
        ...message,
        id,
      };
    });
  }

  createMultiMessages(messages: Message[]) {
    for (const msg of messages) {
      this.setState((draft) => {
        draft.messageIds.push(msg.id);
        draft.messages[msg.id] = msg;
      });
    }
  }

  appendContent(messageId: string, chunk: ChunkParsedResult) {
    this.setState((draft) => {
      const message = draft.messages[messageId];
      if (!message) return;

      message.status = 'streaming';
      // 合并主内容（文本流式追加）
      if (chunk.main && (chunk.main.type === 'text' || chunk.main.type === 'markdown')) {
        message.main = this.mergeTextContent(message.main as TextContent, chunk.main);
      }

      // 合并思考过程（覆盖更新）
      if (chunk.thinking) {
        message.thinking = this.mergeThinking(message.thinking, chunk.thinking);
      }

      // 合并搜索结果（增量更新）
      // if (chunk.search) {
      //   message.search = this.mergeSearchResults(message.search, chunk.search);
      // }

      // 更新状态（如果有）
      // if (chunk.status) {
      //   message.status = chunk.status;
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

  updateContent(messageId: string, msg: Partial<Message>) {
    console.log('====updateContent msg', msg?.main?.content);
    this.setState((draft) => {
      const message = draft.messages[messageId];
      draft.messages[messageId] = {
        ...message,
        ...msg,
      };
    });
  }

  setModelStatus(status: ModelStatus) {
    this.setState((draft) => {
      draft.modelStatus = status;
    });
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
      draft.messages = {};
    });
  }
}

// 订阅消息列表变化
// useEffect(() => {
//   return service.messageStore.subscribe(state => {
//     setMessages(state.messageIds.map(id => state.messages[id]));
//   }, ['messages']);
// }, []);
