// AG-UI 标准协议事件 Mock 数据
// 基于 AG-UI 协议规范：https://docs.ag-ui.com

// AG-UI 标准事件类型
const AGUI_EVENT_TYPES = {
  // 生命周期事件
  RUN_STARTED: 'RUN_STARTED',
  RUN_FINISHED: 'RUN_FINISHED',
  RUN_ERROR: 'RUN_ERROR',
  STEP_STARTED: 'STEP_STARTED',
  STEP_FINISHED: 'STEP_FINISHED',

  // 文本消息事件
  TEXT_MESSAGE_START: 'TEXT_MESSAGE_START',
  TEXT_MESSAGE_CHUNK: 'TEXT_MESSAGE_CHUNK',
  TEXT_MESSAGE_END: 'TEXT_MESSAGE_END',

  // 工具调用事件
  TOOL_CALL_START: 'TOOL_CALL_START',
  TOOL_CALL_CHUNK: 'TOOL_CALL_CHUNK',
  TOOL_CALL_END: 'TOOL_CALL_END',

  // 状态管理事件
  STATE_SNAPSHOT: 'STATE_SNAPSHOT',
  STATE_DELTA: 'STATE_DELTA',
  MESSAGES_SNAPSHOT: 'MESSAGES_SNAPSHOT',

  // 扩展事件
  RAW: 'RAW',
  CUSTOM: 'CUSTOM',
};

