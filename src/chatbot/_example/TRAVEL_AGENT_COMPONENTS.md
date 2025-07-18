# TravelAgent 自定义组件使用指南

## 概述

本demo展示了如何在AG-UI协议基础上，为travelAgent创建自定义UI组件，支持step、state和tool-call事件的展示。**TravelAgent相关的自定义事件处理在demo的onMessage回调中实现，而不是在公共的AGUIEventMapper中**。

## 架构设计

### 事件处理分层

1. **公共层 (AGUIEventMapper)**
   - 处理基础的AG-UI协议事件
   - 支持：TEXT_MESSAGE、THINKING、TOOL_CALL、STATE_SNAPSHOT、MESSAGES_SNAPSHOT等
   - 不包含业务特定的自定义事件

2. **业务层 (Demo onMessage)**
   - 处理TravelAgent特定的自定义事件
   - 支持：STEP_STARTED/STEP_FINISHED、STATE_DELTA、自定义业务事件
   - 将AG-UI事件转换为自定义UI组件

## 自定义组件类型

### 1. Step组件 (`step`)
展示AG-UI协议中的步骤事件，用于显示agent的执行步骤。

**数据结构：**
```typescript
{
  type: 'step',
  data: {
    stepName: string;
    status: 'started' | 'finished';
    timestamp: number;
  },
  status?: ChatMessageStatus;
}
```

**UI特性：**
- 渐变背景色（蓝紫色）
- 状态图标（🔄 进行中 / ✅ 完成）
- 步骤名称和时间戳显示

### 2. TravelPlan组件 (`travel_plan`)
展示旅行规划结果，包含计划详情、目的地、预算等信息。

**数据结构：**
```typescript
{
  type: 'travel_plan',
  data: {
    plan?: string;
    status: 'planning' | 'completed' | 'failed';
    destinations?: string[];
    duration?: string;
    budget?: string;
  },
  status?: ChatMessageStatus;
}
```

**UI特性：**
- 渐变背景色（粉红色）
- 状态标签（规划中/已完成/失败）
- 目的地路线图显示
- 预算和时间信息

### 3. TravelStep组件 (`travel_step`)
展示具体的旅行规划步骤，如景点查询、酒店预订等。

**数据结构：**
```typescript
{
  type: 'travel_step',
  data: {
    step?: string;
    action?: string;
    details?: string;
    status: 'processing' | 'completed' | 'failed';
  },
  status?: ChatMessageStatus;
}
```

**UI特性：**
- 渐变背景色（蓝色）
- 状态图标（🔄 处理中 / ✅ 完成 / ❌ 失败）
- 步骤和动作名称
- 详细信息展示

### 4. TravelState组件 (`travel_state`)
展示当前规划状态，包含进度条、上下文信息等。

**数据结构：**
```typescript
{
  type: 'travel_state',
  data: {
    currentStep?: string;
    progress?: number;
    context?: any;
    userPreferences?: any;
  },
  status?: ChatMessageStatus;
}
```

**UI特性：**
- 渐变背景色（青绿色）
- 进度条显示
- 当前步骤信息
- 上下文数据展示

## AG-UI事件映射

### 事件类型支持

1. **STEP_STARTED/STEP_FINISHED** (业务层处理)
   - 映射为 `step` 类型组件
   - 显示步骤开始和完成状态

2. **STATE_SNAPSHOT** (业务层处理)
   - 提取旅行相关信息
   - 生成 `travel_state` 和 `travel_plan` 组件

3. **STATE_DELTA** (业务层处理)
   - 实时更新状态
   - 生成 `travel_step` 组件

4. **TOOL_CALL事件** (业务层处理)
   - 工具调用开始/结束
   - 映射为 `travel_step` 组件

5. **基础事件** (公共层处理)
   - TEXT_MESSAGE：文本消息
   - THINKING：思考过程
   - 其他标准AG-UI事件

## 使用方法

### 1. 在Demo的onMessage回调中处理

