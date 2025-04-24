---
title: ChatMessage 对话消息内容
description: xxx
isComponent: true
usage: { title: '', description: '' }
spline: base
---

## 消息体样式
{{ style }}

## 消息内容

### markdown内容

{{ markdown }}

### 思考内容

{{ thinking }}

### 推荐Prompt

{{ suggestion }}

### 搜索内容

{{ search }}

### 图片内容

{{ image }}

### 附件内容
{{ attachment }}

### 自定义内容
{{ custom }}


### 操作组

{{ actions }}

## API

### ChatItem Props

## 基础属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `placeholder` | `string` | - | 输入框占位文本 |
| `disabled` | `boolean` | `false` | 是否禁用整个输入组件 |
| `value` | `string` | - | 输入框当前值（受控模式） |
| `defaultValue` | `string` | - | 输入框默认值（非受控模式） |
| `status` | `ChatStatus` | `'idle'` | 聊天状态，可选值：'idle'(空闲)、'pending'(等待中)、'streaming'(流式传输中)、'complete'(完成)、'stop'(停止)、'error'(错误) |

## 操作按钮配置

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `actions` | `TdChatSenderAction[]` \| `Function` \| `boolean` | 操作按钮配置： - 数组：自定义操作按钮列表 - 函数：(preset) => 操作按钮数组 - 布尔值：是否显示默认操作按钮 |

## 透传属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `attachmentsProps` | `TdAttachmentsProps` | `{ items: [], overflow: 'scrollX' }` | 附件列表配置属性 |
| `textareaProps` | `Partial<TdTextareaProps>` | `{ autosize: { minRows: 2 } }` | 文本输入框配置属性 |
| `uploadProps` | `Omit<JSX.HTMLAttributes, 'onChange' \| 'ref' \| 'type' \| 'hidden'>` | - | 文件上传输入框的HTML属性 |

## 事件回调

| 事件名 | 参数类型 | 说明 |
|--------|----------|------|
| `onSend` | `CustomEvent<TdChatSenderSend>` | 点击发送按钮时触发 |
| `onStop` | `(value: string, context: { e: MouseEvent })` | 点击停止按钮时触发 |
| `onChange` | `(value: string, context: { e: InputEvent \| MouseEvent \| KeyboardEvent })` | 输入内容变化时触发 |
| `onBlur` | `(value: string, context: { e: FocusEvent })` | 输入框失去焦点时触发 |
| `onFocus` | `(value: string, context: { e: FocusEvent })` | 输入框获得焦点时触发 |
| `onFileSelect` | `(files: File[]) => Promise<Attachment[]>` | 选择文件时触发 |
| `onFileRemove` | `(files: File[]) => Promise<Attachment[]>` | 移除文件时触发 |
