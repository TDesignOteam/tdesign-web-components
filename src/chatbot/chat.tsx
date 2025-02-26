import './ui/chat-list';
import './ui/chat-input';
import '../button';

import { uniqueId } from 'lodash-es';
import { Component, createRef, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import type { TdChatListProps,TdChatProps } from './type';

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
  };

  listRef = createRef<TdChatListProps>();

  private messages;

  install(): void {
    this.messages = this.props.data || [];
  }

  private handleSend = (value: string) => {
    console.log('====handleSend value', value);
    this.appendMessage({
      role: 'user',
      key: uniqueId(),
      content: value,
    });
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

  private appendMessage = (msg) => {
    this.messages = [...this.messages, msg];
    this.update();
  };

  render({ layout, clearHistory, reverse }: OmiProps<TdChatProps>) {
    console.log('====this.messages.value', this.messages);
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
