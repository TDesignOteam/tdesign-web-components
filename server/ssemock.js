import cors from 'cors';
import express from 'express';

import { TravelAgentComplete } from './travel-agent/travel-agent-complete-example.js';
import { agentChunks } from './agent.js';
import { aguiChunks, simpleAguiChunks } from './agui-data.js';
import { chunks } from './data.js';
import {
  generateErrorScenarioEvents,
  generateNetworkInterruptionEvents,
  generateTravelPlanningEvents,
  generateUserInteractionEvents,
  TravelAgentMockDataStandard,
} from './travel-agent-mock-data-standard.js';

const app = express();
app.use(cors());
app.use(express.json()); // 添加JSON解析中间件

// 统一SSE响应头设置
const setSSEHeaders = (res) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Encoding': 'none',
  });
};

app.post('/sse/test', (req, res) => {
  res.send('Hello sse!');
});
app.post('/sse/agent', (req, res) => {
  console.log('Received POST body:', req.body); // 打印请求体
  setSSEHeaders(res);

  // 将chunks转换为SSE格式消息
  const messages = agentChunks.map((chunk) => {
    switch (chunk.type) {
      case 'text':
        return `event: message\ndata: ${JSON.stringify({
          type: 'text',
          msg: chunk.msg,
        })}\n\n`;
      case 'agent':
        return `event: ${chunk.type}\ndata: ${JSON.stringify({
          type: 'agent',
          id: chunk.id,
          state: chunk.state,
          content: chunk.content,
        })}\n\n`;
      default:
        return `event: ${chunk.type}\ndata: ${JSON.stringify({
          type: '',
          id: chunk.id,
          content: chunk.content,
        })}\n\n`;
    }
  });

  sendStream(res, messages, 300, req);
});
// 支持POST请求的SSE端点
app.post('/sse/normal', (req, res) => {
  console.log('Received POST body:', req.body); // 打印请求体
  setSSEHeaders(res);

  // 将chunks转换为SSE格式消息
  const messages = chunks.map((chunk) => {
    switch (chunk.type) {
      case 'text':
        return `event: message\ndata: ${JSON.stringify({
          type: 'text',
          msg: chunk.msg,
        })}\n\n`;

      case 'search':
        return `event: message\ndata: ${JSON.stringify({
          type: 'search',
          title: chunk.title,
          content: chunk.content,
        })}\n\n`;

      case 'think':
        return `event: message\ndata: ${JSON.stringify(chunk)}\n\n`;

      case 'image':
        return `event: media\ndata: ${JSON.stringify({
          type: 'image',
          content: chunk.content,
        })}\n\n`;

      case 'weather':
        return `event: custom\ndata: ${JSON.stringify({
          type: 'weather',
          id: chunk.id,
          content: chunk.content,
        })}\n\n`;

      case 'suggestion':
        return `event: suggestion\ndata: ${JSON.stringify({
          type: 'suggestion',
          content: chunk.content,
        })}\n\n`;
      case 'error':
        return `event: error\ndata: ${JSON.stringify({
          type: 'error',
          content: chunk.content,
        })}\n\n`;
      default:
        return `event: ${chunk.type}\ndata: ${chunk.content}\n\n`;
    }
  });

  sendStream(res, messages, 50, req);
});

// AG-UI 标准协议事件流端点
app.post('/sse/agui', (req, res) => {
  console.log('🚀 收到AG-UI请求:', req.body);
  setSSEHeaders(res);

  // 根据请求参数选择使用完整版还是简化版数据
  const useSimple = req.body?.simple === true;
  const selectedChunks = useSimple ? simpleAguiChunks : aguiChunks;

  // 将AG-UI事件转换为SSE格式
  const messages = selectedChunks.map(
    (chunk) =>
      // AG-UI事件直接作为data发送，不需要额外包装
      `data: ${JSON.stringify(chunk)}\n\n`,
  );

  sendStream(res, messages, 200, req);
});

// 存储用户交互状态
const userInteractionStates = new Map();

