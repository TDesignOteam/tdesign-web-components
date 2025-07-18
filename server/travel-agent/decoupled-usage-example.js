/**
 * 解耦事件处理器使用示例
 * 展示如何解决state和messages之间的耦合问题
 */

import { DecoupledAGUIEventHandler } from './decoupled-event-handler.js';

// 模拟AG-UI事件流
const mockEvents = [
  // 1. 会话开始
  {
    type: 'RUN_STARTED',
    runId: 'run_123',
    threadId: 'thread_456',
    timestamp: Date.now(),
  },

  // 2. 步骤开始 - 需求分析
  {
    type: 'STEP_STARTED',
    stepName: '需求分析',
    timestamp: Date.now(),
  },

  // 3. 文本消息 - 开始分析
  {
    type: 'TEXT_MESSAGE_START',
    messageId: 'msg_001',
    role: 'assistant',
    timestamp: Date.now(),
  },
  {
    type: 'TEXT_MESSAGE_CHUNK',
    messageId: 'msg_001',
    delta: '我正在分析您的旅游需求...',
    timestamp: Date.now(),
  },
  {
    type: 'TEXT_MESSAGE_END',
    messageId: 'msg_001',
    timestamp: Date.now(),
  },

  // 4. 状态更新 - 用户需求
  {
    type: 'STATE_DELTA',
    delta: [
      {
        op: 'add',
        path: '/requirements',
        value: {
          city: '北京',
          duration: 3,
          budget: 2000,
          interests: ['历史文化', '美食'],
        },
      },
    ],
    timestamp: Date.now(),
  },

  // 5. 步骤完成
  {
    type: 'STEP_FINISHED',
    stepName: '需求分析',
    timestamp: Date.now(),
  },

  // 6. 步骤开始 - 景点查询
  {
    type: 'STEP_STARTED',
    stepName: '景点查询',
    timestamp: Date.now(),
  },

  // 7. 工具调用 - 查询景点
  {
    type: 'TOOL_CALL_START',
    toolCallId: 'tool_001',
    toolCallName: 'search_attractions',
    parentMessageId: 'msg_002',
    timestamp: Date.now(),
  },
  {
    type: 'TOOL_CALL_ARGS',
    toolCallId: 'tool_001',
    delta: JSON.stringify({
      city: '北京',
      interests: ['历史文化', '美食'],
    }),
    timestamp: Date.now(),
  },
  {
    type: 'TOOL_CALL_END',
    toolCallId: 'tool_001',
    timestamp: Date.now(),
  },
  {
    type: 'TOOL_CALL_RESULT',
    toolCallId: 'tool_001',
    content: JSON.stringify([
      { name: '故宫博物院', rating: 4.8, price: 60, type: '历史文化' },
      { name: '天安门广场', rating: 4.6, price: 0, type: '历史文化' },
      { name: '颐和园', rating: 4.7, price: 30, type: '历史文化' },
      { name: '全聚德烤鸭', rating: 4.5, price: 200, type: '美食' },
      { name: '老北京炸酱面', rating: 4.3, price: 25, type: '美食' },
    ]),
    role: 'tool',
    timestamp: Date.now(),
  },

  // 8. 状态更新 - 景点数据
  {
    type: 'STATE_DELTA',
    delta: [
      {
        op: 'add',
        path: '/attractions',
        value: [
          { name: '故宫博物院', rating: 4.8, price: 60, type: '历史文化' },
          { name: '天安门广场', rating: 4.6, price: 0, type: '历史文化' },
          { name: '颐和园', rating: 4.7, price: 30, type: '历史文化' },
          { name: '全聚德烤鸭', rating: 4.5, price: 200, type: '美食' },
          { name: '老北京炸酱面', rating: 4.3, price: 25, type: '美食' },
        ],
      },
    ],
    timestamp: Date.now(),
  },

  // 9. 自定义事件 - 生成景点消息（触发模板消息生成）
  {
    type: 'CUSTOM',
    name: 'generate_message',
    template: 'attraction_list',
    messageId: 'msg_attractions',
    timestamp: Date.now(),
  },

  // 10. 步骤完成
  {
    type: 'STEP_FINISHED',
    stepName: '景点查询',
    timestamp: Date.now(),
  },

  // 11. 步骤开始 - 天气查询
  {
    type: 'STEP_STARTED',
    stepName: '天气查询',
    timestamp: Date.now(),
  },

  // 12. 工具调用 - 查询天气
  {
    type: 'TOOL_CALL_START',
    toolCallId: 'tool_002',
    toolCallName: 'get_weather',
    parentMessageId: 'msg_003',
    timestamp: Date.now(),
  },
  {
    type: 'TOOL_CALL_ARGS',
    toolCallId: 'tool_002',
    delta: JSON.stringify({ city: '北京', days: 3 }),
    timestamp: Date.now(),
  },
  {
    type: 'TOOL_CALL_END',
    toolCallId: 'tool_002',
    timestamp: Date.now(),
  },
  {
    type: 'TOOL_CALL_RESULT',
    toolCallId: 'tool_002',
    content: JSON.stringify({
      第一天: { condition: '晴', temp: '25°C', humidity: '45%' },
      第二天: { condition: '多云', temp: '22°C', humidity: '60%' },
      第三天: { condition: '小雨', temp: '18°C', humidity: '80%' },
    }),
    role: 'tool',
    timestamp: Date.now(),
  },

  // 13. 状态更新 - 天气数据
  {
    type: 'STATE_DELTA',
    delta: [
      {
        op: 'add',
        path: '/weather',
        value: {
          第一天: { condition: '晴', temp: '25°C', humidity: '45%' },
          第二天: { condition: '多云', temp: '22°C', humidity: '60%' },
          第三天: { condition: '小雨', temp: '18°C', humidity: '80%' },
        },
      },
    ],
    timestamp: Date.now(),
  },

  // 14. 自定义事件 - 生成天气消息
  {
    type: 'CUSTOM',
    name: 'generate_message',
    template: 'weather_report',
    messageId: 'msg_weather',
    timestamp: Date.now(),
  },

  // 15. 步骤完成
  {
    type: 'STEP_FINISHED',
    stepName: '天气查询',
    timestamp: Date.now(),
  },

  // 16. 步骤开始 - 路线规划
  {
    type: 'STEP_STARTED',
    stepName: '路线规划',
    timestamp: Date.now(),
  },

  // 17. 状态更新 - 行程规划
  {
    type: 'STATE_DELTA',
    delta: [
      {
        op: 'add',
        path: '/currentItinerary',
        value: {
          第一天: ['上午：天安门广场（免费）', '下午：故宫博物院（60元）', '晚上：全聚德烤鸭（200元）'],
          第二天: ['上午：颐和园（30元）', '下午：老北京炸酱面（25元）', '晚上：王府井步行街（免费）'],
          第三天: ['上午：国家博物馆（免费）', '下午：南锣鼓巷（免费）', '晚上：北京烤鸭（150元）'],
        },
      },
    ],
    timestamp: Date.now(),
  },

  // 18. 自定义事件 - 生成行程消息
  {
    type: 'CUSTOM',
    name: 'generate_message',
    template: 'itinerary_summary',
    messageId: 'msg_itinerary',
    timestamp: Date.now(),
  },

  // 19. 步骤完成
  {
    type: 'STEP_FINISHED',
    stepName: '路线规划',
    timestamp: Date.now(),
  },

  // 20. 步骤开始 - 预算计算
  {
    type: 'STEP_STARTED',
    stepName: '预算计算',
    timestamp: Date.now(),
  },

  // 21. 状态更新 - 预算数据
  {
    type: 'STATE_DELTA',
    delta: [
      {
        op: 'add',
        path: '/budget',
        value: {
          total: 465,
          attractions: 90,
          accommodation: 0,
          meals: 375,
          transportation: 0,
        },
      },
    ],
    timestamp: Date.now(),
  },

  // 22. 自定义事件 - 生成预算消息
  {
    type: 'CUSTOM',
    name: 'generate_message',
    template: 'budget_breakdown',
    messageId: 'msg_budget',
    timestamp: Date.now(),
  },

  // 23. 步骤完成
  {
    type: 'STEP_FINISHED',
    stepName: '预算计算',
    timestamp: Date.now(),
  },

  // 24. 会话完成
  {
    type: 'RUN_FINISHED',
    result: {
      totalSteps: 5,
      totalMessages: 4,
      totalToolCalls: 2,
    },
    timestamp: Date.now(),
  },
];