// 生成唯一的 runId
const generateRunId = () => `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// 生成唯一的 messageId
const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// 生成唯一的 toolCallId
const generateToolCallId = () => `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// AG-UI 标准事件流数据
const aguiChunks = [
  // 1. 对话开始事件
  {
    type: AGUI_EVENT_TYPES.RUN_STARTED,
    data: {
      prompt: '请帮我规划一次家庭聚会',
      messageId: generateMessageId(),
      attachments: [],
      agentId: 'family-planner-agent',
      capabilities: ['meal_planning', 'device_scheduling', 'safety_monitoring'],
    },
    timestamp: Date.now(),
    runId: generateRunId(),
    agentId: 'family-planner-agent',
    threadId: 'thread_family_001',
  },

  // 2. 步骤开始事件 - 业务层面：餐饮规划步骤
  {
    type: AGUI_EVENT_TYPES.STEP_STARTED,
    data: {
      stepId: 'step_meal_planning',
      stepName: '餐饮方案规划',
      description: '开始分析用户饮食偏好并生成餐饮方案',
      estimatedDuration: 12000, // 预计12秒
      progress: 0,
    },
    timestamp: Date.now(),
    runId: null, // 继承上一个事件的 runId
    agentId: 'family-planner-agent',
  },

  // 3. 思考过程开始 - 在步骤内部
  {
    type: AGUI_EVENT_TYPES.CUSTOM,
    data: {
      type: 'thinking',
      title: '分析用户需求',
      content: '正在分析用户提供的家庭聚会信息...',
      step: 'meal_planning',
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 4. 工具调用开始 - 技术层面：调用饮食分析工具
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_START,
    data: {
      toolCallId: generateToolCallId(),
      toolName: 'dietary_preference_analyzer',
      action: 'analyze',
      input: {
        partySize: 8,
        dietaryRestrictions: ['gluten-free', 'vegetarian'],
        preferences: ['healthy', 'easy-to-prepare'],
      },
      stepId: 'step_meal_planning', // 关联到当前步骤
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 5. 工具调用结果
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_END,
    data: {
      toolCallId: null, // 继承上一个事件的 toolCallId
      result: {
        success: true,
        recommendations: ['香草烤鸡（无麸质）', '蔬菜沙拉', '智能调酒机方案B'],
        preparationTime: '45分钟',
        alcoholContent: '12%',
      },
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 6. 文本消息开始
  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_START,
    data: {
      messageId: generateMessageId(),
      contentType: 'text',
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 7. 文本消息块（流式）
  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '🍴 推荐餐饮方案：',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '主菜是香草烤鸡（无麸质），',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '准备耗时45分钟；',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '饮品是智能调酒机方案B，',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '酒精浓度12%。',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 8. 文本消息结束
  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_END,
    data: {
      messageId: null, // 继承上一个事件的 messageId
      finalContent: '🍴 推荐餐饮方案：主菜是香草烤鸡（无麸质），准备耗时45分钟；饮品是智能调酒机方案B，酒精浓度12%。',
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 9. 步骤完成
  {
    type: AGUI_EVENT_TYPES.STEP_FINISHED,
    data: {
      stepId: 'step_meal_planning',
      result: '餐饮方案规划完成',
      duration: 12000, // 12秒
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 9.5. 状态增量更新 - 步骤完成后的状态变化
  {
    type: AGUI_EVENT_TYPES.STATE_DELTA,
    data: {
      updates: [
        {
          path: 'agentState.progress',
          value: 33,
          timestamp: Date.now(),
        },
        {
          path: 'agentState.completedSteps',
          value: ['meal_planning'],
          operation: 'append',
        },
        {
          path: 'agentState.memory.contextHistory',
          value: [
            {
              type: 'meal_planning_result',
              data: {
                mainDish: '香草烤鸡（无麸质）',
                preparationTime: '45分钟',
                beverage: '智能调酒机方案B',
                alcoholContent: '12%',
              },
              timestamp: Date.now(),
            },
          ],
          operation: 'append',
        },
      ],
      reason: '餐饮规划步骤完成',
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 10. 下一个步骤开始
  {
    type: AGUI_EVENT_TYPES.STEP_STARTED,
    data: {
      stepId: 'step_device_scheduling',
      stepName: '设备调度',
      description: '开始调度智能设备',
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 11. 工具调用开始
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_START,
    data: {
      toolCallId: generateToolCallId(),
      toolName: 'smart_device_scheduler',
      action: 'schedule',
      input: {
        devices: ['smart_oven', 'climate_control'],
        timing: 'party_start_minus_45min',
      },
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 12. 工具调用结果
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_END,
    data: {
      toolCallId: null,
      result: {
        success: true,
        schedule: {
          smart_oven: {
            action: 'preheat',
            temperature: '180°C',
            startTime: '09:15',
            duration: '45分钟',
          },
          climate_control: {
            temperature: '23°C',
            humidity: '55%',
          },
        },
      },
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 13. 文本消息块
  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '📱 设备调度方案：',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '智能烤箱预热至180°C，',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '倒计时09:15启动；',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '环境调节至23°C，湿度55%。',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 14. 步骤完成
  {
    type: AGUI_EVENT_TYPES.STEP_FINISHED,
    data: {
      stepId: 'step_device_scheduling',
      result: '设备调度完成',
      duration: 8000, // 8秒
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 15. 安全监测步骤
  {
    type: AGUI_EVENT_TYPES.STEP_STARTED,
    data: {
      stepId: 'step_safety_monitoring',
      stepName: '安全监测',
      description: '开始安全巡检',
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 16. 工具调用
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_START,
    data: {
      toolCallId: generateToolCallId(),
      toolName: 'safety_inspector',
      action: 'inspect',
      input: {
        areas: ['kitchen', 'living_room', 'outdoor'],
        checks: ['gas_leak', 'electrical_safety', 'fire_hazards'],
      },
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 17. 工具调用结果
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_END,
    data: {
      toolCallId: null,
      result: {
        success: true,
        status: 'all_clear',
        findings: '未发现燃气泄漏风险，所有安全检查通过',
      },
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 18. 最终文本消息
  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '✅ 安全巡检完成：未发现燃气泄漏风险。',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '所有智能体已完成协作！',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 19. 步骤完成
  {
    type: AGUI_EVENT_TYPES.STEP_FINISHED,
    data: {
      stepId: 'step_safety_monitoring',
      result: '安全监测完成',
      duration: 5000, // 5秒
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 20. 状态快照 - 完整状态同步
  {
    type: AGUI_EVENT_TYPES.STATE_SNAPSHOT,
    data: {
      agentState: {
        currentStep: 'completed',
        completedSteps: ['meal_planning', 'device_scheduling', 'safety_monitoring'],
        totalSteps: 3,
        progress: 100,
        memory: {
          userPreferences: {
            partySize: 8,
            dietaryRestrictions: ['gluten-free', 'vegetarian'],
            preferences: ['healthy', 'easy-to-prepare'],
          },
          contextHistory: [
            {
              type: 'meal_planning_result',
              data: {
                mainDish: '香草烤鸡（无麸质）',
                preparationTime: '45分钟',
                beverage: '智能调酒机方案B',
                alcoholContent: '12%',
              },
            },
            {
              type: 'device_scheduling_result',
              data: {
                smartOven: { temperature: '180°C', startTime: '09:15' },
                climateControl: { temperature: '23°C', humidity: '55%' },
              },
            },
            {
              type: 'safety_check_result',
              data: { status: 'all_clear', findings: '未发现燃气泄漏风险' },
            },
          ],
        },
        tools: {
          available: ['dietary_preference_analyzer', 'smart_device_scheduler', 'safety_inspector'],
          active: [],
          usageHistory: [
            { tool: 'dietary_preference_analyzer', calls: 1, success: true },
            { tool: 'smart_device_scheduler', calls: 1, success: true },
            { tool: 'safety_inspector', calls: 1, success: true },
          ],
        },
      },
      messages: [
        {
          id: 'msg_1',
          role: 'user',
          content: '请帮我规划一次家庭聚会',
          timestamp: Date.now() - 30000,
          status: 'completed',
        },
        {
          id: 'msg_2',
          role: 'assistant',
          content:
            '🍴 推荐餐饮方案：主菜是香草烤鸡（无麸质），准备耗时45分钟；饮品是智能调酒机方案B，酒精浓度12%。\n\n📱 设备调度方案：智能烤箱预热至180°C，倒计时09:15启动；环境调节至23°C，湿度55%。\n\n✅ 安全巡检完成：未发现燃气泄漏风险。所有智能体已完成协作！',
          timestamp: Date.now(),
          status: 'completed',
          processingInfo: {
            startedAt: Date.now() - 25000,
            completedAt: Date.now(),
            totalDuration: 25000,
            steps: [
              { name: '餐饮规划', duration: 12000 },
              { name: '设备调度', duration: 8000 },
              { name: '安全监测', duration: 5000 },
            ],
          },
        },
      ],
      sessionId: 'session_family_001',
      userId: 'user_123',
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },

  // 21. 对话完成
  {
    type: AGUI_EVENT_TYPES.RUN_FINISHED,
    data: {
      success: true,
      reason: 'completed',
      result: {
        totalSteps: 3,
        totalDuration: 25000, // 25秒
        finalMessage: '家庭聚会规划完成！',
        summary: {
          mealPlan: '香草烤鸡（无麸质）+ 智能调酒机方案B',
          deviceSchedule: '智能烤箱预热 + 环境调节',
          safetyStatus: '安全检查通过',
        },
      },
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'family-planner-agent',
  },
];

// 简化的AG-UI事件流（用于快速测试）
const simpleAguiChunks = [
  // 对话开始
  {
    type: AGUI_EVENT_TYPES.RUN_STARTED,
    data: {
      prompt: '你好，请介绍一下AG-UI协议',
      messageId: generateMessageId(),
      attachments: [],
    },
    timestamp: Date.now(),
    runId: generateRunId(),
    agentId: 'agui-demo-agent',
  },

  // 思考过程
  {
    type: AGUI_EVENT_TYPES.CUSTOM,
    data: {
      type: 'thinking',
      title: '思考中',
      content: '正在分析用户关于AG-UI协议的问题...',
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'agui-demo-agent',
  },

  // 文本消息开始
  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_START,
    data: {
      messageId: generateMessageId(),
      contentType: 'text',
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'agui-demo-agent',
  },

  // 流式文本块
  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: 'AG-UI（Agent User Interaction Protocol）是一个',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'agui-demo-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '用于前端应用与AI代理通信的标准化协议。',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'agui-demo-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '它提供了16种标准事件类型，',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'agui-demo-agent',
  },

  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_CHUNK,
    data: {
      content: '支持实时流式交互和双向通信。',
      contentType: 'text',
      delta: true,
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'agui-demo-agent',
  },

  // 文本消息结束
  {
    type: AGUI_EVENT_TYPES.TEXT_MESSAGE_END,
    data: {
      messageId: null,
      finalContent:
        'AG-UI（Agent User Interaction Protocol）是一个用于前端应用与AI代理通信的标准化协议。它提供了16种标准事件类型，支持实时流式交互和双向通信。',
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'agui-demo-agent',
  },

  // 对话完成
  {
    type: AGUI_EVENT_TYPES.RUN_FINISHED,
    data: {
      success: true,
      reason: 'completed',
      result: {
        totalTokens: 45,
        duration: 3000,
      },
    },
    timestamp: Date.now(),
    runId: null,
    agentId: 'agui-demo-agent',
  },
];

export { aguiChunks, simpleAguiChunks, AGUI_EVENT_TYPES };
