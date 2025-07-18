/**
 * 旅游行程规划Agent Mock数据
 * 展示AG-UI协议所有事件类型的具体使用
 */

import { v4 as uuidv4 } from 'uuid';

class TravelAgentMockData {
  constructor() {
    this.runId = uuidv4();
    this.threadId = uuidv4();
    this.agentId = 'travel-planner-v1';
    this.messageId = uuidv4();
    this.toolCallId = uuidv4();
    this.stepId = uuidv4();
  }

  // 生成完整的旅游行程规划事件流
  generateTravelPlanningEvents() {
    const events = [];

    // 1. 生命周期事件 - 开始运行
    events.push(this.createRunStartedEvent());

    // 2. 步骤事件 - 需求分析
    events.push(this.createStepStartedEvent('需求分析'));
    events.push(this.createTextMessageStartEvent());
    events.push(this.createTextMessageChunkEvent('我正在分析您的旅游需求...\n\n'));
    events.push(this.createStepFinishedEvent('需求分析'));

    // 3. 工具调用事件 - 查询景点信息
    events.push(this.createStepStartedEvent('景点查询'));
    events.push(this.createToolCallStartEvent('get_attractions'));
    events.push(
      this.createToolCallChunkEvent(
        JSON.stringify({
          city: '北京',
          category: 'historical',
          limit: 10,
          budget: 'medium',
        }),
      ),
    );
    events.push(this.createToolCallEndEvent());
    events.push(this.createStepFinishedEvent('景点查询'));

    // 4. 状态快照事件
    events.push(
      this.createStateSnapshotEvent({
        userPreferences: {
          duration: 3,
          budget: '中等',
          interests: ['历史文化', '美食'],
          travelStyle: 'relaxed',
        },
        currentItinerary: {
          day1: ['故宫', '天安门广场', '王府井'],
          day2: ['长城', '颐和园'],
          day3: ['天坛', '南锣鼓巷', '后海'],
        },
        completedSteps: ['需求分析', '景点查询'],
        currentStep: '路线规划',
      }),
    );

    // 5. 步骤事件 - 路线规划
    events.push(this.createStepStartedEvent('路线规划', '根据景点信息规划最优路线'));
    events.push(this.createTextMessageChunkEvent('**第一天：故宫 + 天安门广场**\n'));
    events.push(this.createTextMessageChunkEvent('- 上午：游览故宫博物院（建议8:30开始，避开人流高峰）\n'));
    events.push(this.createTextMessageChunkEvent('- 下午：天安门广场、国家博物馆\n'));
    events.push(this.createTextMessageChunkEvent('- 晚上：王府井步行街、品尝北京烤鸭\n\n'));

    // 6. 工具调用事件 - 查询天气
    events.push(this.createToolCallStartEvent('get_weather', '查询北京未来3天天气'));
    events.push(
      this.createToolCallChunkEvent({
        city: '北京',
        days: 3,
      }),
    );
    events.push(
      this.createToolCallEndEvent(
        {
          forecast: {
            day1: { condition: '晴天', temp: '15-25°C', humidity: '45%' },
            day2: { condition: '多云', temp: '12-22°C', humidity: '60%' },
            day3: { condition: '小雨', temp: '10-18°C', humidity: '75%' },
          },
        },
        true,
        800,
      ),
    );
    events.push(this.createStepFinishedEvent('路线规划', { totalDays: 3 }));

    // 7. 状态增量更新事件
    events.push(
      this.createStateDeltaEvent([
        {
          op: 'add',
          path: '/currentItinerary/day2/1',
          value: '圆明园',
        },
        {
          op: 'replace',
          path: '/currentStep',
          value: '景点优化',
        },
      ]),
    );

    // 8. 步骤事件 - 景点优化
    events.push(this.createStepStartedEvent('景点优化', '根据天气和用户偏好优化行程'));
    events.push(this.createTextMessageChunkEvent('**第二天：长城 + 颐和园**\n'));
    events.push(this.createTextMessageChunkEvent('- 上午：八达岭长城（天气多云，适合户外活动）\n'));
    events.push(this.createTextMessageChunkEvent('- 下午：颐和园（避开正午高温）\n'));
    events.push(this.createTextMessageChunkEvent('- 晚上：什刹海酒吧街\n\n'));

    // 9. 自定义事件 - 路线优化
    events.push(
      this.createCustomEvent('route_optimization', {
        originalRoute: ['故宫', '天安门', '王府井'],
        optimizedRoute: ['天安门', '故宫', '王府井'],
        reason: '减少步行距离，提高游览效率',
        timeSaved: '30分钟',
        distanceSaved: '1.2公里',
      }),
    );

    // 10. 步骤事件 - 预算计算
    events.push(this.createStepStartedEvent('预算计算', '计算行程总费用'));
    events.push(this.createToolCallStartEvent('calculate_budget', '计算3天行程总费用'));
    events.push(
      this.createToolCallChunkEvent({
        attractions: ['故宫', '长城', '颐和园', '天坛'],
        accommodation: '经济型酒店',
        meals: '中等标准',
        transportation: '地铁+公交',
      }),
    );
    events.push(
      this.createToolCallEndEvent(
        {
          totalCost: 1250,
          breakdown: {
            attractions: 275,
            accommodation: 600,
            meals: 300,
            transportation: 75,
          },
          currency: 'CNY',
        },
        true,
        500,
      ),
    );
    events.push(this.createStepFinishedEvent('预算计算', { totalCost: 1250 }));

    // 11. 文本消息事件 - 完成行程规划
    events.push(this.createTextMessageChunkEvent('**第三天：天坛 + 胡同文化**\n'));
    events.push(this.createTextMessageChunkEvent('- 上午：天坛公园（天气小雨，室内为主）\n'));
    events.push(this.createTextMessageChunkEvent('- 下午：南锣鼓巷、后海（体验老北京胡同文化）\n'));
    events.push(this.createTextMessageChunkEvent('- 晚上：簋街美食街\n\n'));

    events.push(this.createTextMessageChunkEvent('**预算总结：**\n'));
    events.push(this.createTextMessageChunkEvent('- 景点门票：275元\n'));
    events.push(this.createTextMessageChunkEvent('- 住宿费用：600元（2晚经济型酒店）\n'));
    events.push(this.createTextMessageChunkEvent('- 餐饮费用：300元\n'));
    events.push(this.createTextMessageChunkEvent('- 交通费用：75元\n'));
    events.push(this.createTextMessageChunkEvent('- **总计：1250元**\n\n'));

    events.push(this.createTextMessageChunkEvent('**温馨提示：**\n'));
    events.push(this.createTextMessageChunkEvent('1. 建议提前在网上预订故宫门票\n'));
    events.push(this.createTextMessageChunkEvent('2. 长城建议选择八达岭或慕田峪\n'));
    events.push(this.createTextMessageChunkEvent('3. 第三天有小雨，建议携带雨具\n'));
    events.push(this.createTextMessageChunkEvent('4. 准备舒适的步行鞋，每天步行量较大\n\n'));

    // 12. 消息快照事件
    events.push(
      this.createMessagesSnapshotEvent([
        {
          id: this.messageId,
          role: 'user',
          content: '帮我规划一个3天的北京旅游行程，预算中等，喜欢历史文化',
          timestamp: Date.now() - 30000,
        },
        {
          id: uuidv4(),
          role: 'assistant',
          content: '完整的3天北京旅游行程规划...',
          timestamp: Date.now(),
          toolCalls: [this.toolCallId],
        },
      ]),
    );

    // 13. 完成文本消息
    events.push(this.createTextMessageEndEvent('完整的3天北京旅游行程规划...', 850));

    // 14. 完成步骤
    events.push(
      this.createStepFinishedEvent('景点优化', {
        totalSteps: 5,
        generatedItinerary: true,
        recommendations: 3,
      }),
    );

    // 15. 生命周期事件 - 完成运行
    events.push(
      this.createRunFinishedEvent(true, 'completed', {
        totalSteps: 5,
        generatedItinerary: true,
        recommendations: 3,
        totalCost: 1250,
        duration: 3,
      }),
    );

    return events;
  }

