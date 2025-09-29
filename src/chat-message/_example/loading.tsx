import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';
import { ChatStatus } from 'tdesign-web-components/chat-engine';

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
          role="assistant"
          status="pending"
          content={[
            {
              type: 'text',
              data: '有内容',
            },
          ]}
        ></t-chat-item>
        <t-chat-item
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          role="assistant"
          status="error"
        ></t-chat-item>
        <t-chat-item
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          role="assistant"
          status="error"
          content={[
            {
              type: 'text',
              data: 'status error文案自定义',
            },
          ]}
        ></t-chat-item>
      </>
    );
  }
}
