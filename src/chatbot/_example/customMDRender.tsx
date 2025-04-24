/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import MarkdownIt from 'markdown-it';
import { Component } from 'omi';
import type { TdChatItemProps, TdChatMarkdownContentProps, TdChatMessageConfig } from 'tdesign-web-components/chatbot';

import type { AIMessageContent, ChatMessagesData, SSEChunkData } from '../core/type';

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

    default:
      return {
        type: 'text',
        data: chunk?.event === 'complete' ? '' : JSON.stringify(chunk.data),
      };
  }
}

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
// =========上方不重要===========

const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    status: 'complete',
    content: [
      {
        type: 'markdown',
        data: '我是内容!!我是自定义markdown结构，点击我!!我是后面的内容',
      },
    ],
  },
];

// markdown自定义插件，请参考markdown-it定义插件的方法，事件触发需考虑shadowDOM隔离情况
const colorTextPlugin = (md: MarkdownIt) => {
  // 定义自定义渲染规则
  md.inline.ruler.before('emphasis', 'color', (state, silent) => {
    // 匹配 !!...!! 语法
    const marker = '!!';
    const startPos = state.pos;

    if (state.src.slice(startPos, startPos + 2) !== marker) return false;
    const endPos = state.src.indexOf(marker, startPos + 2);
    if (endPos === -1) return false;

    // 提取内容
    const content = state.src.slice(startPos + 2, endPos);

    // 创建 Token
    if (!silent) {
      const token = state.push('color_open', 'span', 1);
      token.attrs = [
        ['part', 'md-color-text'],
        ['data-content', encodeURIComponent(content)], // 编码内容用于安全传输
      ];

      state.push('text', '', 0).content = content;
      state.push('color_close', 'span', -1);
    }

    // 更新解析位置
    state.pos = endPos + 2;
    return true;
  });

  // 自定义渲染规则（添加事件派发）
  md.renderer.rules.color_open = (tokens, idx) => {
    const { attrs } = tokens[idx];
    const content = decodeURIComponent(attrs.find((a) => a[0] === 'data-content')[1]);

    return `
      <span part="${attrs.find((a) => a[0] === 'part')[1]}"
        onclick="this.dispatchEvent(new CustomEvent('color-text-click', { 
          bubbles: true, 
          composed: true,
          detail: { content: '${content.replace(/'/g, "\\'")}' }
        }))">
    `;
  };
};

const mdConfig: TdChatMarkdownContentProps = {
  options: {
    html: true, // 允许HTML标签
    breaks: true, // 自动换行
    typographer: true, // 排版优化
  },
  pluginConfig: [colorTextPlugin],
};

const commonRoleConfig: Partial<TdChatItemProps> = {
  chatContentProps: {
    markdown: {
      ...mdConfig,
    },
  },
};
const messageProps: TdChatMessageConfig = {
  user: {
    ...commonRoleConfig,
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  assistant: {
    ...commonRoleConfig,
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    actions: (preset) => preset,
  },
  system: {
    ...commonRoleConfig,
  },
};

export default class BasicChat extends Component {
  static css = [];

  clickTextHandler = (e: CustomEvent) => {
    console.log('点击:', e.detail.content);
  };

  ready(): void {
    // 处理markdown自定义元素点击事件
    // 注意：只有 composed: true 时才能在此捕获
    document.addEventListener('color-text-click', this.clickTextHandler);
  }

  uninstall(): void {
    document.removeEventListener('color-text-click', this.clickTextHandler);
  }

  render() {
    return (
      <t-chatbot
        css={`
          .t-chat-item-wrapper::part(md-color-text) {
            color: red;
          }
        `}
        style={{ display: 'block', height: '500px' }}
        messages={mockData}
        messageProps={messageProps}
        chatServiceConfig={mockModels}
      ></t-chatbot>
    );
  }
}