  // 创建RUN_STARTED事件
  createRunStartedEvent() {
    return {
      type: 'RUN_STARTED',
      threadId: this.threadId,
      runId: this.runId,
      timestamp: Date.now(),
    };
  }

  // 创建RUN_FINISHED事件
  createRunFinishedEvent(result) {
    return {
      type: 'RUN_FINISHED',
      threadId: this.threadId,
      runId: this.runId,
      result,
      timestamp: Date.now(),
    };
  }

  // 创建RUN_ERROR事件
  createRunErrorEvent(message, code) {
    return {
      type: 'RUN_ERROR',
      message,
      code,
      timestamp: Date.now(),
    };
  }

  // 创建STEP_STARTED事件
  createStepStartedEvent(stepName) {
    return {
      type: 'STEP_STARTED',
      stepName,
      timestamp: Date.now(),
    };
  }

  // 创建STEP_FINISHED事件
  createStepFinishedEvent(stepName) {
    return {
      type: 'STEP_FINISHED',
      stepName,
      timestamp: Date.now(),
    };
  }

  // 创建TEXT_MESSAGE_START事件
  createTextMessageStartEvent() {
    return {
      type: 'TEXT_MESSAGE_START',
      messageId: this.messageId,
      role: 'assistant',
      timestamp: Date.now(),
    };
  }

