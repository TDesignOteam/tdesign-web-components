import 'tdesign-web-components/chatbot';

import { Component } from 'omi';

import type { ContentType, ModelServiceState, ReferenceItem, SSEChunkData } from '../core/type';

const mockData = [
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    id: '223',
    main: {
      type: 'text',
      content: '南极的自动提款机叫什么名字？',
    },
    role: 'user',
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    id: '123',
    main: {
      content: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
    },
    role: 'assistant',
    thinking: {
      type: 'text',
      title: '思考完成',
      status: 'complete',
      content:
        'mock分析语境，首先，Omi是一个基于Web Components的前端框架，和Vue的用法可能不太一样。Vue里的v-html指令用于将字符串作为HTML渲染，防止XSS攻击的话需要信任内容。Omi有没有类似的功能呢？',
    },
    status: 'complete',
  },
];

const defaultChunkParser = (chunk) => {
  try {
    return handleStructuredData(chunk);
  } catch (err) {
    console.error('Parsing error:', err);
    return {
      main: {
        type: 'text' as ContentType,
        content: 'Error parsing response',
      },
    };
  }
};

function handleStructuredData(chunk: SSEChunkData): ReturnType<any> {
  if (!chunk?.data || typeof chunk === 'string') {
    return {
      main: {
        type: 'text',
        content: chunk,
      },
    };
  }

  const { type, ...rest } = chunk.data;
  switch (type) {
    case 'search':
      return {
        search: {
          title: (rest.title as string) || '搜索结果',
          content: Array.isArray(rest.content) ? (rest.content as ReferenceItem[]) : [],
        },
      };

    case 'think':
      return {
        thinking: {
          title: (rest.title as string) || '思考中...',
          type: 'text',
          content: (rest.content as string) || '',
        },
      };

    case 'text': {
      return {
        main: {
          type: 'markdown',
          content: rest?.msg || '',
        },
      };
    }

    default:
      return {
        main: {
          type: 'text',
          content: chunk?.event === 'complete' ? '' : JSON.stringify(chunk.data),
        },
      };
  }
}

const mockModels: ModelServiceState = {
  model: 'hunyuan',
  useThink: true,
  useSearch: false,
  config: {
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
      const { prompt, messageID } = params;
      return {
        credentials: 'include',
        headers: {
          'X-Mock-Key': 'test123',
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
          is_search_net: 1,
        }),
      };
    },
  },
};

export default class BasicChat extends Component {
  onSubmit = () => {};

  render() {
    return <t-chatbot data={mockData} modelConfig={mockModels} onSubmit={this.onSubmit}></t-chatbot>;
  }
}
