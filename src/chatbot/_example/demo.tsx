/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import { Component, createRef } from 'omi';
import type { TDChatMessageConfig } from 'tdesign-web-components/chatbot';

import Chatbot from '../chat';
import type { AIMessageContent, ChatMessageType, SSEChunkData } from '../core/type';

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

const initData: ChatMessageType[] = [
  {
    id: '123123123',
    role: 'user',
    status: 'complete',
    content: [
      {
        type: 'text',
        data: '南极的自动提款机叫什么名字？',
      },
    ],
  },
  {
    id: '23132133',
    role: 'assistant',
    status: 'complete',
    content: [
      {
        type: 'markdown',
        data: '**tdesign** 团队的 *核心开发者*  `uyarnchen` 是也。',
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

function handleStructuredData(chunk: SSEChunkData): AIMessageContent {
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
        type: 'weather',
        data: {
          temp: 1,
          city: '北京',
          conditions: '多云',
        },
      };
    }

    default:
      return {
        type: 'text',
        data: chunk?.event === 'complete' ? '' : JSON.stringify(chunk.data),
      };
  }
}

const mockLLMAgent = {
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
      url: 'http://localhost:3000/sse/normal',
      headers: {
        'X-Mock-Key': 'test123',
      },
      body: JSON.stringify({
        session_id: 'session_123456789',
        question: [
          {
            id: messageID,
            content: prompt,
            role: 'user',
          },
        ],
        attachments,
        is_search_net: 1,
      }),
    };
  },
};

const messageProps: TDChatMessageConfig = {
  assistant: {
    onActions: {
      replay: (data, callback) => {
        console.log('自定义重新回复', data);
        callback?.();
      },
      good: (data) => {
        console.log('点赞', data);
      },
      searchResult: (result) => {
        console.log('搜索结果：', result);
      },
    },
    chatContentProps: {
      thinking: {
        maxHeight: 200,
      },
      search: {
        expandable: false,
      },
    },
  },
};

export default class BasicChat extends Component {
  chatRef = createRef<Chatbot>();

  render() {
    return (
      <t-chatbot
        ref={this.chatRef}
        style={{ display: 'block', height: '80vh' }}
        messages={initData}
        messageProps={messageProps}
        chatServiceConfig={mockLLMAgent}
      >
        <div slot="input-header">我是input头部</div>
        {/* 自定义渲染-植入插槽 */}
        {initData
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
