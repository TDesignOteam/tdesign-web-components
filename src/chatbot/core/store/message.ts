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

  updateMessageContent(messageId: string, msg: Message) {
    this.setState((draft) => {
      // const message = draft.messages[messageId];
      // console.log('====message', { ...message }, msg);
      // if (msg?.main?.type === 'text') {
      //   message.main.content = msg.main.content;
      // }
      draft.messages[messageId] = {
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
