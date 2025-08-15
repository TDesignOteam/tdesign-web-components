import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/space';

import { Component } from 'omi';
import { TdChatMessageProps } from 'tdesign-web-components/chatbot';

export default class CustomRenderExample extends Component {
  static css = [
    `
      .weather {
        margin-top: 8px;
        padding: 8px 16px;
        border-radius: 8px;
        background: #ff650f;
        color: #fff;
      }
    `,
  ];

  props: TdChatMessageProps = {
    variant: 'text',
    placement: 'left',
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    message: {
      id: '123',
      content: [
        {
          type: 'weather',
          id: 'w1',
          slotName: 'weather-w1',
          data: {
            temp: 1,
            city: '北京',
            conditions: '多云',
          },
        },
        {
          type: 'text',
          data: '我是文本',
        },
        {
          type: 'weather',
          slotName: 'weather-w2',
          id: 'w2',
          data: {
            temp: 1,
            city: '上海',
            conditions: '小雨',
          },
        },
      ],
      status: 'complete',
      role: 'assistant',
    },
  };

  render() {
    return (
      <>
        <t-chat-item {...this.props}>
          {/* 自定义渲染-植入插槽 */}
          {this.props.message.content.map((item) => {
            switch (item.type) {
              case 'weather':
                return (
                  <div slot={`${item.type}-${item.id}`} className="weather">
                    今天{item.data.city}天气{item.data.conditions}
                  </div>
                );
            }
            return null;
          })}
          <div slot="actionbar">自定义actions</div>
        </t-chat-item>
        <t-chat-item {...this.props}>
          {/* 完全自定义内容 */}
          <div slot="content">自定义内容</div>
          <div slot="actionbar">自定义actions</div>
          <div slot="name">自定义name</div>
          <div slot="datetime">自定义datetime</div>
          <div slot="avatar">自定义头像</div>
        </t-chat-item>
      </>
    );
  }
}
