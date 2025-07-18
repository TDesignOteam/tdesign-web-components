# AG-UI 协议事件详细指南

## 概述

AG-UI（Agent User Interaction Protocol）是一个标准化的AI代理通信协议，定义了16种核心事件类型，用于前端应用与AI代理之间的实时通信。本文档将详细介绍每个事件的含义、用法，并结合旅游行程规划agent的具体实例进行说明。

## 事件分类

AG-UI协议事件分为5个主要类别：

1. **生命周期事件** - 监控代理运行状态
2. **文本消息事件** - 处理流式文本内容
3. **工具调用事件** - 管理工具执行过程
4. **状态管理事件** - 同步状态信息
5. **扩展事件** - 支持自定义功能

---

## 1. 生命周期事件 (Lifecycle Events)

### 1.1 RUN_STARTED
**含义**: 代理运行开始，表示一个新的对话会话启动

**数据结构**:
```typescript
{
  type: 'RUN_STARTED',
  threadId: string,          // 对话线程ID
  runId: string,             // 运行ID
  timestamp?: number         // 时间戳
}
```

**旅游行程规划实例**:
```javascript
// 用户请求："帮我规划一个3天的北京旅游行程"
{
  type: 'RUN_STARTED',
  threadId: "thread_beijing_trip",
  runId: "run_001",
  timestamp: 1703123456789
}
```

**前端处理**:
```typescript
case 'RUN_STARTED':
  console.log('🚀 开始规划旅游行程');
  showLoadingIndicator();
  disableInputField();
  break;
```

### 1.2 RUN_FINISHED
**含义**: 代理运行完成，表示当前对话会话结束

**数据结构**:
```typescript
{
  type: 'RUN_FINISHED',
  threadId: string,          // 对话线程ID
  runId: string,             // 运行ID
  result?: any,              // 运行结果
  timestamp?: number         // 时间戳
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'RUN_FINISHED',
  data: {
    success: true,
    reason: 'completed',
    result: {
      totalSteps: 5,
      generatedItinerary: true,
      recommendations: 3
    },
    duration: 15000
  },
  timestamp: 1703123471789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'RUN_FINISHED':
  console.log('✅ 行程规划完成');
  hideLoadingIndicator();
  enableInputField();
  showCompletionMessage();
  break;
```

### 1.3 RUN_ERROR
**含义**: 代理运行出错，表示执行过程中发生错误

**数据结构**:
```typescript
{
  type: 'RUN_ERROR',
  data: {
    error: string,           // 错误信息
    code?: string,          // 错误代码
    details?: any           // 详细错误信息
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'RUN_ERROR',
  data: {
    error: "无法获取景点信息，网络连接失败",
    code: "NETWORK_ERROR",
    details: {
      endpoint: "https://api.travel.com/attractions",
      statusCode: 503
    }
  },
  timestamp: 1703123465789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'RUN_ERROR':
  console.error('❌ 行程规划出错:', event.data.error);
  hideLoadingIndicator();
  enableInputField();
  showErrorMessage(event.data.error);
  break;
```

### 1.4 STEP_STARTED
**含义**: 开始执行一个业务步骤，表示代理开始处理特定的任务

**数据结构**:
```typescript
{
  type: 'STEP_STARTED',
  data: {
    stepId: string,          // 步骤ID
    stepName: string,        // 步骤名称
    description?: string,    // 步骤描述
    parentStepId?: string    // 父步骤ID
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'STEP_STARTED',
  data: {
    stepId: "step_001",
    stepName: "分析用户需求",
    description: "分析用户的时间、预算、兴趣偏好等需求",
    parentStepId: null
  },
  timestamp: 1703123457789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'STEP_STARTED':
  console.log('📋 开始步骤:', event.data.stepName);
  updateProgressBar(event.data.stepName);
  showStepIndicator(event.data.stepId);
  break;
```

### 1.5 STEP_FINISHED
**含义**: 完成一个业务步骤，表示代理完成了特定的任务

