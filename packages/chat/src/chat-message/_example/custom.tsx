import '@tdesign/web-components-chat/chatbot';

import { ChatStatus } from '@tdesign/web-components-chat/chat-engine';
import { Component, signal } from 'omi';

export default class BasicExample extends Component {
  inputValue = signal('输入内容');

  status = signal<ChatStatus>('idle');

  render() {
    return (
      <t-chat-sender value={this.inputValue.value} placeholder="请输入内容" status={this.status.value}></t-chat-sender>
    );
  }
}
