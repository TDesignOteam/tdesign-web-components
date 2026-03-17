---
title: ChatSender 聊天输入框
description: 用于构建智能对话场景下的输入框组件
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

### 自定义事件（CustomEvent 格式）

{{ event-custom }}

## API

### ChatSender Props

## 基础属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `placeholder` | `string` | - | 输入框占位文本 |
| `disabled` | `boolean` | `false` | 是否禁用整个输入组件 |
| `value` | `string` | - | 输入框当前值（受控模式） |
| `defaultValue` | `string` | - | 输入框默认值（非受控模式） |
| `loading` | `boolean` | `false` | 是否加载中 |
| `autosize` | `boolean \| { minRows?: number; maxRows?: number }` | `{ minRows: 2 }` | 高度自动撑开 |
| `sendBtnDisabled` | `boolean \| ((inputValue: string) => boolean)` | - | 禁用发送按钮，支持布尔值或函数形式。默认输入为空时禁用 |
| `actions` | `TdChatSenderActionName[]` \| `TdChatSenderAction[]` \| `Function` \| `boolean` | - | 操作按钮配置：简单数组 `['uploadImage', 'uploadAttachment']`、完整对象数组、函数处理预设按钮、布尔值控制显示 |
| `suffix` | `string` \| `TNode` \| `Function` | - | 右侧区域内容。支持字符串、渲染函数 |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| `header` | 输入框外标题区域扩展 |
| `inner-header` | 输入框内标题区域扩展 |
| `input-prefix` | 输入框前方区域 |
| `footer-prefix` | 输入框左下角区域扩展 |
| `suffix` | 输入框右下角区域扩展 |

## 透传属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `attachmentsProps` | `TdAttachmentsProps` | `{ items: [], overflow: 'scrollX' }` | 附件列表配置属性 |
| `textareaProps` | `Partial<TdTextareaProps>` | `{}` | 文本输入框配置属性 |
| `uploadProps` | `Omit<JSX.HTMLAttributes, 'onChange' \| 'ref' \| 'type' \| 'hidden'>` | - | 文件上传输入框的HTML属性 |

## 事件回调

| 事件名 | 参数类型 | 说明 |
|--------|----------|------|
| `onSend` | `(e: CustomEvent<{ value: string; attachments?: TdAttachmentItem[]; e: MouseEvent \| KeyboardEvent }>) => void` | 点击发送按钮时触发 |
| `onStop` | `(e: CustomEvent<{ value: string; e: MouseEvent }>) => void` | 点击停止按钮时触发 |
| `onChange` | `(e: CustomEvent<{ value: string; e: Event }>) => void` | 输入内容变化时触发 |
| `onFocus` | `(e: CustomEvent<{ value: string; e: FocusEvent }>) => void` | 输入框聚焦时触发 |
| `onBlur` | `(e: CustomEvent<{ value: string; e: FocusEvent }>) => void` | 输入框失焦时触发 |
| `onFileSelect` | `(e: CustomEvent<{ files: FileList; name: UploadActionType }>) => void` | 选择文件时触发 |
| `onFileRemove` | `(e: CustomEvent<TdAttachmentItem[]>) => void` | 移除文件时触发 |

## Ref

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `focus` | `(option?: { preventScroll?: boolean; }) => void` | - | 获取焦点 |
| `blur` | `() => void` | - | 取消焦点 |