// 使用示例
class TravelAgentDemo {
  constructor() {
    this.handler = new DecoupledAGUIEventHandler();
    this.setupUI();
    this.setupEventHandling();
  }

  setupUI() {
    // 模拟UI组件
    this.handler.ui = {
      messageContainer: document.getElementById('message-container') || this.createMockElement('div'),
      progressBar: document.getElementById('progress-bar') || this.createMockElement('div'),
      inputDialog: document.getElementById('input-dialog') || this.createMockElement('div'),
      notificationContainer: document.getElementById('notification-container') || this.createMockElement('div'),
      statusIndicator: document.getElementById('status-indicator') || this.createMockElement('div'),
      historyContainer: document.getElementById('history-container') || this.createMockElement('div'),
    };
  }

  createMockElement(tag) {
    const element = document.createElement(tag);
    element.style.display = 'none';
    document.body.appendChild(element);
    return element;
  }

  setupEventHandling() {
    // 添加用户输入处理方法
    this.handler.sendUserInput = (requestId, input) => {
      console.log(`📝 用户输入: ${input} (请求ID: ${requestId})`);
      this.handler.showNotification('success', `已收到输入: ${input}`);

      // 模拟继续处理
      setTimeout(() => {
        this.handler.handleEvent({
          type: 'CUSTOM',
          name: 'stream_resume',
          timestamp: Date.now(),
        });
      }, 1000);
    };
  }

