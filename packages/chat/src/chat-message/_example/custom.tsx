import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';
import { ChatStatus } from 'tdesign-web-components/chat-engine';

export default class BasicExample extends Component {
  inputValue = signal('输入内容');

  status = signal<ChatStatus>('idle');

  render() {
    return (
      <t-chat-sender value={this.inputValue.value} placeholder="请输入内容" status={this.status.value}></t-chat-sender>
    );
  }
}
