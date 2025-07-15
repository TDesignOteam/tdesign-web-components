/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import { Component, createRef } from 'omi';
import { TdChatMessageConfigItem } from 'tdesign-web-components/chatbot';

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

export default class BasicChat extends Component {
  chatRef = createRef<Chatbot>();

  clickHandler?: (e: MouseEvent) => void;

  messagePropsFunc = (msg: ChatMessagesData): TdChatMessageConfigItem => {
    const { role } = msg;
    if (role === 'user') {
      return {
        variant: 'base',
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      };
    }
    if (role === 'assistant') {
      // 目前仅有单条thinking
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
        },
      };
    }
  };

  private mockModels = {
    endpoint: 'http://localhost:3000/fetch/normal',
    stream: false,
    onComplete: (isAborted, req, result) => {
      if (!isAborted) {
        return {
          type: 'text',
          data: result.data,
        };
      }
    },
    onError: (err) => {
      console.log('onError', err);
    },
    onAbort: () => {
      console.log('onAbort');
      this.chatRef.current?.sendSystemMessage('用户已暂停');
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
        chatServiceConfig={this.mockModels}
      ></t-chatbot>
    );
  }
}
