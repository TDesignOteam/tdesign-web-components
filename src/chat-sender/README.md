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

| 属性名 | 类型 | 默认值 | 说明 | 必传 |
| :--------------- | :-------------------- | :------------------- | :---------------------------------------------------- | :--- |
| actions | [TdChatSenderActionName](#tdchatsenderactionname)[] / [TdChatSenderAction](#tdchatsenderaction)[] / Function / TNode / Boolean | `['send']` | 操作按钮配置 | N |
| attachmentsProps | [TdAttachmentsProps](#tdattachmentsprops) | `{ items: []`<br/>`overflow: 'scrollX' }` | 附件列表配置属性，透传 Attachments 组件 | N |
| autosize | Boolean / `{ minRows?: number; maxRows?: number }` | `{ minRows: 2 }` | 高度自动撑开，配置项 `{ minRows, maxRows }` | N |
| defaultValue | String | - | 输入框的默认值，非受控模式 | N |
| disabled | Boolean | `false` | 是否禁用输入框 | N |
| fileUploadProps | [TdChatSenderUploadProps](#tdchatsenderuploadprops) | - | 文件上传配置，优先级高于 uploadProps | N |
| imageUploadProps | [TdChatSenderUploadProps](#tdchatsenderuploadprops) | `{ accept: 'image/*' }` | 图片上传配置，优先级高于 uploadProps | N |
| loading | Boolean | `false` | 发送按钮是否处于加载状态 | N |
| placeholder | String | - | 输入框默认文案 | N |
| sendBtnDisabled | Boolean / `(inputValue: string) => boolean` | - | 禁用发送按钮，默认输入为空时禁用 | N |
| textareaProps | [TdTextareaProps](#tdtextareaprops) | - | 透传 Textarea 组件属性 | N |
| uploadProps | [TdChatSenderUploadProps](#tdchatsenderuploadprops) | - | **已废弃**，请使用 imageUploadProps 和 fileUploadProps 替代 | N |
| value | String | - | 输入框的值，支持双向绑定 | N |


### ChatSender Events

| 名称       | 参数                                                         | 描述                   |
| :--------- | :----------------------------------------------------------- | :--------------------- |
| blur       | `(e: CustomEvent<string>)`                                   | 输入框失焦时触发       |
| change     | `(e: CustomEvent<string>)`                                   | 输入框值发生变化时触发 |
| fileRemove | `(e: CustomEvent<[TdAttachmentItem](#tdattachmentitem)>)`  | 移除文件时触发，参数为被删除的文件项 |
| fileSelect | `(e: CustomEvent<[TdAttachmentItem](#tdattachmentitem)[]>)` | 选择文件时触发，返回新选择的文件列表 |
| focus      | `(e: CustomEvent<string>)`                                   | 输入框聚焦时触发       |
| send       | `(e: CustomEvent<[TdChatSenderParams](#tdchatsenderparams)>)`  | 点击消息发送时触发     |
| stop       | `(e: CustomEvent<string>)`                                   | 点击消息终止时触发     |

### ChatSender Slots

| 名称          | 说明                 |
| :------------ | :------------------- |
| actions       | 输入框右下角区域扩展 |
| footer-prefix | 输入框左下角区域扩展 |
| header        | 输入框外标题区域扩展 |
| inner-header  | 输入框内标题区域扩展 |
| input-prefix  | 输入框前方区域       |

### ChatSender Ref

| 名称        | 参数                       | 说明             |
| :---------- | :------------------------- | :--------------- |
| blur        | -                          | 取消焦点         |
| focus       | `(options?: FocusOptions)`   | 获取焦点         |
| selectFile  | -                          | 触发文件选择     |
| selectImage | -                          | 触发图片选择     |

### 类型定义

#### TdChatSenderParams

发送消息时的参数结构。

| 名称        | 类型                                          | 说明       |
| :---------- | :-------------------------------------------- | :--------- |
| value       | String                                        | 输入框值   |
| attachments | [TdAttachmentItem](#tdattachmentitem)[]       | 附件列表   |

#### TdChatSenderActionName

预设按钮名称，类型：`'uploadImage' | 'uploadAttachment' | 'send'`

| 名称               | 说明         |
| :----------------- | :----------- |
| 'send'             | 发送按钮     |
| 'uploadAttachment' | 上传附件按钮 |
| 'uploadImage'      | 上传图片按钮 |

#### TdChatSenderAction

自定义操作按钮配置。

| 名称   | 类型   | 说明           |
| :----- | :----- | :------------- |
| name   | String | 按钮唯一标识   |
| render | TNode  | 渲染内容       |

#### UploadActionType

上传操作类型，类型：`'uploadImage' | 'uploadAttachment'`

#### TdChatSenderUploadProps

上传配置属性。

| 名称     | 类型    | 说明                                   |
| :------- | :------ | :------------------------------------- |
| accept   | String  | 接受的文件类型，如 'image/*' 或 '.jpg,.png' |
| multiple | Boolean | 是否允许多选                           |

#### TdAttachmentItem

附件项数据结构。

| 名称   | 类型                                    | 说明         |
| :----- | :-------------------------------------- | :----------- |
| name   | String                                  | 文件名称     |
| url    | String                                  | 文件地址     |
| size   | Number                                  | 文件大小     |
| type   | String                                  | 文件类型     |
| status | 'success' \| 'error' \| 'uploading'     | 上传状态     |
