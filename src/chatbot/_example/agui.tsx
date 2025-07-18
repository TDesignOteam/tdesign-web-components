/* eslint-disable no-await-in-loop */
import 'tdesign-web-components/chatbot';

import { Component, createRef, signal } from 'omi';
import { findTargetElement, TdChatMessageConfigItem } from 'tdesign-web-components/chatbot';

import Chatbot from '../chat';
import type { AIMessageContent, ChatMessagesData, SSEChunkData } from '../core/type';
import { styles } from './style/agent-step';

// 天气扩展类型定义
declare module '../core/type' {
  interface AIContentTypeOverrides {
    // weather: {
    //   type: 'weather';
    //   data: {
    //     temp: number;
    //     city: string;
    //     conditions?: string;
    //   };
    //   id?: string;
    //   slotName?: string;
    // };
    step: {
      type: 'step';
      data: {
        stepName: string;
        status: 'started' | 'finished';
        timestamp: number;
      };
      status?: ChatMessageStatus;
    };
    travel_plan: {
      type: 'travel_plan';
      data: {
        plan?: string;
        status: 'planning' | 'completed' | 'failed';
        destinations?: string[];
        duration?: string;
        budget?: string;
      };
      status?: ChatMessageStatus;
    };
    travel_step: {
      type: 'travel_step';
      data: {
        step?: string;
        action?: string;
        details?: string;
        status: 'processing' | 'completed' | 'failed';
      };
      status?: ChatMessageStatus;
    };
    travel_state: {
      type: 'travel_state';
      data: {
        currentStep?: string;
        progress?: number;
        context?: any;
        userPreferences?: any;
      };
      status?: ChatMessageStatus;
    };
  }
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
    id: 'travel-demo',
    role: 'user',
    status: 'complete',
    content: [
      {
        type: 'text',
        data: '帮我规划一个3天的北京旅游行程，预算5000元',
      },
    ],
  },
  {
    id: `travel-id-${Date.now()}`,
    role: 'assistant',
    status: 'complete',
    content: [
      {
        type: 'step',
        data: {
          stepName: '需求分析',
          status: 'started',
          timestamp: Date.now() - 30000,
        },
        status: 'complete',
      },
      {
        type: 'travel_state',
        data: {
          currentStep: '需求分析',
          progress: 16.67,
          context: {
            requirements: {
              city: '北京',
              duration: 3,
              budget: 'medium',
              interests: ['历史文化', '美食'],
              accommodation: '商务酒店',
              transportation: '地铁+公交',
            },
            attractions: null,
            weather: null,
            budget: null,
          },
          userPreferences: {},
        },
        status: 'complete',
      },
      {
        type: 'travel_step',
        data: {
          step: '需求分析',
          action: '步骤完成',
          details: '需求分析步骤已完成',
          status: 'completed',
        },
        status: 'complete',
      },
      {
        type: 'travel_step',
        data: {
          step: '景点查询',
          action: '开始执行',
          details: '正在执行景点查询步骤',
          status: 'processing',
        },
        status: 'complete',
      },
      {
        type: 'travel_step',
        data: {
          step: '工具调用',
          action: 'get_attractions',
          details: '正在调用get_attractions工具',
          status: 'processing',
        },
        status: 'complete',
      },
      {
        type: 'travel_step',
        data: {
          step: '工具调用',
          action: '工具调用完成',
          details: '工具调用已完成',
          status: 'completed',
        },
        status: 'complete',
      },
      {
        type: 'travel_state',
        data: {
          currentStep: null,
          progress: 33.33,
          context: {
            requirements: {
              city: '北京',
              duration: 3,
              budget: 'medium',
              interests: ['历史文化', '美食'],
              accommodation: '商务酒店',
              transportation: '地铁+公交',
            },
            attractions: [
              { name: '故宫', rating: 4.8, price: 60 },
              { name: '长城', rating: 4.9, price: 120 },
              { name: '天坛', rating: 4.7, price: 35 },
            ],
            weather: {
              day1: { condition: '晴天', temp: '15-25°C' },
              day2: { condition: '多云', temp: '12-22°C' },
              day3: { condition: '小雨', temp: '10-18°C' },
            },
            budget: {
              attractions: 275,
              accommodation: 600,
              meals: 300,
              transportation: 75,
              total: 1250,
            },
          },
          userPreferences: {},
        },
        status: 'complete',
      },
      {
        type: 'travel_plan',
        data: {
          plan: '已生成完整行程规划',
          status: 'completed',
          destinations: [
            '故宫博物院',
            '天安门广场',
            '王府井步行街',
            '八达岭长城',
            '颐和园',
            '什刹海酒吧街',
            '天坛公园',
            '南锣鼓巷',
            '后海',
          ],
          duration: '3天',
          budget: '1250元',
        },
        status: 'complete',
      },
      {
        type: 'text',
        data: '## 🏛️ 北京3日文化之旅规划\n\n### 第一天：故宫 + 天安门广场\n- 上午：游览故宫博物院（建议预约）\n- 下午：天安门广场、国家博物馆\n- 晚上：王府井步行街、小吃街\n\n### 第二天：天坛 + 颐和园\n- 上午：天坛公园（祈年殿、回音壁）\n- 下午：颐和园（长廊、佛香阁）\n- 晚上：什刹海酒吧街\n\n### 第三天：胡同文化\n- 上午：南锣鼓巷、后海\n- 下午：恭王府、景山公园\n- 晚上：鸟巢、水立方夜景\n\n### 💰 预算明细\n- 景点门票：275元\n- 住宿费用：600元\n- 餐饮费用：300元\n- 交通费用：75元\n- **总计：1250元**（远低于预算5000元）\n\n需要我为您预订酒店或提供更详细的景点信息吗？',
      },
    ],
  },
];

