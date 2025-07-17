/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import MarkdownIt from 'markdown-it';
import { Component, createRef } from 'omi';
import { findTargetElement, TdChatMessageConfigItem } from 'tdesign-web-components/chatbot';

import type { TdAttachmentItem } from '../../filecard';
import Chatbot from '../chat';
import type { ChatMessagesData } from '../core/type';

// 天气扩展类型定义
declare module '../core/type' {
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

const mockModels = {
  endpoint: 'http://localhost:3000/fetch/normal',
  stream: false,
  onComplete: (isAborted, req, result) => {
    console.log('onComplete', isAborted, req, result);
    if (!isAborted) {
      return {
        type: 'text',
        data: result?.data,
      };
    }
  },
  onError: (err) => {
    console.log('onError', err);
  },
  onAbort: () => {
    console.log('onAbort');
  },
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

const onFileSelect = async (e: CustomEvent<File[]>): Promise<TdAttachmentItem[]> => {
  const attachments: TdAttachmentItem[] = [];

  // 串行处理每个文件
  for (const file of e.detail) {
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
};

const resourceLinkPlugin = (md: MarkdownIt) => {
  // 保存原始链接渲染函数
  const defaultRender = md.renderer.rules.link_open?.bind(md.renderer);

  // 覆盖链接渲染规则
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const href = token.attrGet('href') || '';
    const id = href.split('#promptId=')[1];
    // 识别特殊资源链接
    if (href.startsWith('#promptId')) {
      // 返回自定义DOM结构
      // return `<a part="resource-link"
      //   onclick="this.dispatchEvent(new CustomEvent('resource-link-click', {
      //     bubbles: true,
      //     composed: true,
      //     detail: { resourceId: '${id}'}
      //   }))">`;
      return `<a part="resource-link" data-resource="${id}">`;
    }

    // 普通链接保持默认渲染
    return defaultRender(tokens, idx, options, env, self);
  };
};

export default class BasicChat extends Component {
  chatRef = createRef<Chatbot>();

  clickHandler?: (e: MouseEvent) => void;

  messagePropsFunc = (msg: ChatMessagesData): TdChatMessageConfigItem => {
    const { role, content } = msg;
    if (role === 'user') {
      return {
        variant: 'base',
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      };
    }
    if (role === 'assistant') {
      // 目前仅有单条thinking
      const thinking = content.find((item) => item.type === 'thinking');
      const search = content.find((item) => item.type === 'search');
      return {
        variant: 'outline',
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        actions: ['replay', 'copy', 'good', 'bad'],
        handleActions: {
          replay: (data) => {
            console.log('自定义重新回复', data);
            this.chatRef.current.regenerate();
          },
          good: (data) => {
            console.log('点赞', data);
          },
          bad: (data) => {
            console.log('点踩', data);
          },
          share: (data) => {
            console.log('分享', data);
          },
          copy: (data) => {
            console.log('复制', data);
          },
          suggestion: ({ content }) => {
            this.chatRef.current.addPrompt(content.prompt);
          },
          searchResult: ({ content }) => {
            console.log('searchResult', content);
          },
          searchItem: ({ content, event }) => {
            event.preventDefault();
            event.stopPropagation();
            console.log('searchItem', content);
          },
        },
        chatContentProps: {
          search: {
            collapsed: search?.status === 'complete' ? true : false,
          },
          thinking: {
            maxHeight: 100,
            collapsed: thinking?.status === 'complete' ? true : false,
            layout: 'border',
          },
          markdown: {
            pluginConfig: [resourceLinkPlugin],
          },
        },
      };
    }
  };

  ready() {
    this.chatRef.current.addEventListener('message_action', (e: CustomEvent) => {
      console.log('message_action', e.detail);
    });
    this.clickHandler = (e) => {
      const target = findTargetElement(e, 'a[data-resource]');
      if (target) {
        console.log('捕获资源链接点击:', target.dataset);
      }
    };
    document.addEventListener('mousedown', this.clickHandler);
  }

  uninstall(): void {
    // 移除全局点击监听
    if (this.clickHandler) {
      document.removeEventListener('mousedown', this.clickHandler);
    }
  }

  render() {
    return (
      <t-chatbot
        ref={this.chatRef}
        style={{ display: 'block', height: '80vh' }}
        defaultMessages={[]}
        // autoSendPrompt="自动发送问题"
        messageProps={this.messagePropsFunc}
        listProps={{
          defaultScrollTo: 'top',
        }}
        senderProps={{
          actions: true,
          placeholder: '请输入问题',
          onFileSelect,
        }}
        chatServiceConfig={mockModels}
        onChatReady={(e) => console.log('chatReady', e)}
      ></t-chatbot>
    );
  }
}
