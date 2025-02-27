import './ui/chat-list';
import './ui/chat-input';
import '../button';

import { Component, createRef, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import type { MessageState } from './core/type';
import ChatService from './core';
import type { TdChatListProps, TdChatProps } from './type';

const className = `${getClassPrefix()}-chat`;
@tag('t-chatbot')
export default class Chatbot extends Component<TdChatProps> {
  static css = [];

  static defaultProps = {
    clearHistory: false,
    layout: 'both',
    reverse: false,
    data: [],
  };

  static propTypes = {
    clearHistory: Boolean,
    layout: String,
    data: Array,
    reverse: Boolean,
    modelConfig: Object,
  };

  listRef = createRef<TdChatListProps>();

  private messages;

  private chatService: ChatService;

  private unsubscribe?: () => void;

  install(): void {
    this.chatService = new ChatService(this.props.modelConfig, this.props.data);
    this.subscribeToChat();
    this.messages = this.convertMessages(this.chatService.messageStore.getState());
  }

  uninstall() {
    this.unsubscribe?.();
  }

  // 订阅聊天状态变化
  private subscribeToChat() {
    this.unsubscribe = this.chatService.messageStore.subscribe((state) => {
      this.messages = this.convertMessages(state);
      this.update();
    });
  }

  // 转换消息格式到UI所需格式
  private convertMessages(state: MessageState) {
    return state.messageIds.map((id) => {
      const msg = state.messages[id];
      return { ...msg };
    });
  }

  private handleSend = async (value: string, files?: File[]) => {
    await this.chatService.sendMessage(value, files);
    this.fire('submit', value, {
      composed: true,
    });
    // this.listRef.current?.scrollToBottom();
  };

  private handleStop = () => {
    this.fire('stop');
  };

  private handleClear = (e: Event) => {
    this.fire('clear', e);
  };

  render({ layout, clearHistory, reverse }: OmiProps<TdChatProps>) {
    const layoutClass = layout === 'both' ? `${className}-layout-both` : `${className}-layout-single`;
    return (
      <div className={`${className} ${layoutClass}`}>
        <t-chat-list ref={this.listRef} data={this.messages} reverse={reverse} />
        {clearHistory && (
          <div className={`${className}-clear`}>
            <t-button type="text" onClick={this.handleClear}>
              清空历史记录
            </t-button>
          </div>
        )}
        <div className={`${className}-input-area`}>
          <t-chat-input onSend={this.handleSend} onStop={this.handleStop} />
        </div>
      </div>
    );
  }
}