```typescript
onMessage: (chunk: SSEChunkData) => {
  const event = chunk.data;
  if (!event?.type) return null;

  // 处理STEP_STARTED/STEP_FINISHED事件
  if (event.type === 'STEP_STARTED' || event.type === 'STEP_FINISHED') {
    return [{
      type: 'step',
      data: {
        stepName: event.stepName,
        status: event.type === 'STEP_FINISHED' ? 'finished' : 'started',
        timestamp: event.timestamp || Date.now(),
      },
      status: event.type === 'STEP_FINISHED' ? 'complete' : 'streaming',
    } as AIMessageContent];
  }

  // 处理STATE_SNAPSHOT事件
  if (event.type === 'STATE_SNAPSHOT' && event.snapshot) {
    // 提取旅行相关信息并生成组件
  }

  // 处理STATE_DELTA事件
  if (event.type === 'STATE_DELTA' && event.delta) {
    // 实时更新状态
  }

  // 返回null，让公共层处理其他事件
  return null;
}
```

### 2. 扩展类型定义

```typescript
declare module '../core/type' {
  interface AIContentTypeOverrides {
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
    // ... 其他类型
  }
}
```

### 3. 添加渲染插槽

```tsx
{this.mockMessage.value?.map((data) =>
  data.content.map((item) => {
    switch (item.type) {
      case 'step':
        return (
          <div slot={`${data.id}-${item.type}-${item.id || 'step'}`} className="travel-step">
            {/* 步骤组件UI */}
          </div>
        );
      case 'travel_plan':
        return (
          <div slot={`${data.id}-${item.type}-${item.id || 'plan'}`} className="travel-plan">
            {/* 旅行计划组件UI */}
          </div>
        );
      // ... 其他类型
    }
    return null;
  }),
).flat()}
```

## SSE数据结构匹配

### 标准AG-UI事件格式

```json
{
  "type": "STEP_STARTED",
  "timestamp": 1752835315407,
  "stepName": "需求分析"
}
```

```json
{
  "type": "STATE_SNAPSHOT",
  "timestamp": 1752835315405,
  "snapshot": {
    "userPreferences": {},
    "currentItinerary": {},
    "completedSteps": [],
    "currentStep": null,
    "pendingUserInput": false,
    "requirements": null,
    "attractions": null,
    "weather": null,
    "budget": null
  }
}
```

```json
{
  "type": "STATE_DELTA",
  "timestamp": 1752835315409,
  "delta": [
    {
      "op": "replace",
      "path": "/completedSteps",
      "value": ["需求分析"]
    }
  ]
}
```

## 样式定制

所有自定义组件都使用CSS渐变背景和现代化的设计风格：

- **Step组件**: 蓝紫色渐变
- **TravelPlan组件**: 粉红色渐变  
- **TravelStep组件**: 蓝色渐变
- **TravelState组件**: 青绿色渐变

样式通过CSS-in-JS方式注入，支持响应式设计和动画效果。

## 测试

运行测试函数验证组件功能：

```javascript
// 在浏览器控制台执行
testTravelAgentComponents();
```

## 最佳实践

1. **分层处理**: 公共事件在AGUIEventMapper中处理，业务事件在onMessage中处理
2. **事件命名规范**: 使用 `travel_` 前缀区分业务事件
3. **状态管理**: 通过 `status` 字段控制组件状态
4. **数据验证**: 在事件处理中验证必要字段
5. **错误处理**: 提供兜底的text类型输出
6. **性能优化**: 避免不必要的重新渲染

## 扩展指南

要添加新的自定义组件类型：

1. 在 `AIContentTypeOverrides` 中定义类型
2. 在demo的 `onMessage` 回调中添加处理逻辑
3. 在render方法中添加渲染插槽
4. 添加对应的CSS样式
5. 更新测试用例

这样就能完整支持AG-UI协议中的step、state和tool-call事件，为travelAgent提供丰富的可视化展示能力，同时保持公共组件的通用性。 