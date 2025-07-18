/* eslint-disable no-console */
import 'tdesign-web-components/chatbot';

import { Component, createRef } from 'omi';
import { TdChatMessageConfigItem } from 'tdesign-web-components/chatbot';

import Chatbot from '../chat';
import type { AGUIEvent } from '../core/adapters/agui-adapter';
import type { ChatMessagesData, ChatServiceConfig } from '../core/type';

/**
 * AG-UI协议使用示例 - 清晰的配置分离
 *
 * 展示三种配置模式：
 * 1. 传统回调模式
 * 2. AG-UI纯模式
 * 3. 传统兼容模式（传统回调 + AG-UI协议转换）
 */

// =============================================================================
// 1. 传统回调模式配置
// =============================================================================
const traditionalConfig: ChatServiceConfig = {
  // 网络配置
  endpoint: 'http://localhost:3000/sse/normal',
  stream: true,
  retryInterval: 1000,
  maxRetries: 3,

  // 传统业务回调
  callbacks: {
    onRequest: (params) => {
      console.log('📤 [传统模式] 发送请求:', params);
      const { prompt, messageID, attachments = [] } = params;
      return {
        headers: {
          'X-Mock-Key': 'traditional-mode',
          'Content-Type': 'text/event-stream',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          session_id: 'session_traditional',
          question: [{ id: messageID, content: prompt, create_at: Date.now(), role: 'user' }],
          attachments,
          is_search_net: 1,
        }),
      };
    },

    onMessage: (chunk, message) => {
      console.log('💬 [传统模式] 收到消息:', { chunk, message });

      // 传统的消息解析逻辑
      if (typeof chunk.data === 'string') {
        return { type: 'text', data: chunk.data };
      }

      const { type, ...rest } = chunk.data || {};
      switch (type) {
        case 'text':
          return { type: 'markdown', data: rest?.msg || '' };
        default:
          return { type: 'text', data: JSON.stringify(chunk.data) };
      }
    },

    onComplete: (isAborted) => {
      console.log('🏁 [传统模式] 对话完成:', isAborted ? '用户中断' : '正常结束');
    },

    onError: (error) => {
      console.error('🚨 [传统模式] 错误:', error);
    },

    onAbort: async () => {
      console.log('⏹️ [传统模式] 用户中断');
    },
  },

  // 连接监控
  connection: {
    onHeartbeat: (event) => {
      if (event.timestamp % 10 === 0) {
        // 每10次打印一次
        console.log('💓 [传统模式] 连接心跳:', event.connectionId);
      }
    },
    onConnectionStateChange: (event) => {
      console.log(`🔧 [传统模式] 连接状态: ${event.from} -> ${event.to}`);
    },
  },
};

// =============================================================================
// 2. AG-UI纯模式配置
// =============================================================================
const aguiPureConfig: ChatServiceConfig = {
  // 网络配置
  endpoint: 'http://localhost:3000/sse/normal',
  stream: true,
  retryInterval: 1000,
  maxRetries: 3,

  // ⚠️ 注意：AG-UI模式下不配置callbacks！
  // callbacks: undefined,

  // AG-UI协议配置
  agui: {
    enabled: true,
    agentId: 'tdesign-agui-pure',
    bidirectional: true,

    // 业务逻辑处理（替代传统callbacks）
    onBusinessEvent: (event: AGUIEvent) => {
      console.log('🤖 [AG-UI纯模式] 业务事件:', event);

      switch (event.type) {
        case 'RUN_STARTED':
          console.log('🚀 AG-UI: 对话开始');
          break;

        case 'TEXT_MESSAGE_CHUNK':
          console.log('📝 AG-UI: 接收文本块:', event.data.content);
          // 在AG-UI模式下，这里处理UI更新逻辑
          break;

        case 'TOOL_CALL_CHUNK':
          console.log('🔧 AG-UI: 工具调用:', event.data.toolName);
          break;

        case 'RUN_FINISHED':
          console.log('✅ AG-UI: 对话结束:', event.data.reason);
          break;

        case 'RUN_ERROR':
          console.error('❌ AG-UI: 运行错误:', event.data.error);
          break;

        case 'HEARTBEAT':
          // 心跳事件处理
          break;

        case 'CONNECTION_ESTABLISHED':
          console.log('🔗 AG-UI: 连接建立');
          break;

        default:
          console.log('📋 AG-UI: 其他事件:', event.type);
      }
    },

    // 协议通信（发送到外部系统）
    onProtocolEvent: (event: AGUIEvent) => {
      console.log('📡 [AG-UI纯模式] 协议事件:', event.type);

      // 发送到外部监控系统
      if (typeof window !== 'undefined') {
        if (!(window as any).aguiEvents) (window as any).aguiEvents = [];
        (window as any).aguiEvents.push(event);

        // 发送自定义事件
        window.dispatchEvent(new CustomEvent('agui-protocol-event', { detail: event }));
      }

      // 可以发送到WebSocket、HTTP端点等
      // websocket.send(JSON.stringify(event));
      // fetch('/api/agui-events', { method: 'POST', body: JSON.stringify(event) });
    },

    // 外部事件处理（双向通信）
    onExternalEvent: (event: AGUIEvent) => {
      console.log('🔄 [AG-UI纯模式] 外部事件:', event);
    },

    // 自定义事件映射
    eventMapping: {
      TEXT_MESSAGE_CHUNK: 'custom_text',
      RUN_STARTED: 'session_begin',
      RUN_FINISHED: 'session_end',
    },
  },
};