**数据结构**:
```typescript
{
  type: 'STEP_FINISHED',
  data: {
    stepId: string,          // 步骤ID
    stepName: string,        // 步骤名称
    result?: any,            // 步骤结果
    duration?: number        // 步骤执行时长
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'STEP_FINISHED',
  data: {
    stepId: "step_001",
    stepName: "分析用户需求",
    result: {
      duration: 3,
      budget: "中等",
      interests: ["历史文化", "美食"],
      preferences: ["故宫", "长城", "烤鸭"]
    },
    duration: 2000
  },
  timestamp: 1703123459789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'STEP_FINISHED':
  console.log('✅ 步骤完成:', event.data.stepName);
  updateStepStatus(event.data.stepId, 'completed');
  showStepResult(event.data.result);
  break;
```

---

## 2. 文本消息事件 (Text Message Events)

### 2.1 TEXT_MESSAGE_START
**含义**: 开始发送文本消息，表示代理开始生成回复内容

**数据结构**:
```typescript
{
  type: 'TEXT_MESSAGE_START',
  data: {
    messageId: string,       // 消息ID
    contentType?: string     // 内容类型 (text/markdown)
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'TEXT_MESSAGE_START',
  data: {
    messageId: "msg_002",
    contentType: "markdown"
  },
  timestamp: 1703123460789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'TEXT_MESSAGE_START':
  console.log('📝 开始生成回复');
  createNewMessage(event.data.messageId);
  setMessageType(event.data.contentType || 'text');
  break;
```

### 2.2 TEXT_MESSAGE_CHUNK
**含义**: 文本消息内容块，用于流式传输文本内容

**数据结构**:
```typescript
{
  type: 'TEXT_MESSAGE_CHUNK',
  data: {
    content: string,         // 文本内容
    messageId: string,       // 消息ID
    contentType?: string,    // 内容类型
    isPartial?: boolean      // 是否为部分内容
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
// 第一个块
{
  type: 'TEXT_MESSAGE_CHUNK',
  data: {
    content: "根据您的需求，我为您规划了一个3天的北京旅游行程：\n\n",
    messageId: "msg_002",
    contentType: "markdown",
    isPartial: true
  },
  timestamp: 1703123461789,
  runId: "run_001"
}

// 第二个块
{
  type: 'TEXT_MESSAGE_CHUNK',
  data: {
    content: "**第一天：故宫 + 天安门广场**\n- 上午：游览故宫博物院\n- 下午：天安门广场、国家博物馆\n- 晚上：王府井步行街、品尝北京烤鸭",
    messageId: "msg_002",
    contentType: "markdown",
    isPartial: true
  },
  timestamp: 1703123462789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'TEXT_MESSAGE_CHUNK':
  console.log('📝 接收文本块:', event.data.content);
  appendToMessage(event.data.messageId, event.data.content);
  updateMessageDisplay(event.data.messageId);
  break;
```

### 2.3 TEXT_MESSAGE_END
**含义**: 文本消息结束，表示代理完成了当前回复的生成

**数据结构**:
```typescript
{
  type: 'TEXT_MESSAGE_END',
  data: {
    messageId: string,       // 消息ID
    finalContent?: string,   // 最终完整内容
    totalTokens?: number     // 总token数
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'TEXT_MESSAGE_END',
  data: {
    messageId: "msg_002",
    finalContent: "完整的3天北京旅游行程规划...",
    totalTokens: 450
  },
  timestamp: 1703123465789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'TEXT_MESSAGE_END':
  console.log('✅ 文本消息完成');
  finalizeMessage(event.data.messageId);
  enableMessageActions(event.data.messageId);
  break;
```

---

## 3. 工具调用事件 (Tool Call Events)

### 3.1 TOOL_CALL_START
**含义**: 开始工具调用，表示代理开始使用外部工具或API

**数据结构**:
```typescript
{
  type: 'TOOL_CALL_START',
  data: {
    toolCallId: string,      // 工具调用ID
    toolName: string,        // 工具名称
    parentMessageId?: string, // 父消息ID
    description?: string     // 工具调用描述
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'TOOL_CALL_START',
  data: {
    toolCallId: "tool_001",
    toolName: "get_attractions",
    parentMessageId: "msg_002",
    description: "获取北京热门景点信息"
  },
  timestamp: 1703123466789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'TOOL_CALL_START':
  console.log('🔧 开始工具调用:', event.data.toolName);
  showToolCallIndicator(event.data.toolCallId);
  displayToolCallInfo(event.data.description);
  break;
```