  // 开始演示
  async startDemo() {
    console.log('🚀 开始旅游规划Agent演示');
    console.log('📊 初始状态:', this.handler.getStateSnapshot());

    // 逐条处理事件
    for (const [i, event] of mockEvents.entries()) {
      console.log(`\n--- 处理事件 ${i + 1}/${mockEvents.length} ---`);
      console.log(`📨 事件类型: ${event.type}`);

      // 处理事件
      this.handler.handleEvent(event);

      // 显示当前状态
      this.showCurrentState();

      // 延迟以便观察
      await this.delay(500);
    }

    // 显示最终结果
    this.showFinalResults();
  }

  showCurrentState() {
    const state = this.handler.getStateSnapshot();
    console.log('📊 当前状态:', {
      isRunning: state.isRunning,
      currentStep: state.currentStep,
      completedSteps: state.completedSteps,
      messageCount: state.messages.length,
      hasRequirements: !!state.requirements,
      hasAttractions: !!state.attractions,
      hasWeather: !!state.weather,
      hasItinerary: !!state.currentItinerary,
      hasBudget: !!state.budget,
    });
  }

  showFinalResults() {
    console.log('\n🎉 演示完成！');
    console.log('📋 最终状态:', this.handler.getStateSnapshot());
    console.log('💬 消息历史:', this.handler.getMessageHistory());
    console.log('🔧 工具调用:', Array.from(this.handler.toolCalls.values()));
    console.log('📊 会话历史:', this.handler.state.sessionHistory);

    // 导出会话数据
    const sessionData = this.handler.exportSessionData();
    console.log('💾 会话数据:', sessionData);
  }

  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  // 测试特定场景
  testCustomMessageGeneration() {
    console.log('\n🧪 测试自定义消息生成');

    // 模拟状态数据
    this.handler.state.requirements = {
      city: '上海',
      duration: 2,
      budget: 1500,
    };

    this.handler.state.attractions = [
      { name: '外滩', rating: 4.8, price: 0 },
      { name: '东方明珠', rating: 4.6, price: 220 },
    ];

    this.handler.state.weather = {
      第一天: { condition: '晴', temp: '28°C' },
      第二天: { condition: '多云', temp: '25°C' },
    };

    this.handler.state.currentItinerary = {
      第一天: ['上午：外滩', '下午：南京路步行街'],
      第二天: ['上午：东方明珠', '下午：陆家嘴'],
    };

    this.handler.state.budget = {
      total: 800,
      attractions: 220,
      meals: 580,
    };

    // 生成各种类型的消息
    this.handler.createTemplatedMessage('attraction_list', 'test_attractions');
    this.handler.createTemplatedMessage('weather_report', 'test_weather');
    this.handler.createTemplatedMessage('itinerary_summary', 'test_itinerary');
    this.handler.createTemplatedMessage('budget_breakdown', 'test_budget');

    console.log('✅ 自定义消息生成测试完成');
  }

  // 测试状态观察者
  testStateObserver() {
    console.log('\n👀 测试状态观察者');

    // 直接更新状态，观察是否自动生成消息
    this.handler.state.attractions = [
      { name: '西湖', rating: 4.9, price: 0 },
      { name: '灵隐寺', rating: 4.7, price: 30 },
    ];

    this.handler.state.weather = {
      第一天: { condition: '晴', temp: '26°C' },
    };

    this.handler.state.currentItinerary = {
      第一天: ['上午：西湖', '下午：雷峰塔'],
    };

    this.handler.state.budget = {
      total: 300,
      attractions: 30,
      meals: 270,
    };

    console.log('✅ 状态观察者测试完成');
  }
}

// 运行演示
async function runDemo() {
  const demo = new TravelAgentDemo();

  // 运行完整演示
  await demo.startDemo();

  // 运行特定测试
  demo.testCustomMessageGeneration();
  demo.testStateObserver();
}

// 如果直接运行此文件
if (typeof window !== 'undefined') {
  // 浏览器环境
  window.runTravelAgentDemo = runDemo;
  console.log('🌐 在浏览器中运行: window.runTravelAgentDemo()');
} else {
  // Node.js环境
  console.log('🖥️ 在Node.js中运行演示...');
  runDemo().catch(console.error);
}

export { TravelAgentDemo, runDemo };
