import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

import { ChatStatus } from '../../chatbot/core/type';

const msg = {
  id: (Math.random() * 10000).toString(),
  content: [
    {
      type: 'text',
      data: '这是用来展示各种消息样式的测试内容',
    },
  ],
};

export default class BasicExample extends Component {
  inputValue = signal('输入内容');

  status = signal<ChatStatus>('idle');

  render() {
    return (
      <>
        <t-chat-item
          variant="base"
          role="user"
          avatar="https://tdesign.gtimg.com/site/avatar.jpg"
          name="张三"
          message={msg}
        ></t-chat-item>
        <t-chat-item variant="text" message={msg}></t-chat-item>
        <t-chat-item variant="outline" message={msg}></t-chat-item>
      </>
    );
  }
}