### 3.2 TOOL_CALL_CHUNK
**含义**: 工具调用参数块，用于流式传输工具调用参数

**数据结构**:
```typescript
{
  type: 'TOOL_CALL_CHUNK',
  data: {
    toolCallId: string,      // 工具调用ID
    toolName: string,        // 工具名称
    action: string,          // 工具动作
    input: any,              // 工具输入参数
    isPartial?: boolean      // 是否为部分参数
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'TOOL_CALL_CHUNK',
  data: {
    toolCallId: "tool_001",
    toolName: "get_attractions",
    action: "search",
    input: {
      city: "北京",
      category: "historical",
      limit: 10,
      budget: "medium"
    },
    isPartial: false
  },
  timestamp: 1703123467789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'TOOL_CALL_CHUNK':
  console.log('🔧 工具调用参数:', event.data.input);
  updateToolCallParams(event.data.toolCallId, event.data.input);
  showToolCallDetails(event.data.toolCallId);
  break;
```

### 3.3 TOOL_CALL_END
**含义**: 工具调用结束，表示工具执行完成

**数据结构**:
```typescript
{
  type: 'TOOL_CALL_END',
  data: {
    toolCallId: string,      // 工具调用ID
    toolName: string,        // 工具名称
    result?: any,            // 工具执行结果
    success: boolean,        // 是否成功
    duration?: number        // 执行时长
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'TOOL_CALL_END',
  data: {
    toolCallId: "tool_001",
    toolName: "get_attractions",
    result: {
      attractions: [
        { name: "故宫", rating: 4.8, price: 60 },
        { name: "长城", rating: 4.9, price: 120 },
        { name: "天坛", rating: 4.7, price: 35 }
      ]
    },
    success: true,
    duration: 1500
  },
  timestamp: 1703123469289,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'TOOL_CALL_END':
  console.log('✅ 工具调用完成:', event.data.toolName);
  hideToolCallIndicator(event.data.toolCallId);
  displayToolCallResult(event.data.toolCallId, event.data.result);
  if (!event.data.success) {
    showToolCallError(event.data.toolCallId);
  }
  break;
```

---

## 4. 状态管理事件 (State Management Events)

### 4.1 STATE_SNAPSHOT
**含义**: 状态快照，提供完整的当前状态信息

**数据结构**:
```typescript
{
  type: 'STATE_SNAPSHOT',
  data: {
    state: any,              // 完整状态对象
    version?: number,        // 状态版本
    timestamp?: number       // 状态时间戳
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'STATE_SNAPSHOT',
  data: {
    state: {
      userPreferences: {
        duration: 3,
        budget: "medium",
        interests: ["历史文化", "美食"],
        travelStyle: "relaxed"
      },
      currentItinerary: {
        day1: ["故宫", "天安门广场", "王府井"],
        day2: ["长城", "颐和园"],
        day3: ["天坛", "南锣鼓巷", "后海"]
      },
      completedSteps: ["需求分析", "景点查询", "路线规划"],
      currentStep: "优化建议"
    },
    version: 3,
    timestamp: 1703123470789
  },
  timestamp: 1703123470789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'STATE_SNAPSHOT':
  console.log('📊 接收状态快照');
  updateApplicationState(event.data.state);
  syncUIWithState(event.data.state);
  break;
```

### 4.2 STATE_DELTA
**含义**: 状态增量更新，提供状态变化的部分信息

**数据结构**:
```typescript
{
  type: 'STATE_DELTA',
  data: {
    delta: any[],            // JSON Patch格式的增量更新
    version?: number,        // 状态版本
    timestamp?: number       // 更新时间戳
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'STATE_DELTA',
  data: {
    delta: [
      {
        op: "add",
        path: "/currentItinerary/day2/1",
        value: "圆明园"
      },
      {
        op: "replace",
        path: "/currentStep",
        value: "景点优化"
      }
    ],
    version: 4,
    timestamp: 1703123471789
  },
  timestamp: 1703123471789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'STATE_DELTA':
  console.log('📊 接收状态增量更新');
  applyStateDelta(event.data.delta);
  updateUIWithDelta(event.data.delta);
  break;
```

### 4.3 MESSAGES_SNAPSHOT
**含义**: 消息快照，提供完整的对话历史

