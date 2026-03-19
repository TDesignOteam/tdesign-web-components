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



## API

### ChatSender Props

| 属性名 | 类型 | 默认值 | 说明 | 必传 |
| :--- | :--- | :--- | :--- | :--- |
| actions | String[] / Function / TNode / Boolean | `['send']` | 操作按钮配置，默认仅显示发送按钮。详见下方 `actions` 支持说明 | N |
| attachmentsProps | Object | `{ items: [], overflow: 'scrollX' }` | 附件列表配置属性，透传 `Attachments` 组件 | N |
| autosize | Boolean / Object | `{ minRows: 2 }` | 高度自动撑开，支持 `true` 或配置项 `{ minRows, maxRows }` | N |
| defaultValue | String | - | 输入框的默认值，非受控模式 | N |
| disabled | Boolean | `false` | 是否禁用输入框 | N |
| fileUploadProps | Object | - | 文件上传配置，仅作用于上传附件按钮和 `selectFile`，优先级高于 `uploadProps`。详见 [TdChatSenderUploadProps](#tdchatsenderuploadprops) | N |
| imageUploadProps | Object | `{ accept: 'image/*' }` | 图片上传配置，仅作用于上传图片按钮和 `selectImage`，默认 `accept: 'image/*'`。详见 [TdChatSenderUploadProps](#tdchatsenderuploadprops) | N |
| loading | Boolean | `false` | 发送按钮是否处于加载状态 | N |
| onBlur | Function | - | 输入框失焦事件，TS 类型：`(e: CustomEvent<string>) => void` | N |
| onFocus | Function | - | 输入框聚焦事件，TS 类型：`(e: CustomEvent<string>) => void` | N |
| placeholder | String | - | 输入框默认文案 | N |
| sendBtnDisabled | Boolean / Function | `false` | 禁用发送按钮，支持布尔值或函数 `(inputValue: string) => boolean`；输入为空时发送按钮始终禁用 | N |
| textareaProps | Object | - | 透传 `Textarea` 组件属性 | N |
| uploadProps | Object | - | 文件上传配置，仅作用于上传附件按钮和 `selectFile`。**将来会废弃**，建议使用 `fileUploadProps`。详见 [TdChatSenderUploadProps](#tdchatsenderuploadprops) | N |
| value | String | - | 输入框的值，支持双向绑定 | N |

#### actions 支持说明

- **`String[]`**：仅支持预设按钮名称数组，按传入顺序渲染。目前支持：`'uploadImage'`、`'uploadAttachment'`、`'attachment'`、`'send'`
  - `'attachment'` 是 `'uploadAttachment'` 的兼容别名，当前仍可用，但**后续将废弃**
  - 不支持直接传入 `Array<{ name, render }>` 作为顶层 `actions` 值
- **`Function`**：签名为 `(preset) => Array<{ name: string; render: TNode }>`，其中 `preset` 为全部预设按钮列表，可用于筛选、重排或插入自定义渲染项
- **`TNode`**：完全自定义整个操作区内容，会直接替换默认按钮区域
- **`Boolean`**：`true` 等价于默认值 `['send']`；`false` 表示不显示操作区

### ChatSender Events

| 名称 | 参数 | 描述 |
| :--- | :--- | :--- |
| change | `(e: CustomEvent<string>)` | 输入框值发生变化时触发，参数为输入值 |
| focus | `(e: CustomEvent<string>)` | 输入框聚焦时触发，参数为输入值 |
| blur | `(e: CustomEvent<string>)` | 输入框失焦时触发，参数为输入值 |
| send | `(e: CustomEvent<{ value: string; attachments?: TdAttachmentItem[] }>)` | 点击消息发送时触发，参数包含 `value`（输入内容）、`attachments`（附件列表） |
| stop | `(e: CustomEvent<string>)` | 点击消息终止时触发，参数为输入值 |
| fileSelect | `(e: CustomEvent<TdAttachmentItem[]>)` | 选择文件时触发，返回新选择的文件列表 |
| fileRemove | `(e: CustomEvent<TdAttachmentItem[]>)` | 移除文件时触发，参数为剩余的文件列表 |

### ChatSender Slots

| 名称 | 说明 |
| :--- |
| header | 输入框外顶部区域 |
| inner-header | 输入框内顶部区域 |
| input-prefix | 输入框前方区域 |
| textarea | 替换默认输入框 |
| footer-prefix | 输入框左下角区域 |
| actions | 输入框右下角区域 |

### ChatSender Methods

| 名称 | 参数 | 说明 |
| :--- | :--- | :--- |
| focus | `(options?: FocusOptions)` | 获取焦点 |
| blur | - | 取消焦点 |
| selectImage | - | 触发图片选择 |
| selectFile | - | 触发文件选择 |

### 类型定义

#### TdChatSenderUploadProps

上传配置属性。

| 名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| accept | String | 接受的文件类型，如 `'image/*'` 或 `'.jpg,.png'` |
| multiple | Boolean | 是否允许多选 |

#### TdAttachmentItem

附件项数据结构。

| 名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| name | String | 文件名称 |
| url | String | 文件地址 |
| size | Number | 文件大小（字节） |
| type | String | 文件 MIME 类型 |
| status | `'success' \| 'error' \| 'uploading'` | 上传状态 |
| raw | File | 原始文件对象 |