// 测试用的回调配置
const mockModelsWithCallbacks = {
  endpoint: 'http://localhost:3000/sse/travel-agent',
  stream: true,
  protocol: 'agui',
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

  // Engine内部会自动处理AG-UI协议事件映射
  onMessage: (chunk: SSEChunkData) => {
    // 记录原始事件用于调试

    // 处理TravelAgent相关的自定义事件
    const event = chunk.data;
    if (!event?.type) return null;

    console.log('onmessage:', JSON.stringify(event));
    // 处理STEP_STARTED/STEP_FINISHED事件
    if (event.type === 'STEP_STARTED' || event.type === 'STEP_FINISHED') {
      return {
        type: 'step',
        data: {
          stepName: event.stepName,
          status: event.type === 'STEP_FINISHED' ? 'finished' : 'started',
          timestamp: event.timestamp || Date.now(),
        },
        status: event.type === 'STEP_FINISHED' ? 'complete' : 'streaming',
      } as AIMessageContent;
    }

    // 处理STATE_SNAPSHOT事件 - 提取旅行相关信息
    if (event.type === 'STATE_SNAPSHOT' && event.snapshot) {
      const { snapshot } = event;
      const travelStateContent = [];

      // 如果有当前步骤信息
      if (snapshot.currentStep) {
        travelStateContent.push({
          type: 'travel_state',
          data: {
            currentStep: snapshot.currentStep,
            progress: snapshot.completedSteps ? (snapshot.completedSteps.length / 6) * 100 : 0,
            context: {
              requirements: snapshot.requirements,
              attractions: snapshot.attractions,
              weather: snapshot.weather,
              budget: snapshot.budget,
            },
            userPreferences: snapshot.userPreferences,
          },
          status: 'complete',
        } as AIMessageContent);
      }

      // 如果有行程信息
      if (snapshot.currentItinerary && Object.keys(snapshot.currentItinerary).length > 0) {
        travelStateContent.push({
          type: 'travel_plan',
          data: {
            plan: '已生成完整行程规划',
            status: 'completed',
            destinations: Object.values(snapshot.currentItinerary).flat(),
            duration: snapshot.requirements?.duration ? `${snapshot.requirements.duration}天` : undefined,
            budget: snapshot.budget?.total ? `${snapshot.budget.total}元` : undefined,
          },
          status: 'complete',
        } as AIMessageContent);
      }

      return travelStateContent.length > 0 ? travelStateContent : null;
    }

    // 处理STATE_DELTA事件 - 实时更新状态
    if (event.type === 'STATE_DELTA' && event.delta) {
      const { delta } = event;
      const travelStepContent = [];

      // 检查是否有新的完成步骤
      const completedStepsDelta = delta.find((d) => d.path === '/completedSteps');
      if (completedStepsDelta && completedStepsDelta.value) {
        const completedSteps = completedStepsDelta.value;
        const lastStep = completedSteps[completedSteps.length - 1];

        if (lastStep) {
          travelStepContent.push({
            type: 'travel_step',
            data: {
              step: lastStep,
              action: '步骤完成',
              details: `${lastStep}步骤已完成`,
              status: 'completed',
            },
            status: 'complete',
          } as AIMessageContent);
        }
      }

      // 检查是否有新的当前步骤
      const currentStepDelta = delta.find((d) => d.path === '/currentStep');
      if (currentStepDelta && currentStepDelta.value) {
        travelStepContent.push({
          type: 'travel_step',
          data: {
            step: currentStepDelta.value,
            action: '开始执行',
            details: `正在执行${currentStepDelta.value}步骤`,
            status: 'processing',
          },
          status: 'streaming',
        } as AIMessageContent);
      }

      return travelStepContent.length > 0 ? travelStepContent : null;
    }

    // 处理TOOL_CALL事件 - 转换为travel_step
    if (event.type === 'TOOL_CALL_START') {
      return {
        type: 'travel_step',
        data: {
          step: '工具调用',
          action: event.toolCallName,
          details: `正在调用${event.toolCallName}工具`,
          status: 'processing',
        },
        status: 'streaming',
      } as AIMessageContent;
    }

    if (event.type === 'TOOL_CALL_END') {
      return {
        type: 'travel_step',
        data: {
          step: '工具调用',
          action: '工具调用完成',
          details: '工具调用已完成',
          status: 'completed',
        },
        status: 'complete',
      } as AIMessageContent;
    }

    // 返回null，让engine内部使用默认的AGUIEventMapper处理其他事件
    return null;
  },

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

export default class BasicChat extends Component {
  static css = [styles];

  chatRef = createRef<Chatbot>();

  private mockMessage = signal([]);

  install(): void {
    this.mockMessage.value = mockData;
  }

  messageChangeHandler = (e: CustomEvent) => {
    this.mockMessage.value = e.detail;
  };

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
        // variant: 'outline',
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        actions: ['replay', 'copy', 'good', 'bad'],
        chatContentProps: {
          search: {
            collapsed: search?.status === 'complete' ? true : false,
          },
          thinking: {
            maxHeight: 100,
            collapsed: thinking?.status === 'complete' ? true : false,
            layout: 'border',
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
      <>
        <t-chatbot
          ref={this.chatRef}
          style={{ display: 'block', height: '80vh' }}
          defaultMessages={mockData}
          messageProps={this.messagePropsFunc}
          listProps={{
            defaultScrollTo: 'top',
          }}
          senderProps={{
            actions: true,
            placeholder: '请输入问题',
          }}
          chatServiceConfig={mockModelsWithCallbacks}
          onMessageChange={this.messageChangeHandler}
          onChatReady={(e) => console.log('chatReady', e)}
        >
          {/* 自定义渲染-植入插槽 */}
          {this.mockMessage.value
            ?.map((data) =>
              data.content.map((item, index) => {
                switch (item.type) {
                  case 'step':
                    console.log('====step', data, item);
                    return (
                      <div slot={`${data.id}-${item.type}-${index}`} className="travel-step">
                        <div className="step-indicator">
                          <div className={`step-status ${item.data.status}`}>
                            {item.data.status === 'started' ? '🔄' : '✅'}
                          </div>
                          <div className="step-content">
                            <div className="step-name">{item.data.stepName}</div>
                            <div className="step-time">{new Date(item.data.timestamp).toLocaleTimeString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  case 'travel_plan':
                    return (
                      <div slot={`${data.id}-${item.type}-${index}`} className="travel-plan">
                        <div className="plan-header">
                          <h4>📋 旅行计划</h4>
                          <span className={`status ${item.data.status}`}>
                            {item.data.status === 'planning' && '规划中'}
                            {item.data.status === 'completed' && '已完成'}
                            {item.data.status === 'failed' && '失败'}
                          </span>
                        </div>
                        {item.data.plan && (
                          <div className="plan-content">
                            <p>{item.data.plan}</p>
                          </div>
                        )}
                        {item.data.destinations && item.data.destinations.length > 0 && (
                          <div className="destinations">
                            <strong>目的地：</strong>
                            {item.data.destinations.join(' → ')}
                          </div>
                        )}
                        {(item.data.duration || item.data.budget) && (
                          <div className="plan-details">
                            {item.data.duration && <span>⏱️ {item.data.duration}</span>}
                            {item.data.budget && <span>💰 {item.data.budget}</span>}
                          </div>
                        )}
                      </div>
                    );
                  case 'travel_step':
                    return (
                      <div slot={`${data.id}-${item.type}-${index}`} className="travel-action">
                        <div className="action-header">
                          <div className={`action-status ${item.data.status}`}>
                            {item.data.status === 'processing' && '🔄'}
                            {item.data.status === 'completed' && '✅'}
                            {item.data.status === 'failed' && '❌'}
                          </div>
                          <div className="action-info">
                            <div className="action-step">{item.data.step}</div>
                            <div className="action-name">{item.data.action}</div>
                          </div>
                        </div>
                        {item.data.details && <div className="action-details">{item.data.details}</div>}
                      </div>
                    );
                  case 'travel_state':
                    return (
                      <div slot={`${data.id}-${item.type}-${index}`} className="travel-state">
                        <div className="state-header">
                          <h5>📊 当前状态</h5>
                          {item.data.progress !== undefined && (
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${item.data.progress}%` }}></div>
                              <span className="progress-text">{item.data.progress}%</span>
                            </div>
                          )}
                        </div>
                        {item.data.currentStep && (
                          <div className="current-step">
                            <strong>当前步骤：</strong>
                            {item.data.currentStep}
                          </div>
                        )}
                        {/* {item.data.context && (
                          <div className="context-info">
                            <strong>上下文：</strong>
                            <pre>{JSON.stringify(item.data.context, null, 2)}</pre>
                          </div>
                        )} */}
                      </div>
                    );
                }
                return null;
              }),
            )
            .flat()}
        </t-chatbot>
      </>
    );
  }
}