**数据结构**:
```typescript
{
  type: 'MESSAGES_SNAPSHOT',
  data: {
    messages: any[],         // 消息数组
    version?: number,        // 消息版本
    timestamp?: number       // 快照时间戳
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'MESSAGES_SNAPSHOT',
  data: {
    messages: [
      {
        id: "msg_001",
        role: "user",
        content: "帮我规划一个3天的北京旅游行程",
        timestamp: 1703123456789
      },
      {
        id: "msg_002",
        role: "assistant",
        content: "根据您的需求，我为您规划了一个3天的北京旅游行程...",
        timestamp: 1703123465789,
        toolCalls: ["tool_001", "tool_002"]
      }
    ],
    version: 2,
    timestamp: 1703123472789
  },
  timestamp: 1703123472789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'MESSAGES_SNAPSHOT':
  console.log('💬 接收消息快照');
  replaceMessageHistory(event.data.messages);
  updateMessageDisplay();
  break;
```

---

## 5. 扩展事件 (Extension Events)

### 5.1 RAW
**含义**: 原始事件，用于传递未标准化的数据

**数据结构**:
```typescript
{
  type: 'RAW',
  data: {
    rawEvent: any,           // 原始事件数据
    source?: string          // 事件来源
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'RAW',
  data: {
    rawEvent: {
      type: "weather_update",
      city: "北京",
      forecast: {
        day1: "晴天",
        day2: "多云",
        day3: "小雨"
      }
    },
    source: "weather_service"
  },
  timestamp: 1703123473789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'RAW':
  console.log('📡 接收原始事件:', event.data.rawEvent);
  handleRawEvent(event.data.rawEvent, event.data.source);
  break;
```

### 5.2 CUSTOM
**含义**: 自定义事件，用于传递业务特定的数据

**数据结构**:
```typescript
{
  type: 'CUSTOM',
  data: {
    name: string,            // 自定义事件名称
    value: any,              // 事件值
    metadata?: any           // 元数据
  },
  timestamp: number,
  runId: string
}
```

**旅游行程规划实例**:
```javascript
{
  type: 'CUSTOM',
  data: {
    name: "itinerary_optimization",
    value: {
      originalRoute: ["故宫", "天安门", "王府井"],
      optimizedRoute: ["天安门", "故宫", "王府井"],
      reason: "减少步行距离，提高游览效率",
      timeSaved: "30分钟"
    },
    metadata: {
      optimizationType: "route_optimization",
      algorithm: "nearest_neighbor"
    }
  },
  timestamp: 1703123474789,
  runId: "run_001"
}
```

**前端处理**:
```typescript
case 'CUSTOM':
  console.log('🎯 接收自定义事件:', event.data.name);
  handleCustomEvent(event.data.name, event.data.value);
  break;
```

---

## 完整旅游行程规划Agent示例

### 事件流示例

```javascript
// 1. 用户发起请求
{
  type: 'RUN_STARTED',
  data: {
    prompt: "帮我规划一个3天的北京旅游行程，预算中等，喜欢历史文化",
    messageId: "msg_001"
  }
}

// 2. 开始需求分析步骤
{
  type: 'STEP_STARTED',
  data: {
    stepId: "step_001",
    stepName: "分析用户需求"
  }
}

// 3. 开始生成回复
{
  type: 'TEXT_MESSAGE_START',
  data: {
    messageId: "msg_002",
    contentType: "markdown"
  }
}

// 4. 流式输出回复内容
{
  type: 'TEXT_MESSAGE_CHUNK',
  data: {
    content: "根据您的需求，我为您规划了一个3天的北京旅游行程：\n\n",
    messageId: "msg_002"
  }
}

// 5. 调用景点查询工具
{
  type: 'TOOL_CALL_START',
  data: {
    toolCallId: "tool_001",
    toolName: "get_attractions",
    description: "查询北京历史文化景点"
  }
}

{
  type: 'TOOL_CALL_CHUNK',
  data: {
    toolCallId: "tool_001",
    toolName: "get_attractions",
    action: "search",
    input: { city: "北京", category: "historical" }
  }
}

{
  type: 'TOOL_CALL_END',
  data: {
    toolCallId: "tool_001",
    toolName: "get_attractions",
    result: { attractions: [...] },
    success: true
  }
}

// 6. 继续输出行程内容
{
  type: 'TEXT_MESSAGE_CHUNK',
  data: {
    content: "**第一天：故宫 + 天安门广场**\n- 上午：游览故宫博物院\n- 下午：天安门广场、国家博物馆",
    messageId: "msg_002"
  }
}

// 7. 发送状态快照
{
  type: 'STATE_SNAPSHOT',
  data: {
    state: {
      userPreferences: { duration: 3, budget: "medium" },
      currentItinerary: { day1: ["故宫", "天安门"] },
      completedSteps: ["需求分析", "景点查询"]
    }
  }
}

// 8. 完成步骤
{
  type: 'STEP_FINISHED',
  data: {
    stepId: "step_001",
    stepName: "分析用户需求",
    result: { duration: 3, budget: "medium" }
  }
}

// 9. 完成文本消息
{
  type: 'TEXT_MESSAGE_END',
  data: {
    messageId: "msg_002",
    finalContent: "完整的3天北京旅游行程规划...",
    totalTokens: 450
  }
}

// 10. 完成整个运行
{
  type: 'RUN_FINISHED',
  data: {
    success: true,
    reason: 'completed',
    result: { totalSteps: 5, generatedItinerary: true }
  }
}
```