  // 创建TEXT_MESSAGE_CHUNK事件
  createTextMessageChunkEvent(delta) {
    return {
      type: 'TEXT_MESSAGE_CHUNK',
      messageId: this.messageId,
      role: 'assistant',
      delta,
      timestamp: Date.now(),
    };
  }

  // 创建TEXT_MESSAGE_END事件
  createTextMessageEndEvent() {
    return {
      type: 'TEXT_MESSAGE_END',
      messageId: this.messageId,
      timestamp: Date.now(),
    };
  }

  // 创建TOOL_CALL_START事件
  createToolCallStartEvent(toolCallName) {
    const toolCallId = uuidv4();
    return {
      type: 'TOOL_CALL_START',
      toolCallId,
      toolCallName,
      parentMessageId: this.messageId,
      timestamp: Date.now(),
    };
  }

  // 创建TOOL_CALL_CHUNK事件
  createToolCallChunkEvent(delta) {
    return {
      type: 'TOOL_CALL_CHUNK',
      toolCallId: this.toolCallId,
      toolCallName: 'get_attractions',
      parentMessageId: this.messageId,
      delta,
      timestamp: Date.now(),
    };
  }

  // 创建TOOL_CALL_END事件
  createToolCallEndEvent() {
    return {
      type: 'TOOL_CALL_END',
      toolCallId: this.toolCallId,
      timestamp: Date.now(),
    };
  }

  // 创建STATE_SNAPSHOT事件
  createStateSnapshotEvent(snapshot) {
    return {
      type: 'STATE_SNAPSHOT',
      snapshot,
      timestamp: Date.now(),
    };
  }

  // 创建STATE_DELTA事件
  createStateDeltaEvent(delta) {
    return {
      type: 'STATE_DELTA',
      delta,
      timestamp: Date.now(),
    };
  }

  // 创建MESSAGES_SNAPSHOT事件
  createMessagesSnapshotEvent(messages) {
    return {
      type: 'MESSAGES_SNAPSHOT',
      messages,
      timestamp: Date.now(),
    };
  }

  // 创建RAW事件
  createRawEvent(event, source) {
    return {
      type: 'RAW',
      event,
      source,
      timestamp: Date.now(),
    };
  }

  // 创建CUSTOM事件
  createCustomEvent(name, value) {
    return {
      type: 'CUSTOM',
      name,
      value,
      timestamp: Date.now(),
    };
  }

