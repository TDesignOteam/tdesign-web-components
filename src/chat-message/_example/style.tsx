import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

import { ChatStatus } from '../../chatbot/core/type';

const userMsg = {
  id: (Math.random() * 10000).toString(),
  role: 'user',
  content: [
    {
      type: 'text',
      data: '这是用来展示提问的测试内容',
    },
  ],
};

const AIMsg = {
  id: (Math.random() * 10000).toString(),
  role: 'assistant',
  status: 'complete',
  content: [
    {
      type: 'text',
      data: '这是用来展示回答的测试内容',
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
          avatar="https://tdesign.gtimg.com/site/avatar.jpg"
          name="张三"
          placement="right"
          message={userMsg}
        ></t-chat-item>
        <t-chat-item
          variant="text"
          animation="circle"
          placement="left"
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          name="DeepSeek"
          message={AIMsg}
        ></t-chat-item>
        <t-chat-item message={{ role: 'system', content: [{ type: 'text', data: '这是系统消息' }] }}></t-chat-item>
        <t-chat-item
          variant="base"
          avatar="https://tdesign.gtimg.com/site/avatar.jpg"
          name="张三"
          placement="right"
          message={userMsg}
        ></t-chat-item>
        <t-chat-item
          variant="outline"
          placement="left"
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          name="DeepSeek"
          message={AIMsg}
        ></t-chat-item>
        <t-chat-item
          variant="outline"
          placement="left"
          animation="skeleton"
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          name="DeepSeek"
          message={{
            role: 'assistant',
            status: 'pending',
          }}
        ></t-chat-item>
      </>
    );
  }
}
