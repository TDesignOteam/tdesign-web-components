---
title: Chatbot 智能聊天
description: 最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础使用

{{ basic }}

### 输入框

{{ input }}

### markdown渲染

{{ markdown }}

### 自定义chat渲染

{{ customRender }}

### 自定义markdown渲染

{{ customMDRender }}

### 自定义item渲染

{{ customRenderItem }}

## API

## Chatbot Props

### 基础属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| clearHistory | Boolean | false | 是否清除聊天历史记录 |
| layout | String | 'both' | 布局方式，可选值：'both'、'single' |
| autoSendPrompt | Object/String | '' | 配置后会自动触发提问 |
| reverse | Boolean | false | 是否反转消息显示顺序 |
| defaultMessages | ChatMessagesData[] | - | 初始化的聊天消息数组 |
| messageProps | `{ ModelRoleEnum: TdChatMessageProps }` | - | 消息角色配置，它是一个键值对对象，键为角色类型`ModelRoleEnum`（`assistant`/`user`/`system`），值为对应角色的消息配置 `TdChatMessageProps` |
| senderProps | TdChatSenderProps | - | 是聊天输入框组件的属性配置，用于控制输入框的行为和外观，详细见`ChatSender组件` |
| chatServiceConfig | ChatServiceConfig/() => ChatServiceConfig | - | 聊天服务配置，用于初始化ChatEngine |
| injectCSS | Object | - | 注入的自定义CSS样式 |

### 实例方法
| 方法名            | 类型                         | 说明                                                                 |
|--------------------|-------------------------------|--------------------------------------------------------------------|
| sendUserMessage    | `(params: ChatRequestParams) => Promise<void>`  | 发送用户消息并自动清空附件，返回Promise等待操作完成          |
| sendSystemMessage  | `(msg: string) => void`                  | 发送系统通知类消息                     |
| abortChat          | 无                            | 中止当前进行中的聊天请求，返回Promise等待操作完成                      |
| addPrompt          | `(prompt: string) => void`     | 预填充输入框内容并自动聚焦到输入域                                     |
| scrollToBottom     | 无                            | 将消息列表滚动到底部，适用于有新消息时自动定位                          |


### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `message_change` | `state` | 消息列表发生变化时触发 |
| `chat_submit` | `requestParams` | 提交聊天内容时触发 |
| `chat_stop` | - | 停止聊天时触发 |

### 插槽(Slot)

| 插槽名 | 说明 |
|--------|------|
| `sender-header` | 输入框头部内容 |
| `sender-inner-header` | 输入框边框内头部内容 |
| `sender-footer-prefix` | 输入框底部左侧内容 |
| `sender-actions` | 输入框操作按钮 |
| `[message-id]` | 特定消息ID的自定义内容 |

## 内置对象属性

### TdChatMessageProps角色配置属性

| 属性名 | 类型 | 说明 |
|--------|------|------|
| actions | `TdChatMessageAction[]` \| `Function` \| `boolean` | 消息操作按钮配置，可以是预设数组、生成函数或布尔值(是否显示) |
| handleActions | `Record<TdChatMessageActionName, Function>` | 操作按钮回调函数 |
| animation | `skeleton/moving/gradient/circle` | 动画效果 |
| name | `string` \| `TNode` | 作者名称或自定义渲染节点 |
| avatar | `string` \| `TNode` | 头像URL或自定义渲染节点 |
| datetime | `string` \| `TNode` | 时间显示或自定义渲染节点 |
| role | `ChatMessageRole` | 消息角色类型 |
| variant | `'base'` \| `'text'` \| `'outline'` | 消息气泡样式变体 |
| placement | `'left'` \| `'right'` | 消息气泡位置 |
| chatContentProps | `{[key in ChatContentType]?: {}}` | 可以针对不同内容类型进行定制化配置。ContentType类型有`text`、`markdown`、`search`、`thinking`、`suggestion`，|
| onMessageChange | `(e: CustomEvent<ChatMessagesData[]>) => void` | 消息更新时触发 |

### ChatServiceConfig属性

