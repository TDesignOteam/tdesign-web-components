---
title: FileCard 文件缩略卡片
description: 文件缩略卡片。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础使用

{{ base }}

### 关闭事件

{{ close }}

## API

### Filecard Props

| 名称        | 类型                                         | 默认值   | 说明             | 必传 |
| ----------- | -------------------------------------------- | -------- | ---------------- | ---- |
| item        | `TdAttachmentItem`                           | -        | 附件数据         | Y    |
| removable   | Boolean                                      | `true`   | 是否显示删除按钮 | N    |
| disabled    | Boolean                                      | `false`  | 是否禁用         | N    |
| imageViewer | Boolean                                      | `true`   | 是否启用图片预览 | N    |
| cardType    | `'file' \| 'image'`                          | `'file'` | 卡片展示类型     | N    |
| onRemove    | `(e: CustomEvent<TdAttachmentItem>) => void` | -        | 移除附件时触发   | N    |
| onFileClick | `(e: CustomEvent<TdAttachmentItem>) => void` | -        | 点击附件时触发   | N    |

## TdAttachmentItem 类型说明

| 名称        | 类型             | 默认值 | 说明                                   | 必传 |
| ----------- | ---------------- | ------ | -------------------------------------- | ---- |
| description | String           | -      | 文件描述信息                           | N    |
| extension   | String           | -      | 文件扩展名                             | N    |
| key         | String           | -      | 附件唯一标识                           | N    |
| fileType    | `AttachmentType` | -      | 聊天消息中的附件类型                   | N    |
| (继承属性)  | `UploadFile`     | -      | 继承 tdesign-common 的共享上传文件类型 | N    |

`UploadFile` 的基础字段由 tdesign-common 统一维护。上传状态为 `success`、`fail`、`progress` 或 `waiting`；`TdAttachmentItem.fileType` 则描述聊天消息协议中的文件类别，两者语义不同。
