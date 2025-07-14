import 'tdesign-web-components/chatbot';

import { Component } from 'omi';

import { AGUIEngine } from '../../core/engine/agui/AGUIEngine';

// AG-UI 协议服务配置
const aguiServiceConfig = {
  endpoint: 'https://api.agui.chat/sse',
  protocol: 'agui',
  agui: {
    agentId: 'weather-agent',
    threadId: 'thread-12345',
    tools: ['weather_query', 'calendar_check'],
  },
  maxRetries: 5,
  retryInterval: 2000,
  logger: console,
};

// AG-UI 事件处理器
const aguiEventHandlers = {
  onTextMessageStart: (messageId) => {
    console.log('文本消息开始:', messageId);
  },
  onTextMessageContent: (messageId, delta) => {
    console.log('文本内容更新:', messageId, delta);
  },
  onToolCallStart: (toolCallId, toolName) => {
    console.log('工具调用开始:', toolCallId, toolName);
  },
  onToolCallArgs: (toolCallId, delta) => {
    console.log('工具参数更新:', toolCallId, delta);
  },
  onToolCallResult: (toolCallId, content) => {
    console.log('工具调用结果:', toolCallId, content);
  },
  onStateSnapshot: (snapshot) => {
    console.log('状态快照:', snapshot);
  },
  onError: (error) => {
    console.error('AG-UI 错误:', error);
  },
};

export default class AGUIChatDemo extends Component {
  aguiEngine: AGUIEngine | null = null;

  install() {
    // 初始化 AG-UI 引擎
    this.aguiEngine = new AGUIEngine(aguiServiceConfig, aguiEventHandlers, console);
  }

  // 发送用户消息
  handleSend = async (prompt: string) => {
    if (!this.aguiEngine) return;

    await this.aguiEngine.connect({
      prompt,
      attachments: [],
    });
  };

  // 重新生成回答
  handleRegenerate = async () => {
    if (!this.aguiEngine) return;

    await this.aguiEngine.regenerateAIMessage();
  };

  // 停止对话
  handleStop = async () => {
    if (!this.aguiEngine) return;

    await this.aguiEngine.disconnect();
  };

  render() {
    return (
      <div>
        <t-chatbot chatServiceConfig={aguiServiceConfig} onSend={this.handleSend}></t-chatbot>

        <div style={{ marginTop: '16px' }}>
          <t-button onClick={this.handleRegenerate}>重新生成</t-button>
          <t-button onClick={this.handleStop}>停止对话</t-button>
        </div>
      </div>
    );
  }
}