// 旅游行程规划Agent SSE端点
app.post('/sse/travel-agent', async (req, res) => {
  console.log('🚀 收到旅游行程规划Agent请求:', req.body);
  setSSEHeaders(res);

  const { scenario = 'complete', userRequest } = req.body;
  let events = [];

  try {
    if (scenario === 'complete') {
      // 使用 TravelAgentComplete 类
      const agent = new TravelAgentComplete();

      // 创建事件收集器
      const collectedEvents = [];
      const originalEmit = agent.emit.bind(agent);

      // 重写 emit 方法来收集事件
      agent.emit = (eventType, data) => {
        const event = {
          type: eventType,
          timestamp: Date.now(),
          ...data,
        };
        collectedEvents.push(event);
        return originalEmit(eventType, data);
      };

      // 存储agent实例用于后续交互
      userInteractionStates.set(agent.runId, {
        agent,
        timestamp: Date.now(),
      });

      // 执行旅游规划流程
      await agent.planTrip(
        userRequest || {
          destination: '北京',
          duration: 3,
          budget: 'medium',
          interests: ['历史文化', '美食'],
        },
      );

      events = collectedEvents;
    } else {
      // 使用原有的mock数据生成器
      switch (scenario) {
        case 'error':
          events = generateErrorScenarioEvents();
          break;
        case 'network':
          events = generateNetworkInterruptionEvents();
          break;
        case 'interaction': {
          events = generateUserInteractionEvents();
          // 存储交互状态，用于后续继续处理
          const mockData = new TravelAgentMockDataStandard();
          userInteractionStates.set(mockData.runId, {
            mockData,
            timestamp: Date.now(),
          });
          break;
        }
        default:
          events = generateTravelPlanningEvents();
      }
    }

    // 将AG-UI事件转换为SSE格式
    const messages = events.map((event) => `data: ${JSON.stringify(event)}\n\n`);

    sendStream(res, messages, 300, req);
  } catch (error) {
    console.error('旅游Agent执行错误:', error);

    // 发送错误事件
    const errorEvent = {
      type: 'RUN_ERROR',
      timestamp: Date.now(),
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
    };

    const errorMessage = `data: ${JSON.stringify(errorEvent)}\n\n`;
    res.write(errorMessage);
    res.end();
  }
});

// 用户交互继续端点
app.post('/sse/travel-agent/continue', async (req, res) => {
  console.log('🚀 收到用户交互继续请求:', req.body);
  setSSEHeaders(res);

  const { requestId, userInput } = req.body;

  if (!requestId || !userInput) {
    res.status(400).json({ error: '缺少必要参数' });
    return;
  }

  // 获取之前存储的交互状态
  const state = userInteractionStates.get(requestId);
  if (!state) {
    res.status(404).json({ error: '找不到对应的交互状态' });
    return;
  }

  // 清理过期的状态（5分钟）
  if (Date.now() - state.timestamp > 300000) {
    userInteractionStates.delete(requestId);
    res.status(408).json({ error: '交互状态已过期' });
    return;
  }

  try {
    let events = [];

    if (state.agent) {
      // 使用 TravelAgentComplete 类继续处理
      const { agent } = state;

      // 创建事件收集器
      const collectedEvents = [];
      const originalEmit = agent.emit.bind(agent);

      // 重写 emit 方法来收集事件
      agent.emit = (eventType, data) => {
        const event = {
          type: eventType,
          timestamp: Date.now(),
          ...data,
        };
        collectedEvents.push(event);
        return originalEmit(eventType, data);
      };

      // 继续处理用户输入
      await agent.continueWithUserInput(userInput);

      events = collectedEvents;
    } else {
      // 使用原有的mock数据生成器
      events = state.mockData.generateUserInteractionContinueEvents(userInput);
    }

    // 清理状态
    userInteractionStates.delete(requestId);

    // 将AG-UI事件转换为SSE格式
    const messages = events.map((event) => `data: ${JSON.stringify(event)}\n\n`);

    sendStream(res, messages, 300, req);
  } catch (error) {
    console.error('继续处理错误:', error);

    // 发送错误事件
    const errorEvent = {
      type: 'RUN_ERROR',
      timestamp: Date.now(),
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
    };

    const errorMessage = `data: ${JSON.stringify(errorEvent)}\n\n`;
    res.write(errorMessage);
    res.end();
  }
});

app.post('/fetch/normal', (req, res) => {
  console.log('Received POST body:', req.body); // 打印请求体
  setTimeout(() => {
    res.json({
      code: 200,
      data: `hello, test fetch，${Date.now()}`,
    });
  }, 3000);
});

// 带鉴权的POST请求
app.post('/sse/auth', (req, res) => {
  // 检查授权头
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: '未授权' });
    return;
  }

  setSSEHeaders(res);
});

// 流发送工具函数
function sendStream(res, messages, interval, req) {
  // 首token延迟400ms
  let index = 0;
  setTimeout(() => {
    res.write(': keep-alive\n\n');

    // 第一个消息延迟发送
    const firstTimer = setTimeout(() => {
      if (index < messages.length) {
        res.write(messages[index]);
        index += 1;

        // 后续消息按正常间隔发送
        const timer = setInterval(() => {
          if (index < messages.length) {
            res.write(messages[index]);
            index += 1;
          } else {
            clearInterval(timer);
            res.end();
          }
        }, interval);

        req.on('close', () => {
          clearInterval(timer);
          res.end();
        });
      }
    }, 100); // 首消息延迟1秒

    // 处理连接关闭
    req.on('close', () => {
      clearTimeout(firstTimer);
    });
  }, 1000);
}

// 模拟文件上传接口
app.post('/file/upload', (req, res) => {
  // 模拟延迟
  setTimeout(() => {
    res.json({
      code: 200,
      result: {
        cdnurl: `https://tdesign.gtimg.com/site/avatar.jpg`,
        size: 1024,
        width: 800,
        height: 600,
      },
    });
  }, 300);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SSE Mock Server: http://localhost:${PORT}`);
});
