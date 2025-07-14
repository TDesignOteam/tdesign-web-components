import '../../button';
import '../../space';
import '../index';

import { Component, tag } from 'omi';

import type { UnifiedEngineConfig } from '../core/engine-bridge';

@tag('agui-simple-example')
export default class AguiSimpleExample extends Component {
  install() {
    console.log('AG-UI简单示例组件已安装');
  }

  render() {
    // AG-UI模式配置
    const aguiConfig: UnifiedEngineConfig = {
      mode: 'agui',
      agui: {
        url: '/api/agui-agent',
        agentId: 'demo-agent',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    };

    // 传统模式配置（用于对比）
    const traditionalConfig = {
      endpoint: '/api/chat',
      stream: true,
      onMessage: (message: any) => {
        console.log('传统模式收到消息:', message);
      },
    };

    return (
      <div>
        <h3>AG-UI集成示例</h3>

        <t-space direction="vertical" size="large">
          {/* AG-UI模式示例 */}
          <div>
            <h4>AG-UI模式 🚀</h4>
            <p style={{ color: '#666', marginBottom: '16px' }}>支持思考过程、工具调用、状态管理等高级功能</p>
            <t-chatbot
              layout="both"
              defaultMessages={[
                {
                  id: 'welcome-agui',
                  role: 'assistant',
                  content: [
                    {
                      type: 'text',
                      data: '欢迎使用AG-UI模式！我支持思考过程展示、工具调用等高级功能。请尝试提问！',
                    },
                  ],
                  status: 'complete',
                  datetime: new Date().toISOString(),
                },
              ]}
              chatServiceConfig={aguiConfig}
              senderProps={{
                placeholder: 'AG-UI模式 - 输入消息...',
              }}
              style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px' }}
            />
          </div>

          {/* 传统模式示例 */}
          <div>
            <h4>传统模式 📝</h4>
            <p style={{ color: '#666', marginBottom: '16px' }}>标准的聊天机器人功能，向后兼容</p>
            <t-chatbot
              layout="both"
              defaultMessages={[
                {
                  id: 'welcome-traditional',
                  role: 'assistant',
                  content: [
                    {
                      type: 'text',
                      data: '这是传统模式的聊天机器人。功能简单但稳定可靠。',
                    },
                  ],
                  status: 'complete',
                  datetime: new Date().toISOString(),
                },
              ]}
              chatServiceConfig={traditionalConfig}
              senderProps={{
                placeholder: '传统模式 - 输入消息...',
              }}
              style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px' }}
            />
          </div>

          {/* 特性对比 */}
          <div>
            <h4>功能对比</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>功能</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>传统模式</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>AG-UI模式</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>基础聊天</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>✅</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>✅</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>流式响应</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>✅</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>✅</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>思考过程展示</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>❌</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>✅</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>工具调用可视化</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>❌</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>✅</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>状态管理</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>❌</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>✅</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>标准化协议</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>❌</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>✅</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 使用说明 */}
          <div>
            <h4>快速开始</h4>
            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
                fontFamily: 'Monaco, monospace',
                fontSize: '14px',
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <strong>AG-UI模式:</strong>
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`const aguiConfig = {
  mode: 'agui',
  agui: {
    url: '/api/agui-agent',
    agentId: 'your-agent-id'
  }
};

<t-chatbot chatServiceConfig={aguiConfig} />`}</pre>

              <div style={{ marginTop: '16px', marginBottom: '12px' }}>
                <strong>传统模式:</strong>
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`const config = {
  endpoint: '/api/chat',
  stream: true
};

<t-chatbot chatServiceConfig={config} />`}</pre>
            </div>
          </div>
        </t-space>
      </div>
    );
  }
}