  // 生成错误场景的事件流
  generateErrorScenarioEvents() {
    const events = [];

    // 1. 开始运行
    events.push(this.createRunStartedEvent());

    // 2. 开始步骤
    events.push(this.createStepStartedEvent('景点查询', '查询北京景点信息'));

    // 3. 工具调用失败
    events.push(this.createToolCallStartEvent('get_attractions', '获取景点信息'));
    events.push(this.createToolCallChunkEvent({ city: '北京' }));
    events.push(this.createToolCallEndEvent(null, false, 5000));

    // 4. 运行错误
    events.push(
      this.createRunErrorEvent('无法获取景点信息，网络连接失败', 'NETWORK_ERROR', {
        endpoint: 'https://api.travel.com/attractions',
        statusCode: 503,
        retryCount: 3,
      }),
    );

    // 5. 完成运行
    events.push(
      this.createRunFinishedEvent(false, 'error', {
        error: '网络连接失败',
        failedStep: '景点查询',
      }),
    );

    return events;
  }

  // 生成网络中断场景的事件流
  generateNetworkInterruptionEvents() {
    const events = [];

    // 1. 开始运行
    events.push(this.createRunStartedEvent());

    // 2. 部分完成的工作
    events.push(this.createStepStartedEvent('需求分析', '分析用户需求'));
    events.push(this.createTextMessageStartEvent());
    events.push(this.createTextMessageChunkEvent('正在分析您的需求...'));
    events.push(this.createStepFinishedEvent('需求分析', { duration: 3 }));

    // 3. 网络中断（模拟）
    events.push(
      this.createRawEvent(
        {
          type: 'network_interruption',
          duration: 5000,
          reason: 'connection_lost',
        },
        'network_monitor',
      ),
    );

    // 4. 重新连接
    events.push(
      this.createRawEvent(
        {
          type: 'network_restored',
          duration: 5000,
          reason: 'connection_restored',
        },
        'network_monitor',
      ),
    );

    // 5. 继续工作
    events.push(this.createStepStartedEvent('景点查询', '查询景点信息'));
    events.push(this.createToolCallStartEvent('get_attractions', '获取景点信息'));
    events.push(this.createToolCallEndEvent({ attractions: [] }, true, 1000));
    events.push(this.createStepFinishedEvent('景点查询', { totalAttractions: 0 }));

    // 6. 完成运行
    events.push(
      this.createRunFinishedEvent(true, 'completed', {
        totalSteps: 2,
        networkInterruptions: 1,
      }),
    );

    return events;
  }

  // 生成用户交互场景的事件流
  generateUserInteractionEvents() {
    const events = [];

    // 1. 开始运行
    events.push(this.createRunStartedEvent());

    // 2. 请求用户输入
    events.push(
      this.createCustomEvent('input_request', {
        requestId: uuidv4(),
        prompt: '请选择您偏好的住宿类型：',
        options: ['经济型酒店', '商务酒店', '精品民宿', '青年旅社'],
        type: 'select',
      }),
    );

    // 3. 模拟用户响应
    events.push(
      this.createCustomEvent('user_input', {
        requestId: uuidv4(),
        input: '商务酒店',
        timestamp: Date.now(),
      }),
    );

    // 4. 继续处理
    events.push(this.createStepStartedEvent('住宿查询', '根据用户选择查询住宿'));
    events.push(this.createToolCallStartEvent('get_hotels', '查询商务酒店'));
    events.push(
      this.createToolCallEndEvent(
        {
          hotels: [
            { name: '北京希尔顿酒店', price: 800, rating: 4.5 },
            { name: '北京万豪酒店', price: 750, rating: 4.4 },
          ],
        },
        true,
        2000,
      ),
    );
    events.push(this.createStepFinishedEvent('住宿查询', { totalHotels: 2 }));

    // 5. 完成运行
    events.push(
      this.createRunFinishedEvent(true, 'completed', {
        totalSteps: 2,
        userInteractions: 1,
      }),
    );

    return events;
  }
}

// 导出便捷函数
export const generateTravelPlanningEvents = () => {
  const mockData = new TravelAgentMockData();
  return mockData.generateTravelPlanningEvents();
};

export const generateErrorScenarioEvents = () => {
  const mockData = new TravelAgentMockData();
  return mockData.generateErrorScenarioEvents();
};

export const generateNetworkInterruptionEvents = () => {
  const mockData = new TravelAgentMockData();
  return mockData.generateNetworkInterruptionEvents();
};

export const generateUserInteractionEvents = () => {
  const mockData = new TravelAgentMockData();
  return mockData.generateUserInteractionEvents();
};

export { TravelAgentMockData };
