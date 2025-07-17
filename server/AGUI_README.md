# AG-UI 协议 Mock 服务

基于 AG-UI（Agent User Interaction Protocol）标准协议规范的 Mock 服务，用于测试和开发 AG-UI 兼容的聊天机器人应用。

## 🎯 AG-UI 协议简介

AG-UI 是一个用于前端应用与 AI 代理通信的标准化协议，提供了以下核心特性：

- **标准化事件类型**：16种标准事件类型，覆盖完整的AI代理交互流程
- **实时流式交互**：支持 Server-Sent Events (SSE) 流式传输
- **双向通信**：支持前端与AI代理的双向事件通信
- **状态管理**：完整的状态快照和增量更新机制
- **工具调用**：标准化的工具调用和结果返回流程

## 📋 AG-UI 标准事件类型

### 生命周期事件
- `RUN_STARTED` - 对话开始
- `RUN_FINISHED` - 对话完成  
- `RUN_ERROR` - 对话出错
- `STEP_STARTED` - 步骤开始
- `STEP_FINISHED` - 步骤完成

### 文本消息事件
- `TEXT_MESSAGE_START` - 文本消息开始
- `TEXT_MESSAGE_CHUNK` - 文本消息块（流式）
- `TEXT_MESSAGE_END` - 文本消息结束

### 工具调用事件
- `TOOL_CALL_START` - 工具调用开始
- `TOOL_CALL_CHUNK` - 工具调用块
- `TOOL_CALL_END` - 工具调用结束

### 状态管理事件
- `STATE_SNAPSHOT` - 状态快照
- `STATE_DELTA` - 状态增量更新
- `MESSAGES_SNAPSHOT` - 消息快照

### 扩展事件
- `RAW` - 原始事件
- `CUSTOM` - 自定义事件

## 🚀 使用方法

### 1. 启动 Mock 服务

```bash
cd server
node ssemock.js
```

服务将在 `http://localhost:3000` 启动。

### 2. AG-UI 端点

#### 完整版 AG-UI 事件流

```bash
curl -X POST http://localhost:3000/sse/agui \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "请帮我规划一次家庭聚会",
    "simple": false
  }'
```

#### 简化版 AG-UI 事件流

```bash
curl -X POST http://localhost:3000/sse/agui \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "你好，请介绍一下AG-UI协议",
    "simple": true
  }'
```

### 3. JavaScript 客户端示例

```javascript
// 连接 AG-UI 事件流
const eventSource = new EventSource('/sse/agui', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: '请帮我规划一次家庭聚会',
    simple: false
  })
});

// 监听 AG-UI 事件
eventSource.onmessage = (event) => {
  try {
    const aguiEvent = JSON.parse(event.data);
    
    switch (aguiEvent.type) {
      case 'RUN_STARTED':
        console.log('🚀 对话开始:', aguiEvent.data.prompt);
        break;
        
      case 'TEXT_MESSAGE_CHUNK':
        console.log('📝 文本块:', aguiEvent.data.content);
        break;
        
      case 'TOOL_CALL_START':
        console.log('🔧 工具调用:', aguiEvent.data.toolName);
        break;
        
      case 'STEP_STARTED':
        console.log('📋 步骤开始:', aguiEvent.data.stepName);
        break;
        
      case 'RUN_FINISHED':
        console.log('✅ 对话完成:', aguiEvent.data.reason);
        eventSource.close();
        break;
        
      default:
        console.log('📋 其他事件:', aguiEvent.type);
    }
  } catch (error) {
    console.error('解析事件失败:', error);
  }
};

eventSource.onerror = (error) => {
  console.error('连接错误:', error);
  eventSource.close();
};
```

### 4. 使用 fetch API

```javascript
async function connectToAgui() {
  const response = await fetch('/sse/agui', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: '请帮我规划一次家庭聚会',
      simple: false
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const aguiEvent = JSON.parse(line.slice(6));
          console.log('AG-UI事件:', aguiEvent.type, aguiEvent.data);
        } catch (e) {
          // 忽略非JSON数据
        }
      }
    }
  }
}
```

## 📊 Mock 数据说明

### 完整版事件流 (`aguiChunks`)

包含完整的家庭聚会规划场景，演示了：

1. **多步骤执行流程**：餐饮规划 → 设备调度 → 安全监测
2. **工具调用**：饮食偏好分析器、智能设备调度器、安全检查器
3. **状态管理**：步骤进度跟踪、状态快照
4. **流式文本**：逐字显示文本内容
5. **思考过程**：AI代理的思考过程可视化

### 简化版事件流 (`simpleAguiChunks`)

包含基础的AG-UI协议介绍场景，演示了：

1. **基础对话流程**：开始 → 思考 → 文本生成 → 完成
2. **流式文本输出**：逐字显示介绍内容
3. **标准事件序列**：RUN_STARTED → CUSTOM → TEXT_MESSAGE_* → RUN_FINISHED

## 🔧 事件数据结构

### 标准 AG-UI 事件格式

```javascript
{
  type: 'TEXT_MESSAGE_CHUNK',           // 事件类型
  data: {                               // 事件数据
    content: '文本内容',
    contentType: 'text',
    delta: true
  },
  timestamp: 1234567890,                // 时间戳
  runId: 'run_abc123',                  // 运行ID
  agentId: 'my-agent',                  // 代理ID
  messageId: 'msg_xyz789',              // 消息ID（可选）
  threadId: 'thread_001',               // 线程ID（可选）
  metadata: {}                          // 元数据（可选）
}
```

### 事件继承机制

在同一个对话中，后续事件会继承前面事件的 `runId`、`agentId` 等字段，避免重复传输。

## 🧪 测试

运行测试脚本验证 AG-UI 端点：

```bash
node test-agui.js
```

测试脚本会：
1. 测试完整版 AG-UI 事件流
2. 测试简化版 AG-UI 事件流
3. 显示接收到的事件类型和数量

## 📚 相关资源

- [AG-UI 协议官方文档](https://docs.ag-ui.com)
- [TDesign Chatbot AG-UI 适配器](../src/chatbot/core/adapters/agui-adapter.ts)
- [AG-UI 示例代码](../src/chatbot/_example/agui-clear-example.tsx)

## 🔗 其他端点

除了 AG-UI 端点，Mock 服务还提供：

- `/sse/normal` - 传统 SSE 格式
- `/sse/agent` - 智能体事件格式
- `/fetch/normal` - 普通 HTTP 响应
- `/file/upload` - 文件上传模拟

## 📝 注意事项

1. **事件顺序**：AG-UI 事件按照预定义的顺序发送，确保客户端正确处理
2. **时间戳**：每个事件都包含时间戳，可用于调试和性能分析
3. **错误处理**：客户端应该处理 `RUN_ERROR` 事件和连接错误
4. **资源清理**：在对话完成或出错时，及时关闭连接释放资源 