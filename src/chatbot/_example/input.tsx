import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

import { ModelStatus } from '../core/type';

export default class ChatInput extends Component {
  inputValue = signal('传入内容');

  status = signal<ModelStatus>('idle');

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
    this.status.value = 'idle';
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
