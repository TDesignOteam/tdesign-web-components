import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';
import { TdChatInputStatus } from 'tdesign-web-components/chatbot';

export default class ChatInput extends Component {
  inputValue = signal('传入内容');

  status = signal<TdChatInputStatus>('sent');

  onChange = (e: CustomEvent) => {
    console.log('onChange', e);
    this.inputValue.value = e.detail;
  };

  onSend = () => {
    console.log('提交', this.inputValue);
    this.inputValue.value = '';
    this.status.value = 'pending';
  };

  onStop = () => {
    console.log('停止');
    this.status.value = 'sent';
  };

  render() {
    return (
      <t-chat-input
        value={this.inputValue.value}
        placeholder="请输入内容"
        status={this.status.value}
        textareaProps={{
          autosize: { minRows: 2 },
        }}
        onChange={this.onChange}
        onSend={this.onSend}
        onStop={this.onStop}
      />
    );
  }
}
