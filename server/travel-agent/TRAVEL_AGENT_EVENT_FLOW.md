# TravelAgentComplete 完整事件交互流程图

## 系统架构概览

```
┌─────────────────┐    HTTP/SSE    ┌─────────────────┐    Event Stream    ┌─────────────────┐
│   前端应用      │ ◄────────────► │   SSE服务器     │ ◄────────────► │  TravelAgent    │
│  (React/Vue)    │                │  (ssemock.js)   │                │  Complete       │
└─────────────────┘                └─────────────────┘                └─────────────────┘
         │                                   │                                   │
         │                                   │                                   │
         ▼                                   ▼                                   ▼
┌─────────────────┐                ┌─────────────────┐                ┌─────────────────┐
│   用户界面      │                │   事件收集器    │                │   底层模型      │
│   状态管理      │                │   状态存储      │                │   工具调用      │
│   事件处理      │                │   错误处理      │                │   业务逻辑      │
└─────────────────┘                └─────────────────┘                └─────────────────┘
```

## 详细事件交互流程

### 1. 初始化阶段

```mermaid
sequenceDiagram
    participant U as 用户
    participant F as 前端应用
    participant S as SSE服务器
    participant A as TravelAgent
    participant T as 工具服务

    U->>F: 输入旅游需求
    F->>S: POST /sse/travel-agent
    Note over F,S: {scenario: 'complete', userRequest: {...}}
    
    S->>A: 创建 TravelAgentComplete 实例
    A->>A: 生成 runId, threadId, messageId
    A->>A: 初始化状态对象
    
    A->>S: RUN_STARTED 事件
    S->>F: SSE: data: {"type": "RUN_STARTED", ...}
    F->>F: 更新UI状态为"运行中"
```

### 2. 需求分析阶段

```mermaid
sequenceDiagram
    participant A as TravelAgent
    participant S as SSE服务器
    participant F as 前端应用

    A->>A: 执行需求分析步骤
    A->>S: STEP_STARTED 事件
    S->>F: SSE: data: {"type": "STEP_STARTED", "stepName": "需求分析"}
    
    A->>S: TEXT_MESSAGE_START 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_START", ...}
    
    A->>S: TEXT_MESSAGE_CHUNK 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "我正在分析您的旅游需求..."}
    F->>F: 流式显示文本内容
    
    A->>A: 分析用户需求
    A->>A: 更新状态 (requirements)
    A->>S: STATE_DELTA 事件
    S->>F: SSE: data: {"type": "STATE_DELTA", "delta": [...]}
    
    A->>S: TEXT_MESSAGE_END 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_END", ...}
    
    A->>S: STEP_FINISHED 事件
    S->>F: SSE: data: {"type": "STEP_FINISHED", "stepName": "需求分析"}
```

### 3. 景点查询阶段（包含工具调用）

```mermaid
sequenceDiagram
    participant A as TravelAgent
    participant S as SSE服务器
    participant F as 前端应用
    participant T as 外部API

    A->>A: 执行景点查询步骤
    A->>S: STEP_STARTED 事件
    S->>F: SSE: data: {"type": "STEP_STARTED", "stepName": "景点查询"}
    
    A->>S: TEXT_MESSAGE_START 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_START", ...}
    
    A->>S: TEXT_MESSAGE_CHUNK 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "正在查询景点信息..."}
    
    A->>S: TOOL_CALL_START 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_START", "toolCallName": "get_attractions", ...}
    F->>F: 显示工具调用状态
    
    A->>S: TOOL_CALL_ARGS 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_ARGS", "delta": '{"city": "北京", ...}'}
    
    A->>T: 调用外部API
    T-->>A: 返回景点数据
    
    A->>S: TOOL_CALL_END 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_END", ...}
    
    A->>S: TOOL_CALL_RESULT 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_RESULT", "content": "[景点数据]", "role": "tool"}
    
    A->>A: 更新状态 (attractions)
    A->>S: STATE_DELTA 事件
    S->>F: SSE: data: {"type": "STATE_DELTA", "delta": [...]}
    
    A->>S: TEXT_MESSAGE_CHUNK 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "找到 3 个景点"}
    
    A->>S: TEXT_MESSAGE_END 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_END", ...}
    
    A->>S: STEP_FINISHED 事件
    S->>F: SSE: data: {"type": "STEP_FINISHED", "stepName": "景点查询"}
```

