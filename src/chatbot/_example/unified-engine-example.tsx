import '../../button';
import '../../input';
import '../../space';
import '../chat-list';
import '../chat-sender';

import { Component, signal, tag } from 'omi';

import ChatEngine from '../core';
import { AGUIEngine } from '../core/agui-engine';
import { IUnifiedEngine } from '../core/base-engine';
import type { ChatMessagesData, ChatRequestParams } from '../core/type';
import type { TdAguiServiceConfig, TdEngineMode } from '../type';

/**
 * 统一引擎架构示例
 * 展示新的架构设计：使用BaseEngine基类，ChatEngine和AGUIEngine继承实现
 */
@tag('unified-engine-example')
export default class UnifiedEngineExample extends Component {
  // 状态管理
  engineMode = signal<TdEngineMode>('default');

  messages = signal<ChatMessagesData[]>([]);

  status = signal<string>('idle');

  // 引擎实例
  currentEngine: IUnifiedEngine | ChatEngine | null = null;

  // 配置
  traditionConfig = {
    endpoint: '/api/chat',
    stream: true,
  };

  aguiConfig: TdAguiServiceConfig = {
    url: '/api/agui-agent',
    agentId: 'demo-agent',
    headers: { 'Content-Type': 'application/json' },
  };

  install() {
    this.initEngine();
  }

  /**
   * 初始化引擎
   */
  initEngine() {
    const mode = this.engineMode.value;

    // 销毁之前的引擎
    if (this.currentEngine) {
      if ('destroy' in this.currentEngine) {
        this.currentEngine.destroy();
      }
    }

    // 创建新引擎
    if (mode === 'agui') {
      this.currentEngine = new AGUIEngine(this.aguiConfig);
      this.subscribeToAGUIEngine();
    } else {
      this.currentEngine = new ChatEngine();
      this.subscribeToTraditionalEngine();
    }

    // 初始化引擎
    if (mode === 'agui' && this.currentEngine instanceof AGUIEngine) {
      this.currentEngine.init(this.aguiConfig, []);
    } else if (this.currentEngine instanceof ChatEngine) {
      this.currentEngine.init(this.traditionConfig, []);
    }

    this.update();
  }

  /**
   * 订阅AG-UI引擎状态
   */
  subscribeToAGUIEngine() {
    if (!(this.currentEngine instanceof AGUIEngine)) return;

    // 订阅消息变化
    this.currentEngine.getMessages$().subscribe((messages) => {
      this.messages.value = messages;
      this.update();
    });

    // 订阅状态变化
    this.currentEngine.getStatus$().subscribe((status) => {
      this.status.value = status;
      this.update();
    });
  }

  /**
   * 订阅传统引擎状态
   */
  subscribeToTraditionalEngine() {
    if (!(this.currentEngine instanceof ChatEngine)) return;

    // 传统引擎的订阅方式
    this.currentEngine.messageStore.subscribe((state) => {
      this.messages.value = state.messages;
      this.update();
    });
  }

