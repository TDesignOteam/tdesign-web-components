import 'tdesign-web-components/aigc';

import { uniqueId } from 'lodash-es';
import { Component } from 'omi';
import type { BubbleProps } from 'tdesign-web-components/aigc';

const mockUserMsg: BubbleProps = {
  content: '用户消息',
  placement: 'end',
};
const mockAIMsg: BubbleProps = {
  content: 'AI回复',
};

export default class BaseExample extends Component {
  messages: BubbleProps[] = [
    {
      content: '我是你的AI助手',
    },
    {
      content: '我是用户',
      placement: 'end',
    },
  ];

  value: string = 'chat默认';

  private appendMessage = (msg: BubbleProps) => {
    this.messages = [...this.messages, msg];
    this.update();
    console.log('触发了message', this.messages);
  };

  onChange = (e: CustomEvent) => {
    this.value = e.detail;
    this.update();
    console.log('输入', e);
  };

  onSubmit = (e: CustomEvent) => {
    console.log('提交', e);
    this.appendMessage({
      ...mockUserMsg,
      key: uniqueId(),
      content: e.detail,

    });

    setTimeout(() => {
      this.appendMessage({
        ...mockAIMsg,
        key: uniqueId(),
      });
    }, 1000);
  };

  render() {
    return (
      <t-chat
        messages={this.messages}
        inputValue={this.value}
        placeholder="请输入内容"
        onChange={this.onChange}
        onSubmit={this.onSubmit}
      >
        <div slot="header">插入的header</div>
        <div slot="main-top">插入的main-top</div>
        <div slot="main-bottom">插入的main-bottom</div>
        <div slot="input-header">插入的input-header</div>
        <div slot="input-options">插入的input-options</div>
      </t-chat>
    );
  }
}
