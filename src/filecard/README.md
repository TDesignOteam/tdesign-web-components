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

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
item |  TdAttachmentItem | false | 附件，同 Upload UploadFile | Y
removable | boolean | true | 是否显示删除按钮 | N
onRemove | (item:  TdAttachmentItem) => void | - | 附件移除时的回调函数 | N
disabled | Boolean | false | 禁用状态 | N
imageViewer | Boolean | true | 图片预览开关 | N

## TdAttachmentItem 类型说明
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
description | String | - | 文件描述信息 | N
extension | String | - | 文件扩展名 | N
(继承属性) | UploadFile | - | 包含 `name`, `size`, `status` 等基础文件属性 | N
