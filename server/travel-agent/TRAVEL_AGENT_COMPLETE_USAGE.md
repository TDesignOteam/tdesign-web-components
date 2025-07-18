# TravelAgentComplete SSE 端点使用说明

## 概述

`/sse/travel-agent` 端点现在支持使用 `TravelAgentComplete` 类来提供完整的旅游行程规划功能。这个类实现了完整的AG-UI协议事件流，包括生命周期事件、文本消息、工具调用、状态管理和用户交互。

## 端点配置

### 主要端点

- **POST** `/sse/travel-agent` - 旅游行程规划Agent
- **POST** `/sse/travel-agent/continue` - 用户交互继续处理

## 使用方式

### 1. 完整旅游规划流程

```javascript
// 使用 TravelAgentComplete 类进行完整规划
const response = await fetch('/sse/travel-agent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    scenario: 'complete',  // 使用 TravelAgentComplete 类
    userRequest: {
      destination: '北京',
      duration: 3,
      budget: 'medium',
      interests: ['历史文化', '美食'],
    },
  }),
});

// 处理SSE事件流
const reader = response.body;
for await (const chunk of reader) {
  const text = chunk.toString();
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const eventData = JSON.parse(line.slice(6));
      console.log('收到事件:', eventData.type);
      
      // 处理不同类型的事件
      switch (eventData.type) {
        case 'RUN_STARTED':
          console.log('Agent开始运行');
          break;
        case 'TEXT_MESSAGE_CHUNK':
          console.log('文本内容:', eventData.delta);
          break;
        case 'TOOL_CALL_START':
          console.log('工具调用开始:', eventData.toolCallName);
          break;
        case 'CUSTOM':
          if (eventData.name === 'input_request') {
            console.log('需要用户输入:', eventData.value);
            // 调用继续处理端点
            await continueWithUserInput(eventData.value.requestId, '确认并预订');
          }
          break;
        case 'RUN_FINISHED':
          console.log('规划完成');
          break;
      }
    }
  }
}
```

### 2. 用户交互继续处理

```javascript
async function continueWithUserInput(requestId, userInput) {
  const response = await fetch('/sse/travel-agent/continue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requestId,
      userInput,
    }),
  });

  // 处理继续的事件流
  const reader = response.body;
  for await (const chunk of reader) {
    const text = chunk.toString();
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const eventData = JSON.parse(line.slice(6));
        console.log('继续事件:', eventData.type);
      }
    }
  }
}
```

### 3. 其他场景模式

```javascript
// 错误场景
const errorResponse = await fetch('/sse/travel-agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenario: 'error' }),
});

// 网络中断场景
const networkResponse = await fetch('/sse/travel-agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenario: 'network' }),
});

// 交互场景（使用原有mock数据）
const interactionResponse = await fetch('/sse/travel-agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenario: 'interaction' }),
});
```

## 事件类型

### 生命周期事件

- `RUN_STARTED` - Agent开始运行
- `RUN_FINISHED` - Agent完成运行
- `RUN_ERROR` - Agent运行错误

### 文本消息事件

- `TEXT_MESSAGE_START` - 文本消息开始
- `TEXT_MESSAGE_CHUNK` - 文本消息内容块
- `TEXT_MESSAGE_END` - 文本消息结束

### 工具调用事件

- `TOOL_CALL_START` - 工具调用开始
- `TOOL_CALL_ARGS` - 工具调用参数
- `TOOL_CALL_END` - 工具调用结束
- `TOOL_CALL_RESULT` - 工具调用结果

### 步骤管理事件

- `STEP_STARTED` - 步骤开始
- `STEP_FINISHED` - 步骤完成

### 状态管理事件

- `STATE_SNAPSHOT` - 状态快照
- `STATE_DELTA` - 状态增量更新

### 消息快照事件

- `MESSAGES_SNAPSHOT` - 消息快照

### 自定义事件

- `CUSTOM` - 自定义事件（用户交互、系统通知等）

## 旅游规划流程

使用 `TravelAgentComplete` 类时，完整的旅游规划流程包括：

1. **需求分析** - 分析用户旅游需求
2. **景点查询** - 调用工具查询景点信息
3. **天气查询** - 获取目的地天气信息
4. **路线规划** - 制定详细行程安排
5. **预算计算** - 计算总费用
6. **用户确认** - 等待用户确认或修改
7. **预订处理** - 根据用户选择进行预订

## 测试

运行测试脚本：

```bash
node server/test-travel-agent-complete.js
```

## 注意事项

1. **状态管理**: TravelAgentComplete 类会维护完整的交互状态，支持断点续传
2. **事件收集**: 端点会自动收集所有发出的事件并转换为SSE流
3. **错误处理**: 包含完整的错误处理和恢复机制
4. **超时处理**: 用户交互状态会在5分钟后自动过期
5. **并发支持**: 支持多个并发请求，每个请求有独立的runId

## 与原有功能的兼容性

- 原有的 `scenario` 参数仍然支持（error、network、interaction、default）
- 新增 `complete` 场景使用 TravelAgentComplete 类
- 继续处理端点同时支持新旧两种模式 