import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

import { ChatStatus } from '../../chatbot/core/type';

export default class BasicExample extends Component {
  inputValue = signal('输入内容');

  status = signal<ChatStatus>('idle');

  render() {
    return (
      <t-chat-input value={this.inputValue.value} placeholder="请输入内容" status={this.status.value}></t-chat-input>
    );
  }
}