| 属性名 | 类型 | 说明 |
|--------|------|------|
| endpoint | string | 聊天服务的API端点URL |
| stream | boolean| 是否使用流式传输 |
| retryInterval | number| 重试间隔时间(毫秒) |
| maxRetries | number | 最大重试次数 |
| onRequest | `(params: ChatRequestParams) => RequestInit \| Promise<RequestInit>` | 请求前的回调，可修改请求参数 |
| onMessage | `(chunk: SSEChunkData) => AIMessageContent \| null` | 处理流式消息的回调 |
| onComplete | `(isAborted: boolean, params: RequestInit, result?: any) => void` | 请求完成时的回调 |
| onAbort | `() => Promise<void>` | 中止请求时的回调 |
| onError | `(err: Error \| Response) => void` | 错误处理回调 |

### injectCSS属性说明

| 属性名 | 类型 | 说明 |
|--------|------|------|
| ChatSender | string | 应用于聊天输入框组件的自定义 CSS 样式 |
| chatList | string | 应用于聊天列表组件的自定义 CSS 样式 |
| chatItem | string | 应用于单个聊天消息项的自定义 CSS 样式 |

### ChatMessagesData 属性说明

`ChatMessagesData` 是聊天消息的基础类型，它是一个联合类型，包含三种不同角色的消息类型。 基础结构：

```typescript
type ChatMessagesData = UserMessage | AIMessage | SystemMessage;
```

## 角色消息类型

### 公共基础属性 (ChatBaseMessage)

所有消息类型都继承自 `ChatBaseMessage`，包含以下公共属性：

| 属性名 | 类型 | 说明 |
|--------|------|------|
| id | string | 消息唯一标识符 |
| status | `ChatMessageStatus` | 消息状态：'pending'(等待中)、'streaming'(流式传输中)、'complete'(完成)、'stop'(停止)、'error'(错误) |
| datetime | string | 消息时间戳 (ISO 8601 格式) |
| ext | any | 扩展数据，可存放自定义业务数据 |

### 1. SystemMessage (系统消息)

```typescript
interface SystemMessage extends ChatBaseMessage {
  role: 'system';  // 固定为'system'
  content: TextContent[];  // 仅支持纯文本内容
}
```

### 2. UserMessage (用户消息)

```typescript
interface UserMessage extends ChatBaseMessage {
  role: 'user';  // 固定为'user'
  content: UserMessageContent[];  // 消息内容数组
}
```

**UserMessageContent 内容类型**：
- `TextContent`: 纯文本内容
- `AttachmentContent`: 附件内容

### 3. AIMessage (AI助手消息)

```typescript
interface AIMessage extends ChatBaseMessage {
  role: 'assistant';  // 固定为'assistant'
  content: AIMessageContent[];  // 消息内容数组
  comment?: 'good' | 'bad';  // 用户反馈：'good'(点赞)、'bad'(点踩)
}
```

## AI消息内容分类说明
**AIMessageContent 内容类型**：
- `TextContent`: 纯文本内容
- `MarkdownContent`: Markdown格式内容
- `ThinkingContent`: 思考中状态内容
- `ImageContent`: 图片内容
- `SearchContent`: 搜索结果内容
- `SuggestionContent`: 建议内容

### TextContent (文本内容)

```typescript
interface TextContent {
  type: 'text';  // 固定为'text'
  data: string;  // 文本内容
  status?: ChatMessageStatus;  // 内容状态
  id?: string;  // 内容ID
}
```

### AttachmentContent (附件内容)

```typescript
interface AttachmentContent {
  type: 'attachment';  // 固定为'attachment'
  data: AttachmentItem[];  // 附件项数组
  status?: ChatMessageStatus;  // 内容状态
  id?: string;  // 内容ID
}

interface AttachmentItem {
  fileType: AttachmentType;  // 文件类型：'image'|'video'|'audio'|'pdf'|'doc'|'ppt'|'txt'
  name: string;  // 文件名
  url: string;  // 文件URL
  size: number;  // 文件大小(字节)
  isReference?: boolean;  // 是否是引用文件
  width?: number;  // 图片/视频宽度(像素)
  height?: number;  // 图片/视频高度(像素)
  metadata?: Record<string, any>;  // 元数据
}
```