// =============================================================================
// 3. 传统兼容模式配置（传统回调 + AG-UI协议转换）
// =============================================================================
const compatibilityConfig: ChatServiceConfig = {
  // 网络配置
  endpoint: 'http://localhost:3000/sse/normal',
  stream: true,

  // 传统业务回调（保持原有逻辑）
  callbacks: {
    onMessage: (chunk) => {
      console.log('💬 [兼容模式] 传统业务处理:', chunk);
      // 原有的业务逻辑保持不变
      return { type: 'text', data: String(chunk.data) };
    },

    onComplete: (isAborted) => {
      console.log('🏁 [兼容模式] 传统完成处理:', isAborted);
    },

    onError: (error) => {
      console.error('🚨 [兼容模式] 传统错误处理:', error);
    },
  },

  // 同时启用AG-UI协议转换
  agui: {
    enabled: true,
    agentId: 'tdesign-compatibility',

    // 仅用于协议通信，不处理业务逻辑
    onProtocolEvent: (event: AGUIEvent) => {
      console.log('📡 [兼容模式] AG-UI协议事件:', event.type);
      // 发送到外部AG-UI兼容系统
    },
  },
};

export default class ClearAGUIExample extends Component {
  chatRef = createRef<Chatbot>();

  // 当前配置模式
  currentMode: 'traditional' | 'agui-pure' | 'compatibility' = 'traditional';

  // 获取当前配置
  getCurrentConfig(): ChatServiceConfig {
    switch (this.currentMode) {
      case 'traditional':
        return traditionalConfig;
      case 'agui-pure':
        return aguiPureConfig;
      case 'compatibility':
        return compatibilityConfig;
      default:
        return traditionalConfig;
    }
  }

  // 切换配置模式
  switchMode = (mode: 'traditional' | 'agui-pure' | 'compatibility') => {
    this.currentMode = mode;

    // 重新初始化聊天引擎
    const chatEngine = this.chatRef.current?.chatEngine;
    if (chatEngine) {
      chatEngine.init(() => this.getCurrentConfig());
    }

    this.update();

    console.clear();
    console.log(`🔄 切换到${this.getModeLabel(mode)}模式`);
    this.printModeDescription(mode);
  };

  getModeLabel(mode: string): string {
    switch (mode) {
      case 'traditional':
        return '传统回调';
      case 'agui-pure':
        return 'AG-UI纯';
      case 'compatibility':
        return '传统兼容';
      default:
        return mode;
    }
  }

  printModeDescription(mode: string): void {
    switch (mode) {
      case 'traditional':
        console.log('📋 传统回调模式:');
        console.log('  - 使用 config.callbacks 处理业务逻辑');
        console.log('  - 不启用AG-UI协议');
        console.log('  - 适合现有项目迁移');
        break;

      case 'agui-pure':
        console.log('📋 AG-UI纯模式:');
        console.log('  - 不使用 config.callbacks');
        console.log('  - 使用 config.agui.onBusinessEvent 处理业务逻辑');
        console.log('  - 使用 config.agui.onProtocolEvent 处理协议通信');
        console.log('  - 完全基于AG-UI事件驱动');
        break;

      case 'compatibility':
        console.log('📋 传统兼容模式:');
        console.log('  - 使用 config.callbacks 处理业务逻辑（保持不变）');
        console.log('  - 使用 config.agui.onProtocolEvent 发送AG-UI协议事件');
        console.log('  - 业务逻辑与协议通信分离');
        break;
    }
  }

