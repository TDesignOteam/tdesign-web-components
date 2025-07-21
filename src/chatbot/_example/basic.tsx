/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import { Component, createRef } from 'omi';
import { findTargetElement, TdChatMessageConfigItem } from 'tdesign-web-components/chatbot';

import type { TdAttachmentItem } from '../../filecard';
import Chatbot from '../chat';
import type { AIMessageContent, ChatMessagesData, SSEChunkData } from '../core/type';

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

function extractMarkdownLinks(msg: string): Array<{ title: string; url?: string }> {
  const linkRegex = /\[(.*?)\]\(#prompt:(.*?)\)/g;
  const matches = [];
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = linkRegex.exec(msg)) !== null) {
    matches.push({
      title: match[1].trim(),
      prompt: match[2].trim(),
    });
  }

  return matches;
}

const mockData: ChatMessagesData[] = [
  {
    id: 's1123',
    role: 'system',
    status: 'complete',
    content: [
      {
        type: 'text',
        data: '系统通知：初始化完成',
      },
    ],
  },
  {
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
  {
    id: '123',
    role: 'assistant',
    status: 'complete',
    content: [
      {
        type: 'search',
        status: 'complete',
        data: {
          title: '共找到10个相关内容',
          references: [
            {
              title: '10本高口碑悬疑推理小说,情节高能刺激,看得让人汗毛直立!',
              url: 'http://mp.weixin.qq.com/s?src=11&timestamp=1742897036&ver=5890&signature=USoIrxrKY*KWNmBLZTGo-**yUaxdhqowiMPr0wsVhH*dOUB3GUjYcBVG86Dyg7-TkQVrr0efPvrqSa1GJFjUQgQMtZFX5wxjbf8TcWkoUxOrTA7NsjfNQQoVY5CckmJj&new=1',
              type: 'mp',
            },
            {
              title: '悬疑小说下载:免费畅读最新悬疑大作!',
              url: 'http://mp.weixin.qq.com/s?src=11&timestamp=1742897036&ver=5890&signature=UCc6xbIGsYEyfytL2IC6b3vXlaBcbEJCi98ZVK38vdoFEEulJ3J-95bNkE8Fiv5-pJ5iH75DfJAz6kGX2TSscSisBNW1u6nCPbP-Ue4HxCAfjU8DpUwaOXkFz3*T71rU&new=1',
              type: 'mp',
            },
            {
              title: '悬疑推理类小说五本 22',
              url: 'http://mp.weixin.qq.com/s?src=11&timestamp=1742897036&ver=5890&signature=Fh*UdzlSG9IgB8U4n9t5qSWHA73Xat54ReUUgCZ5hUgW8QyEwPwoBFQzrfsWP9UCN0T6Zpfg5rMYSqKvrkP6Njp-ggxnym8YOSbDYLFB4uqMH14FDcq7*aAmN*8C3aSL&new=1',
              type: 'mp',
            },
            {
              title: '悬疑推理类小说五本 25',
              url: 'http://mp.weixin.qq.com/s?src=11&timestamp=1742897036&ver=5890&signature=Fh*UdzlSG9IgB8U4n9t5qSWHA73Xat54ReUUgCZ5hUiBG0KD-41hoa2HJm1CC7*ueTzp3loaKojnUO1JR3KD7bh1EgWwTmOIDum3aYtrN1EYDXF9jTh1KNJsalAXHeQI&new=1',
              type: 'mp',
            },
          ],
        },
      },
      {
        type: 'thinking',
        status: 'complete',
        data: {
          title: '思考完成（耗时3s）',
          text: 'mock分析语境，首先，Omi是一个基于Web Components的前端框架，和Vue的用法可能不太一样。Vue里的v-html指令用于将字符串作为HTML渲染，防止XSS攻击的话需要信任内容。Omi有没有类似的功能呢？mock分析语境，首先，Omi是一个基于Web Components的前端框架，和Vue的用法可能不太一样。Vue里的v-html指令用于将字符串作为HTML渲染，防止XSS攻击的话需要信任内容。Omi有没有类似的功能呢？',
        },
      },
      {
        type: 'text',
        data: '它叫 [McMurdo Station ATM](#promptId=atm)，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
      },
      {
        type: 'suggestion',
        status: 'complete',
        data: [
          {
            title: '《六姊妹》中有哪些观众喜欢的剧情点？',
            prompt: '《六姊妹》中有哪些观众喜欢的剧情点？',
          },
          {
            title: '两部剧在演员表现上有什么不同？',
            prompt: '两部剧在演员表现上有什么不同？',
          },
          {
            title: '《六姊妹》有哪些负面的评价？',
            prompt: '《六姊妹》有哪些负面的评价？',
          },
        ],
      },
    ],
  },
  {
    id: '789',
    role: 'user',
    status: 'complete',
    content: [
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
            name: 'demo2.pdf',
            url: 'https://tdesign.gtimg.com/site/demo.pdf',
            size: 34333,
          },
        ],
      },
      {
        type: 'text',
        data: '分析下以下内容，总结一篇广告策划方案',
      },
    ],
  },
  {
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
  {
    id: '7389',
    role: 'user',
    status: 'complete',
    content: [
      {
        type: 'text',
        data: '这张图里的帅哥是谁，这张图里的帅哥是谁，这张图里的帅哥是谁，这张图里的帅哥是谁，这张图里的帅哥是谁',
      },
      {
        type: 'attachment',
        data: [
          {
            fileType: 'image',
            // name: '',
            // size: 234234,
            // extension: '.doc',
            url: 'https://tdesign.gtimg.com/site/avatar.jpg',
          },
          {
            fileType: 'image',
            // name: 'avatar.jpg',
            // size: 234234,
            url: 'https://asset.gdtimg.com/muse_svp_0bc3viaacaaaweanalstw5ud3kweagvaaaka.f0.jpg?dis_k=bfc5cc81010a9d443e91ce45d4fbe774&dis_t=1750323484',
          },
        ],
      },
    ],
  },
  {
    id: '3242',
    role: 'assistant',
    status: 'complete',
    comment: 'good',
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
    case 'error':
      return {
        type: 'text',
        status: 'error',
        data: rest.content,
      };
    case 'search':
      return {
        type: 'search',
        status: (status) => (rest.content ? status : 'complete'),
        data: {
          title: rest.title,
          references: rest.content,
        },
      };
    case 'think':
      if (rest.step === 'web_search' && rest.docs.length > 0) {
        return {
          type: 'search',
          status: 'complete',
          data: {
            title: `共找到${rest.docs.length}个相关内容`,
            references: rest.docs,
          },
        };
      }
      return {
        type: 'thinking',
        status: () => (/耗时/.test(rest.title) ? 'complete' : undefined),
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

    case 'suggestion':
      return {
        type: 'suggestion',
        // title: '是不是想提问：',
        data: extractMarkdownLinks(rest.content),
      };

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

// 测试用的回调配置
const mockModelsWithCallbacks = {
  endpoint: 'http://localhost:3000/sse/normal',
  stream: true,

  // === 业务层回调测试 ===
  onComplete: (isAborted) => {
    console.log('🏁 [业务层] 对话完成:', {
      isAborted,
      timestamp: new Date().toISOString(),
      action: isAborted ? '用户中断' : '正常结束',
    });
  },

  onError: (err) => {
    console.error('🚨 [业务层] 聊天错误:', {
      error: err,
      message: err.message || String(err),
      timestamp: new Date().toISOString(),
      type: 'business_error',
    });
  },

  onAbort: async () => {
    console.log('🛑 [业务层] 用户主动停止:', {
      timestamp: new Date().toISOString(),
      reason: 'user_initiated',
    });
  },

  onMessage: (chunk) => defaultChunkParser(chunk),

  onRequest: (params) => {
    console.log('📤 [业务层] 发送请求:', {
      prompt: `${params.prompt?.slice(0, 50)}...`,
      messageID: params.messageID,
      attachments: params.attachments?.length || 0,
      timestamp: new Date().toISOString(),
    });

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

  // === 连接层回调测试 ===
  connection: {
    onHeartbeat: (event) => {
      // 每10次心跳打印一次，避免日志过多
      if (!(window as any).heartbeatCount) (window as any).heartbeatCount = 0;
      (window as any).heartbeatCount += 1;

      if ((window as any).heartbeatCount % 10 === 0) {
        console.log('💓 [连接层] 心跳检测 (x10):', {
          event,
          totalCount: (window as any).heartbeatCount,
          timestamp: new Date(event.timestamp).toLocaleTimeString(),
        });
      }
    },

    onConnectionStateChange: (event) => {
      console.log('🔧 [连接层] 连接状态变化:', {
        from: event.from,
        to: event.to,
        connectionId: `${event.connectionId?.slice(0, 8)}...`,
        timestamp: new Date(event.timestamp).toLocaleTimeString(),
        reason: event.reason || 'unknown',
      });
    },

    onConnectionEstablished: (connectionId) => {
      console.log('🔗 [连接层] SSE连接建立:', {
        connectionId: `${connectionId?.slice(0, 8)}...`,
        timestamp: new Date().toISOString(),
        status: 'connected',
      });
    },

    onConnectionLost: (connectionId) => {
      console.warn('📡 [连接层] SSE连接断开:', {
        connectionId: `${connectionId?.slice(0, 8)}...`,
        timestamp: new Date().toISOString(),
        status: 'disconnected',
        note: '系统将自动重连',
      });
    },
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

export default class BasicChat extends Component {
  static css = [
    `
      @keyframes blink {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      .chat::part(cursor) {
        padding: 0 2.5px;
        background-color: rgba(0,82,217, .5);
        animation: .8s blink infinite;
      }
  `,
  ];

  chatRef = createRef<Chatbot>();

  clickHandlerController = new AbortController();

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
            options: {
              engine: {
                global: {
                  // 自定义光标
                  flowSessionCursor: '<span part="cursor"></span>',
                },
                // @ts-expect-error cherryMD的bug
                syntax: {
                  // 补充链接渲染a标签属性
                  link: {
                    attrRender: (_text, href) => {
                      const id = href.split('#promptId=')[1];
                      // 识别特殊资源链接
                      if (href.startsWith('#promptId')) {
                        return `data-resource="${id}"`;
                      }
                    },
                  },
                },
              },
            },
          },
        },
      };
    }
  };

  ready() {
    this.chatRef.current.addEventListener('message_action', (e: CustomEvent) => {
      console.log('message_action', e.detail);
    });

    document.addEventListener(
      'click',
      (e) => {
        const target = findTargetElement(e, 'a[data-resource]');
        if (target) {
          e.preventDefault();
          e.stopPropagation();
          console.log('捕获资源链接点击:', target.dataset);
        }
      },
      {
        capture: true,
        signal: this.clickHandlerController.signal,
      },
    );

    // 打印回调测试说明
    console.log('🚀 聊天系统初始化完成 - 回调测试已启用');
    console.log('📝 说明：');
    console.log('   🏷️  [业务层] - 处理聊天对话逻辑的回调');
    console.log('   🔧 [连接层] - 处理SSE技术监控的回调');
    console.log('   💡 请发送消息观察各种回调的触发情况');
  }

  uninstall(): void {
    // 移除全局点击监听
    this.clickHandlerController.abort();
  }

  render() {
    return (
      <>
        <t-chatbot
          ref={this.chatRef}
          className="chat"
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
          chatServiceConfig={mockModelsWithCallbacks}
          onChatReady={(e) => console.log('chatReady', e)}
        ></t-chatbot>

        <div style={{ padding: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => this.chatRef.current?.setMessages(mockData, 'prepend')}>设置消息</button>
          <button onClick={() => this.chatRef.current?.scrollList({ to: 'top' })}>滚动到上面</button>
          <button onClick={() => this.chatRef.current?.abortChat()}>停止对话</button>
          <button
            onClick={() => {
              console.clear();
              console.log('🧹 控制台已清空');
              console.log('📝 回调测试说明：');
              console.log('   🏷️  [业务层] - 处理聊天对话逻辑的回调');
              console.log('   🔧 [连接层] - 处理SSE技术监控的回调');
            }}
          >
            清空控制台
          </button>
          <button
            onClick={() => {
              console.log('🔄 重新开始测试');
              (window as any).heartbeatCount = 0;
            }}
          >
            重置计数器
          </button>
        </div>
      </>
    );
  }
}