### 前端事件处理示例

```typescript
class TravelPlannerUI {
  private eventHandlers = {
    'RUN_STARTED': (event) => {
      console.log('🚀 开始规划旅游行程');
      this.showLoadingIndicator();
      this.disableInputField();
      this.updateProgressBar(0);
    },

    'STEP_STARTED': (event) => {
      console.log('📋 开始步骤:', event.data.stepName);
      this.updateProgressBar(event.data.stepName);
      this.showStepIndicator(event.data.stepId);
    },

    'TEXT_MESSAGE_CHUNK': (event) => {
      console.log('📝 接收文本块:', event.data.content);
      this.appendToMessage(event.data.messageId, event.data.content);
      this.updateMessageDisplay(event.data.messageId);
    },

    'TOOL_CALL_START': (event) => {
      console.log('🔧 开始工具调用:', event.data.toolName);
      this.showToolCallIndicator(event.data.toolCallId);
      this.displayToolCallInfo(event.data.description);
    },

    'TOOL_CALL_END': (event) => {
      console.log('✅ 工具调用完成:', event.data.toolName);
      this.hideToolCallIndicator(event.data.toolCallId);
      this.displayToolCallResult(event.data.toolCallId, event.data.result);
    },

    'STATE_SNAPSHOT': (event) => {
      console.log('📊 接收状态快照');
      this.updateApplicationState(event.data.state);
      this.syncUIWithState(event.data.state);
    },

    'RUN_FINISHED': (event) => {
      console.log('✅ 行程规划完成');
      this.hideLoadingIndicator();
      this.enableInputField();
      this.showCompletionMessage();
      this.updateProgressBar(100);
    },

    'RUN_ERROR': (event) => {
      console.error('❌ 行程规划出错:', event.data.error);
      this.hideLoadingIndicator();
      this.enableInputField();
      this.showErrorMessage(event.data.error);
    }
  };

  handleAGUIEvent(event) {
    const handler = this.eventHandlers[event.type];
    if (handler) {
      handler(event);
    } else {
      console.log('📋 未处理的事件类型:', event.type);
    }
  }
}
```

## 最佳实践

### 1. 事件处理顺序
- 按照事件接收顺序处理
- 同一ID的事件属于同一逻辑流
- 实现容错机制处理乱序事件

### 2. 状态管理
- 使用STATE_SNAPSHOT初始化状态
- 使用STATE_DELTA增量更新
- 定期同步MESSAGES_SNAPSHOT

### 3. 用户体验
- 实时显示进度和状态
- 提供工具调用的可视化反馈
- 优雅处理错误情况

### 4. 性能优化
- 批量处理相似事件
- 避免频繁的UI更新
- 合理使用事件节流

## 总结

AG-UI协议通过16种标准化事件类型，为AI代理通信提供了完整的解决方案。在旅游行程规划agent中，这些事件能够清晰地表达代理的思考过程、工具调用、状态变化等信息，为前端提供丰富的交互体验。通过合理的事件处理，可以实现流畅的用户体验和强大的功能展示。 