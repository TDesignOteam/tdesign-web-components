import '@tdesign/web-components-chat/chatbot';

import { Component, signal } from 'omi';

export default class BasicExample extends Component {
  inputValue = signal('输入内容');

  loading = signal<boolean>(false);

  handleReadyToSend = (v: string): boolean => {
    console.log('handleReadyToSend', v);
    // 无论内容是否为空，始终允许发送
    return true;
  };

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

  onFocus = (e) => {
    console.log('focus', e);
  };

  onBlur = (e) => {
    console.log('blur', e);
  };

  render() {
    return (
      <t-chat-sender
        value={this.inputValue.value}
        placeholder="请输入内容"
        loading={this.loading.value}
        autosize={{ minRows: 2 }}
        readyToSend={this.handleReadyToSend}
        onChange={this.onChange}
        onSend={this.onSend}
        onStop={this.onStop}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      ></t-chat-sender>
    );
  }
}
