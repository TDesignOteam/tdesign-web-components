/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import { Component, createRef, signal } from 'omi';
import type {
  AIContentChunkUpdate,
  AIMessageContent,
  ChatMessagesData,
  SSEChunkData,
} from 'tdesign-web-components/chat-engine';
import type { TdChatMessageConfig } from 'tdesign-web-components/chatbot';

import Chatbot from '../chat';

// 天气扩展类型定义
declare module 'tdesign-web-components/chat-engine/type' {
  interface AIContentTypeOverrides {
    weather: {
      type: 'weather';
      data: {
        temp: number;
        city: string;
        conditions?: string;
      };
      id?: string;
      slotName?: string;
    };
  }
}
const mockData: ChatMessagesData[] = [
  {
    id: '7389',
    role: 'user',
    status: 'complete',
    content: [
      {
        type: 'text',
        data: '这张图里的帅哥是谁',
      },
      {
        type: 'videoAttachment',
        data: {
          fileType: 'video',
          url: 'test.mp4',
          cover:
            'https://asset.gdtimg.com/muse_svp_0bc3viaacaaaweanalstw5ud3kweagvaaaka.f0.jpg?dis_k=bfc5cc81010a9d443e91ce45d4fbe774&dis_t=1750323484',
        },
      },
    ],
  },
  {
    id: '123',
    role: 'assistant',
    status: 'complete',
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
        id: 'w2',
        slotName: 'weather-w2',
        data: {
          temp: 1,
          city: '上海',
          conditions: '小雨',
        },
      },
    ],
  },
];

const defaultChunkParser = (chunk): AIMessageContent => {
  try {
    return handleStructuredData(chunk);
  } catch (err) {
    console.error('Parsing error:', err);
    return {
      type: 'text',
      data: '内容解析错误',
    };
  }
};

function handleStructuredData(chunk: SSEChunkData): AIContentChunkUpdate {
  if (!chunk?.data || typeof chunk === 'string') {
    return {
      type: 'markdown',
      data: String(chunk),
    };
  }

  const { type, ...rest } = chunk.data;
  switch (type) {
    case 'think':
      return {
        type: 'thinking',
        data: {
          title: rest.title || '思考中...',
          text: rest.content || '',
        },
      };

    case 'text': {
      return {
        type: 'markdown',
        data: rest?.msg || '',
      };
    }

    case 'image': {
      return {
        type: 'image',
        data: { ...JSON.parse(chunk.data.content) },
      };
    }

    case 'weather': {
      return {
        ...chunk.data,
        slotName: `weather-${chunk.data.id}`,
        data: { ...JSON.parse(chunk.data.content) },
        strategy: 'append',
      };
    }

    default:
      return {
        type: 'text',
        data: chunk?.event === 'complete' ? '' : JSON.stringify(chunk.data),
      };
  }
}

const messageProps: TdChatMessageConfig = {
  user: {
    variant: 'base',
    placement: 'right',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  assistant: {
    variant: 'base',
    placement: 'left',
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    // actions: (preset) => preset,
  },
};

const mockModels = {
  endpoint: 'http://localhost:3000/sse/normal',
  stream: true,
  onComplete: () => {
    console.log('onComplete');
  },
  onError: (err) => {
    console.log('onError', err);
  },
  onMessage: defaultChunkParser,
  onRequest: (params) => {
    const { prompt, messageID, attachments = [] } = params;
    return {
      headers: {
        'X-Mock-Key': 'test123',
        'Content-Type': 'text/event-stream',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        session_id: 'session_123456789',
        question: [
          {
            id: messageID,
            content: prompt,
            create_at: Date.now(),
            role: 'user',
          },
        ],
        attachments,
        is_search_net: 1,
      }),
    };
  },
};

export default class BasicChat extends Component {
  static css = [
    `
      .weather {
        margin-top: 8px;
        padding: 8px 16px;
        border-radius: 8px;
        background: #ff650f;
        color: #fff;
      }

      .chatbot::part(t-chat__input__content) {
        border-color: red;
      }

      .chatbot::part(t-textarea__inner) {
        padding: 12px;
        border-radius: 8px;
        background: #a2e8ff;
      }
      .chatbot::part(t-textarea__inner):hover {
        background: #ffa2a2;
      }
    `,
  ];

  chatRef = createRef<Chatbot>();

  private mockMessage = signal([]);

  install(): void {
    this.mockMessage.value = mockData;
  }

  messageChangeHandler = (e: CustomEvent) => {
    console.log('message_change', e.detail);
    this.mockMessage.value = e.detail;
  };

  render() {
    return (
      <t-chatbot
        class="chatbot"
        ref={this.chatRef}
        style={{ display: 'block', height: '500px' }}
        defaultMessages={mockData}
        senderProps={{
          defaultValue: '自定义输入框样式',
        }}
        messageProps={messageProps}
        chatServiceConfig={mockModels}
        onMessageChange={this.messageChangeHandler}
      >
        <div slot="sender-header">我是input头部</div>
        {/* 自定义渲染-植入插槽 */}
        {this.mockMessage.value
          ?.map((data) =>
            data.content.map((item, index) => {
              switch (item.type) {
                case 'weather':
                  return (
                    <div slot={`${data.id}-${item.type}-${item.id}`} className="weather">
                      今天{item.data.city}天气{item.data.conditions}
                    </div>
                  );
                case 'videoAttachment': {
                  return (
                    <div slot={`${data.id}-${item.type}-${index}`} className="videoAttachment">
                      <img src={item.data.cover} width={100} height={100} />
                    </div>
                  );
                }
              }
              return null;
            }),
          )
          .flat()}
      </t-chatbot>
    );
  }
}
