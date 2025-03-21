import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/space';

import { Component } from 'omi';
import { TdChatItemProps } from 'tdesign-web-components/chatbot';

export default class CustomRenderExample extends Component {
  static css = [
    `
      .item::part(weather) {
        margin-top: 8px;
        padding: 8px 16px;
        border-radius: 8px;
        background: #ff650f;
        color: #fff;
      }
    `,
  ];

  props: TdChatItemProps = {
    variant: 'text',
    placement: 'left',
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    customRenderer: {
      weather: (content) => (
        <div part="weather">
          今天{content.data.city}天气{content.data.conditions}
        </div>
      ),
    },
    message: {
      id: '123',
      content: [
        {
          type: 'weather',
          data: {
            temp: 1,
            city: '北京',
            conditions: '多云',
          },
        },
        {
          type: 'weather',
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
    return <t-chat-item className="item" {...this.props} />;
  }
}
