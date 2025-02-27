import 'tdesign-web-components/chatbot';

import { Component } from 'omi';

export default class ChatInput extends Component {
  inputValue = '';

  onChange = (e: CustomEvent) => {
    console.log('onChange', e);
    this.inputValue = e.detail;
  };

  onSend = () => {
    console.log('提交', this.inputValue);
  };

  render() {
    return (
      <t-chat-input
        value={this.inputValue}
        placeholder="请输入内容"
        autosize={{ minRows: 2 }}
        autofocus
        onChange={this.onChange}
        onSend={this.onSend}
      ></t-chat-input>
    );
  }
}
