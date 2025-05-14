/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import { Component, createRef, signal } from 'omi';
import type { TdChatCustomRenderConfig, TdChatMessageConfig } from 'tdesign-web-components/chatbot';

import Chatbot from '../chat';
import type { AIContentChunkUpdate, AIMessageContent, ChatMessagesData, SSEChunkData } from '../core/type';

// 天气扩展类型定义
declare module '../core/type' {
  interface AIContentTypeOverrides {
    weather: BaseContent<
      'weather',
      {
        temp: number;
        city: string;
        conditions?: string;
      }
    >;
  }
}

const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    status: 'complete',
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

// 自定义渲染-注册插槽规则
const customRenderConfig: TdChatCustomRenderConfig = {
  weather: (content) => ({
    slotName: `${content.type}-${content.id}`,
  }),
};

const messageProps: TdChatMessageConfig = {
  user: {
    variant: 'text',
    placement: 'right',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    customRenderConfig,
  },
  assistant: {
    variant: 'text',
    placement: 'left',
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    // actions: (preset) => preset,
    customRenderConfig,
  },
  system: {
    customRenderConfig,
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
    `,
  ];

  chatRef = createRef<Chatbot>();

  private mockMessage = signal([]);

  install(): void {
    this.mockMessage.value = mockData;
  }

  ready() {
    this.chatRef.current.addEventListener('message_change', (e: CustomEvent) => {
      console.log('message_change', e.detail);
      this.mockMessage.value = e.detail;
      // this.update();
    });
  }

  render() {
    return (
      <t-chatbot
        ref={this.chatRef}
        style={{ display: 'block', height: '500px' }}
        messages={mockData}
        messageProps={messageProps}
        chatServiceConfig={mockModels}
      >
        <div slot="sender-header">我是input头部</div>
        {/* 自定义渲染-植入插槽 */}
        {this.mockMessage.value
          ?.map((data) =>
            data.content.map((item) => {
              switch (item.type) {
                case 'weather':
                  return (
                    <div slot={`${data.id}-${item.type}-${item.id}`} className="weather">
                      今天{item.data.city}天气{item.data.conditions}
                    </div>
                  );
              }
              return null;
            }),
          )
          .flat()}
      </t-chatbot>
    );
  }
}
