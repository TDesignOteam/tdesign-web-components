/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import { Component } from 'omi';

import type { Attachment } from '../../filecard';
import type { ContentType, ModelServiceState, ReferenceItem, SSEChunkData } from '../core/type';

const mockData = [
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    message: {
      id: '223',
      content: '南极的自动提款机叫什么名字？',
      role: 'user',
    },
    attachments: [
      {
        type: 'image',
        fileName: 'avatar.jpg',
        url: 'https://tdesign.gtimg.com/site/avatar.jpg',
      },
    ],
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    message: {
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
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    message: {
      id: '456',
      content: '总结一下这篇文章',
      role: 'user',
    },
    attachments: [
      {
        type: 'pdf',
        fileName: 'demo.pdf',
        url: 'https://tdesign.gtimg.com/site/demo.pdf',
      },
    ],
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
      const { prompt, messageID, attachments = [] } = params;
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
          attachments,
          is_search_net: 1,
        }),
      };
    },
  },
};

const attachmentProps = {
  onFileSelected: async (files: Attachment[]): Promise<Attachment[]> => {
    const attachments: Attachment[] = [];

    // 串行处理每个文件
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file.raw);

        // 上传单个文件
        const response = await fetch(`/file/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) continue; // 跳过失败文件

        const data = await response.json();

        // 构造附件对象
        attachments.push({
          type: 'image',
          name: file.name,
          size: file.size,
          url: data.result.cdnurl,
        });
      } catch (error) {
        console.error(`${file.name} 上传失败:`, error);
        // 可选：记录失败文件信息到错误日志
      }
    }

    return attachments;
  },
  onFileRemove: () => {},
};

export default class BasicChat extends Component {
  render() {
    return <t-chatbot data={mockData} modelConfig={mockModels} attachmentProps={attachmentProps}></t-chatbot>;
  }
}
