import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

export default class BasicExample extends Component {
  inputValue = signal('输入内容');

  loading = signal<boolean>(false);

  onChange = (e: CustomEvent) => {
    console.log('onChange', e);
    this.inputValue.value = e.detail;
  };

  onSend = (e) => {
    console.log('提交', e);
    this.inputValue.value = '';
    this.loading.value = true;
  };

  onStop = () => {
    console.log('停止');
    this.loading.value = false;
  };

  render() {
    return (
      <t-chat-sender
        value={this.inputValue.value}
        placeholder="请输入内容"
        loading={this.loading.value}
        autosize={{ minRows: 2 }}
        onChange={this.onChange}
        onSend={this.onSend}
        onStop={this.onStop}
      ></t-chat-sender>
    );
  }
}
