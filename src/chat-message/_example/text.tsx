import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

import { ChatStatus } from '../../chatbot/core/type';

export default class BasicExample extends Component {
  inputValue = signal('输入内容');

  status = signal<ChatStatus>('idle');

  render() {
    return (
      <t-chat-item
        variant="base"
        message={{
          id: 123,
          role: 'user',
          status: 'complete',
          content: [
            {
              type: 'text',
              data: '这是一条纯文本的消息内容，一般用于发送用户消息',
            },
          ],
        }}
      ></t-chat-item>
    );
  }
}
