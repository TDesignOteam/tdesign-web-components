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

### Chatbot Props

## 基础属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `clearHistory` | Boolean | `false` | 是否清除聊天历史记录 |
| `layout` | String | `'both'` | 布局方式，可选值：'both'(聊天列表和输入框同时显示)、'single'(仅显示聊天列表或输入框) |
| `autoSendPrompt` | Object/String | `''` | 自动发送的提示内容 |
| `reverse` | Boolean | `false` | 是否反转消息显示顺序 |
| `messages` | `Array<ChatMessage>` | - | 初始化的聊天消息数组 |
| `messageProps` | `{ ModelRoleEnum: TdChatItemProps }` | - | 消息角色配置，它是一个键值对对象，键为角色类型`ModelRoleEnum`（`assistant`/`user`/`system`），值为对应角色的消息配置 `TdChatItemProps` |
| `senderProps` | TdChatInputProps | - | 是聊天输入框组件的属性配置，用于控制输入框的行为和外观，包含`onSend`、`onFileSelect`等回调函数 |
| `chatServiceConfig` | ChatServiceConfig/() => ChatServiceConfig | - | 聊天服务配置，用于初始化ChatEngine |
| `injectCSS` | Object | - | 注入的自定义CSS样式 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `message_change` | `state` | 消息列表发生变化时触发 |
| `chat_submit` | `requestParams` | 提交聊天内容时触发 |
| `chat_stop` | - | 停止聊天时触发 |

## 插槽(Slot)

| 插槽名 | 说明 |
|--------|------|
| `input-header` | 输入框头部内容 |
| `input-footer-left` | 输入框底部左侧内容 |
| `input-actions` | 输入框操作按钮 |
| `input-sender` | 输入框发送按钮区域 |
| `[message-id]` | 特定消息ID的自定义内容 |


## TdChatItemProps角色配置属性

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `actions` | `TdChatItemAction[]` \| `Function` \| `boolean` | 消息操作按钮配置，可以是预设数组、生成函数或布尔值(是否显示) |
| `onActions` | `Record<TdChatItemActionName, Function>` | 操作按钮回调函数 |
| `name` | `string` \| `TNode` | 作者名称或自定义渲染节点 |
| `avatar` | `string` \| `TNode` | 头像URL或自定义渲染节点 |
| `datetime` | `string` \| `TNode` | 时间显示或自定义渲染节点 |
| `role` | `MessageRole` | 消息角色类型 |
| `variant` | `'base'` \| `'text'` \| `'outline'` | 消息气泡样式变体 |
| `placement` | `'left'` \| `'right'` | 消息气泡位置 |
| `chatContentProps` | `{[key in ContentType]?: {}}` | 可以针对不同内容类型进行定制化配置。ContentType类型有`text`、`markdown`、`search`、`thinking`、`suggestion`，|
| `customRenderConfig` | `TdChatCustomRenderConfig` | 自定义消息渲染配置 |

## TdChatInputProps属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `placeholder` | `string` | - | 输入框占位文本 |
| `disabled` | `boolean` | `false` | 是否禁用输入框 |
| `value` | `string` | - | 输入框当前值（受控属性） |
| `defaultValue` | `string` | - | 输入框默认值（非受控属性） |
| `status` | `ChatStatus` | - | 聊天状态，控制生成/停止按钮的显示 |
| `allowStop` | `boolean` | - | 生成状态下是否允许停止操作 |
| `actions` | `TdChatInputAction[]` \| `Function` \| `boolean` | 操作按钮配置，可以是数组、生成函数或布尔值 |
| `attachmentsProps` | `TdAttachmentsProps` | 附件列表的配置属性 |
| `textareaProps` | `Partial<TdTextareaProps>` | 文本输入框的配置属性 |
| `uploadProps` | `Omit<JSX.HTMLAttributes, 'onChange' \| 'ref' \| 'type' \| 'hidden'>` | 文件上传的配置属性 |
| `onSend` | `CustomEvent<TdChatInputSend>` | 发送消息时触发 |
| `onStop` | `(value: string, context: { e: MouseEvent })` | 停止生成时触发 |
| `onChange` | `(value: string, context: { e: InputEvent \| MouseEvent \| KeyboardEvent })` | 输入内容变化时触发 |
| `onBlur` | `(value: string, context: { e: FocusEvent })` | 输入框失去焦点时触发 |
| `onFocus` | `(value: string, context: { e: FocusEvent })` | 输入框获得焦点时触发 |
| `onFileSelect` | `(files: File[]) => Promise<Attachment[]>` | 选择文件时触发 |
| `onFileRemove` | `(files: File[]) => Promise<Attachment[]>` | 移除文件时触发 |

## ChatServiceConfig属性

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `endpoint` | `string` | 聊天服务的API端点URL |
| `stream` | `boolean` | 是否使用流式传输 |
| `retryInterval` | `number` | 重试间隔时间(毫秒) |
| `maxRetries` | `number` | 最大重试次数 |
| `onRequest` | `(params: RequestParams) => RequestInit` | 请求前的回调，可修改请求参数 |
| `onMessage` | `(chunk: SSEChunkData) => AIMessageContent \| null` | 处理流式消息的回调 |
| `onComplete` | `(isAborted: boolean, params: RequestInit, result?: any) => void` | 请求完成时的回调 |
| `onAbort` | `() => Promise<void>` | 中止请求时的回调 |
| `onError` | `(err: Error \| Response) => void` | 错误处理回调 |

## injectCSS属性说明

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `chatInput` | `string` | 应用于聊天输入框组件的自定义 CSS 样式 |
| `chatList` | `string` | 应用于聊天列表组件的自定义 CSS 样式 |
| `chatItem` | `string` | 应用于单个聊天消息项的自定义 CSS 样式 |