### 4. 天气查询阶段

```mermaid
sequenceDiagram
    participant A as TravelAgent
    participant S as SSE服务器
    participant F as 前端应用
    participant T as 天气API

    A->>A: 执行天气查询步骤
    A->>S: STEP_STARTED 事件
    S->>F: SSE: data: {"type": "STEP_STARTED", "stepName": "天气查询"}
    
    A->>S: TOOL_CALL_START 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_START", "toolCallName": "get_weather", ...}
    
    A->>T: 调用天气API
    T-->>A: 返回天气数据
    
    A->>S: TOOL_CALL_END 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_END", ...}
    
    A->>S: TOOL_CALL_RESULT 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_RESULT", "content": "[天气数据]", "role": "tool"}
    
    A->>A: 更新状态 (weather)
    A->>S: STATE_DELTA 事件
    S->>F: SSE: data: {"type": "STATE_DELTA", "delta": [...]}
    
    A->>S: STEP_FINISHED 事件
    S->>F: SSE: data: {"type": "STEP_FINISHED", "stepName": "天气查询"}
```

### 5. 路线规划阶段

```mermaid
sequenceDiagram
    participant A as TravelAgent
    participant S as SSE服务器
    participant F as 前端应用

    A->>A: 执行路线规划步骤
    A->>S: STEP_STARTED 事件
    S->>F: SSE: data: {"type": "STEP_STARTED", "stepName": "路线规划"}
    
    A->>S: TEXT_MESSAGE_START 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_START", ...}
    
    A->>A: 生成行程安排
    A->>A: 更新状态 (currentItinerary)
    
    loop 分块发送行程内容
        A->>S: TEXT_MESSAGE_CHUNK 事件
        S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "**第1天行程：**"}
        F->>F: 流式显示行程内容
        
        A->>S: TEXT_MESSAGE_CHUNK 事件
        S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "- 故宫博物院"}
        
        A->>S: TEXT_MESSAGE_CHUNK 事件
        S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "- 天安门广场"}
    end
    
    A->>S: STATE_DELTA 事件
    S->>F: SSE: data: {"type": "STATE_DELTA", "delta": [...]}
    
    A->>S: TEXT_MESSAGE_END 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_END", ...}
    
    A->>S: STEP_FINISHED 事件
    S->>F: SSE: data: {"type": "STEP_FINISHED", "stepName": "路线规划"}
```

### 6. 预算计算阶段

```mermaid
sequenceDiagram
    participant A as TravelAgent
    participant S as SSE服务器
    participant F as 前端应用
    participant T as 预算计算API

    A->>A: 执行预算计算步骤
    A->>S: STEP_STARTED 事件
    S->>F: SSE: data: {"type": "STEP_STARTED", "stepName": "预算计算"}
    
    A->>S: TOOL_CALL_START 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_START", "toolCallName": "calculate_budget", ...}
    
    A->>T: 调用预算计算API
    T-->>A: 返回预算数据
    
    A->>S: TOOL_CALL_END 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_END", ...}
    
    A->>S: TOOL_CALL_RESULT 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_RESULT", "content": "[预算数据]", "role": "tool"}
    
    A->>A: 更新状态 (budget)
    A->>S: STATE_DELTA 事件
    S->>F: SSE: data: {"type": "STATE_DELTA", "delta": [...]}
    
    A->>S: STEP_FINISHED 事件
    S->>F: SSE: data: {"type": "STEP_FINISHED", "stepName": "预算计算"}
```

### 7. 用户交互阶段

