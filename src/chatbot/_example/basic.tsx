/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import { Component } from 'omi';
import type { TdChatItemProps } from 'tdesign-web-components/chatbot';

import type { Attachment } from '../../filecard';
import type { AIMessageContent, ContentType, ModelServiceState, ReferenceItem, SSEChunkData } from '../core/type';

const mockData: TdChatItemProps[] = [
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    message: {
      id: '223',
      role: 'user',
      status: 'complete',
      content: [
        {
          type: 'text',
          data: '南极的自动提款机叫什么名字？',
        },
      ],
    },
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    message: {
      id: '123',
      role: 'assistant',
      status: 'complete',
      content: [
        {
          type: 'thinking',
          status: 'complete',
          data: {
            title: '思考完成（耗时3s）',
            text: 'mock分析语境，首先，Omi是一个基于Web Components的前端框架，和Vue的用法可能不太一样。Vue里的v-html指令用于将字符串作为HTML渲染，防止XSS攻击的话需要信任内容。Omi有没有类似的功能呢？',
          },
        },
        {
          type: 'text',
          data: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
        },
      ],
    },
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    message: {
      id: '789',
      role: 'user',
      status: 'complete',
      content: [
        {
          type: 'text',
          data: '分析下以下内容，总结一篇广告策划方案',
        },
        {
          type: 'attachment',
          data: [
            {
              fileType: 'doc',
              name: 'demo.docx',
              url: 'https://tdesign.gtimg.com/site/demo.docx',
              size: 12312,
            },
            {
              fileType: 'pdf',
              name: 'demo.pdf',
              url: 'https://tdesign.gtimg.com/site/demo.pdf',
              size: 3433,
            },
          ],
        },
      ],
    },
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    message: {
      id: '34234',
      status: 'error',
      role: 'assistant',
      content: [
        {
          type: 'text',
          data: '出错了',
        },
      ],
    },
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    message: {
      id: '7389',
      role: 'user',
      status: 'complete',
      content: [
        {
          type: 'text',
          data: '这张图里的帅哥是谁',
        },
        {
          type: 'attachment',
          data: [
            {
              fileType: 'image',
              name: 'avatar.jpg',
              size: 234234,
              url: 'https://tdesign.gtimg.com/site/avatar.jpg',
            },
          ],
        },
      ],
    },
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    message: {
      id: '3242',
      role: 'assistant',
      status: 'complete',
      content: [
        {
          type: 'markdown',
          data: '**tdesign** 团队的 *核心开发者*  `uyarnchen` 是也。',
        },
      ],
    },
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

function handleStructuredData(chunk: SSEChunkData): AIMessageContent {
  if (!chunk?.data || typeof chunk === 'string') {
    return {
      main: {
        type: 'text',
        content: String(chunk),
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

    case 'image': {
      return {
        main: {
          type: 'image',
          content: JSON.parse(rest?.content),
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
  onFileSelected: async (files: File[]): Promise<Attachment[]> => {
    const attachments: Attachment[] = [];

    // 串行处理每个文件
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        // 上传单个文件
        const response = await fetch(`http://localhost:3000/file/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) continue; // 跳过失败文件

        const data = await response.json();

        // 构造附件对象
        const { name, size, type } = file;
        attachments.push({
          url: data.result.cdnurl,
          status: 'success',
          name,
          type,
          size,
          raw: file,
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
    return (
      <t-chatbot
        style={{ display: 'block', height: '80vh' }}
        data={mockData}
        modelConfig={mockModels}
        attachmentProps={attachmentProps}
      ></t-chatbot>
    );
  }
}
