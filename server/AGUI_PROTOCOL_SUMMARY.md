# AG-UI 协议完整总结

## 概述

AG-UI（Agent User Interaction Protocol）是一个标准化的AI代理通信协议，定义了16种核心事件类型，用于前端应用与AI代理之间的实时通信。本文档总结了所有事件类型，并结合旅游行程规划agent的具体实现进行说明。

## 事件类型总览

### 1. 生命周期事件 (5种)
| 事件类型 | 描述 | 用途 |
|---------|------|------|
| `RUN_STARTED` | 代理运行开始 | 表示一个新的对话会话启动 |
| `RUN_FINISHED` | 代理运行完成 | 表示当前对话会话结束 |
| `RUN_ERROR` | 代理运行出错 | 表示执行过程中发生错误 |
| `STEP_STARTED` | 步骤开始 | 表示代理开始处理特定的任务 |
| `STEP_FINISHED` | 步骤完成 | 表示代理完成了特定的任务 |

### 2. 文本消息事件 (3种)
| 事件类型 | 描述 | 用途 |
|---------|------|------|
| `TEXT_MESSAGE_START` | 开始发送文本消息 | 表示代理开始生成回复内容 |
| `TEXT_MESSAGE_CHUNK` | 文本消息内容块 | 用于流式传输文本内容 |
| `TEXT_MESSAGE_END` | 文本消息结束 | 表示代理完成了当前回复的生成 |

### 3. 工具调用事件 (3种)
| 事件类型 | 描述 | 用途 |
|---------|------|------|
| `TOOL_CALL_START` | 开始工具调用 | 表示代理开始使用外部工具或API |
| `TOOL_CALL_CHUNK` | 工具调用参数块 | 用于流式传输工具调用参数 |
| `TOOL_CALL_END` | 工具调用结束 | 表示工具执行完成 |

### 4. 状态管理事件 (3种)
| 事件类型 | 描述 | 用途 |
|---------|------|------|
| `STATE_SNAPSHOT` | 状态快照 | 提供完整的当前状态信息 |
| `STATE_DELTA` | 状态增量更新 | 提供状态变化的部分信息 |
| `MESSAGES_SNAPSHOT` | 消息快照 | 提供完整的对话历史 |

### 5. 扩展事件 (2种)
| 事件类型 | 描述 | 用途 |
|---------|------|------|
| `RAW` | 原始事件 | 用于传递未标准化的数据 |
| `CUSTOM` | 自定义事件 | 用于传递业务特定的数据 |

## 旅游行程规划Agent实现

### 功能特性

我们的旅游行程规划agent实现了以下功能：

1. **智能需求分析** - 分析用户的时间、预算、兴趣偏好
2. **景点查询** - 调用外部API获取景点信息
3. **路线规划** - 根据景点信息规划最优路线
4. **天气查询** - 获取目的地天气信息
5. **预算计算** - 计算行程总费用
6. **路线优化** - 根据天气和用户偏好优化行程

### 事件流示例

```javascript
// 1. 用户发起请求
RUN_STARTED: "帮我规划一个3天的北京旅游行程"

// 2. 需求分析步骤
STEP_STARTED: "需求分析"
TEXT_MESSAGE_CHUNK: "我正在分析您的旅游需求..."
STEP_FINISHED: "需求分析" (结果: 3天, 中等预算, 历史文化兴趣)

// 3. 景点查询
STEP_STARTED: "景点查询"
TOOL_CALL_START: "get_attractions"
TOOL_CALL_CHUNK: { city: "北京", category: "historical" }
TOOL_CALL_END: 返回故宫、长城、天坛等景点信息
STEP_FINISHED: "景点查询"

// 4. 状态同步
STATE_SNAPSHOT: 包含用户偏好、当前行程、已完成步骤

// 5. 路线规划
STEP_STARTED: "路线规划"
TEXT_MESSAGE_CHUNK: "第一天：故宫 + 天安门广场..."
TOOL_CALL_START: "get_weather"
TOOL_CALL_END: 返回3天天气预报
STEP_FINISHED: "路线规划"

// 6. 状态增量更新
STATE_DELTA: 添加圆明园到第二天行程

// 7. 路线优化
STEP_STARTED: "景点优化"
CUSTOM: "route_optimization" (优化路线顺序)
TEXT_MESSAGE_CHUNK: "第二天：长城 + 颐和园..."

// 8. 预算计算
STEP_STARTED: "预算计算"
TOOL_CALL_START: "calculate_budget"
TOOL_CALL_END: 返回总费用1250元
STEP_FINISHED: "预算计算"

// 9. 完成行程规划
TEXT_MESSAGE_CHUNK: "第三天：天坛 + 胡同文化..."
TEXT_MESSAGE_CHUNK: "预算总结：1250元..."
TEXT_MESSAGE_END: 完成文本消息
STEP_FINISHED: "景点优化"

// 10. 完成运行
RUN_FINISHED: 成功完成，生成行程规划
```

