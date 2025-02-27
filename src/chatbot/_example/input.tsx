import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

export default class ChatInput extends Component {
  inputValue = signal('');

  onChange = (e: CustomEvent) => {
    console.log('onChange', e);
    this.inputValue.value = e.detail;
  };

  onSend = () => {
    console.log('提交', this.inputValue);
    this.inputValue.value = '';
  };

  render() {
    return (
      <t-chat-input
        value={this.inputValue.value}
        placeholder="请输入内容"
        autosize={{ minRows: 2 }}
        onChange={this.onChange}
        onSend={this.onSend}
      ></t-chat-input>
    );
  }
}
