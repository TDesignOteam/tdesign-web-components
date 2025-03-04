import type { Message, MessageState } from '../type';
import ReactiveState from './reactiveState';

// 专注消息生命周期管理
export class MessageStore extends ReactiveState<MessageState> {
  constructor(initialState?: Partial<MessageState>) {
    super({
      messageIds: [],
      messages: {},
      ...initialState,
    });
  }

  createMessage(message: Omit<Message, 'id'>): string {
    const messageId = `msg_${Date.now()}_${Math.floor(Math.random() * 90000) + 10000}`;
    this.setState((draft) => {
      draft.messageIds.push(messageId);
      draft.messages[messageId] = {
        ...message,
        id: messageId,
      };
    });
    return messageId;
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
