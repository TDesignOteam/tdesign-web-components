import express from 'express';
import cors from 'cors';
import { chunks } from './data.js';

const app = express();
app.use(cors());
app.use(express.json()); // 添加JSON解析中间件

// 统一SSE响应头设置
const setSSEHeaders = (res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Encoding': 'none',
  });
};

app.post('/sse/test', (req, res) => {
  res.send('Hello sse!');
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
          content: chunk.content || [],
        })}\n\n`;

      case 'think':
        return `event: message\ndata: ${JSON.stringify({
          type: 'think',
          title: chunk.title,
          content: chunk.content,
        })}\n\n`;
    }
  });

  sendStream(res, messages, 600, req);
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
  let index = 0;
  const timer = setInterval(() => {
    if (index < messages.length) {
      res.write(messages[index]);
      index++;
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SSE Mock Server: http://localhost:${PORT}`);
});
