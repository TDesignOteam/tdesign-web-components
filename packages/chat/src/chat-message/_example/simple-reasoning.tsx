import '@tdesign/web-components-chat/chat-message';

import type { AIMessageContent, ChatMessagesData } from '@tdesign/web-components-chat/chat-engine';
import { Component } from 'omi';

export default class SimpleReasoningExample extends Component {
  // 简化的推理内容数据 - 只包含文本和插槽
  mockReasoningContent: AIMessageContent[] = [
    {
      type: 'text',
      data: '我需要分析这个问题的几个方面：\n1. 首先了解用户需求\n2. 搜索相关信息\n3. 综合分析得出结论',
    },
    {
      type: 'toolcall',
      data: {
        toolCallId: 'tool_001',
        toolCallName: 'search',
        args: '{"query": "相关信息"}',
        result: '搜索结果数据',
      },
      status: 'complete',
    },
    {
      type: 'text',
      data: '基于搜索结果，我可以得出以下结论...',
    },
    {
      type: 'search',
      data: {
        title: '补充搜索',
        references: [
          {
            title: '参考资料1',
            url: 'https://example.com/ref1',
            content: '相关内容摘要',
          },
        ],
      },
      status: 'complete',
    },
    {
      type: 'text',
      data: '综合所有信息，最终的推理结论是...',
    },
  ];

  mockMessages: ChatMessagesData[] = [
    {
      id: 'user-1',
      role: 'user',
      content: [
        {
          type: 'text',
          data: '请帮我分析这个问题',
        },
      ],
    },
    {
      id: 'assistant-1',
      role: 'assistant',
      status: 'complete',
      content: [
        {
          type: 'reasoning',
          data: this.mockReasoningContent,
          status: 'complete',
        },
        {
          type: 'markdown',
          data: `# 分析结果

基于推理过程，我的分析结论如下：

## 主要发现
- 发现1：重要信息点
- 发现2：关键洞察
- 发现3：解决方案建议

## 建议
根据分析结果，建议采取以下行动...`,
        },
      ],
    },
  ];

  render() {
    return (
      <div style={{ padding: '20px', maxWidth: '800px' }}>
        <h2>简化版 ReasoningContent 示例</h2>
        <p>展示基于 thinking 组件复用的推理内容渲染</p>

        <div style={{ marginTop: '20px' }}>
          {this.mockMessages.map((message) => (
            <t-chat-item
              key={message.id}
              message={message}
              avatar={message.role === 'user' ? '👤' : '🤖'}
              name={message.role === 'user' ? '用户' : 'AI助手'}
              datetime="刚刚"
              chatContentProps={{
                thinking: {
                  maxHeight: 400,
                  defaultCollapsed: false,
                  layout: 'border',
                },
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: '40px', padding: '16px', background: '#f0f9ff', borderRadius: '8px' }}>
          <h3>重构后的特性：</h3>
          <ul>
            <li>✅ 复用 thinking 组件的基础逻辑和样式</li>
            <li>✅ 文本内容自动渲染为段落</li>
            <li>
              ✅ 非文本内容通过插槽{' '}
              <code>
                reasoning-{'{type}'}-{'{index}'}
              </code>{' '}
              自定义渲染
            </li>
            <li>✅ 减少重复代码，提高维护性</li>
            <li>✅ 保持与 thinking 组件一致的交互体验</li>
          </ul>
        </div>

        <div style={{ marginTop: '20px', padding: '16px', background: '#fef3c7', borderRadius: '8px' }}>
          <h3>插槽使用示例：</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {`<!-- 在 chat-item 中为 reasoning 内容自定义渲染 -->
<t-chat-item message={message}>
  <div slot="reasoning-toolcall-1">
    <!-- 自定义工具调用渲染 -->
    <div class="custom-toolcall">
      <h4>🔧 工具调用</h4>
      <p>函数: {toolCall.name}</p>
      <p>结果: {toolCall.result}</p>
    </div>
  </div>
  
  <div slot="reasoning-search-3">
    <!-- 自定义搜索结果渲染 -->
    <div class="custom-search">
      <h4>🔍 搜索结果</h4>
      <!-- 自定义搜索结果展示 -->
    </div>
  </div>
</t-chat-item>`}
          </pre>
        </div>
      </div>
    );
  }
}
