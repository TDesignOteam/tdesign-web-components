# ChatMessage 组件新 API 使用示例

## 新的 API 使用方式（推荐）

```tsx
// 直接传入 role、content、status 属性
<t-chat-item
  role="assistant"
  content={[
    {
      type: 'text',
      data: '这是一条AI回复消息'
    }
  ]}
  status="complete"
  id="msg-001"
  name="AI助手"
  avatar="/avatar.png"
  datetime="2024-01-01 12:00:00"
/>

// 用户消息示例
<t-chat-item
  role="user"
  content={[
    {
      type: 'text',
      data: '用户发送的消息内容'
    }
  ]}
  status="complete"
  id="msg-002"
  name="用户"
  placement="right"
/>
```

## 兼容旧版本 API

```tsx
// 仍然支持通过 message 属性传入完整消息对象
<t-chat-item
  message={{
    id: 'msg-001',
    role: 'assistant',
    content: [
      {
        type: 'text',
        data: '这是一条AI回复消息'
      }
    ],
    status: 'complete'
  }}
  name="AI助手"
  avatar="/avatar.png"
/>
```

## 优先级说明

当同时传入新旧两种方式的属性时，新的直接属性优先级更高：

```tsx
<t-chat-item
  // 新属性（优先级高）
  role="user"
  content={[{ type: 'text', data: '新的消息内容' }]}
  status="complete"
  
  // 旧属性（优先级低，会被忽略）
  message={{
    role: 'assistant',
    content: [{ type: 'text', data: '旧的消息内容' }],
    status: 'pending'
  }}
/>
```

在上面的例子中，组件会使用 `role="user"`、新的消息内容和 `status="complete"`，而忽略 `message` 属性中的值。

## 类型定义

```typescript
interface TdChatMessageProps {
  // 新增的直接属性
  role?: ChatMessageRole;           // 'user' | 'assistant' | 'system'
  content?: AIMessageContent[] | UserMessageContent[];
  status?: ChatMessageStatus;       // 'pending' | 'streaming' | 'complete' | 'stop' | 'error'
  id?: string;
  
  // 兼容属性（优先级低）
  message?: ChatMessagesData;
  
  // 其他属性保持不变
  name?: string | TNode;
  avatar?: string | TNode;
  datetime?: string | TNode;
  variant?: TdChatMessageVariant;
  placement?: 'left' | 'right';
  // ...
}