/**
 * 旅游行程规划Agent Mock数据 - 标准AG-UI协议版本
 * 完全符合AG-UI标准类型定义
 */

import { v4 as uuidv4 } from 'uuid';

class TravelAgentMockDataStandard {
  constructor() {
    this.runId = uuidv4();
    this.threadId = uuidv4();
    this.messageId = uuidv4();
    this.toolCallId = uuidv4();
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
    events.push(this.createStepStartedEvent('路线规划'));
    events.push(this.createTextMessageChunkEvent('**第一天：故宫 + 天安门广场**\n'));
    events.push(this.createTextMessageChunkEvent('- 上午：游览故宫博物院（建议8:30开始，避开人流高峰）\n'));
    events.push(this.createTextMessageChunkEvent('- 下午：天安门广场、国家博物馆\n'));
    events.push(this.createTextMessageChunkEvent('- 晚上：王府井步行街、品尝北京烤鸭\n\n'));

    // 6. 工具调用事件 - 查询天气
    events.push(this.createToolCallStartEvent('get_weather'));
    events.push(
      this.createToolCallChunkEvent(
        JSON.stringify({
          city: '北京',
          days: 3,
        }),
      ),
    );
    events.push(this.createToolCallEndEvent());
    events.push(this.createStepFinishedEvent('路线规划'));

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
    events.push(this.createStepStartedEvent('景点优化'));
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
    events.push(this.createStepStartedEvent('预算计算'));
    events.push(this.createToolCallStartEvent('calculate_budget'));
    events.push(
      this.createToolCallChunkEvent(
        JSON.stringify({
          attractions: ['故宫', '长城', '颐和园', '天坛'],
          accommodation: '经济型酒店',
          meals: '中等标准',
          transportation: '地铁+公交',
        }),
      ),
    );
    events.push(this.createToolCallEndEvent());
    events.push(this.createStepFinishedEvent('预算计算'));

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
          content: '帮我规划一个3天的北京旅游行程',
        },
        {
          id: uuidv4(),
          role: 'assistant',
          content: '完整的3天北京旅游行程规划...',
          toolCalls: [
            {
              id: this.toolCallId,
              type: 'function',
              function: {
                name: 'get_attractions',
                arguments: JSON.stringify({ city: '北京' }),
              },
            },
          ],
        },
      ]),
    );

    // 13. 完成文本消息
    events.push(this.createTextMessageEndEvent());

    // 14. 完成步骤
    events.push(this.createStepFinishedEvent('景点优化'));

    // 15. 生命周期事件 - 完成运行
    events.push(
      this.createRunFinishedEvent({
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
    events.push(this.createStepStartedEvent('景点查询'));

    // 3. 工具调用失败
    events.push(this.createToolCallStartEvent('get_attractions'));
    events.push(this.createToolCallChunkEvent(JSON.stringify({ city: '北京' })));
    events.push(this.createToolCallEndEvent());

    // 4. 运行错误
    events.push(this.createRunErrorEvent('无法获取景点信息，网络连接失败', 'NETWORK_ERROR'));

    // 5. 完成运行
    events.push(
      this.createRunFinishedEvent({
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
    events.push(this.createStepStartedEvent('需求分析'));
    events.push(this.createTextMessageStartEvent());
    events.push(this.createTextMessageChunkEvent('正在分析您的需求...'));
    events.push(this.createStepFinishedEvent('需求分析'));

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
    events.push(this.createStepStartedEvent('景点查询'));
    events.push(this.createToolCallStartEvent('get_attractions'));
    events.push(this.createToolCallEndEvent());
    events.push(this.createStepFinishedEvent('景点查询'));

    // 6. 完成运行
    events.push(
      this.createRunFinishedEvent({
        totalSteps: 2,
        networkInterruptions: 1,
      }),
    );

    return events;
  }

  // 生成用户交互场景的事件流 - 第一阶段（等待用户输入）
  generateUserInteractionEvents() {
    const events = [];

    // 1. 开始运行
    events.push(this.createRunStartedEvent());

    // 2. 需求分析步骤
    events.push(this.createStepStartedEvent('需求分析'));
    events.push(this.createTextMessageStartEvent());
    events.push(this.createTextMessageChunkEvent('我正在分析您的旅游需求...\n\n'));
    events.push(this.createTextMessageChunkEvent('根据您的预算和时间，我为您推荐以下住宿类型：\n\n'));
    events.push(this.createStepFinishedEvent('需求分析'));

    // 3. 状态快照 - 记录当前进度
    events.push(
      this.createStateSnapshotEvent({
        currentStep: '等待用户选择',
        completedSteps: ['需求分析'],
        pendingUserInput: true,
        userPreferences: {
          duration: 3,
          budget: '中等',
          interests: ['历史文化', '美食'],
        },
      }),
    );

    // 4. 请求用户输入 - 流在这里暂停
    events.push(
      this.createCustomEvent('input_request', {
        requestId: this.runId, // 使用runId作为请求ID
        prompt: '请选择您偏好的住宿类型：',
        options: ['经济型酒店', '商务酒店', '精品民宿', '青年旅社'],
        type: 'select',
        required: true,
        timeout: 300000, // 5分钟超时
      }),
    );

    // 5. 流暂停信号
    events.push(
      this.createCustomEvent('stream_pause', {
        reason: 'waiting_for_user_input',
        requestId: this.runId,
        resumeEndpoint: '/sse/travel-agent/continue',
      }),
    );

    return events;
  }

  // 生成用户交互场景的事件流 - 第二阶段（用户输入后继续）
  generateUserInteractionContinueEvents(userInput) {
    const events = [];

    // 1. 继续运行信号
    events.push(
      this.createCustomEvent('stream_resume', {
        reason: 'user_input_received',
        requestId: this.runId,
        userInput,
      }),
    );

    // 2. 处理用户输入
    events.push(this.createStepStartedEvent('住宿查询'));
    events.push(this.createTextMessageChunkEvent(`您选择了：${userInput}\n\n`));
    events.push(this.createTextMessageChunkEvent('正在为您查询相关住宿信息...\n\n'));

    // 3. 工具调用 - 根据用户选择查询住宿
    events.push(this.createToolCallStartEvent('get_hotels'));
    events.push(
      this.createToolCallChunkEvent(
        JSON.stringify({
          city: '北京',
          type: userInput,
          budget: 'medium',
          checkIn: '2024-01-15',
          checkOut: '2024-01-17',
        }),
      ),
    );
    events.push(this.createToolCallEndEvent());
    events.push(this.createStepFinishedEvent('住宿查询'));

    // 4. 状态更新
    events.push(
      this.createStateDeltaEvent([
        {
          op: 'replace',
          path: '/currentStep',
          value: '路线规划',
        },
        {
          op: 'add',
          path: '/userPreferences/accommodation',
          value: userInput,
        },
        {
          op: 'replace',
          path: '/pendingUserInput',
          value: false,
        },
      ]),
    );

    // 5. 继续规划流程
    events.push(this.createStepStartedEvent('路线规划'));
    events.push(this.createTextMessageChunkEvent('**基于您的住宿选择，为您规划行程：**\n\n'));

    if (userInput === '商务酒店') {
      events.push(this.createTextMessageChunkEvent('**商务酒店推荐：**\n'));
      events.push(this.createTextMessageChunkEvent('- 北京国贸饭店（靠近CBD，交通便利）\n'));
      events.push(this.createTextMessageChunkEvent('- 北京希尔顿酒店（服务优质，设施完善）\n\n'));
    } else if (userInput === '经济型酒店') {
      events.push(this.createTextMessageChunkEvent('**经济型酒店推荐：**\n'));
      events.push(this.createTextMessageChunkEvent('- 如家酒店（王府井店，位置优越）\n'));
      events.push(this.createTextMessageChunkEvent('- 7天连锁酒店（天安门店，性价比高）\n\n'));
    }

    events.push(this.createTextMessageChunkEvent('**第一天行程：**\n'));
    events.push(this.createTextMessageChunkEvent('- 上午：故宫博物院\n'));
    events.push(this.createTextMessageChunkEvent('- 下午：天安门广场\n'));
    events.push(this.createTextMessageChunkEvent('- 晚上：王府井步行街\n\n'));

    events.push(this.createStepFinishedEvent('路线规划'));

    // 6. 完成消息
    events.push(this.createTextMessageEndEvent());

    // 7. 完成运行
    events.push(
      this.createRunFinishedEvent({
        totalSteps: 3,
        userInteractions: 1,
        selectedAccommodation: userInput,
        generatedItinerary: true,
      }),
    );

    return events;
  }
}

// 导出便捷函数
export const generateTravelPlanningEvents = () => {
  const mockData = new TravelAgentMockDataStandard();
  return mockData.generateTravelPlanningEvents();
};

export const generateErrorScenarioEvents = () => {
  const mockData = new TravelAgentMockDataStandard();
  return mockData.generateErrorScenarioEvents();
};

export const generateNetworkInterruptionEvents = () => {
  const mockData = new TravelAgentMockDataStandard();
  return mockData.generateNetworkInterruptionEvents();
};

export const generateUserInteractionEvents = () => {
  const mockData = new TravelAgentMockDataStandard();
  return mockData.generateUserInteractionEvents();
};

export { TravelAgentMockDataStandard };
