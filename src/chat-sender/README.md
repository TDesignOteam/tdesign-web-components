---
title: ChatSender 聊天输入框
description: xxx
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础使用

{{ basic }}

### 附件发送

{{ attachment }}

### 自定义区域

{{ custom }}

## API

### Chatbot Props

## 基础属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `placeholder` | `string` | - | 输入框占位文本 |
| `disabled` | `boolean` | `false` | 是否禁用整个输入组件 |
| `value` | `string` | - | 输入框当前值（受控模式） |
| `defaultValue` | `string` | - | 输入框默认值（非受控模式） |
| `loading` | `boolean` | `false` | 是否加载中 |
| `autosize` | `boolean \| { minRows?: number; maxRows?: number }` | `{ minRows: 2 }` | 高度自动撑开 |

## 操作按钮配置

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `actions` | `TdChatSenderAction[]` \| `Function` \| `boolean` | 操作按钮配置： - 数组：自定义操作按钮列表 - 函数：(preset) => 操作按钮数组 - 布尔值：是否显示默认操作按钮 |

## 透传属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `attachmentsProps` | `TdAttachmentsProps` | `{ items: [], overflow: 'scrollX' }` | 附件列表配置属性 |
| `textareaProps` | `Partial<TdTextareaProps>` | `{}` | 文本输入框配置属性 |
| `uploadProps` | `Omit<JSX.HTMLAttributes, 'onChange' \| 'ref' \| 'type' \| 'hidden'>` | - | 文件上传输入框的HTML属性 |

## 事件回调

| 事件名 | 参数类型 | 说明 |
|--------|----------|------|
| `onSend` | `(e: CustomEvent<TdChatSenderSend>) => void` | 点击发送按钮时触发 |
| `onStop` | `(e: CustomEvent<string>) => void` | 点击停止按钮时触发 |
| `onChange` | `(e: CustomEvent<string>) => void` | 输入内容变化时触发 |
| `onFileSelect` | `(e: CustomEvent<File[]>) => Promise<TdAttachmentItem[]>` | 选择文件时触发 |
| `onFileRemove` | `(e: CustomEvent<File[]>) => Promise<TdAttachmentItem[]>` | 移除文件时触发 |

## Ref

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `focus` | `(option?: { preventScroll?: boolean; }) => void` | - | 获取焦点 |
| `blur` | `() => void` | - | 取消焦点 |