```mermaid
sequenceDiagram
    participant A as TravelAgent
    participant S as SSE服务器
    participant F as 前端应用
    participant U as 用户

    A->>A: 检查是否需要用户确认
    alt 需要用户确认
        A->>S: CUSTOM 事件 (input_request)
        S->>F: SSE: data: {"type": "CUSTOM", "name": "input_request", "value": {...}}
        F->>F: 显示用户选择界面
        
        A->>S: CUSTOM 事件 (stream_pause)
        S->>F: SSE: data: {"type": "CUSTOM", "name": "stream_pause", "value": {...}}
        F->>F: 暂停事件流，等待用户输入
        
        A->>A: 更新状态 (pendingUserInput: true)
        A->>S: STATE_DELTA 事件
        S->>F: SSE: data: {"type": "STATE_DELTA", "delta": [...]}
        
        Note over A,S: 流暂停，等待用户输入
    end
```

### 8. 用户输入继续处理

```mermaid
sequenceDiagram
    participant U as 用户
    participant F as 前端应用
    participant S as SSE服务器
    participant A as TravelAgent
    participant T as 预订API

    U->>F: 选择"确认并预订"
    F->>S: POST /sse/travel-agent/continue
    Note over F,S: {requestId: "...", userInput: "确认并预订"}
    
    S->>A: 获取存储的agent实例
    A->>S: CUSTOM 事件 (stream_resume)
    S->>F: SSE: data: {"type": "CUSTOM", "name": "stream_resume", "value": {...}}
    
    A->>A: 更新状态 (pendingUserInput: false)
    A->>S: STATE_DELTA 事件
    S->>F: SSE: data: {"type": "STATE_DELTA", "delta": [...]}
    
    A->>A: 执行预订确认步骤
    A->>S: STEP_STARTED 事件
    S->>F: SSE: data: {"type": "STEP_STARTED", "stepName": "预订确认"}
    
    A->>S: TOOL_CALL_START 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_START", "toolCallName": "create_booking", ...}
    
    A->>T: 调用预订API
    T-->>A: 返回预订结果
    
    A->>S: TOOL_CALL_END 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_END", ...}
    
    A->>S: TOOL_CALL_RESULT 事件
    S->>F: SSE: data: {"type": "TOOL_CALL_RESULT", "content": "[预订结果]", "role": "tool"}
    
    A->>S: TEXT_MESSAGE_START 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_START", ...}
    
    A->>S: TEXT_MESSAGE_CHUNK 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "预订成功！您的行程已确认。"}
    
    A->>S: TEXT_MESSAGE_END 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_END", ...}
    
    A->>S: STEP_FINISHED 事件
    S->>F: SSE: data: {"type": "STEP_FINISHED", "stepName": "预订确认"}
```

### 9. 完成阶段

```mermaid
sequenceDiagram
    participant A as TravelAgent
    participant S as SSE服务器
    participant F as 前端应用

    A->>A: 执行行程总结步骤
    A->>S: STEP_STARTED 事件
    S->>F: SSE: data: {"type": "STEP_STARTED", "stepName": "行程总结"}
    
    A->>S: TEXT_MESSAGE_START 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_START", ...}
    
    loop 发送预算总结
        A->>S: TEXT_MESSAGE_CHUNK 事件
        S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "**预算总结：**"}
        
        A->>S: TEXT_MESSAGE_CHUNK 事件
        S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "- 景点门票：275元"}
        
        A->>S: TEXT_MESSAGE_CHUNK 事件
        S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "- 住宿费用：600元"}
        
        A->>S: TEXT_MESSAGE_CHUNK 事件
        S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "- **总计：1250元**"}
    end
    
    loop 发送温馨提示
        A->>S: TEXT_MESSAGE_CHUNK 事件
        S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "**温馨提示：**"}
        
        A->>S: TEXT_MESSAGE_CHUNK 事件
        S->>F: SSE: data: {"type": "TEXT_MESSAGE_CHUNK", "delta": "1. 建议提前在网上预订故宫门票"}
    end
    
    A->>S: TEXT_MESSAGE_END 事件
    S->>F: SSE: data: {"type": "TEXT_MESSAGE_END", ...}
    
    A->>S: STEP_FINISHED 事件
    S->>F: SSE: data: {"type": "STEP_FINISHED", "stepName": "行程总结"}
    
    A->>S: MESSAGES_SNAPSHOT 事件
    S->>F: SSE: data: {"type": "MESSAGES_SNAPSHOT", "messages": [...]}
    
    A->>S: RUN_FINISHED 事件
    S->>F: SSE: data: {"type": "RUN_FINISHED", "result": {...}}
    F->>F: 更新UI状态为"完成"
```

