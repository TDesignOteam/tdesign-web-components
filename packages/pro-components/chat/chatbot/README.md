---
title: Chatbot 智能聊天
description: 提供消息列表、输入框和 ChatEngine 编排能力的完整智能对话组件。
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

### nostream

{{ nostream }}

## API

### Chatbot Props

| 名称                | 类型                                                            | 默认值   | 说明                                                        | 必传 |
| ------------------- | --------------------------------------------------------------- | -------- | ----------------------------------------------------------- | ---- |
| layout              | `'single' \| 'both'`                                            | `'both'` | 单栏或双方对话布局                                          | N    |
| reverse             | Boolean                                                         | `false`  | 是否倒序渲染消息                                            | N    |
| listProps           | `TdChatListProps`                                               | -        | 透传消息列表配置                                            | N    |
| autoSendPrompt      | String                                                          | `''`     | 初始化完成后自动发送的提问                                  | N    |
| defaultMessages     | `ChatMessagesData[]`                                            | `[]`     | 初始消息列表                                                | N    |
| messageProps        | `TdChatMessageConfig \| ((message) => TdChatMessageConfigItem)` | -        | 按角色或按消息配置 ChatMessage                              | N    |
| senderProps         | `TdChatSenderProps`                                             | -        | 透传 ChatSender 配置                                        | N    |
| chatServiceConfig   | `ChatServiceConfigSetter`                                       | -        | ChatEngine 服务配置或配置生成函数                           | N    |
| injectCSS           | `TdChatInjectCSS`                                               | -        | 向 ChatSender、ChatList、ChatMessage 的 Shadow DOM 注入 CSS | N    |
| onMessageChange     | `(e: CustomEvent<ChatMessagesData[]>) => void`                  | -        | 消息列表变化时触发                                          | N    |
| onChatReady         | `(e: CustomEvent<Record<string, never>>) => void`               | -        | ChatEngine 初始化完成时触发                                 | N    |
| onChatAfterSend     | `(e: CustomEvent<ChatRequestParams>) => void`                   | -        | 用户消息发送完成后触发                                      | N    |
| onChatStop          | `(e: CustomEvent<Record<string, never>>) => void`               | -        | 用户点击停止按钮时触发                                      | N    |
| onChatMessageAction | `(e: CustomEvent<TdChatMessageActionEvent>) => void`            | -        | 消息操作按钮触发                                            | N    |

### Chatbot Events

| 名称              | detail                     | 说明                                           |
| ----------------- | -------------------------- | ---------------------------------------------- |
| messageChange     | `ChatMessagesData[]`       | 消息列表变化                                   |
| chatReady         | `Record<string, never>`    | ChatEngine 初始化完成                          |
| chat-after-send   | `ChatRequestParams`        | 用户消息发送完成                               |
| chatStop          | `Record<string, never>`    | 用户点击停止按钮；兼容保留旧事件 `chat_stop`   |
| chatMessageAction | `TdChatMessageActionEvent` | 消息操作；兼容保留旧事件 `chat_message_action` |

### Chatbot Methods and State

| 名称                  | 类型                                            | 说明                     |
| --------------------- | ----------------------------------------------- | ------------------------ |
| sendUserMessage       | `(params: ChatRequestParams) => Promise<void>`  | 发送用户消息             |
| sendSystemMessage     | `(message: string) => void`                     | 发送系统消息             |
| sendAIMessage         | `(options?) => Promise<void>`                   | 手动添加或发送 AI 消息   |
| setMessages           | `(messages, mode?) => void`                     | 替换、前插或追加消息     |
| clearMessages         | `() => void`                                    | 清空消息列表             |
| abortChat             | `() => Promise<void>`                           | 中止当前请求             |
| addPrompt             | `(prompt: string, autoFocus?: boolean) => void` | 填充输入框               |
| scrollList            | `(options?: TdChatListScrollToOptions) => void` | 滚动消息列表             |
| selectFile            | `() => void`                                    | 打开文件选择器           |
| regenerate            | `(keepVersion?: boolean) => Promise<void>`      | 重新生成最后一条 AI 消息 |
| registerMergeStrategy | `<T>(type, handler) => void`                    | 注册自定义内容合并策略   |
| chatMessageValue      | `readonly ChatMessagesData[]`                   | 当前消息列表             |
| chatStatus            | `readonly ChatStatus`                           | 当前聊天状态             |
| senderLoading         | `readonly boolean`                              | 输入框加载状态           |
| isChatEngineReady     | `readonly boolean`                              | ChatEngine 是否就绪      |

### Chatbot Slots

| 名称                          | 说明                     |
| ----------------------------- | ------------------------ |
| sender-header                 | 输入框外顶部区域         |
| sender-inner-header           | 输入框内顶部区域         |
| sender-input-prefix           | 输入框前方区域           |
| sender-textarea               | 替换默认输入框           |
| sender-footer-prefix          | 输入框左下角区域         |
| sender-actions                | 输入框右下角区域         |
| `[message-id]-[content-slot]` | 指定消息内容的自定义插槽 |

### 共享类型

`ChatMessagesData`、`ChatServiceConfigSetter`、`AIMessageContent`、`SSEChunkData` 等协议类型由 `@tdesign/ai-chat-engine` 维护，并由 `@tdesign/web-components-chat/chat-engine` 原样导出。本文档不复制其字段，避免协议升级后产生两套定义。
