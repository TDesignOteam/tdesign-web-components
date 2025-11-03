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
          role="assistant"
          status="pending"
        ></t-chat-item>
        <t-chat-item
          variant="text"
          placement="left"
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          name="DeepSeek"
          role="assistant"
          animation="circle"
          status="pending"
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
              data: '自定义错误内容',
            },
          ]}
        ></t-chat-item>
        <t-chat-item
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          role="assistant"
          status="error"
          content={[
            {
              type: 'myerror',
              data: 'status error文案自定义',
            },
          ]}
        >
          {[
            {
              type: 'myerror',
              data: 'status error文案自定义',
            },
          ].map((item, idx) => {
            switch (item.type) {
              case 'myerror':
                return (
                  <div slot={`${item.type}-${idx}`} className="error-content">
                    {`自定义渲染错误：${item.data}`}
                  </div>
                );
            }
            return null;
          })}
        </t-chat-item>
      </>
    );
  }
}
