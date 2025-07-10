/**
 * AG-UI协议兼容的服务端示例
 *
 * 展示如何实现符合AG-UI协议的SSE流式响应
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// AG-UI事件构建器
class AGUIEventBuilder {
  constructor(agentId = 'tdesign-chatbot') {
    this.agentId = agentId;
    this.runId = null;
  }

  // 创建基础事件结构
  createEvent(type, data, messageId = null) {
    return {
      type,
      data,
      timestamp: Date.now(),
      runId: this.runId,
      agentId: this.agentId,
      ...(messageId && { messageId }),
    };
  }

  // 对话开始
  runStarted(prompt, messageId, attachments = []) {
    this.runId = `run_${Date.now()}_${uuidv4().slice(0, 8)}`;

    return this.createEvent(
      'RUN_STARTED',
      {
        prompt,
        messageId,
        attachments,
        sessionId: `session_${Date.now()}`,
      },
      messageId,
    );
  }

  // 文本消息块
  textChunk(content, messageId, contentType = 'text') {
    return this.createEvent(
      'TEXT_MESSAGE_CHUNK',
      {
        content,
        contentType,
        messageId,
        delta: true, // 表示这是增量更新
      },
      messageId,
    );
  }

  // 思考过程
  agentThinking(content, title, messageId) {
    return this.createEvent(
      'AGENT_MESSAGE',
      {
        type: 'thinking',
        content,
        title,
        messageId,
      },
      messageId,
    );
  }

  // 工具调用
  toolCall(toolName, action, input, toolCallId, messageId) {
    return this.createEvent(
      'TOOL_CALL_CHUNK',
      {
        toolName,
        action,
        input,
        toolCallId,
      },
      messageId,
    );
  }

  // 工具结果
  toolResult(toolName, toolCallId, result, success = true, messageId) {
    return this.createEvent(
      'TOOL_RESULT_CHUNK',
      {
        toolName,
        toolCallId,
        result,
        success,
      },
      messageId,
    );
  }

  // 对话完成
  runFinished(success = true, reason = 'completed', result = null) {
    const event = this.createEvent('RUN_FINISHED', {
      success,
      reason,
      ...(result && { result }),
    });

    // 重置runId
    this.runId = null;
    return event;
  }

  // 运行错误
  runError(error, errorCode = null, details = null) {
    const event = this.createEvent('RUN_ERROR', {
      error: typeof error === 'string' ? error : error.message,
      ...(errorCode && { errorCode }),
      ...(details && { details }),
    });

    // 重置runId
    this.runId = null;
    return event;
  }

  // 心跳检测
  heartbeat(connectionId) {
    return this.createEvent('HEARTBEAT', {
      connectionId,
      timestamp: Date.now(),
    });
  }

  // 连接状态变化
  stateChange(from, to, connectionId) {
    return this.createEvent('STATE_CHANGE', {
      from,
      to,
      connectionId,
    });
  }
}

// 模拟AI回复生成器
class MockAIGenerator {
  constructor() {
    this.responses = ['你好！我是AI助手，', '很高兴为你服务。', '有什么我可以帮助你的吗？'];
  }

  async *generateResponse(prompt) {
    // 模拟思考过程
    yield {
      type: 'thinking',
      content: '正在分析你的问题...',
      title: '思考中',
    };

    await this.delay(500);

    // 如果需要搜索
    if (prompt.includes('搜索') || prompt.includes('查询')) {
      yield {
        type: 'tool_call',
        toolName: 'web_search',
        action: 'search',
        input: { query: prompt },
      };

      await this.delay(800);

      yield {
        type: 'tool_result',
        toolName: 'web_search',
        result: {
          results: [
            { title: '搜索结果1', url: 'https://example1.com' },
            { title: '搜索结果2', url: 'https://example2.com' },
          ],
        },
        success: true,
      };

      await this.delay(300);
    }

    // 生成文本回复
    const responses = this.getResponseForPrompt(prompt);
    for (const chunk of responses) {
      yield {
        type: 'text',
        content: chunk,
      };
      await this.delay(200);
    }
  }

  getResponseForPrompt(prompt) {
    if (prompt.includes('你好') || prompt.includes('hello')) {
      return ['你好！', '我是AI助手，', '有什么可以帮助你的吗？'];
    }
    if (prompt.includes('搜索')) {
      return ['根据搜索结果，', '我找到了相关信息，', '希望对你有帮助。'];
    }
    return ['这是一个很好的问题，', '让我为你详细解答。', '希望我的回答对你有帮助。'];
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// AG-UI兼容的SSE聊天端点
app.post('/api/agui-chat', async (req, res) => {
  console.log('🚀 收到AG-UI聊天请求:', req.body);

  // 设置SSE头部
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  const { prompt, messageId = uuidv4(), attachments = [] } = req.body;

  const eventBuilder = new AGUIEventBuilder('tdesign-agui-server');
  const aiGenerator = new MockAIGenerator();

  try {
    // 1. 发送RUN_STARTED事件
    const startEvent = eventBuilder.runStarted(prompt, messageId, attachments);
    res.write(`data: ${JSON.stringify(startEvent)}\n\n`);
    console.log('📡 发送事件:', startEvent.type);

    // 2. 生成AI回复流
    for await (const chunk of aiGenerator.generateResponse(prompt)) {
      let event;

      switch (chunk.type) {
        case 'thinking':
          event = eventBuilder.agentThinking(chunk.content, chunk.title, messageId);
          break;

        case 'tool_call':
          event = eventBuilder.toolCall(chunk.toolName, chunk.action, chunk.input, `tool_${Date.now()}`, messageId);
          break;

        case 'tool_result':
          event = eventBuilder.toolResult(chunk.toolName, `tool_${Date.now()}`, chunk.result, chunk.success, messageId);
          break;

        case 'text':
          event = eventBuilder.textChunk(chunk.content, messageId);
          break;
      }

      if (event) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        console.log('📡 发送事件:', event.type, event.data);
      }
    }

    // 3. 发送RUN_FINISHED事件
    const finishEvent = eventBuilder.runFinished(true, 'completed', {
      totalTokens: 150,
      duration: Date.now() - startEvent.timestamp,
    });
    res.write(`data: ${JSON.stringify(finishEvent)}\n\n`);
    console.log('📡 发送事件:', finishEvent.type);

    // 4. 结束流
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('❌ 处理请求时出错:', error);

    // 发送错误事件
    const errorEvent = eventBuilder.runError(error.message, 'SERVER_ERROR', {
      stack: error.stack,
    });
    res.write(`data: ${JSON.stringify(errorEvent)}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// 传统格式转AG-UI格式的端点
app.post('/api/legacy-to-agui', async (req, res) => {
  console.log('🔄 传统格式转AG-UI格式请求:', req.body);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  const { prompt, messageId = uuidv4() } = req.body;
  const eventBuilder = new AGUIEventBuilder('legacy-converter');

  try {
    // 开始事件
    const startEvent = eventBuilder.runStarted(prompt, messageId);
    res.write(`data: ${JSON.stringify(startEvent)}\n\n`);

    // 模拟传统格式数据
    const legacyChunks = [
      { data: { type: 'text', msg: '这是传统格式的' } },
      { data: { type: 'text', msg: '文本消息，' } },
      { data: { type: 'think', content: '正在思考...', title: '思考中' } },
      { data: { type: 'text', msg: '现在转换为AG-UI格式。' } },
    ];

    for (const legacyChunk of legacyChunks) {
      // 转换为AG-UI格式
      let aguiEvent;
      const chunkData = legacyChunk.data;

      switch (chunkData.type) {
        case 'text':
          aguiEvent = eventBuilder.textChunk(chunkData.msg, messageId);
          break;

        case 'think':
          aguiEvent = eventBuilder.agentThinking(chunkData.content, chunkData.title, messageId);
          break;

        case 'search':
          aguiEvent = eventBuilder.toolCall(
            'web_search',
            'search',
            { query: chunkData.query },
            `tool_${Date.now()}`,
            messageId,
          );
          break;

        default:
          // 其他类型作为元数据更新
          aguiEvent = eventBuilder.createEvent(
            'METADATA_UPDATE',
            {
              type: chunkData.type,
              data: chunkData,
            },
            messageId,
          );
      }

      res.write(`data: ${JSON.stringify(aguiEvent)}\n\n`);
      console.log('🔄 转换事件:', aguiEvent.type);

      // 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // 完成事件
    const finishEvent = eventBuilder.runFinished();
    res.write(`data: ${JSON.stringify(finishEvent)}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    const errorEvent = eventBuilder.runError(error.message);
    res.write(`data: ${JSON.stringify(errorEvent)}\n\n`);
    res.end();
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    protocol: 'AG-UI',
    version: '1.0.0',
    endpoints: {
      'ag-ui-chat': '/api/agui-chat',
      'legacy-converter': '/api/legacy-to-agui',
    },
  });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 AG-UI兼容服务器启动在端口 ${PORT}`);
  console.log(`📋 健康检查: http://localhost:${PORT}/health`);
  console.log(`💬 AG-UI聊天: POST http://localhost:${PORT}/api/agui-chat`);
  console.log(`🔄 格式转换: POST http://localhost:${PORT}/api/legacy-to-agui`);
});

module.exports = app;
