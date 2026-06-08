---
title: React 中使用
spline: explain
isGettingStarted: true
---

### 安装

```bash
npm i @tdesign/web-components-chat
```

> `@tdesign/web-components` 会作为 peer dependency 自动安装。

### 使用 Chat 组件

```jsx
import '@tdesign/web-components-chat/chatbot';
import { useRef } from 'react';

const chatServiceConfig = {
  endpoint: '/api/sse',
  stream: true,
  onMessage: (chunk) => ({
    type: 'markdown',
    data: chunk?.data?.msg || '',
  }),
  onRequest: (params) => ({
    headers: { 'Content-Type': 'text/event-stream' },
    body: JSON.stringify({ question: params.prompt }),
  }),
};

const messageProps = (msg) => {
  if (msg.role === 'user') {
    return { variant: 'base' };
  }
  if (msg.role === 'assistant') {
    return {
      variant: 'outline',
      actions: ['copy', 'good', 'bad'],
    };
  }
};

const App = () => {
  const chatRef = useRef(null);

  return (
    <t-chatbot
      ref={chatRef}
      style={{ display: 'block', height: '80vh' }}
      chatServiceConfig={chatServiceConfig}
      messageProps={messageProps}
      senderProps={{ placeholder: '请输入问题' }}
    />
  );
};

export default App;
```

### 注意

props 的 key 需要由 `camelCase` 写法，换为 `hyphenate`，例如 `chatServiceConfig` 在使用时要设置为 `chat-service-config`（React JSX 中可直接使用 camelCase）
