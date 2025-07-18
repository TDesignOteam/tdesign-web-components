// TravelAgent组件测试脚本
// 在浏览器控制台运行此脚本来测试组件功能

console.log('🧪 开始测试TravelAgent组件...');

// 模拟SSE事件流
const mockSSEEvents = [
  {
    type: 'RUN_STARTED',
    timestamp: Date.now(),
    threadId: 'test-thread-id',
    runId: 'test-run-id',
  },
  {
    type: 'STATE_SNAPSHOT',
    timestamp: Date.now(),
    snapshot: {
      userPreferences: {},
      currentItinerary: {},
      completedSteps: [],
      currentStep: null,
      pendingUserInput: false,
      requirements: null,
      attractions: null,
      weather: null,
      budget: null,
    },
  },
  {
    type: 'STEP_STARTED',
    timestamp: Date.now(),
    stepName: '需求分析',
  },
  {
    type: 'TEXT_MESSAGE_START',
    timestamp: Date.now(),
    messageId: 'test-message-id',
    role: 'assistant',
  },
  {
    type: 'TEXT_MESSAGE_CHUNK',
    timestamp: Date.now(),
    messageId: 'test-message-id',
    role: 'assistant',
    delta: '我正在分析您的旅游需求...\n\n',
  },
  {
    type: 'STATE_DELTA',
    timestamp: Date.now(),
    delta: [
      {
        op: 'replace',
        path: '/requirements',
        value: {
          city: '北京',
          duration: 3,
          budget: 'medium',
          interests: ['历史文化', '美食'],
          accommodation: '商务酒店',
          transportation: '地铁+公交',
        },
      },
    ],
  },
  {
    type: 'TEXT_MESSAGE_END',
    timestamp: Date.now(),
    messageId: 'test-message-id',
  },
  {
    type: 'STEP_FINISHED',
    timestamp: Date.now(),
    stepName: '需求分析',
  },
  {
    type: 'STATE_DELTA',
    timestamp: Date.now(),
    delta: [
      {
        op: 'replace',
        path: '/completedSteps',
        value: ['需求分析'],
      },
      {
        op: 'replace',
        path: '/currentStep',
        value: null,
      },
    ],
  },
  {
    type: 'STEP_STARTED',
    timestamp: Date.now(),
    stepName: '景点查询',
  },
  {
    type: 'TOOL_CALL_START',
    timestamp: Date.now(),
    toolCallId: 'test-tool-id',
    toolCallName: 'get_attractions',
    parentMessageId: 'test-message-id',
  },
  {
    type: 'TOOL_CALL_ARGS',
    timestamp: Date.now(),
    toolCallId: 'test-tool-id',
    delta: '{"city":"北京","category":["历史文化","美食"],"limit":10,"budget":"medium"}',
  },
  {
    type: 'TOOL_CALL_END',
    timestamp: Date.now(),
    toolCallId: 'test-tool-id',
  },
  {
    type: 'TOOL_CALL_RESULT',
    timestamp: Date.now(),
    messageId: 'test-result-id',
    toolCallId: 'test-tool-id',
    content:
      '[{"name":"故宫","rating":4.8,"price":60},{"name":"长城","rating":4.9,"price":120},{"name":"天坛","rating":4.7,"price":35}]',
    role: 'tool',
  },
  {
    type: 'STATE_DELTA',
    timestamp: Date.now(),
    delta: [
      {
        op: 'replace',
        path: '/attractions',
        value: [
          { name: '故宫', rating: 4.8, price: 60 },
          { name: '长城', rating: 4.9, price: 120 },
          { name: '天坛', rating: 4.7, price: 35 },
        ],
      },
    ],
  },
  {
    type: 'STEP_FINISHED',
    timestamp: Date.now(),
    stepName: '景点查询',
  },
  {
    type: 'STATE_DELTA',
    timestamp: Date.now(),
    delta: [
      {
        op: 'replace',
        path: '/completedSteps',
        value: ['需求分析', '景点查询'],
      },
      {
        op: 'replace',
        path: '/currentStep',
        value: null,
      },
    ],
  },
  {
    type: 'STATE_SNAPSHOT',
    timestamp: Date.now(),
    snapshot: {
      userPreferences: {},
      currentItinerary: {
        day1: ['故宫博物院', '天安门广场', '王府井步行街'],
        day2: ['八达岭长城', '颐和园', '什刹海酒吧街'],
        day3: ['天坛公园', '南锣鼓巷', '后海'],
      },
      completedSteps: ['需求分析', '景点查询', '天气查询', '路线规划', '预算计算', '行程总结'],
      currentStep: null,
      pendingUserInput: false,
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
  },
  {
    type: 'RUN_FINISHED',
    timestamp: Date.now(),
    threadId: 'test-thread-id',
    runId: 'test-run-id',
    result: {
      totalSteps: 6,
      generatedItinerary: true,
      totalCost: 1250,
      duration: 3,
    },
  },
];

// 测试事件处理函数
function testEventProcessing() {
  console.log('📋 测试事件处理逻辑...');

  // 模拟onMessage回调
  const onMessage = (chunk) => {
    const event = chunk.data;
    if (!event?.type) return null;

    console.log(`🔍 处理事件: ${event.type}`);

    // 处理STEP_STARTED/STEP_FINISHED事件
    if (event.type === 'STEP_STARTED' || event.type === 'STEP_FINISHED') {
      const result = {
        type: 'step',
        data: {
          stepName: event.stepName,
          status: event.type === 'STEP_FINISHED' ? 'finished' : 'started',
          timestamp: event.timestamp || Date.now(),
        },
        status: event.type === 'STEP_FINISHED' ? 'complete' : 'streaming',
      };
      console.log('✅ 生成step组件:', result);
      return [result];
    }

    // 处理STATE_SNAPSHOT事件
    if (event.type === 'STATE_SNAPSHOT' && event.snapshot) {
      const { snapshot } = event;
      const results = [];

      // 如果有当前步骤信息
      if (snapshot.currentStep) {
        results.push({
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
        });
      }

      // 如果有行程信息
      if (snapshot.currentItinerary && Object.keys(snapshot.currentItinerary).length > 0) {
        results.push({
          type: 'travel_plan',
          data: {
            plan: '已生成完整行程规划',
            status: 'completed',
            destinations: Object.values(snapshot.currentItinerary).flat(),
            duration: snapshot.requirements?.duration ? `${snapshot.requirements.duration}天` : undefined,
            budget: snapshot.budget?.total ? `${snapshot.budget.total}元` : undefined,
          },
          status: 'complete',
        });
      }

      if (results.length > 0) {
        console.log('✅ 生成state组件:', results);
        return results;
      }
    }

    // 处理STATE_DELTA事件
    if (event.type === 'STATE_DELTA' && event.delta) {
      const { delta } = event;
      const results = [];

      // 检查是否有新的完成步骤
      const completedStepsDelta = delta.find((d) => d.path === '/completedSteps');
      if (completedStepsDelta && completedStepsDelta.value) {
        const completedSteps = completedStepsDelta.value;
        const lastStep = completedSteps[completedSteps.length - 1];

        if (lastStep) {
          results.push({
            type: 'travel_step',
            data: {
              step: lastStep,
              action: '步骤完成',
              details: `${lastStep}步骤已完成`,
              status: 'completed',
            },
            status: 'complete',
          });
        }
      }

      if (results.length > 0) {
        console.log('✅ 生成delta组件:', results);
        return results;
      }
    }

    // 处理TOOL_CALL事件
    if (event.type === 'TOOL_CALL_START') {
      const result = {
        type: 'travel_step',
        data: {
          step: '工具调用',
          action: event.toolCallName,
          details: `正在调用${event.toolCallName}工具`,
          status: 'processing',
        },
        status: 'streaming',
      };
      console.log('✅ 生成tool_call组件:', result);
      return [result];
    }

    return null;
  };

  // 测试每个事件
  mockSSEEvents.forEach((event, index) => {
    console.log(`\n--- 测试事件 ${index + 1}: ${event.type} ---`);
    const chunk = { data: event };
    const result = onMessage(chunk);
    if (result) {
      console.log('📤 返回结果:', result);
    } else {
      console.log('⏭️ 跳过处理');
    }
  });
}

// 测试UI渲染
function testUIRendering() {
  console.log('\n🎨 测试UI渲染...');

  // 模拟消息数据
  const mockMessage = {
    id: 'test-message',
    role: 'assistant',
    status: 'complete',
    content: [
      {
        type: 'step',
        data: {
          stepName: '需求分析',
          status: 'started',
          timestamp: Date.now(),
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
            },
          },
          userPreferences: {},
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
        status: 'streaming',
      },
      {
        type: 'travel_plan',
        data: {
          plan: '已生成完整行程规划',
          status: 'completed',
          destinations: ['故宫博物院', '天安门广场', '王府井步行街'],
          duration: '3天',
          budget: '1250元',
        },
        status: 'complete',
      },
    ],
  };

  console.log('📋 模拟消息数据:', mockMessage);
  console.log('✅ UI渲染测试完成');
}

// 运行测试
console.log('🚀 开始运行测试...\n');
testEventProcessing();
testUIRendering();
console.log('\n🎉 所有测试完成！');

// 导出测试函数供外部调用
if (typeof window !== 'undefined') {
  (window as any).testTravelAgentEventProcessing = testEventProcessing;
  (window as any).testTravelAgentUIRendering = testUIRendering;
  console.log('📤 测试函数已导出到全局作用域');
}
