import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/space';

import { Component } from 'omi';
import { TDChatItemProps } from 'tdesign-web-components/chatbot';

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

  props: TDChatItemProps = {
    variant: 'text',
    placement: 'left',
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    // 自定义渲染-注册插槽规则
    customRenderConfig: {
      weather: (content) => ({
        slotName: `${content.type}-${content.id}`,
      }),
    },
    message: {
      id: '123',
      content: [
        {
          type: 'weather',
          id: 'w1',
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
        <div slot="actions">自定义actions</div>
      </t-chat-item>
    );
  }
}
