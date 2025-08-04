import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

import { ChatStatus } from '../../chatbot/core/type';

export default class BasicExample extends Component {
  inputValue = signal('输入内容');

  status = signal<ChatStatus>('idle');

  render() {
    return (
      <>
        <t-chat-item
          variant="text"
          placement="left"
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          name="DeepSeek"
          animation="skeleton"
          message={{
            role: 'assistant',
            status: 'pending',
            content: [
              {
                type: 'text',
                data: '有内容',
              },
            ],
          }}
        ></t-chat-item>
        <t-chat-item
          variant="outline"
          placement="left"
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          name="DeepSeek"
          message={{
            role: 'assistant',
            status: 'stop',
            content: [
              {
                type: 'text',
                data: '有内容',
              },
            ],
          }}
        ></t-chat-item>
        <t-chat-item
          variant="outline"
          placement="left"
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          name="DeepSeek"
          message={{
            role: 'assistant',
            status: 'error',
            content: [
              {
                type: 'text',
                data: '有内容',
              },
            ],
          }}
        ></t-chat-item>
      </>
    );
  }
}
