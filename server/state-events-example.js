// AG-UI 状态事件示例
// 展示 STATE_SNAPSHOT, STATE_DELTA, MESSAGES_SNAPSHOT 的使用场景

const AGUI_EVENT_TYPES = {
  STATE_SNAPSHOT: 'STATE_SNAPSHOT',
  STATE_DELTA: 'STATE_DELTA',
  MESSAGES_SNAPSHOT: 'MESSAGES_SNAPSHOT',
  TEXT_MESSAGE_CHUNK: 'TEXT_MESSAGE_CHUNK',
  TOOL_CALL_START: 'TOOL_CALL_START',
  TOOL_CALL_END: 'TOOL_CALL_END',
  CUSTOM: 'CUSTOM',
};

// 场景1：多客户端状态同步
const multiClientStateExample = [
  // 用户A在手机上发送消息
  {
    type: AGUI_EVENT_TYPES.MESSAGES_SNAPSHOT,
    data: {
      messages: [
        {
          id: 'msg_001',
          role: 'user',
          content: '请帮我规划一次旅行',
          timestamp: Date.now(),
          clientId: 'mobile_001',
        },
      ],
      totalCount: 1,
      lastMessageId: 'msg_001',
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
  },

  // 用户A在电脑上也打开了聊天，需要同步状态
  {
    type: AGUI_EVENT_TYPES.MESSAGES_SNAPSHOT,
    data: {
      messages: [
        {
          id: 'msg_001',
          role: 'user',
          content: '请帮我规划一次旅行',
          timestamp: Date.now(),
          clientId: 'mobile_001',
        },
      ],
      totalCount: 1,
      lastMessageId: 'msg_001',
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
    targetClientId: 'desktop_001', // 指定同步到桌面客户端
  },
];

// 场景2：复杂AI代理状态管理
const complexAgentStateExample = [
  // AI代理开始处理，状态发生变化
  {
    type: AGUI_EVENT_TYPES.STATE_SNAPSHOT,
    data: {
      agentState: {
        currentPhase: 'analyzing',
        subTasks: [
          { id: 'task_1', name: '分析目的地', status: 'pending' },
          { id: 'task_2', name: '查询天气', status: 'pending' },
          { id: 'task_3', name: '推荐行程', status: 'pending' },
        ],
        progress: 0,
        estimatedTime: 30000,
        memory: {
          userPreferences: {},
          contextHistory: [],
          constraints: [],
        },
        tools: {
          available: ['weather_api', 'hotel_api', 'transport_api'],
          active: [],
        },
      },
      sessionId: 'session_travel_001',
      userId: 'user_123',
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
  },

  // 开始第一个子任务，状态增量更新
  {
    type: AGUI_EVENT_TYPES.STATE_DELTA,
    data: {
      updates: [
        {
          path: 'agentState.subTasks.0.status',
          value: 'running',
          timestamp: Date.now(),
        },
        {
          path: 'agentState.progress',
          value: 10,
          timestamp: Date.now(),
        },
        {
          path: 'agentState.tools.active',
          value: ['weather_api'],
          timestamp: Date.now(),
        },
      ],
      reason: '开始分析目的地',
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
  },

  // 工具调用开始，状态再次更新
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_START,
    data: {
      toolCallId: 'tool_weather_001',
      toolName: 'weather_api',
      action: 'get_forecast',
      input: { location: 'Tokyo', days: 7 },
      stepId: 'step_destination_analysis',
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
  },

  // 工具调用完成，状态更新
  {
    type: AGUI_EVENT_TYPES.STATE_DELTA,
    data: {
      updates: [
        {
          path: 'agentState.memory.contextHistory',
          value: [
            {
              type: 'weather_data',
              location: 'Tokyo',
              data: { temperature: '25°C', condition: 'sunny' },
              timestamp: Date.now(),
            },
          ],
          operation: 'append',
        },
        {
          path: 'agentState.subTasks.0.status',
          value: 'completed',
          timestamp: Date.now(),
        },
        {
          path: 'agentState.subTasks.1.status',
          value: 'running',
          timestamp: Date.now(),
        },
        {
          path: 'agentState.progress',
          value: 30,
          timestamp: Date.now(),
        },
      ],
      reason: '天气查询完成，开始查询酒店',
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
  },
];

// 场景3：消息状态管理（前端无法预测的状态）
const messageStateExample = [
  // 用户发送消息
  {
    type: AGUI_EVENT_TYPES.MESSAGES_SNAPSHOT,
    data: {
      messages: [
        {
          id: 'msg_001',
          role: 'user',
          content: '我想去日本旅行',
          timestamp: Date.now(),
          status: 'sent',
        },
      ],
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
  },

  // 后端开始处理，消息状态变为"processing"
  {
    type: AGUI_EVENT_TYPES.STATE_DELTA,
    data: {
      updates: [
        {
          path: 'messages.0.status',
          value: 'processing',
          timestamp: Date.now(),
        },
        {
          path: 'messages.0.processingInfo',
          value: {
            startedAt: Date.now(),
            estimatedTime: 15000,
            currentStep: 'analyzing_request',
          },
          timestamp: Date.now(),
        },
      ],
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
  },

  // AI开始生成回复，消息状态更新
  {
    type: AGUI_EVENT_TYPES.STATE_DELTA,
    data: {
      updates: [
        {
          path: 'messages.0.status',
          value: 'generating',
          timestamp: Date.now(),
        },
        {
          path: 'messages.0.processingInfo.currentStep',
          value: 'generating_response',
          timestamp: Date.now(),
        },
      ],
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
  },

  // 生成完成，消息状态变为"completed"
  {
    type: AGUI_EVENT_TYPES.STATE_DELTA,
    data: {
      updates: [
        {
          path: 'messages.0.status',
          value: 'completed',
          timestamp: Date.now(),
        },
        {
          path: 'messages.0.processingInfo.completedAt',
          value: Date.now(),
          timestamp: Date.now(),
        },
      ],
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
  },
];

// 场景4：错误恢复和状态重置
const errorRecoveryExample = [
  // 网络错误导致状态不一致
  {
    type: AGUI_EVENT_TYPES.STATE_SNAPSHOT,
    data: {
      agentState: {
        currentPhase: 'error_recovery',
        lastKnownState: {
          phase: 'analyzing',
          progress: 45,
        },
        errorInfo: {
          type: 'network_timeout',
          message: '网络连接超时，正在重试',
          retryCount: 1,
          maxRetries: 3,
        },
      },
      messages: [
        {
          id: 'msg_001',
          role: 'user',
          content: '我想去日本旅行',
          status: 'error',
          errorInfo: {
            type: 'processing_failed',
            retryable: true,
          },
        },
      ],
    },
    timestamp: Date.now(),
    runId: 'run_travel_001',
    agentId: 'travel-planner',
    reason: 'error_recovery',
  },
];

// 使用场景说明
const stateEventsExplanation = {
  // 为什么需要后端控制状态
  whyBackendControl: {
    // 1. 状态一致性
    consistency: {
      problem: '前端多个组件可能维护不同的状态副本',
      solution: '后端作为单一数据源，确保所有客户端状态一致',
      example: '用户同时在手机和电脑上聊天，需要实时同步',
    },

    // 2. 复杂状态管理
    complexState: {
      problem: 'AI代理的状态很复杂，前端难以完全管理',
      solution: '后端管理复杂状态，前端只负责展示',
      example: 'AI的思考过程、工具调用状态、内存管理等',
    },

    // 3. 多客户端同步
    multiClient: {
      problem: '多个客户端的状态需要实时同步',
      solution: '后端统一推送状态更新到所有客户端',
      example: 'Web端、移动端、桌面端同时在线',
    },

    // 4. 错误恢复
    errorRecovery: {
      problem: '网络错误或异常导致状态不一致',
      solution: '后端主动推送正确的状态快照',
      example: '网络断开重连后，需要恢复正确的状态',
    },
  },

  // 三种状态事件的区别
  eventTypes: {
    STATE_SNAPSHOT: {
      purpose: '完整状态快照',
      when: '初始连接、错误恢复、状态重置',
      data: '包含完整的状态信息',
      example: '用户重新连接时，推送完整的聊天状态',
    },

    STATE_DELTA: {
      purpose: '状态增量更新',
      when: '状态发生变化时',
      data: '只包含变化的部分',
      example: 'AI进度从30%更新到40%',
    },

    MESSAGES_SNAPSHOT: {
      purpose: '消息列表快照',
      when: '消息列表发生变化',
      data: '包含所有消息的完整列表',
      example: '新消息到达、消息状态变化',
    },
  },

  // 前端如何处理
  frontendHandling: {
    // 状态同步策略
    syncStrategy: {
      snapshot: '收到STATE_SNAPSHOT时，完全替换本地状态',
      delta: '收到STATE_DELTA时，应用增量更新到本地状态',
      messages: '收到MESSAGES_SNAPSHOT时，更新消息列表',
    },

    // 冲突处理
    conflictResolution: {
      strategy: '后端状态优先',
      reason: '后端是权威数据源',
      implementation: '收到后端状态更新时，覆盖本地状态',
    },

    // 性能优化
    performance: {
      snapshot: 'STATE_SNAPSHOT频率较低，用于初始化',
      delta: 'STATE_DELTA频率较高，用于实时更新',
      batching: '可以批量处理多个STATE_DELTA',
    },
  },
};

export {
  multiClientStateExample,
  complexAgentStateExample,
  messageStateExample,
  errorRecoveryExample,
  stateEventsExplanation,
};