  messagePropsFunc = (msg: ChatMessagesData): TdChatMessageConfigItem => {
    const { role } = msg;
    if (role === 'user') {
      return {
        variant: 'base',
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      };
    }
    if (role === 'assistant') {
      return {
        variant: 'outline',
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        actions: ['replay', 'copy'],
        handleActions: {
          replay: () => this.chatRef.current.regenerate(),
          copy: (data) => console.log('复制内容', data),
        },
      };
    }
  };

  ready() {
    console.log('🚀 AG-UI配置分离示例初始化完成');
    this.printModeDescription(this.currentMode);

    // 监听AG-UI协议事件
    window.addEventListener('agui-protocol-event', (event: CustomEvent<AGUIEvent>) => {
      console.log('🎯 收到AG-UI协议事件:', event.detail);
    });
  }

  uninstall() {
    window.removeEventListener('agui-protocol-event', () => {});
  }

  render() {
    return (
      <>
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#0369a1' }}>🎛️ AG-UI配置分离示例</h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#0284c7' }}>
            当前模式：<strong>{this.getModeLabel(this.currentMode)}</strong> - 查看控制台了解不同配置模式的特点
          </p>

          {/* 模式切换按钮 */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => this.switchMode('traditional')}
              style={{
                backgroundColor: this.currentMode === 'traditional' ? '#3b82f6' : '#e5e7eb',
                color: this.currentMode === 'traditional' ? 'white' : '#374151',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              传统回调模式
            </button>

            <button
              onClick={() => this.switchMode('agui-pure')}
              style={{
                backgroundColor: this.currentMode === 'agui-pure' ? '#3b82f6' : '#e5e7eb',
                color: this.currentMode === 'agui-pure' ? 'white' : '#374151',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              AG-UI纯模式
            </button>

            <button
              onClick={() => this.switchMode('compatibility')}
              style={{
                backgroundColor: this.currentMode === 'compatibility' ? '#3b82f6' : '#e5e7eb',
                color: this.currentMode === 'compatibility' ? 'white' : '#374151',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              传统兼容模式
            </button>
          </div>
        </div>

        <t-chatbot
          ref={this.chatRef}
          style={{ display: 'block', height: '60vh' }}
          defaultMessages={[]}
          messageProps={this.messagePropsFunc}
          senderProps={{
            actions: true,
            placeholder: `在${this.getModeLabel(this.currentMode)}模式下发送消息...`,
          }}
          chatServiceConfig={this.getCurrentConfig()}
          onChatReady={(e) => console.log('💬 聊天就绪', e)}
        />

        <div style={{ padding: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => console.clear()}>清空控制台</button>

          <button
            onClick={() => {
              const adapter = this.chatRef.current?.chatEngine?.getAGUIAdapter?.();
              if (adapter) {
                console.log('🔍 AG-UI适配器状态:', adapter.getState());
              } else {
                console.log('❌ AG-UI适配器未启用');
              }
            }}
          >
            查看适配器状态
          </button>

          <button
            onClick={() => {
              console.log('📊 当前配置模式详情:');
              this.printModeDescription(this.currentMode);
              console.log('🔧 当前配置:', this.getCurrentConfig());
            }}
          >
            查看当前配置
          </button>
        </div>

        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#92400e',
          }}
        >
          <strong>三种配置模式对比:</strong>
          <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
            <li>
              <strong>传统回调模式</strong>：使用 callbacks 配置，适合现有项目，无AG-UI功能
            </li>
            <li>
              <strong>AG-UI纯模式</strong>：不使用 callbacks，完全基于 agui.onBusinessEvent，推荐新项目
            </li>
            <li>
              <strong>传统兼容模式</strong>：同时使用 callbacks + agui.onProtocolEvent，适合渐进迁移
            </li>
          </ul>
          <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#a16207' }}>
            💡 关键区别：AG-UI纯模式下不配置 callbacks，业务逻辑完全在 onBusinessEvent 中处理
          </p>
        </div>
      </>
    );
  }
}
