import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

export default class ChatInput extends Component {
  inputValue = signal('传入内容');

  pending = signal(true);

  onChange = (e: CustomEvent) => {
    console.log('onChange', e);
    this.inputValue.value = e.detail;
  };

  onSend = () => {
    console.log('提交', this.inputValue);
    this.inputValue.value = '';
    this.pending.value = true;
  };

  onStop = () => {
    console.log('停止');
    this.pending.value = false;
  };

  render() {
    return (
      <t-chat-input
        value={this.inputValue.value}
        placeholder="请输入内容"
        pending={this.pending.value}
        autosize={{ minRows: 2 }}
        onChange={this.onChange}
        onSend={this.onSend}
        onStop={this.onStop}
      />
    );
  }
}
