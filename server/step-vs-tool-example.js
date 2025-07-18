// STEP vs TOOL_CALL 示例说明
// 展示AG-UI协议中步骤和工具调用的区别

const AGUI_EVENT_TYPES = {
  STEP_STARTED: 'STEP_STARTED',
  STEP_FINISHED: 'STEP_FINISHED',
  TOOL_CALL_START: 'TOOL_CALL_START',
  TOOL_CALL_END: 'TOOL_CALL_END',
  TEXT_MESSAGE_CHUNK: 'TEXT_MESSAGE_CHUNK',
  CUSTOM: 'CUSTOM',
};

// 示例：家庭聚会规划任务
const stepVsToolExample = [
  // ========================================
  // 步骤1：餐饮方案规划（业务层面）
  // ========================================
  {
    type: AGUI_EVENT_TYPES.STEP_STARTED,
    data: {
      stepId: 'step_meal_planning',
      stepName: '餐饮方案规划',
      description: '为用户规划适合的餐饮方案',
      estimatedDuration: 15000,
      progress: 0,
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  // 在步骤1内部：工具调用1 - 分析饮食偏好
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_START,
    data: {
      toolCallId: 'tool_001',
      toolName: 'dietary_analyzer',
      action: 'analyze_preferences',
      input: { partySize: 8, restrictions: ['gluten-free'] },
      stepId: 'step_meal_planning', // 关联到当前步骤
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_END,
    data: {
      toolCallId: 'tool_001',
      result: { recommendations: ['香草烤鸡', '蔬菜沙拉'] },
      stepId: 'step_meal_planning',
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  // 在步骤1内部：工具调用2 - 查询菜谱
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_START,
    data: {
      toolCallId: 'tool_002',
      toolName: 'recipe_finder',
      action: 'search_recipes',
      input: { ingredients: ['chicken', 'herbs'], timeLimit: 45 },
      stepId: 'step_meal_planning',
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_END,
    data: {
      toolCallId: 'tool_002',
      result: { recipes: ['香草烤鸡配方', '准备时间45分钟'] },
      stepId: 'step_meal_planning',
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  // 步骤1完成
  {
    type: AGUI_EVENT_TYPES.STEP_FINISHED,
    data: {
      stepId: 'step_meal_planning',
      result: '餐饮方案规划完成',
      duration: 15000,
      progress: 33,
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  // ========================================
  // 步骤2：设备调度（业务层面）
  // ========================================
  {
    type: AGUI_EVENT_TYPES.STEP_STARTED,
    data: {
      stepId: 'step_device_scheduling',
      stepName: '设备调度',
      description: '调度智能设备准备餐饮',
      estimatedDuration: 8000,
      progress: 33,
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  // 在步骤2内部：工具调用3 - 检查设备状态
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_START,
    data: {
      toolCallId: 'tool_003',
      toolName: 'device_manager',
      action: 'check_status',
      input: { devices: ['smart_oven', 'climate_control'] },
      stepId: 'step_device_scheduling',
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_END,
    data: {
      toolCallId: 'tool_003',
      result: { status: 'available', devices: ['smart_oven', 'climate_control'] },
      stepId: 'step_device_scheduling',
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  // 在步骤2内部：工具调用4 - 设置设备参数
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_START,
    data: {
      toolCallId: 'tool_004',
      toolName: 'device_scheduler',
      action: 'set_schedule',
      input: {
        smart_oven: { temp: 180, startTime: '09:15' },
        climate_control: { temp: 23, humidity: 55 },
      },
      stepId: 'step_device_scheduling',
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_END,
    data: {
      toolCallId: 'tool_004',
      result: { success: true, schedule: '设备调度完成' },
      stepId: 'step_device_scheduling',
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  // 步骤2完成
  {
    type: AGUI_EVENT_TYPES.STEP_FINISHED,
    data: {
      stepId: 'step_device_scheduling',
      result: '设备调度完成',
      duration: 8000,
      progress: 66,
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  // ========================================
  // 步骤3：安全监测（业务层面）
  // ========================================
  {
    type: AGUI_EVENT_TYPES.STEP_STARTED,
    data: {
      stepId: 'step_safety_monitoring',
      stepName: '安全监测',
      description: '进行安全检查和监测',
      estimatedDuration: 5000,
      progress: 66,
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  // 在步骤3内部：工具调用5 - 安全检查
  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_START,
    data: {
      toolCallId: 'tool_005',
      toolName: 'safety_inspector',
      action: 'inspect',
      input: { areas: ['kitchen', 'living_room'], checks: ['gas_leak', 'fire_hazards'] },
      stepId: 'step_safety_monitoring',
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  {
    type: AGUI_EVENT_TYPES.TOOL_CALL_END,
    data: {
      toolCallId: 'tool_005',
      result: { status: 'all_clear', findings: '安全检查通过' },
      stepId: 'step_safety_monitoring',
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },

  // 步骤3完成
  {
    type: AGUI_EVENT_TYPES.STEP_FINISHED,
    data: {
      stepId: 'step_safety_monitoring',
      result: '安全监测完成',
      duration: 5000,
      progress: 100,
    },
    timestamp: Date.now(),
    runId: 'run_123',
    agentId: 'family-planner',
  },
];

// 总结说明
const explanation = {
  // STEP（步骤）的特点
  step: {
    concept: '业务逻辑层面',
    purpose: '描述AI代理要完成的任务步骤',
    examples: ['餐饮方案规划', '设备调度', '安全监测'],
    characteristics: ['抽象程度高', '持续时间长', '用户可见', '包含多个工具调用'],
  },

  // TOOL_CALL（工具调用）的特点
  toolCall: {
    concept: '技术实现层面',
    purpose: '描述AI代理调用的具体工具或API',
    examples: [
      'dietary_analyzer - 分析饮食偏好',
      'recipe_finder - 查询菜谱',
      'device_manager - 管理设备',
      'safety_inspector - 安全检查',
    ],
    characteristics: ['抽象程度低', '持续时间短', '技术细节', '单个API调用'],
  },

  // 层次关系
  hierarchy: {
    description: 'STEP包含多个TOOL_CALL',
    structure: `
    任务 (Task)
    ├── 步骤1 (STEP): 餐饮方案规划
    │   ├── 工具调用1 (TOOL_CALL): 分析饮食偏好
    │   └── 工具调用2 (TOOL_CALL): 查询菜谱
    ├── 步骤2 (STEP): 设备调度
    │   ├── 工具调用3 (TOOL_CALL): 检查设备状态
    │   └── 工具调用4 (TOOL_CALL): 设置设备参数
    └── 步骤3 (STEP): 安全监测
        └── 工具调用5 (TOOL_CALL): 安全检查
    `,
  },
};

export { stepVsToolExample, explanation };