## 状态管理流程

### 状态结构

```javascript
{
  userPreferences: {},        // 用户偏好
  currentItinerary: {},       // 当前行程
  completedSteps: [],         // 已完成步骤
  currentStep: null,          // 当前步骤
  pendingUserInput: false,    // 等待用户输入
  requirements: null,         // 需求分析结果
  attractions: null,          // 景点信息
  weather: null,              // 天气信息
  budget: null,               // 预算信息
}
```

### 状态更新流程

```mermaid
graph TD
    A[Agent执行操作] --> B[更新本地状态]
    B --> C[生成状态增量]
    C --> D[发送STATE_DELTA事件]
    D --> E[前端接收状态更新]
    E --> F[应用状态增量]
    F --> G[更新UI显示]
    
    H[初始化] --> I[发送STATE_SNAPSHOT事件]
    I --> J[前端接收完整状态]
    J --> K[初始化前端状态]
```

## 错误处理流程

```mermaid
sequenceDiagram
    participant A as TravelAgent
    participant S as SSE服务器
    participant F as 前端应用

    Note over A: 发生错误
    A->>S: RUN_ERROR 事件
    S->>F: SSE: data: {"type": "RUN_ERROR", "message": "错误信息", "code": "ERROR_CODE"}
    F->>F: 显示错误信息
    F->>F: 提供重试选项
    
    alt 工具调用错误
        A->>S: TOOL_CALL_END 事件
        S->>F: SSE: data: {"type": "TOOL_CALL_END", ...}
        
        A->>S: TOOL_CALL_RESULT 事件
        S->>F: SSE: data: {"type": "TOOL_CALL_RESULT", "content": '{"error": "错误信息"}', "role": "tool"}
    end
```

## 事件类型总结

| 事件类型 | 发送时机 | 前端处理 |
|---------|---------|---------|
| `RUN_STARTED` | Agent开始运行 | 显示加载状态 |
| `STEP_STARTED` | 每个步骤开始 | 显示步骤进度 |
| `TEXT_MESSAGE_START` | 文本消息开始 | 创建消息容器 |
| `TEXT_MESSAGE_CHUNK` | 文本内容流 | 流式显示文本 |
| `TEXT_MESSAGE_END` | 文本消息结束 | 完成消息显示 |
| `TOOL_CALL_START` | 工具调用开始 | 显示工具调用状态 |
| `TOOL_CALL_ARGS` | 工具调用参数 | 显示调用参数 |
| `TOOL_CALL_END` | 工具调用结束 | 更新工具调用状态 |
| `TOOL_CALL_RESULT` | 工具调用结果 | 显示调用结果 |
| `STEP_FINISHED` | 每个步骤完成 | 更新步骤状态 |
| `STATE_SNAPSHOT` | 状态快照 | 初始化状态 |
| `STATE_DELTA` | 状态增量更新 | 应用状态更新 |
| `MESSAGES_SNAPSHOT` | 消息快照 | 更新消息历史 |
| `CUSTOM` | 自定义事件 | 处理用户交互 |
| `RUN_FINISHED` | Agent完成运行 | 显示完成状态 |
| `RUN_ERROR` | 发生错误 | 显示错误信息 |

## 关键设计要点

1. **事件驱动架构**: 所有交互都通过标准化事件进行
2. **流式处理**: 文本和工具调用都支持流式传输
3. **状态同步**: 通过快照和增量更新保持状态一致
4. **错误恢复**: 完整的错误处理和恢复机制
5. **用户交互**: 支持暂停和继续的用户交互模式
6. **工具集成**: 标准化的工具调用和结果处理
7. **可扩展性**: 支持自定义事件和业务逻辑扩展 