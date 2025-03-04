import 'tdesign-web-components/chatbot';

import { Component } from 'omi';

import type { ContentType, ModelServiceState, ReferenceItem } from '../core/type';

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
      status: 'sent',
      content:
        'mock分析语境，首先，Omi是一个基于Web Components的前端框架，和Vue的用法可能不太一样。Vue里的v-html指令用于将字符串作为HTML渲染，防止XSS攻击的话需要信任内容。Omi有没有类似的功能呢？',
    },
  },
];

const defaultChunkParser = (chunk) => {
  try {
    const data = typeof chunk === 'string' ? tryParseJson(chunk) : chunk;
    return handleStructuredData(data);
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

function tryParseJson(str: string) {
  // 清洗SSE格式数据
  const cleanedStr = str
    .replace(/^data:\s*/, '') // 去除SSE前缀
    .replace(/\n\n$/, ''); // 去除结尾换行

  try {
    return JSON.parse(cleanedStr);
  } catch {
    // 包含多层data:前缀的特殊情况处理
    const deepCleaned = cleanedStr.replace(/(\bdata:\s*)+/g, '');
    try {
      return JSON.parse(deepCleaned);
    } catch {
      return { type: 'text', msg: deepCleaned };
    }
  }
}

function handleStructuredData(data: unknown): ReturnType<any> {
  if (!data || typeof data !== 'object') {
    return {
      main: {
        type: 'text',
        content: String(data),
      },
    };
  }

  const { type, ...rest } = data as Record<string, unknown>;

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
      const content = 'msg' in data ? (data as any).msg : JSON.stringify(data);
      return {
        main: {
          type: 'markdown',
          content: content || '',
        },
      };
    }

    default:
      return {
        main: {
          type: 'text',
          content: JSON.stringify(data),
        },
      };
  }
}

const mockModels: ModelServiceState = {
  model: 'hunyuan',
  useThink: true,
  useSearch: false,
  config: {
    endpoint: '/mock-api',
    stream: true,
    parseResponse: defaultChunkParser,
    parseRequest: (params) => {
      const { prompt, ...rest } = params;
      return {
        headers: {
          'X-Mock-Key': 'test123',
        },
        body: JSON.stringify({
          msg: prompt,
          ...rest,
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
