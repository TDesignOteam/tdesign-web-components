import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/space';

import { Component } from 'omi';

import { TdChatMessageProps } from '../../chat-message/type';

// customThinking扩展类型定义
declare module '../../chat-engine/type' {
  interface AIContentTypeOverrides {
    customThinking: {
      type: 'customThinking';
      data: {
        title: string;
      };
    };
  }
}

export default class CustomRenderExample extends Component {
  static css = [
    `
      .weather {
        margin: 8px 0;
        padding: 8px 16px;
        border-radius: 8px;
        background: #ff650f;
        color: #fff;
      }
      .thinkingContent {
        height: 130px;
        color: red;
      }
    `,
  ];

  props: TdChatMessageProps = {
    variant: 'text',
    placement: 'left',
    name: '测试',
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    id: '123',
    role: 'assistant',
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
      {
        type: 'customThinking',
        data: {
          title: '自定义thinking内容',
        },
      },
    ],
    status: 'complete',
  };

  render() {
    return (
      <>
        <t-chat-item {...this.props}>
          {/* 自定义渲染-植入插槽 */}
          {this.props.content.map((item, idx) => {
            switch (item.type) {
              case 'weather':
                return (
                  <div slot={`${item.type}-${item.id}`} className="weather">
                    今天{item.data.city}天气{item.data.conditions}
                  </div>
                );
              case 'customThinking':
                return (
                  <t-chat-thinking-content
                    slot={`${item.type}-${idx}`}
                    content={{
                      title: item.data.title,
                    }}
                    status="streaming"
                    animation="moving"
                    maxHeight={50}
                  >
                    <div slot="content" className="thinkingContent">
                      自定义thinking content
                    </div>
                  </t-chat-thinking-content>
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
