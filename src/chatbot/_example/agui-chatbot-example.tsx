import '../index';

import { Component, tag } from 'omi';

@tag('agui-chatbot-example')
export default class AguiChatbotExample extends Component {
  private chatRef?: any;

  render() {
    return (
      <div style={{ padding: '20px' }}>
        <h2>AG-UI Chatbot 示例</h2>

        <div style={{ marginBottom: '20px' }}>
          <h3>传统模式 (Traditional Mode)</h3>
          <t-chatbot
            ref={(ref: any) => {
              this.chatRef = ref;
            }}
            defaultMessages={[]}
            chatServiceConfig={{
              endpoint: '/api/chat',
              stream: true,
              onMessage: (chunk: any) => {
                // 传统SSE处理逻辑
                try {
                  if (chunk.data) {
                    const data = JSON.parse(chunk.data);
                    if (data.type === 'text') {
                      return {
                        type: 'text',
                        data: data.content,
                        strategy: 'merge',
                      };
                    }
                  }
                } catch (e) {
                  console.error('Parse error:', e);
                }
                return null;
              },
              onComplete: (isAborted: boolean) => {
                console.log('Chat completed, aborted:', isAborted);
              },
            }}
            messageProps={{
              user: { variant: 'text', placement: 'right' },
              assistant: { variant: 'text', placement: 'left' },
            }}
            onChatReady={() => {
              console.log('Traditional chat ready');
            }}
            style={{ height: '400px', border: '1px solid #ccc', marginBottom: '10px' }}
          />

          <button onClick={() => this.sendMessage('你好，请介绍一下你自己')}>发送测试消息</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>AG-UI模式 (AG-UI Mode)</h3>
          <t-chatbot
            defaultMessages={[]}
            chatServiceConfig={{
              mode: 'agui',
              agui: {
                url: 'http://localhost:3000/api/agui-agent',
                agentId: 'demo-agent',
                headers: {
                  Authorization: 'Bearer your-token',
                  'Content-Type': 'application/json',
                },
                tools: [
                  {
                    name: 'search',
                    description: '搜索网络信息',
                    parameters: {
                      type: 'object',
                      properties: {
                        query: { type: 'string' },
                      },
                    },
                  },
                ],
              },
            }}
            messageProps={{
              user: { variant: 'text', placement: 'right' },
              assistant: { variant: 'text', placement: 'left' },
            }}
            onChatReady={() => {
              console.log('AG-UI chat ready');
            }}
            style={{ height: '400px', border: '1px solid #ccc', marginBottom: '10px' }}
          />

          <button onClick={() => this.sendAGUIMessage('请帮我搜索最新的AI技术发展')}>发送AG-UI测试消息</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>动态切换示例</h3>
          <div style={{ marginBottom: '10px' }}>
            <button onClick={() => this.switchToTraditional()}>切换到传统模式</button>
            <button onClick={() => this.switchToAGUI()} style={{ marginLeft: '10px' }}>
              切换到AG-UI模式
            </button>
          </div>

          <t-chatbot
            ref={(ref: any) => {
              this.switchableChatRef = ref;
            }}
            defaultMessages={[]}
            chatServiceConfig={{
              mode: 'traditional',
              traditional: {
                endpoint: '/api/chat',
                onMessage: this.handleTraditionalMessage,
              },
            }}
            style={{ height: '400px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <h3>功能演示</h3>
          <button onClick={() => this.demonstrateFeatures()}>演示各种内容类型</button>
        </div>
      </div>
    );
  }

  private switchableChatRef?: any;

  private sendMessage(message: string) {
    if (this.chatRef) {
      this.chatRef.sendUserMessage({
        prompt: message,
      });
    }
  }

  private sendAGUIMessage(message: string) {
    // AG-UI消息会自动处理各种事件类型
    if (this.chatRef) {
      this.chatRef.sendUserMessage({
        prompt: message,
      });
    }
  }

  private switchToTraditional() {
    if (this.switchableChatRef) {
      // 使用桥接器的switchEngine方法
      this.switchableChatRef.chatEngine?.switchEngine(
        {
          mode: 'traditional',
          traditional: {
            endpoint: '/api/chat',
            onMessage: this.handleTraditionalMessage,
          },
        },
        true,
      ); // 保留当前消息
    }
  }

  private switchToAGUI() {
    if (this.switchableChatRef) {
      this.switchableChatRef.chatEngine?.switchEngine(
        {
          mode: 'agui',
          agui: {
            url: 'http://localhost:3000/api/agui-agent',
            agentId: 'demo-agent',
          },
        },
        true,
      );
    }
  }

  private handleTraditionalMessage = (chunk: any) => {
    try {
      if (chunk.data) {
        const data = JSON.parse(chunk.data);

        // 支持多种内容类型
        switch (data.type) {
          case 'text':
            return {
              type: 'text',
              data: data.content,
              strategy: 'merge',
            };

          case 'thinking':
            return {
              type: 'thinking',
              data: {
                title: data.title || '思考中...',
                text: data.content || '',
              },
              strategy: data.append ? 'append' : 'merge',
            };

          case 'search':
            return {
              type: 'search',
              data: {
                title: data.title,
                references: data.references || [],
              },
              strategy: 'append',
            };

          case 'suggestion':
            return {
              type: 'suggestion',
              data: data.suggestions || [],
              strategy: 'append',
            };

          default:
            return {
              type: 'text',
              data: JSON.stringify(data),
              strategy: 'append',
            };
        }
      }
    } catch (e) {
      console.error('Parse message error:', e);
    }
    return null;
  };

  private demonstrateFeatures() {
    if (this.switchableChatRef) {
      // 演示各种消息类型
      const demoMessages = [
        {
          id: 'demo-thinking',
          role: 'assistant' as const,
          content: [
            {
              type: 'thinking' as const,
              data: {
                title: '分析问题中...',
                text: '让我思考一下如何回答这个问题...',
              },
            },
          ],
          status: 'complete' as const,
          datetime: new Date().toISOString(),
        },
        {
          id: 'demo-search',
          role: 'assistant' as const,
          content: [
            {
              type: 'search' as const,
              data: {
                title: '搜索结果',
                references: [
                  {
                    title: 'AG-UI协议文档',
                    url: 'https://docs.ag-ui.com',
                    content: '详细的AG-UI协议说明',
                    site: '官方文档',
                  },
                ],
              },
            },
          ],
          status: 'complete' as const,
          datetime: new Date().toISOString(),
        },
        {
          id: 'demo-suggestion',
          role: 'assistant' as const,
          content: [
            {
              type: 'suggestion' as const,
              data: [
                { title: '了解AG-UI基础概念', prompt: '什么是AG-UI协议？' },
                { title: '查看实现示例', prompt: '展示一个完整的AG-UI实现' },
                { title: '性能优化建议', prompt: '如何优化AG-UI性能？' },
              ],
            },
          ],
          status: 'complete' as const,
          datetime: new Date().toISOString(),
        },
      ];

      this.switchableChatRef.setMessages(demoMessages, 'append');
    }
  }
}