  /**
   * 发送消息
   */
  async handleSend(message: string) {
    if (!this.currentEngine) return;

    const params: ChatRequestParams = {
      prompt: message,
      messageID: `msg-${Date.now()}`,
    };

    try {
      await this.currentEngine.sendUserMessage(params);
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  }

  /**
   * 切换引擎模式
   */
  switchEngine(mode: TdEngineMode) {
    this.engineMode.value = mode;
    this.initEngine();
  }

  /**
   * 清空消息
   */
  clearMessages() {
    if (!this.currentEngine) return;

    if (this.currentEngine instanceof AGUIEngine) {
      this.currentEngine.clearMessages();
    } else if (this.currentEngine instanceof ChatEngine) {
      this.currentEngine.messageStore.clearHistory();
    }
  }

  /**
   * 重新生成回复
   */
  async regenerate() {
    if (!this.currentEngine) return;

    try {
      await this.currentEngine.regenerateAIMessage(false);
    } catch (error) {
      console.error('重新生成失败:', error);
    }
  }

  /**
   * 渲染引擎信息
   */
  renderEngineInfo() {
    const mode = this.engineMode.value;
    const isAGUI = mode === 'agui';

    return (
      <div class="engine-info">
        <h3>当前引擎: {isAGUI ? 'AG-UI引擎' : '传统引擎'}</h3>
        <p>
          <strong>架构特点:</strong>
          {isAGUI ? (
            <span>继承BaseEngine，支持Observable响应式、事件驱动、智能交互（思考过程、工具调用）</span>
          ) : (
            <span>使用MessageStore管理状态，支持流式响应、内容合并</span>
          )}
        </p>
        <p>
          <strong>配置:</strong>
          <code>{JSON.stringify(isAGUI ? this.aguiConfig : this.traditionConfig, null, 2)}</code>
        </p>
        <p>
          <strong>消息数量:</strong> {this.messages.value.length}
        </p>
        <p>
          <strong>当前状态:</strong> {this.status.value}
        </p>
      </div>
    );
  }

  /**
   * 渲染控制面板
   */
  renderControls() {
    const mode = this.engineMode.value;

    return (
      <t-space direction="vertical" style="width: 100%; margin-bottom: 16px;">
        <t-space>
          <t-button variant={mode === 'default' ? 'base' : 'outline'} onClick={() => this.switchEngine('default')}>
            传统引擎
          </t-button>
          <t-button variant={mode === 'agui' ? 'base' : 'outline'} onClick={() => this.switchEngine('agui')}>
            AG-UI引擎
          </t-button>
        </t-space>

        <t-space>
          <t-button onClick={() => this.clearMessages()}>清空消息</t-button>
          <t-button onClick={() => this.regenerate()}>重新生成</t-button>
        </t-space>
      </t-space>
    );
  }

  /**
   * 渲染架构对比
   */
  renderComparison() {
    return (
      <div class="architecture-comparison">
        <h3>新架构 vs 旧架构</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="architecture-card">
            <h4>🔥 新架构（推荐）</h4>
            <ul>
              <li>✅ BaseEngine基类统一接口</li>
              <li>✅ 继承实现，代码复用</li>
              <li>✅ 组件选择引擎，不需要运行时切换</li>
              <li>✅ 类型安全，清晰分离</li>
              <li>✅ AGUIEngine + ChatEngine各司其职</li>
              <li>✅ Observable响应式（AG-UI）</li>
            </ul>
            <strong>使用方式:</strong>
            <pre>{`// props
engineMode: 'default' | 'agui'
chatServiceConfig?: ChatServiceConfigSetter  
aguiServiceConfig?: TdAguiServiceConfig

// 组件内部选择引擎
if (engineMode === 'agui') {
  engine = new AGUIEngine(aguiServiceConfig)
} else {
  engine = new ChatEngine()
}`}</pre>
          </div>

          <div class="architecture-card">
            <h4>❌ 旧架构（已废弃）</h4>
            <ul>
              <li>❌ EngineBridge桥接复杂</li>
              <li>❌ 运行时引擎切换（不必要）</li>
              <li>❌ 配置混合在一起</li>
              <li>❌ 类型定义复杂</li>
              <li>❌ 额外的抽象层</li>
              <li>❌ 难以维护和扩展</li>
            </ul>
            <strong>使用方式:</strong>
            <pre>{`// 复杂的统一配置
chatServiceConfig: UnifiedEngineConfig

// 桥接层
new EngineBridge()
bridge.init(config)
bridge.switchEngine() // 不需要的功能`}</pre>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class="unified-engine-example">
        <div style="max-width: 1200px; margin: 0 auto; padding: 16px;">
          <h2>🚀 统一引擎架构示例</h2>

          {this.renderComparison()}

          <div style="margin-top: 32px;">
            {this.renderControls()}
            {this.renderEngineInfo()}

            <div style="margin-top: 16px;">
              <t-input
                placeholder="输入消息测试引擎..."
                onEnter={(e: any) => {
                  const { value } = e.target;
                  if (value.trim()) {
                    this.handleSend(value);
                    e.target.value = '';
                  }
                }}
              />
            </div>

            <div style="margin-top: 16px; border: 1px solid #ddd; border-radius: 8px; height: 400px; overflow-y: auto; padding: 16px;">
              {this.messages.value.length === 0 ? (
                <div style="text-align: center; color: #999; margin-top: 100px;">暂无消息，输入消息开始测试</div>
              ) : (
                this.messages.value.map((message) => (
                  <div
                    key={message.id}
                    style="margin-bottom: 16px; padding: 12px; border-radius: 8px; background: message.role === 'user' ? '#e3f2fd' : '#f5f5f5';"
                  >
                    <div style="font-weight: bold; margin-bottom: 8px;">
                      {message.role === 'user' ? '👤 用户' : '🤖 助手'} ({message.role})
                    </div>
                    <div>
                      {message.content.map((content, index) => (
                        <div key={index}>
                          <strong>{content.type}:</strong> {JSON.stringify(content.data)}
                        </div>
                      ))}
                    </div>
                    <div style="font-size: 12px; color: #666; margin-top: 8px;">
                      状态: {message.status || 'pending'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <style>{`
          .architecture-comparison {
            margin-bottom: 24px;
            padding: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #fafafa;
          }
          
          .architecture-card {
            padding: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: white;
          }
          
          .architecture-card h4 {
            margin-top: 0;
            margin-bottom: 12px;
          }
          
          .architecture-card ul {
            margin: 12px 0;
            padding-left: 20px;
          }
          
          .architecture-card li {
            margin-bottom: 4px;
          }
          
          .architecture-card pre {
            background: #f5f5f5;
            padding: 12px;
            border-radius: 4px;
            font-size: 12px;
            overflow-x: auto;
            margin-top: 8px;
          }
          
          .engine-info {
            padding: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: white;
            margin-bottom: 16px;
          }
          
          .engine-info h3 {
            margin-top: 0;
            color: #2196f3;
          }
          
          .engine-info code {
            display: block;
            background: #f5f5f5;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: pre-wrap;
            margin-top: 4px;
          }
        `}</style>
      </div>
    );
  }
}
