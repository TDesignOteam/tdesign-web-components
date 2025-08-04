/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import Cherry from '@cherry-markdown/cherry-markdown-dev/dist/cherry-markdown.core';
import { Component } from 'omi';
import type { TdChatMessageConfig, TdChatMessageProps } from 'tdesign-web-components/chatbot';

import { TdChatMarkdownContentProps } from '../../chat-message/content/markdown-content';
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
        data: '我是内容!!我是自定义markdown结构，点击我!!我是后面的内容，测试***我是内容***。这是一个链接 [Markdown语法](https://markdown.com.cn)，[这是一个自定义特殊链接](#promptId=atm)',
      },
    ],
  },
];

/**
 * markdown自定义插件，请参考cherry-markdown定义插件的方法，事件触发需考虑shadowDOM隔离情况
 * https://github.com/Tencent/cherry-markdown/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%AD%E6%B3%95
 */
const colorText = Cherry.createSyntaxHook('important', Cherry.constants.HOOKS_TYPE_LIST.SEN, {
  makeHtml(str) {
    return str.replace(
      this.RULE.reg,
      (_whole, _m1, m2) =>
        `<span part="md-color-text" onclick="this.dispatchEvent(new CustomEvent('color-text-click', { bubbles: true, composed: true, detail: { content: '${m2}' }}))">${m2}</span>`,
    );
  },
  rule() {
    // 匹配 !!...!! 语法
    // eslint-disable-next-line no-useless-escape
    return { reg: /(\!\!)([^\!]+)\1/g };
  },
});

const mdConfig: TdChatMarkdownContentProps = {
  options: {
    engine: {
      global: {
        htmlAttrWhiteList: 'part|onclick',
      },
      customSyntax: {
        colorTextHook: {
          syntaxClass: colorText,
          force: false,
        },
      },
    },
  },
};

const commonRoleConfig: Partial<TdChatMessageProps> = {
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
        defaultMessages={mockData}
        messageProps={messageProps}
        chatServiceConfig={mockModels}
      ></t-chatbot>
    );
  }
}
