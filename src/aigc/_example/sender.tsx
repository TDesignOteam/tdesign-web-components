import 'tdesign-web-components/aigc';

import { Component } from 'omi';

export default class SenderExample extends Component {
  value: string = '默认';

  onChange = (v) => {
    this.value = v;
    this.update();
    console.log('输入', v);
  };

  onSubmit = (v) => {
    console.log('提交', v);
  };

  render() {
    return (
      <t-chat-sender value={this.value} placeholder="请输入" onChange={this.onChange} onSubmit={this.onSubmit}>
        <span slot="header-content">插入的header-content</span>
        <span slot="options">插入的options</span>
      </t-chat-sender>
    );
  }
}