### 错误处理场景

#### 网络错误场景
```javascript
RUN_STARTED: 开始运行
STEP_STARTED: "景点查询"
TOOL_CALL_START: "get_attractions"
TOOL_CALL_END: 失败 (success: false)
RUN_ERROR: "无法获取景点信息，网络连接失败"
RUN_FINISHED: 失败 (success: false)
```

#### 网络中断场景
```javascript
RUN_STARTED: 开始运行
STEP_STARTED: "需求分析"
TEXT_MESSAGE_CHUNK: "正在分析您的需求..."
STEP_FINISHED: "需求分析"
RAW: "network_interruption" (网络中断)
RAW: "network_restored" (网络恢复)
STEP_STARTED: "景点查询"
TOOL_CALL_START: "get_attractions"
TOOL_CALL_END: 成功
STEP_FINISHED: "景点查询"
RUN_FINISHED: 成功完成
```

#### 用户交互场景
```javascript
RUN_STARTED: 开始运行
CUSTOM: "input_request" (请求用户选择住宿类型)
CUSTOM: "user_input" (用户选择商务酒店)
STEP_STARTED: "住宿查询"
TOOL_CALL_START: "get_hotels"
TOOL_CALL_END: 返回酒店列表
STEP_FINISHED: "住宿查询"
RUN_FINISHED: 成功完成
```

## 实现文件说明

### 1. 核心文件

- **`AGUI_EVENTS_DETAILED_GUIDE.md`** - 详细的事件类型说明和用法
- **`travel-agent-mock-data.js`** - 旅游行程规划agent的mock数据生成器
- **`ssemock.js`** - SSE服务器，包含旅游agent端点
- **`test-travel-agent.js`** - 测试脚本，验证agent功能

### 2. 端点说明

#### `/sse/travel-agent` - 旅游行程规划Agent端点

**请求方法**: POST  
**请求体**:
```json
{
  "scenario": "normal" | "error" | "network" | "interaction"
}
```

**响应**: SSE事件流，包含完整的AG-UI协议事件

**场景说明**:
- `normal`: 正常行程规划流程
- `error`: 网络错误场景
- `network`: 网络中断和恢复场景
- `interaction`: 用户交互场景

### 3. 测试方法

```bash
# 启动服务器
node server/ssemock.js

# 运行测试
node server/test-travel-agent.js
```

## 前端集成示例

### 基本使用

```typescript
const config = {
  endpoint: '/sse/travel-agent',
  stream: true,
  
  agui: {
    enabled: true,
    agentId: 'travel-planner',
    
    onBusinessEvent: (event) => {
      switch (event.type) {
        case 'RUN_STARTED':
          showLoadingIndicator();
          break;
          
        case 'STEP_STARTED':
          updateProgressBar(event.data.stepName);
          break;
          
        case 'TEXT_MESSAGE_CHUNK':
          appendToMessage(event.data.content);
          break;
          
        case 'TOOL_CALL_START':
          showToolCallIndicator(event.data.toolName);
          break;
          
        case 'RUN_FINISHED':
          hideLoadingIndicator();
          showCompletionMessage();
          break;
      }
    }
  }
};
```

### 状态管理

```typescript
let currentState = {};

const handleStateEvent = (event) => {
  switch (event.type) {
    case 'STATE_SNAPSHOT':
      currentState = event.data.state;
      updateUIWithState(currentState);
      break;
      
    case 'STATE_DELTA':
      applyStateDelta(event.data.delta);
      updateUIWithDelta(event.data.delta);
      break;
  }
};
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

AG-UI协议通过16种标准化事件类型，为AI代理通信提供了完整的解决方案。在旅游行程规划agent中，这些事件能够清晰地表达代理的思考过程、工具调用、状态变化等信息，为前端提供丰富的交互体验。

通过合理的事件处理，可以实现：
- 流畅的用户体验
- 强大的功能展示
- 可靠的错误处理
- 灵活的状态管理
- 实时的进度反馈

这种事件驱动的架构使得AI代理能够与前端应用进行高效、实时的通信，为用户提供更好的交互体验。 